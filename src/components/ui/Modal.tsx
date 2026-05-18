'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { XMarkIcon } from '@heroicons/react/24/outline'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: ReactNode
  description?: ReactNode
  /** On mobile, render as a bottom sheet (used for forms). Desktop is always centered. */
  mobileBottomSheet?: boolean
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  /** Hide the default close button at top-right */
  hideClose?: boolean
}

const sizeClasses: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'md:max-w-[420px]',
  md: 'md:max-w-[560px]',
  lg: 'md:max-w-[720px]',
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  mobileBottomSheet = false,
  size = 'md',
  children,
  hideClose = false,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50 bg-gray-900/45 backdrop-blur-md animate-fadeIn"
        />
        <Dialog.Content
          className={cn(
            'fixed z-50 bg-white shadow-modal focus:outline-none',
            mobileBottomSheet
              ? 'inset-x-0 bottom-0 w-full rounded-t-3xl p-6 pt-7 animate-slideUp md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:w-[calc(100vw-2rem)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:p-8 md:animate-modalIn'
              : 'left-1/2 top-1/2 w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-3xl p-6 md:p-8 animate-modalIn',
            sizeClasses[size],
          )}
        >
          {(title || !hideClose) && (
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="min-w-0">
                {title && (
                  <Dialog.Title className="text-heading-3 text-gray-900 md:text-heading-2">
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description className="mt-2 text-body-small text-gray-700">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              {!hideClose && (
                <Dialog.Close
                  aria-label="닫기"
                  className="-mr-2 -mt-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
                >
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </Dialog.Close>
              )}
            </div>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { Dialog as ModalPrimitive }
