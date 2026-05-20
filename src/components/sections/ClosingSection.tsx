import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/ui'
import { CheerWriteTrigger } from '@/components/cheers/CheerWriteTrigger'
import { CANDIDATE, SLOGAN } from '@/lib/constants'

export function ClosingSection() {
  return (
    <section
      aria-labelledby="closing-heading"
      className="bg-cream-50 py-20 md:py-24 lg:py-32"
    >
      <div className="container-base">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-md">
              <Image
                src="/images/candidate.png"
                alt={`기호 2번 ${CANDIDATE.name} 후보 사진`}
                fill
                sizes="(min-width: 1024px) 420px, 80vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal className="order-1 lg:order-2" delay={0.1}>
            <p className="text-base font-medium text-gray-700 md:text-body-large">
              국민의힘 오산시장 후보
            </p>
            <Image
              src="/images/logo-simple.png"
              alt={`${CANDIDATE.name} ${CANDIDATE.campName}`}
              width={520}
              height={245}
              className="mt-4 h-auto w-full max-w-[280px] md:max-w-[320px]"
            />
            <h2 id="closing-heading" className="sr-only">
              {SLOGAN.main}
            </h2>
            <Image
              src="/images/slogan.png"
              alt={SLOGAN.main}
              width={620}
              height={260}
              className="mt-6 h-auto w-full max-w-[340px] md:max-w-[420px] lg:max-w-[480px]"
            />
            <p className="mt-4 text-body-large text-gray-700">{SLOGAN.tagging}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <CheerWriteTrigger>응원 한마디 남기기</CheerWriteTrigger>
              <Link href="/pledges" className="btn-secondary">
                공약 보기
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
