'use client'

import { useState } from 'react'

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // Step 7: replace with sonner toast
    }
  }

  return (
    <button type="button" onClick={handleCopy} className="btn-secondary">
      {copied ? '복사됨 ✓' : '링크 복사'}
    </button>
  )
}
