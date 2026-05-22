import {
  Timestamp,
  collection,
  getDocs,
  limit,
  query,
  where,
} from 'firebase/firestore'
import { getDb, isFirebaseConfigured } from '@/lib/firebase'
import { INSTAGRAM_POSTS } from '@/lib/data/instagram'

const SNS_CURATION = 'snsCuration'

export interface InstagramCurationItem {
  id: string
  imageUrl: string
  caption: string
  originalUrl: string
  postedAt: string // ISO date (may be empty for migrated-from-static items)
  order: number
}

interface InstagramDoc {
  imageUrl: string
  caption: string
  originalUrl: string
  postedAt: Timestamp
  order: number
  isActive: boolean
}

function staticFallback(max: number): InstagramCurationItem[] {
  return INSTAGRAM_POSTS.slice(0, max).map((p, i) => ({
    id: p.id,
    imageUrl: '',
    caption: '',
    originalUrl: p.url,
    postedAt: '',
    order: i * 10,
  }))
}

export async function getInstagramCuration(max = 8): Promise<InstagramCurationItem[]> {
  if (!isFirebaseConfigured) return staticFallback(max)
  try {
    const db = getDb()
    // Filter by isActive (required by Firestore rule for anonymous reads),
    // then sort by `order` client-side to avoid needing a composite index.
    const q = query(
      collection(db, SNS_CURATION),
      where('isActive', '==', true),
      limit(200),
    )
    const snap = await getDocs(q)
    if (snap.empty) return staticFallback(max)
    return snap.docs
      .map((d) => {
        const data = d.data() as InstagramDoc
        return {
          id: d.id,
          imageUrl: data.imageUrl,
          caption: data.caption,
          originalUrl: data.originalUrl,
          postedAt: data.postedAt?.toDate?.().toISOString().slice(0, 10) ?? '',
          order: data.order ?? 0,
        }
      })
      .sort((a, b) => a.order - b.order)
      .slice(0, max)
  } catch (err) {
    console.error('[snsCuration] getInstagramCuration failed', err)
    return staticFallback(max)
  }
}
