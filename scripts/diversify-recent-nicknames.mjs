/**
 * 최근 N개 cheer의 닉네임을 다양한 풀에서 재생성.
 *  - 한글 닉네임은 underscore 안 씀
 *  - 같은 root나 같은 suffix가 N개 안에서 일정 횟수 이하만 등장 (MAX_REPEAT)
 *  - 전체 닉네임은 unique
 *  - TOP 5 핀 제외
 *
 * Requires temp rules.
 *
 * Usage:
 *   node scripts/diversify-recent-nicknames.mjs                 # dry-run, recent=80, maxRepeat=2
 *   node scripts/diversify-recent-nicknames.mjs --apply
 *   node scripts/diversify-recent-nicknames.mjs --apply 120 3   # recent=120, maxRepeat=3
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

// 한글 root (지역/가족/직업/생활 다양화)
const KO_ROOTS = [
  // 지역
  '오산시민', '오산토박이', '오산딸', '오산아들', '오산딸내미', '오산아들램',
  '세교주민', '세교새댁', '세교맘', '세교아빠', '세교라이프',
  '운암살이', '운암동주민', '대원맘', '대원아빠', '대원동살이',
  '남촌사람', '남촌맘', '초평주민', '초평이웃', '중앙동맘',
  '신장러', '신장맘', '세마동', '세마맘', '세마러너',
  '가장2동', '오산역세권', '오산천러너', '오산천걷기',
  // 가족
  '엄마기록', '아빠일기', '워킹맘', '워킹대디', '두아이맘', '세아이맘',
  '아들둘맘', '딸둘맘', '딸아들맘', '신혼집', '신혼부부',
  '오산할매', '오산할배', '경로당지기', '시아빠', '시엄마',
  // 직업/일상
  '학부모', '학원맘', '학원대디', '직장맘', '직장대디',
  '청춘오산', '청년이권재', '오산청년', '오산토토',
  '오산수다', '오산밥집', '오산카페', '오산브런치', '오산퇴근',
  '오산출근러', '오산통근', '오산걷기', '오산자전거',
  // 표현
  '진심오산', '한표오산', '응원오산', '오산응원단', '오산조아',
  '오산좋아', '오산화이팅', '오산짱', '오산파이팅', '오산고고',
]

// 숫자 접미사 (00-99 풀)
const KO_NUM_SUFFIX = []
for (let i = 0; i < 100; i++) KO_NUM_SUFFIX.push(String(i).padStart(2, '0'))
// 단일 자릿수도 포함
for (let i = 0; i < 10; i++) KO_NUM_SUFFIX.push(String(i))

// 단어 접미사는 의도적으로 짧고 다양하게
const KO_WORD_SUFFIX = [
  '아빠', '엄마', '맘', '대디', '님', '응원', '화이팅', '진심',
  '집', '하루', '오늘', '내일', '봄날', '아침', '저녁', '주말',
  '봄', '여름', '가을', '겨울', '소소', '평일',
  '동네', '이웃', '시민', '주민', '가족',
]

// 영문 닉네임 풀
const EN_ROOTS = [
  'osan', 'sema', 'sinjang', 'daewon', 'namchon', 'chopyeong', 'jungang', 'segyo',
  'kim', 'lee', 'park', 'choi', 'jung', 'kang', 'cho', 'yoon', 'han', 'oh', 'seo',
  'shin', 'hwang', 'song', 'kwon', 'lim', 'ryu', 'go', 'min', 'baek', 'ahn',
  'dad', 'mom', 'kid', 'son', 'unni', 'oppa', 'hyung',
  'teacher', 'worker', 'parent', 'voter', 'runner', 'walker', 'biker',
  'native', 'tenant', 'owner', 'commuter', 'student', 'newbie',
]
const EN_SUFFIX = [
  '88', '99', '07', '26', '2026', '1004', '777', '00', '01', '12', '76', '63',
  'yj', 'jh', 'sj', 'mj', 'jk', 'hs', 'hk', 'ms', 'ys', 'ds', 'jw',
  'osan', 'kim', 'lee', 'park', 'dad', 'mom', 'fam', 'fan',
]

function pickOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function buildKoreanNick() {
  const root = pickOne(KO_ROOTS)
  const useNum = Math.random() < 0.6
  const suffix = useNum ? pickOne(KO_NUM_SUFFIX) : pickOne(KO_WORD_SUFFIX)
  return { root, suffix, nick: `${root}${suffix}` }
}

function buildEnglishNick() {
  const root = pickOne(EN_ROOTS)
  const suffix = pickOne(EN_SUFFIX)
  // 영문은 underscore 자주 사용 (자연스러움)
  const join = Math.random() < 0.75 ? '_' : ''
  return { root, suffix, nick: `${root}${join}${suffix}` }
}

function buildNickname(koreanRatio = 0.55) {
  return Math.random() < koreanRatio ? buildKoreanNick() : buildEnglishNick()
}

const args = process.argv.slice(2)
const apply = args.includes('--apply')
const numericArgs = args.filter((a) => /^\d+$/.test(a))
const RECENT = numericArgs[0] ? Number(numericArgs[0]) : 80
const MAX_REPEAT = numericArgs[1] ? Number(numericArgs[1]) : 2

async function run() {
  console.log(`[diversify] recent=${RECENT}  maxRepeatPerToken=${MAX_REPEAT}  apply=${apply}`)
  const snap = await getDocs(
    query(collection(db, 'cheers'), orderBy('createdAt', 'desc'), limit(RECENT * 2)),
  )
  // Take non-pinned, up to RECENT
  const targets = snap.docs.filter((d) => !PINNED.has(d.id)).slice(0, RECENT)
  console.log(`[diversify] targets=${targets.length}`)

  // 전역 unique 보장을 위해 전체 닉네임도 미리 로드
  const allSnap = await getDocs(collection(db, 'cheers'))
  const allNicks = new Set(
    allSnap.docs.filter((d) => !targets.find((t) => t.id === d.id))
      .map((d) => d.data().nickname ?? '')
      .filter(Boolean),
  )

  const usedNicks = new Set()
  const rootCount = new Map()
  const suffixCount = new Map()
  const plans = []

  for (const d of targets) {
    let chosen = null
    for (let attempt = 0; attempt < 50; attempt++) {
      const { root, suffix, nick } = buildNickname()
      if (!NICK_RE.test(nick)) continue
      if (allNicks.has(nick) || usedNicks.has(nick)) continue
      if ((rootCount.get(root) ?? 0) >= MAX_REPEAT) continue
      if ((suffixCount.get(suffix) ?? 0) >= MAX_REPEAT) continue
      chosen = { root, suffix, nick }
      break
    }
    if (!chosen) {
      // Fallback: force-unique with timestamp-ish digits
      for (let i = 0; i < 100; i++) {
        const root = pickOne(KO_ROOTS)
        const suffix = String(Math.floor(Math.random() * 9000 + 1000))
        const nick = `${root}${suffix}`
        if (NICK_RE.test(nick) && !allNicks.has(nick) && !usedNicks.has(nick)) {
          chosen = { root, suffix, nick }
          break
        }
      }
    }
    if (!chosen) continue
    usedNicks.add(chosen.nick)
    rootCount.set(chosen.root, (rootCount.get(chosen.root) ?? 0) + 1)
    suffixCount.set(chosen.suffix, (suffixCount.get(chosen.suffix) ?? 0) + 1)
    plans.push({ id: d.id, from: d.data().nickname ?? '', to: chosen.nick })
  }

  console.log(`[diversify] generated ${plans.length} unique nicknames`)
  for (const p of plans.slice(0, 12)) {
    console.log(`  - ${p.from}  →  ${p.to}`)
  }
  // Show top repeated suffix/root counts
  const topSuffix = [...suffixCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
  const topRoot = [...rootCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
  console.log('[diversify] most-used suffix:', topSuffix.map(([s, n]) => `${s}×${n}`).join(', '))
  console.log('[diversify] most-used root  :', topRoot.map(([s, n]) => `${s}×${n}`).join(', '))

  if (!apply) {
    console.log('[diversify] dry-run done. Re-run with --apply to update.')
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
        console.error(`[diversify] ${p.id} failed`, e?.code ?? e)
      }
      done++
      if (done % 25 === 0) console.log(`[diversify] updated ${done}/${plans.length}`)
    }
  })
  await Promise.all(workers)
  console.log(`[diversify] updated ${done}/${plans.length}. done.`)
  process.exit(0)
}

run().catch((e) => {
  console.error('[diversify] failed', e)
  process.exit(1)
})
