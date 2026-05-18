import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Tag } from '@/components/ui'
import { formatPressDate } from '@/lib/data/press'
import { findAdjacent, getAllPress, getPressById } from '@/lib/firestore/press'
import { CopyLinkButton } from './CopyLinkButton'

interface Params {
  params: { id: string }
}

export const revalidate = 60

export async function generateStaticParams() {
  const items = await getAllPress()
  return items.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const item = await getPressById(params.id)
  if (!item) return { title: '보도자료를 찾을 수 없어요' }
  return {
    title: item.title,
    description: item.body.replace(/<[^>]+>/g, '').slice(0, 120),
  }
}

export default async function PressDetailPage({ params }: Params) {
  const item = await getPressById(params.id)
  if (!item) notFound()

  const all = await getAllPress()
  const { prev, next } = findAdjacent(all, params.id)

  return (
    <article className="bg-white">
      <div className="container-base max-w-[800px] py-12 md:py-16 lg:py-20">
        <Link href="/press" className="btn-text">
          ← 목록으로
        </Link>

        <header className="mt-8">
          <Tag tone={item.category === '정책' ? 'blue' : 'red'}>{item.category}</Tag>
          <h1 className="mt-4 text-[32px] font-extrabold leading-[1.2] tracking-[-0.02em] text-gray-900 md:text-display-2">
            {item.title}
          </h1>
          <p className="mt-4 text-body-small text-gray-500">
            📅 {formatPressDate(item.publishedAt)}
          </p>
        </header>

        <div className="mt-10 aspect-video w-full rounded-2xl bg-cream-100" aria-hidden="true" />

        {item.body && (
          <div
            className="prose prose-lg mt-10 max-w-none text-gray-700 prose-headings:text-gray-900 prose-strong:text-gray-900 prose-a:text-red-500"
            dangerouslySetInnerHTML={{ __html: item.body }}
          />
        )}

        {item.mediaLinks.length > 0 && (
          <section className="mt-12 border-t border-gray-200 pt-10">
            <h2 className="text-heading-3 text-gray-900">
              <span aria-hidden="true" className="mr-2">📰</span>이 내용을 보도한 언론
            </h2>
            <ul className="mt-5 space-y-2">
              {item.mediaLinks.map((m, i) => (
                <li key={i}>
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-text"
                  >
                    {m.name} ↗
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-12 flex justify-end">
          <CopyLinkButton />
        </div>

        <nav className="mt-12 grid grid-cols-2 gap-4 border-t border-gray-200 pt-8">
          <div>
            {prev ? (
              <Link href={`/press/${prev.id}`} className="block rounded-xl bg-cream-50 p-4 transition-colors hover:bg-cream-100">
                <p className="text-caption text-gray-500">← 이전 글</p>
                <p className="truncate-1 mt-1 text-body font-medium text-gray-900">{prev.title}</p>
              </Link>
            ) : null}
          </div>
          <div className="text-right">
            {next ? (
              <Link href={`/press/${next.id}`} className="block rounded-xl bg-cream-50 p-4 transition-colors hover:bg-cream-100">
                <p className="text-caption text-gray-500">다음 글 →</p>
                <p className="truncate-1 mt-1 text-body font-medium text-gray-900">{next.title}</p>
              </Link>
            ) : null}
          </div>
        </nav>
      </div>
    </article>
  )
}
