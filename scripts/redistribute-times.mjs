/**
 * One-shot: redistribute `createdAt` across all existing cheers using a
 * daytime-biased hour distribution with strong lunch (12-13) and dinner
 * (18-21) peaks. Minimal early morning / late night.
 *
 * Requires temporarily-relaxed rules. Paste this into Firestore Rules
 * for the duration of the script, then restore:
 *
 *   match /cheers/{id} {
 *     allow read, write: if true;   // TEMP — REVERT AFTER
 *   }
 *
 * Usage:
 *   node scripts/redistribute-times.mjs [maxDaysBack]   # default 3
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
  Timestamp,
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
  console.error('[redistribute] Firebase env vars missing in .env.local')
  process.exit(1)
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Heavy lunch (12-13) + dinner (18-21). Minimal 22-05.
const HOUR_WEIGHTS = [
  0.05, 0.03, 0.02, 0.02, 0.02, 0.05, // 0-5
  0.2,  0.4,  0.6,  0.8,  1.0,  1.5,  // 6-11
  5.0,  4.5,  2.0,  2.5,  3.0,  3.5,  // 12-17
  5.5,  5.5,  4.5,  2.5,  1.0,  0.3,  // 18-23
]
function pickHour() {
  const sum = HOUR_WEIGHTS.reduce((a, b) => a + b, 0)
  let r = Math.random() * sum
  for (let h = 0; h < 24; h++) {
    if (r < HOUR_WEIGHTS[h]) return h
    r -= HOUR_WEIGHTS[h]
  }
  return 12
}

function randomPastTimestamp(maxDaysBack) {
  const now = new Date()
  const dayOffset = Math.floor(Math.random() * maxDaysBack)
  const d = new Date(now)
  d.setDate(d.getDate() - dayOffset)
  d.setHours(pickHour(), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60), 0)
  if (d.getTime() > now.getTime()) d.setTime(d.getTime() - 24 * 60 * 60 * 1000)
  return d.getTime()
}

const MAX_DAYS = Number.parseInt(process.argv[2] ?? '3', 10)

async function run() {
  console.log(`[redistribute] projectId=${firebaseConfig.projectId} maxDaysBack=${MAX_DAYS}`)
  const snap = await getDocs(collection(db, 'cheers'))
  console.log(`[redistribute] total docs=${snap.size}`)

  let written = 0
  const docs = snap.docs
  while (written < docs.length) {
    const batch = writeBatch(db)
    const slice = docs.slice(written, written + 450)
    for (const d of slice) {
      const ts = randomPastTimestamp(MAX_DAYS)
      batch.update(doc(db, 'cheers', d.id), {
        createdAt: Timestamp.fromMillis(ts),
      })
    }
    await batch.commit()
    written += slice.length
    console.log(`[redistribute] ${written}/${docs.length}`)
  }
  console.log('[redistribute] done. REMEMBER to revert the temporary rules.')
  process.exit(0)
}

run().catch((e) => {
  console.error('[redistribute] failed', e)
  process.exit(1)
})
