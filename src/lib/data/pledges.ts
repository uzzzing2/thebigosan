export type WorkerCategory = '경제 일꾼' | '매력 일꾼' | '따뜻한 일꾼' | '믿음직한 일꾼'

export interface CorePledge {
  id: string
  title: string
  category: WorkerCategory
  /** 매칭용 — 한 핵심 공약이 여러 분야와 관련 있을 수 있음 */
  surveyFields: SurveyField[]
  /** 매칭용 — 비워두면 모든 연령대에 해당 (특정 연령대 한정시만 명시) */
  ages?: SurveyAge[]
}

export const corePledges: CorePledge[] = [
  { id: '01', title: 'AI·반도체 중심의 오산 테크노밸리 조성', category: '경제 일꾼', surveyFields: ['경제', '도시개발'] },
  { id: '02', title: '365일 24시간 어린이집 돌봄 체계 구축', category: '따뜻한 일꾼', surveyFields: ['복지', '교육'], ages: ['20대 이하', '30대', '40대'] },
  { id: '03', title: 'AI 스마트 교육 프로그램 구축', category: '따뜻한 일꾼', surveyFields: ['교육'], ages: ['20대 이하', '30대', '40대', '50대'] },
  { id: '04', title: '세교2·3지구 복합쇼핑몰 및 (대학)종합병원 유치', category: '경제 일꾼', surveyFields: ['도시개발', '복지', '문화'] },
  { id: '05', title: '오산 역세권 및 구도심 재개발', category: '경제 일꾼', surveyFields: ['도시개발', '경제'] },
  { id: '06', title: '운암뜰 AI시티 조기 완공', category: '경제 일꾼', surveyFields: ['도시개발', '경제'] },
  { id: '07', title: '오산시 공공산후조리원 설립', category: '따뜻한 일꾼', surveyFields: ['복지'], ages: ['20대 이하', '30대'] },
  { id: '08', title: '분당선 세교2·3지구 연장', category: '경제 일꾼', surveyFields: ['교통'] },
  { id: '09', title: '청년·신혼부부 공공주택 2,500호 공급', category: '따뜻한 일꾼', surveyFields: ['복지', '도시개발'], ages: ['20대 이하', '30대'] },
  { id: '10', title: '세교터미널 및 메가복합타운 조성', category: '경제 일꾼', surveyFields: ['교통', '도시개발'] },
]

export interface FieldPledgeGroup {
  subtitle: string
  /**
   * 매칭용 — 내게 맞는 공약 설문의 관심 분야.
   * 여러 분야에 걸치는 그룹은 모두 명시 (예: 어린이집 정책 = 복지·교육 모두 해당)
   */
  surveyFields: SurveyField[]
  /** 매칭용 — 비워두면 모든 연령대에 해당 */
  ages?: SurveyAge[]
  items: string[]
}

