'use client'

import { PressForm } from '@/components/admin/PressForm'

export default function NewPressPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-heading-1 text-gray-900">새 보도자료</h1>
      </header>
      <PressForm />
    </div>
  )
}
