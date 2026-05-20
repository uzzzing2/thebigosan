'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'

export interface ResultActionsProps {
  /** DOM id of the element to export as PNG */
  captureTargetId: string
  /** File name without extension */
  fileName?: string
}

export function ResultActions({
  captureTargetId,
  fileName = '이권재-맞춤공약',
}: ResultActionsProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  async function handleSaveImage() {
    const node = document.getElementById(captureTargetId)
    if (!node) {
      toast.error('결과 영역을 찾지 못했어요. 잠시 후 다시 시도해주세요.')
      return
    }
    setSaving(true)
    try {
      const { toPng } = await import('html-to-image')
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#FAF7F2',
      })
      const link = document.createElement('a')
      link.download = `${fileName}.png`
      link.href = dataUrl
      link.click()
      toast.success('이미지로 저장되었어요')
    } catch (e) {
      console.error(e)
      toast.error('이미지 저장 중 문제가 발생했어요')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <button
        type="button"
        onClick={handleSaveImage}
        disabled={saving}
        className="btn-primary"
      >
        {saving ? '저장 중…' : '이미지로 저장'}
      </button>
      <Link href="/pledges" className="btn-secondary">
        공약 전체 보기
      </Link>
      <button
        type="button"
        onClick={() => router.push(`/pledges?tab=match&reset=${Date.now()}`)}
        className="btn-secondary"
      >
        다시 하기
      </button>
    </div>
  )
}
