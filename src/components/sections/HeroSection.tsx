import Link from 'next/link'
import { Reveal } from '@/components/ui'
import { SLOGAN } from '@/lib/constants'
import { DiceGame } from './DiceGame'

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="bg-white"
    >
      <div className="container-base grid items-center gap-10 py-16 md:py-20 lg:grid-cols-[minmax(0,30%)_minmax(0,70%)] lg:gap-12 lg:py-24">
        <Reveal className="order-2 lg:order-1" duration={0.6}>
          <p className="text-base font-medium text-red-500 md:text-body-large">
            {SLOGAN.tagging}
          </p>
          <h1
            id="hero-heading"
            className="mt-4 text-[40px] font-extrabold leading-[1.2] tracking-[-0.02em] text-gray-900 md:text-display-2 lg:text-display-1"
          >
            시민과 함께
            <br />
            <span className="text-red-500">더 큰</span> 오산으로!
          </h1>

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
