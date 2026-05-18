import Link from 'next/link'
import { Carousel, Reveal, Tag } from '@/components/ui'
import { achievements } from '@/lib/data/achievements'
import { corePledges } from '@/lib/data/pledges'

const HIGHLIGHT_COUNT = 7

const featuredAchievements = achievements.slice(0, HIGHLIGHT_COUNT)
const featuredPledges = corePledges.slice(0, HIGHLIGHT_COUNT)

function PreviewCard({
  badge,
  badgeTone,
  numbering,
  title,
  desc,
}: {
  badge: string
  badgeTone: 'red' | 'blue'
  numbering: string
  title: string
  desc?: string
}) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-2xl bg-white p-6 shadow-md">
      <div className="flex items-center justify-between">
        <Tag tone={badgeTone}>{badge}</Tag>
        <span className="text-caption font-medium text-gray-500">No. {numbering}</span>
      </div>
      {/* TODO: replace with actual highlight image when assets arrive */}
      <div className="aspect-[4/3] rounded-lg bg-cream-100" aria-hidden="true" />
      <div>
        <h3 className="text-heading-3 text-gray-900">{title}</h3>
        {desc && <p className="mt-2 text-body-small text-gray-700">{desc}</p>}
      </div>
    </article>
  )
}

export function HighlightsSection() {
  return (
    <section
      aria-labelledby="highlights-heading"
      className="bg-cream-50 py-16 md:py-20 lg:py-24"
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

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-8">
          <Reveal delay={0.05}>
            <div className="rounded-3xl bg-white/60 p-6 md:p-8">
              <div className="mb-6 flex items-center gap-2 text-gray-900">
                <span aria-hidden="true" className="text-xl">🏆</span>
                <h3 className="text-heading-3">성과</h3>
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
                  />
                ))}
              </Carousel>
              <div className="mt-6 flex justify-end">
                <Link href="/achievements" className="btn-text">
                  성과 전체 보기 →
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="rounded-3xl bg-white/60 p-6 md:p-8">
              <div className="mb-6 flex items-center gap-2 text-gray-900">
                <span aria-hidden="true" className="text-xl">🏗️</span>
                <h3 className="text-heading-3">공약</h3>
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
              <div className="mt-6 flex justify-end">
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
