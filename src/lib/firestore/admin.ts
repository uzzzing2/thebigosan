'use client'

import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage'
import { getDb, getStorageClient } from '@/lib/firebase'
import { pressItems, type PressCategory } from '@/lib/data/press'
import { INSTAGRAM_POSTS } from '@/lib/data/instagram'

/* ────────────────────────────────────────────────
 * Cheers admin operations
 * ──────────────────────────────────────────────── */

export interface AdminCheer {
  id: string
  nickname: string
  content: string
  createdAt: string
  reports: number
  isHidden: boolean
}

export interface ReportReadDiagnostics {
  ok: boolean
  totalDocs: number
  distinctCheers: number
  reportedCheerIds: string[]
  error?: string
}

let _lastReportDiagnostics: ReportReadDiagnostics = {
  ok: false,
  totalDocs: 0,
  distinctCheers: 0,
  reportedCheerIds: [],
  error: 'not loaded yet',
}

export function getLastReportDiagnostics(): ReportReadDiagnostics {
  return _lastReportDiagnostics
}

async function getReportCountsByCheerId(): Promise<Map<string, number>> {
  const db = getDb()
  const counts = new Map<string, number>()
  try {
    const snap = await getDocs(collection(db, 'reports'))
    snap.docs.forEach((d) => {
      const cheerId = (d.data() as { cheerId?: string }).cheerId
      if (cheerId) counts.set(cheerId, (counts.get(cheerId) ?? 0) + 1)
    })
    _lastReportDiagnostics = {
      ok: true,
      totalDocs: snap.size,
      distinctCheers: counts.size,
      reportedCheerIds: Array.from(counts.keys()),
    }
    console.info(
      `[admin] reports read OK — totalDocs=${snap.size}, distinctCheers=${counts.size}, cheerIds=${JSON.stringify(Array.from(counts.keys()))}`,
    )
  } catch (e) {
    _lastReportDiagnostics = {
      ok: false,
      totalDocs: 0,
      distinctCheers: 0,
      reportedCheerIds: [],
      error: (e as Error).message,
    }
    console.warn('[admin] failed to read reports collection — report counts will be 0', e)
  }
  return counts
}

export async function listAllCheers(max = 200): Promise<AdminCheer[]> {
  const db = getDb()
  const q = query(collection(db, 'cheers'), orderBy('createdAt', 'desc'), limit(max))
  const [snap, reportCounts] = await Promise.all([getDocs(q), getReportCountsByCheerId()])
  return snap.docs.map((d) => {
    const data = d.data() as {
      nickname: string
      content: string
      createdAt: Timestamp
      reports?: number
      isHidden?: boolean
    }
    return {
      id: d.id,
      nickname: data.nickname,
      content: data.content,
      createdAt: data.createdAt.toDate().toISOString(),
      reports: reportCounts.get(d.id) ?? 0,
      isHidden: data.isHidden ?? false,
    }
  })
}

export async function setCheerHidden(id: string, isHidden: boolean): Promise<void> {
  const db = getDb()
  await updateDoc(doc(db, 'cheers', id), { isHidden })
}

export async function deleteCheer(id: string): Promise<void> {
  const db = getDb()
  await deleteDoc(doc(db, 'cheers', id))
}

/**
 * Delete all report docs that target this cheer.
 * Returns the number of reports cleared.
 */
export async function clearReportsForCheer(cheerId: string): Promise<number> {
  const db = getDb()
  const q = query(collection(db, 'reports'), where('cheerId', '==', cheerId))
  const snap = await getDocs(q)
  await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, 'reports', d.id))))
  return snap.size
}

export async function countAllCheers(): Promise<{ total: number; reported: number }> {
  const db = getDb()
  const [totalSnap, reportCounts] = await Promise.all([
    getCountFromServer(collection(db, 'cheers')),
    getReportCountsByCheerId(),
  ])
  return { total: totalSnap.data().count, reported: reportCounts.size }
}

/* ────────────────────────────────────────────────
 * Press CRUD
 * ──────────────────────────────────────────────── */

export interface AdminPressItem {
  id: string
  category: PressCategory
  title: string
  body: string
  publishedAt: string
  mediaLinks: { name: string; url: string }[]
  thumbnail?: string
  isPublished: boolean
}

interface PressDoc {
  category: PressCategory
  title: string
  body: string
  publishedAt: Timestamp
  mediaLinks: { name: string; url: string }[]
  thumbnail?: string
  isPublished: boolean
}

