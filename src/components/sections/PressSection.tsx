import Link from 'next/link'
import { Reveal, RevealItem, RevealStagger, Tag } from '@/components/ui'

/* Mock — replaced in Step 8 with Firestore `press` */
const MOCK_PRESS = [
  {
    id: 'pr1',
    category: '정책' as const,
    title: '이권재, 세교3지구 재지정 14년 만의 결실 발표',
    date: '2026.05.14',
    mediaCount: 8,
  },
  {
    id: 'pr2',
    category: '정책' as const,
    title: 'GTX-C 오산 연장 노선 확정, 2027년 착공 목표',
    date: '2026.05.10',
    mediaCount: 5,
  },
  {
    id: 'pr3',
    category: '칼럼' as const,
    title: '오산의 미래는 시민의 약속에 있다',
    date: '2026.05.06',
    mediaCount: 3,
  },
  {
    id: 'pr4',
    category: '정책' as const,
    title: '청년·신혼부부 공공주택 2,500호 공급 계획 발표',
    date: '2026.05.02',
    mediaCount: 4,
  },
] as const

export function PressSection() {
  return (
    <section
      aria-labelledby="press-heading"
      className="bg-white py-16 md:py-20 lg:py-24"
    >
      <div className="container-base">
        <Reveal>
          <div className="mb-8 flex items-center justify-between">
            <h2
              id="press-heading"
              className="text-[28px] font-bold tracking-[-0.02em] text-gray-900 md:text-heading-1"
            >
              <span aria-hidden="true" className="mr-2">📰</span>
              보도자료
            </h2>
            <Link href="/press" className="btn-text">
              전체 보기 →
            </Link>
          </div>
        </Reveal>

        <RevealStagger
          as="ul"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {MOCK_PRESS.map((item) => (
            <RevealItem as="li" key={item.id}>
              <Link
                href={`/press/${item.id}`}
                className="block h-full overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-video bg-cream-100" aria-hidden="true" />
                <div className="space-y-3 p-5">
                  <Tag tone={item.category === '정책' ? 'blue' : 'red'}>{item.category}</Tag>
                  <h3 className="truncate-2 text-body-large text-gray-900">{item.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-caption text-gray-500">{item.date}</span>
                    <span className="text-caption font-medium text-red-500">
                      📰 보도 {item.mediaCount}건
                    </span>
                  </div>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  )
}
