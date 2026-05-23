'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  NewspaperIcon,
  PencilSquareIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { Input, Tag } from '@/components/ui'
import { cn } from '@/lib/cn'
import {
  createPress,
  listAllPress,
  migratePressFromStatic,
  setPressPublished,
  type AdminPressItem,
} from '@/lib/firestore/admin'
import { pressItems as staticPress } from '@/lib/data/press'

interface NewsItem {
  title: string
  link: string
  originallink: string
  description: string
  pubDate: string
}

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

const PUBLISHER_MAP: Record<string, string> = {
  'yna.co.kr': '연합뉴스', 'ytn.co.kr': 'YTN', 'chosun.com': '조선일보',
  'joongang.co.kr': '중앙일보', 'donga.com': '동아일보', 'hani.co.kr': '한겨레',
  'khan.co.kr': '경향신문', 'mk.co.kr': '매일경제', 'hankyung.com': '한국경제',
  'sedaily.com': '서울경제', 'asiae.co.kr': '아시아경제', 'newsis.com': '뉴시스',
  'news1.kr': '뉴스1', 'edaily.co.kr': '이데일리', 'mt.co.kr': '머니투데이',
  'fnnews.com': '파이낸셜뉴스', 'kbs.co.kr': 'KBS', 'mbc.co.kr': 'MBC',
  'sbs.co.kr': 'SBS', 'jtbc.co.kr': 'JTBC', 'mbn.co.kr': 'MBN',
  'kgnews.co.kr': '경기신문', 'kyeonggi.com': '경기일보', 'kihoilbo.co.kr': '기호일보',
  'ggtimes.co.kr': '경기타임스', 'ajunews.com': '아주경제', 'osinews.co.kr': '오산인터넷뉴스',
  'pressian.com': '프레시안', 'sportsseoul.com': '스포츠서울',
  'paxetv.com': '팍스경제TV', 'beyondpost.co.kr': '비욘드포스트',
  'jnewstimes.com': '중앙뉴스타임스', 'asiatime.co.kr': '아시아타임즈',
  'joongboo.com': '중부일보', 'newsfreezone.co.kr': '뉴스프리존',
  'kgfnews.com': '한국글로벌뉴스', 'esuwon.net': '수원화성신문',
  'newsis.kr': '뉴시스', 'nvp.co.kr': '뉴스비전e',
}

function extractPublisher(url: string): string {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '').replace(/^m\./, '')
    if (PUBLISHER_MAP[host]) return PUBLISHER_MAP[host]
    // Match by suffix (e.g., n.news.naver.com → news.naver.com → naver.com)
    for (const key of Object.keys(PUBLISHER_MAP)) {
      if (host.endsWith(key)) return PUBLISHER_MAP[key]
    }
    return host.split('.')[0]
  } catch {
    return '언론'
  }
}

