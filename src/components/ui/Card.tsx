import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'article' | 'section'
  interactive?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'none'
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
} as const

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { as: Tag = 'div', interactive = false, padding = 'md', className, children, ...props },
  ref,
) {
  return (
    <Tag
      ref={ref as never}
      className={cn(
        'bg-white rounded-2xl shadow-md transition-all duration-300 ease-out-soft',
        paddingClasses[padding],
        interactive && 'hover:shadow-lg hover:-translate-y-1 cursor-pointer',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
})
