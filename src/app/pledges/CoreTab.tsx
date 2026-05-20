import { Tag } from '@/components/ui'
import { corePledges } from '@/lib/data/pledges'

export function CoreTab() {
  return (
    <div>
      <div className="text-center">
        <h2 className="text-[28px] font-bold tracking-[-0.02em] text-gray-900 md:text-heading-1">
          이권재의 핵심 약속 10가지
        </h2>
        <p className="mt-3 text-body-large text-gray-700">
          지킨 약속 위에, 더 큰 완성으로!
        </p>
      </div>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6">
        {corePledges.map((pledge) => (
          <li key={pledge.id}>
            <article className="h-full rounded-2xl bg-white p-5 shadow-md transition-all duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-lg md:p-8">
              <p className="text-[36px] font-extrabold leading-none text-red-500 md:text-display-2">
                {pledge.id}
              </p>
              <h3 className="mt-3 text-body-large text-gray-900 md:mt-5 md:text-heading-3">{pledge.title}</h3>
              <div className="mt-3 md:mt-5">
                <Tag tone="blue">{pledge.category}</Tag>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}
