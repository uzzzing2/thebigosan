import Image from 'next/image'
import Link from 'next/link'
import { Carousel, Reveal, SnsIcon } from '@/components/ui'
import { SNS_LINKS } from '@/lib/constants'
import { INSTAGRAM_POSTS, type InstagramPost } from '@/lib/data/instagram'
import { formatVideoDate, formatViews, getLatestVideos, type YoutubeVideo } from '@/lib/youtube'

const VISIBLE_INSTAGRAM = INSTAGRAM_POSTS.slice(0, 8)

function YoutubeCard({ item }: { item: YoutubeVideo }) {
  const views = formatViews(item.views)
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`유튜브: ${item.title}`}
      className="block h-full overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-video bg-cream-100">
        <Image
          src={item.thumbnail}
          alt=""
          fill
          sizes="(min-width: 1024px) 240px, 70vw"
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <p className="truncate-2 text-body font-medium text-gray-900">{item.title}</p>
        <p className="mt-2 text-caption text-gray-500">
          {formatVideoDate(item.published)}
          {views ? ` · 조회 ${views}` : ''}
        </p>
      </div>
    </a>
  )
}

function InstagramCard({ post, index }: { post: InstagramPost; index: number }) {
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`인스타그램 게시물 ${index + 1} 새 창에서 열기`}
      className="group relative block overflow-hidden rounded-2xl shadow-md transition-all duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        aria-hidden="true"
        className="flex aspect-square items-center justify-center bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-10 w-10 opacity-90"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
        </svg>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2.5">
        <p className="text-caption font-medium text-white">최신 #{index + 1}</p>
      </div>
    </a>
  )
}

export async function SnsSection() {
  const videos = await getLatestVideos(10)

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

          {/* Mobile: swipe carousel (1.5 visible) / Desktop: 5-column grid (10 = 2 rows) */}
          <div className="lg:hidden">
            <Carousel
              ariaLabel="유튜브 최신 영상"
              slidesPerView={{ mobile: 1.5, tablet: 2.5 }}
              autoplayMs={0}
              arrows={false}
              loop={false}
              dots={false}
            >
              {videos.map((v) => (
                <YoutubeCard key={v.id} item={v} />
              ))}
            </Carousel>
          </div>
          <ul className="hidden gap-4 lg:grid lg:grid-cols-5">
            {videos.map((v) => (
              <li key={v.id}>
                <YoutubeCard item={v} />
              </li>
            ))}
          </ul>
        </div>

        {/* Instagram — 임시 숨김 (썸네일 API 연결 전까지)
        <div className="mt-16">
          <Reveal>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-heading-3 text-gray-900">인스타그램</h3>
              <Link
                href="https://www.instagram.com/with5340/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-text"
              >
                더보기 →
              </Link>
            </div>
          </Reveal>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {VISIBLE_INSTAGRAM.map((p, i) => (
              <li key={p.id}>
                <InstagramCard post={p} index={i} />
              </li>
            ))}
          </ul>
        </div>
        */}

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
                    <SnsIcon name={sns.name} />
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
