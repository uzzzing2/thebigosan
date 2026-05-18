'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Modal } from '@/components/ui'
import {
  REPORT_REASONS,
  reportFormSchema,
  type ReportFormValues,
} from '@/lib/validators/cheer'
import { writeReport } from '@/lib/firestore/cheers'

export interface ReportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  targetCheerId?: string
}

export function ReportModal({ open, onOpenChange, targetCheerId }: ReportModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
  })

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => reset(), 200)
      return () => clearTimeout(t)
    }
  }, [open, reset])

  async function onSubmit(values: ReportFormValues) {
    try {
      if (targetCheerId) {
        await writeReport({ cheerId: targetCheerId, reason: values.reason })
      }
      toast.success('신고가 접수되었어요', {
        description: '검토 후 조치하겠습니다.',
      })
      onOpenChange(false)
    } catch (e) {
      console.error(e)
      toast.error('신고 접수 중 문제가 발생했어요')
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="🚩 응원 신고하기"
      description="신고 사유를 선택해주세요"
      size="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <fieldset>
          <legend className="sr-only">신고 사유</legend>
          <ul className="space-y-2">
            {REPORT_REASONS.map((r) => (
              <li key={r.value}>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-cream-50 px-4 py-3 transition-colors hover:bg-cream-100">
                  <input
                    type="radio"
                    value={r.value}
                    {...register('reason')}
                    className="h-5 w-5 cursor-pointer accent-red-500"
                  />
                  <span className="text-body text-gray-900">{r.label}</span>
                </label>
              </li>
            ))}
          </ul>
          {errors.reason && (
            <p role="alert" className="mt-2 text-xs text-red-500">
              {errors.reason.message}
            </p>
          )}
        </fieldset>

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
            {isSubmitting ? '접수 중…' : '신고하기'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
