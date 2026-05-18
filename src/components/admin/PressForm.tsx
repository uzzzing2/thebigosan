'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Input } from '@/components/ui'
import { RichTextEditor } from './RichTextEditor'
import {
  createPress,
  deletePress,
  updatePress,
  type AdminPressItem,
  type PressInput,
} from '@/lib/firestore/admin'

const CATEGORIES = [
  { value: '정책', label: '정책' },
  { value: '칼럼', label: '칼럼' },
] as const

export interface PressFormProps {
  initial?: AdminPressItem
}

export function PressForm({ initial }: PressFormProps) {
  const router = useRouter()
  const isEdit = Boolean(initial)

  const [category, setCategory] = useState<'정책' | '칼럼'>(initial?.category ?? '정책')
  const [title, setTitle] = useState(initial?.title ?? '')
  const [body, setBody] = useState(initial?.body ?? '')
  const [publishedAt, setPublishedAt] = useState(
    initial?.publishedAt ?? new Date().toISOString().slice(0, 10),
  )
  const [thumbnail, setThumbnail] = useState(initial?.thumbnail ?? '')
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? false)
  const [mediaLinks, setMediaLinks] = useState<{ name: string; url: string }[]>(
    initial?.mediaLinks ?? [],
  )
  const [saving, setSaving] = useState(false)

  function addMediaLink() {
    setMediaLinks((prev) => [...prev, { name: '', url: '' }])
  }
  function updateMediaLink(i: number, patch: Partial<{ name: string; url: string }>) {
    setMediaLinks((prev) => prev.map((m, idx) => (idx === i ? { ...m, ...patch } : m)))
  }
  function removeMediaLink(i: number) {
    setMediaLinks((prev) => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('제목을 입력해주세요')
      return
    }
    setSaving(true)
    try {
      const input: PressInput = {
        category,
        title: title.trim(),
        body,
        publishedAt,
        thumbnail: thumbnail.trim() || undefined,
        mediaLinks: mediaLinks.filter((m) => m.name.trim() && m.url.trim()),
        isPublished,
      }
      if (initial) {
        await updatePress(initial.id, input)
        toast.success('보도자료를 수정했어요')
      } else {
        await createPress(input)
        toast.success('보도자료를 등록했어요')
      }
      router.push('/admin/press')
      router.refresh()
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!initial) return
    if (!confirm('이 보도자료를 삭제할까요? 되돌릴 수 없어요.')) return
    try {
      await deletePress(initial.id)
      toast.success('보도자료를 삭제했어요')
      router.push('/admin/press')
      router.refresh()
    } catch (err) {
      toast.error((err as Error).message)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-body-small font-medium text-gray-900">
              카테고리
            </label>
            <div className="flex gap-2">
              {CATEGORIES.map((c) => (
                <label
                  key={c.value}
                  className={`cursor-pointer rounded-lg px-4 py-2 text-body-small font-medium transition-colors ${
                    category === c.value
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={c.value}
                    checked={category === c.value}
                    onChange={() => setCategory(c.value)}
                    className="sr-only"
                  />
                  {c.label}
                </label>
              ))}
            </div>
          </div>

          <Input
            label="제목"
            requiredMark
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />

          <div>
            <label className="mb-2 block text-body-small font-medium text-gray-900">
              본문
            </label>
            <RichTextEditor value={body} onChange={setBody} />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-body-small font-medium text-gray-900">
                이 내용을 보도한 언론
              </label>
              <button type="button" onClick={addMediaLink} className="btn-text text-body-small">
                <PlusIcon className="h-4 w-4" aria-hidden="true" /> 추가
              </button>
            </div>
            {mediaLinks.length === 0 ? (
              <p className="rounded-lg bg-white p-3 text-body-small text-gray-500">
                추가된 보도 링크가 없어요.
              </p>
            ) : (
              <ul className="space-y-2">
                {mediaLinks.map((m, i) => (
                  <li key={i} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="언론사명"
                      value={m.name}
                      onChange={(e) => updateMediaLink(i, { name: e.target.value })}
                      className="flex-1 rounded-lg bg-white px-3 py-2 text-body-small"
                    />
                    <input
                      type="url"
                      placeholder="https://"
                      value={m.url}
                      onChange={(e) => updateMediaLink(i, { url: e.target.value })}
                      className="flex-[2] rounded-lg bg-white px-3 py-2 text-body-small"
                    />
                    <button
                      type="button"
                      onClick={() => removeMediaLink(i)}
                      aria-label="삭제"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:text-red-500"
                    >
                      <TrashIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <aside className="space-y-5 rounded-2xl bg-white p-5 shadow-sm">
          <div>
            <label className="mb-2 block text-body-small font-medium text-gray-900">
              게시일
            </label>
            <input
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="w-full rounded-lg bg-gray-100 px-3 py-2.5 text-body-small focus:bg-white"
            />
          </div>

          <Input
            label="썸네일 URL (선택)"
            type="url"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="https://..."
            helper="비워두면 기본 자리표시자가 보입니다"
          />

          <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-gray-100 p-3">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="mt-0.5 h-5 w-5 cursor-pointer accent-red-500"
            />
            <div>
              <span className="block text-body-small font-medium text-gray-900">
                바로 공개하기
              </span>
              <span className="text-caption text-gray-700">
                해제하면 작성/수정 후에도 사이트에는 노출되지 않아요
              </span>
            </div>
          </label>

          <div className="flex flex-col gap-2 pt-2">
            <button type="submit" disabled={saving} className="btn-primary w-full">
              {saving ? '저장 중…' : isEdit ? '수정 저장' : '발행하기'}
            </button>
            <Link href="/admin/press" className="btn-secondary w-full text-center">
              취소
            </Link>
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                className="mt-2 inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-body-small text-red-500 hover:bg-red-50"
              >
                <TrashIcon className="h-4 w-4" aria-hidden="true" />
                보도자료 삭제
              </button>
            )}
          </div>
        </aside>
      </div>
    </form>
  )
}
