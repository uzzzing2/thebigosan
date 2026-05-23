'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { RevealItem, RevealStagger, Tag } from '@/components/ui'
import { formatPressDate, type PressItem } from '@/lib/data/press'
import { getAllPress } from '@/lib/firestore/press'

const VISIBLE = 4

function topPressByDate(items: PressItem[]): PressItem[] {
  return [...items]
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .slice(0, VISIBLE)
}

/**
 * Renders the latest press items. SSR'd with the static dataset for fast first
 * paint and SEO, then refreshes from Firestore on mount so admin-added posts
 * appear without a rebuild.
 */
export function PressSectionList({ initialItems }: { initialItems: PressItem[] }) {
  const [items, setItems] = useState<PressItem[]>(() => topPressByDate(initialItems))

  useEffect(() => {
    let cancelled = false
    getAllPress()
      .then((fresh) => {
        if (!cancelled && fresh.length > 0) setItems(topPressByDate(fresh))
      })
      .catch(() => {
        /* keep initial fallback */
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <RevealStagger
      as="ul"
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
    >
      {items.map((item) => (
        <RevealItem as="li" key={item.id}>
          <Link
            href={`/press/${item.id}`}
            className="block h-full overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative aspect-video bg-cream-100">
              {item.thumbnail && (
                <Image
                  src={item.thumbnail}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 280px, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              )}
            </div>
            <div className="space-y-3 p-5">
              <Tag tone={item.category === '정책' ? 'blue' : 'red'}>{item.category}</Tag>
              <h3 className="truncate-2 text-body-large text-gray-900">{item.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-caption text-gray-500">
                  {formatPressDate(item.publishedAt)}
                </span>
                <span className="text-caption font-medium text-red-500">
                  📰 보도 {item.mediaLinks.length}건
                </span>
              </div>
            </div>
          </Link>
        </RevealItem>
      ))}
    </RevealStagger>
  )
}
