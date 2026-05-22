'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import type { InstagramPost } from '@/lib/data/instagram'
import {
  getInstagramCuration,
  type InstagramCurationItem,
} from '@/lib/firestore/snsCuration'

interface DisplayItem {
  id: string
  originalUrl: string
  imageUrl?: string
  caption?: string
}

function fromStatic(p: InstagramPost): DisplayItem {
  return { id: p.id, originalUrl: p.url }
}

function fromCuration(p: InstagramCurationItem): DisplayItem {
  return {
    id: p.id,
    originalUrl: p.originalUrl,
    imageUrl: p.imageUrl || undefined,
    caption: p.caption || undefined,
  }
}

export function InstagramCurationList({
  initialItems,
  max = 8,
}: {
  initialItems: InstagramPost[]
  max?: number
}) {
  const [items, setItems] = useState<DisplayItem[]>(
    initialItems.slice(0, max).map(fromStatic),
  )

  useEffect(() => {
    let cancelled = false
    getInstagramCuration(max)
      .then((fresh) => {
        if (!cancelled && fresh.length > 0) setItems(fresh.map(fromCuration))
      })
      .catch(() => {
        /* keep initial fallback */
      })
    return () => {
      cancelled = true
    }
  }, [max])

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {items.map((item, i) => (
        <li key={item.id}>
          <InstagramCard item={item} index={i} />
        </li>
      ))}
    </ul>
  )
}

function InstagramCard({ item, index }: { item: DisplayItem; index: number }) {
  return (
    <a
      href={item.originalUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`인스타그램 게시물 ${index + 1} 새 창에서 열기`}
      className="group relative block overflow-hidden rounded-2xl shadow-md transition-all duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-lg"
    >
      {item.imageUrl ? (
        <div className="relative aspect-square bg-cream-100">
          <Image
            src={item.imageUrl}
            alt={item.caption ?? ''}
            fill
            sizes="(min-width: 1024px) 240px, 50vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="flex aspect-square items-center justify-center bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-10 w-10 opacity-90"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
          </svg>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2.5">
        <p className="truncate text-caption font-medium text-white">
          {item.caption || `최신 #${index + 1}`}
        </p>
      </div>
    </a>
  )
}
