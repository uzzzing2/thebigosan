import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="bg-white py-20 md:py-24 lg:py-32">
      <div className="container-base flex flex-col items-center text-center">
        <p className="text-[88px] font-extrabold leading-none tracking-[-0.02em] text-red-500 md:text-[120px]">
          404
        </p>
        <h1 className="mt-6 text-[28px] font-bold tracking-[-0.02em] text-gray-900 md:text-heading-1">
          길을 잃으셨나요?
        </h1>
        <p className="mt-4 text-body-large text-gray-700">
          요청하신 페이지를 찾을 수 없어요
        </p>
        <div className="mt-10 flex gap-3">
          <Link href="/" className="btn-primary">
            홈으로 돌아가기
          </Link>
          <Link href="/pledges" className="btn-secondary">
            공약 보기
          </Link>
        </div>
      </div>
    </section>
  )
}
