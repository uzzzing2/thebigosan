import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/ui'
import { SLOGAN } from '@/lib/constants'
import { DiceGame } from './DiceGame'

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="bg-white min-h-[calc(100vh-60px)] md:min-h-[calc(100vh-72px)] flex items-center"
    >
      <div className="mx-auto grid w-full max-w-container items-center gap-6 px-4 py-8 md:gap-8 md:px-8 md:py-10 lg:grid-cols-[470px_minmax(0,1fr)] lg:gap-4 lg:py-10 xl:max-w-[1320px] 2xl:max-w-[1380px]">
        <Reveal className="order-2 lg:order-1" duration={0.6}>
          <p className="text-base font-medium text-red-500 md:text-body-large">
            {SLOGAN.tagging}
          </p>
          <h1 id="hero-heading" className="sr-only">
            {SLOGAN.main}
          </h1>
          <Image
            src="/images/slogan.png"
            alt={SLOGAN.main}
            width={620}
            height={260}
            priority
            className="mt-4 h-auto w-full max-w-[320px] md:max-w-[400px] lg:max-w-[450px]"
          />

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/about" className="btn-primary">
              후보자 소개
            </Link>
            <Link href="/pledges" className="btn-secondary">
              공약 보기
            </Link>
          </div>
        </Reveal>

        <Reveal className="order-1 lg:order-2" delay={0.1} duration={0.6}>
          {/* DiceGame: Phase 1 static map, Phase 2 28-tile board game */}
          <DiceGame />
        </Reveal>
      </div>
    </section>
  )
}
