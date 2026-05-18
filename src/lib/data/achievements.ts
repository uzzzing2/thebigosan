export type AchievementCategory =
  | '도시개발'
  | '교통'
  | '행정'
  | '안전'
  | '경제'
  | '문화'
  | '환경'
  | '복지'
  | '교육'

export interface Achievement {
  id: string
  category: AchievementCategory
  title: string
  desc: string
  importance: number
  /** Optional image path under /public/images/achievements/ */
  imageUrl?: string
  /** Optional press links */
  relatedLinks?: { name: string; url: string }[]
}

export const achievements: Achievement[] = [
  { id: '01', category: '도시개발', title: '세교3지구 공동주택지구 재지정', desc: '4,308천㎡(약 131만평) / 33,000세대', importance: 1 },
  { id: '02', category: '교통', title: 'GTX-C 오산 연장', desc: '동두천~수원~오산~아산', importance: 2 },
  { id: '03', category: '교통', title: '광역교통망 확충, 학생통학 마을버스', desc: '서울역행·야탑판교행 광역버스, 학생 마을버스 신설', importance: 3 },
  { id: '04', category: '도시개발', title: '운암뜰 개발지구 지정 및 고시', desc: '실시계획 용역 진행중', importance: 4 },
  { id: '05', category: '도시개발', title: '세교터미널 부지매입, 구)계성제지 철거', desc: '세교터미널부지 매입(26.1)', importance: 5 },
  { id: '06', category: '행정', title: '오산도시공사 출범', desc: '관리중심에서 개발 주체로(24.6)', importance: 6 },
  { id: '07', category: '교통', title: '동부대로 지하화 1단계 완공', desc: '오산시청 지하차도 완료(24)', importance: 7 },
  { id: '08', category: '교통', title: '멈췄던 도로공사 착공', desc: '경부선철도 횡단도로·양산동 연결도로 등', importance: 8 },
  { id: '09', category: '안전', title: '스마트 교통·안전시설 확충', desc: 'LED 바닥 신호등 59개소 등', importance: 9 },
  { id: '10', category: '경제', title: '반도체 소부장 특화도시 발판 마련', desc: 'AMAT·이데미츠코산 연구개발센터 유치', importance: 10 },
  { id: '11', category: '문화', title: '물놀이장·맨발 황톳길·둘레길 조성', desc: '6개 물놀이장·14개 황톳길', importance: 11 },
  { id: '12', category: '환경', title: '공동주택 야간 경관조명 및 가로등 개선', desc: '26개 경관조명 설치', importance: 12 },
  { id: '13', category: '행정', title: '남촌동 복합청사 개청', desc: '행정복지센터·가족센터·도서관', importance: 13 },
  { id: '14', category: '문화', title: '서랑저수지 힐링공간 및 4계절 축제', desc: '데크로드·음악분수·계절축제', importance: 14 },
  { id: '15', category: '행정', title: '대원동·신장동 분동', desc: '대원2동 임시청사 운영중', importance: 15 },
  { id: '16', category: '문화', title: '경기도 종합체육대회 유치', desc: '27년 종합체육대회·28년 생활체육대회', importance: 16 },
  { id: '17', category: '복지', title: '생애 주기별 지원금 신규·확대', desc: '출산장려금·여성청소년위생용품 등', importance: 17 },
  { id: '18', category: '복지', title: '안전한 영유아 보육환경 조성', desc: '아이드림센터·등하원쉘터 21개소', importance: 18 },
  { id: '19', category: '복지', title: '청년 도전·자립 지원', desc: '이루잡·청년 주택 지원 등', importance: 19 },
  { id: '20', category: '교육', title: '글로벌 인재육성과 명예의 전당', desc: '특기생 장학금 기부제도 30억', importance: 20 },
  { id: '21', category: '복지', title: '국가보훈유공자·장애인 예우 확대', desc: '참전명예수당·보훈수당 인상', importance: 21 },
  { id: '22', category: '복지', title: '경로당 개축 및 개·보수', desc: '오산시립경로당 개축·156건 개보수', importance: 22 },
  { id: '23', category: '문화', title: '오산 이음 라운지 건립', desc: '동부권역 부산동 문화시설(970㎡)', importance: 23 },
  { id: '24', category: '환경', title: '오산천 정비', desc: '인공섬 준설·벚나무 야간조명 설치', importance: 24 },
  { id: '25', category: '경제', title: '오색시장·원도심 활성화', desc: '아케이트 안전시설·오색전 인센티브', importance: 25 },
  { id: '26', category: '행정', title: '서울사무소 태스크포스 운영', desc: '국·도비 외부재원 1,800억 확보', importance: 26 },
  { id: '27', category: '교통', title: '주차 스트레스 ZERO 주차장 조성', desc: '완료 6개소 307면, 조성중 3개소 748면', importance: 27 },
  { id: '28', category: '교육', title: '학교시설개선', desc: '운천고 체육관·오산고 특별교실동 증축', importance: 28 },
  { id: '29', category: '환경', title: '하수시설 관리 체계 강화', desc: '오산3·세마 하수처리시설 확충', importance: 29 },
  { id: '30', category: '안전', title: '재난안전 예방 활동', desc: '안전시설 점검·자동염수분사장치', importance: 30 },
]

export const ACHIEVEMENT_CATEGORIES: AchievementCategory[] = [
  '도시개발',
  '교통',
  '행정',
  '안전',
  '경제',
  '문화',
  '환경',
  '복지',
  '교육',
]

export const ACHIEVEMENT_HEADLINE_CHIPS = [
  {
    icon: '🏆',
    title: '약속을 지켰습니다',
    desc: '3년 연속 공약이행평가 최우수 등급(SA)',
  },
  {
    icon: '⚡',
    title: '일 잘했습니다',
    desc: '민선 8기 1,800억 국·도비 확보',
  },
  {
    icon: '🚀',
    title: '멈췄던 개발, 다시 움직였습니다',
    desc: '14년 3개월만에 세교 3지구 재지정',
  },
] as const
