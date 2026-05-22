import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { CheerWriteTrigger } from '@/components/cheers/CheerWriteTrigger'
import { Carousel } from '@/components/ui'
import { CANDIDATE, SLOGAN } from '@/lib/constants'
import { achievements, greetingParagraphs, timeline, visionCards } from '@/lib/data/about'

const OSAN_PHOTOS = [
  '/images/young/DSC_5480.JPG',
  '/images/young/DSC_5481.JPG',
  '/images/young/DSC_5482.JPG',
  '/images/young/DSC_5483.JPG',
  '/images/young/DSC_5485.JPG',
  '/images/young/DSC_5491.JPG',
  '/images/young/DSC_5494.JPG',
  '/images/young/DSC_5498.JPG',
  '/images/young/DSC_5499.JPG',
]

export const metadata: Metadata = {
  title: '후보자 소개',
  description: `${CANDIDATE.party} 오산시장 후보 ${CANDIDATE.name}의 33년 오산살이와 약력, 비전을 소개합니다.`,
}

export default function AboutPage() {
  return (
    <>
      {/* Section 1: Hero — full-bleed photo with right-aligned branding overlay on all sizes */}
      <section
        aria-labelledby="about-hero-heading"
        className="relative isolate overflow-hidden bg-white min-h-[68vh] md:min-h-[calc(100vh-72px)]"
      >
        <h1 id="about-hero-heading" className="sr-only">
          {`${CANDIDATE.party} 기호 ${CANDIDATE.number}번 ${CANDIDATE.name} 오산시장 후보 — ${SLOGAN.tagging}`}
        </h1>

        {/* Background photo */}
        <Image
          src="/images/intro.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[30%_center]"
        />

        {/* Branding overlay
            Mobile: raurel at top, slogan + logo attached directly below — all right-aligned.
            Desktop: same three items right-aligned, vertically centered. */}
        <div className="relative z-10 container-base flex min-h-[68vh] md:min-h-[calc(100vh-72px)] flex-col items-end justify-start gap-3 py-8 lg:justify-center lg:gap-8 lg:py-0">
          <Image
            src="/images/raurel.png"
            alt="3년 연속 공약이행평가 최우수, 1800억 국·도비 확보, 세교3지구 재지정"
            width={1200}
            height={260}
            priority
            className="h-auto w-full max-w-[360px] sm:max-w-[480px] lg:max-w-[540px]"
          />
          <Image
            src="/images/thebigosanslogan.png"
            alt={SLOGAN.tagging}
            width={880}
            height={400}
            priority
            className="h-auto w-[60%] max-w-[270px] sm:max-w-[390px] lg:w-full lg:max-w-[520px]"
          />
          <Image
            src="/images/logo-simple.png"
            alt={`${CANDIDATE.name} ${CANDIDATE.campName}`}
            width={520}
            height={245}
            className="h-auto w-[60%] max-w-[270px] sm:max-w-[390px] lg:w-full lg:max-w-[400px]"
          />
        </div>
      </section>

      {/* Section 2: Greeting */}
      <section className="relative overflow-hidden bg-cream-50 py-16 md:py-20 lg:py-24">
        {/* Decorative background: past Osan photo, right-anchored, faded */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-4/5 opacity-25 lg:w-1/2 [mask-image:linear-gradient(to_left,black_0%,transparent_85%)]"
        >
          <Image
            src="/images/young/past.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 600px, 80vw"
            className="object-cover"
          />
        </div>

        <div className="container-base relative max-w-[800px]">
          <h2 className="text-[28px] font-bold tracking-[-0.02em] text-gray-900 md:text-heading-1">
            오산에서 시작한 삶,
            <br />
            <span className="text-red-500">다시 한 번, 더 큰 오산</span>으로
            <br />
            보답하겠습니다
          </h2>
          <div className="mt-10 space-y-6 text-body-large leading-[1.8] text-gray-700">
            {greetingParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <p className="mt-10 text-right text-body-large font-medium text-gray-900">
            — {CANDIDATE.name} 드림
          </p>
        </div>
      </section>

      {/* Section 3: Timeline + Achievements */}
      <section className="bg-white py-16 md:py-20 lg:py-24">
        <div className="container-base">
          <h2 className="text-center text-[28px] font-bold tracking-[-0.02em] text-gray-900 md:text-heading-1">
            걸어온 길
          </h2>
          <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            {/* Left: 약력 */}
            <div>
              <h3 className="text-heading-3 text-gray-900">약력</h3>
              <ol className="mt-6">
                {timeline.map((row, idx) => {
                  const isLast = idx === timeline.length - 1
                  return (
                    <li
                      key={row.year}
                      className="relative grid grid-cols-[88px_1fr] gap-4 md:grid-cols-[120px_1fr] md:gap-8"
                    >
                      <div className="flex items-start justify-end pr-4">
                        <span className="rounded-md bg-red-50 px-3 py-1 text-caption font-bold text-red-500">
                          {row.year}
                        </span>
                      </div>
                      <div
                        className={`relative border-l-2 border-gray-200 pl-5${isLast ? '' : ' pb-8'}`}
                      >
                        <span
                          aria-hidden="true"
                          className="absolute -left-[7px] top-1 inline-block h-3 w-3 rounded-full bg-red-500"
                        />
                        <ul className="space-y-2">
                          {row.items.map((item, i) => (
                            <li key={i} className="text-body text-gray-900 md:text-body-large">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>

            {/* Right: 주요 성과 */}
            <div>
              <h3 className="text-heading-3 text-gray-900">주요 성과</h3>
              <ul className="mt-6 space-y-4">
                {achievements.map((a) => (
                  <li key={`${a.year}-${a.title}`}>
                    <article className="flex items-start gap-4 rounded-2xl bg-cream-50 p-5 shadow-sm">
                      <span
                        aria-hidden="true"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500 text-lg"
                      >
                        🏆
                      </span>
                      <div className="min-w-0">
                        <p className="text-caption font-bold text-red-500">{a.year}</p>
                        <p className="mt-1 text-body-small text-gray-700">{a.category}</p>
                        <p className="mt-0.5 text-body font-bold text-gray-900 md:text-body-large">
                          {a.title}
                        </p>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Vision */}
      <section className="bg-cream-50 py-16 md:py-20 lg:py-24">
        <div className="container-base">
          <div className="text-center">
            <h2 className="text-[28px] font-bold tracking-[-0.02em] text-gray-900 md:text-heading-1">
              {CANDIDATE.name}의 약속
            </h2>
            <p className="mt-3 text-body-large text-gray-700">
              다섯 가지 마음으로 오산을 바라봅니다
            </p>
          </div>
          <ul className="mt-12 flex flex-wrap justify-center gap-6">
            {visionCards.map((card) => (
              <li
                key={card.title}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <article className="h-full rounded-2xl bg-white p-8 shadow-md">
                  <span aria-hidden="true" className="text-4xl">
                    {card.icon}
                  </span>
                  <h3 className="mt-4 text-heading-3 text-gray-900">{card.title}</h3>
                  <p className="mt-3 text-body text-gray-700">{card.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Section 5: Osan photos carousel */}
      <section className="bg-white py-16 md:py-20 lg:py-24">
        <div className="container-base">
          <div className="mx-auto max-w-[800px] text-center">
            <h2 className="text-[28px] font-bold tracking-[-0.02em] text-gray-900 md:text-heading-1">
              함께 걸어온 오산
            </h2>
            <p className="mt-4 text-body-large text-gray-700">
              33년의 시간 동안 곁을 지켜준 마음, 오산의 길에서 함께 걸어왔습니다.
            </p>
          </div>

          <div className="mt-10">
            <Carousel
              ariaLabel="함께 걸어온 오산 사진"
              slidesPerView={{ mobile: 1.5, tablet: 2, desktop: 3 }}
              autoplayMs={5000}
            >
              {OSAN_PHOTOS.map((src) => (
                <div
                  key={src}
                  className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream-100"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 70vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* Section 6: CTA */}
      <section className="bg-cream-50 py-16 md:py-20 lg:py-24">
        <div className="container-base text-center">
          <h2 className="text-[28px] font-bold tracking-[-0.02em] text-gray-900 md:text-heading-1">
            {CANDIDATE.name}의 약속이<br />궁금하신가요?
          </h2>
          <p className="mt-4 text-body-large text-gray-700">{SLOGAN.tagging}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/pledges" className="btn-primary">
              공약 보러가기 →
            </Link>
            <CheerWriteTrigger variant="secondary">응원 한마디 남기기</CheerWriteTrigger>
          </div>
        </div>
      </section>
    </>
  )
}