export async function listAllPress(): Promise<AdminPressItem[]> {
  const db = getDb()
  const q = query(collection(db, 'press'), orderBy('publishedAt', 'desc'), limit(200))
  const snap = await getDocs(q)
  return snap.docs.map((d) => {
    const data = d.data() as PressDoc
    return {
      id: d.id,
      category: data.category,
      title: data.title,
      body: data.body,
      publishedAt: data.publishedAt.toDate().toISOString().slice(0, 10),
      mediaLinks: data.mediaLinks ?? [],
      thumbnail: data.thumbnail,
      isPublished: data.isPublished,
    }
  })
}

export async function getPressAdmin(id: string): Promise<AdminPressItem | null> {
  const db = getDb()
  const snap = await getDoc(doc(db, 'press', id))
  if (!snap.exists()) return null
  const data = snap.data() as PressDoc
  return {
    id: snap.id,
    category: data.category,
    title: data.title,
    body: data.body,
    publishedAt: data.publishedAt.toDate().toISOString().slice(0, 10),
    mediaLinks: data.mediaLinks ?? [],
    thumbnail: data.thumbnail,
    isPublished: data.isPublished,
  }
}

export interface PressInput {
  category: PressCategory
  title: string
  body: string
  publishedAt: string // YYYY-MM-DD
  mediaLinks: { name: string; url: string }[]
  thumbnail?: string
  isPublished: boolean
}

export async function createPress(input: PressInput): Promise<string> {
  const db = getDb()
  const data: Record<string, unknown> = {
    category: input.category,
    title: input.title,
    body: input.body,
    mediaLinks: input.mediaLinks ?? [],
    isPublished: input.isPublished,
    publishedAt: Timestamp.fromDate(new Date(input.publishedAt)),
    createdAt: serverTimestamp(),
  }
  // Firestore rejects `undefined`; only include thumbnail if set.
  if (input.thumbnail) data.thumbnail = input.thumbnail
  const ref = await addDoc(collection(db, 'press'), data)
  return ref.id
}

export async function updatePress(id: string, input: PressInput): Promise<void> {
  const db = getDb()
  await setDoc(doc(db, 'press', id), {
    ...input,
    publishedAt: Timestamp.fromDate(new Date(input.publishedAt)),
    updatedAt: serverTimestamp(),
  })
}

export async function deletePress(id: string): Promise<void> {
  const db = getDb()
  await deleteDoc(doc(db, 'press', id))
}

export async function setPressPublished(id: string, isPublished: boolean): Promise<void> {
  const db = getDb()
  await updateDoc(doc(db, 'press', id), { isPublished })
}

/**
 * Append a media link to an existing press doc's mediaLinks array.
 * Skips if the URL already exists. Used by /admin/press news import
 * to attach related coverage to an existing entry.
 */
export async function addPressMediaLink(
  pressId: string,
  link: { name: string; url: string },
): Promise<void> {
  const db = getDb()
  const ref = doc(db, 'press', pressId)
  const snap = await getDoc(ref)
  if (!snap.exists()) throw new Error('대상 보도자료를 찾을 수 없어요')
  const data = snap.data() as { mediaLinks?: { name: string; url: string }[] }
  const existing = data.mediaLinks ?? []
  if (existing.some((m) => m.url === link.url)) {
    throw new Error('이미 등록된 링크예요')
  }
  await updateDoc(ref, { mediaLinks: [...existing, link] })
}

/**
 * Seed the press collection from the static src/lib/data/press.ts list.
 * Idempotent — items that already exist (by id) are skipped, never overwritten,
 * so admin edits and new posts are preserved.
 */
export async function migratePressFromStatic(): Promise<{ created: number; skipped: number }> {
  const db = getDb()
  const results = await Promise.all(
    pressItems.map(async (item) => {
      const ref = doc(db, 'press', item.id)
      const snap = await getDoc(ref)
      if (snap.exists()) return 'skipped' as const
      const data: Record<string, unknown> = {
        category: item.category,
        title: item.title,
        body: item.body,
        publishedAt: Timestamp.fromDate(new Date(item.publishedAt)),
        mediaLinks: item.mediaLinks ?? [],
        isPublished: true,
        migratedAt: serverTimestamp(),
      }
      if (item.thumbnail) data.thumbnail = item.thumbnail
      await setDoc(ref, data)
      return 'created' as const
    }),
  )
  return {
    created: results.filter((r) => r === 'created').length,
    skipped: results.filter((r) => r === 'skipped').length,
  }
}

/* ────────────────────────────────────────────────
 * SNS curation CRUD
 * ──────────────────────────────────────────────── */

export interface AdminSnsItem {
  id: string
  imageUrl: string
  caption: string
  originalUrl: string
  postedAt: string
  order: number
  isActive: boolean
}