/** 분야별 세부 공약 (선거공보 7-9페이지) */
export const fieldPledges: Record<WorkerCategory, FieldPledgeGroup[]> = {
  '경제 일꾼': [
    {
      subtitle: '빠르고 편리한 교통중심 오산',
      surveyFields: ['교통', '도시개발'],
      items: [
        '분당선 세교2·3지구 연장 추진',
        '세교1·2지구 광역버스 확충',
        'KTX 오산역 정차 추진',
        '오산형 스마트 교통정보시스템(ITS) 구축',
        '경부고속도로 지하화 연장 추진 (기흥JCT~남사JCT)',
        '경부선 철도 단계별 지하화 추진',
        '오산IC 입체화 추진',
        '오산IC 하이패스 차로 증설',
        '오산휴게소 스마트 하이패스 IC설치',
        '세교1·2지구↔오산역↔오산대역 BRT(간선급행버스) 구축',
        '대중교통 취약지역 DRT(콜버스) 구축',
        '역세권 및 주요상권 보행특화지구 지정',
        '오산시 도로교통 유니버셜 디자인 도입',
        'AI기반 교통 민원상담 콜센터 운영',
        '세교터미널 건립',
      ],
    },
    {
      subtitle: '융복합 자족형 커넥트 시티 오산',
      surveyFields: ['도시개발', '경제'],
      items: [
        '세교3지구 조기 보상 착수',
        '오산 테크노벨리 조성',
        '반도체 연구개발특구 지정 추진',
        '외국인 투자기업 유치',
        '운암뜰 AI시티 조기 완공',
        'MICE산업 육성 기반 조성',
        '오산 랜드마크 조성',
        '내삼미동 도시개발사업 추진',
        '예비군훈련장 부지 주거·환경·첨단산업단지 복합 개발',
      ],
    },
    {
      subtitle: '골목골목 활기가 넘치는 오산',
      surveyFields: ['도시개발', '경제'],
      items: [
        '오산역세권 도시재생혁신지구 지정추진',
        '남촌동 구도심 주거재생혁신지구 지정추진',
        '오색시장 일원 구도심 도심공공주택복합사업 지정추진',
        '(구)계성제지 부지 개발',
        '구도심 소규모주택 정비 관리지역 지정 추진',
        '세교2지구 역세권 주변 주차장 확충',
        '원동사거리, 한전사거리~원동초사거리 지하화 추진',
      ],
    },
    {
      subtitle: '미래지향 경제 신도시 오산',
      surveyFields: ['경제', '복지'],
      items: [
        '오색시장 내 공공형 먹거리 지원센터 설치',
        '소상공인 복합지원센터 구축',
        '소공인 특화지원센터 설치',
        '사회적기업 발굴 및 성장 지원',
        '영세 소상공인 카드 수수료 지원',
        '오산세무서 신설 추진',
        '서랑저수지 주변 규제 완화',
      ],
    },
  ],
  '매력 일꾼': [
    {
      subtitle: '삶의 여유가 넘치는 오산',
      surveyFields: ['문화', '복지', '교육'],
      items: [
        '신장2 문화가족도서관 건립',
        '대원2동 문화도서관 건립',
        '세교2지구 복합문화센터 건립',
        '세교2지구 문화가족 도서관 건립',
        '도심 피크닉 존 조성',
        '시민 힐링공간(방갈로, 텐트촌) 신설',
        '공동주택 야간 경관조명 설치 지속 추진',
      ],
    },
    {
      subtitle: '시간을 걷는 히스토리웨어 오산',
      surveyFields: ['문화', '환경', '경제'],
      items: [
        '물향기수목원(세교2·3지구 방면) 출입구 신설',
        '운암뜰 AI시티 내 청년 문화의 거리 조성',
        '오산 북부권 반려동물 놀이터 조성',
        '스마트 펫-투어 추진',
        '스마트 관광 통합 플랫폼 구축',
        '디지털 역사 문화 아카이브 구축',
        '세교2·3지구 복합쇼핑몰 유치',
      ],
    },
    {
      subtitle: 'K-스포츠케이션 특화도시 오산',
      surveyFields: ['문화', '복지'],
      items: [
        '종합스포츠 타운 조성',
        'e-스포츠 AI트레이닝센터 건립',
        '파크골프장 조성',
        '국제규격 축구 전용구장 조성',
        '생활자원회수센터 상부 공간 체육시설 조성',
      ],
    },
  ],
  '따뜻한 일꾼': [
    {
      subtitle: '미래인재가 쑥쑥 자라는 교육도시 오산',
      surveyFields: ['교육', '복지'],
      ages: ['20대 이하', '30대', '40대', '50대'],
      items: [
        '세교2-1 중학교 설치',
        '청소년 수련원 건립 추진',
        '청소년상담복지센터 이전 및 기능강화',
        '방과후 교육지원센터 설치',
        '세교 AI마이스터고 전환',
        'IN 서울 대학 500 프로젝트',
        '오산·화성교육지원청 분리',
        '키즈 미래테크 놀이터 조성',
        '청소년 문화의 집 조성',
        '중·고등학교 학생 통학버스 전역 확대',
        '유치원 통학버스 추진(조례제정)',
        '입학지원금 중·고등학생 확대',
      ],
    },
    {
      subtitle: '청년의 어깨가 활짝 펴지는 오산',
      surveyFields: ['복지', '경제', '도시개발'],
      ages: ['20대 이하', '30대'],
      items: [
        '청년·신혼부부 주택 2,500호 공급',
        '저소득 청년 운전면허 취득비 지원',
        '입영지원금 지원',
        '이루잡 2호점 구축',
        '청년 면접 지원 확대(합격응원세트)',
        '은둔·고립 청년 지원 확대',
        '청년주택 안심거래 자문단 운영',
      ],
    },
    {
      subtitle: '몸도 마음도 건강한 오산',
      surveyFields: ['복지', '교육', '안전'],
      items: [
        '오산시 공공산후조리원 설립',
        '세교2·3지구 사회복지타운 조성',
        '느린 학습자 맞춤형 교육 프로그램 운영',
        '직장인 중심 평생학습 지원',
        '365일 24시간 어린이집 돌봄 체계 구축',
        '1인가구 커뮤니티센터 운영',
        '위기가구 희망 콜센터 설치',
        '"핸들대신 행복을" 어르신 교통비 지원',
        '세교2·3지구 (대학)종합병원 유치',
        '정신건강복지센터(부설 자살예방 센터) 전용시설 설치',
      ],
    },
    {
      subtitle: '함께해서 행복한 조화로운 도시 오산',
      surveyFields: ['복지', '교육', '교통'],
      items: [
        '민간·가정 어린이집 노후 CCTV 교체',
        '민간·가정 어린이집 조리사 인건비 인상',
        '교통약자 이동지원 차량 확대 운영',
        '장애인 복지회관 건립',
        '장애인 문화 바우처 지원',
        '특이 민원 대응 전문관 도입',
        '다문화·이주민 생활법률지원관 도입',
      ],
    },
  ],
  '믿음직한 일꾼': [
    {
      subtitle: '노년의 행복이 실현되는 오산',
      surveyFields: ['복지', '안전', '교통'],
      ages: ['50대', '60대', '70대 이상'],
      items: [
        '60세 이상 독감 예방 무료 접종',
        'AI 및 IoT 기반 어르신 건강관리 사업 실시',
        '장기요양 재택의료센터 확충',
        '의약품 안전사용 교육 실시',
        '고령운전자 면허 반납비 증액',
      ],
    },
    {
      subtitle: '마음까지 안심되는 안전한 오산',
      surveyFields: ['안전', '교통', '복지'],
      items: [
        '포트홀 AI 자동탐지 시스템 도입',
        '시민 안전보험 보장 범위 확대',
        '하천 범람 및 침수방지 시설 확충',
        '초등학생 휴대용 안심 벨 지급',
        '이동 노동자 무더위 쉼터 운영',
        '안심 셀프케어 사업',
        '내 가게 지키는 안심 경광등 사업',
      ],
    },
    {
      subtitle: '쾌적한 생활환경 도시 오산',
      surveyFields: ['환경', '교통'],
      items: [
        '다회용품 사용 지원',
        '전기자전거 구입 지원 및 인프라 구축',
        '음식물쓰레기 처리기 지원',
        '스마트 제설 관제 시스템 구축',
        '자전거 도로 및 1인용 이동수단(PM) 주행로 정비 및 확대',
      ],
    },
  ],
}

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

