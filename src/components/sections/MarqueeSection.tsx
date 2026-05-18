import { CountUp, Reveal } from '@/components/ui'
import { CheerWriteTrigger } from '@/components/cheers/CheerWriteTrigger'

/* Mock data — replaced in Step 8 with Firestore `cheers` collection */
const MOCK_CHEERS = [
  { id: 'm1', nickname: 'osan_2026', content: '더 큰 오산을 위해 함께하겠습니다!' },
  { id: 'm2', nickname: 'sema_dad', content: '세교 3지구 다시 움직여서 너무 감사합니다.' },
  { id: 'm3', nickname: 'mom_yj', content: '아이 키우기 좋은 도시로 만들어주세요.' },
  { id: 'm4', nickname: 'jung_ang', content: '오색시장 살아나는 거 보고 응원하게 됐어요.' },
  { id: 'm5', nickname: 'young_osan', content: '청년 주택 공약 꼭 지켜주세요!' },
  { id: 'm6', nickname: 'commuter_88', content: 'GTX-C 연장, 진심 부탁드립니다.' },
  { id: 'm7', nickname: 'teacher_kim', content: '학교 시설 개선 정말 체감되고 있어요.' },
  { id: 'm8', nickname: 'sinjang_2', content: '세교 2지구 학생인데 도서관 기대돼요.' },
  { id: 'm9', nickname: 'silver_lee', content: '경로당 새로 지어주셔서 감사합니다.' },
  { id: 'm10', nickname: 'daewon_1', content: '동부대로 지하화 1단계 정말 시원해요.' },
] as const

const MOCK_COUNT = 1234

function CheerCard({ nickname, content }: { nickname: string; content: string }) {
  return (
    <article className="mr-4 inline-flex w-[280px] shrink-0 flex-col gap-2 rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-body-small font-medium text-gray-900">
        <span aria-hidden="true" className="mr-1">💬</span>
        {nickname}
      </p>
      <p className="truncate-1 text-body text-gray-700">“{content}”</p>
    </article>
  )
}

export function MarqueeSection() {
  const top = [...MOCK_CHEERS, ...MOCK_CHEERS]
  const bottom = [...MOCK_CHEERS].reverse()
  const bottomLoop = [...bottom, ...bottom]

  return (
    <section
      aria-labelledby="cheers-heading"
      className="bg-cream-50 py-16 md:py-20 lg:py-24"
    >
      <Reveal className="container-base text-center">
        <h2
          id="cheers-heading"
          className="text-[28px] font-bold tracking-[-0.02em] text-gray-900 md:text-heading-1"
        >
          함께하는 시민들의 한마디
        </h2>
        <p className="mt-3 text-body md:text-body-large text-gray-700">
          <CountUp to={MOCK_COUNT} className="font-bold text-red-500" />
          명의 시민이 응원을 보냈어요
        </p>
      </Reveal>

      <div className="group mt-10 space-y-4 overflow-hidden">
        <div className="flex w-max animate-marqueeLeft group-hover:[animation-play-state:paused]">
          {top.map((cheer, i) => (
            <CheerCard key={`top-${cheer.id}-${i}`} nickname={cheer.nickname} content={cheer.content} />
          ))}
        </div>
        <div className="flex w-max animate-marqueeRight group-hover:[animation-play-state:paused]">
          {bottomLoop.map((cheer, i) => (
            <CheerCard key={`bot-${cheer.id}-${i}`} nickname={cheer.nickname} content={cheer.content} />
          ))}
        </div>
      </div>

      <div className="container-base mt-10 flex justify-center">
        <CheerWriteTrigger>응원 한마디 남기기 →</CheerWriteTrigger>
      </div>
    </section>
  )
}
