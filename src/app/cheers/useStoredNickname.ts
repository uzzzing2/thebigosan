'use client'

import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'lkj_cheer_last_nickname'

function read(): string {
  if (typeof window === 'undefined') return ''
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

function write(value: string) {
  if (typeof window === 'undefined') return
  try {
    if (value) window.localStorage.setItem(STORAGE_KEY, value)
    else window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // noop
  }
}

/** Server-safe — synchronous read (no React state); for use outside components. */
export function getStoredNickname(): string {
  return read()
}

/** Server-safe — synchronous write. */
export function setStoredNickname(value: string) {
  write(value)
}

/** React hook variant — hydrates on mount to avoid SSR mismatch. */
export function useStoredNickname() {
  const [nickname, setNickname] = useState<string>('')

  useEffect(() => {
    setNickname(read())
  }, [])

  const update = useCallback((value: string) => {
    setNickname(value)
    write(value)
  }, [])

  return { nickname, update }
}
