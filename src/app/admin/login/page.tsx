'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Input } from '@/components/ui'
import { isAdminEmail, signInAdmin, watchAuth } from '@/lib/auth'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // If already signed in as admin, bounce to dashboard
  useEffect(() => {
    return watchAuth((user) => {
      if (user && isAdminEmail(user.email)) {
        router.replace('/admin')
      }
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    try {
      await signInAdmin(email, password)
      toast.success('로그인됐어요')
      router.replace('/admin')
    } catch (err: unknown) {
      const code =
        err && typeof err === 'object' && 'code' in err
          ? String((err as { code: string }).code)
          : ''
      const message =
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password' ||
        code === 'auth/user-not-found'
          ? '이메일 또는 비밀번호가 맞지 않아요'
          : err instanceof Error
            ? err.message
            : '로그인 중 문제가 발생했어요'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-md">
        <h1 className="text-heading-2 text-gray-900">관리자 로그인</h1>
        <p className="mt-2 text-body-small text-gray-700">
          캠프 운영자만 접속할 수 있어요.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <Input
            label="이메일"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
          />
          <Input
            label="비밀번호"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="btn-primary w-full"
          >
            {loading ? '로그인 중…' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