interface SnsDoc {
  imageUrl: string
  caption: string
  originalUrl: string
  postedAt: Timestamp
  order: number
  isActive: boolean
}

export async function listAllSns(): Promise<AdminSnsItem[]> {
  const db = getDb()
  const q = query(collection(db, 'snsCuration'), orderBy('order', 'asc'), limit(200))
  const snap = await getDocs(q)
  return snap.docs.map((d) => {
    const data = d.data() as SnsDoc
    return {
      id: d.id,
      imageUrl: data.imageUrl,
      caption: data.caption,
      originalUrl: data.originalUrl,
      postedAt: data.postedAt.toDate().toISOString().slice(0, 10),
      order: data.order,
      isActive: data.isActive,
    }
  })
}

export interface SnsInput {
  imageUrl: string
  caption: string
  originalUrl: string
  postedAt: string
  order: number
  isActive: boolean
}

export async function createSns(input: SnsInput): Promise<string> {
  const db = getDb()
  const ref = await addDoc(collection(db, 'snsCuration'), {
    ...input,
    postedAt: Timestamp.fromDate(new Date(input.postedAt)),
  })
  return ref.id
}

export async function updateSns(id: string, input: Partial<SnsInput>): Promise<void> {
  const db = getDb()
  const data: Record<string, unknown> = { ...input }
  if (input.postedAt) data.postedAt = Timestamp.fromDate(new Date(input.postedAt))
  await updateDoc(doc(db, 'snsCuration', id), data)
}

export async function deleteSns(id: string): Promise<void> {
  const db = getDb()
  await deleteDoc(doc(db, 'snsCuration', id))
}

/**
 * Delete every doc in snsCuration. Destructive — returns the count.
 * Note: this does NOT delete uploaded images in Firebase Storage.
 */
export async function deleteAllSns(): Promise<number> {
  const db = getDb()
  const snap = await getDocs(collection(db, 'snsCuration'))
  await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, 'snsCuration', d.id))))
  return snap.size
}

/**
 * Renumber every snsCuration doc's `order` field to 1..N based on the
 * current ascending order. Returns the count of updated docs.
 */
export async function normalizeSnsOrder(): Promise<number> {
  const db = getDb()
  const q = query(collection(db, 'snsCuration'), orderBy('order', 'asc'), limit(500))
  const snap = await getDocs(q)
  const updates = snap.docs
    .map((d, i) => ({ id: d.id, current: (d.data() as { order?: number }).order ?? 0, next: i + 1 }))
    .filter((u) => u.current !== u.next)
  await Promise.all(updates.map((u) => updateDoc(doc(db, 'snsCuration', u.id), { order: u.next })))
  return updates.length
}

export const SNS_IMAGE_MAX_BYTES = 5 * 1024 * 1024

/**
 * Upload an image file to Firebase Storage under /sns/ and return the
 * download URL. Caller should set the returned URL on the snsCuration
 * doc's imageUrl field.
 */
export async function uploadSnsImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('이미지 파일만 업로드 가능합니다')
  }
  if (file.size > SNS_IMAGE_MAX_BYTES) {
    throw new Error('이미지 크기는 5MB 이하여야 합니다')
  }
  const storage = getStorageClient()
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
  const path = `sns/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext || 'jpg'}`
  const ref = storageRef(storage, path)
  await uploadBytes(ref, file, { contentType: file.type })
  return getDownloadURL(ref)
}

/**
 * Seed snsCuration from src/lib/data/instagram.ts. Idempotent —
 * existing docs (matched by Instagram post id) are skipped, so admin
 * edits and new posts are preserved. Migrated docs have empty
 * imageUrl/caption; admin can fill those in later if desired (the
 * public card falls back to a gradient placeholder when no image).
 */
export async function migrateSnsFromStatic(): Promise<{ created: number; skipped: number }> {
  const db = getDb()
  const now = Timestamp.now()
  const results = await Promise.all(
    INSTAGRAM_POSTS.map(async (post, i) => {
      const ref = doc(db, 'snsCuration', post.id)
      const snap = await getDoc(ref)
      if (snap.exists()) return 'skipped' as const
      await setDoc(ref, {
        imageUrl: '',
        caption: '',
        originalUrl: post.url,
        postedAt: now,
        order: i + 1,
        isActive: true,
        migratedAt: serverTimestamp(),
      })
      return 'created' as const
    }),
  )
  return {
    created: results.filter((r) => r === 'created').length,
    skipped: results.filter((r) => r === 'skipped').length,
  }
}
