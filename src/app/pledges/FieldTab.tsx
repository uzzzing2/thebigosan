import { Tag } from '@/components/ui'
import { corePledges, workerCategoryMeta, type WorkerCategory } from '@/lib/data/pledges'

const ORDERED_CATEGORIES: WorkerCategory[] = [
  '경제 일꾼',
  '매력 일꾼',
  '따뜻한 일꾼',
  '믿음직한 일꾼',
]

export function FieldTab() {
  return (
    <div className="space-y-16">
      {ORDERED_CATEGORIES.map((category) => {
        const meta = workerCategoryMeta[category]
        const items = corePledges.filter((p) => p.category === category)
        return (
          <section key={category} aria-labelledby={`field-${category}`}>
            <header className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-4">
              <h2
                id={`field-${category}`}
                className="flex items-center gap-2 text-heading-2 text-gray-900"
              >
                <span aria-hidden="true">{meta.icon}</span>
                {meta.lead}
              </h2>
              <p className="text-body-large text-gray-700">{meta.description}</p>
            </header>

            {items.length > 0 ? (
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((pledge) => (
                  <li key={pledge.id}>
                    <article className="h-full rounded-2xl bg-white p-6 shadow-md">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-heading-3 font-extrabold text-red-500">
                          {pledge.id}
                        </p>
                        <Tag tone="blue">{pledge.category}</Tag>
                      </div>
                      <h3 className="mt-4 text-body-large text-gray-900">{pledge.title}</h3>
                    </article>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 rounded-2xl bg-cream-100 p-6 text-body text-gray-700">
                해당 분야 공약은 곧 채워질 예정입니다.
              </p>
            )}
          </section>
        )
      })}
    </div>
  )
}
