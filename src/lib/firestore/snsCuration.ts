import {
  Timestamp,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { getDb, isFirebaseConfigured } from '@/lib/firebase'

const SNS_CURATION = 'snsCuration'

export interface InstagramCurationItem {
  id: string
  imageUrl: string
  caption: string
  originalUrl: string
  postedAt: string // ISO date
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

const MOCK_INSTAGRAM: InstagramCurationItem[] = [
  { id: 'i1', caption: '오색시장 현장에서', postedAt: '2026-05-14', imageUrl: '', originalUrl: '#', order: 1 },
  { id: 'i2', caption: '세교2지구 주민과의 만남', postedAt: '2026-05-11', imageUrl: '', originalUrl: '#', order: 2 },
  { id: 'i3', caption: '청년정책 간담회', postedAt: '2026-05-07', imageUrl: '', originalUrl: '#', order: 3 },
  { id: 'i4', caption: '아이드림센터 방문', postedAt: '2026-05-02', imageUrl: '', originalUrl: '#', order: 4 },
]

export async function getInstagramCuration(max = 8): Promise<InstagramCurationItem[]> {
  if (!isFirebaseConfigured) return MOCK_INSTAGRAM
  try {
    const db = getDb()
    const q = query(
      collection(db, SNS_CURATION),
      where('isActive', '==', true),
      orderBy('order', 'asc'),
      limit(max),
    )
    const snap = await getDocs(q)
    if (snap.empty) return MOCK_INSTAGRAM
    return snap.docs.map((d) => {
      const data = d.data() as InstagramDoc
      return {
        id: d.id,
        imageUrl: data.imageUrl,
        caption: data.caption,
        originalUrl: data.originalUrl,
        postedAt: data.postedAt.toDate().toISOString().slice(0, 10),
        order: data.order,
      }
    })
  } catch (err) {
    console.error('[snsCuration] getInstagramCuration failed', err)
    return MOCK_INSTAGRAM
  }
}
