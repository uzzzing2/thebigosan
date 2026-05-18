/**
 * Client-side soft filter for cheer content.
 *
 * Step 8: Firebase에서 settings/bannedWords 컬렉션으로 가져와 서버 측에서도
 * 동일하게 검증합니다. 이 파일은 첫 입력 경험을 위한 1차 차단이며,
 * 최종 검증은 서버에서 수행합니다.
 */

const RAW_LIST: string[] = [
  // 일반 욕설 (보수적으로 최소화 — 실제 운영용 리스트는 admin에서 관리)
  '시발', '씨발', 'ㅅㅂ', '개새끼', '병신', 'ㅂㅅ', 'ㅄ', '좆', '꺼져',
  // 정치 비방 자제
  '죽어', '죽어라',
  // 스팸
  'http://', 'https://', 'www.',
]

const NORMALIZED = RAW_LIST.map((w) => w.toLowerCase())

/** Returns the first forbidden word found, or null. */
export function findForbiddenWord(text: string): string | null {
  const t = text.toLowerCase().replace(/\s+/g, '')
  for (const w of NORMALIZED) {
    if (w.length > 0 && t.includes(w)) return w
  }
  return null
}

export const FORBIDDEN_WORDS = RAW_LIST
