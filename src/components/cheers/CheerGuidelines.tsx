'use client'

import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/cn'

const RULES = [
  '욕설·비방·차별 표현 금지',
  '허위 사실 유포 및 공직선거법 위반 금지',
  '광고·스팸·도배성 게시 금지',
  '운영원칙 위반 시 사전 통지 없이 삭제·차단될 수 있습니다',
]

export function CheerGuidelines() {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl bg-cream-50 p-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-body-small font-medium text-gray-700"
      >
        운영원칙 펼쳐보기
        <ChevronDownIcon
          aria-hidden="true"
          className={cn('h-4 w-4 transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && (
        <ul className="mt-3 space-y-1.5 text-body-small text-gray-700">
          {RULES.map((r) => (
            <li key={r} className="flex gap-2">
              <span aria-hidden="true" className="text-red-500">·</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
