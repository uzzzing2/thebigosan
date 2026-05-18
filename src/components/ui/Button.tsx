import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'text'
type ButtonSize = 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const sizeClasses: Record<ButtonSize, string> = {
  md: 'px-5 py-3 text-base',
  lg: 'px-6 py-3.5 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'lg', className, children, leftIcon, rightIcon, type = 'button', ...props },
  ref,
) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 ease-out-soft focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'

  const byVariant: Record<ButtonVariant, string> = {
    primary:
      'bg-red-500 text-white shadow-md hover:bg-red-600 hover:shadow-lg hover:-translate-y-0.5 focus:ring-4 focus:ring-red-500/20',
    secondary:
      'bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200/40',
    text:
      'text-red-500 hover:text-red-600 hover:underline px-0 py-0 shadow-none',
  }

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        base,
        variant !== 'text' && sizeClasses[size],
        byVariant[variant],
        className,
      )}
      {...props}
    >
      {leftIcon ? <span className="inline-flex shrink-0">{leftIcon}</span> : null}
      <span>{children}</span>
      {rightIcon ? <span className="inline-flex shrink-0">{rightIcon}</span> : null}
    </button>
  )
})
