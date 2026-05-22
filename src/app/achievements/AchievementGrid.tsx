'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { ACHIEVEMENT_CATEGORIES, achievements, type Achievement } from '@/lib/data/achievements'
import { Modal, Tag } from '@/components/ui'
import { cn } from '@/lib/cn'

type Filter = '전체' | Achievement['category']

const FILTERS: Filter[] = ['전체', ...ACHIEVEMENT_CATEGORIES]

function outcomeImagePath(id: string): string {
  return `/images/outcome/성과 ${Number(id)}.png`
}

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

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {filtered.map((a) => (
          <li key={a.id}>
            <button
              type="button"
              onClick={() => setActive(a)}
              className="group flex h-full w-full flex-col gap-3 rounded-2xl bg-white p-3 text-left shadow-md transition-all duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-red-500/20 sm:gap-4 sm:p-6"
              aria-label={`${a.title} 상세 보기`}
            >
              <div className="flex items-center justify-between gap-2 px-3 pt-3 sm:px-6 sm:pt-6">
                <Tag tone="red">{a.category}</Tag>
                <span className="text-caption font-medium text-gray-500">No. {a.id}</span>
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-cream-100">
                <Image
                  src={outcomeImagePath(a.id)}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
              <div className="px-3 pb-3 sm:px-6 sm:pb-6">
                <h3 className="text-body font-bold text-gray-900 group-hover:text-red-500 sm:text-heading-3 sm:font-bold">
                  {a.title}
                </h3>
                <p className="mt-1.5 text-body-small text-gray-700 sm:mt-2">{a.desc}</p>
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
        size="xl"
      >
        {active && (
          <div className="space-y-5">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[min(720px,calc((100vh-16rem)*4/5))] overflow-hidden rounded-xl bg-cream-100">
              <Image
                src={outcomeImagePath(active.id)}
                alt=""
                fill
                sizes="(min-width: 1024px) 720px, 90vw"
                className="object-cover object-center"
              />
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
