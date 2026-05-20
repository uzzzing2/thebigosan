import type { Metadata } from 'next'
import Link from 'next/link'
import { Tag } from '@/components/ui'
import {
  corePledges,
  districtPledges,
  getFieldPledgesBySurveyFields,
  SURVEY_AGES,
  type DistrictName,
  type SurveyAge,
  type SurveyField,
} from '@/lib/data/pledges'
import { ResultHeadline } from './NicknameGreeting'
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

  const selectedFields = fields as SurveyField[]
  const selectedAge: SurveyAge | null = (SURVEY_AGES as readonly string[]).includes(age ?? '')
    ? ((age as SurveyAge) ?? null)
    : null

  const matchedCore = corePledges.filter((p) => {
    if (selectedFields.length > 0) {
      const fieldOk = p.surveyFields.some((f) => selectedFields.includes(f))
      if (!fieldOk) return false
    }
    if (selectedAge) {
      // ages 없으면 모든 연령 대상 — 통과. 있으면 선택 연령 포함해야 함.
      if (p.ages && p.ages.length > 0 && !p.ages.includes(selectedAge)) return false
    }
    return true
  })
  const matchedFieldItems = getFieldPledgesBySurveyFields(selectedFields, selectedAge)

  return (
    <div id="result-capture">
      <section className="bg-cream-50 py-16 md:py-20 lg:py-24">
        <div className="container-base text-center">
          <p className="text-base font-medium text-red-500">
            🎯 맞춤 공약 결과
          </p>
          <ResultHeadline fallback={district ?? '시민'} />
          <p className="mt-4 text-body-large text-gray-700">
            거주 동{fields.length > 0 ? '·관심 분야' : ''}
            {selectedAge ? '·연령대' : ''}를 고려했어요
          </p>
          {(district || fields.length > 0 || selectedAge) && (
            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              {district && <Tag tone="red">📍 {district}</Tag>}
              {fields.map((f) => (
                <Tag key={f} tone="blue">
                  {f}
                </Tag>
              ))}
              {selectedAge && <Tag tone="gray">{selectedAge}</Tag>}
            </div>
          )}
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

          {matchedFieldItems.length > 0 && (
            <section aria-labelledby="result-field">
              <h2 id="result-field" className="text-heading-2 text-gray-900">
                🎯 관심 분야 공약
                <span className="ml-2 text-body font-medium text-red-500">
                  {matchedFieldItems.length}개
                </span>
              </h2>
              <ul className="mt-6 grid gap-3 md:grid-cols-2">
                {matchedFieldItems.map((item, i) => (
                  <li
                    key={`${item.title}-${i}`}
                    className="flex flex-col gap-2 rounded-xl bg-cream-50 px-4 py-4"
                  >
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.surveyFields.map((sf) => (
                        <Tag key={sf} tone="red">
                          {sf}
                        </Tag>
                      ))}
                      <span className="text-caption text-gray-500">· {item.subtitle}</span>
                    </div>
                    <p className="text-body text-gray-900">{item.title}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

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
