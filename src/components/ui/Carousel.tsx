'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface CarouselProps {
  ariaLabel: string
  children: ReactNode[]
  /** Auto-advance interval in ms. 0 disables autoplay. Default 6000. */
  autoplayMs?: number
  /** Items visible per breakpoint (mobile / tablet / desktop). */
  slidesPerView?: { mobile: number; tablet?: number; desktop?: number }
  /** Show prev/next arrow buttons (default true) */
  arrows?: boolean
  /** Show dot indicators (default true) */
  dots?: boolean
  /** Loop the carousel (default true) */
  loop?: boolean
  className?: string
}

export function Carousel({
  ariaLabel,
  children,
  autoplayMs = 6000,
  slidesPerView = { mobile: 1 },
  arrows = true,
  dots = true,
  loop = true,
  className,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop, align: 'start' })
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const paused = useRef(false)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIdx(emblaApi.selectedScrollSnap())
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    onSelect()
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  // Autoplay
  useEffect(() => {
    if (!emblaApi || autoplayMs <= 0) return
    const id = setInterval(() => {
      if (paused.current) return
      if (typeof document !== 'undefined' && document.hidden) return
      emblaApi.scrollNext()
    }, autoplayMs)
    return () => clearInterval(id)
  }, [emblaApi, autoplayMs])

  // Slide basis classes — Tailwind needs literal class strings
  const basisMobile =
    slidesPerView.mobile === 1
      ? 'basis-full'
      : slidesPerView.mobile === 1.5
        ? 'basis-2/3'
        : slidesPerView.mobile === 2
          ? 'basis-1/2'
          : 'basis-full'
  const basisTablet = slidesPerView.tablet
    ? slidesPerView.tablet === 2
      ? 'md:basis-1/2'
      : slidesPerView.tablet === 3
        ? 'md:basis-1/3'
        : 'md:basis-1/2'
    : ''
  const basisDesktop = slidesPerView.desktop
    ? slidesPerView.desktop === 3
      ? 'lg:basis-1/3'
      : slidesPerView.desktop === 4
        ? 'lg:basis-1/4'
        : 'lg:basis-1/2'
    : ''

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className={cn('relative', className)}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -mx-2">
          {children.map((child, i) => (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${children.length}`}
              className={cn('min-w-0 shrink-0 px-2', basisMobile, basisTablet, basisDesktop)}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {arrows && children.length > 1 && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="이전"
            className="absolute -left-1 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-900 shadow-md transition-shadow hover:shadow-lg md:inline-flex"
          >
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="다음"
            className="absolute -right-1 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-900 shadow-md transition-shadow hover:shadow-lg md:inline-flex"
          >
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </>
      )}

      {dots && scrollSnaps.length > 1 && (
        <div className="mt-5 flex justify-center gap-2">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`${i + 1}번째 슬라이드로 이동`}
              aria-current={i === selectedIdx ? 'true' : undefined}
              className={cn(
                'h-2 rounded-full transition-all duration-200',
                i === selectedIdx ? 'w-6 bg-red-500' : 'w-2 bg-gray-200 hover:bg-gray-500',
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
