/**
 * Fetch latest videos from a YouTube channel via its public Atom feed.
 * No API key required. Cached at the Next.js fetch layer (revalidate 30min).
 */

const CHANNEL_ID = 'UC91I71vJZ--P10G5DG29u5A' // @with5340 — 이권재 오산시장

export interface YoutubeVideo {
  id: string
  title: string
  /** ISO timestamp */
  published: string
  thumbnail: string
  views?: string
  url: string
}

export async function getLatestVideos(n: number = 10): Promise<YoutubeVideo[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      { next: { revalidate: 1800 } },
    )
    if (!res.ok) return []
    const xml = await res.text()
    return parseAtomEntries(xml).slice(0, n)
  } catch {
    return []
  }
}

function parseAtomEntries(xml: string): YoutubeVideo[] {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? []
  return entries.map((entry) => {
    const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? ''
    const rawTitle = entry.match(/<title>([^<]+)<\/title>/)?.[1] ?? ''
    const title = decodeXmlEntities(rawTitle)
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? ''
    const views = entry.match(/views="(\d+)"/)?.[1]
    return {
      id,
      title,
      published,
      thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      views,
      url: `https://www.youtube.com/watch?v=${id}`,
    }
  })
}

function decodeXmlEntities(s: string): string {
  return s
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
}

export function formatVideoDate(iso: string): string {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

export function formatViews(n: string | undefined): string | undefined {
  if (!n) return undefined
  const x = Number(n)
  if (!Number.isFinite(x)) return n
  return x.toLocaleString('ko-KR')
}
