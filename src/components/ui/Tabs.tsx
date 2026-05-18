'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

export const Tabs = TabsPrimitive.Root

export const TabsList = forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(function TabsList({ className, ...props }, ref) {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        'flex items-center gap-2 overflow-x-auto scrollbar-hide',
        'border-b border-gray-200',
        className,
      )}
      {...props}
    />
  )
})

export const TabsTrigger = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(function TabsTrigger({ className, ...props }, ref) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'relative shrink-0 px-4 py-3 text-base font-medium text-gray-500',
        'transition-colors hover:text-gray-700',
        'focus:outline-none focus-visible:text-red-500',
        'data-[state=active]:text-red-500',
        'data-[state=active]:after:absolute data-[state=active]:after:inset-x-0 data-[state=active]:after:-bottom-px',
        'data-[state=active]:after:h-[3px] data-[state=active]:after:rounded-full data-[state=active]:after:bg-red-500',
        className,
      )}
      {...props}
    />
  )
})

export const TabsContent = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(function TabsContent({ className, ...props }, ref) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn('focus:outline-none animate-fadeIn', className)}
      {...props}
    />
  )
})
