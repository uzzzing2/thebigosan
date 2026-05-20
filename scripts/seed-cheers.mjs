/**
 * One-shot seed: populate `cheers` collection with diverse fake messages.
 *
 * Usage (from project root):
 *   node scripts/seed-cheers.mjs [count]
 *
 * Default count = 548. Distributes createdAt across the last 3 days.
 * Reads firebase config from .env.local.
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
  console.error('[seed] Firebase env vars missing in .env.local')
  process.exit(1)
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const PLEDGE_KEYWORDS = [
  'AI·반도체 테크노밸리',
  '운암뜰 AI시티',
  '365일 24시간 어린이집',
  'AI 스마트 교육',
  '세교2·3지구 복합쇼핑몰',
  '대학종합병원 유치',
  '오산 역세권 재개발',
  '구도심 재개발',
  '공공산후조리원 설립',
  '분당선 세교 연장',
  '청년·신혼부부 공공주택 2,500호',
  '세교터미널',
  '메가복합타운',
  '오색시장 활성화',
  '동부대로 지하화 2단계',
  '남촌 소방서 건립',
  '신장2동 문화가족도서관',
  '대원동 문화도서관',
  '양산동 중학교 조기 완공',
  '세교2지구 광역버스 확충',
  '물향기수목원 출입구',
  '오산천 정비',
  '공공형 스터디카페',
  '물놀이장 개설',
  '신장1동 파크골프장',
  '오산휴게소 스마트 IC',
  '세마역 분수대 광장',
  '대원2동 행정복지센터',
  '세교2지구 복합문화센터',
  '구도심 주차장 확충',
  'BRT 간선급행버스',
  '경로당 확충',
  '청년 일자리',
  '아이드림센터',
  '석산터널 조기 완공',
]

const PERSONAS = [
  {
    weight: 16, // 20대 / 청년
    templates: [
      'ㅋㅋ {p} 이거 ㄹㅇ 필요했음',
      '{p} 진심 부탁드려요 ㅠㅠ',
      '{p} 어케 생각하셨대요 ㄷㄷ',
      '{p} 이거 보고 한 표 던집니다 ㅋㅋ',
      '청년들도 응원합니다! {p} 꼭이요',
      '{p} ㄱㅈㅇㅈ 진짜로',
      '후보님 {p} 약속 꼭 지켜주세여~',
      '{p} 진짜 괜찮은 공약인 듯요',
      '오산 청년인데 {p} 너무 좋네요',
      '{p} 이거 하나만 보고 갑니다 ㅋㅋㅋ',
      '20대 첫 투표인데 {p} 보고 결정했어요',
      '{p} 솔직히 기대됨ㅇㅇ',
      'ㅁㅊ {p} ㄹㅇ 부탁임',
      '{p} 청년한테 진짜 큰 일임',
    ],
  },
  {
    weight: 18, // 30대 / 신혼·육아
    templates: [
      '신혼 첫 집 오산에 잡았는데 {p} 진짜 반갑네요',
      '{p} 우리 아이 키우기 정말 좋아질 것 같아요',
      '맞벌이 부부에게 {p} 너무 필요합니다',
      '30대 워킹맘입니다. {p} 약속 꼭 부탁드려요',
      '{p} 덕분에 오산 떠나지 않고 정착하려구요',
      '결혼하고 오산 왔는데 {p} 진짜 기대돼요',
      '{p} 둘째 낳을 용기가 생기네요 ㅎㅎ',
      '아빠로서 {p} 진심으로 응원합니다',
      '아이드림센터 잘 쓰고 있어요. {p}도 꼭 부탁드립니다',
      '{p} 육아하는 입장에서 정말 와닿는 정책이에요',
      '신혼부부에게 {p} 같은 정책 너무 감사합니다',
      '{p} 우리 가족 미래를 생각하면 정말 든든해요',
    ],
  },
  {
    weight: 18, // 40대 / 학부모·중장년
    templates: [
      '{p} 학부모로서 정말 감사한 정책입니다',
      '중학생 학부모인데 {p} 꼭 부탁드립니다',
      '{p} 우리 아이들 미래를 위해 꼭 이루어졌으면 합니다',
      '초등 둘 키우는데 {p} 진심으로 응원해요',
      '{p} 학교 보낼 때마다 걱정이었는데 다행이에요',
      '40대 학부모입니다. {p} 진심 응원합니다',
      '{p} 사교육비 걱정이 좀 줄어들 것 같아요',
      '학원가 학부모로서 {p} 너무 기대됩니다',
      '{p} 우리 동네 아이들에게 꼭 필요해요',
      '아이들 학교 가는 길 보면서 {p} 늘 생각했어요. 부탁드립니다',
      '{p} 4년 전 약속 지키시는 거 보고 다시 응원합니다',
    ],
  },
  {
    weight: 16, // 50대 / 직장인·통근
    templates: [
      '수원으로 출퇴근하는데 {p} 정말 필요합니다',
      '{p} 매일 막히는 출근길 떠올리면 너무 시원하네요',
      '50대 직장인입니다. {p} 진심으로 응원합니다',
      '{p} 집값 안정에도 도움 될 것 같네요',
      '오산 거주 20년차, {p} 정말 오랜만에 보는 시원한 정책입니다',
      '서울로 통근하는데 {p} 빨리 좀 부탁드려요',
      '{p} 출근하는 사람 입장에서 정말 절실합니다',
      '{p} 우리 동네 변화가 체감되는 정책이에요',
      '회사 동료들도 {p} 다 응원합니다',
      '{p} 진짜 시원하네요. 꼭 약속 지켜주세요',
      '50대 가장으로서 {p} 진심으로 부탁드립니다',
    ],
  },
  {
    weight: 16, // 60대 / 자영업·장기 거주민
    templates: [
      '오산에서 30년 살았는데 {p} 보고 너무 반가웠습니다',
      '오색시장에서 장사하는 사람인데 {p} 정말 든든하네요',
      '60대 자영업자입니다. {p} 약속 꼭 지켜주시리라 믿습니다',
      '{p} 우리 동네가 살아나고 있다는 느낌이에요',
      '오랜 주민으로서 {p} 진심으로 응원합니다',
      '{p} 시장 상권에도 도움 되길 기대합니다',
      '오색시장 매대에서 {p} 보고 정말 든든했어요',
      '{p} 우리 같은 자영업자에게 큰 힘입니다',
      '60대 시민입니다. {p} 정말 잘 해주세요',
      '{p} 검증된 일꾼답게 추진력 보여주세요',
    ],
  },
  {
    weight: 10, // 70대+ / 어르신
    templates: [
      '{p} 어르신들도 살기 좋은 오산이 되길 바랍니다',
      '70대 노인입니다. {p} 정말 감사합니다',
      '경로당에서 듣고 {p} 응원하러 왔습니다',
      '{p} 노인복지에도 꾸준히 신경써주세요',
      '오래 산 사람으로서 {p} 정말 든든합니다',
      '어르신 의료 지원도 부탁드려요. {p}도 응원합니다',
      '{p} 늙은이 한 사람도 응원 보탭니다',
      '경로당 친구들과 함께 {p} 응원합니다',
    ],
  },
  {
    weight: 6, // 무공약 / 일반 응원
    templates: [
      '이권재 후보님 화이팅!',
      '더 큰 오산을 위해 함께하겠습니다',
      '꼭 당선되셨으면 좋겠어요!',
      '오산을 위한 헌신에 박수 보냅니다',
      '오산이 더 좋아질 거라 믿어요',
      '한 표 약속드립니다!',
      '오산의 변화를 응원합니다',
      '검증된 일꾼, 이권재 화이팅!',
      '오산 시민의 한 사람으로 응원합니다',
      '더 큰 오산 만들어주세요!',
      '4년 동안 정말 수고하셨습니다. 한 번 더 응원합니다',
      '오산의 미래를 부탁드립니다',
      '진심을 다하는 모습 늘 응원합니다',
      '한결같은 모습 응원합니다. 화이팅!',
      '시민과 함께하는 시정 기대합니다',
    ],
  },
]

const DISTRICT_INTROS = [
  '중앙동 주민입니다. ',
  '세마동 살아요. ',
  '신장1동 거주민입니다. ',
  '신장2동에서 응원합니다. ',
  '대원1동 주민이에요. ',
  '대원2동에 삽니다. ',
  '남촌동 입니다. ',
  '초평동에 살아요. ',
  '세교2지구 입주 예정입니다. ',
  '세교3지구 입주민이에요. ',
  '운암지구 주민입니다. ',
  '오산역 근처 살아요. ',
]

const NICK_ROOTS = [
  'osan', 'sema', 'sinjang', 'daewon', 'namchon', 'chopyeong', 'jungang', 'segyo',
  'kim', 'lee', 'park', 'choi', 'jung', 'kang', 'cho', 'yoon', 'han', 'oh', 'seo',
  'shin', 'hwang', 'song', 'kwon', 'lim', 'ryu', 'go', 'min', 'baek', 'ahn', 'no',
  'dad', 'mom', 'sis', 'bro', 'kid', 'son', 'gma', 'gpa', 'unni', 'oppa', 'hyung',
  'youth', 'student', 'worker', 'teacher', 'farmer', 'driver', 'nurse', 'shop',
  'gtx', 'rtx', 'starter', 'voter', 'runner', 'walker', 'reader', 'biker',
  'newbie', 'native', 'tenant', 'owner', 'commuter',
]

const NICK_SUFFIX = [
  '88', '99', '07', '26', '2026', '2025', '2024', '1004', '777', '00', '01', '12',
  'yj', 'jh', 'sj', 'mj', 'jk', 'jw', 'hs', 'hk', 'ms', 'ks', 'ys', 'ds',
  'osan', 'sema', 'kim', 'lee', 'park', 'pal', 'fam', 'dad', 'mom',
  'now', 'one', 'two', 'pro', 'fan', 'fwd', 'go',
]

const ENDINGS = ['', '', '', '', '!', '!!', '~', '~~', ' ㅎㅎ', ' :)', '.']

function pickWeighted(personas) {
  const total = personas.reduce((s, p) => s + p.weight, 0)
  let r = Math.random() * total
  for (const p of personas) {
    if (r < p.weight) return p
    r -= p.weight
  }
  return personas[personas.length - 1]
}

function pickOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomNickname() {
  // shape: root_suffix, validated against ^[a-zA-Z][a-zA-Z0-9_]{2,18}[a-zA-Z0-9]$
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
  const persona = pickWeighted(PERSONAS)
  let template = pickOne(persona.templates)
  let text = template
  if (template.includes('{p}')) {
    text = template.replaceAll('{p}', pickOne(PLEDGE_KEYWORDS))
  }
  // ~12% chance of prefixing a district intro
  if (Math.random() < 0.12) {
    text = pickOne(DISTRICT_INTROS) + text
  }
  text = text + pickOne(ENDINGS)
  if (text.length > 100) text = text.slice(0, 100)
  return text
}

// Tiered distribution: 0 most common, moderate range well-represented,
// long tail for breakout posts.
//   40% → 0-2   (대부분 0)
//   35% → 1-15  (소소한 공감)
//   20% → 10-50 (적당히 인기)
//    5% → 30-300+ (인기 글)
function randomLikes() {
  const r = Math.random()
  if (r < 0.40) return Math.floor(Math.random() * 3)        // 0-2
  if (r < 0.75) return 1 + Math.floor(Math.random() * 15)   // 1-15
  if (r < 0.95) return 10 + Math.floor(Math.random() * 41)  // 10-50
  return 50 + Math.floor(Math.pow(Math.random(), 1.5) * 100) // 50-150
}

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
  // Don't pick a future time on the same day
  if (d.getTime() > now.getTime()) d.setTime(d.getTime() - 24 * 60 * 60 * 1000)
  return d.getTime()
}

const TOTAL = Number.parseInt(process.argv[2] ?? '548', 10)

async function seed() {
  console.log(`[seed] Writing ${TOTAL} cheers to projectId=${firebaseConfig.projectId}`)
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
    console.log(`[seed] ${written}/${TOTAL}`)
  }
  console.log('[seed] done')
  process.exit(0)
}

seed().catch((e) => {
  console.error('[seed] failed', e)
  process.exit(1)
})
