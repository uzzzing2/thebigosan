import { NextResponse } from 'next/server'

interface NaverNewsItem {
  title: string
  originallink: string
  link: string
  description: string
  pubDate: string
}

interface NaverNewsResponse {
  lastBuildDate: string
  total: number
  start: number
  display: number
  items: NaverNewsItem[]
}

/**
 * Server-side proxy to Naver News Search API. Keeps the secret out of the
 * client bundle. Used by /admin/press "최근 뉴스 가져오기" feature.
 *
 * Required env vars:
 *   NAVER_CLIENT_ID
 *   NAVER_CLIENT_SECRET
 *
 * Query params:
 *   q       - search keyword (default: "이권재")
 *   display - max items, 1-100 (default: 30)
 *   sort    - "date" | "sim" (default: "date")
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const query = url.searchParams.get('q') || '이권재'
  const display = url.searchParams.get('display') || '30'
  const sort = url.searchParams.get('sort') || 'date'

  const clientId = process.env.NAVER_CLIENT_ID
  const clientSecret = process.env.NAVER_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      {
        error:
          'Naver API credentials not configured. Set NAVER_CLIENT_ID and NAVER_CLIENT_SECRET in .env.local (dev) or as Cloudflare secrets (prod).',
      },
      { status: 500 },
    )
  }

  const apiUrl = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(
    query,
  )}&display=${display}&sort=${sort}`

  try {
    const r = await fetch(apiUrl, {
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
      },
      cache: 'no-store',
    })
    if (!r.ok) {
      const text = await r.text().catch(() => '')
      return NextResponse.json(
        { error: `Naver API error ${r.status}: ${text.slice(0, 200)}` },
        { status: r.status },
      )
    }
    const data = (await r.json()) as NaverNewsResponse
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to fetch Naver news: ${(err as Error).message}` },
      { status: 500 },
    )
  }
}
