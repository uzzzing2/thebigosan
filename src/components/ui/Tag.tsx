import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type TagTone = 'red' | 'blue' | 'gray'

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: TagTone
}

const toneClasses: Record<TagTone, string> = {
  red: 'bg-red-50 text-red-500',
  blue: 'bg-blue-50 text-blue-500',
  gray: 'bg-gray-100 text-gray-700',
}

export function Tag({ tone = 'red', className, children, ...props }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md',
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
