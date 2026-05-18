export type WorkerCategory = '경제 일꾼' | '매력 일꾼' | '따뜻한 일꾼' | '믿음직한 일꾼'

export interface CorePledge {
  id: string
  title: string
  category: WorkerCategory
}

export const corePledges: CorePledge[] = [
  { id: '01', title: 'AI·반도체 중심의 오산 테크노밸리 조성', category: '경제 일꾼' },
  { id: '02', title: '365일 24시간 어린이집 돌봄 체계 구축', category: '따뜻한 일꾼' },
  { id: '03', title: 'AI 스마트 교육 프로그램 구축', category: '따뜻한 일꾼' },
  { id: '04', title: '세교2·3지구 복합쇼핑몰 및 (대학)종합병원 유치', category: '경제 일꾼' },
  { id: '05', title: '오산 역세권 및 구도심 재개발', category: '경제 일꾼' },
  { id: '06', title: '운암뜰 AI시티 조기 완공', category: '경제 일꾼' },
  { id: '07', title: '오산시 공공산후조리원 설립', category: '따뜻한 일꾼' },
  { id: '08', title: '분당선 세교2·3지구 연장', category: '경제 일꾼' },
  { id: '09', title: '청년·신혼부부 공공주택 2,500호 공급', category: '따뜻한 일꾼' },
  { id: '10', title: '세교터미널 및 메가복합타운 조성', category: '경제 일꾼' },
]

export const workerCategoryMeta: Record<
  WorkerCategory,
  { icon: string; lead: string; description: string }
> = {
  '경제 일꾼': {
    icon: '🏗️',
    lead: '경제 일꾼',
    description: 'AI로 연결하고 반도체로 도약하는 지능형 경제자족도시',
  },
  '매력 일꾼': {
    icon: '🎨',
    lead: '매력 일꾼',
    description: '일상이 축제가 되는 매력충만 복합문화도시',
  },
  '따뜻한 일꾼': {
    icon: '💝',
    lead: '따뜻한 일꾼',
    description: '데이터로 더욱 섬세하게 살피는 초밀착 맞춤 행복도시',
  },
  '믿음직한 일꾼': {
    icon: '🛡️',
    lead: '믿음직한 일꾼',
    description: '365일·24시간 마음 놓이는 보살핌, 안심가득 돌봄도시',
  },
}

export type DistrictName =
  | '중앙동'
  | '세마동'
  | '신장1동'
  | '신장2동'
  | '대원1동'
  | '대원2동'
  | '남촌동'
  | '초평동'

export interface DistrictPledge {
  count: number
  items: string[]
}

export const districtPledges: Record<DistrictName, DistrictPledge> = {
  '중앙동': {
    count: 4,
    items: [
      '오색시장 스토리-커머스 통합 플랫폼 구축',
      '하수관로 정비',
      '공공형 스터디카페 설치',
      '운암단지 가로등 조도 개선사업',
    ],
  },
  '세마동': {
    count: 6,
    items: [
      '오산휴게소 스마트 하이패스 IC설치',
      '금암~지곶, 서랑동 연결도로 조기 완공',
      '양산동~1번국도 연결도로 조기 완공',
      '세마역 앞 분수대 광장 리모델링',
      '양산동 중학교 조기 완공',
      '물놀이장 개설 추진',
    ],
  },
  '신장1동': {
    count: 6,
    items: [
      '세마고 등하굣길 확장 공사',
      '석산터널 공사 조기완공',
      '물향기수목원(세교2·3지구 방면) 출입구 설치',
      '신장1동 파크골프장 조성',
      '공공형 스터디 카페 설치',
      '고인돌 공원 주차장 조성 추진',
    ],
  },
  '신장2동': {
    count: 4,
    items: [
      '세교1·2·3지구↔오산역↔오산대역 BRT(간선급행) 구축',
      '신장2동 문화가족도서관 건립',
      '신장2동 행정복지센터 조기 완공추진',
      '오산대역 중심상가 활성화 프로젝트 추진',
    ],
  },
  '대원1동': {
    count: 4,
    items: [
      '구도심 소규모주택 정비 관리지역 지정 추진',
      '주차장 확충',
      '원동초사거리~한전사거리 지하화 추진',
      '원동(천일)사거리 지하화 추진',
    ],
  },
  '대원2동': {
    count: 5,
    items: [
      '대원동 문화도서관 건립',
      '대원2동 행정복지센터 신설',
      '동부대로 지하화 2단계 조기 완공 추진',
      '롯데캐슬 앞 도로신설 조기 추진',
      '대원2동 고속도로 하부관통 도로 추진',
    ],
  },
  '남촌동': {
    count: 5,
    items: [
      '남촌동 구도심 주거재생혁신지구 지정 추진',
      '세교2지구 복합문화센터 건립',
      '남촌 소방서 건립 추진',
      '세교2지구 광역버스 확충',
      '가장2산단 임시공영주차장 연내 완공',
    ],
  },
  '초평동': {
    count: 5,
    items: [
      '세교2지구 광역버스 확충',
      '세교2지구 문화가족 도서관 건립',
      '세교2지구 사회복지타운 조성',
      '세교2지구 경찰지구대 설치',
      '주차장 확충',
    ],
  },
}

export const DISTRICT_NAMES: DistrictName[] = [
  '중앙동',
  '세마동',
  '신장1동',
  '신장2동',
  '대원1동',
  '대원2동',
  '남촌동',
  '초평동',
]

export const SURVEY_FIELDS = [
  '교통',
  '교육',
  '복지',
  '경제',
  '문화',
  '환경',
  '안전',
  '도시개발',
] as const
export type SurveyField = (typeof SURVEY_FIELDS)[number]

export const SURVEY_AGES = [
  '20대 이하',
  '30대',
  '40대',
  '50대',
  '60대',
  '70대 이상',
] as const
export type SurveyAge = (typeof SURVEY_AGES)[number]
