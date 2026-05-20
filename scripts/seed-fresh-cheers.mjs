/**
 * Add ~10 fresh cheers within the last 12 hours with brand-new wording
 * (request style "~만들어주세요!", encouragement, gratitude). Korean-friendly.
 * Small likes (0-15).
 *
 * Usage:
 *   node scripts/seed-fresh-cheers.mjs [count]   # default 10
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { initializeApp } from 'firebase/app'
import {
  addDoc,
  collection,
  getFirestore,
  Timestamp,
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

// 새로운 톤 — 기존 시드와 중복 안 되게 의도적으로 다른 표현
const FRESH_CONTENT = [
  '세교에 24시간 운영하는 동네 카페 좀 만들어주세요! 야근하고 들어오면 갈 데가 없어요',
  '오산천 자전거길 좀 늘려주세요. 진짜 자전거 타기 좋은 도시로 만들어주세요',
  '초등학교 앞 횡단보도 신호 길이 좀 늘려주세요. 아이들 뛰어가다 위험해요',
  '동네 작은 공원 운동기구 너무 낡았어요. 새것으로 좀 교체해주세요',
  '출근시간 1번국도 진짜 답답합니다. 교통체증 해결 좀 부탁드려요 ㅠㅠ',
  '오산역 화장실 좀 깔끔하게 새로 만들어주세요. 외지인분들이 자주 와요',
  '동네 도서관 운영시간 좀 늘려주세요. 일찍 닫아서 퇴근하면 못 가요',
  '서울 따릉이 같은 공공자전거 오산에도 도입해주세요! 진짜 편할 듯요',
  '시장님 끝까지 진심으로 응원합니다. 건강 챙기시면서 화이팅하세요!!',
  '어린이집 인근 인도 정비 좀 해주세요. 유모차 끌고 다니기 너무 위험해요',
  '오산 카페 거리 같은 거 좀 만들어주세요! 주말에 산책하기 좋은 동네 되었으면 해요',
  '재활용 분리수거장 좀 더 깨끗하게 관리해주세요. 냄새가 너무 심해요',
]

// 다양한 영문 닉네임 (구조화 + gibberish 섞음)
const FRESH_NICKS = [
  'osan_night',
  'sema_yagn',
  'bike_osan',
  'school_mom77',
  'unam_28',
  'rt1_commuter',
  'osanst_fan',
  'book_mom',
  'ttareungi',
  'oz_88',
  'asdf2026',
  'qwerk_07',
  'lkj_fan',
  'mnopq21',
]

const HOUR = 60 * 60 * 1000

function randomRecentMs(maxHoursBack) {
  // bias toward more recent (sqrt distribution)
  const r = Math.sqrt(Math.random())
  return Date.now() - r * maxHoursBack * HOUR
}

function randomSmallLikes() {
  const r = Math.random()
  if (r < 0.55) return Math.floor(Math.random() * 3) // 0-2
  if (r < 0.9) return 1 + Math.floor(Math.random() * 8) // 1-8
  return 5 + Math.floor(Math.random() * 11) // 5-15
}

const NICK_RE = /^[a-zA-Z가-힣][a-zA-Z0-9가-힣_]{2,18}[a-zA-Z0-9가-힣]$/

const TOTAL = Math.min(
  Number.parseInt(process.argv[2] ?? '10', 10),
  Math.min(FRESH_CONTENT.length, FRESH_NICKS.length),
)

async function run() {
  console.log(`[fresh] writing ${TOTAL} fresh cheers (last 12h)`)
  // shuffle content and nickname pools to mix combos
  const contents = [...FRESH_CONTENT].sort(() => Math.random() - 0.5).slice(0, TOTAL)
  const nicks = [...FRESH_NICKS].sort(() => Math.random() - 0.5).slice(0, TOTAL)

  for (let i = 0; i < TOTAL; i++) {
    const nickname = nicks[i]
    const content = contents[i]
    if (!NICK_RE.test(nickname)) {
      console.error(`[fresh] invalid nickname skipped: ${nickname}`)
      continue
    }
    if (content.length > 500) {
      console.error(`[fresh] content too long: ${content.length}`)
      continue
    }
    const ts = randomRecentMs(12)
    const likes = randomSmallLikes()
    try {
      const ref = await addDoc(collection(db, 'cheers'), {
        nickname,
        content,
        createdAt: Timestamp.fromMillis(ts),
        reports: 0,
        isHidden: false,
        fromGame: false,
        likes,
      })
      const ago = ((Date.now() - ts) / HOUR).toFixed(1)
      console.log(`  + ${ref.id}  ${nickname}  ♥${likes}  ${ago}h ago`)
    } catch (e) {
      console.error(`[fresh] write failed for "${nickname}":`, e?.code ?? e)
    }
  }
  console.log('[fresh] done.')
  process.exit(0)
}

run().catch((e) => {
  console.error('[fresh] failed', e)
  process.exit(1)
})
