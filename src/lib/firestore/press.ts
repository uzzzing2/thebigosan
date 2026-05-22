import { pressItems as staticPress, type PressItem } from '@/lib/data/press'

const COLLECTION = 'press'

// NOTE: All `firebase/firestore` and `@/lib/firebase` imports are loaded
// dynamically inside the function bodies below. Importing them at module
// scope breaks SSR / Cloudflare Worker bundling (see cheers.ts for context).

async function loadFirebase() {
  const [firestore, firebaseClient] = await Promise.all([
    import('firebase/firestore'),
    import('@/lib/firebase'),
  ])
  return { ...firestore, ...firebaseClient }
}

interface PressDocLike {
  category: PressItem['category']
  title: string
  body: string
  publishedAt: { toDate: () => Date }
  mediaLinks: { name: string; url: string }[]
  thumbnail?: string
  isPublished: boolean
}

function docToPressItem(id: string, d: PressDocLike): PressItem {
  return {
    id,
    category: d.category,
    title: d.title,
    body: d.body,
    publishedAt: d.publishedAt.toDate().toISOString().slice(0, 10),
    mediaLinks: d.mediaLinks ?? [],
    thumbnail: d.thumbnail,
  }
}

/**
 * Returns published press items sorted by publishedAt desc.
 * Reads from Firestore; falls back to the static dataset only when
 * Firestore is unconfigured, errors out, or returns zero items
 * (i.e. before the initial migration has been run).
 */
export async function getAllPress(): Promise<PressItem[]> {
  try {
    const {
      collection,
      getDocs,
      orderBy,
      query,
      where,
      getDb,
      isFirebaseConfigured,
    } = await loadFirebase()
    if (!isFirebaseConfigured) return staticPress
    const db = getDb()
    const q = query(
      collection(db, COLLECTION),
      where('isPublished', '==', true),
      orderBy('publishedAt', 'desc'),
    )
    const snap = await getDocs(q)
    if (snap.empty) return staticPress
    return snap.docs.map((d) => docToPressItem(d.id, d.data() as PressDocLike))
  } catch (err) {
    console.error('[press] getAllPress failed, falling back to static', err)
    return staticPress
  }
}

export async function getPressById(id: string): Promise<PressItem | undefined> {
  try {
    const { doc, getDoc, getDb, isFirebaseConfigured } = await loadFirebase()
    if (!isFirebaseConfigured) return staticPress.find((p) => p.id === id)
    const db = getDb()
    const snap = await getDoc(doc(db, COLLECTION, id))
    if (snap.exists()) {
      return docToPressItem(snap.id, snap.data() as PressDocLike)
    }
    // Doc not in Firestore yet — try static fallback (pre-migration)
    return staticPress.find((p) => p.id === id)
  } catch (err) {
    const code = (err as { code?: string }).code
    if (code === 'permission-denied') {
      // Doc exists but is unpublished — treat as not found.
      return undefined
    }
    console.error('[press] getPressById error, falling back to static', err)
    return staticPress.find((p) => p.id === id)
  }
}

export function findAdjacent(items: PressItem[], id: string) {
  const sorted = [...items].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
  const idx = sorted.findIndex((p) => p.id === id)
  if (idx === -1) return { prev: undefined, next: undefined }
  return { prev: sorted[idx + 1], next: sorted[idx - 1] }
}
