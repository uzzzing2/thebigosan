'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  NewspaperIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import type { User } from 'firebase/auth'
import { cn } from '@/lib/cn'
import { signOutAdmin } from '@/lib/auth'

const NAV = [
  { href: '/admin', label: '대시보드', icon: ChartBarIcon },
  { href: '/admin/cheers', label: '응원 관리', icon: ChatBubbleLeftRightIcon },
  { href: '/admin/press', label: '보도자료', icon: NewspaperIcon },
  { href: '/admin/sns', label: 'SNS 큐레이션', icon: PhotoIcon },
  { href: '/admin/settings', label: '설정', icon: Cog6ToothIcon },
] as const

export function AdminShell({ user, children }: { user: User; children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  async function handleSignOut() {
    await signOutAdmin()
    router.replace('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar — desktop */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-gray-200 bg-white md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-5">
          <span className="text-body-large font-bold text-gray-900">관리자</span>
          <span className="rounded-md bg-red-50 px-2 py-0.5 text-caption font-medium text-red-500">
            beta
          </span>
        </div>
        <nav className="flex-1 px-3 py-4" aria-label="관리자 메뉴">
          <ul className="space-y-1">
            {NAV.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-small font-medium transition-colors',
                      active
                        ? 'bg-red-50 text-red-500'
                        : 'text-gray-700 hover:bg-gray-100',
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="border-t border-gray-200 p-4">
          <p className="truncate text-caption text-gray-500">{user.email}</p>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-body-small text-gray-700 transition-colors hover:bg-gray-100"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="메뉴 열기"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-900"
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <span className="text-body font-bold text-gray-900">관리자</span>
          <Link href="/" className="text-caption text-gray-500">
            사이트
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-gray-900/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-white">
            <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4">
              <span className="text-body font-bold text-gray-900">관리자</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="메뉴 닫기"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-900"
              >
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4">
              <ul className="space-y-1">
                {NAV.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-small font-medium transition-colors',
                          active
                            ? 'bg-red-50 text-red-500'
                            : 'text-gray-700 hover:bg-gray-100',
                        )}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
            <div className="border-t border-gray-200 p-4">
              <p className="truncate text-caption text-gray-500">{user.email}</p>
              <button
                type="button"
                onClick={handleSignOut}
                className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-body-small text-gray-700 transition-colors hover:bg-gray-100"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
                로그아웃
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
