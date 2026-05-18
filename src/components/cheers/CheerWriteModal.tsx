'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Modal, Input, Textarea } from '@/components/ui'
import { CheerGuidelines } from './CheerGuidelines'
import { cheerFormSchema, type CheerFormValues } from '@/lib/validators/cheer'
import type { Cheer } from '@/lib/data/cheers'
import {
  CheerForbiddenError,
  CheerRateLimitError,
  writeCheer,
} from '@/lib/firestore/cheers'

export interface CheerWriteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitted?: (cheer: Cheer) => void
}

export function CheerWriteModal({ open, onOpenChange, onSubmitted }: CheerWriteModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CheerFormValues>({
    resolver: zodResolver(cheerFormSchema),
    mode: 'onTouched',
    defaultValues: { nickname: '', content: '', agree: false as unknown as true },
  })

  const content = watch('content') ?? ''

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => reset(), 200)
      return () => clearTimeout(t)
    }
  }, [open, reset])

  async function onSubmit(values: CheerFormValues) {
    try {
      const cheer = await writeCheer({
        nickname: values.nickname,
        content: values.content,
      })
      onSubmitted?.(cheer)
      toast.success('응원이 등록되었어요', { description: '소중한 한마디 감사합니다.' })
      onOpenChange(false)
    } catch (e) {
      if (e instanceof CheerRateLimitError) {
        toast.error(e.message)
      } else if (e instanceof CheerForbiddenError) {
        setError('content', { message: '사용할 수 없는 표현이 포함되어 있어요' })
      } else {
        console.error(e)
        toast.error('응원 등록 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.')
      }
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="💬 응원 한마디 남기기"
      description="더 큰 오산을 위한 한마디를 남겨주세요"
      mobileBottomSheet
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="닉네임"
          requiredMark
          helper="영문으로 시작 · 영문/숫자/언더스코어(_) · 4~20자"
          placeholder="osan_2026"
          autoComplete="off"
          inputMode="text"
          error={errors.nickname?.message}
          {...register('nickname')}
        />

        <Textarea
          label="응원 한마디"
          requiredMark
          placeholder="내용을 입력해주세요..."
          rows={5}
          counter={{ current: content.length, max: 100 }}
          maxLength={100}
          error={errors.content?.message}
          {...register('content')}
        />

        <div>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-white p-3">
            <input
              type="checkbox"
              {...register('agree')}
              className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-red-500"
            />
            <span className="text-body-small text-gray-900">
              운영원칙에 동의합니다 <span className="text-red-500">*</span>
            </span>
          </label>
          {errors.agree && (
            <p role="alert" className="mt-1 px-3 text-xs text-red-500">
              {errors.agree.message}
            </p>
          )}
          <div className="mt-2">
            <CheerGuidelines />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            취소
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? '보내는 중…' : '응원 보내기 →'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
