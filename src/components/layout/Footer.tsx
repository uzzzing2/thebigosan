import Image from 'next/image'
import Link from 'next/link'
import { CANDIDATE, CONTACT, NAV_ITEMS, SNS_LINKS } from '@/lib/constants'

const FOOTER_NAV = [{ label: '홈', href: '/' }, ...NAV_ITEMS]

function SnsIcon({ name }: { name: string }) {
  const common = 'h-5 w-5 fill-white'
  switch (name) {
    case 'youtube':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 0 0 .5 6.5 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.1C4.5 20 12 20 12 20s7.5 0 9.4-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.5ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.22.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.42.37 1.05.42 2.22.07 1.25.07 1.65.07 4.85s0 3.6-.07 4.85c-.05 1.17-.25 1.8-.42 2.22-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.17-1.05.37-2.22.42-1.25.07-1.65.07-4.85.07s-3.6 0-4.85-.07c-1.17-.05-1.8-.25-2.22-.42-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.17-.42-.37-1.05-.42-2.22C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.85c.05-1.17.25-1.8.42-2.22.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.17 1.05-.37 2.22-.42C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.15 0-3.52 0-4.75.06-.99.05-1.52.21-1.88.35-.47.18-.81.4-1.16.75-.35.35-.57.69-.75 1.16-.14.36-.3.89-.35 1.88C3.05 9.48 3.05 9.85 3.05 13s0 3.52.06 4.75c.05.99.21 1.52.35 1.88.18.47.4.81.75 1.16.35.35.69.57 1.16.75.36.14.89.3 1.88.35 1.23.06 1.6.06 4.75.06s3.52 0 4.75-.06c.99-.05 1.52-.21 1.88-.35.47-.18.81-.4 1.16-.75.35-.35.57-.69.75-1.16.14-.36.3-.89.35-1.88.06-1.23.06-1.6.06-4.75s0-3.52-.06-4.75c-.05-.99-.21-1.52-.35-1.88a3.13 3.13 0 0 0-.75-1.16 3.13 3.13 0 0 0-1.16-.75c-.36-.14-.89-.3-1.88-.35C15.52 4 15.15 4 12 4Zm0 3.05a4.95 4.95 0 1 1 0 9.9 4.95 4.95 0 0 1 0-9.9Zm0 1.8a3.15 3.15 0 1 0 0 6.3 3.15 3.15 0 0 0 0-6.3Zm5.15-2.5a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z" />
        </svg>
      )
    case 'facebook':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M13.5 22v-9h3l.5-3.5h-3.5V7.3c0-1 .3-1.8 1.8-1.8H17V2.3c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.8H7v3.5h3V22h3.5Z" />
        </svg>
      )
    case 'blog':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-8.5 11.3-1.5 1.7v-7h2.2v3.7l1.5-1.8h2.4l-2 2.1 2.3 4h-2.5l-1.4-2.6-1 1.1v1.5H8.5Z" />
        </svg>
      )
    default:
      return null
  }
}

export function Footer() {
  return (
    <footer className="bg-cream-100">
      <div className="container-base py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-2" aria-label="홈으로">
              <Image
                src="/images/logo.png"
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
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
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:-translate-y-0.5"
                    style={{ backgroundColor: sns.color }}
                  >
                    <SnsIcon name={sns.name} />
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
