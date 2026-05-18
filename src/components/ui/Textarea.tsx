import { forwardRef, useId } from 'react'
import type { TextareaHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode
  helper?: ReactNode
  error?: string
  requiredMark?: boolean
  counter?: { current: number; max: number }
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { id, label, helper, error, requiredMark, counter, className, ...props },
  ref,
) {
  const auto = useId()
  const textareaId = id ?? auto
  const helperId = `${textareaId}-helper`
  const errorId = `${textareaId}-error`

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-900">
          {label}
          {requiredMark && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(helper && helperId, error && errorId) || undefined}
        className={cn(
          'w-full px-4 py-3.5 bg-gray-100 focus:bg-white',
          'text-base text-gray-900 placeholder-gray-500',
          'rounded-xl resize-none transition-all duration-200',
          'focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-2 focus:border-red-500',
          error && 'border-2 border-red-500',
          className,
        )}
        {...props}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-h-[1rem] text-xs">
          {error ? (
            <span id={errorId} role="alert" className="text-red-500">
              {error}
            </span>
          ) : helper ? (
            <span id={helperId} className="text-gray-500">
              {helper}
            </span>
          ) : null}
        </div>
        {counter && (
          <span className="shrink-0 text-xs text-gray-500">
            {counter.current} / {counter.max}
          </span>
        )}
      </div>
    </div>
  )
})
