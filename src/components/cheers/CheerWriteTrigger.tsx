'use client'

import { useState, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { CheerWriteModal } from './CheerWriteModal'
import type { Cheer } from '@/lib/data/cheers'

export interface CheerWriteTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  onSubmitted?: (cheer: Cheer) => void
}

export function CheerWriteTrigger({
  variant = 'primary',
  className,
  children = '응원 한마디 남기기',
  onSubmitted,
  ...buttonProps
}: CheerWriteTriggerProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(variant === 'primary' ? 'btn-primary' : 'btn-secondary', className)}
        {...buttonProps}
      >
        {children}
      </button>
      <CheerWriteModal open={open} onOpenChange={setOpen} onSubmitted={onSubmitted} />
    </>
  )
}
