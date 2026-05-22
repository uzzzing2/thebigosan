import type { Metadata } from 'next'
import { pressItems as staticPress } from '@/lib/data/press'
import { PressFilter } from './PressFilter'

export const metadata: Metadata = {
  title: '보도자료',
  description: '이권재 더큰오산 캠프의 정책 발표와 칼럼, 언론 보도를 모아 보세요.',
}

/** Re-render at most once every 60s. */
export const revalidate = 60

export default function PressPage() {
  return (
    <>
      <section className="bg-cream-50 py-16 md:py-20 lg:py-24">
        <div className="container-base text-center">
          <h1 className="text-[40px] font-extrabold tracking-[-0.02em] text-gray-900 md:text-display-2">
            <span aria-hidden="true" className="mr-2">📰</span>
            보도자료
          </h1>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16 lg:py-20">
        <div className="container-base">
          <PressFilter initialItems={staticPress} />
        </div>
      </section>
    </>
  )
}
