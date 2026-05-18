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
          오늘은 본선거일입니다! 투표소 찾기
        </>
      ) : state.kind === 'before' ? (
        <>
          <span className="hidden sm:inline">
            <span aria-hidden="true">🗓️ </span>
            본선거 6.3까지 <strong className="font-bold">D-{state.days}</strong>
            <span className="mx-2 opacity-60">·</span>
            사전투표 5.29~5.30
          </span>
          <span className="sm:hidden">
            <strong className="font-bold">D-{state.days}</strong>
            <span className="mx-2 opacity-60">·</span>
            사전 5.29~5.30
          </span>
        </>
      ) : (
        <>제9회 전국동시지방선거가 종료되었습니다.</>
      )}
    </div>
  )
}
