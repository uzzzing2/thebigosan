/**
 * Cleanup nicknames:
 *  1. 한글이 포함된 닉네임에서 underscore(_) 제거 (그 자리에 빈 문자열 또는 숫자)
 *  2. 가장 최근 N개 cheer의 닉네임이 서로 겹치지 않게 (충돌 시 숫자 접미사로 분기)
 *
 * Pinned TOP 5은 손대지 않음.
 *
 * Requires temp rules.
 *
 * Usage:
 *   node scripts/cleanup-nicknames.mjs                 # dry-run, recent=80
 *   node scripts/cleanup-nicknames.mjs --apply
 *   node scripts/cleanup-nicknames.mjs --apply 120     # recent=120
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

const PINNED = new Set([
  '9n3LZi82opC2AymRqe8m',
  'ESOOL1tnGJh8ZPohTHqn',
  'ViqvuIfKcJ6t82ITvWPS',
  '6sUODyQbSGq65P33npUN',
  '1nkToJuiHlF3GQ3ApaNA',
])

const NICK_RE = /^[a-zA-Z가-힣][a-zA-Z0-9가-힣_]{2,18}[a-zA-Z0-9가-힣]$/
const HAS_KOREAN = /[가-힣]/

const args = process.argv.slice(2)
const apply = args.includes('--apply')
const recentArg = args.find((a) => /^\d+$/.test(a))
const RECENT = recentArg ? Number(recentArg) : 80

function stripUnderscoreFromKorean(nick) {
  if (!HAS_KOREAN.test(nick)) return nick
  if (!nick.includes('_')) return nick
  // Replace underscores. If neighboring chars are both Korean → empty.
  // If one side is a digit/letter → empty too. Then ensure result is valid.
  let candidate = nick.replace(/_+/g, '')
  if (NICK_RE.test(candidate)) return candidate
  // Edge: too short after removal — append a number
  while (candidate.length < 4) candidate += String(Math.floor(Math.random() * 10))
  if (NICK_RE.test(candidate)) return candidate
  // Fall back: pad and truncate to fit
  candidate = candidate.replace(/[^a-zA-Z0-9가-힣]/g, '').slice(0, 20)
  if (candidate.length < 4) candidate = `오산${candidate}${Math.floor(Math.random() * 90 + 10)}`
  return candidate
}

function uniquifyAgainst(base, taken) {
  // 닉네임이 이미 있으면 숫자 접미사를 1, 2, 3...로 붙여 유일하게.
  if (!taken.has(base)) return base
  // Try a small random number first (more natural than 1)
  for (const n of [2, 3, 7, 8, 11, 22, 26, 88, 99]) {
    const candidate = `${base}${n}`
    if (candidate.length <= 20 && NICK_RE.test(candidate) && !taken.has(candidate)) {
      return candidate
    }
  }
  // Truncate base to make room
  for (let i = 1; i < 999; i++) {
    const suf = String(i)
    const room = 20 - suf.length
    const candidate = `${base.slice(0, room)}${suf}`
    if (NICK_RE.test(candidate) && !taken.has(candidate)) return candidate
  }
  return base // give up
}

async function run() {
  const allSnap = await getDocs(collection(db, 'cheers'))
  console.log(`[cleanup] total docs=${allSnap.size}  apply=${apply}  recent=${RECENT}`)

  const updates = new Map() // id -> nextNickname

  // Pass 1: strip underscore from any Korean-containing nickname
  for (const d of allSnap.docs) {
    if (PINNED.has(d.id)) continue
    const cur = d.data().nickname ?? ''
    const next = stripUnderscoreFromKorean(cur)
    if (next !== cur) updates.set(d.id, next)
  }
  console.log(`[cleanup] underscore-strip updates: ${updates.size}`)

  // Pass 2: uniquify nicknames among the N most-recent docs.
  const recentSnap = await getDocs(
    query(collection(db, 'cheers'), orderBy('createdAt', 'desc'), limit(RECENT)),
  )
  const recentIds = recentSnap.docs.map((d) => d.id)

  // Build current effective nickname per id (including planned updates)
  const effectiveOf = (id, data) => updates.get(id) ?? data.nickname ?? ''

  // Walk recent newest → oldest. Earlier (newer) ones win; later (older) duplicates get renamed.
  const seen = new Set()
  for (const d of recentSnap.docs) {
    if (PINNED.has(d.id)) {
      seen.add(d.data().nickname ?? '')
      continue
    }
    const eff = effectiveOf(d.id, d.data())
    if (!seen.has(eff)) {
      seen.add(eff)
      continue
    }
    // Conflict — uniquify against `seen`
    const next = uniquifyAgainst(eff, seen)
    if (next !== eff) {
      updates.set(d.id, next)
      seen.add(next)
    } else {
      seen.add(eff) // gave up
    }
  }

  console.log(`[cleanup] total updates after dedupe: ${updates.size}`)
  // Show some samples
  let shown = 0
  for (const d of allSnap.docs) {
    if (!updates.has(d.id)) continue
    const recent = recentIds.includes(d.id) ? ' [recent]' : ''
    console.log(`  - ${d.data().nickname}  →  ${updates.get(d.id)}${recent}`)
    if (++shown >= 12) break
  }

  if (!apply) {
    console.log('[cleanup] dry-run done. Re-run with --apply to update.')
    process.exit(0)
  }

  const ids = Array.from(updates.keys())
  const CONCURRENCY = 30
  let done = 0
  let cursor = 0
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (cursor < ids.length) {
      const i = cursor++
      if (i >= ids.length) return
      const id = ids[i]
      try {
        await updateDoc(doc(db, 'cheers', id), { nickname: updates.get(id) })
      } catch (e) {
        console.error(`[cleanup] ${id} failed`, e?.code ?? e)
      }
      done++
      if (done % 50 === 0) console.log(`[cleanup] updated ${done}/${ids.length}`)
    }
  })
  await Promise.all(workers)
  console.log(`[cleanup] updated ${done}/${ids.length}. done.`)
  process.exit(0)
}

run().catch((e) => {
  console.error('[cleanup] failed', e)
  process.exit(1)
})
