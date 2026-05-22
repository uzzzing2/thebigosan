'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  ArrowDownTrayIcon,
  PencilSquareIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { Tag } from '@/components/ui'
import { cn } from '@/lib/cn'
import {
  listAllPress,
  migratePressFromStatic,
  setPressPublished,
  type AdminPressItem,
} from '@/lib/firestore/admin'
import { pressItems as staticPress } from '@/lib/data/press'

export default function AdminPressListPage() {
  const [items, setItems] = useState<AdminPressItem[]>([])
  const [loading, setLoading] = useState(true)
  const [migrating, setMigrating] = useState(false)

  async function refresh() {
    setLoading(true)
    try {
      setItems(await listAllPress())
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function togglePublish(item: AdminPressItem) {
    try {
      await setPressPublished(item.id, !item.isPublished)
      setItems((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, isPublished: !item.isPublished } : p)),
      )
      toast.success(item.isPublished ? '공개를 해제했어요' : '공개로 전환했어요')
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  async function handleMigrate() {
    if (
      !confirm(
        `정적 파일의 보도자료 ${staticPress.length}건을 Firestore에 가져옵니다. 이미 같은 ID가 있는 항목은 건너뜁니다. 진행할까요?`,
      )
    )
      return
    setMigrating(true)
    try {
      const { created, skipped } = await migratePressFromStatic()
      toast.success(`마이그레이션 완료 — 새로 추가 ${created}건, 건너뜀 ${skipped}건`)
      await refresh()
    } catch (e) {
      toast.error(`마이그레이션 실패: ${(e as Error).message}`)
    } finally {
      setMigrating(false)
    }
  }

  const missingStaticCount = staticPress.filter(
    (s) => !items.some((i) => i.id === s.id),
  ).length

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-heading-1 text-gray-900">보도자료</h1>
        <div className="flex flex-wrap gap-2">
          {missingStaticCount > 0 && !loading && (
            <button
              type="button"
              onClick={handleMigrate}
              disabled={migrating}
              className="btn-secondary"
            >
              <ArrowDownTrayIcon className="h-5 w-5" aria-hidden="true" />
              {migrating
                ? '가져오는 중…'
                : `기존 보도자료 가져오기 (${missingStaticCount}건)`}
            </button>
          )}
          <Link href="/admin/press/new" className="btn-primary">
            <PlusIcon className="h-5 w-5" aria-hidden="true" />새 글 작성
          </Link>
        </div>
      </header>

      {missingStaticCount > 0 && !loading && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-caption text-blue-700">
          정적 파일에 있는 보도자료 {staticPress.length}건 중 {missingStaticCount}건이 아직
          Firestore에 없습니다. &ldquo;기존 보도자료 가져오기&rdquo; 버튼을 누르면 누락된 항목만 추가되며,
          이미 있는 항목과 어드민에서 작성한 새 글은 그대로 유지됩니다.
        </div>
      )}

      {loading ? (
        <p className="rounded-lg bg-white p-6 text-body-small text-gray-500">불러오는 중…</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center">
          <p className="text-body-large text-gray-900">아직 등록된 보도자료가 없어요</p>
          <p className="mt-2 text-body-small text-gray-700">
            첫 글을 작성해 캠프 소식을 알려보세요.
          </p>
          <div className="mt-6">
            <Link href="/admin/press/new" className="btn-primary">
              새 글 작성
            </Link>
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((p) => (
            <li key={p.id}>
              <article className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <Tag tone={p.category === '정책' ? 'blue' : 'red'}>{p.category}</Tag>
                  <span className="text-caption text-gray-500">{p.publishedAt}</span>
                  <span
                    className={cn(
                      'rounded-md px-2 py-0.5 text-caption font-medium',
                      p.isPublished
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700',
                    )}
                  >
                    {p.isPublished ? '공개' : '비공개'}
                  </span>
                </div>
                <h2 className="mt-3 text-body-large font-medium text-gray-900">{p.title}</h2>

                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/admin/press/${p.id}/edit`}
                    className="btn-secondary text-body-small"
                  >
                    <PencilSquareIcon className="h-4 w-4" aria-hidden="true" />
                    편집
                  </Link>
                  <button
                    type="button"
                    onClick={() => togglePublish(p)}
                    className="btn-secondary text-body-small"
                  >
                    {p.isPublished ? '비공개로' : '공개로'}
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
