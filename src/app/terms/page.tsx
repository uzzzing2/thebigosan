import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이용약관',
}

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: '제1조 (목적)',
    body: [
      '본 약관은 이권재 더큰오산 캠프(이하 "캠프")가 운영하는 본 사이트의 이용에 관한 조건과 절차를 규정함을 목적으로 합니다.',
    ],
  },
  {
    heading: '제2조 (이용자의 의무)',
    body: [
      '이용자는 다음 행위를 하여서는 안 됩니다.',
      '· 타인에 대한 명예 훼손, 욕설, 비방, 차별적 표현',
      '· 허위 사실의 유포 또는 공직선거법 위반 행위',
      '· 광고·스팸·도배성 게시 및 자동화 도구를 이용한 작성',
      '· 본 사이트의 정상적 운영을 방해하는 일체의 행위',
    ],
  },
  {
    heading: '제3조 (게시물의 관리)',
    body: [
      '운영자는 다음에 해당하는 게시물을 사전 통지 없이 비공개 처리 또는 삭제할 수 있습니다.',
      '· 본 약관 또는 관련 법령에 위반되는 게시물',
      '· 신고가 접수되어 검토 결과 부적절하다고 판단된 게시물',
    ],
  },
  {
    heading: '제4조 (책임의 한계)',
    body: [
      '본 사이트는 이용자가 게시한 콘텐츠의 신뢰도, 정확성에 대해 보증하지 않으며, 그로 인한 손해에 대해 책임을 지지 않습니다.',
    ],
  },
  {
    heading: '제5조 (약관의 변경)',
    body: [
      '캠프는 필요한 경우 본 약관을 변경할 수 있으며, 변경된 약관은 본 사이트 내 공지로 효력을 갖습니다.',
    ],
  },
]

export default function TermsPage() {
  return (
    <section className="bg-white py-16 md:py-20 lg:py-24">
      <div className="container-base max-w-[800px]">
        <h1 className="text-[32px] font-extrabold tracking-[-0.02em] text-gray-900 md:text-display-2">
          이용약관
        </h1>
        <p className="mt-4 text-body-small text-gray-500">시행일: 2026-04-01</p>

        <div className="mt-12 space-y-10">
          {SECTIONS.map((s) => (
            <section key={s.heading}>
              <h2 className="text-heading-3 text-gray-900">{s.heading}</h2>
              <div className="mt-3 space-y-2 text-body leading-[1.8] text-gray-700">
                {s.body.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}
