'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Tag } from '@/components/ui'
import { cn } from '@/lib/cn'
import {
  listAllPress,
  setPressPublished,
  type AdminPressItem,
} from '@/lib/firestore/admin'

export default function AdminPressListPage() {
  const [items, setItems] = useState<AdminPressItem[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-heading-1 text-gray-900">보도자료</h1>
        <Link href="/admin/press/new" className="btn-primary">
          <PlusIcon className="h-5 w-5" aria-hidden="true" />새 글 작성
        </Link>
      </header>

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
