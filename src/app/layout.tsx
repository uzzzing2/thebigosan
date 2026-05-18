import type { Metadata, Viewport } from 'next'
import { TopBar } from '@/components/layout/TopBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/Toaster'
import { CANDIDATE, SLOGAN } from '@/lib/constants'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://xn--3e0bw6t.com'),
  title: {
    default: `${CANDIDATE.name} ${CANDIDATE.campName} · ${SLOGAN.main}`,
    template: `%s · ${CANDIDATE.name} ${CANDIDATE.campName}`,
  },
  description: `${SLOGAN.tagging}. 기호 2번 ${CANDIDATE.party} 오산시장 후보 ${CANDIDATE.name}의 공식 홍보 사이트입니다.`,
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: `${CANDIDATE.name} ${CANDIDATE.campName}`,
    title: `${CANDIDATE.name} ${CANDIDATE.campName} · ${SLOGAN.main}`,
    description: SLOGAN.tagging,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#EA2C38',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-red-500 focus:px-4 focus:py-2 focus:text-white"
        >
          본문 바로가기
        </a>
        <TopBar />
        <Header />
        <main id="main" className="min-h-[60vh]">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
