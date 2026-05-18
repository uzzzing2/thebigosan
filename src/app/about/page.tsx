import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { CheerWriteTrigger } from '@/components/cheers/CheerWriteTrigger'
import { CANDIDATE, SLOGAN } from '@/lib/constants'
import { greetingParagraphs, timeline, visionCards } from '@/lib/data/about'

export const metadata: Metadata = {
  title: '후보자 소개',
  description: `${CANDIDATE.party} 오산시장 후보 ${CANDIDATE.name}의 33년 오산살이와 약력, 비전을 소개합니다.`,
}

export default function AboutPage() {
  return (
    <>
      {/* Section 1: Hero */}
      <section className="bg-white py-16 md:py-20 lg:py-24">
        <div className="container-base flex flex-col items-center text-center">
          <div className="relative h-32 w-32 overflow-hidden rounded-full bg-cream-100 shadow-md md:h-40 md:w-40">
            <Image
              src="/images/candidate.png"
              alt={`${CANDIDATE.name} 후보 사진`}
              fill
              sizes="160px"
              className="object-cover"
              priority
            />
          </div>
          <p className="mt-6 text-caption font-medium text-red-500">
            기호 {CANDIDATE.number} · {CANDIDATE.party} 오산시장 후보
          </p>
          <h1 className="mt-3 text-[40px] font-extrabold leading-[1.2] tracking-[-0.02em] text-gray-900 md:text-display-1">
            {CANDIDATE.name}
          </h1>
          <p className="mt-5 text-heading-3 text-gray-700">
            오산에서 시작한 삶,
            <br className="md:hidden" />
            <span className="md:ml-1">다시 한 번 더 큰 오산으로</span>
          </p>
        </div>
      </section>

      {/* Section 2: Greeting */}
      <section className="bg-cream-50 py-16 md:py-20 lg:py-24">
        <div className="container-base max-w-[800px]">
          <h2 className="text-[28px] font-bold tracking-[-0.02em] text-gray-900 md:text-heading-1">
            오산에서 시작한 삶,
            <br />
            다시 한 번, 더 큰 오산으로
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

      {/* Section 3: Timeline */}
      <section className="bg-white py-16 md:py-20 lg:py-24">
        <div className="container-base max-w-[800px]">
          <h2 className="text-center text-[28px] font-bold tracking-[-0.02em] text-gray-900 md:text-heading-1">
            걸어온 길
          </h2>
          <ol className="mt-12 space-y-8">
            {timeline.map((row) => (
              <li key={row.year} className="relative grid grid-cols-[88px_1fr] gap-4 md:grid-cols-[120px_1fr] md:gap-8">
                <div className="flex items-start justify-end pr-4">
                  <span className="rounded-md bg-red-50 px-3 py-1 text-caption font-bold text-red-500">
                    {row.year}
                  </span>
                </div>
                <div className="relative border-l-2 border-gray-200 pl-5">
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
            ))}
          </ol>
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
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visionCards.map((card) => (
              <li key={card.title}>
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

      {/* Section 5: Family — placeholder until photo assets arrive */}
      <section className="bg-white py-16 md:py-20 lg:py-24">
        <div className="container-base max-w-[800px] text-center">
          <h2 className="text-[28px] font-bold tracking-[-0.02em] text-gray-900 md:text-heading-1">
            함께 걸어온 가족
          </h2>
          <p className="mt-4 text-body-large text-gray-700">
            33년의 시간 동안 곁을 지켜준 가족, 오산이라는 고향과 함께 걸어왔습니다.
          </p>
          {/* TODO 캠프: 가족 사진 1~3장 자료 전달 시 이 자리에 채워주세요. */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                aria-hidden="true"
                className="aspect-[4/5] rounded-2xl bg-cream-100"
              />
            ))}
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
