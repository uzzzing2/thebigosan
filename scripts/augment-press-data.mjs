/**
 * public/기사_정리_Sheet2_웹검색결과.xlsx → src/lib/data/press.ts 보강
 *
 * 동작:
 *  1. 기존 press.ts의 pressItems 로드 — 이미 들어간 URL 집합 구성
 *  2. Sheet2 웹검색결과 시트 파싱 (각 row = 1 검증된 기사)
 *  3. URL 중복인 row는 skip
 *  4. row.제목이 기존 item의 title과 같으면 → 그 item에 mediaLink 추가
 *  5. 일치 없으면 → 새 PressItem 생성 (썸네일 다운로드)
 *  6. 같은 날짜 그룹에 같은 새 제목이 또 들어오면 mediaLink로 누적
 *  7. press.ts 재생성
 */

import { readFile, writeFile, mkdir, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as XLSX from 'xlsx'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PROJECT = path.join(__dirname, '..')
const EXCEL = path.join(PROJECT, 'public', '기사_정리_Sheet2_웹검색결과.xlsx')
const PUBLIC_PRESS = path.join(PROJECT, 'public', 'images', 'press')
const OUT_TS = path.join(PROJECT, 'src', 'lib', 'data', 'press.ts')

await mkdir(PUBLIC_PRESS, { recursive: true })

// ── load existing press.ts via dynamic import ──
const { pressItems } = await import(`file:///${OUT_TS.replace(/\\/g, '/')}`)

// existing URL set & title→item index
const urlSet = new Set()
const titleIndex = new Map()
for (const item of pressItems) {
  for (const m of item.mediaLinks ?? []) {
    if (m.url) urlSet.add(m.url.trim())
  }
  titleIndex.set(item.title.trim(), item)
}
console.log(`[augment] existing items=${pressItems.length}  existing URLs=${urlSet.size}`)

// ── helpers (reuse from build-press-data) ──
function safeExt(contentType, urlPath) {
  if (contentType?.includes('jpeg')) return 'jpg'
  if (contentType?.includes('png')) return 'png'
  if (contentType?.includes('webp')) return 'webp'
  if (contentType?.includes('gif')) return 'gif'
  const m = urlPath.match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i)
  if (m) return m[1].toLowerCase() === 'jpeg' ? 'jpg' : m[1].toLowerCase()
  return 'jpg'
}
async function fetchWithTimeout(url, opts = {}, ms = 12000) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal })
  } finally {
    clearTimeout(t)
  }
}
async function fetchOgImage(url) {
  try {
    const res = await fetchWithTimeout(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
      },
    })
    if (!res.ok) return null
    const html = await res.text()
    const ogPatterns = [
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      /<meta[^>]+name=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+property=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    ]
    for (const re of ogPatterns) {
      const m = html.match(re)
      if (m && m[1]) return new URL(m[1], url).href
    }
    return null
  } catch {
    return null
  }
}
async function downloadImage(imageUrl, destNoExt) {
  try {
    const res = await fetchWithTimeout(imageUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 PressBot/1.0' },
    })
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

// ── parse Excel ──
const wb = XLSX.read(await readFile(EXCEL), { type: 'buffer' })
const ws = wb.Sheets['Sheet2 웹검색결과']
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })

// rows 0-3 are intro/headers, data starts at row 4
const dataRows = rows.slice(4).filter((r) => r[0] !== '' && r[6])

console.log(`[augment] Sheet2 data rows: ${dataRows.length}`)

// Group by sheet2 title for new items
const newItemsByTitle = new Map() // title -> { date, articles: [{publisher, url}] }

let skippedDup = 0
let mergedExisting = 0
let queuedNew = 0

for (const r of dataRows) {
  const [_no, sheet2Title, _status, _verifiedTitle, publisher, date, url, _note] = r
  const title = String(sheet2Title).trim()
  const u = String(url).trim()
  if (!u) continue
  if (urlSet.has(u)) {
    skippedDup++
    continue
  }
  urlSet.add(u)

  // Match existing by title
  const existing = titleIndex.get(title)
  if (existing) {
    existing.mediaLinks.push({ name: String(publisher).trim(), url: u })
    mergedExisting++
    continue
  }

  // New item
  if (!newItemsByTitle.has(title)) {
    newItemsByTitle.set(title, { date: String(date).trim(), articles: [] })
  }
  newItemsByTitle.get(title).articles.push({ publisher: String(publisher).trim(), url: u })
  queuedNew++
}

console.log(`[augment] skipped dup URLs: ${skippedDup}`)
console.log(`[augment] merged into existing: ${mergedExisting}`)
console.log(`[augment] new items (rows): ${queuedNew} → unique titles: ${newItemsByTitle.size}`)

// ── build new items with thumbnails ──
const newItems = []
let seq = 0
for (const [title, group] of newItemsByTitle) {
  // Some excel dates come as serial numbers — normalize
  let dateStr = group.date
  if (/^\d+$/.test(dateStr)) {
    const ms = (Number(dateStr) - 25569) * 86400 * 1000
    const d = new Date(ms)
    dateStr = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
  }
  const id = `pr_${dateStr.replace(/-/g, '')}_aug${seq.toString().padStart(2, '0')}`
  seq++

  let thumbnailFile = null
  for (const a of group.articles) {
    process.stdout.write(`  - ${id}  ${a.url} … `)
    const og = await fetchOgImage(a.url)
    if (!og) {
      console.log('no og')
      continue
    }
    const fn = await downloadImage(og, path.join(PUBLIC_PRESS, id))
    if (fn) {
      thumbnailFile = fn
      console.log(`✓ ${fn}`)
      break
    }
    console.log('dl fail')
  }

  newItems.push({
    id,
    category: '정책',
    title,
    body: `<p>${title}</p><p>관련 보도 ${group.articles.length}건이 게재되었습니다.</p>`,
    publishedAt: dateStr,
    mediaLinks: group.articles.map((a) => ({ name: a.publisher, url: a.url })),
    thumbnail: thumbnailFile ? `/images/press/${thumbnailFile}` : undefined,
  })
}

// ── combine and sort ──
const allItems = [...pressItems, ...newItems].sort((a, b) =>
  a.publishedAt < b.publishedAt ? 1 : -1,
)

// ── write press.ts ──
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

/** Generated by scripts/build-press-data.mjs / augment-press-data.mjs — do not edit by hand. */
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
console.log(`\n[augment] total items now: ${allItems.length} (existing ${pressItems.length} + new ${newItems.length})`)
console.log(`[augment] written to ${OUT_TS}`)
process.exit(0)
