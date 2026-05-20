/**
 * One-shot: cap likes on the N most recent cheers to <= maxLikes.
 *
 * Requires temp rules (allow read, write: if true) because we're setting an
 * arbitrary likes value, not the ±1 increment path.
 *
 * Usage:
 *   node scripts/cap-recent-likes.mjs [n=15] [maxLikes=15]
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { initializeApp } from 'firebase/app'
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const envPath = path.join(__dirname, '..', '.env.local')
const envText = fs.readFileSync(envPath, 'utf8')
const env = {}
for (const line of envText.split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
  if (!m) continue
  let v = m[2].trim()
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1)
  }
  env[m[1]] = v
}

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const N = Number.parseInt(process.argv[2] ?? '15', 10)
const MAX = Number.parseInt(process.argv[3] ?? '15', 10)

async function run() {
  const q = query(collection(db, 'cheers'), orderBy('createdAt', 'desc'), limit(N))
  const snap = await getDocs(q)
  console.log(`[cap] capping ${snap.size} most recent docs at <=${MAX} likes`)
  let touched = 0
  for (const d of snap.docs) {
    const cur = d.data().likes ?? 0
    if (cur <= MAX) {
      console.log(`  - ${d.id}  ${cur} (unchanged)`)
      continue
    }
    const next = Math.floor(Math.random() * (MAX + 1))
    await updateDoc(doc(db, 'cheers', d.id), { likes: next })
    console.log(`  - ${d.id}  ${cur} -> ${next}`)
    touched++
  }
  console.log(`[cap] done. updated=${touched}`)
  process.exit(0)
}

run().catch((e) => {
  console.error('[cap] failed', e)
  process.exit(1)
})
