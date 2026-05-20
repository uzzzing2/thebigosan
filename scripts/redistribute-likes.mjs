/**
 * One-shot: redistribute `likes` across all existing cheers using a tiered
 * distribution (most 0, plenty in moderate, few breakout posts).
 *
 * Requires temporarily-relaxed rules (same as redistribute-times.mjs):
 *
 *   match /cheers/{id} {
 *     allow read, write: if true;   // TEMP — REVERT AFTER
 *   }
 *
 * Usage:
 *   node scripts/redistribute-likes.mjs
 *   node scripts/redistribute-likes.mjs --long   # use long-form distribution
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
  writeBatch,
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

if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
  console.error('[likes] Firebase env vars missing in .env.local')
  process.exit(1)
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Cap at ~150 so seeded TOP 5 (167-211) stays on top.
function randomLikes() {
  const r = Math.random()
  if (r < 0.40) return Math.floor(Math.random() * 3)        // 0-2
  if (r < 0.75) return 1 + Math.floor(Math.random() * 15)   // 1-15
  if (r < 0.95) return 10 + Math.floor(Math.random() * 41)  // 10-50
  return 50 + Math.floor(Math.pow(Math.random(), 1.5) * 100) // 50-150
}

async function run() {
  console.log(`[likes] projectId=${firebaseConfig.projectId}`)
  const snap = await getDocs(collection(db, 'cheers'))
  console.log(`[likes] total docs=${snap.size}`)

  let written = 0
  const docs = snap.docs
  while (written < docs.length) {
    const batch = writeBatch(db)
    const slice = docs.slice(written, written + 450)
    for (const d of slice) {
      batch.update(doc(db, 'cheers', d.id), { likes: randomLikes() })
    }
    await batch.commit()
    written += slice.length
    console.log(`[likes] ${written}/${docs.length}`)
  }

  // Quick stats sample
  const sample = Array.from({ length: 1000 }, () => randomLikes())
  const zeros = sample.filter((x) => x === 0).length
  const low = sample.filter((x) => x >= 1 && x <= 15).length
  const mid = sample.filter((x) => x >= 16 && x <= 50).length
  const high = sample.filter((x) => x > 50).length
  const max = Math.max(...sample)
  console.log(`[likes] sample(1000): zeros=${zeros} low=${low} mid=${mid} high=${high} max=${max}`)
  console.log('[likes] done. REMEMBER to revert the temporary rules.')
  process.exit(0)
}

run().catch((e) => {
  console.error('[likes] failed', e)
  process.exit(1)
})
