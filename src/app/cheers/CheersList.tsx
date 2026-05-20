'use client'

import { useMemo, useState } from 'react'
import { FlagIcon, HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { cn } from '@/lib/cn'
import { formatRelative, type Cheer } from '@/lib/data/cheers'
import { useLikedCheers } from './useLikedCheers'
import { toggleCheerLike } from '@/lib/firestore/cheers'

const PAGE_SIZE = 10

export interface CheersListProps {
  items: Cheer[]
  onReport: (cheerId: string) => void
}

export function CheersList({ items, onReport }: CheersListProps) {
  const [visible, setVisible] = useState(PAGE_SIZE)
  const { liked, toggle } = useLikedCheers()
  const sorted = useMemo(
    () => [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [items],
  )
  const hasMore = visible < sorted.length

  async function handleLike(cheerId: string) {
    const isLiked = liked.has(cheerId)
    toggle(cheerId, !isLiked)
    try {
      await toggleCheerLike(cheerId, isLiked ? -1 : 1)
    } catch (err) {
      console.error('[cheers] like failed', err)
      toggle(cheerId, isLiked) // revert
    }
  }

  return (
    <>
      <ul className="mx-auto max-w-[720px] space-y-4">
        {sorted.slice(0, visible).map((cheer) => {
          const isLiked = liked.has(cheer.id)
          return (
            <li key={cheer.id}>
              <article className="rounded-2xl bg-white p-6 shadow-md">
                <header className="flex items-center justify-between gap-3">
                  <p className="text-body font-medium text-gray-900">
                    <span aria-hidden="true" className="mr-1">💬</span>
                    {cheer.nickname}
                  </p>
                  <span className="text-caption text-gray-500">
                    📅 {formatRelative(cheer.createdAt)}
                  </span>
                </header>
                <p className="mt-3 text-body text-gray-900">{cheer.content}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleLike(cheer.id)}
                    aria-label={isLiked ? '좋아요 취소' : '좋아요'}
                    aria-pressed={isLiked}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-caption transition-colors',
                      isLiked
                        ? 'bg-red-50 text-red-500'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-red-500',
                    )}
                  >
                    {isLiked ? (
                      <HeartSolidIcon className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <HeartIcon className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span className="tabular-nums">{cheer.likes}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onReport(cheer.id)}
                    aria-label={`${cheer.nickname}의 응원 신고하기`}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-caption text-gray-500 transition-colors hover:text-red-500"
                  >
                    <FlagIcon className="h-4 w-4" aria-hidden="true" />
                    신고
                  </button>
                </div>
              </article>
            </li>
          )
        })}
      </ul>

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="btn-secondary"
          >
            더 보기
          </button>
        </div>
      )}
    </>
  )
}
