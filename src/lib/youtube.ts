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
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
        Accept: 'application/atom+xml,application/xml,text/xml,*/*',
      },
      // SSG/ISR: cached at build time, refreshed every 1h.
      next: { revalidate: 3600 },
    })
    if (!res.ok) {
      console.warn('[youtube] feed fetch status', res.status, '→ using static cache')
      return (await loadCachedVideos()).slice(0, n)
    }
    const xml = await res.text()
    const items = parseAtomEntries(xml).slice(0, n)
    if (items.length === 0) {
      console.warn('[youtube] parsed 0 items → using static cache')
      return (await loadCachedVideos()).slice(0, n)
    }
    return items
  } catch (e) {
    console.warn('[youtube] feed fetch failed', (e as Error)?.message ?? e, '→ using static cache')
    return (await loadCachedVideos()).slice(0, n)
  }
}

async function loadCachedVideos(): Promise<YoutubeVideo[]> {
  try {
    const mod = await import('@/lib/data/youtube-cache')
    return mod.YOUTUBE_VIDEOS
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
