import { HeroSection } from '@/components/sections/HeroSection'
import { MarqueeSection } from '@/components/sections/MarqueeSection'
import { SnsSection } from '@/components/sections/SnsSection'
import { HighlightsSection } from '@/components/sections/HighlightsSection'
import { PressSection } from '@/components/sections/PressSection'
import { ClosingSection } from '@/components/sections/ClosingSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeSection />
      <SnsSection />
      <HighlightsSection />
      <PressSection />
      <ClosingSection />
    </>
  )
}
