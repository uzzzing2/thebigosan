import type { FirebaseApp, FirebaseOptions } from 'firebase/app'
import type { Firestore } from 'firebase/firestore'
import type { Auth } from 'firebase/auth'
import type { FirebaseStorage } from 'firebase/storage'

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

/** True when all required env vars are present. */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
)

let _app: FirebaseApp | null = null
let _db: Firestore | null = null
let _auth: Auth | null = null
let _storage: FirebaseStorage | null = null

// All firebase value imports are deferred so this module is safe to import
// from server/SSR contexts (including the Cloudflare Worker bundle that
// disallows `new Function`/`eval` — protobufjs would otherwise blow up
// at module load).

export function getFirebaseApp(): FirebaseApp {
  if (_app) return _app
  if (!isFirebaseConfigured) {
    throw new Error(
      'Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* env vars in .env.local',
    )
  }
const { getApp, getApps, initializeApp } = require('firebase/app') as typeof import('firebase/app')
  _app = getApps().length ? getApp() : initializeApp(firebaseConfig)
  return _app
}

export function getDb(): Firestore {
  if (_db) return _db
const { getFirestore } = require('firebase/firestore') as typeof import('firebase/firestore')
  _db = getFirestore(getFirebaseApp())
  return _db
}

export function getAuthClient(): Auth {
  if (_auth) return _auth
const { getAuth } = require('firebase/auth') as typeof import('firebase/auth')
  _auth = getAuth(getFirebaseApp())
  return _auth
}

export function getStorageClient(): FirebaseStorage {
  if (_storage) return _storage
const { getStorage } = require('firebase/storage') as typeof import('firebase/storage')
  _storage = getStorage(getFirebaseApp())
  return _storage
}
