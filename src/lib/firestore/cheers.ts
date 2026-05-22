'use client'

import { findForbiddenWord } from '@/lib/forbidden-words'
import type { Cheer } from '@/lib/data/cheers'

// NOTE: All `firebase/firestore` and `@/lib/firebase` imports are loaded
// dynamically inside the function bodies below. Importing them at module
// scope pulls protobufjs into any SSR/Cloudflare Worker bundle that
// transitively imports this file, which breaks at runtime because
// Workers disallow `new Function`/`eval` (the protobufjs codegen path).

const CHEERS = 'cheers'

// Local type that mirrors the Firestore document shape without importing
// the Timestamp value type at module scope.
type CheersDocumentRaw = {
  nickname: string
  content: string
  createdAt: { toDate: () => Date }
  ipHash?: string
  reports: number
  isHidden: boolean
  fromGame: boolean
  likes?: number
}

function docToCheer(id: string, d: CheersDocumentRaw): Cheer {
  return {
    id,
    nickname: d.nickname,
    content: d.content,
    createdAt: d.createdAt.toDate().toISOString(),
    likes: d.likes ?? 0,
  }
}

async function loadFirebase() {
  const [firestore, firebaseClient] = await Promise.all([
    import('firebase/firestore'),
    import('@/lib/firebase'),
  ])
  return { ...firestore, ...firebaseClient }
}

/** Realtime feed of the latest visible cheers. Returns unsubscribe fn. */
export function listenCheers(
  onChange: (items: Cheer[]) => void,
  options: { limit?: number } = {},
): () => void {
  if (typeof window === 'undefined') return () => {}
  let unsub: () => void = () => {}
  let cancelled = false
  loadFirebase()
    .then(({ collection, query, where, orderBy, limit, onSnapshot, getDb, isFirebaseConfigured }) => {
      if (cancelled || !isFirebaseConfigured) return
      const db = getDb()
      const q = query(
        collection(db, CHEERS),
        where('isHidden', '==', false),
        orderBy('createdAt', 'desc'),
        limit(options.limit ?? 100),
      )
      unsub = onSnapshot(
        q,
        (snap) => {
          const items = snap.docs.map((d) => docToCheer(d.id, d.data() as CheersDocumentRaw))
          onChange(items)
        },
        (err) => {
          console.error('[cheers] onSnapshot error', err)
        },
      )
    })
    .catch((err) => console.error('[cheers] load failed', err))
  return () => {
    cancelled = true
    unsub()
  }
}

/** Realtime feed of top-liked visible cheers. Returns unsubscribe fn. */
export function listenTopCheers(
  onChange: (items: Cheer[]) => void,
  n: number = 5,
): () => void {
  if (typeof window === 'undefined') return () => {}
  let unsub: () => void = () => {}
  let cancelled = false
  loadFirebase()
    .then(({ collection, query, where, orderBy, limit, onSnapshot, getDb, isFirebaseConfigured }) => {
      if (cancelled || !isFirebaseConfigured) return
      const db = getDb()
      const q = query(
        collection(db, CHEERS),
        where('isHidden', '==', false),
        orderBy('likes', 'desc'),
        orderBy('createdAt', 'desc'),
        limit(n),
      )
      unsub = onSnapshot(
        q,
        (snap) => {
          const items = snap.docs.map((d) => docToCheer(d.id, d.data() as CheersDocumentRaw))
          onChange(items)
        },
        (err) => {
          console.error('[cheers] listenTopCheers error', err)
        },
      )
    })
    .catch((err) => console.error('[cheers] load failed', err))
  return () => {
    cancelled = true
    unsub()
  }
}

/** Increment or decrement likes by ±1 (anyone). */
export async function toggleCheerLike(id: string, delta: 1 | -1): Promise<void> {
  if (typeof window === 'undefined') return
  const { updateDoc, doc, increment, getDb, isFirebaseConfigured } = await loadFirebase()
  if (!isFirebaseConfigured) return
  const db = getDb()
  await updateDoc(doc(db, CHEERS, id), { likes: increment(delta) })
}

/** Total count of visible cheers. */
export async function countCheers(): Promise<number> {
  if (typeof window === 'undefined') return 0
  const { collection, query, where, getCountFromServer, getDb, isFirebaseConfigured } = await loadFirebase()
  if (!isFirebaseConfigured) return 0
  const db = getDb()
  const q = query(collection(db, CHEERS), where('isHidden', '==', false))
  const snap = await getCountFromServer(q)
  return snap.data().count
}

export class CheerForbiddenError extends Error {
  word: string
  constructor(word: string) {
    super('사용할 수 없는 표현이 포함되어 있어요.')
    this.name = 'CheerForbiddenError'
    this.word = word
  }
}

export interface WriteCheerInput {
  nickname: string
  content: string
}

export async function writeCheer(input: WriteCheerInput): Promise<Cheer> {
  const forbidden = findForbiddenWord(input.content)
  if (forbidden) throw new CheerForbiddenError(forbidden)

  const { addDoc, collection, Timestamp, getDb, isFirebaseConfigured } = await loadFirebase()

  if (!isFirebaseConfigured) {
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
  if (typeof window === 'undefined') return
  const { addDoc, collection, Timestamp, getDb, isFirebaseConfigured } = await loadFirebase()
  if (!isFirebaseConfigured) return
  const db = getDb()
  await addDoc(collection(db, REPORTS), {
    cheerId: input.cheerId,
    reason: input.reason,
    createdAt: Timestamp.now(),
    processed: false,
  })
}
