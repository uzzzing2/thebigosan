'use client'

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-heading-1 text-gray-900">설정</h1>
        <p className="mt-1 text-body-small text-gray-700">금지어·운영자 관리</p>
      </header>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-heading-3 text-gray-900">금지어 사전</h2>
        <p className="mt-2 text-body-small text-gray-700">
          현재 금지어 리스트는 코드에 정적으로 정의되어 있어요 (
          <code className="rounded bg-gray-100 px-1 py-0.5 text-caption">
            src/lib/forbidden-words.ts
          </code>
          ).
        </p>
        <p className="mt-2 text-body-small text-gray-700">
          Firestore 기반 동적 금지어 관리 UI는 운영 시작 후 필요해지면 보강할 예정입니다.
        </p>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-heading-3 text-gray-900">운영자</h2>
        <p className="mt-2 text-body-small text-gray-700">
          운영자 이메일은 보안 규칙(<code className="rounded bg-gray-100 px-1 py-0.5 text-caption">firestore.rules</code>)과
          환경 변수(<code className="rounded bg-gray-100 px-1 py-0.5 text-caption">NEXT_PUBLIC_ADMIN_EMAILS</code>)에서
          관리합니다.
        </p>
        <p className="mt-2 text-body-small text-gray-700">
          새 운영자 추가 절차는{' '}
          <a
            href="https://github.com/uzzzing2/thebigosan/blob/master/SETUP_FIREBASE.md"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-text"
          >
            SETUP_FIREBASE.md
          </a>{' '}
          에 정리되어 있어요.
        </p>
      </section>
    </div>
  )
}
