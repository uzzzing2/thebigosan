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
import { getDb } from '@/lib/firebase'
import type { PressCategory } from '@/lib/data/press'

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

export async function listAllCheers(max = 200): Promise<AdminCheer[]> {
  const db = getDb()
  const q = query(collection(db, 'cheers'), orderBy('createdAt', 'desc'), limit(max))
  const snap = await getDocs(q)
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
      reports: data.reports ?? 0,
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

export async function countAllCheers(): Promise<{ total: number; reported: number }> {
  const db = getDb()
  const total = (await getCountFromServer(collection(db, 'cheers'))).data().count
  const reported = (
    await getCountFromServer(
      query(collection(db, 'cheers'), where('reports', '>', 0)),
    )
  ).data().count
  return { total, reported }
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
  const ref = await addDoc(collection(db, 'press'), {
    ...input,
    publishedAt: Timestamp.fromDate(new Date(input.publishedAt)),
    createdAt: serverTimestamp(),
  })
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
