export const greetingParagraphs: string[] = [
  '1993년, 오산에서 새로운 삶을 시작했습니다. 새벽마다 우유를 나르며 하루를 열던 시절, 넉넉하지는 않았지만 포기하지 않았습니다. 골목에서 마주한 이웃의 작은 인사와 따뜻한 손길이 힘든 하루를 다시 일어서게 한 큰 힘이었습니다.',
  '그렇게 땀으로 하루를 채우고, 가정을 이루고, 아이를 키우며 웃고 울었던 33년. 오산은 어느새 제가 살아온 삶이자, 가장 소중한 고향이 되었습니다.',
  // TODO 캠프: 1단계 기획서의 중략된 본문을 이 자리에 채워주세요.
  '받은 사랑은 잊지 않겠습니다. 오산의 더 큰 내일로 반드시 보답하겠습니다.',
]

export interface TimelineItem {
  year: string
  items: string[]
}

/** 약력 — 후보 본인의 경력·학력 (행정대상 등 성과는 achievements로 분리) */
export const timeline: TimelineItem[] = [
  { year: '2026', items: ['제9회 전국동시지방선거 오산시장 후보'] },
  {
    year: '2022',
    items: ['제8회 전국동시지방선거 오산시장 당선', '민선 8기 1,800억 국·도비 확보'],
  },
  {
    year: '현재',
    items: ['오산대학교 명예교수', '한신대 평화교양대학 초빙특강교수'],
  },
  { year: '학력', items: ['연세대학교 행정대학원 졸업 (행정학 석사)'] },
  { year: '1993', items: ['오산 거주 시작 (33년)'] },
]

export interface Achievement {
  year: string
  category: string
  title: string
}

/** 주요 성과 — 외부 평가/수상 */
export const achievements: Achievement[] = [
  {
    year: '2023',
    category: '대한민국 지방자치단체',
    title: '행정대상',
  },
  {
    year: '2023',
    category: '대한민국 자치대상',
    title: '기초단체장부문',
  },
  {
    year: '2024 ~ 2026',
    category: '공약이행평가',
    title: '3년 연속 최우수(SA)',
  },
]

export interface VisionCard {
  icon: string
  title: string
  body: string
}

export const visionCards: VisionCard[] = [
  {
    icon: '🏘️',
    title: '오산을 아는 사람',
    body: '우유대리점부터 시작한 33년, 시민의 삶을 함께 마주했습니다.',
  },
  {
    icon: '🛠️',
    title: '검증된 실력',
    body: '말이 아니라, 결과로 보여준 시장입니다.',
  },
  {
    icon: '⚡',
    title: '강한 추진력',
    body: '시민과 약속한 일, 반드시 지킵니다.',
  },
  {
    icon: '💝',
    title: '시민을 향한 진심',
    body: '시민의 불편부터 먼저 해결하겠습니다.',
  },
  {
    icon: '🌅',
    title: '더 큰 미래를 만드는 사람',
    body: '지금의 변화를 더 큰 오산의 미래로 완성하겠습니다.',
  },
]
