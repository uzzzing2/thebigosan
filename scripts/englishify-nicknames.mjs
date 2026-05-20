/**
 * Revert all non-pinned cheer nicknames to English. Diversity-aware:
 *  - 모든 닉네임 unique
 *  - 가장 최근 N개 내에서 같은 root나 suffix는 MAX_REPEAT 이하만 등장
 *  - underscore 사용 자연스럽게
 *
 * Pinned TOP 5 제외.
 *
 * Requires temp rules.
 *
 * Usage:
 *   node scripts/englishify-nicknames.mjs             # dry-run, recent=80, maxRepeat=2
 *   node scripts/englishify-nicknames.mjs --apply
 *   node scripts/englishify-nicknames.mjs --apply 120 3
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

const NICK_RE = /^[a-zA-Z][a-zA-Z0-9_]{2,18}[a-zA-Z0-9]$/

const EN_ROOTS = [
  'osan', 'sema', 'sinjang', 'daewon', 'namchon', 'chopyeong', 'jungang', 'segyo',
  'kim', 'lee', 'park', 'choi', 'jung', 'kang', 'cho', 'yoon', 'han', 'oh', 'seo',
  'shin', 'hwang', 'song', 'kwon', 'lim', 'ryu', 'go', 'min', 'baek', 'ahn', 'no',
  'dad', 'mom', 'sis', 'bro', 'kid', 'son', 'gma', 'gpa', 'unni', 'oppa', 'hyung',
  'youth', 'student', 'worker', 'teacher', 'farmer', 'driver', 'nurse', 'shop',
  'voter', 'runner', 'walker', 'reader', 'biker', 'parent', 'native', 'tenant',
  'owner', 'commuter', 'newbie',
]

const EN_SUFFIX = [
  '88', '99', '07', '26', '2026', '2025', '2024', '1004', '777', '00', '01', '02',
  '03', '11', '12', '21', '22', '77', '08',
  'yj', 'jh', 'sj', 'mj', 'jk', 'jw', 'hs', 'hk', 'ms', 'ks', 'ys', 'ds',
  'osan', 'sema', 'kim', 'lee', 'park', 'pal', 'fam', 'dad', 'mom',
  'now', 'one', 'two', 'pro', 'fan', 'fwd', 'go',
]

function pickOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'
function randomLetters(min, max) {
  const n = min + Math.floor(Math.random() * (max - min + 1))
  let s = ''
  for (let i = 0; i < n; i++) s += LETTERS[Math.floor(Math.random() * LETTERS.length)]
  return s
}
function randomDigits(min, max) {
  const n = min + Math.floor(Math.random() * (max - min + 1))
  let s = ''
  for (let i = 0; i < n; i++) s += String(Math.floor(Math.random() * 10))
  return s
}

function buildStructured() {
  const root = pickOne(EN_ROOTS)
  const suffix = pickOne(EN_SUFFIX)
  const join = Math.random() < 0.75 ? '_' : ''
  return { root, suffix, nick: `${root}${join}${suffix}` }
}

function buildGibberish() {
  // 의미없는 알파벳 조합 + 숫자/언더스코어. 실제 유저들이 즉흥적으로 만드는 ID 흉내.
  const root = randomLetters(3, 6)
  const tail =
    Math.random() < 0.5
      ? randomDigits(2, 4) // asdf88, qwer1234
      : pickOne(['00', '07', '88', '99', '21', '23', '_99', '_88', '_07'])
  const join = !tail.startsWith('_') && Math.random() < 0.3 ? '_' : ''
  return { root, suffix: tail.replace(/^_/, ''), nick: `${root}${join}${tail}` }
}

function buildEnglish() {
  // 70% 구조화 / 30% gibberish
  const useGibberish = Math.random() < 0.3
  for (let i = 0; i < 10; i++) {
    const { root, suffix, nick } = useGibberish ? buildGibberish() : buildStructured()
    if (NICK_RE.test(nick)) return { root, suffix, nick }
  }
  return { root: 'osan', suffix: String(Math.floor(Math.random() * 9000 + 1000)), nick: `osan_${Math.floor(Math.random() * 9000 + 1000)}` }
}

const args = process.argv.slice(2)
const apply = args.includes('--apply')
const numericArgs = args.filter((a) => /^\d+$/.test(a))
const RECENT = numericArgs[0] ? Number(numericArgs[0]) : 80
const MAX_REPEAT = numericArgs[1] ? Number(numericArgs[1]) : 2

async function run() {
  const allSnap = await getDocs(collection(db, 'cheers'))
  console.log(`[english] total=${allSnap.size}  apply=${apply}  recent=${RECENT}  maxRepeat=${MAX_REPEAT}`)

  // Recent IDs (newest first), excluding pinned
  const recentSnap = await getDocs(
    query(collection(db, 'cheers'), orderBy('createdAt', 'desc'), limit(RECENT * 2)),
  )
  const recentIds = recentSnap.docs.filter((d) => !PINNED.has(d.id)).slice(0, RECENT).map((d) => d.id)
  const recentIdSet = new Set(recentIds)

  // Non-pinned IDs in some order: recent first, then the rest
  const recentDocs = allSnap.docs.filter((d) => recentIdSet.has(d.id))
  const otherDocs = allSnap.docs.filter((d) => !PINNED.has(d.id) && !recentIdSet.has(d.id))

  const usedNicks = new Set()
  // Keep pinned nicknames so we don't collide
  for (const d of allSnap.docs) {
    if (PINNED.has(d.id)) usedNicks.add(d.data().nickname ?? '')
  }
  const rootCountRecent = new Map()
  const suffixCountRecent = new Map()
  const plans = []

  function tryAllocate(isRecent) {
    for (let attempt = 0; attempt < 80; attempt++) {
      const { root, suffix, nick } = buildEnglish()
      if (usedNicks.has(nick)) continue
      if (isRecent) {
        if ((rootCountRecent.get(root) ?? 0) >= MAX_REPEAT) continue
        if ((suffixCountRecent.get(suffix) ?? 0) >= MAX_REPEAT) continue
      }
      return { root, suffix, nick }
    }
    // Fallback: append random digits
    for (let i = 0; i < 50; i++) {
      const root = pickOne(EN_ROOTS)
      const suffix = String(Math.floor(Math.random() * 9000 + 1000))
      const nick = `${root}_${suffix}`
      if (!usedNicks.has(nick) && NICK_RE.test(nick)) return { root, suffix, nick }
    }
    return null
  }

  for (const d of recentDocs) {
    const chosen = tryAllocate(true)
    if (!chosen) continue
    usedNicks.add(chosen.nick)
    rootCountRecent.set(chosen.root, (rootCountRecent.get(chosen.root) ?? 0) + 1)
    suffixCountRecent.set(chosen.suffix, (suffixCountRecent.get(chosen.suffix) ?? 0) + 1)
    plans.push({ id: d.id, from: d.data().nickname ?? '', to: chosen.nick, recent: true })
  }

  for (const d of otherDocs) {
    const chosen = tryAllocate(false)
    if (!chosen) continue
    usedNicks.add(chosen.nick)
    plans.push({ id: d.id, from: d.data().nickname ?? '', to: chosen.nick, recent: false })
  }

  console.log(`[english] planned updates=${plans.length} (recent=${plans.filter((p) => p.recent).length})`)
  for (const p of plans.slice(0, 15)) {
    console.log(`  - ${p.from}  →  ${p.to}${p.recent ? ' [recent]' : ''}`)
  }
  const topSuf = [...suffixCountRecent.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
  const topRoot = [...rootCountRecent.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
  console.log('[english] recent top suffix:', topSuf.map(([s, n]) => `${s}×${n}`).join(', '))
  console.log('[english] recent top root  :', topRoot.map(([s, n]) => `${s}×${n}`).join(', '))

  if (!apply) {
    console.log('[english] dry-run done. Re-run with --apply to update.')
    process.exit(0)
  }

  const CONCURRENCY = 30
  let done = 0
  let cursor = 0
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (cursor < plans.length) {
      const i = cursor++
      if (i >= plans.length) return
      const p = plans[i]
      try {
        await updateDoc(doc(db, 'cheers', p.id), { nickname: p.to })
      } catch (e) {
        console.error(`[english] ${p.id} failed`, e?.code ?? e)
      }
      done++
      if (done % 50 === 0) console.log(`[english] updated ${done}/${plans.length}`)
    }
  })
  await Promise.all(workers)
  console.log(`[english] updated ${done}/${plans.length}. done.`)
  process.exit(0)
}

run().catch((e) => {
  console.error('[english] failed', e)
  process.exit(1)
})
