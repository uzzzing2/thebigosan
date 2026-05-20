'use client'

import { useEffect, useState } from 'react'
import { getDDayState, type DDayState } from '@/lib/dday'

export function TopBar() {
  const [state, setState] = useState<DDayState | null>(null)

  useEffect(() => {
    setState(getDDayState())
    const id = setInterval(() => setState(getDDayState()), 60 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  if (!state) {
    return (
      <div
        className="w-full bg-red-500 text-white text-sm font-medium text-center px-4 py-2.5"
        aria-hidden="true"
      >
        &nbsp;
      </div>
    )
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full bg-red-500 text-white text-sm font-medium text-center px-4 py-2.5"
    >
      {state.kind === 'day' ? (
        <>
          <span aria-hidden="true">🗳️ </span>
          오늘은 <strong className="font-bold">제9회 전국동시지방선거</strong> 본선거일입니다! 투표소 찾기
        </>
      ) : state.kind === 'before' ? (
        <>
          <span className="hidden sm:inline">
            <span className="opacity-80">
              <span aria-hidden="true">🗓️ </span>
              제9회 전국동시지방선거
            </span>
            <span className="mx-2 opacity-50">·</span>
            <span className="text-base font-extrabold tracking-tight">
              본선거 6.3까지 <span className="ml-1 rounded-md bg-white px-2 py-0.5 text-red-500">D-{state.days}</span>
            </span>
            <span className="mx-2 opacity-50">·</span>
            <span className="opacity-80">사전투표 5.29~5.30</span>
          </span>
          <span className="sm:hidden inline-flex items-center gap-2">
            <span className="opacity-80">제9회 지방선거</span>
            <span className="text-base font-extrabold tracking-tight">
              6.3 <span className="rounded-md bg-white px-1.5 py-0.5 text-red-500">D-{state.days}</span>
            </span>
            <span className="opacity-80">사전 5.29~30</span>
          </span>
        </>
      ) : (
        <>제9회 전국동시지방선거가 종료되었습니다.</>
      )}
    </div>
  )
}
