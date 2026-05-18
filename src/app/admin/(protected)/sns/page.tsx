'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Input } from '@/components/ui'
import { cn } from '@/lib/cn'
import {
  type AdminSnsItem,
  type SnsInput,
  createSns,
  deleteSns,
  listAllSns,
  updateSns,
} from '@/lib/firestore/admin'

const EMPTY: SnsInput = {
  imageUrl: '',
  caption: '',
  originalUrl: '',
  postedAt: new Date().toISOString().slice(0, 10),
  order: 0,
  isActive: true,
}

export default function AdminSnsPage() {
  const [items, setItems] = useState<AdminSnsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState<SnsInput>(EMPTY)
  const [saving, setSaving] = useState(false)

  async function refresh() {
    setLoading(true)
    try {
      setItems(await listAllSns())
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!draft.imageUrl.trim() || !draft.originalUrl.trim()) {
      toast.error('이미지 URL과 원본 URL은 필수입니다')
      return
    }
    setSaving(true)
    try {
      await createSns({
        ...draft,
        order: draft.order || (items.length + 1) * 10,
      })
      toast.success('큐레이션 항목을 추가했어요')
      setDraft(EMPTY)
      setAdding(false)
      refresh()
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleActive(item: AdminSnsItem) {
    try {
      await updateSns(item.id, { isActive: !item.isActive })
      setItems((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, isActive: !item.isActive } : p)),
      )
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  async function handleDelete(item: AdminSnsItem) {
    if (!confirm('이 큐레이션 항목을 삭제할까요?')) return
    try {
      await deleteSns(item.id)
      setItems((prev) => prev.filter((p) => p.id !== item.id))
      toast.success('삭제했어요')
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  async function handleReorder(item: AdminSnsItem, delta: number) {
    const newOrder = item.order + delta
    try {
      await updateSns(item.id, { order: newOrder })
      setItems((prev) =>
        [...prev].map((p) => (p.id === item.id ? { ...p, order: newOrder } : p)).sort(
          (a, b) => a.order - b.order,
        ),
      )
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-heading-1 text-gray-900">SNS 큐레이션</h1>
        {!adding && (
          <button type="button" onClick={() => setAdding(true)} className="btn-primary">
            <PlusIcon className="h-5 w-5" aria-hidden="true" />새 항목
          </button>
        )}
      </header>

      {adding && (
        <form onSubmit={handleCreate} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-heading-3 text-gray-900">새 인스타 항목</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="이미지 URL"
              requiredMark
              value={draft.imageUrl}
              onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
              placeholder="https://..."
            />
            <Input
              label="원본 게시물 URL"
              requiredMark
              value={draft.originalUrl}
              onChange={(e) => setDraft({ ...draft, originalUrl: e.target.value })}
              placeholder="https://instagram.com/..."
            />
            <Input
              label="캡션"
              value={draft.caption}
              onChange={(e) => setDraft({ ...draft, caption: e.target.value })}
              placeholder="간단한 설명"
            />
            <div>
              <label className="mb-2 block text-body-small font-medium text-gray-900">
                게시일
              </label>
              <input
                type="date"
                value={draft.postedAt}
                onChange={(e) => setDraft({ ...draft, postedAt: e.target.value })}
                className="w-full rounded-lg bg-gray-100 px-3 py-2.5 text-body-small focus:bg-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setAdding(false)
                setDraft(EMPTY)
              }}
              className="btn-secondary"
            >
              취소
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? '저장 중…' : '추가'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="rounded-lg bg-white p-6 text-body-small text-gray-500">불러오는 중…</p>
      ) : items.length === 0 ? (
        <p className="rounded-lg bg-white p-6 text-body-small text-gray-500">
          등록된 큐레이션이 없어요.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id}>
              <article
                className={cn(
                  'overflow-hidden rounded-2xl bg-white shadow-sm',
                  !item.isActive && 'opacity-60',
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.caption}
                  className="aspect-square w-full object-cover"
                />
                <div className="p-4">
                  <p className="truncate-2 text-body-small text-gray-900">{item.caption}</p>
                  <p className="mt-1 text-caption text-gray-500">{item.postedAt} · 순서 {item.order}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(item)}
                      className="rounded-md bg-gray-100 px-2.5 py-1 text-caption font-medium text-gray-700 hover:bg-gray-200"
                    >
                      {item.isActive ? '비활성' : '활성'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReorder(item, -10)}
                      className="rounded-md bg-gray-100 px-2.5 py-1 text-caption font-medium text-gray-700 hover:bg-gray-200"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReorder(item, 10)}
                      className="rounded-md bg-gray-100 px-2.5 py-1 text-caption font-medium text-gray-700 hover:bg-gray-200"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      aria-label="삭제"
                      className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:text-red-500"
                    >
                      <TrashIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
