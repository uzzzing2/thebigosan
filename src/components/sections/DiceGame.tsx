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
    <div className="relative aspect-[4/3] w-full overflow-visible">
      <Image
        src="/images/map.png"
        alt="오산시 미래 도시 지도"
        fill
        priority
        sizes="(min-width: 1024px) 950px, 100vw"
        className="object-contain scale-110 origin-center"
      />
      <Image
        src="/images/character_hello.png"
        alt=""
        width={240}
        height={320}
        priority
        aria-hidden="true"
        className="pointer-events-none absolute right-[9%] top-0 z-10 h-auto w-[22%] -translate-y-4 drop-shadow-md md:w-[20%] lg:w-[22%]"
      />
      {/* TODO Phase 1: overlay clickable hotspots for major districts (CSS only) */}
      {/* TODO Phase 2: replace this component with the 28-tile board game */}
    </div>
  )
}
