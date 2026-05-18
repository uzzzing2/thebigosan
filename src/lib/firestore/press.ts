import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { getDb, isFirebaseConfigured } from '@/lib/firebase'
import {
  pressItems as mockPress,
  type PressItem,
  type PressCategory,
} from '@/lib/data/press'

const PRESS = 'press'

interface PressDoc {
  category: PressCategory
  title: string
  body: string
  thumbnail?: string
  publishedAt: Timestamp
  mediaLinks: { name: string; url: string }[]
  isPublished: boolean
}

function docToItem(id: string, d: PressDoc): PressItem {
  return {
    id,
    category: d.category,
    title: d.title,
    body: d.body,
    thumbnail: d.thumbnail,
    publishedAt: d.publishedAt.toDate().toISOString().slice(0, 10),
    mediaLinks: d.mediaLinks ?? [],
  }
}

/** Returns published press sorted by publishedAt desc. Falls back to mock when empty / unconfigured. */
export async function getAllPress(): Promise<PressItem[]> {
  if (!isFirebaseConfigured) return mockPress
  try {
    const db = getDb()
    const q = query(
      collection(db, PRESS),
      where('isPublished', '==', true),
      orderBy('publishedAt', 'desc'),
      limit(200),
    )
    const snap = await getDocs(q)
    if (snap.empty) return mockPress
    return snap.docs.map((d) => docToItem(d.id, d.data() as PressDoc))
  } catch (err) {
    console.error('[press] getAllPress failed', err)
    return mockPress
  }
}

export async function getPressById(id: string): Promise<PressItem | undefined> {
  if (!isFirebaseConfigured) return mockPress.find((p) => p.id === id)
  try {
    const db = getDb()
    const ref = doc(db, PRESS, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      return mockPress.find((p) => p.id === id)
    }
    const data = snap.data() as PressDoc
    if (!data.isPublished) {
      return mockPress.find((p) => p.id === id)
    }
    return docToItem(snap.id, data)
  } catch (err) {
    console.error('[press] getPressById failed', err)
    return mockPress.find((p) => p.id === id)
  }
}

export function findAdjacent(items: PressItem[], id: string) {
  const sorted = [...items].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
  const idx = sorted.findIndex((p) => p.id === id)
  if (idx === -1) return { prev: undefined, next: undefined }
  return { prev: sorted[idx + 1], next: sorted[idx - 1] }
}