/** 분야별 공약 — flatten된 개별 항목 (매칭/검색용) */
export interface FieldPledgeItem {
  title: string
  category: WorkerCategory
  subtitle: string
  surveyFields: SurveyField[]
  /** 비워두면 모든 연령대 해당 */
  ages?: SurveyAge[]
}

export const fieldPledgeItems: FieldPledgeItem[] = (
  Object.entries(fieldPledges) as [WorkerCategory, FieldPledgeGroup[]][]
).flatMap(([category, groups]) =>
  groups.flatMap((g) =>
    g.items.map<FieldPledgeItem>((title) => ({
      title,
      category,
      subtitle: g.subtitle,
      surveyFields: g.surveyFields,
      ages: g.ages,
    })),
  ),
)

/**
 * 사용자의 관심 분야와 한 개 이상 겹치는 항목 반환.
 * 연령대(age)가 주어지면 해당 연령대에 맞는 것만 추가 필터링.
 * (ages가 없는 항목은 모든 연령대에 표시됨)
 */
export function getFieldPledgesBySurveyFields(
  fields: SurveyField[],
  age?: SurveyAge | null,
): FieldPledgeItem[] {
  if (fields.length === 0) return []
  const fieldSet = new Set(fields)
  return fieldPledgeItems.filter((item) => {
    const fieldMatch = item.surveyFields.some((f) => fieldSet.has(f))
    if (!fieldMatch) return false
    if (!age) return true
    if (!item.ages || item.ages.length === 0) return true // universal
    return item.ages.includes(age)
  })
}
