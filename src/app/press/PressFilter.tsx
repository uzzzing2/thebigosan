'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Tag } from '@/components/ui'
import { cn } from '@/lib/cn'
import { formatPressDate, type PressItem } from '@/lib/data/press'

type Filter = '전체' | '정책' | '칼럼'
const FILTERS: Filter[] = ['전체', '정책', '칼럼']

const PAGE_SIZE = 9

export function PressFilter({ items }: { items: PressItem[] }) {
  const [filter, setFilter] = useState<Filter>('전체')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const filtered = useMemo(() => {
    const arr = filter === '전체' ? items : items.filter((p) => p.category === filter)
    return [...arr].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
  }, [items, filter])

  const visibleItems = filtered.slice(0, visible)
  const hasMore = visible < filtered.length

  return (
    <>
      <ul role="tablist" aria-label="카테고리 필터" className="mb-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <li key={f}>
            <button
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => {
                setFilter(f)
                setVisible(PAGE_SIZE)
              }}
              className={cn(
                'rounded-full px-4 py-2 text-body-small font-medium transition-colors',
                filter === f
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-700 hover:text-red-500',
              )}
            >
              {f}
            </button>
          </li>
        ))}
      </ul>

      {visibleItems.length === 0 ? (
        <p className="rounded-2xl bg-cream-100 p-10 text-center text-body text-gray-700">
          곧 새로운 소식을 전해드릴게요
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((p) => (
            <li key={p.id}>
              <Link
                href={`/press/${p.id}`}
                className="block h-full overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-lg"
              >
                {/* TODO Step 5: replace with actual thumbnail */}
                <div className="aspect-video bg-cream-100" aria-hidden="true" />
                <div className="space-y-3 p-5">
                  <Tag tone={p.category === '정책' ? 'blue' : 'red'}>{p.category}</Tag>
                  <h2 className="truncate-2 text-body-large text-gray-900">{p.title}</h2>
                  <div className="flex items-center justify-between">
                    <span className="text-caption text-gray-500">
                      {formatPressDate(p.publishedAt)}
                    </span>
                    <span className="text-caption font-medium text-red-500">
                      📰 보도 {p.mediaLinks.length}건
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

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
