'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { Input } from '@/components/ui'
import { cn } from '@/lib/cn'
import {
  type AdminSnsItem,
  type SnsInput,
  createSns,
  deleteAllSns,
  deleteSns,
  listAllSns,
  migrateSnsFromStatic,
  normalizeSnsOrder,
  updateSns,
  uploadSnsImage,
} from '@/lib/firestore/admin'
import { INSTAGRAM_POSTS } from '@/lib/data/instagram'

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
  const [migrating, setMigrating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<
    Pick<SnsInput, 'imageUrl' | 'caption' | 'originalUrl' | 'postedAt'>
  >({ imageUrl: '', caption: '', originalUrl: '', postedAt: '' })
  const [savingEdit, setSavingEdit] = useState(false)
  const [uploadingFor, setUploadingFor] = useState<'create' | 'edit' | null>(null)
  const [normalizing, setNormalizing] = useState(false)
  const [deletingAll, setDeletingAll] = useState(false)

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
      const maxOrder = items.reduce((m, i) => Math.max(m, i.order), 0)
      await createSns({
        ...draft,
        order: draft.order || maxOrder + 1,
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

  async function handleReorder(item: AdminSnsItem, direction: -1 | 1) {
    const sorted = [...items].sort((a, b) => a.order - b.order)
    const idx = sorted.findIndex((p) => p.id === item.id)
    const swapIdx = idx + direction
    if (swapIdx < 0 || swapIdx >= sorted.length) return
    const other = sorted[swapIdx]
    // Swap order values; if they happen to be equal, separate them by 1.
    let myNewOrder = other.order
    let otherNewOrder = item.order
    if (myNewOrder === otherNewOrder) {
      otherNewOrder = direction === -1 ? myNewOrder + 1 : myNewOrder - 1
    }
    try {
      await Promise.all([
        updateSns(item.id, { order: myNewOrder }),
        updateSns(other.id, { order: otherNewOrder }),
      ])
      setItems((prev) =>
        prev
          .map((p) => {
            if (p.id === item.id) return { ...p, order: myNewOrder }
            if (p.id === other.id) return { ...p, order: otherNewOrder }
            return p
          })
          .sort((a, b) => a.order - b.order),
      )
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  async function handleFileUpload(
    target: 'create' | 'edit',
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting same file later
    if (!file) return
    setUploadingFor(target)
    try {
      const url = await uploadSnsImage(file)
      if (target === 'create') {
        setDraft((d) => ({ ...d, imageUrl: url }))
      } else {
        setEditDraft((d) => ({ ...d, imageUrl: url }))
      }
      toast.success('이미지를 업로드했어요')
    } catch (err) {
      toast.error(`업로드 실패: ${(err as Error).message}`)
    } finally {
      setUploadingFor(null)
    }
  }

  function startEdit(item: AdminSnsItem) {
    setEditingId(item.id)
    setEditDraft({
      imageUrl: item.imageUrl ?? '',
      caption: item.caption ?? '',
      originalUrl: item.originalUrl ?? '',
      postedAt: item.postedAt ?? '',
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditDraft({ imageUrl: '', caption: '', originalUrl: '', postedAt: '' })
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingId) return
    if (!editDraft.originalUrl.trim()) {
      toast.error('원본 URL은 필수입니다')
      return
    }
    if (!editDraft.postedAt) {
      toast.error('게시일을 입력해주세요')
      return
    }
    setSavingEdit(true)
    try {
      await updateSns(editingId, {
        imageUrl: editDraft.imageUrl.trim(),
        caption: editDraft.caption,
        originalUrl: editDraft.originalUrl.trim(),
        postedAt: editDraft.postedAt,
      })
      setItems((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                imageUrl: editDraft.imageUrl.trim(),
                caption: editDraft.caption,
                originalUrl: editDraft.originalUrl.trim(),
                postedAt: editDraft.postedAt,
              }
            : p,
        ),
      )
      toast.success('수정했어요')
      cancelEdit()
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setSavingEdit(false)
    }
  }

  async function handleDeleteAll() {
    const typed = prompt(
      `정말 모든 SNS 큐레이션 ${items.length}건을 삭제할까요?\n되돌릴 수 없습니다.\n진행하려면 DELETE 를 입력하세요.`,
    )
    if (typed !== 'DELETE') {
      if (typed !== null) toast.info('취소했어요')
      return
    }
    setDeletingAll(true)
    try {
      const removed = await deleteAllSns()
      setItems([])
      toast.success(`${removed}건을 삭제했어요`)
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setDeletingAll(false)
    }
  }

  async function handleNormalize() {
    if (!confirm(`현재 화면 순서대로 order 값을 1, 2, 3, ...로 정리합니다. 진행할까요?`)) return
    setNormalizing(true)
    try {
      const updated = await normalizeSnsOrder()
      toast.success(`순서를 정리했어요 — ${updated}건 변경`)
      await refresh()
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setNormalizing(false)
    }
  }

  async function handleMigrate() {
    if (
      !confirm(
        `정적 파일의 인스타 게시물 ${INSTAGRAM_POSTS.length}건을 Firestore에 가져옵니다. 이미 같은 ID가 있는 항목은 건너뜁니다. 진행할까요?`,
      )
    )
      return
    setMigrating(true)
    try {
      const { created, skipped } = await migrateSnsFromStatic()
      toast.success(`마이그레이션 완료 — 새로 추가 ${created}건, 건너뜀 ${skipped}건`)
      await refresh()
    } catch (e) {
      toast.error(`마이그레이션 실패: ${(e as Error).message}`)
    } finally {
      setMigrating(false)
    }
  }

  const missingStaticCount = INSTAGRAM_POSTS.filter(
    (s) => !items.some((i) => i.id === s.id),
  ).length

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-heading-1 text-gray-900">SNS 큐레이션</h1>
        <div className="flex flex-wrap gap-2">
          {items.length > 0 && !loading && (
            <button
              type="button"
              onClick={handleNormalize}
              disabled={normalizing}
              className="btn-secondary"
            >
              {normalizing ? '정리 중…' : '순서 정리 (1, 2, 3…)'}
            </button>
          )}
          {items.length > 0 && !loading && (
            <button
              type="button"
              onClick={handleDeleteAll}
              disabled={deletingAll}
              className="btn-secondary text-red-500"
            >
              <TrashIcon className="h-5 w-5" aria-hidden="true" />
              {deletingAll ? '삭제 중…' : `전체 삭제 (${items.length}건)`}
            </button>
          )}
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
                : `기존 인스타 게시물 가져오기 (${missingStaticCount}건)`}
            </button>
          )}
          {!adding && (
            <button type="button" onClick={() => setAdding(true)} className="btn-primary">
              <PlusIcon className="h-5 w-5" aria-hidden="true" />새 항목
            </button>
          )}
        </div>
      </header>

      {missingStaticCount > 0 && !loading && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-caption text-blue-700">
          정적 파일에 있는 인스타 게시물 {INSTAGRAM_POSTS.length}건 중 {missingStaticCount}건이
          아직 Firestore에 없습니다. &ldquo;기존 인스타 게시물 가져오기&rdquo; 버튼을 누르면 누락된
          항목만 추가됩니다. 마이그레이션된 항목은 이미지 URL이 비어있어 그라데이션 플레이스홀더로
          표시되며, 필요 시 편집 기능으로 이미지를 채울 수 있습니다.
        </div>
      )}

      {adding && (
        <form onSubmit={handleCreate} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-heading-3 text-gray-900">새 인스타 항목</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Input
                label="이미지 URL"
                requiredMark
                value={draft.imageUrl}
                onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
                placeholder="https://... 또는 아래에서 파일 업로드"
              />
              <div className="mt-1.5 flex items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-1 text-caption text-red-500 hover:underline">
                  <ArrowUpTrayIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  파일 업로드
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload('create', e)}
                    disabled={uploadingFor === 'create'}
                  />
                </label>
                {uploadingFor === 'create' && (
                  <span className="text-caption text-gray-500">업로드 중…</span>
                )}
              </div>
              {draft.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={draft.imageUrl}
                  alt="미리보기"
                  className="mt-3 aspect-square w-full max-w-[180px] rounded-lg border border-gray-200 object-cover"
                />
              )}
            </div>
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
          {items.map((item, position) => (
            <li key={item.id}>
              <article
                className={cn(
                  'overflow-hidden rounded-2xl bg-white shadow-sm',
                  !item.isActive && 'opacity-60',
                )}
              >
                {editingId === item.id ? (
                  <form onSubmit={handleSaveEdit} className="space-y-3 p-4">
                    <div>
                      <Input
                        label="이미지 URL"
                        value={editDraft.imageUrl}
                        onChange={(e) =>
                          setEditDraft({ ...editDraft, imageUrl: e.target.value })
                        }
                        placeholder="https://... 또는 아래에서 파일 업로드"
                      />
                      <div className="mt-1.5 flex items-center gap-3">
                        <label className="inline-flex cursor-pointer items-center gap-1 text-caption text-red-500 hover:underline">
                          <ArrowUpTrayIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          파일 업로드
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload('edit', e)}
                            disabled={uploadingFor === 'edit'}
                          />
                        </label>
                        {uploadingFor === 'edit' && (
                          <span className="text-caption text-gray-500">업로드 중…</span>
                        )}
                      </div>
                      {editDraft.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={editDraft.imageUrl}
                          alt="미리보기"
                          className="mt-3 aspect-square w-full max-w-[180px] rounded-lg border border-gray-200 object-cover"
                        />
                      )}
                    </div>
                    <Input
                      label="원본 게시물 URL"
                      requiredMark
                      value={editDraft.originalUrl}
                      onChange={(e) =>
                        setEditDraft({ ...editDraft, originalUrl: e.target.value })
                      }
                      placeholder="https://instagram.com/..."
                    />
                    <Input
                      label="제목 / 캡션"
                      value={editDraft.caption}
                      onChange={(e) =>
                        setEditDraft({ ...editDraft, caption: e.target.value })
                      }
                      placeholder="간단한 설명"
                    />
                    <div>
                      <label className="mb-2 block text-body-small font-medium text-gray-900">
                        게시일 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={editDraft.postedAt}
                        onChange={(e) =>
                          setEditDraft({ ...editDraft, postedAt: e.target.value })
                        }
                        className="w-full rounded-lg bg-gray-100 px-3 py-2.5 text-body-small focus:bg-white"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="btn-secondary text-body-small"
                        disabled={savingEdit}
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="btn-primary text-body-small"
                        disabled={savingEdit}
                      >
                        {savingEdit ? '저장 중…' : '저장'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.caption}
                        className="aspect-square w-full object-cover"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="flex aspect-square w-full items-center justify-center bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white"
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
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate-2 text-body-small text-gray-900">
                          {item.caption || <span className="text-gray-400">(제목 없음)</span>}
                        </p>
                        <span className="shrink-0 rounded-md bg-red-50 px-2 py-0.5 text-caption font-semibold text-red-500">
                          #{position + 1}
                        </span>
                      </div>
                      <p className="mt-1 text-caption text-gray-500">{item.postedAt} · order {item.order}</p>
                      <p className="mt-1 truncate text-caption text-gray-400">{item.originalUrl}</p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-caption font-medium text-gray-700 hover:bg-gray-200"
                        >
                          <PencilSquareIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          편집
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item)}
                          className="rounded-md bg-gray-100 px-2.5 py-1 text-caption font-medium text-gray-700 hover:bg-gray-200"
                        >
                          {item.isActive ? '비활성' : '활성'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReorder(item, -1)}
                          disabled={position === 0}
                          aria-label="위로"
                          className="rounded-md bg-gray-100 px-2.5 py-1 text-caption font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-gray-100"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReorder(item, 1)}
                          disabled={position === items.length - 1}
                          aria-label="아래로"
                          className="rounded-md bg-gray-100 px-2.5 py-1 text-caption font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-gray-100"
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
                  </>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
