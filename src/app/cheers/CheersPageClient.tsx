'use client'

import { useEffect, useState } from 'react'
import { CheersList } from './CheersList'
import { TopCheers } from './TopCheers'
import { CheerWriteTrigger } from '@/components/cheers/CheerWriteTrigger'
import { ReportModal } from '@/components/cheers/ReportModal'
import { CountUp } from '@/components/ui'
import type { Cheer } from '@/lib/data/cheers'
import { isFirebaseConfigured } from '@/lib/firebase'
import { countCheers, listenCheers } from '@/lib/firestore/cheers'

export function CheersPageClient() {
  const [items, setItems] = useState<Cheer[]>([])
  const [count, setCount] = useState<number>(0)
  const [reportTarget, setReportTarget] = useState<string | null>(null)

  // Realtime feed
  useEffect(() => {
    if (!isFirebaseConfigured) return
    const unsubscribe = listenCheers((live) => {
      setItems(live)
    }, { limit: 600 })
    return unsubscribe
  }, [])

  // Total count (one-shot, refreshed when list size changes)
  useEffect(() => {
    if (!isFirebaseConfigured) return
    let cancelled = false
    countCheers()
      .then((n) => {
        if (!cancelled) setCount(n)
      })
      .catch(() => {
        // keep last good count
      })
    return () => {
      cancelled = true
    }
  }, [items.length])

  return (
    <>
      <section className="bg-cream-50 py-16 md:py-20 lg:py-24">
        <div className="container-base text-center">
          <h1 className="text-[40px] font-extrabold tracking-[-0.02em] text-gray-900 md:text-display-2">
            <span aria-hidden="true" className="mr-2">💬</span>
            함께하는 시민들의 한마디
          </h1>
          <p className="mt-5 text-body-large text-gray-700">
            <CountUp to={count} className="font-bold text-red-500" />
            명의 시민이 응원을 보냈어요
          </p>
          <div className="mt-8 flex justify-center">
            <CheerWriteTrigger />
          </div>
        </div>
      </section>

      <TopCheers />

      <section className="bg-white py-16 md:py-20 lg:py-24">
        <div className="container-base">
          <CheersList items={items} onReport={(id) => setReportTarget(id)} />
        </div>
      </section>

      <ReportModal
        open={reportTarget !== null}
        onOpenChange={(open) => !open && setReportTarget(null)}
        targetCheerId={reportTarget ?? undefined}
      />
    </>
  )
}
