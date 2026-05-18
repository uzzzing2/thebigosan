'use client'

import { useState } from 'react'
import { FlagIcon } from '@heroicons/react/24/outline'
import { formatRelative, type Cheer } from '@/lib/data/cheers'

const PAGE_SIZE = 10

export interface CheersListProps {
  items: Cheer[]
  onReport: (cheerId: string) => void
}

export function CheersList({ items, onReport }: CheersListProps) {
  const [visible, setVisible] = useState(PAGE_SIZE)
  const hasMore = visible < items.length

  return (
    <>
      <ul className="mx-auto max-w-[720px] space-y-4">
        {items.slice(0, visible).map((cheer) => (
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
              <div className="mt-4 flex justify-end">
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
        ))}
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
