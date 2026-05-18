'use client'

import { AdminGuard } from '@/components/admin/AdminGuard'
import { AdminShell } from '@/components/admin/AdminShell'

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      {(user) => <AdminShell user={user}>{children}</AdminShell>}
    </AdminGuard>
  )
}
