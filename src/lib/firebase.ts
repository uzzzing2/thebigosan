import type { FirebaseApp, FirebaseOptions } from 'firebase/app'
import type { Firestore } from 'firebase/firestore'
import type { Auth } from 'firebase/auth'
import type { FirebaseStorage } from 'firebase/storage'

// NEXT_PUBLIC_* values are inlined at build time. On Cloudflare Workers
// Builds we don't always get them at build time (only at worker runtime),
// so we fall back to the hardcoded public Firebase Web SDK config below.
// These are public by design — they identify the project, not authorize it.
const PUBLIC_DEFAULTS = {
  apiKey: 'AIzaSyCiObaKSJ2UgxdnVuOV6TY35WySwC5u0i0',
  authDomain: 'thebigosan.firebaseapp.com',
  projectId: 'thebigosan',
  storageBucket: 'thebigosan.firebasestorage.app',
  messagingSenderId: '232738600744',
  appId: '1:232738600744:web:c81feaae09b6251723421d',
  measurementId: 'G-KWHW8E0QRQ',
} as const

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || PUBLIC_DEFAULTS.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || PUBLIC_DEFAULTS.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || PUBLIC_DEFAULTS.projectId,
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || PUBLIC_DEFAULTS.storageBucket,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    PUBLIC_DEFAULTS.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || PUBLIC_DEFAULTS.appId,
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || PUBLIC_DEFAULTS.measurementId,
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
