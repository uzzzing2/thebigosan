'use client'

import { Toaster as SonnerToaster } from 'sonner'
import { useEffect, useState } from 'react'

type Position = 'top-right' | 'bottom-center'

export function Toaster() {
  const [position, setPosition] = useState<Position>('top-right')

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    const apply = () => setPosition(mql.matches ? 'bottom-center' : 'top-right')
    apply()
    mql.addEventListener('change', apply)
    return () => mql.removeEventListener('change', apply)
  }, [])

  return (
    <SonnerToaster
      position={position}
      duration={3000}
      closeButton
      richColors={false}
      toastOptions={{
        classNames: {
          toast:
            'bg-white text-gray-900 shadow-lg rounded-2xl border-0 px-5 py-4 font-medium',
          title: 'text-body text-gray-900',
          description: 'text-body-small text-gray-700',
          success: 'text-red-500',
          error: 'text-red-700',
          actionButton: 'bg-red-500 text-white rounded-md px-3 py-1',
        },
      }}
    />
  )
}
