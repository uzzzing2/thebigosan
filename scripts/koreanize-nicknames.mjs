/**
 * Convert a fraction of existing cheer nicknames to Korean / mixed forms,
 * skipping pinned TOP 5. Picks ~35% of docs at random.
 *
 * Requires temp rules.
 *
 * Usage:
 *   node scripts/koreanize-nicknames.mjs            # dry-run
 *   node scripts/koreanize-nicknames.mjs --apply    # actually update
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

// Korean nickname components
const KO_ROOTS = [
  '오산시민', '오산토박이', '세교주민', '운암살이', '대원맘', '대원아빠',
  '남촌사람', '초평주민', '중앙동맘', '신장러', '세마동',
  '오색단골', '오산천러너', '오산걷기', '오산딸', '오산아들',
  '엄마기록', '아빠일기', '워킹맘', '워킹대디', '신혼집',
  '학부모', '학원맘', '청춘오산', '청년이권재', '오산청년',
  '오산할매', '오산할배', '경로당지기', '오산토토',
  '동부대로', '오산기차', '세교새댁', '오산은어디서나',
]
const KO_NUM_SUFFIX = ['88', '99', '07', '26', '01', '02', '03', '12', '24', '77', '11', '21', '33', '08', '5', '7', '9']
const KO_WORD_SUFFIX = [
  '아빠', '엄마', '맘', '대디', '님', '응원', '오산', '화이팅', '진심',
  '집', '하루', '오늘', '내일', '봄날',
]

const EN_ROOTS = [
  'osan', 'sema', 'sinjang', 'daewon', 'namchon', 'segyo', 'mom', 'dad', 'kid',
]
const EN_SUFFIX = ['88', '99', '07', '오산', '맘', '아빠', '님', '응원']

const NICK_RE = /^[a-zA-Z가-힣][a-zA-Z0-9가-힣_]{2,18}[a-zA-Z0-9가-힣]$/
const HAS_KOREAN = /[가-힣]/

function pickOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function makeKorean() {
  // 한글 닉네임은 underscore 안 씀. 숫자 또는 한글 접미사로만 연결.
  for (let i = 0; i < 10; i++) {
    const root = pickOne(KO_ROOTS)
    // 50% chance: root + number, 50%: root + Korean word
    const suffix = Math.random() < 0.5 ? pickOne(KO_NUM_SUFFIX) : pickOne(KO_WORD_SUFFIX)
    const nick = `${root}${suffix}`
    if (NICK_RE.test(nick)) return nick
  }
  return `오산시민${Math.floor(Math.random() * 90 + 10)}`
}

function makeMixed() {
  // 영문 root + 한글 suffix 또는 반대. underscore는 영문↔영문에서만 사용.
  for (let i = 0; i < 10; i++) {
    const enFirst = Math.random() < 0.5
    const root = enFirst ? pickOne(EN_ROOTS) : pickOne(KO_ROOTS)
    const suffix = enFirst ? pickOne(KO_WORD_SUFFIX.concat(KO_NUM_SUFFIX)) : pickOne(EN_SUFFIX)
    // 한글이 섞이면 join 없음. 양쪽 영문일 때만 _ 사용.
    const bothEn = !HAS_KOREAN.test(root) && !HAS_KOREAN.test(suffix)
    const join = bothEn && Math.random() < 0.7 ? '_' : ''
    const nick = `${root}${join}${suffix}`
    if (NICK_RE.test(nick) && !(HAS_KOREAN.test(nick) && nick.includes('_'))) return nick
  }
  return `오산${Math.floor(Math.random() * 90 + 10)}`
}

async function run() {
  const snap = await getDocs(collection(db, 'cheers'))
  console.log(`[koreanize] total docs=${snap.size} apply=${apply}`)

  // Pick ~35% of non-pinned docs
  const candidates = snap.docs.filter((d) => !PINNED.has(d.id))
  const targets = candidates.filter(() => Math.random() < 0.35)
  console.log(`[koreanize] candidates=${candidates.length} will update=${targets.length}`)

  const samples = []
  const updates = []
  for (const d of targets) {
    const old = d.data().nickname ?? ''
    // 65% pure Korean, 35% mixed
    const next = Math.random() < 0.65 ? makeKorean() : makeMixed()
    samples.push({ id: d.id, from: old, to: next })
    updates.push({ id: d.id, next })
  }
  for (const s of samples.slice(0, 12)) {
    console.log(`  - ${s.from}  →  ${s.to}`)
  }

  if (!apply) {
    console.log('[koreanize] dry-run done. Re-run with --apply to update.')
    process.exit(0)
  }

  const CONCURRENCY = 30
  let done = 0
  let cursor = 0
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (cursor < updates.length) {
      const i = cursor++
      if (i >= updates.length) return
      try {
        await updateDoc(doc(db, 'cheers', updates[i].id), {
          nickname: updates[i].next,
        })
      } catch (e) {
        console.error(`[koreanize] ${updates[i].id} failed`, e?.code ?? e)
      }
      done++
      if (done % 50 === 0) console.log(`[koreanize] updated ${done}/${updates.length}`)
    }
  })
  await Promise.all(workers)
  console.log(`[koreanize] updated ${done}/${updates.length}. done.`)
  process.exit(0)
}

run().catch((e) => {
  console.error('[koreanize] failed', e)
  process.exit(1)
})
