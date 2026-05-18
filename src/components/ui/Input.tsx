import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode
  helper?: ReactNode
  error?: string
  requiredMark?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { id, label, helper, error, requiredMark, className, ...props },
  ref,
) {
  const auto = useId()
  const inputId = id ?? auto
  const helperId = `${inputId}-helper`
  const errorId = `${inputId}-error`

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-900">
          {label}
          {requiredMark && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(helper && helperId, error && errorId) || undefined}
        className={cn(
          'w-full px-4 py-3.5 bg-gray-100 focus:bg-white',
          'text-base text-gray-900 placeholder-gray-500',
          'rounded-xl transition-all duration-200',
          'focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-2 focus:border-red-500',
          error && 'border-2 border-red-500',
          className,
        )}
        {...props}
      />
      {helper && !error && (
        <p id={helperId} className="text-xs text-gray-500">
          {helper}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  )
})
