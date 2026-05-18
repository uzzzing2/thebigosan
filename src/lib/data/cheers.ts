export interface Cheer {
  id: string
  nickname: string
  content: string
  /** ISO timestamp string */
  createdAt: string
}

/* Mock — replaced in Step 8 with Firestore `cheers` (realtime) */
export const mockCheers: Cheer[] = [
  { id: 'c1', nickname: 'osan_2026', content: '더 큰 오산을 위해 함께하겠습니다! 화이팅!', createdAt: '2026-05-19T09:30:00Z' },
  { id: 'c2', nickname: 'sema_dad', content: '세교 3지구 재지정 진짜 감사합니다. 14년을 기다렸어요.', createdAt: '2026-05-19T08:12:00Z' },
  { id: 'c3', nickname: 'mom_yj', content: '아이 키우기 좋은 도시로 만들어주세요. 24시간 어린이집 공약 기대합니다.', createdAt: '2026-05-18T22:48:00Z' },
  { id: 'c4', nickname: 'jung_ang', content: '오색시장 살아나는 거 보고 응원하게 됐어요.', createdAt: '2026-05-18T21:05:00Z' },
  { id: 'c5', nickname: 'young_osan', content: '청년 주택 공약 꼭 지켜주세요!', createdAt: '2026-05-18T19:20:00Z' },
  { id: 'c6', nickname: 'commuter_88', content: 'GTX-C 연장, 진심 부탁드립니다.', createdAt: '2026-05-18T17:42:00Z' },
  { id: 'c7', nickname: 'teacher_kim', content: '학교 시설 개선 정말 체감되고 있어요. 감사합니다.', createdAt: '2026-05-18T15:10:00Z' },
  { id: 'c8', nickname: 'sinjang_2', content: '세교 2지구 학생인데 도서관 기대돼요.', createdAt: '2026-05-18T13:33:00Z' },
  { id: 'c9', nickname: 'silver_lee', content: '경로당 새로 지어주셔서 감사합니다.', createdAt: '2026-05-18T11:18:00Z' },
  { id: 'c10', nickname: 'daewon_1', content: '동부대로 지하화 1단계 정말 시원해요. 2단계도 부탁드립니다.', createdAt: '2026-05-18T09:02:00Z' },
  { id: 'c11', nickname: 'parent_choi', content: '아이드림센터 잘 쓰고 있어요. 어린이집 확대 부탁드립니다.', createdAt: '2026-05-17T22:30:00Z' },
  { id: 'c12', nickname: 'osan_runner', content: '오산천 정비 너무 좋아요. 아침마다 산책합니다.', createdAt: '2026-05-17T20:05:00Z' },
  { id: 'c13', nickname: 'gachon_kim', content: '운암뜰 AI시티 빠르게 진행해주세요!', createdAt: '2026-05-17T18:25:00Z' },
  { id: 'c14', nickname: 'sema_mom', content: '양산동 중학교 조기 완공 꼭 부탁드립니다.', createdAt: '2026-05-17T16:48:00Z' },
  { id: 'c15', nickname: 'osan_pal', content: '검증된 일꾼, 다시 한 번 더 큰 오산으로!', createdAt: '2026-05-17T14:12:00Z' },
  { id: 'c16', nickname: 'first_voter', content: '첫 투표예요. 꼭 응원합니다.', createdAt: '2026-05-17T11:05:00Z' },
  { id: 'c17', nickname: 'osan_dad', content: '청년주택 2,500호 공급 약속 꼭 지켜주세요.', createdAt: '2026-05-16T22:30:00Z' },
  { id: 'c18', nickname: 'osan_old', content: '경로당 좋아졌어요. 어르신 의료 지원도 부탁합니다.', createdAt: '2026-05-16T20:05:00Z' },
  { id: 'c19', nickname: 'osan_biz', content: '오색시장 활성화 정책 좋습니다. 계속 부탁드립니다.', createdAt: '2026-05-16T18:30:00Z' },
  { id: 'c20', nickname: 'osan_grad', content: '졸업하고 오산에서 일하고 싶어요. 일자리 만들어주세요.', createdAt: '2026-05-16T16:00:00Z' },
]

export const MOCK_CHEER_COUNT = 1234

export function formatRelative(iso: string, now: Date = new Date()): string {
  const then = new Date(iso)
  const diffMs = now.getTime() - then.getTime()
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  if (diffMs < minute) return '방금 전'
  if (diffMs < hour) return `${Math.floor(diffMs / minute)}분 전`
  if (diffMs < day) return `${Math.floor(diffMs / hour)}시간 전`
  if (diffMs < 7 * day) return `${Math.floor(diffMs / day)}일 전`
  return iso.slice(0, 10).replace(/-/g, '.')
}
