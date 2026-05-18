'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // TODO Step 10: send to error tracking (Sentry / GA event)
    console.error(error)
  }, [error])

  return (
    <section className="bg-white py-20 md:py-24 lg:py-32">
      <div className="container-base flex flex-col items-center text-center">
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-gray-900 md:text-heading-1">
          잠시 후 다시 시도해주세요
        </h1>
        <p className="mt-4 text-body-large text-gray-700">
          시스템에 일시적 문제가 발생했어요
        </p>
        <div className="mt-10 flex gap-3">
          <button type="button" onClick={reset} className="btn-primary">
            새로고침
          </button>
          <Link href="/" className="btn-secondary">
            홈으로
          </Link>
        </div>
        {error.digest && (
          <p className="mt-8 text-caption text-gray-500">
            오류 코드: {error.digest}
          </p>
        )}
      </div>
    </section>
  )
}
