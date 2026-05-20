/**
 * One-shot backfill: bump `likes` on existing cheers by random amounts using
 * the public ±1 increment path (anonymous-allowed under the new rules).
 *
 * Requires the updated firestore.rules to be deployed in Firebase Console.
 *
 * Usage:
 *   node scripts/backfill-likes.mjs           # only bumps docs with likes==0/undefined
 *   node scripts/backfill-likes.mjs --force   # bumps all docs (additive)
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
  increment,
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

if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
  console.error('[backfill] Firebase env vars missing in .env.local')
  process.exit(1)
}

const force = process.argv.includes('--force')

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

function randomLikes() {
  const r = Math.random()
  return Math.floor(Math.pow(r, 4) * 250)
}

const CONCURRENCY = 40

async function runWithConcurrency(items, fn) {
  let cursor = 0
  let completed = 0
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (cursor < items.length) {
      const myIndex = cursor++
      if (myIndex >= items.length) return
      try {
        await fn(items[myIndex])
      } catch (e) {
        console.error(`[backfill] op ${myIndex} failed`, e?.code ?? e)
      }
      completed++
      if (completed % 200 === 0) {
        console.log(`[backfill]   ops ${completed}/${items.length}`)
      }
    }
  })
  await Promise.all(workers)
}

async function run() {
  console.log(`[backfill] projectId=${firebaseConfig.projectId} force=${force}`)
  const snap = await getDocs(collection(db, 'cheers'))
  console.log(`[backfill] total docs=${snap.size}`)

  const targets = snap.docs.filter((d) => {
    const cur = d.data().likes
    return force || cur === undefined || cur === 0
  })
  console.log(`[backfill] eligible docs=${targets.length}`)

  // Build the per-op list: for each doc, generate target likes, then push that
  // many "increment +1" ops. Each op respects the ±1 rule.
  const ops = []
  for (const d of targets) {
    const target = randomLikes()
    for (let i = 0; i < target; i++) ops.push(d.id)
  }
  console.log(`[backfill] total increment ops=${ops.length}`)

  await runWithConcurrency(ops, async (cheerId) => {
    await updateDoc(doc(db, 'cheers', cheerId), { likes: increment(1) })
  })

  console.log('[backfill] done')
  process.exit(0)
}

run().catch((e) => {
  console.error('[backfill] failed', e)
  process.exit(1)
})
