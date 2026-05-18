'use client'

import { useEffect, useState } from 'react'
import {
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  NewspaperIcon,
} from '@heroicons/react/24/outline'
import { countAllCheers, listAllPress } from '@/lib/firestore/admin'

interface Stats {
  cheers: number
  reported: number
  press: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([countAllCheers(), listAllPress()])
      .then(([cheerCounts, press]) => {
        if (cancelled) return
        setStats({
          cheers: cheerCounts.total,
          reported: cheerCounts.reported,
          press: press.length,
        })
      })
      .catch((e) => {
        if (cancelled) return
        setError((e as Error).message)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-heading-1 text-gray-900">대시보드</h1>
        <p className="mt-1 text-body-small text-gray-700">사이트 운영 현황 한눈에 보기</p>
      </header>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-body-small text-red-700">{error}</div>
      )}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li>
          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-gray-700">
              <ChatBubbleLeftRightIcon className="h-6 w-6" aria-hidden="true" />
              <h2 className="text-body font-medium">누적 응원</h2>
            </div>
            <p className="mt-4 text-display-2 font-bold text-gray-900">
              {stats?.cheers.toLocaleString() ?? '—'}
            </p>
          </article>
        </li>
        <li>
          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-gray-700">
              <ExclamationTriangleIcon className="h-6 w-6" aria-hidden="true" />
              <h2 className="text-body font-medium">신고 대기</h2>
            </div>
            <p className="mt-4 text-display-2 font-bold text-red-500">
              {stats?.reported.toLocaleString() ?? '—'}
            </p>
          </article>
        </li>
        <li>
          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-gray-700">
              <NewspaperIcon className="h-6 w-6" aria-hidden="true" />
              <h2 className="text-body font-medium">보도자료</h2>
            </div>
            <p className="mt-4 text-display-2 font-bold text-gray-900">
              {stats?.press.toLocaleString() ?? '—'}
            </p>
          </article>
        </li>
      </ul>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-heading-3 text-gray-900">빠른 가이드</h2>
        <ul className="mt-4 space-y-2 text-body-small text-gray-700">
          <li>• <strong>응원 관리</strong> — 신고 응원 검토, 부적절 응원 숨김/삭제</li>
          <li>• <strong>보도자료</strong> — 새 글 작성, 본문은 리치 에디터 + 보도 언론 링크</li>
          <li>• <strong>SNS 큐레이션</strong> — 인스타 포스트를 메인 페이지에 노출</li>
          <li>• 응원·보도자료가 처음엔 0건이면 사이트는 mock 데이터로 보여집니다.</li>
        </ul>
      </section>
    </div>
  )
}
