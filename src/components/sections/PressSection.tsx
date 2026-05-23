import Link from 'next/link'
import { Reveal } from '@/components/ui'
import { pressItems } from '@/lib/data/press'
import { PressSectionList } from './PressSectionList'

export function PressSection() {
  return (
    <section
      aria-labelledby="press-heading"
      className="bg-white py-16 md:py-20 lg:py-24"
    >
      <div className="container-base">
        <Reveal>
          <div className="mb-8 flex items-center justify-between">
            <h2
              id="press-heading"
              className="text-[28px] font-bold tracking-[-0.02em] text-gray-900 md:text-heading-1"
            >
              <span aria-hidden="true" className="mr-2">📰</span>
              보도자료
            </h2>
            <Link href="/press" className="btn-text">
              전체 보기 →
            </Link>
          </div>
        </Reveal>

        <PressSectionList initialItems={pressItems} />
      </div>
    </section>
  )
}
