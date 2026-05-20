'use client'

import { useEffect, useState } from 'react'
import { CountUp, Reveal } from '@/components/ui'
import { CheerWriteTrigger } from '@/components/cheers/CheerWriteTrigger'
import type { Cheer } from '@/lib/data/cheers'

function CheerCard({ nickname, content }: { nickname: string; content: string }) {
  return (
    <article className="mr-4 inline-flex w-[280px] shrink-0 flex-col gap-2 rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-body-small font-medium text-gray-900">
        <span aria-hidden="true" className="mr-1">💬</span>
        {nickname}
      </p>
      <p className="truncate-1 text-body text-gray-700">“{content}”</p>
    </article>
  )
}

export function MarqueeSection() {
  const [items, setItems] = useState<Cheer[]>([])
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    let cancelled = false

    // Lazy-load firebase only on the client to keep the SSR bundle
    // (and Cloudflare Worker bundle) free of protobufjs/grpc/eval users.
    Promise.all([
      import('@/lib/firebase'),
      import('@/lib/firestore/cheers'),
    ]).then(([{ isFirebaseConfigured }, { listenTopCheers, countCheers }]) => {
      if (cancelled) return
      if (!isFirebaseConfigured) return
      unsubscribe = listenTopCheers((live) => setItems(live), 20)
      countCheers()
        .then((n) => {
          if (!cancelled) setCount(n)
        })
        .catch(() => {})
    })

    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [])

  const topRow = items.length > 0 ? [...items, ...items] : []
  const reversed = [...items].reverse()
  const bottomRow = reversed.length > 0 ? [...reversed, ...reversed] : []

  return (
    <section
      aria-labelledby="cheers-heading"
      className="bg-cream-50 py-16 md:py-20 lg:py-24"
    >
      <Reveal className="container-base text-center">
        <h2
          id="cheers-heading"
          className="text-[28px] font-bold tracking-[-0.02em] text-gray-900 md:text-heading-1"
        >
          함께하는 시민들의 한마디
        </h2>
        <p className="mt-3 text-body md:text-body-large text-gray-700">
          <CountUp to={count} className="font-bold text-red-500" />
          명의 시민이 응원을 보냈어요
        </p>
      </Reveal>

      {items.length > 0 && (
        <div className="group mt-10 space-y-4 overflow-hidden">
          <div className="flex w-max animate-marqueeLeft group-hover:[animation-play-state:paused]">
            {topRow.map((cheer, i) => (
              <CheerCard key={`top-${cheer.id}-${i}`} nickname={cheer.nickname} content={cheer.content} />
            ))}
          </div>
          <div className="flex w-max animate-marqueeRight group-hover:[animation-play-state:paused]">
            {bottomRow.map((cheer, i) => (
              <CheerCard key={`bot-${cheer.id}-${i}`} nickname={cheer.nickname} content={cheer.content} />
            ))}
          </div>
        </div>
      )}

      <div className="container-base mt-10 flex justify-center">
        <CheerWriteTrigger>응원 한마디 남기기 →</CheerWriteTrigger>
      </div>
    </section>
  )
}
