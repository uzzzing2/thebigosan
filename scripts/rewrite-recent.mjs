/**
 * Rewrite the content of the N most recent cheers (excluding pinned TOP 5)
 * with more natural messages — mix of short reactions, daily anecdotes, and
 * some longer personal stories. Some intentional typos / casual punctuation.
 *
 * Requires temp rules. Usage:
 *   node scripts/rewrite-recent.mjs [count=50]
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

// 핀된 TOP 5 — 절대 덮어쓰지 않음
const PINNED = new Set([
  '9n3LZi82opC2AymRqe8m',
  'ESOOL1tnGJh8ZPohTHqn',
  'ViqvuIfKcJ6t82ITvWPS',
  '6sUODyQbSGq65P33npUN',
  '1nkToJuiHlF3GQ3ApaNA',
])

const SHORT = [
  '응원합니다!',
  '화이팅 ㅎㅎ',
  '꼭 당선되시길 바랍니다!',
  '오산 화이팅~',
  '한 표 드릴게요',
  '늘 고생 많으세요',
  '더 큰 오산!',
  '지지합니다',
  '기대됩니다 ㅎㅎ',
  '오산 위해 부탁드려요',
  '이번에도 응원합니다',
  '감사합니다 시장님',
  '수고 많으십니다',
  '한 표 보냅니다!',
  '건강하시고 화이팅',
  '응원해요 ㅠㅠ',
  '오산 토박이 응원해요',
  '꼭 부탁드립니다',
  '참 좋은 분이세요',
  '변화가 보입니다',
  '계속 잘 부탁드려요',
  '시장님 화이팅!',
  '진심 응원합니다',
  '믿고 갑니다',
  '한 번 더 부탁드려요',
  '오산 좋아질 거예요',
  '늘 응원해요',
  '이런 분이 시장이라 다행',
  '시민으로서 자랑스럽습니다',
  '믿고 한 표 드립니다',
]

const MEDIUM = [
  '출근길에 늘 응원합니다. 늘 건강 챙기세요',
  '지난 4년간 정말 수고 많으셨어요. 다시 한번 부탁드립니다',
  '오색시장 상인들이 다들 응원하시더라구요. 저도 같이 응원할게요',
  '투표날 가족 다 데리고 가서 한 표 드릴게요',
  '동네에서 자주 뵙는 분이 추천해줘서 알게 됐어요. 진짜 좋은 분 같아요',
  '운암지구 살아요. 동네 좋아지는 거 체감되네요',
  '어제 길에서 인사하시는 모습 봤어요. 진짜 부지런하신 분이에요',
  '엄마가 시장님 좋아하셔서 같이 응원하러 왔어요 ㅎㅎ',
  '10년 넘게 살면서 이런 시장님 처음입니다. 진짜로요',
  '공약도 좋고 사람도 좋아보입니다. 잘 부탁드려요',
  '솔직히 정치 잘 모르는데 동네 분위기 보면 다들 응원하시더라구요',
  '어머니 모시고 사는데 어르신 정책 보고 마음 정했습니다',
  '신혼인데 오산 잘 선택했다 싶어요. 시장님 덕분에 만족합니다',
  '초등 학부모입니다. 시장님 응원합니다. 화이팅',
  '동네 친구들 다 응원하더라구요. 저도 한 표 보탤게요',
  '이번에도 꼭 됐으면 좋겠어요. 응원합니다',
  '오산이 점점 좋아지고 있는 거 같아서 기쁩니다',
  '출장 다녀와서 동네 산책했는데 깨끗해져서 좋더라구요',
  '사진 한 장 같이 찍어주신 거 가족이 다 부러워했어요 ㅎ',
  '아이 학교 다니는데 시장님 정책 덕분에 좋아진 거 많아요',
  '20대인데 오산 살면서 처음으로 시장 선거에 관심이 가네요',
  '4년 동안 변하는 거 보면 진짜 일하는 분이라는 게 느껴져요',
  '운암뜰 빨리 진행됐으면 좋겠어요. 동네가 너무 기대됩니다',
  '저는 세교에 사는데 시장님 덕분에 살기 편해졌어요. 감사합니다',
  '오산천 산책로 진짜 잘 되어 있어요. 매일 다닙니다',
  '동네 어머니들도 다 시장님 얘기 많이 해요. 좋다고요',
  '솔직히 처음엔 별로였는데 일하시는 거 보고 마음 바뀌었어요',
  '시장님 같은 분이 더 많아져야 한다고 생각합니다',
  '회사 점심시간에 동료들이랑 시장님 얘기 자주 합니다',
  '저희 가족 다 같이 응원하고 있어요. 꼭 됐으면 좋겠어요',
  '40대 직장인입니다. 잘 안 나서는 편인데 이번엔 응원 한마디 남겨요',
  '학원 아이들도 시장님 얘기 자주 하더라구요. 인기 많으세요 ㅎㅎ',
  '동네에 이만한 분이 또 없어요. 진짜 일꾼이라는 느낌',
  '집 앞 도로 정비된 거 보면서 진짜 시원하더라구요. 감사합니다',
  '솔직히 큰 기대 없었는데 4년 보고 마음 바뀐 사람 많아요',
  '주변 친구들도 다 응원해요. 우리 동네에 이런 분이 있어서 다행',
]

const LONG = [
  '지난 토요일에 마트 갔다가 우연히 시장님 보고 인사드렸는데, 너무 친절하게 받아주셔서 감동이었어요. 평소 일하시는 모습 그대로구나 싶었습니다. 진심으로 응원합니다',
  '저는 신장2동 살고 있는데 도서관 건립 진짜 기다리고 있어요. 우리 아이가 책 좋아하는데 가까운 도서관이 없어서 항상 멀리 다녔거든요. 빨리 진행됐으면 좋겠습니다. 화이팅하세요!',
  '결혼하고 오산에 정착한 지 3년 됐어요. 처음엔 다른 도시 갈까 했는데 시장님 보면서 마음이 바뀌었어요. 이런 분 계셔서 오산에 정착할 결심 굳혔습니다. 정말 감사드려요',
  '어제 동네 카페에서 이웃 어르신들이랑 이야기 나누다가 시장님 얘기가 나왔는데, 다들 입을 모아 칭찬하시더라구요. 한 분도 빠짐없이요. 그런 분이 우리 시장이라는 게 자랑스럽습니다',
  '출퇴근 길에 매일 답답한 도로 보면서 시장님 공약 떠올리며 위로받습니다. 빨리 좀 됐으면 좋겠어요 ㅠㅠ 시민들 마음 너무 답답해요. 그래도 시장님 믿고 기다리겠습니다',
  '60대 자영업합니다. 코로나 때부터 정말 힘들었는데 시장님 지원 정책 덕분에 버텼어요. 늘 잊지 않고 응원합니다. 이번에도 꼭 같이 갈게요. 건강 챙기시면서 일하세요',
  '어머니 칠순잔치 때 동네 어르신들이 다 오셨는데 그때도 시장님 얘기로 한참 떠들썩했어요. 진짜 어르신들한테 잘하시는 거 같습니다. 우리 어머님이 그 양반 사람 됐다고 늘 그러세요',
  '오산에서 30년 넘게 살았어요. 진짜 동네가 이렇게 변할 수 있구나 싶을 정도예요. 시장님 덕분에 살기 좋아졌습니다. 다음 4년도 부탁드릴게요. 응원합니다',
  '저는 평소에 정치에 무관심한 편인데 이번엔 좀 다르네요. 동네 변하는 거 직접 보고 나니까 진짜 일하는 분이 누군지 알겠더라구요. 그래서 응원합니다. 꼭 됐으면 해요',
  '주말에 가족이랑 오산천 산책했는데 너무 좋아졌더라구요. 아이들도 좋아하고. 이런 거 하나하나가 다 시장님 손길이라고 생각하니까 더 감사하네요. 진심으로 응원합니다',
  '저희 부모님이 시장님 진짜 좋아하세요. 동네 친구분들이랑 만나면 늘 시장님 얘기더라구요. 자식이 그 모습 보면서 저도 자연스럽게 마음이 가더라구요. 응원합니다',
  '회사 점심시간에 동료들이랑 자주 시장님 얘기해요. 다들 일 잘하신다고 칭찬이에요. 정치 색깔 떠나서 일 잘하는 사람이 인정받는다는 게 좋더라구요. 이번에도 꼭 부탁드립니다',
  '아이들 어린이집 보내는데 시장님 보육 정책 진짜 와닿아요. 워킹맘 입장에서 이만한 시장이 어딨나 싶습니다. 다른 도시 친구들이 부러워해요. 진심으로 감사드리고 응원합니다',
  '저는 솔직히 다른 후보 지지자였는데 4년 동안 일하시는 거 보고 마음 바뀌었어요. 진짜로 동네 위해서 일하시는 게 보이더라구요. 사람이 먼저구나 싶습니다. 이번엔 응원합니다',
  '저희 동네 가게 사장님들이 다들 시장님 좋아하세요. 가게에 들르시면 잘 챙겨주신다고요. 진짜 발로 뛰시는 분 같아서 응원하게 됐어요. 건강 챙기시면서 일하세요',
]

function pickOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateContent() {
  // 25% short, 50% medium, 25% long
  const r = Math.random()
  if (r < 0.25) return pickOne(SHORT)
  if (r < 0.75) return pickOne(MEDIUM)
  return pickOne(LONG)
}

const N = Number.parseInt(process.argv[2] ?? '50', 10)

async function run() {
  // Grab enough docs to skip pinned and still have N to rewrite
  const q = query(collection(db, 'cheers'), orderBy('createdAt', 'desc'), limit(N + PINNED.size + 5))
  const snap = await getDocs(q)
  console.log(`[rewrite] fetched ${snap.size} most recent`)

  const targets = snap.docs.filter((d) => !PINNED.has(d.id)).slice(0, N)
  console.log(`[rewrite] rewriting ${targets.length} (excluding ${snap.size - targets.length} pinned)`)

  // Build candidates and dedupe so same template isn't picked too often consecutively
  const used = new Map()
  function gen() {
    for (let i = 0; i < 6; i++) {
      const c = generateContent()
      const k = (used.get(c) ?? 0)
      if (k < 3) {
        used.set(c, k + 1)
        return c
      }
    }
    return generateContent()
  }

  let updated = 0
  for (const d of targets) {
    const newContent = gen()
    await updateDoc(doc(db, 'cheers', d.id), { content: newContent })
    updated++
    if (updated % 10 === 0) console.log(`[rewrite] ${updated}/${targets.length}`)
  }
  console.log(`[rewrite] done. updated=${updated}`)
  process.exit(0)
}

run().catch((e) => {
  console.error('[rewrite] failed', e)
  process.exit(1)
})
