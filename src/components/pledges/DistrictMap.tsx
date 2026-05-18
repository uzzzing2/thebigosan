'use client'

import { cn } from '@/lib/cn'
import { DISTRICT_NAMES, districtPledges, type DistrictName } from '@/lib/data/pledges'

/**
 * 약식 행정동 지도 (Phase 1).
 *
 * 실제 행정동 GeoJSON을 받으면 path 좌표를 교체하면 됩니다 — props 인터페이스는
 * 변경하지 않아도 됩니다 (selected / onSelect 만 유지).
 */
interface Box {
  name: DistrictName
  x: number
  y: number
  w: number
  h: number
}

const BOXES: Box[] = [
  { name: '세마동',  x: 12,  y: 12,  w: 110, h: 80 },
  { name: '신장1동', x: 132, y: 12,  w: 120, h: 80 },
  { name: '신장2동', x: 262, y: 12,  w: 126, h: 80 },
  { name: '중앙동',  x: 90,  y: 102, w: 220, h: 64 },
  { name: '대원1동', x: 12,  y: 176, w: 134, h: 64 },
  { name: '대원2동', x: 156, y: 176, w: 134, h: 64 },
  { name: '남촌동',  x: 300, y: 176, w: 88,  h: 132 },
  { name: '초평동',  x: 12,  y: 250, w: 278, h: 58 },
]

export interface DistrictMapProps {
  selected: DistrictName
  onSelect: (d: DistrictName) => void
  className?: string
}

export function DistrictMap({ selected, onSelect, className }: DistrictMapProps) {
  return (
    <div className={cn('w-full', className)}>
      <svg
        viewBox="0 0 400 320"
        role="img"
        aria-label="오산시 행정동 약식 지도"
        className="w-full"
      >
        <rect x="0" y="0" width="400" height="320" fill="#FAF7F2" rx="20" />

        {BOXES.map((box) => {
          const isActive = selected === box.name
          const count = districtPledges[box.name].count
          return (
            <g
              key={box.name}
              role="button"
              tabIndex={0}
              aria-pressed={isActive}
              aria-label={`${box.name} 선택, 사업 ${count}개`}
              onClick={() => onSelect(box.name)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(box.name)
                }
              }}
              className="cursor-pointer outline-none focus-visible:[&>rect]:stroke-red-500 focus-visible:[&>rect]:stroke-[3]"
            >
              <rect
                x={box.x}
                y={box.y}
                width={box.w}
                height={box.h}
                rx="14"
                className={cn(
                  'transition-colors',
                  isActive
                    ? 'fill-red-500'
                    : 'fill-white stroke-cream-100 stroke-[2] hover:fill-cream-100',
                )}
              />
              <text
                x={box.x + box.w / 2}
                y={box.y + box.h / 2 - 4}
                textAnchor="middle"
                dominantBaseline="middle"
                className={cn(
                  'pointer-events-none select-none text-[14px] font-semibold',
                  isActive ? 'fill-white' : 'fill-gray-900',
                )}
              >
                {box.name}
              </text>
              <text
                x={box.x + box.w / 2}
                y={box.y + box.h / 2 + 12}
                textAnchor="middle"
                dominantBaseline="middle"
                className={cn(
                  'pointer-events-none select-none text-[11px] font-medium',
                  isActive ? 'fill-white/90' : 'fill-red-500',
                )}
              >
                {count}개 사업
              </text>
            </g>
          )
        })}
      </svg>

      {/* Fallback list (visible on very small screens or for AT, but also helps QA) */}
      <ul className="mt-4 grid grid-cols-2 gap-2 sm:hidden">
        {DISTRICT_NAMES.map((name) => (
          <li key={name}>
            <button
              type="button"
              onClick={() => onSelect(name)}
              aria-pressed={selected === name}
              className={cn(
                'w-full rounded-xl px-4 py-3 text-body font-medium transition-colors',
                selected === name
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-white text-gray-900 shadow-sm',
              )}
            >
              {name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
