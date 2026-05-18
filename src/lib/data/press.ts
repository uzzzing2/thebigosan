export type PressCategory = '정책' | '칼럼'

export interface PressItem {
  id: string
  category: PressCategory
  title: string
  body: string
  publishedAt: string
  mediaLinks: { name: string; url: string }[]
  /** Optional thumbnail path under /public/images/press/ */
  thumbnail?: string
}

/* Mock data — replaced in Step 8 with Firestore `press` */
export const pressItems: PressItem[] = [
  {
    id: 'pr1',
    category: '정책',
    title: '이권재, 세교3지구 재지정 14년 만의 결실 발표',
    body: '<p>오산시는 14년 3개월 만에 세교3지구 공동주택지구 재지정을 확정했다고 밝혔다. 부지면적 4,308천㎡(약 131만평)에 약 33,000세대 규모로 조성된다.</p><p>이권재 시장은 "멈춰있던 도시 개발을 다시 움직이게 한 시민과의 약속을 지킨 결과"라고 말했다.</p>',
    publishedAt: '2026-05-14',
    mediaLinks: [
      { name: '경기일보', url: '#' },
      { name: '조선일보', url: '#' },
      { name: '한겨레', url: '#' },
    ],
  },
  {
    id: 'pr2',
    category: '정책',
    title: 'GTX-C 오산 연장 노선 확정, 2027년 착공 목표',
    body: '<p>GTX-C 노선의 오산 연장이 정부 계획에 반영되어 시민의 광역교통이 크게 개선될 전망이다.</p>',
    publishedAt: '2026-05-10',
    mediaLinks: [
      { name: '경기일보', url: '#' },
      { name: '중앙일보', url: '#' },
    ],
  },
  {
    id: 'pr3',
    category: '칼럼',
    title: '오산의 미래는 시민의 약속에 있다',
    body: '<p>도시는 건물로 지어지지 않는다. 시민과의 신뢰로 지어진다.</p>',
    publishedAt: '2026-05-06',
    mediaLinks: [{ name: '오산타임즈', url: '#' }],
  },
  {
    id: 'pr4',
    category: '정책',
    title: '청년·신혼부부 공공주택 2,500호 공급 계획 발표',
    body: '<p>청년·신혼부부의 주거 부담을 줄이기 위한 공공주택 2,500호 공급 계획이 발표됐다.</p>',
    publishedAt: '2026-05-02',
    mediaLinks: [{ name: '경기신문', url: '#' }],
  },
  {
    id: 'pr5',
    category: '정책',
    title: '운암뜰 AI시티 조기 완공 추진',
    body: '<p>운암뜰 개발지구의 실시계획 용역이 본격 진행되며 AI시티 조기 완공이 가시화됐다.</p>',
    publishedAt: '2026-04-28',
    mediaLinks: [{ name: '경기일보', url: '#' }],
  },
  {
    id: 'pr6',
    category: '칼럼',
    title: '일을 보여주는 도시, 오산이 가는 길',
    body: '<p>화려한 말보다 시민이 체감하는 결과로 답하겠습니다.</p>',
    publishedAt: '2026-04-22',
    mediaLinks: [{ name: '오산타임즈', url: '#' }],
  },
]

export function getPressItem(id: string): PressItem | undefined {
  return pressItems.find((p) => p.id === id)
}

export function getAdjacentPress(id: string): {
  prev?: PressItem
  next?: PressItem
} {
  const sorted = [...pressItems].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : -1,
  )
  const idx = sorted.findIndex((p) => p.id === id)
  if (idx === -1) return {}
  return {
    prev: sorted[idx + 1],
    next: sorted[idx - 1],
  }
}

export function formatPressDate(iso: string): string {
  return iso.replace(/-/g, '.')
}
