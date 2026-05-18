'use client'

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

export function PledgesTabs() {
  return (
    <Tabs defaultValue="core" className="w-full">
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
        <MatchTab />
      </TabsContent>
    </Tabs>
  )
}
