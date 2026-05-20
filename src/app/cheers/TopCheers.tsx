'use client'

import { useEffect, useState } from 'react'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { HeartIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/cn'
import { formatRelative, type Cheer } from '@/lib/data/cheers'
import { isFirebaseConfigured } from '@/lib/firebase'
import { listenTopCheers, toggleCheerLike } from '@/lib/firestore/cheers'
import { useLikedCheers } from './useLikedCheers'

const RANK_BADGES = ['🥇', '🥈', '🥉', '4', '5']

export function TopCheers() {
  const [items, setItems] = useState<Cheer[]>([])
  const { liked, toggle } = useLikedCheers()

  useEffect(() => {
    if (!isFirebaseConfigured) return
    const unsubscribe = listenTopCheers((live) => setItems(live), 5)
    return unsubscribe
  }, [])

  if (items.length === 0) return null

  async function handleLike(cheerId: string) {
    const isLiked = liked.has(cheerId)
    toggle(cheerId, !isLiked)
    try {
      await toggleCheerLike(cheerId, isLiked ? -1 : 1)
    } catch (err) {
      console.error('[cheers] like failed', err)
      toggle(cheerId, isLiked)
    }
  }

  return (
    <section aria-labelledby="top-cheers-heading" className="bg-cream-50 py-12 md:py-16">
      <div className="container-base">
        <div className="mx-auto max-w-[720px]">
          <h2
            id="top-cheers-heading"
            className="text-center text-heading-2 font-bold text-gray-900"
          >
            <span aria-hidden="true" className="mr-2">🏆</span>
            인기 응원 TOP 5
          </h2>
          <p className="mt-2 text-center text-body-small text-gray-500">
            가장 많은 공감을 받은 시민의 한마디
          </p>
          <ol className="mt-8 space-y-3">
            {items.map((cheer, i) => {
              const isLiked = liked.has(cheer.id)
              return (
                <li key={cheer.id}>
                  <article className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-md md:p-5">
                    <div
                      aria-hidden="true"
                      className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-bold',
                        i < 3 ? 'bg-transparent text-2xl' : 'bg-gray-100 text-gray-700',
                      )}
                    >
                      {RANK_BADGES[i]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <header className="flex items-center justify-between gap-3">
                        <p className="truncate text-body-small font-medium text-gray-900">
                          {cheer.nickname}
                        </p>
                        <span className="shrink-0 text-caption text-gray-500">
                          {formatRelative(cheer.createdAt)}
                        </span>
                      </header>
                      <p className="mt-1.5 text-body text-gray-900">{cheer.content}</p>
                      <div className="mt-2 flex justify-end">
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
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
