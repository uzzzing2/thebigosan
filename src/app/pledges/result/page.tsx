import type { Metadata } from 'next'
import Link from 'next/link'
import { Tag } from '@/components/ui'
import { corePledges, districtPledges, type DistrictName } from '@/lib/data/pledges'
import { ResultActions } from './ResultActions'

export const metadata: Metadata = {
  title: '내게 맞는 공약',
  description: '거주 동·관심 분야·연령대를 고려한 맞춤 공약 결과입니다.',
}

const VALID_DISTRICTS = Object.keys(districtPledges) as DistrictName[]

function isDistrict(s: string | undefined): s is DistrictName {
  return !!s && (VALID_DISTRICTS as string[]).includes(s)
}

export default function ResultPage({
  searchParams,
}: {
  searchParams: { district?: string; fields?: string; age?: string }
}) {
  const districtParam = searchParams.district
  const fields = searchParams.fields?.split(',').filter(Boolean) ?? []
  const age = searchParams.age

  const district = isDistrict(districtParam) ? districtParam : null
  const districtData = district ? districtPledges[district] : null

  // 단순한 매칭 로직 — Step 7에서 분야 태그와 매핑 규칙 세부 조정 예정
  const matchedCore = corePledges

  return (
    <div id="result-capture">
      <section className="bg-cream-50 py-16 md:py-20 lg:py-24">
        <div className="container-base text-center">
          <p className="text-base font-medium text-red-500">
            🎯 맞춤 공약 결과
          </p>
          <h1 className="mt-3 text-[32px] font-extrabold tracking-[-0.02em] text-gray-900 md:text-display-2">
            {district ?? '시민'}님께 추천드리는
            <br />
            공약입니다
          </h1>
          <p className="mt-4 text-body-large text-gray-700">
            거주 동{fields.length > 0 ? '·관심 분야' : ''}
            {age ? '·연령대' : ''}를 고려했어요
            {fields.length > 0 && (
              <>
                <br />
                <span className="mt-2 inline-flex flex-wrap justify-center gap-1.5">
                  {fields.map((f) => (
                    <Tag key={f} tone="blue">
                      {f}
                    </Tag>
                  ))}
                  {age && <Tag tone="gray">{age}</Tag>}
                </span>
              </>
            )}
          </p>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20 lg:py-24">
        <div className="container-base space-y-16">
          {districtData && (
            <section aria-labelledby="result-district">
              <h2 id="result-district" className="text-heading-2 text-gray-900">
                📍 우리 동 사업
                <span className="ml-2 text-body font-medium text-red-500">
                  {districtData.count}개
                </span>
              </h2>
              <ul className="mt-6 grid gap-3 md:grid-cols-2">
                {districtData.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-3 rounded-xl bg-cream-50 px-4 py-4 text-body text-gray-900"
                  >
                    <span aria-hidden="true" className="text-red-500">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="result-core">
            <h2 id="result-core" className="text-heading-2 text-gray-900">
              ⭐ 핵심공약
              <span className="ml-2 text-body font-medium text-red-500">
                {matchedCore.length}개
              </span>
            </h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {matchedCore.map((p) => (
                <li key={p.id}>
                  <article className="h-full rounded-2xl bg-white p-6 shadow-md">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-heading-2 font-extrabold text-red-500">{p.id}</p>
                      <Tag tone="blue">{p.category}</Tag>
                    </div>
                    <h3 className="mt-3 text-body-large text-gray-900">{p.title}</h3>
                  </article>
                </li>
              ))}
            </ul>
          </section>

          <p className="rounded-2xl bg-cream-100 p-5 text-body text-gray-700">
            📌 결과는 참고용입니다. 모든 공약은 동등합니다.
          </p>

          <div className="text-center">
            <ResultActions captureTargetId="result-capture" />
            <p className="mt-6 text-body-small text-gray-500">
              <Link href="/pledges" className="btn-text">
                ← 공약 페이지로 돌아가기
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
