/**
 * Add a trailing period to most cheers that don't already end with sentence
 * punctuation. Skips TOP 5 pinned. ~80% get a period; rest stay as-is to keep
 * variety (some real users don't use periods).
 *
 * Requires temp rules.
 *
 * Usage:
 *   node scripts/add-periods.mjs           # dry-run
 *   node scripts/add-periods.mjs --apply   # actually update
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

const PINNED = new Set([
  '9n3LZi82opC2AymRqe8m',
  'ESOOL1tnGJh8ZPohTHqn',
  'ViqvuIfKcJ6t82ITvWPS',
  '6sUODyQbSGq65P33npUN',
  '1nkToJuiHlF3GQ3ApaNA',
])

const apply = process.argv.includes('--apply')

// Already has a natural sentence ending — don't touch
function hasNaturalEnding(s) {
  const t = s.trimEnd()
  if (!t) return true
  // punctuation endings
  if (/[.!?~…]$/.test(t)) return true
  // emoticon-ish endings
  if (/[\)\(♥♡♥️♪]$/.test(t)) return true
  // korean filler endings
  if (/(ㅎ+|ㅋ+|ㅠ+|ㅜ+|ㄷ+|ㄱ+|ㅇ+|ㅡ+|ㅁ+|\^\^|=\)|\:\))$/.test(t)) return true
  return false
}

async function run() {
  console.log(`[periods] projectId=${firebaseConfig.projectId} apply=${apply}`)
  const snap = await getDocs(collection(db, 'cheers'))
  console.log(`[periods] total docs=${snap.size}`)

  const candidates = []
  for (const d of snap.docs) {
    if (PINNED.has(d.id)) continue
    const content = d.data().content
    if (typeof content !== 'string') continue
    if (hasNaturalEnding(content)) continue
    candidates.push({ id: d.id, content })
  }
  console.log(`[periods] candidates (no natural ending) = ${candidates.length}`)

  // Pick ~80% to add a period; leave ~20% as-is for natural variety
  const toUpdate = candidates.filter(() => Math.random() < 0.8)
  console.log(`[periods] will update (~80%) = ${toUpdate.length}`)

  console.log('[periods] sample (first 8):')
  for (const c of toUpdate.slice(0, 8)) {
    console.log(`  - "${c.content.slice(0, 50)}…" -> +".")`)
  }

  if (!apply) {
    console.log('[periods] dry-run done. Re-run with --apply to update.')
    process.exit(0)
  }

  const CONCURRENCY = 30
  let done = 0
  let cursor = 0
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (cursor < toUpdate.length) {
      const i = cursor++
      if (i >= toUpdate.length) return
      const c = toUpdate[i]
      try {
        await updateDoc(doc(db, 'cheers', c.id), {
          content: c.content.trimEnd() + '.',
        })
      } catch (e) {
        console.error(`[periods] ${c.id} failed`, e?.code ?? e)
      }
      done++
      if (done % 50 === 0) console.log(`[periods] updated ${done}/${toUpdate.length}`)
    }
  })
  await Promise.all(workers)
  console.log(`[periods] updated ${done}/${toUpdate.length}. done.`)
  process.exit(0)
}

run().catch((e) => {
  console.error('[periods] failed', e)
  process.exit(1)
})
