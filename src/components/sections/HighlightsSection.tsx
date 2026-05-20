import Image from 'next/image'
import Link from 'next/link'
import { Carousel, Reveal, Tag } from '@/components/ui'
import { achievements } from '@/lib/data/achievements'
import { corePledges } from '@/lib/data/pledges'

const HIGHLIGHT_COUNT = 7

const featuredAchievements = achievements.slice(0, HIGHLIGHT_COUNT)
const featuredPledges = corePledges.slice(0, HIGHLIGHT_COUNT)

function outcomeImagePath(id: string): string {
  return `/images/outcome/성과 ${Number(id)}.png`
}

function PreviewCard({
  badge,
  badgeTone,
  numbering,
  title,
  desc,
  imageUrl,
}: {
  badge: string
  badgeTone: 'red' | 'blue'
  numbering: string
  title: string
  desc?: string
  imageUrl?: string
}) {
  return (
    <article className="flex h-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-md md:gap-4 md:p-6">
      <div className="flex items-center justify-between gap-2">
        <Tag tone={badgeTone}>{badge}</Tag>
        <span className="text-caption font-medium text-gray-500">No. {numbering}</span>
      </div>
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-cream-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 480px, 85vw"
            className="object-cover"
          />
        ) : (
          <span className="text-body-small text-gray-500">이미지 준비중</span>
        )}
      </div>
      <div className="min-w-0">
        <h3 className="truncate-2 text-body-large font-bold text-gray-900 md:text-heading-3">
          {title}
        </h3>
        {desc && (
          <p className="truncate-2 mt-1.5 text-body-small text-gray-700 md:mt-2">{desc}</p>
        )}
      </div>
    </article>
  )
}

export function HighlightsSection() {
  return (
    <section
      aria-labelledby="highlights-heading"
      className="bg-cream-50 py-10 md:py-20 lg:py-24"
    >
      <div className="container-base">
        <Reveal>
          <h2
            id="highlights-heading"
            className="text-center text-[28px] font-bold tracking-[-0.02em] text-gray-900 md:text-heading-1"
          >
            성과로 증명한 신뢰,
            <br />
            공약으로 약속하는 미래
          </h2>
        </Reveal>

        <div className="mt-10 grid min-w-0 max-w-full grid-cols-1 gap-6 md:mt-12 md:gap-10 lg:grid-cols-2 lg:gap-8">
          <Reveal delay={0.05}>
            <div className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl bg-white/60 p-3 md:rounded-3xl md:p-6 lg:p-8">
              <div className="mb-2 flex items-center gap-2 text-gray-900 md:mb-6">
                <span aria-hidden="true" className="text-base md:text-xl">🏆</span>
                <h3 className="text-body-large font-bold md:text-heading-3">성과</h3>
              </div>
              <Carousel
                ariaLabel="이권재 시장의 주요 성과"
                slidesPerView={{ mobile: 1 }}
                autoplayMs={6000}
              >
                {featuredAchievements.map((a) => (
                  <PreviewCard
                    key={a.id}
                    badge={a.category}
                    badgeTone="red"
                    numbering={a.id}
                    title={a.title}
                    desc={a.desc}
                    imageUrl={outcomeImagePath(a.id)}
                  />
                ))}
              </Carousel>
              <div className="mt-3 flex justify-end md:mt-6">
                <Link href="/achievements" className="btn-text">
                  성과 전체 보기 →
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl bg-white/60 p-3 md:rounded-3xl md:p-6 lg:p-8">
              <div className="mb-2 flex items-center gap-2 text-gray-900 md:mb-6">
                <span aria-hidden="true" className="text-base md:text-xl">🏗️</span>
                <h3 className="text-body-large font-bold md:text-heading-3">공약</h3>
              </div>
              <Carousel
                ariaLabel="이권재 후보의 주요 공약"
                slidesPerView={{ mobile: 1 }}
                autoplayMs={6000}
              >
                {featuredPledges.map((p) => (
                  <PreviewCard
                    key={p.id}
                    badge={p.category}
                    badgeTone="blue"
                    numbering={p.id}
                    title={p.title}
                  />
                ))}
              </Carousel>
              <div className="mt-3 flex justify-end md:mt-6">
                <Link href="/pledges" className="btn-text">
                  공약 전체 보기 →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
