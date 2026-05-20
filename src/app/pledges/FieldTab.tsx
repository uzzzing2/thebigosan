import { Tag } from '@/components/ui'
import {
  corePledges,
  fieldPledges,
  workerCategoryMeta,
  type WorkerCategory,
} from '@/lib/data/pledges'

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
        const coreItems = corePledges.filter((p) => p.category === category)
        const groups = fieldPledges[category] ?? []
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

            {coreItems.length > 0 && (
              <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                {coreItems.map((pledge) => (
                  <li key={pledge.id}>
                    <article className="h-full rounded-2xl bg-white p-4 shadow-md sm:p-6">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-body-large font-extrabold text-red-500 sm:text-heading-3">
                          {pledge.id}
                        </p>
                        <Tag tone="blue">{pledge.category}</Tag>
                      </div>
                      <h3 className="mt-3 text-body text-gray-900 sm:mt-4 sm:text-body-large">{pledge.title}</h3>
                    </article>
                  </li>
                ))}
              </ul>
            )}

            {groups.length > 0 && (
              <div className="mt-8 grid gap-4 sm:gap-6 md:grid-cols-2">
                {groups.map((group) => (
                  <article
                    key={group.subtitle}
                    className="rounded-2xl bg-cream-50 p-5 sm:p-6"
                  >
                    <h3 className="text-body-large font-bold text-gray-900">
                      {group.subtitle}
                    </h3>
                    <ul className="mt-3 space-y-1.5">
                      {group.items.map((item, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-body-small text-gray-700"
                        >
                          <span aria-hidden="true" className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-red-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            )}

            {coreItems.length === 0 && groups.length === 0 && (
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
