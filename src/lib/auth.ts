'use client'

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { getAuthClient, isFirebaseConfigured } from './firebase'

export const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean)

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return adminEmails.includes(email.trim().toLowerCase())
}

export function watchAuth(cb: (user: User | null) => void): () => void {
  if (!isFirebaseConfigured) {
    cb(null)
    return () => {}
  }
  return onAuthStateChanged(getAuthClient(), (user) => cb(user))
}

export async function signInAdmin(email: string, password: string): Promise<User> {
  if (!isFirebaseConfigured) throw new Error('Firebase가 설정되지 않았어요.')
  if (!isAdminEmail(email)) {
    throw new Error('운영자 이메일이 아닙니다.')
  }
  const cred = await signInWithEmailAndPassword(getAuthClient(), email, password)
  return cred.user
}

export async function signOutAdmin(): Promise<void> {
  if (!isFirebaseConfigured) return
  await signOut(getAuthClient())
}

export { GoogleAuthProvider }
