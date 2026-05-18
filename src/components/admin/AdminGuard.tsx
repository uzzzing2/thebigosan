'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import type { User } from 'firebase/auth'
import { isAdminEmail, watchAuth } from '@/lib/auth'

export interface AdminGuardProps {
  children: (user: User) => ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [state, setState] = useState<
    | { kind: 'loading' }
    | { kind: 'authed'; user: User }
    | { kind: 'unauthed' }
  >({ kind: 'loading' })

  useEffect(() => {
    const unsubscribe = watchAuth((user) => {
      if (user && isAdminEmail(user.email)) {
        setState({ kind: 'authed', user })
      } else {
        setState({ kind: 'unauthed' })
      }
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (state.kind === 'unauthed' && pathname !== '/admin/login') {
      router.replace('/admin/login')
    }
  }, [state, pathname, router])

  if (state.kind === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-body text-gray-500">불러오는 중…</p>
      </div>
    )
  }

  if (state.kind === 'unauthed') {
    return null
  }

  return <>{children(state.user)}</>
}
