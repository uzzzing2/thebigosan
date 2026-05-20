/**
 * Delete duplicate cheers (same content). For each unique content keep the
 * doc with the highest `likes` (ties broken by earliest createdAt) and delete
 * the rest. TOP 5 pinned IDs are always preserved.
 *
 * Requires temp rules (allow read, write: if true) since delete is admin-only
 * under production rules.
 *
 * Usage:
 *   node scripts/dedupe-cheers.mjs            # dry-run (lists dupes, no delete)
 *   node scripts/dedupe-cheers.mjs --apply    # actually delete
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { initializeApp } from 'firebase/app'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
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

const PINNED = new Set([
  '9n3LZi82opC2AymRqe8m', // dem_voter_88
  'ESOOL1tnGJh8ZPohTHqn', // osan_eomma01
  'ViqvuIfKcJ6t82ITvWPS', // osan_walker60
  '6sUODyQbSGq65P33npUN', // osan_driver7
  '1nkToJuiHlF3GQ3ApaNA', // segyo2_couple
])

const apply = process.argv.includes('--apply')

async function run() {
  console.log(`[dedupe] projectId=${firebaseConfig.projectId} apply=${apply}`)
  const snap = await getDocs(collection(db, 'cheers'))
  console.log(`[dedupe] total docs=${snap.size}`)

  // Group by content
  const groups = new Map()
  for (const d of snap.docs) {
    const data = d.data()
    const key = (data.content ?? '').trim()
    if (!key) continue
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push({
      id: d.id,
      likes: data.likes ?? 0,
      createdAtMs: data.createdAt?.toMillis?.() ?? 0,
      pinned: PINNED.has(d.id),
    })
  }

  // For each group with > 1 item, pick keeper, delete rest
  const toDelete = []
  const dupeGroupSamples = []
  for (const [content, docs] of groups) {
    if (docs.length < 2) continue

    // Prefer pinned, then highest likes, then earliest createdAt
    docs.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      if (b.likes !== a.likes) return b.likes - a.likes
      return a.createdAtMs - b.createdAtMs
    })
    const [keeper, ...losers] = docs

    dupeGroupSamples.push({
      content: content.slice(0, 50),
      total: docs.length,
      keeper: { id: keeper.id, likes: keeper.likes, pinned: keeper.pinned },
      delete: losers.length,
    })

    for (const l of losers) {
      if (l.pinned) continue // never delete a pinned doc
      toDelete.push(l.id)
    }
  }

  console.log(`[dedupe] duplicate groups=${dupeGroupSamples.length}`)
  console.log(`[dedupe] docs to delete=${toDelete.length}`)
  console.log(`[dedupe] sample (first 10):`)
  for (const g of dupeGroupSamples.slice(0, 10)) {
    console.log(`  - "${g.content}…" total=${g.total} keep=${g.keeper.id}(♥${g.keeper.likes}${g.keeper.pinned ? ',pinned' : ''}) delete=${g.delete}`)
  }

  if (!apply) {
    console.log(`[dedupe] dry-run done. re-run with --apply to actually delete.`)
    process.exit(0)
  }

  const CONCURRENCY = 30
  let done = 0
  let cursor = 0
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (cursor < toDelete.length) {
      const i = cursor++
      if (i >= toDelete.length) return
      try {
        await deleteDoc(doc(db, 'cheers', toDelete[i]))
      } catch (e) {
        console.error(`[dedupe] delete ${toDelete[i]} failed`, e?.code ?? e)
      }
      done++
      if (done % 50 === 0) console.log(`[dedupe] deleted ${done}/${toDelete.length}`)
    }
  })
  await Promise.all(workers)
  console.log(`[dedupe] deleted ${done}/${toDelete.length}. done.`)
  process.exit(0)
}

run().catch((e) => {
  console.error('[dedupe] failed', e)
  process.exit(1)
})
