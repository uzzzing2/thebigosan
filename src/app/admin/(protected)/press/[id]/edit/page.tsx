'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PressForm } from '@/components/admin/PressForm'
import { getPressAdmin, type AdminPressItem } from '@/lib/firestore/admin'

export default function EditPressPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [item, setItem] = useState<AdminPressItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params?.id) return
    let cancelled = false
    getPressAdmin(params.id)
      .then((data) => {
        if (cancelled) return
        if (!data) {
          toast.error('보도자료를 찾을 수 없어요')
          router.replace('/admin/press')
          return
        }
        setItem(data)
      })
      .catch((e) => {
        toast.error((e as Error).message)
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [params?.id, router])

  if (loading) {
    return <p className="rounded-lg bg-white p-6 text-body-small text-gray-500">불러오는 중…</p>
  }
  if (!item) return null

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-heading-1 text-gray-900">보도자료 편집</h1>
      </header>
      <PressForm initial={item} />
    </div>
  )
}
