import Link from 'next/link'
import { Carousel, Reveal } from '@/components/ui'
import { SNS_LINKS } from '@/lib/constants'

/* Mock data — replaced in Step 8 with YouTube Data API + Firestore snsCuration */
const MOCK_YOUTUBE = [
  { id: 'y1', title: '세교3지구 재지정, 14년 3개월의 약속을 지키다', date: '2026.05.12', views: '12,431' },
  { id: 'y2', title: 'GTX-C 오산 연장, 시민의 발이 되겠습니다', date: '2026.05.08', views: '8,902' },
  { id: 'y3', title: '운암뜰 AI시티, 오산의 미래입니다', date: '2026.05.03', views: '6,521' },
  { id: 'y4', title: '청년·신혼부부 공공주택 2,500호 공급 계획', date: '2026.04.28', views: '5,308' },
] as const

const MOCK_INSTAGRAM = [
  { id: 'i1', caption: '오색시장 현장에서', date: '2026.05.14' },
  { id: 'i2', caption: '세교2지구 주민과의 만남', date: '2026.05.11' },
  { id: 'i3', caption: '청년정책 간담회', date: '2026.05.07' },
  { id: 'i4', caption: '아이드림센터 방문', date: '2026.05.02' },
] as const

function YoutubeCard({ item }: { item: (typeof MOCK_YOUTUBE)[number] }) {
  return (
    <a
      href="#"
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full rounded-2xl bg-white shadow-md transition-all duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="aspect-video rounded-t-2xl bg-cream-100" aria-hidden="true" />
      <div className="p-4">
        <p className="truncate-2 text-body font-medium text-gray-900">{item.title}</p>
        <p className="mt-2 text-caption text-gray-500">
          {item.date} · 조회 {item.views}
        </p>
      </div>
    </a>
  )
}

function InstagramCard({ item }: { item: (typeof MOCK_INSTAGRAM)[number] }) {
  return (
    <a
      href="#"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`인스타그램 - ${item.caption}`}
      className="block h-full overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="aspect-square bg-cream-100" aria-hidden="true" />
      <div className="p-3">
        <p className="truncate-1 text-caption text-gray-500">{item.date}</p>
      </div>
    </a>
  )
}

export function SnsSection() {
  return (
    <section
      aria-labelledby="sns-heading"
      className="bg-white py-16 md:py-20 lg:py-24"
    >
      <div className="container-base">
        <Reveal>
          <h2
            id="sns-heading"
            className="text-center text-[28px] font-bold tracking-[-0.02em] text-gray-900 md:text-heading-1"
          >
            이권재의 최신 소식
          </h2>
        </Reveal>

        {/* YouTube */}
        <div className="mt-12">
          <Reveal>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-heading-3 text-gray-900">유튜브</h3>
              <Link
                href="https://www.youtube.com/@with5340"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-text"
              >
                더보기 →
              </Link>
            </div>
          </Reveal>

          {/* Mobile: swipe carousel (1.5 visible) / Desktop: 4-column grid */}
          <div className="lg:hidden">
            <Carousel
              ariaLabel="유튜브 최신 영상"
              slidesPerView={{ mobile: 1.5, tablet: 2 }}
              autoplayMs={0}
              arrows={false}
              loop={false}
              dots={false}
            >
              {MOCK_YOUTUBE.map((v) => (
                <YoutubeCard key={v.id} item={v} />
              ))}
            </Carousel>
          </div>
          <ul className="hidden gap-4 lg:grid lg:grid-cols-4">
            {MOCK_YOUTUBE.map((v) => (
              <li key={v.id}>
                <YoutubeCard item={v} />
              </li>
            ))}
          </ul>
        </div>

        {/* Instagram */}
        <div className="mt-16">
          <Reveal>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-heading-3 text-gray-900">인스타그램</h3>
              <Link href="#" target="_blank" rel="noopener noreferrer" className="btn-text">
                더보기 →
              </Link>
            </div>
          </Reveal>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {MOCK_INSTAGRAM.map((p) => (
              <li key={p.id}>
                <InstagramCard item={p} />
              </li>
            ))}
          </ul>
        </div>

        {/* All SNS channels */}
        <Reveal>
          <div className="mt-14 flex flex-col items-center gap-4">
            <p className="text-body text-gray-700">전체 SNS 채널 바로가기</p>
            <ul className="flex gap-3">
              {SNS_LINKS.map((sns) => (
                <li key={sns.name}>
                  <a
                    href={sns.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${sns.label} 새 창에서 열기`}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full text-white transition-transform hover:-translate-y-0.5"
                    style={{ backgroundColor: sns.color }}
                  >
                    <span aria-hidden="true" className="text-sm font-bold">
                      {sns.label[0]}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
