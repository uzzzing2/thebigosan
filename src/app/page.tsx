import { HeroSection } from '@/components/sections/HeroSection'
import { MarqueeSection } from '@/components/sections/MarqueeSection'
import { SnsSection } from '@/components/sections/SnsSection'
import { HighlightsSection } from '@/components/sections/HighlightsSection'
import { PressSection } from '@/components/sections/PressSection'
import { ClosingSection } from '@/components/sections/ClosingSection'

// Cloudflare Workers IPs are blocked by YouTube's RSS endpoint (404 at
// request time). Force-render this page at build time so the SnsSection
// fetch happens in the build environment (which YouTube allows).
export const dynamic = 'force-static'
export const revalidate = 3600

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
