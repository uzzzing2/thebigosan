'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/cn'
import { CANDIDATE, NAV_ITEMS } from '@/lib/constants'

export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [mobileOpen])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full bg-white transition-shadow duration-200',
        scrolled && 'shadow-sm',
      )}
    >
      <div className="container-base flex h-[60px] items-center justify-between md:h-[72px]">
        <Link
          href="/"
          aria-label={`${CANDIDATE.name} ${CANDIDATE.campName} 홈으로`}
          className="flex items-center"
        >
          <Image
            src="/images/logo-header.png"
            alt={`${CANDIDATE.name} ${CANDIDATE.campName}`}
            width={615}
            height={195}
            priority
            className="h-10 w-auto object-contain md:h-12"
          />
        </Link>

        <nav className="hidden md:block" aria-label="주요 메뉴">
          <ul className="flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'relative inline-flex items-center py-2 text-base font-medium transition-colors',
                      active ? 'text-red-500' : 'text-gray-900 hover:text-red-500',
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.label}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-red-500"
                      />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="메뉴 열기"
          aria-expanded={mobileOpen}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-900 hover:text-red-500"
        >
          <Bars3Icon className="h-7 w-7" aria-hidden="true" />
        </button>
      </div>

      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="전체 메뉴"
          className="fixed inset-0 z-50 flex flex-col bg-white animate-fadeIn md:hidden"
        >
          <div className="flex h-[60px] items-center justify-between px-4">
            <span className="text-base font-bold text-gray-900">메뉴</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="메뉴 닫기"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-900 hover:text-red-500"
            >
              <XMarkIcon className="h-7 w-7" aria-hidden="true" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-6 pt-6 pb-10" aria-label="전체 메뉴">
            <ul className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'block rounded-lg py-3 text-[22px] font-bold transition-colors',
                        active ? 'text-red-500' : 'text-gray-900 hover:text-red-500',
                      )}
                      aria-current={active ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
