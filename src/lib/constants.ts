export const ELECTION_DATE = '2026-06-03'
export const EARLY_VOTE_START = '2026-05-29'
export const EARLY_VOTE_END = '2026-05-30'

export const CANDIDATE = {
  number: 2,
  party: '국민의힘',
  name: '이권재',
  campName: '더큰오산 캠프',
  fullTitle: '국민의힘 오산시장 후보',
} as const

export const SLOGAN = {
  main: '시민과 함께 더 큰 오산으로!',
  tagging: '검증된 성과, 일 잘하는 시장',
} as const

export const NAV_ITEMS = [
  { label: '후보자 소개', href: '/about' },
  { label: '성과', href: '/achievements' },
  { label: '공약', href: '/pledges' },
  { label: '보도자료', href: '/press' },
  { label: '응원한마디', href: '/cheers' },
] as const

export const CONTACT = {
  address: '경기도 오산시 오산천로 278 (오산동 63-10) 3층',
  phone1: '031-377-4798',
  phone2: '031-377-4799',
} as const

export const SNS_LINKS = [
  { name: 'youtube', label: '유튜브', url: 'https://www.youtube.com/@with5340', color: '#FF0000' },
  { name: 'instagram', label: '인스타그램', url: '#', color: '#E4405F' },
  { name: 'facebook', label: '페이스북', url: '#', color: '#1877F2' },
  { name: 'blog', label: '네이버 블로그', url: '#', color: '#03C75A' },
] as const
