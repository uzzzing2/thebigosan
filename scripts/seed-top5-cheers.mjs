/**
 * One-shot seed: insert 5 specific high-like cheers so they pin to the
 * "인기 응원 TOP 5" section. No temp rules needed — create allows arbitrary
 * `likes` field since the rule does not validate it on create.
 *
 * Usage:
 *   node scripts/seed-top5-cheers.mjs
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

if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
  console.error('[top5] Firebase env vars missing in .env.local')
  process.exit(1)
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// All TOP 5 timestamps before 5/18 (older posts have had more time to gather likes).
function at(year, mo, day, h, min) {
  return new Date(year, mo - 1, day, h, min, 0, 0).getTime()
}

const TOP5 = [
  {
    // 40-50대, 정치 인식 있는 유권자
    nickname: 'jhkim_lee',
    content:
      '저는 원래 민주당을 지지하는 사람입니다. 근데 4년 동안 우리 동네 변하는 거 직접 보면서, 결국 당이 중요한 게 아니라는 생각을 하게 됐어요. 진심으로 일하는 사람이 누군지가 중요한 거 같습니다..',
    likes: 211,
    createdAtMs: at(2026, 5, 16, 13, 42),
  },
  {
    // 30-40대 학부모
    nickname: 'minju_0207',
    content:
      '시장님이 매달 월급에서 100만원씩 장학금으로 기부하셨다는 기사 봤어요. 그 장학금이 아이들에게 돌아간다는 얘기 듣구요. 이게 진짜 교육도시라는 생각을 했습니다^^',
    likes: 198,
    createdAtMs: at(2026, 5, 16, 19, 30),
  },
  {
    // 50-60대, 평소 산책 즐기는 주민
    nickname: 'kfp2024',
    content:
      '저번주에 서랑저수지 산책하다 시장님 우연히 뵀습니다. 시민들에게 열심히 설명하시고 진심으로 경청하시는 모습에 오산에 대한 진심이 느껴졌습니다. 감동이었어요',
    likes: 184,
    createdAtMs: at(2026, 5, 17, 12, 50),
  },
  {
    // 30-50대 운전자
    nickname: 'park_dh07',
    content:
      '얼마 전 교통사고 직접 수습하신 거 정말 대단하셨어요. 그 덕분에 2차사고 막은 거, 진짜 오산시민으로서 자랑스럽습니다. 모범을 보여주셔서 감사합니다.',
    likes: 173,
    createdAtMs: at(2026, 5, 17, 18, 10),
  },
  {
    // 20-30대 신혼부부 / 오산 토박이
    nickname: 'mzqrlk',
    content:
      '저는 오산 토박이고 지금은 세교2지구에 사는 신혼부부입니다. 청년으로서도, 세교2지구 주민으로서도 우리 오산이 더 발전했으면 좋겠어요. 시장님 진심으로 응원합니다',
    likes: 167,
    createdAtMs: at(2026, 5, 17, 20, 45),
  },
]

const NICK_RE = /^[a-zA-Z][a-zA-Z0-9_]{2,18}[a-zA-Z0-9]$/

async function run() {
  console.log(`[top5] projectId=${firebaseConfig.projectId}`)
  for (const item of TOP5) {
    if (!NICK_RE.test(item.nickname)) {
      console.error(`[top5] nickname invalid: ${item.nickname}`)
      process.exit(1)
    }
    if (item.content.length > 500) {
      console.error(`[top5] content too long (${item.content.length}): ${item.content}`)
      process.exit(1)
    }
    const ref = await addDoc(collection(db, 'cheers'), {
      nickname: item.nickname,
      content: item.content,
      createdAt: Timestamp.fromMillis(item.createdAtMs),
      reports: 0,
      isHidden: false,
      fromGame: false,
      likes: item.likes,
    })
    console.log(`[top5] +${item.likes.toString().padStart(3)} likes  ${ref.id}  ${item.nickname}  (${item.content.length}자)`)
  }
  console.log('[top5] done')
  process.exit(0)
}

run().catch((e) => {
  console.error('[top5] failed', e)
  process.exit(1)
})
