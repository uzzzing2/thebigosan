'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/cn'
import {
  DISTRICT_NAMES,
  SURVEY_AGES,
  SURVEY_FIELDS,
  type DistrictName,
  type SurveyAge,
  type SurveyField,
} from '@/lib/data/pledges'

type Step = 1 | 2 | 3

export function MatchTab() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [district, setDistrict] = useState<DistrictName | '기타' | null>(null)
  const [fields, setFields] = useState<SurveyField[]>([])
  const [age, setAge] = useState<SurveyAge | null>(null)

  const progress = useMemo(() => (step === 1 ? 33 : step === 2 ? 66 : 100), [step])

  const canNext =
    (step === 1 && district !== null) ||
    (step === 2 && fields.length > 0) ||
    (step === 3 && age !== null)

  function toggleField(f: SurveyField) {
    setFields((prev) => {
      if (prev.includes(f)) return prev.filter((x) => x !== f)
      if (prev.length >= 3) return prev
      return [...prev, f]
    })
  }

  function submit() {
    const params = new URLSearchParams()
    if (district) params.set('district', district)
    if (fields.length) params.set('fields', fields.join(','))
    if (age) params.set('age', age)
    router.push(`/pledges/result?${params.toString()}`)
  }

  return (
    <div className="mx-auto max-w-[800px]">
      <div className="mb-3 flex items-center justify-between text-body-small text-gray-700">
        <span>
          Step {step}/3
        </span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100" aria-hidden="true">
        <div
          className="h-full rounded-full bg-red-500 transition-[width] duration-500 ease-out-soft"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-10">
        {step === 1 && (
          <fieldset>
            <legend className="text-[24px] font-bold text-gray-900 md:text-heading-1">
              거주하시는 동은 어디인가요?
            </legend>
            <p className="mt-3 text-body text-gray-700">
              우리 동의 사업을 우선 추천해드립니다.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              {[...DISTRICT_NAMES, '기타' as const].map((name) => (
                <li key={name}>
                  <label
                    className={cn(
                      'flex cursor-pointer items-center justify-center rounded-xl px-4 py-4 text-body font-medium transition-colors',
                      district === name
                        ? 'bg-red-500 text-white shadow-md'
                        : 'bg-white text-gray-900 shadow-sm hover:bg-cream-100',
                    )}
                  >
                    <input
                      type="radio"
                      name="district"
                      value={name}
                      checked={district === name}
                      onChange={() => setDistrict(name)}
                      className="sr-only"
                    />
                    {name}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset>
            <legend className="text-[24px] font-bold text-gray-900 md:text-heading-1">
              관심 있는 분야를 선택해주세요
            </legend>
            <p className="mt-3 text-body text-gray-700">
              복수 선택, 최대 3개 ({fields.length}/3)
            </p>
            <ul className="mt-8 grid gap-3 grid-cols-2 sm:grid-cols-4">
              {SURVEY_FIELDS.map((f) => {
                const checked = fields.includes(f)
                const disabled = !checked && fields.length >= 3
                return (
                  <li key={f}>
                    <label
                      className={cn(
                        'flex cursor-pointer items-center justify-center rounded-xl px-4 py-4 text-body font-medium transition-colors',
                        checked
                          ? 'bg-red-500 text-white shadow-md'
                          : disabled
                            ? 'cursor-not-allowed bg-gray-100 text-gray-500'
                            : 'bg-white text-gray-900 shadow-sm hover:bg-cream-100',
                      )}
                    >
                      <input
                        type="checkbox"
                        name="field"
                        value={f}
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggleField(f)}
                        className="sr-only"
                      />
                      {f}
                    </label>
                  </li>
                )
              })}
            </ul>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset>
            <legend className="text-[24px] font-bold text-gray-900 md:text-heading-1">
              연령대를 선택해주세요
            </legend>
            <p className="mt-3 text-body text-gray-700">
              생애주기별 맞춤 공약을 안내해드립니다.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              {SURVEY_AGES.map((a) => (
                <li key={a}>
                  <label
                    className={cn(
                      'flex cursor-pointer items-center justify-center rounded-xl px-4 py-4 text-body font-medium transition-colors',
                      age === a
                        ? 'bg-red-500 text-white shadow-md'
                        : 'bg-white text-gray-900 shadow-sm hover:bg-cream-100',
                    )}
                  >
                    <input
                      type="radio"
                      name="age"
                      value={a}
                      checked={age === a}
                      onChange={() => setAge(a)}
                      className="sr-only"
                    />
                    {a}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        )}
      </div>

      <div className="mt-12 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => (s === 1 ? 1 : ((s - 1) as Step)))}
          disabled={step === 1}
          className="btn-secondary disabled:opacity-50"
        >
          ← 이전
        </button>
        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep((s) => (s + 1) as Step)}
            disabled={!canNext}
            className="btn-primary"
          >
            다음 →
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={!canNext}
            className="btn-primary"
          >
            결과 보기 →
          </button>
        )}
      </div>
    </div>
  )
}
