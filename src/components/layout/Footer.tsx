import Image from 'next/image'
import Link from 'next/link'
import { SnsIcon } from '@/components/ui'
import { CANDIDATE, CONTACT, NAV_ITEMS, SNS_LINKS } from '@/lib/constants'

const FOOTER_NAV = [{ label: '홈', href: '/' }, ...NAV_ITEMS]

export function Footer() {
  return (
    <footer className="bg-cream-100">
      <div className="container-base py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-flex items-center" aria-label="홈으로">
              <Image
                src="/images/logo-simple.png"
                alt={`${CANDIDATE.name} ${CANDIDATE.campName}`}
                width={520}
                height={245}
                className="h-20 w-auto object-contain md:h-24"
              />
            </Link>
            <p className="mt-4 text-base font-bold text-gray-900">
              {CANDIDATE.name} {CANDIDATE.campName}
            </p>
            <p className="mt-3 text-body-small text-gray-700">
              본 사이트는<br />
              {CANDIDATE.name} 캠프에서 운영합니다.
            </p>
          </div>

          <div>
            <h3 className="text-body font-bold text-gray-900">사이트맵</h3>
            <ul className="mt-4 space-y-2">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-small text-gray-700 transition-colors hover:text-red-500"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-body font-bold text-gray-900">캠프 연락처</h3>
            <ul className="mt-4 space-y-3 text-body-small text-gray-700">
              <li className="flex gap-2">
                <span aria-hidden="true">📍</span>
                <span>{CONTACT.address}</span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true">📞</span>
                <span>
                  {CONTACT.phone1}
                  <br />
                  {CONTACT.phone2}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-body font-bold text-gray-900">SNS 채널</h3>
            <ul className="mt-4 flex flex-wrap gap-3">
              {SNS_LINKS.map((sns) => (
                <li key={sns.name}>
                  <a
                    href={sns.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${sns.label} 새 창에서 열기`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition-transform hover:-translate-y-0.5"
                    style={{ backgroundColor: sns.color }}
                  >
                    <SnsIcon name={sns.name} className="h-5 w-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-cream-50 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-caption text-gray-500">
            © 2026 {CANDIDATE.name} {CANDIDATE.campName}. All rights reserved.
          </p>
          <ul className="flex gap-6">
            <li>
              <Link
                href="/privacy"
                className="text-caption text-gray-700 transition-colors hover:text-red-500"
              >
                개인정보처리방침
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="text-caption text-gray-700 transition-colors hover:text-red-500"
              >
                이용약관
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