function parsePubDate(rfcDate: string): string {
  try {
    const d = new Date(rfcDate)
    if (Number.isNaN(d.getTime())) throw new Error('invalid')
    return d.toISOString().slice(0, 10)
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

export default function AdminPressListPage() {
  const [items, setItems] = useState<AdminPressItem[]>([])
  const [loading, setLoading] = useState(true)
  const [migrating, setMigrating] = useState(false)
  const [newsOpen, setNewsOpen] = useState(false)
  const [newsQuery, setNewsQuery] = useState('이권재')
  const [newsLoading, setNewsLoading] = useState(false)
  const [newsResults, setNewsResults] = useState<NewsItem[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [importing, setImporting] = useState(false)

  // Build dedup sets from existing press: URLs (from mediaLinks) + titles
  const existingUrls = new Set<string>()
  const existingTitles = new Set<string>()
  for (const item of items) {
    existingTitles.add(stripHtml(item.title).trim().toLowerCase())
    for (const m of item.mediaLinks) {
      existingUrls.add(m.url)
    }
  }

  function isDuplicate(news: NewsItem): boolean {
    if (existingUrls.has(news.originallink) || existingUrls.has(news.link)) return true
    const t = stripHtml(news.title).trim().toLowerCase()
    return existingTitles.has(t)
  }

  async function refresh() {
    setLoading(true)
    try {
      setItems(await listAllPress())
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function togglePublish(item: AdminPressItem) {
    try {
      await setPressPublished(item.id, !item.isPublished)
      setItems((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, isPublished: !item.isPublished } : p)),
      )
      toast.success(item.isPublished ? '공개를 해제했어요' : '공개로 전환했어요')
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  async function handleSearchNews(e?: React.FormEvent) {
    e?.preventDefault()
    if (!newsQuery.trim()) {
      toast.error('검색어를 입력해주세요')
      return
    }
    setNewsLoading(true)
    setSelected(new Set())
    try {
      const r = await fetch(
        `/api/news?q=${encodeURIComponent(newsQuery.trim())}&display=30&sort=date`,
      )
      if (!r.ok) {
        const data = (await r.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error || `API error ${r.status}`)
      }
      const data = (await r.json()) as { items?: NewsItem[] }
      setNewsResults(data.items ?? [])
      if (!data.items || data.items.length === 0) {
        toast.info('검색 결과가 없어요')
      }
    } catch (err) {
      toast.error(`뉴스 검색 실패: ${(err as Error).message}`)
      setNewsResults([])
    } finally {
      setNewsLoading(false)
    }
  }

  function toggleSelect(link: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(link)) next.delete(link)
      else next.add(link)
      return next
    })
  }

  function selectAll() {
    const all = newsResults.filter((n) => !isDuplicate(n)).map((n) => n.originallink)
    setSelected(new Set(all))
  }

  function deselectAll() {
    setSelected(new Set())
  }

  async function handleImportSelected() {
    const toImport = newsResults.filter((n) => selected.has(n.originallink))
    if (toImport.length === 0) {
      toast.error('등록할 항목을 선택해주세요')
      return
    }
    if (!confirm(`선택한 ${toImport.length}건을 비공개 상태로 등록할까요? 이후 어드민에서 개별 편집·공개 처리할 수 있어요.`))
      return
    setImporting(true)
    try {
      let created = 0
      for (const news of toImport) {
        const cleanTitle = stripHtml(news.title).trim()
        const cleanDesc = stripHtml(news.description).trim()
        const publisher = extractPublisher(news.originallink || news.link)
        await createPress({
          category: '정책',
          title: cleanTitle,
          body: `<p>${cleanDesc}</p>`,
          publishedAt: parsePubDate(news.pubDate),
          mediaLinks: [{ name: publisher, url: news.originallink || news.link }],
          isPublished: false,
        })
        created += 1
      }
      toast.success(`${created}건을 등록했어요 (비공개)`)
      setSelected(new Set())
      setNewsOpen(false)
      await refresh()
    } catch (err) {
      toast.error(`등록 실패: ${(err as Error).message}`)
    } finally {
      setImporting(false)
    }
  }

  async function handleMigrate() {
    if (
      !confirm(
        `정적 파일의 보도자료 ${staticPress.length}건을 Firestore에 가져옵니다. 이미 같은 ID가 있는 항목은 건너뜁니다. 진행할까요?`,
      )
    )
      return
    setMigrating(true)
    try {
      const { created, skipped } = await migratePressFromStatic()
      toast.success(`마이그레이션 완료 — 새로 추가 ${created}건, 건너뜀 ${skipped}건`)
      await refresh()
    } catch (e) {
      toast.error(`마이그레이션 실패: ${(e as Error).message}`)
    } finally {
      setMigrating(false)
    }
  }

  const missingStaticCount = staticPress.filter(
    (s) => !items.some((i) => i.id === s.id),
  ).length

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-heading-1 text-gray-900">보도자료</h1>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setNewsOpen((v) => !v)}
            className="btn-secondary"
          >
            <NewspaperIcon className="h-5 w-5" aria-hidden="true" />
            {newsOpen ? '뉴스 검색 닫기' : '최근 뉴스 가져오기'}
          </button>
          {missingStaticCount > 0 && !loading && (
            <button
              type="button"
              onClick={handleMigrate}
              disabled={migrating}
              className="btn-secondary"
            >
              <ArrowDownTrayIcon className="h-5 w-5" aria-hidden="true" />
              {migrating
                ? '가져오는 중…'
                : `기존 보도자료 가져오기 (${missingStaticCount}건)`}
            </button>
          )}
          <Link href="/admin/press/new" className="btn-primary">
            <PlusIcon className="h-5 w-5" aria-hidden="true" />새 글 작성
          </Link>
        </div>
      </header>

      {newsOpen && (
        <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <header className="flex items-center justify-between gap-3">
            <h2 className="text-heading-3 text-gray-900">최근 뉴스에서 가져오기</h2>
            <button
              type="button"
              onClick={() => setNewsOpen(false)}
              aria-label="닫기"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
            >
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </header>

          <form onSubmit={handleSearchNews} className="flex flex-wrap gap-2">
            <div className="flex-1 min-w-[220px]">
              <Input
                value={newsQuery}
                onChange={(e) => setNewsQuery(e.target.value)}
                placeholder='예: 이권재, 이권재 오산, "이권재" 등'
              />
            </div>
            <button type="submit" disabled={newsLoading} className="btn-primary">
              <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
              {newsLoading ? '검색 중…' : '검색'}
            </button>
          </form>

          <p className="text-caption text-gray-500">
            네이버 뉴스에서 검색해 결과를 미리 봅니다. 등록하고 싶은 기사만 체크 후 <strong>아래 등록 버튼</strong>을 눌러주세요. 이미
            추가된 글은 자동으로 비활성화됩니다. 등록 시 모두 비공개 상태로 들어가며, 어드민에서 개별 검토 후 공개로 전환할 수
            있어요.
          </p>

          {newsResults.length > 0 && (
            <>
              <div className="flex items-center justify-between gap-3">
                <p className="text-body-small text-gray-700">
                  결과 {newsResults.length}건 · 선택 {selected.size}건
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAll}
                    className="text-caption text-red-500 hover:underline"
                  >
                    중복 제외 전체 선택
                  </button>
                  <button
                    type="button"
                    onClick={deselectAll}
                    className="text-caption text-gray-500 hover:underline"
                  >
                    선택 해제
                  </button>
                </div>
              </div>

              <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
                {newsResults.map((news) => {
                  const dup = isDuplicate(news)
                  const checked = selected.has(news.originallink)
                  const publisher = extractPublisher(news.originallink || news.link)
                  const date = parsePubDate(news.pubDate)
                  return (
                    <li key={news.originallink || news.link}>
                      <label
                        className={cn(
                          'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors',
                          dup
                            ? 'cursor-not-allowed border-gray-200 bg-gray-50 opacity-60'
                            : checked
                              ? 'border-red-300 bg-red-50'
                              : 'border-gray-200 bg-white hover:bg-cream-50',
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={dup}
                          onChange={() => toggleSelect(news.originallink)}
                          className="mt-1 h-4 w-4 cursor-pointer accent-red-500"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 text-caption text-gray-500">
                            <span className="font-medium text-gray-700">{publisher}</span>
                            <span>·</span>
                            <span>{date}</span>
                            {dup && (
                              <span className="rounded-md bg-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-700">
                                이미 추가됨
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-body font-medium text-gray-900">
                            {stripHtml(news.title)}
                          </p>
                          <p className="mt-1 line-clamp-2 text-body-small text-gray-700">
                            {stripHtml(news.description)}
                          </p>
                          <a
                            href={news.originallink || news.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1 inline-block truncate text-caption text-red-500 hover:underline"
                          >
                            {news.originallink || news.link} ↗
                          </a>
                        </div>
                      </label>
                    </li>
                  )
                })}
              </ul>

              <div className="flex justify-end gap-2 border-t border-gray-200 pt-3">
                <button
                  type="button"
                  onClick={() => setNewsOpen(false)}
                  className="btn-secondary"
                  disabled={importing}
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleImportSelected}
                  disabled={importing || selected.size === 0}
                  className="btn-primary"
                >
                  {importing ? '등록 중…' : `선택한 ${selected.size}건 비공개로 등록`}
                </button>
              </div>
            </>
          )}
        </section>
      )}

      {missingStaticCount > 0 && !loading && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-caption text-blue-700">
          정적 파일에 있는 보도자료 {staticPress.length}건 중 {missingStaticCount}건이 아직
          Firestore에 없습니다. &ldquo;기존 보도자료 가져오기&rdquo; 버튼을 누르면 누락된 항목만 추가되며,
          이미 있는 항목과 어드민에서 작성한 새 글은 그대로 유지됩니다.
        </div>
      )}

      {loading ? (
        <p className="rounded-lg bg-white p-6 text-body-small text-gray-500">불러오는 중…</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center">
          <p className="text-body-large text-gray-900">아직 등록된 보도자료가 없어요</p>
          <p className="mt-2 text-body-small text-gray-700">
            첫 글을 작성해 캠프 소식을 알려보세요.
          </p>
          <div className="mt-6">
            <Link href="/admin/press/new" className="btn-primary">
              새 글 작성
            </Link>
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((p) => (
            <li key={p.id}>
              <article className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <Tag tone={p.category === '정책' ? 'blue' : 'red'}>{p.category}</Tag>
                  <span className="text-caption text-gray-500">{p.publishedAt}</span>
                  <span
                    className={cn(
                      'rounded-md px-2 py-0.5 text-caption font-medium',
                      p.isPublished
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700',
                    )}
                  >
                    {p.isPublished ? '공개' : '비공개'}
                  </span>
                </div>
                <h2 className="mt-3 text-body-large font-medium text-gray-900">{p.title}</h2>

                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/admin/press/${p.id}/edit`}
                    className="btn-secondary text-body-small"
                  >
                    <PencilSquareIcon className="h-4 w-4" aria-hidden="true" />
                    편집
                  </Link>
                  <button
                    type="button"
                    onClick={() => togglePublish(p)}
                    className="btn-secondary text-body-small"
                  >
                    {p.isPublished ? '비공개로' : '공개로'}
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
