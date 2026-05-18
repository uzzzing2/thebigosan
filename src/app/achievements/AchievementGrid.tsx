'use client'

import { useMemo, useState } from 'react'
import { ACHIEVEMENT_CATEGORIES, achievements, type Achievement } from '@/lib/data/achievements'
import { Modal, Tag } from '@/components/ui'
import { cn } from '@/lib/cn'

type Filter = '전체' | Achievement['category']

const FILTERS: Filter[] = ['전체', ...ACHIEVEMENT_CATEGORIES]

export function AchievementGrid() {
  const [filter, setFilter] = useState<Filter>('전체')
  const [active, setActive] = useState<Achievement | null>(null)

  const filtered = useMemo(
    () => (filter === '전체' ? achievements : achievements.filter((a) => a.category === filter)),
    [filter],
  )

  return (
    <>
      <ul
        role="tablist"
        aria-label="성과 카테고리 필터"
        className="mb-8 flex flex-wrap gap-2"
      >
        {FILTERS.map((f) => (
          <li key={f}>
            <button
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
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

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => (
          <li key={a.id}>
            <button
              type="button"
              onClick={() => setActive(a)}
              className="group flex h-full w-full flex-col gap-4 rounded-2xl bg-white p-6 text-left shadow-md transition-all duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-red-500/20"
              aria-label={`${a.title} 상세 보기`}
            >
              <div className="flex items-center justify-between">
                <Tag tone="red">{a.category}</Tag>
                <span className="text-caption font-medium text-gray-500">No. {a.id}</span>
              </div>
              {/* TODO Step 5: replace with actual achievement image (4:3) */}
              <div className="aspect-[4/3] rounded-lg bg-cream-100" aria-hidden="true" />
              <div>
                <h3 className="text-heading-3 text-gray-900 group-hover:text-red-500">
                  {a.title}
                </h3>
                <p className="mt-2 text-body-small text-gray-700">{a.desc}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <Modal
        open={active !== null}
        onOpenChange={(open) => !open && setActive(null)}
        title={active?.title}
        description={active?.desc}
        size="lg"
      >
        {active && (
          <div className="space-y-5">
            <div className="aspect-[16/10] w-full rounded-xl bg-cream-100" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <Tag tone="red">{active.category}</Tag>
              <span className="text-caption text-gray-500">No. {active.id}</span>
            </div>
            {active.relatedLinks && active.relatedLinks.length > 0 && (
              <div>
                <p className="text-body font-medium text-gray-900">관련 보도</p>
                <ul className="mt-2 space-y-1">
                  {active.relatedLinks.map((l, i) => (
                    <li key={i}>
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-text"
                      >
                        {l.name} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  )
}
