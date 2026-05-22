'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Tag } from '@/components/ui'
import { formatPressDate, type PressItem } from '@/lib/data/press'
import { findAdjacent, getAllPress, getPressById } from '@/lib/firestore/press'
import { CopyLinkButton } from './CopyLinkButton'

/**
 * Client-side detail renderer used when an ID is not in the static dataset
 * (e.g. an admin-added post). Fetches from Firestore on mount; falls through
 * to notFound() if the doc doesn't exist.
 */
export function PressDetailFirestoreFallback({ id }: { id: string }) {
  const [state, setState] = useState<
    | { kind: 'loading' }
    | { kind: 'ready'; item: PressItem; prev?: PressItem; next?: PressItem }
    | { kind: 'missing' }
  >({ kind: 'loading' })

  useEffect(() => {
    let cancelled = false
    Promise.all([getPressById(id), getAllPress()])
      .then(([item, all]) => {
        if (cancelled) return
        if (!item) {
          setState({ kind: 'missing' })
          return
        }
        const { prev, next } = findAdjacent(all, id)
        setState({ kind: 'ready', item, prev, next })
      })
      .catch(() => {
        if (!cancelled) setState({ kind: 'missing' })
      })
    return () => {
      cancelled = true
    }
  }, [id])

  if (state.kind === 'loading') {
    return (
      <article className="bg-white">
        <div className="container-base max-w-[800px] py-12 md:py-16 lg:py-20">
          <Link href="/press" className="btn-text">
            ← 목록으로
          </Link>
          <p className="mt-10 text-body text-gray-500">불러오는 중…</p>
        </div>
      </article>
    )
  }

  if (state.kind === 'missing') {
    notFound()
  }

  const { item, prev, next } = state

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

        <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-2xl bg-cream-100">
          {item.thumbnail && (
            <Image
              src={item.thumbnail}
              alt=""
              fill
              sizes="(min-width: 1024px) 800px, 90vw"
              className="object-cover"
            />
          )}
        </div>

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
              <Link
                href={`/press/${prev.id}`}
                className="block rounded-xl bg-cream-50 p-4 transition-colors hover:bg-cream-100"
              >
                <p className="text-caption text-gray-500">← 이전 글</p>
                <p className="truncate-1 mt-1 text-body font-medium text-gray-900">
                  {prev.title}
                </p>
              </Link>
            ) : null}
          </div>
          <div className="text-right">
            {next ? (
              <Link
                href={`/press/${next.id}`}
                className="block rounded-xl bg-cream-50 p-4 transition-colors hover:bg-cream-100"
              >
                <p className="text-caption text-gray-500">다음 글 →</p>
                <p className="truncate-1 mt-1 text-body font-medium text-gray-900">
                  {next.title}
                </p>
              </Link>
            ) : null}
          </div>
        </nav>
      </div>
    </article>
  )
}
