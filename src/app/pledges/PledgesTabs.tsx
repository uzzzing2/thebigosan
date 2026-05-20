'use client'

import { Suspense, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { CoreTab } from './CoreTab'
import { FieldTab } from './FieldTab'
import { DistrictTab } from './DistrictTab'
import { MatchTab } from './MatchTab'

const TABS = [
  { value: 'core', label: '핵심공약' },
  { value: 'field', label: '분야별 공약' },
  { value: 'district', label: '동별 공약' },
  { value: 'match', label: '내게 맞는 공약' },
] as const

type TabValue = (typeof TABS)[number]['value']

function PledgesTabsInner() {
  const router = useRouter()
  const params = useSearchParams()
  const tabParam = params.get('tab')
  const tab: TabValue = (TABS.find((t) => t.value === tabParam)?.value ?? 'core')
  // `reset` 시그널이 바뀔 때마다 MatchTab을 remount해서 설문 초기화
  const resetKey = params.get('reset') ?? ''

  const onTabChange = useCallback(
    (v: string) => {
      const next = new URLSearchParams(params.toString())
      next.set('tab', v)
      next.delete('reset')
      router.replace(`?${next.toString()}`, { scroll: false })
    },
    [params, router],
  )

  return (
    <Tabs value={tab} onValueChange={onTabChange} className="w-full">
      <TabsList className="mb-12">
        {TABS.map((t) => (
          <TabsTrigger key={t.value} value={t.value}>
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="core">
        <CoreTab />
      </TabsContent>
      <TabsContent value="field">
        <FieldTab />
      </TabsContent>
      <TabsContent value="district">
        <DistrictTab />
      </TabsContent>
      <TabsContent value="match">
        <MatchTab key={`match-${resetKey}`} />
      </TabsContent>
    </Tabs>
  )
}

export function PledgesTabs() {
  return (
    <Suspense fallback={null}>
      <PledgesTabsInner />
    </Suspense>
  )
}
