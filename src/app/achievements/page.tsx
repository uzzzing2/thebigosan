import type { Metadata } from 'next'
import { ACHIEVEMENT_HEADLINE_CHIPS } from '@/lib/data/achievements'
import { AchievementGrid } from './AchievementGrid'

export const metadata: Metadata = {
  title: '성과',
  description: '12년의 멈춤, 4년의 성과. 이권재가 시민과 약속한 일을 결과로 보여드립니다.',
}

export default function AchievementsPage() {
  return (
    <>
      <section className="bg-cream-50 py-16 md:py-20 lg:py-24">
        <div className="container-base text-center">
          <h1 className="text-[40px] font-extrabold tracking-[-0.02em] text-gray-900 md:text-display-2">
            12년의 멈춤,
            <br />
            4년의 성과
          </h1>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {ACHIEVEMENT_HEADLINE_CHIPS.map((chip) => (
              <li key={chip.title}>
                <div className="h-full rounded-2xl bg-cream-100 p-6 text-left">
                  <p className="flex items-center gap-2 text-heading-3 text-gray-900">
                    <span aria-hidden="true">{chip.icon}</span>
                    {chip.title}
                  </p>
                  <p className="mt-3 text-body-small text-gray-700">{chip.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20 lg:py-24">
        <div className="container-base">
          <AchievementGrid />
        </div>
      </section>
    </>
  )
}
