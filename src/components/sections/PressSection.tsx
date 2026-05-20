import Image from 'next/image'
import Link from 'next/link'
import { Reveal, RevealItem, RevealStagger, Tag } from '@/components/ui'
import { formatPressDate, pressItems } from '@/lib/data/press'

const VISIBLE = 4

const featured = [...pressItems]
  .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
  .slice(0, VISIBLE)

export function PressSection() {
  return (
    <section
      aria-labelledby="press-heading"
      className="bg-white py-16 md:py-20 lg:py-24"
    >
      <div className="container-base">
        <Reveal>
          <div className="mb-8 flex items-center justify-between">
            <h2
              id="press-heading"
              className="text-[28px] font-bold tracking-[-0.02em] text-gray-900 md:text-heading-1"
            >
              <span aria-hidden="true" className="mr-2">📰</span>
              보도자료
            </h2>
            <Link href="/press" className="btn-text">
              전체 보기 →
            </Link>
          </div>
        </Reveal>

        <RevealStagger
          as="ul"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {featured.map((item) => (
            <RevealItem as="li" key={item.id}>
              <Link
                href={`/press/${item.id}`}
                className="block h-full overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-video bg-cream-100">
                  {item.thumbnail && (
                    <Image
                      src={item.thumbnail}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 280px, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="space-y-3 p-5">
                  <Tag tone={item.category === '정책' ? 'blue' : 'red'}>{item.category}</Tag>
                  <h3 className="truncate-2 text-body-large text-gray-900">{item.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-caption text-gray-500">{formatPressDate(item.publishedAt)}</span>
                    <span className="text-caption font-medium text-red-500">
                      📰 보도 {item.mediaLinks.length}건
                    </span>
                  </div>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  )
}
