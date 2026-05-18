'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

export interface CountUpProps {
  to: number
  /** ms */
  duration?: number
  /** locale formatter (default: ko-KR thousands separator) */
  format?: (n: number) => string
  className?: string
  /** Restart animation each time element enters viewport. Default false (once). */
  every?: boolean
}

const EASE_OUT = (t: number) => 1 - Math.pow(1 - t, 3)

export function CountUp({
  to,
  duration = 1500,
  format = (n) => n.toLocaleString('ko-KR'),
  className,
  every = false,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: !every, amount: 0.5 })
  const [value, setValue] = useState(reduce ? to : 0)

  useEffect(() => {
    if (reduce) {
      setValue(to)
      return
    }
    if (!inView) return
    let rafId = 0
    const start = performance.now()
    const from = 0

    const tick = (now: number) => {
      const elapsed = now - start
      const t = Math.min(1, elapsed / duration)
      setValue(Math.round(from + (to - from) * EASE_OUT(t)))
      if (t < 1) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [inView, to, duration, reduce])

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  )
}
