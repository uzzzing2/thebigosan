/**
 * One-shot seed: add longer, story-style cheers that feel hand-written.
 * Mixed correct spelling and intentional small typos. Daytime-biased timing.
 *
 * Usage:
 *   node scripts/seed-long-cheers.mjs [count]   # default 80
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { initializeApp } from 'firebase/app'
import {
  collection,
  doc,
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
  console.error('[seed-long] Firebase env vars missing in .env.local')
  process.exit(1)
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// 정자 (standard) — 정성껏 쓴 톤
const CLEAN_TEMPLATES = [
  '시장님 얼마전에 서랑저수지에서 말씀하시는 거 봤습니다. 정말 진심으로 하시는 것 같아서 감동이었습니다',
  '오늘 점심에 오색시장 갔는데 후보님이 직접 상인분들 한분 한분 인사하시더라구요. 사람 냄새가 좋아요',
  '엊그제 운암지구 산책길에서 우연히 만났는데 시민 한분 한분 눈 마주치며 인사해주셨어요. 감동입니다',
  '우리 어머님이 늘 후보님 응원하세요. 그 양반은 진짜 우리같은 사람 마음 알아준다고 그러시더라구요',
  '4년 전엔 솔직히 큰 기대 안 했는데 진짜로 약속하신 거 하나씩 지키시는 거 보고 이번엔 자발적으로 응원합니다',
  '오산천에서 매일 산책하는데 정비 전이랑 후랑 진짜 천지차이예요. 다른 공약도 이렇게만 부탁드릴게요',
  '남편이랑 결혼하고 오산 정착했는데 그동안 동네 많이 좋아졌어요. 신혼부부 정책 더 적극적으로 부탁드려요',
  '우리 아이가 양산동 중학교 갈 예정인데 조기 완공 진짜 부탁드려요. 통학거리 때문에 가족 다 걱정이에요',
  '60대 직장인입니다. 분당선 연장 진짜 절실해요. 매일 출근길에 답답한 마음으로 도로만 봅니다',
  '오색시장에서 30년 장사한 사람으로서 한마디 합니다. 후보님이 진짜로 시장 생각해주시는 분이에요',
  '엄마가 노인일자리 다니시는데 후보님 정책 덕분에 자리 생겼다고 너무 좋아하세요. 정말 감사합니다',
  '솔직히 정치 잘 모르는데 동네 변하는 거 보면서 자연스럽게 응원하게 됐습니다. 계속 잘 부탁드릴게요',
  '우리 동네 가로등 어두웠던 거 진짜 무서웠는데 정비해주셔서 이제 밤에 다녀도 안심돼요. 정말 감사합니다',
  '아이드림센터 우리 아이가 잘 다니는데 너무 좋아해요. 워킹맘으로서 정말 감사합니다. 시설 더 늘려주세요',
  '운암뜰 AI시티 진짜 실현되면 우리 동네 위상이 달라질 것 같아요. 빨리 진행 부탁드려요',
  '세교3지구 재지정 14년 기다렸는데 진짜 가슴 뛰는 일이에요. 약속 끝까지 부탁드립니다',
  '지난 일요일에 오색시장에서 우연히 마주쳤어요. 어머니랑 같이 사진 찍고 인사도 해주셔서 너무 좋았어요',
  '오산에서 25년 살았는데 요즘 동네가 진짜 변하고 있다는 게 느껴져요. 더 큰 오산 만들어주세요',
  '남촌동 사는데 소방서 건립 진짜 절실합니다. 응급상황 생기면 진짜 막막한 동네예요. 부탁드려요',
  '출근하다 길거리에서 후보님 봤어요. 더운데도 표정 관리하시며 한사람 한사람 진심으로 응대해주시더라구요',
  '오산 토박이입니다. 어릴 때부터 자란 동네가 이렇게 바뀌는 걸 보니 감회가 새롭네요. 더 발전하길 바랍니다',
  '어머니가 경로당에서 자주 들으신대요. 후보님 칭찬이 끊이질 않는다고요. 우리 어머니 말씀은 진짜예요',
  '동부대로 지하화 1단계 진짜 시원하더라구요. 출근시간 막힐 때마다 후보님 생각났어요. 2단계도 부탁드려요',
  '어머님 모시고 사는데 어르신 정책이 진짜 와닿아요. 작은 것 하나하나 챙기시는 모습 인상깊습니다',
  '신혼 때 처음 오산 왔을 때만 해도 이 정도가 아니었는데 진짜 도시가 살아나고 있다는 게 느껴져요',
  '유세 현장에서 직접 봤는데 사람들에게 진심을 다해 대하시는 모습에 감동받았어요. 꼭 당선 부탁드려요',
  '오산천 산책하다가 자주 만나는 분들 다 한마디씩 합니다. 후보님 같은 분이 있어서 다행이라고요',
  '오산휴게소 스마트IC 이거 진짜 필요해요. 매일 지나가면서 답답했는데 약속 꼭 지켜주시길 바랍니다',
  '신장2동 도서관 진짜 부탁드립니다. 아이 데리고 갈 만한 곳이 너무 없어요. 정말로요',
]

// 약간 오타/구어체/생활체 — 진짜 사람이 모바일에서 막 쳤을 법한 느낌
const CASUAL_TEMPLATES = [
  '시장님 얼마전에 서랑저수지에서 말씀하시는거 봤습닏 진짜 진심으로 하시는것같아서 감동이엇어요',
  '오늘 점심에 오색시장 갓는데 후보님이 직접 상인분들 한분한분 인사하시더라구용 사람냄새가 좋더라구요',
  '엊그제 운암지구 산책길에서 우연히 만났는데 한분한분 눈마주치면서 인사해주셧어요 감동..',
  '4년전엔 솔직히 별 기대 안햇는데 약속하신거 진짜로 하나씩 지키시는걸 보니까 이번에 자진해서 응원합니다',
  '오산천 매일 산책하는데 정비 전후 진짜 천지차이임 다른공약도 이렇게만 좀 부탁이요',
  '신혼이라 오산 정착햇는데 그동안 동네 많이 좋아졋어요 신혼부부 정책 좀더 부탁드릴게요',
  '우리아이 양산동 중학교 갈예정인데 조기완공 진짜 부탁드려요 통학거리때문에 진짜 걱정많아요',
  '60대 직장인이에요 분당선 연장 진짜 절실함 매일 출근길 답답한맘에 도로만 봅니다',
  '오색시장 30년 장사한 사람인데 한마디 합니다 후보님은 진짜로 시장 생각해주시는분이라 응원해요',
  '솔직히 정치 잘 모르는데 동네 바뀌는거 보면서 자연스레 응원하게 됫어요 계속 잘부탁드려요',
  '동네 가로등 어두웠던거 진짜 무섭드라구요 정비해주셔서 이제 밤에도 안심돼요 정말 감사합니다 ㅠㅠ',
  '아이드림센터 우리아이 너무 좋아해요 워킹맘으로서 진짜 감사함미다 시설 좀더 늘려주시면 좋겟어요',
  '운암뜰 AI시티 진짜 실현되면 우리동네 위상이 달라질거같아요 빨리좀 부탁드려요!!',
  '세교3지구 재지정 14년 기다렷어요 진짜 가슴 뛰는 일이에요 약속 끝까지 부탁드림미다',
  '지난 일요일 오색시장에서 우연히 마주쳣는데 어머니랑 사진도 찍어주시고 너무 좋앗어요 ㅎㅎ',
  '오산에서 25년 살앗는데 요즘 동네가 진짜 변하고있다는게 느껴져요 더큰오산 만들어주세요',
  '남촌동 사는데 소방서 건립 진짜 절실해요 응급상황 생기면 진짜 막막한 동네임 부탁드려요요',
  '오산 토박이임 어릴때 자란 동네가 이렇게 바뀌는걸 보니 감회가 새롭네요 더 발전하길 바라요',
  '어머니가 경로당에서 후보님 칭찬 자주 들으신대요 우리어머니 말씀이 진짜라니까요 ㅎ',
  '동부대로 지하화 1단계 진짜 시원하더라구요 출근시간마다 후보님 생각났어요 2단계도 부탁용',
  '어머님 모시고 사는데 어르신 정책 진짜 와닿더라구요 작은거 하나하나 챙기시는모습 인상깊어요',
  '신혼때 오산 왔을때만해도 이정도는 아니였는데 진짜 도시가 살아나고있는게 느껴짐 ㄷㄷ',
  '오산천 산책할때 마주치는 분들 다 한마디씩 해요 후보님같은분이 있어서 다행이라고들 합니다',
  '솔직히 처음엔 그러려니 했는데 사람들 모인거 보니까 진짜 인기 실감했어요 응원함미다',
  '오색시장 갔다가 우연히 봤는데 진짜 상인 한분한분 시간 들여서 들어주시더라구용',
  '저희동네 어르신들도 다 응원해요. 어르신정책 잘 챙겨주시는모습 보고 다들 좋게 생각하셔요',
]

const NICK_ROOTS = [
  'osan', 'sema', 'sinjang', 'daewon', 'namchon', 'chopyeong', 'jungang', 'segyo',
  'kim', 'lee', 'park', 'choi', 'jung', 'kang', 'cho', 'yoon', 'han', 'oh', 'seo',
  'shin', 'hwang', 'song', 'kwon', 'lim', 'ryu', 'go', 'min', 'baek', 'ahn',
  'dad', 'mom', 'gma', 'gpa', 'unni', 'noona', 'ahjumma', 'ahjussi',
  'native', 'tenant', 'owner', 'commuter', 'walker', 'runner',
]

const NICK_SUFFIX = [
  '88', '99', '07', '26', '2026', '1004', '777', '00', '01', '12', '76', '63',
  'yj', 'jh', 'sj', 'mj', 'jk', 'hs', 'hk', 'ms', 'ys', 'ds', 'jw',
  'osan', 'kim', 'lee', 'park', 'dad', 'mom', 'fam',
]

const ENDINGS = ['', '', '', '', '', '!', '...', '~', ' ㅎㅎ', '.', ' ㅠ']

// Heavy lunch (12-13) + dinner (18-21). Minimal early morning / late night.
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

function pickOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomNickname() {
  for (let i = 0; i < 10; i++) {
    const root = pickOne(NICK_ROOTS)
    const suffix = pickOne(NICK_SUFFIX)
    const join = Math.random() < 0.85 ? '_' : ''
    const nick = `${root}${join}${suffix}`
    if (/^[a-zA-Z][a-zA-Z0-9_]{2,18}[a-zA-Z0-9]$/.test(nick)) return nick
  }
  return `osan_${Math.floor(Math.random() * 9000 + 1000)}`
}

function randomContent() {
  // ~45% clean, ~55% casual w/ typos to balance feel
  const pool = Math.random() < 0.45 ? CLEAN_TEMPLATES : CASUAL_TEMPLATES
  let text = pickOne(pool)
  // small chance of trailing ending decoration
  if (Math.random() < 0.4) text += pickOne(ENDINGS)
  if (text.length > 100) text = text.slice(0, 100)
  return text
}

function randomLikes() {
  // 긴 글은 조금 더 후한 경향. 상한 150으로 시드된 TOP 5에 밀리지 않게.
  //   30% → 0-2
  //   35% → 1-20
  //   25% → 15-60
  //   10% → 60-150
  const r = Math.random()
  if (r < 0.30) return Math.floor(Math.random() * 3)
  if (r < 0.65) return 1 + Math.floor(Math.random() * 20)
  if (r < 0.90) return 15 + Math.floor(Math.random() * 46)
  return 60 + Math.floor(Math.pow(Math.random(), 1.5) * 90)
}

const TOTAL = Number.parseInt(process.argv[2] ?? '80', 10)

async function seed() {
  console.log(`[seed-long] Writing ${TOTAL} long cheers to projectId=${firebaseConfig.projectId}`)
  let written = 0
  while (written < TOTAL) {
    const batch = writeBatch(db)
    const n = Math.min(450, TOTAL - written)
    for (let i = 0; i < n; i++) {
      const ref = doc(collection(db, 'cheers'))
      const ts = randomPastTimestamp(3)
      batch.set(ref, {
        nickname: randomNickname(),
        content: randomContent(),
        createdAt: Timestamp.fromMillis(ts),
        reports: 0,
        isHidden: false,
        fromGame: false,
        likes: randomLikes(),
      })
    }
    await batch.commit()
    written += n
    console.log(`[seed-long] ${written}/${TOTAL}`)
  }
  console.log('[seed-long] done')
  process.exit(0)
}

seed().catch((e) => {
  console.error('[seed-long] failed', e)
  process.exit(1)
})
