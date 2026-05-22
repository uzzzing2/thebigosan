'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  ArrowUturnLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  FlagIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/cn'
import {
  type AdminCheer,
  type ReportReadDiagnostics,
  clearReportsForCheer,
  deleteCheer,
  getLastReportDiagnostics,
  listAllCheers,
  setCheerHidden,
} from '@/lib/firestore/admin'
import { formatRelative } from '@/lib/data/cheers'

type Tab = 'all' | 'reported' | 'hidden'

export default function AdminCheersPage() {
  const [items, setItems] = useState<AdminCheer[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('all')
  const [diag, setDiag] = useState<ReportReadDiagnostics | null>(null)

  async function refresh() {
    setLoading(true)
    try {
      const list = await listAllCheers()
      setItems(list)
      setDiag(getLastReportDiagnostics())
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleHide(c: AdminCheer) {
    try {
      await setCheerHidden(c.id, !c.isHidden)
      setItems((prev) =>
        prev.map((p) => (p.id === c.id ? { ...p, isHidden: !c.isHidden } : p)),
      )
      toast.success(c.isHidden ? '응원을 다시 노출했어요' : '응원을 숨겼어요')
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  async function handleDelete(c: AdminCheer) {
    if (!confirm(`@${c.nickname} 의 응원을 삭제할까요? 되돌릴 수 없어요.`)) return
    try {
      await deleteCheer(c.id)
      setItems((prev) => prev.filter((p) => p.id !== c.id))
      toast.success('응원을 삭제했어요')
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  async function handleClearReports(c: AdminCheer) {
    if (!confirm(`@${c.nickname} 의 신고 ${c.reports}건을 초기화할까요? 되돌릴 수 없어요.`)) return
    try {
      const cleared = await clearReportsForCheer(c.id)
      setItems((prev) => prev.map((p) => (p.id === c.id ? { ...p, reports: 0 } : p)))
      toast.success(`신고 ${cleared}건을 초기화했어요`)
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const filtered = items.filter((c) => {
    if (tab === 'reported') return c.reports > 0
    if (tab === 'hidden') return c.isHidden
    return true
  })

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-heading-1 text-gray-900">응원 관리</h1>
        <button type="button" onClick={refresh} className="btn-secondary">
          새로고침
        </button>
      </header>

      {diag && (
        <div
          className={cn(
            'space-y-2 rounded-lg border p-3 text-caption',
            diag.ok
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-700',
          )}
        >
          {diag.ok ? (
            <>
              <div>
                [신고 진단] reports 읽기 OK · 전체 {diag.totalDocs}건 · 신고된 응원{' '}
                {diag.distinctCheers}개 · 응원 목록과 매칭{' '}
                {diag.reportedCheerIds.filter((id) => items.some((c) => c.id === id))
                  .length}
                개
              </div>
              {diag.reportedCheerIds.length > 0 && (
                <ul className="space-y-0.5 font-mono text-[11px]">
                  {diag.reportedCheerIds.map((rid) => {
                    const matched = items.find((c) => c.id === rid)
                    return (
                      <li key={rid}>
                        {matched ? '✅' : '❌'} <code>{rid}</code>
                        {matched
                          ? ` → @${matched.nickname}: ${matched.content.slice(0, 30)}…`
                          : ' → 매칭되는 응원 없음 (삭제됐거나 ID 불일치)'}
                      </li>
                    )
                  })}
                </ul>
              )}
            </>
          ) : (
            <>
              [신고 진단] reports 컬렉션 읽기 실패: <code>{diag.error}</code>
            </>
          )}
        </div>
      )}

      <ul role="tablist" aria-label="응원 필터" className="flex gap-2 border-b border-gray-200">
        {(
          [
            { v: 'all', label: '전체' },
            { v: 'reported', label: '신고된 응원' },
            { v: 'hidden', label: '숨김 처리' },
          ] as const
        ).map((t) => (
          <li key={t.v}>
            <button
              type="button"
              role="tab"
              aria-selected={tab === t.v}
              onClick={() => setTab(t.v)}
              className={cn(
                'relative px-4 py-3 text-body-small font-medium transition-colors',
                tab === t.v ? 'text-red-500' : 'text-gray-500 hover:text-gray-700',
                tab === t.v &&
                  'after:absolute after:inset-x-0 after:-bottom-px after:h-[3px] after:rounded-full after:bg-red-500',
              )}
            >
              {t.label}
            </button>
          </li>
        ))}
      </ul>

      {loading ? (
        <p className="rounded-lg bg-white p-6 text-body-small text-gray-500">불러오는 중…</p>
      ) : filtered.length === 0 ? (
        <p className="rounded-lg bg-white p-6 text-body-small text-gray-500">
          {tab === 'all' ? '응원이 없습니다.' : '해당 조건의 응원이 없습니다.'}
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((c) => (
            <li key={c.id}>
              <article
                className={cn(
                  'rounded-2xl bg-white p-5 shadow-sm',
                  c.isHidden && 'opacity-60',
                )}
              >
                <header className="flex flex-wrap items-center gap-3">
                  <p className="text-body font-medium text-gray-900">@{c.nickname}</p>
                  <span className="text-caption text-gray-500">
                    {formatRelative(c.createdAt)}
                  </span>
                  {c.reports > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-caption font-medium text-red-500">
                      <FlagIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      신고 {c.reports}
                    </span>
                  )}
                  {c.isHidden && (
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-caption font-medium text-gray-700">
                      숨김
                    </span>
                  )}
                </header>
                <p className="mt-3 text-body text-gray-900">{c.content}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleHide(c)}
                    className="btn-secondary text-body-small"
                  >
                    {c.isHidden ? (
                      <>
                        <EyeIcon className="h-4 w-4" aria-hidden="true" /> 노출
                      </>
                    ) : (
                      <>
                        <EyeSlashIcon className="h-4 w-4" aria-hidden="true" /> 숨김
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(c)}
                    className="btn-secondary text-body-small text-red-500"
                  >
                    <TrashIcon className="h-4 w-4" aria-hidden="true" /> 삭제
                  </button>
                  {c.reports > 0 && (
                    <button
                      type="button"
                      onClick={() => handleClearReports(c)}
                      className="btn-secondary text-body-small"
                    >
                      <ArrowUturnLeftIcon className="h-4 w-4" aria-hidden="true" /> 신고
                      초기화
                    </button>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
