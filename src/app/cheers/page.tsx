import type { Metadata } from 'next'
import { CheersPageClient } from './CheersPageClient'

export const metadata: Metadata = {
  title: '응원한마디',
  description: '더 큰 오산을 향한 시민의 한마디. 함께 보태주세요.',
}

export default function CheersPage() {
  return <CheersPageClient />
}
