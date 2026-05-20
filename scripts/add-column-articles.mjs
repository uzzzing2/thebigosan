/**
 * 칼럼 URL 목록을 받아 각각 PressItem(category='칼럼')으로 추가.
 *  - OG로 제목/이미지 추출
 *  - article:published_time 또는 <time> 태그에서 날짜 추출
 *  - 썸네일 다운로드
 *  - press.ts에 append, 날짜 desc 정렬 후 재기록
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PROJECT = path.join(__dirname, '..')
const PUBLIC_PRESS = path.join(PROJECT, 'public', 'images', 'press')
const OUT_TS = path.join(PROJECT, 'src', 'lib', 'data', 'press.ts')

const COLUMN_URLS = [
  'https://newskms.com/View.aspx?No=4068207',
  'https://www.imaganews.com/news/articleView.html?idxno=11288',
  'https://www.nvp.co.kr/news/articleView.html?idxno=318075',
  'https://www.nvp.co.kr/news/articleView.html?idxno=318090',
  'https://www.nvp.co.kr/news/articleView.html?idxno=318112',
  'https://www.nvp.co.kr/news/articleView.html?idxno=318103',
  'https://www.nvp.co.kr/news/articleView.html?idxno=318167',
  'https://www.nvp.co.kr/news/articleView.html?idxno=318185',
]

await mkdir(PUBLIC_PRESS, { recursive: true })
const { pressItems } = await import(`file:///${OUT_TS.replace(/\\/g, '/')}`)
const existingUrls = new Set()
for (const it of pressItems) for (const m of it.mediaLinks ?? []) if (m.url) existingUrls.add(m.url)

// ── helpers ──
function safeExt(ct, urlPath) {
  if (ct?.includes('jpeg')) return 'jpg'
  if (ct?.includes('png')) return 'png'
  if (ct?.includes('webp')) return 'webp'
  if (ct?.includes('gif')) return 'gif'
  const m = urlPath.match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i)
  if (m) return m[1].toLowerCase() === 'jpeg' ? 'jpg' : m[1].toLowerCase()
  return 'jpg'
}
async function fetchWithTimeout(url, opts = {}, ms = 15000) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal })
  } finally {
    clearTimeout(t)
  }
}
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'

function metaContent(html, key) {
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${key}["']`, 'i'),
  ]
  for (const re of patterns) {
    const m = html.match(re)
    if (m && m[1]) return m[1]
  }
  return null
}

function decodeEntities(s) {
  return s
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&nbsp;', ' ')
}

function parseDate(html) {
  const candidates = [
    metaContent(html, 'article:published_time'),
    metaContent(html, 'og:article:published_time'),
    metaContent(html, 'datePublished'),
  ].filter(Boolean)
  for (const c of candidates) {
    const d = new Date(c)
    if (!isNaN(d.getTime())) {
      return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
    }
  }
  // 한국어 본문에서 흔한 "YYYY-MM-DD HH:MM" 패턴
  const m = html.match(/(20\d{2})[.\-/년 ]?\s*(\d{1,2})[.\-/월 ]?\s*(\d{1,2})[일]?\s*\d{1,2}:\d{2}/)
  if (m) {
    const y = m[1], mo = String(m[2]).padStart(2, '0'), d = String(m[3]).padStart(2, '0')
    return `${y}-${mo}-${d}`
  }
  return new Date().toISOString().slice(0, 10)
}

async function downloadImage(imageUrl, destNoExt) {
  try {
    const res = await fetchWithTimeout(imageUrl, { headers: { 'User-Agent': UA } })
    if (!res.ok) return null
    const ct = res.headers.get('content-type') ?? ''
    const ext = safeExt(ct, imageUrl)
    const buf = Buffer.from(await res.arrayBuffer())
    const finalPath = `${destNoExt}.${ext}`
    await writeFile(finalPath, buf)
    return path.basename(finalPath)
  } catch {
    return null
  }
}

// ── per URL ──
const newItems = []
let seq = 0
for (const url of COLUMN_URLS) {
  if (existingUrls.has(url)) {
    console.log(`  skip dup: ${url}`)
    continue
  }
  process.stdout.write(`  - ${url} … `)
  let html = ''
  let publisher = new URL(url).hostname.replace(/^www\./, '')
  try {
    const res = await fetchWithTimeout(url, { headers: { 'User-Agent': UA } })
    if (!res.ok) {
      console.log(`fetch HTTP ${res.status}`)
      continue
    }
    html = await res.text()
  } catch (e) {
    console.log(`fetch fail: ${e?.code ?? e}`)
    continue
  }

  const ogTitle = metaContent(html, 'og:title')
  const ogImage = metaContent(html, 'og:image') ?? metaContent(html, 'twitter:image')
  const siteName = metaContent(html, 'og:site_name') ?? publisher
  const titleRaw =
    ogTitle ?? html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? '제목 미상'
  const title = decodeEntities(titleRaw).trim()
  const date = parseDate(html)

  const id = `pr_col_${date.replace(/-/g, '')}_${seq.toString().padStart(2, '0')}`
  seq++

  let thumbnailFile = null
  if (ogImage) {
    const abs = new URL(ogImage, url).href
    thumbnailFile = await downloadImage(abs, path.join(PUBLIC_PRESS, id))
  }

  console.log(`✓ "${title.slice(0, 40)}…" date=${date} thumb=${thumbnailFile ?? 'none'}`)

  newItems.push({
    id,
    category: '칼럼',
    title,
    body: `<p>${title}</p><p>출처: ${siteName}</p>`,
    publishedAt: date,
    mediaLinks: [{ name: siteName, url }],
    thumbnail: thumbnailFile ? `/images/press/${thumbnailFile}` : undefined,
  })
}

const allItems = [...pressItems, ...newItems].sort((a, b) =>
  a.publishedAt < b.publishedAt ? 1 : -1,
)

const tsBody = `export type PressCategory = '정책' | '칼럼'

export interface PressItem {
  id: string
  category: PressCategory
  title: string
  body: string
  publishedAt: string
  mediaLinks: { name: string; url: string }[]
  /** Optional thumbnail path under /public/images/press/ */
  thumbnail?: string
}

/** Generated by scripts/build-press-data.mjs / augment-press-data.mjs / add-column-articles.mjs — do not edit by hand. */
export const pressItems: PressItem[] = ${JSON.stringify(allItems, null, 2)}

export function getPressItem(id: string): PressItem | undefined {
  return pressItems.find((p) => p.id === id)
}

export function getAdjacentPress(id: string): {
  prev?: PressItem
  next?: PressItem
} {
  const sorted = [...pressItems].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : -1,
  )
  const idx = sorted.findIndex((p) => p.id === id)
  if (idx === -1) return {}
  return {
    prev: sorted[idx + 1],
    next: sorted[idx - 1],
  }
}

export function formatPressDate(iso: string): string {
  return iso.replace(/-/g, '.')
}
`
await writeFile(OUT_TS, tsBody, 'utf8')
console.log(`\n[col] added ${newItems.length} column items. Total now: ${allItems.length}`)
process.exit(0)
