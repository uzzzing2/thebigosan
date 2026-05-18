import type { Metadata } from 'next'
import { PledgesTabs } from './PledgesTabs'

export const metadata: Metadata = {
  title: '공약',
  description:
    '시민과 함께, 더 큰 오산으로. 핵심공약 10가지·분야별 공약·동별 공약·내게 맞는 공약을 확인하세요.',
}

export default function PledgesPage() {
  return (
    <>
      <section className="bg-cream-50 py-16 md:py-20 lg:py-24">
        <div className="container-base text-center">
          <h1 className="text-[40px] font-extrabold tracking-[-0.02em] text-gray-900 md:text-display-2">
            시민과 함께,
            <br />
            더 큰 오산으로
          </h1>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16 lg:py-20">
        <div className="container-base">
          <PledgesTabs />
        </div>
      </section>
    </>
  )
}
