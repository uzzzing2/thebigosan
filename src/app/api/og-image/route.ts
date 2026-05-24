import { NextResponse } from 'next/server'

/**
 * Server-side proxy that fetches an article URL and extracts its og:image
 * (or twitter:image) meta tag. Used by /admin/press news import to auto-
 * thumbnail recently-added press items.
 *
 * Query: ?url=<encoded-article-url>
 * Response: { image: string | null }
 */
export async function GET(request: Request) {
  const target = new URL(request.url).searchParams.get('url')
  if (!target) {
    return NextResponse.json({ error: 'missing url' }, { status: 400 })
  }
  try {
    const r = await fetch(target, {
      headers: {
        // Some news sites block default fetch UA; pretend to be a desktop browser.
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      },
      cache: 'no-store',
      redirect: 'follow',
    })
    if (!r.ok) return NextResponse.json({ image: null })
    const html = await r.text()

    const found = extractImageMeta(html, target)
    return NextResponse.json({ image: found })
  } catch (err) {
    return NextResponse.json({ image: null, error: (err as Error).message })
  }
}

function extractImageMeta(html: string, baseUrl: string): string | null {
  const patterns = [
    /<meta\s+[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    /<meta\s+[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
    /<meta\s+[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
    /<meta\s+[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i,
  ]
  for (const re of patterns) {
    const m = html.match(re)
    if (m && m[1]) {
      try {
        return new URL(m[1], baseUrl).toString()
      } catch {
        return m[1]
      }
    }
  }
  return null
}
