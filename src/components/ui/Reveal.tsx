'use client'

import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'

export interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  as?: ElementType
  /** seconds */
  delay?: number
  /** seconds */
  duration?: number
  /** initial Y offset in px */
  offset?: number
  /** trigger only once when entering viewport (default true) */
  once?: boolean
  /** viewport amount (0~1) — how much of element must be visible to trigger */
  amount?: number
  children: ReactNode
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function Reveal({
  as,
  delay = 0,
  duration = 0.5,
  offset = 16,
  once = true,
  amount = 0.2,
  children,
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion()
  const MotionTag = motion.create(as ?? 'div')

  if (reduce) {
    return <MotionTag {...rest}>{children}</MotionTag>
  }

  return (
    <MotionTag
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

export interface RevealStaggerProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  as?: ElementType
  /** seconds between children */
  stagger?: number
  /** seconds before first child starts */
  initialDelay?: number
  once?: boolean
  amount?: number
  children: ReactNode
}

export function RevealStagger({
  as,
  stagger = 0.08,
  initialDelay = 0,
  once = true,
  amount = 0.2,
  children,
  ...rest
}: RevealStaggerProps) {
  const reduce = useReducedMotion()
  const MotionTag = motion.create(as ?? 'div')

  if (reduce) {
    return <MotionTag {...rest}>{children}</MotionTag>
  }

  return (
    <MotionTag
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: stagger,
            delayChildren: initialDelay,
          },
        },
      }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

export function RevealItem({
  as,
  offset = 12,
  duration = 0.5,
  children,
  ...rest
}: Omit<HTMLMotionProps<'div'>, 'children'> & {
  as?: ElementType
  offset?: number
  duration?: number
  children: ReactNode
}) {
  const reduce = useReducedMotion()
  const MotionTag = motion.create(as ?? 'div')

  if (reduce) {
    return <MotionTag {...rest}>{children}</MotionTag>
  }

  return (
    <MotionTag
      variants={{
        hidden: { opacity: 0, y: offset },
        show: { opacity: 1, y: 0, transition: { duration, ease: EASE } },
      }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}
