'use client'

import { useState } from 'react'
import { districtPledges, type DistrictName } from '@/lib/data/pledges'
import { DistrictMap } from '@/components/pledges/DistrictMap'

export function DistrictTab() {
  const [selected, setSelected] = useState<DistrictName>('중앙동')
  const data = districtPledges[selected]

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,460px)_1fr] lg:gap-12">
      <div>
        <p className="mb-4 text-body font-medium text-gray-900">
          살고 계신 동을 선택해주세요
        </p>
        <DistrictMap selected={selected} onSelect={setSelected} />
      </div>

      <article className="rounded-2xl bg-white p-6 shadow-md md:p-8">
        <header className="flex items-baseline gap-3">
          <h2 className="text-heading-2 text-gray-900">
            <span aria-hidden="true" className="mr-1">📍</span>
            {selected}
          </h2>
          <span className="text-body font-medium text-red-500">{data.count}개 사업</span>
        </header>
        <ul className="mt-6 space-y-3">
          {data.items.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-xl bg-cream-50 px-4 py-3 text-body text-gray-900"
            >
              <span aria-hidden="true" className="text-red-500">·</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </article>
    </div>
  )
}
