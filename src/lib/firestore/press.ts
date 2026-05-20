import { pressItems as mockPress, type PressItem } from '@/lib/data/press'

/**
 * Returns press items sorted by publishedAt desc.
 * Currently uses the generated static dataset in src/lib/data/press.ts.
 * Firestore integration is deferred — re-introduce firestore imports
 * and the original query when the `press` collection is populated and
 * a composite index is created.
 */
export async function getAllPress(): Promise<PressItem[]> {
  return mockPress
}

export async function getPressById(id: string): Promise<PressItem | undefined> {
  return mockPress.find((p) => p.id === id)
}

export function findAdjacent(items: PressItem[], id: string) {
  const sorted = [...items].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
  const idx = sorted.findIndex((p) => p.id === id)
  if (idx === -1) return { prev: undefined, next: undefined }
  return { prev: sorted[idx + 1], next: sorted[idx - 1] }
}
