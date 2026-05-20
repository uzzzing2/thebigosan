/**
 * 기사 정리.xlsx → src/lib/data/press.ts 생성
 *
 *  Sheet1: 날짜 시리얼 → 그 아래 [publisher, url] 또는 [publisher, title-only] 행이 이어짐
 *  Sheet2: '(완)[MMDD] 제목' 한 줄씩
 *
 * 동작:
 *  1. Sheet1을 날짜별로 그룹핑 → 각 그룹의 articles[] 구성 (URL 있는 것만)
 *  2. Sheet2 제목을 [MMDD] 기준으로 같은 날짜 그룹과 매칭
 *  3. 그룹별로 가장 먼저 나온 article의 URL부터 OG 이미지 시도, 실패시 다음 article
 *  4. 이미지를 /public/images/press/{id}.{ext}로 다운로드
 *  5. src/lib/data/press.ts에 PressItem[]로 출력
 *
 * Usage:
 *   node scripts/build-press-data.mjs
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as XLSX from 'xlsx'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const EXCEL = 'C:\\Users\\user\\Documents\\카카오톡 받은 파일\\기사 정리.xlsx'
const PROJECT = path.join(__dirname, '..')
const PUBLIC_PRESS = path.join(PROJECT, 'public', 'images', 'press')
const OUT_TS = path.join(PROJECT, 'src', 'lib', 'data', 'press.ts')

// ────────────────────────────── helpers ──────────────────────────────

function excelSerialToDate(serial) {
  // Excel 1900 date system. serial 25569 = 1970-01-01 (Unix epoch).
  // Excel has a 1900 leap-year bug — subtract 1 day for dates after 1900-02-28.
  const ms = (serial - 25569) * 86400 * 1000
  const d = new Date(ms)
  const y = d.getUTCFullYear()
  const mo = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${mo}-${day}`
}

function isUrl(s) {
  return typeof s === 'string' && /^https?:\/\//i.test(s.trim())
}

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
    // og:image (multiple variations)
    const ogPatterns = [
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      /<meta[^>]+name=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+property=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    ]
    for (const re of ogPatterns) {
      const m = html.match(re)
      if (m && m[1]) {
        return new URL(m[1], url).href // absolutize
      }
    }
    return null
  } catch (e) {
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

// ─────────────────────────── parse Excel ────────────────────────────

const wb = XLSX.read(await readFile(EXCEL), { type: 'buffer' })

// Sheet1 — articles
const s1 = XLSX.utils.sheet_to_json(wb.Sheets['Sheet1'], { header: 1, defval: '' })

// Parse first row's column header serial as fallback
const headerSerial = typeof s1[0]?.[0] === 'number' ? s1[0][0] : null

const groups = [] // { date: 'YYYY-MM-DD', articles: [{publisher, url}] }
let current = null
let pendingPublisher = null

function isSerial(v) {
  return typeof v === 'number' && v > 40000 && v < 60000
}

// Sheet1: row 0 is the date header (just serial), row 1 onward = mixed publisher/url interleaved with empty separators and integer date markers
const rows = s1.slice(1) // skip top header row
// But headerSerial belongs to the first group; prepend
if (headerSerial) {
  current = { date: excelSerialToDate(headerSerial), articles: [] }
  groups.push(current)
}

for (const row of rows) {
  const cell = row[0]
  if (cell === '' || cell == null) {
    pendingPublisher = null
    continue
  }
  if (isSerial(cell)) {
    current = { date: excelSerialToDate(cell), articles: [] }
    groups.push(current)
    pendingPublisher = null
    continue
  }
  // String cell
  const s = String(cell).trim()
  if (!current) continue
  if (pendingPublisher) {
    // Second of pair — should be URL ideally
    if (isUrl(s)) {
      current.articles.push({ publisher: pendingPublisher, url: s })
    } else {
      // No URL captured; skip article (we only want links per spec)
    }
    pendingPublisher = null
  } else {
    pendingPublisher = s
  }
}

// Drop empty groups
const dateGroups = groups.filter((g) => g.date && g.articles.length > 0)
console.log(`[build-press] Sheet1 groups with URLs: ${dateGroups.length}`)

// Sheet2 — titles by [MMDD]
const s2 = XLSX.utils.sheet_to_json(wb.Sheets['Sheet2'], { header: 1, defval: '' })
const titlesByMMDD = new Map()
// First row is the column header (the very first title); include it
for (const row of s2) {
  const v = String(row[0] ?? '').trim()
  if (!v) continue
  // Match (완)[MMDD] 제목... or [MMDD]제목
  const m = v.match(/\[(\d{4})\]\s*(.+)$/)
  if (!m) continue
  const mmdd = m[1]
  const title = m[2].trim()
  if (!titlesByMMDD.has(mmdd)) titlesByMMDD.set(mmdd, [])
  titlesByMMDD.get(mmdd).push(title)
}
console.log(`[build-press] Sheet2 unique date keys: ${titlesByMMDD.size}`)

// ────────────────────────── compose press items ─────────────────────

await mkdir(PUBLIC_PRESS, { recursive: true })

const items = []
for (let i = 0; i < dateGroups.length; i++) {
  const g = dateGroups[i]
  const mmdd = g.date.slice(5).replace('-', '')
  const titles = titlesByMMDD.get(mmdd) ?? []
  // Pop one title (in order). If multiple groups share a date, allocate sequentially.
  const title = titles.shift() ?? `이권재 후보 활동 (${g.date})`
  const id = `pr_${g.date.replace(/-/g, '')}_${i.toString().padStart(2, '0')}`

  // Try OG image from first article, fallback to subsequent
  let thumbnailFile = null
  for (const a of g.articles) {
    process.stdout.write(`  - ${id} trying ${a.url} … `)
    const ogUrl = await fetchOgImage(a.url)
    if (!ogUrl) {
      console.log('no og')
      continue
    }
    const downloaded = await downloadImage(ogUrl, path.join(PUBLIC_PRESS, id))
    if (downloaded) {
      thumbnailFile = downloaded
      console.log(`✓ ${downloaded}`)
      break
    }
    console.log('dl fail')
  }

  items.push({
    id,
    category: '정책',
    title,
    body: `<p>${title}</p><p>관련 보도 ${g.articles.length}건이 게재되었습니다.</p>`,
    publishedAt: g.date,
    mediaLinks: g.articles.map((a) => ({ name: a.publisher, url: a.url })),
    thumbnail: thumbnailFile ? `/images/press/${thumbnailFile}` : undefined,
  })
}

// Sort newest first
items.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))

// ────────────────────────── write TS file ───────────────────────────

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

/** Generated by scripts/build-press-data.mjs — do not edit by hand. */
export const pressItems: PressItem[] = ${JSON.stringify(items, null, 2)}

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
console.log(`\n[build-press] wrote ${items.length} press items to ${OUT_TS}`)
console.log(`[build-press] thumbnails downloaded to ${PUBLIC_PRESS}`)
process.exit(0)
