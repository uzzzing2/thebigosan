'use client'

import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'lkj_cheer_liked_ids'

function read(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw)
    return new Set(Array.isArray(arr) ? arr.filter((s) => typeof s === 'string') : [])
  } catch {
    return new Set()
  }
}

function write(set: Set<string>) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
  } catch {
    // noop
  }
}

export function useLikedCheers() {
  const [liked, setLiked] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    setLiked(read())
  }, [])

  const toggle = useCallback((id: string, on: boolean) => {
    setLiked((prev) => {
      const next = new Set(prev)
      if (on) next.add(id)
      else next.delete(id)
      write(next)
      return next
    })
  }, [])

  return { liked, toggle }
}
