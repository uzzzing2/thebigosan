import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보처리방침',
}

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: '1. 수집하는 개인정보 항목',
    body: [
      '본 사이트는 응원한마디 게시·신고 처리·운영 목적을 위해 다음 항목을 수집합니다.',
      '· 응원 작성 시: 닉네임, 응원 본문, 접속 IP의 해시값',
      '· 신고 시: 신고 사유, 접속 IP의 해시값',
    ],
  },
  {
    heading: '2. 개인정보의 수집 및 이용 목적',
    body: [
      '· 응원 게시 서비스 제공 및 운영',
      '· 부정 이용·중복 작성 방지',
      '· 신고 사항 검토 및 조치',
    ],
  },
  {
    heading: '3. 개인정보의 보유 및 이용 기간',
    body: [
      '응원 본문은 캠프 종료 후 1년간 보관 후 파기합니다. 신고 기록은 처리 완료 후 6개월간 보관합니다.',
    ],
  },
  {
    heading: '4. 개인정보의 제3자 제공',
    body: [
      '본 사이트는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만 법령에 근거하거나 수사기관의 요청이 있을 경우에 한해 제공합니다.',
    ],
  },
  {
    heading: '5. 정보주체의 권리·의무 및 행사 방법',
    body: [
      '이용자는 언제든지 본인의 개인정보 열람·정정·삭제를 요구할 수 있으며, 운영 사무국으로 연락 시 지체 없이 조치합니다.',
    ],
  },
  {
    heading: '6. 운영 사무국 연락처',
    body: [
      '경기도 오산시 오산천로 278(오산동 63-10) 3층',
      '전화: 031-377-4798 · 031-377-4799',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <section className="bg-white py-16 md:py-20 lg:py-24">
      <div className="container-base max-w-[800px]">
        <h1 className="text-[32px] font-extrabold tracking-[-0.02em] text-gray-900 md:text-display-2">
          개인정보처리방침
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
