'use client'

import { useStoredNickname } from '@/app/cheers/useStoredNickname'

/** 결과 페이지 메인 헤드라인. 닉네임 있으면 닉네임으로, 없으면 '시민'으로. */
export function ResultHeadline({ fallback = '시민' }: { fallback?: string }) {
  const { nickname } = useStoredNickname()
  const name = nickname || fallback
  return (
    <h1 className="mt-3 text-[32px] font-extrabold tracking-[-0.02em] text-gray-900 md:text-display-2">
      {name}님께 추천드리는
      <br />
      공약입니다
    </h1>
  )
}
