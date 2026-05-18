'use client'

import Image from 'next/image'

/**
 * Hero interactive surface.
 *
 * Phase 1: static map.png with hover/click affordances (light interactivity).
 * Phase 2: replace this component with a 28-tile board game. The Hero section
 * imports DiceGame and never reaches into its internals, so swapping the
 * implementation here is enough.
 */
export function DiceGame() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-cream-50 md:aspect-[5/4]">
      <Image
        src="/images/map.png"
        alt="오산시 미래 도시 지도"
        fill
        priority
        sizes="(min-width: 1024px) 720px, 100vw"
        className="object-contain"
      />
      {/* TODO Phase 1: overlay clickable hotspots for major districts (CSS only) */}
      {/* TODO Phase 2: replace this component with the 28-tile board game */}
    </div>
  )
}
