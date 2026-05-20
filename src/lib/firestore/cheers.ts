'use client'

import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getCountFromServer,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { getDb, isFirebaseConfigured } from '@/lib/firebase'
import { findForbiddenWord } from '@/lib/forbidden-words'
import type { Cheer } from '@/lib/data/cheers'

const CHEERS = 'cheers'
const RATE_LIMIT_KEY = 'lkj_cheer_last_write_at'
const RATE_LIMIT_MS = 60 * 1000

export interface CheersDocument {
  nickname: string
  content: string
  createdAt: Timestamp
  ipHash?: string
  reports: number
  isHidden: boolean
  fromGame: boolean
  likes?: number
}

function docToCheer(id: string, d: CheersDocument): Cheer {
  return {
    id,
    nickname: d.nickname,
    content: d.content,
    createdAt: d.createdAt.toDate().toISOString(),
    likes: d.likes ?? 0,
  }
}

/** Realtime feed of the latest visible cheers. Returns unsubscribe fn. */
export function listenCheers(
  onChange: (items: Cheer[]) => void,
  options: { limit?: number } = {},
): () => void {
  if (!isFirebaseConfigured) return () => {}
  const db = getDb()
  const q = query(
    collection(db, CHEERS),
    where('isHidden', '==', false),
    orderBy('createdAt', 'desc'),
    limit(options.limit ?? 100),
  )
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => docToCheer(d.id, d.data() as CheersDocument))
      onChange(items)
    },
    (err) => {
      console.error('[cheers] onSnapshot error', err)
    },
  )
}

/** Realtime feed of top-liked visible cheers. Returns unsubscribe fn. */
export function listenTopCheers(
  onChange: (items: Cheer[]) => void,
  n: number = 5,
): () => void {
  if (!isFirebaseConfigured) return () => {}
  const db = getDb()
  const q = query(
    collection(db, CHEERS),
    where('isHidden', '==', false),
    orderBy('likes', 'desc'),
    orderBy('createdAt', 'desc'),
    limit(n),
  )
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => docToCheer(d.id, d.data() as CheersDocument))
      onChange(items)
    },
    (err) => {
      console.error('[cheers] listenTopCheers error', err)
    },
  )
}

/** Increment or decrement likes by ±1 (anyone). */
export async function toggleCheerLike(id: string, delta: 1 | -1): Promise<void> {
  if (!isFirebaseConfigured) return
  const db = getDb()
  await updateDoc(doc(db, CHEERS, id), { likes: increment(delta) })
}

/** Total count of visible cheers. */
export async function countCheers(): Promise<number> {
  if (!isFirebaseConfigured) return 0
  const db = getDb()
  const q = query(collection(db, CHEERS), where('isHidden', '==', false))
  const snap = await getCountFromServer(q)
  return snap.data().count
}

export class CheerRateLimitError extends Error {
  remainingMs: number
  constructor(remainingMs: number) {
    super(`1분에 1번만 응원할 수 있어요. ${Math.ceil(remainingMs / 1000)}초 후 다시 시도해주세요.`)
    this.name = 'CheerRateLimitError'
    this.remainingMs = remainingMs
  }
}

export class CheerForbiddenError extends Error {
  word: string
  constructor(word: string) {
    super('사용할 수 없는 표현이 포함되어 있어요.')
    this.name = 'CheerForbiddenError'
    this.word = word
  }
}

/** Returns ms remaining if rate-limited, else 0. */
function checkLocalRateLimit(): number {
  if (typeof window === 'undefined') return 0
  try {
    const raw = window.localStorage.getItem(RATE_LIMIT_KEY)
    if (!raw) return 0
    const last = Number(raw)
    if (!Number.isFinite(last)) return 0
    const elapsed = Date.now() - last
    if (elapsed >= RATE_LIMIT_MS) return 0
    return RATE_LIMIT_MS - elapsed
  } catch {
    return 0
  }
}

function markLocalRateLimit(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()))
  } catch {
    // noop
  }
}

export interface WriteCheerInput {
  nickname: string
  content: string
}

export async function writeCheer(input: WriteCheerInput): Promise<Cheer> {
  const remaining = checkLocalRateLimit()
  if (remaining > 0) throw new CheerRateLimitError(remaining)

  const forbidden = findForbiddenWord(input.content)
  if (forbidden) throw new CheerForbiddenError(forbidden)

  if (!isFirebaseConfigured) {
    // Local-only fallback (e.g. env not set): pretend write succeeded
    markLocalRateLimit()
    return {
      id: `local-${Date.now()}`,
      nickname: input.nickname,
      content: input.content,
      createdAt: new Date().toISOString(),
      likes: 0,
    }
  }

  const db = getDb()
  const ref = await addDoc(collection(db, CHEERS), {
    nickname: input.nickname,
    content: input.content,
    createdAt: Timestamp.now(),
    reports: 0,
    isHidden: false,
    fromGame: false,
  })

  markLocalRateLimit()

  return {
    id: ref.id,
    nickname: input.nickname,
    content: input.content,
    createdAt: new Date().toISOString(),
    likes: 0,
  }
}

const REPORTS = 'reports'

export interface WriteReportInput {
  cheerId: string
  reason: 'abuse' | 'spam' | 'fake' | 'etc'
}

export async function writeReport(input: WriteReportInput): Promise<void> {
  if (!isFirebaseConfigured) return
  const db = getDb()
  await addDoc(collection(db, REPORTS), {
    cheerId: input.cheerId,
    reason: input.reason,
    createdAt: Timestamp.now(),
    processed: false,
  })
}
