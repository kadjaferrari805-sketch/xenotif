'use client'

import * as RadixTabs from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

export const Tabs = RadixTabs.Root

export function TabsList({ className, ...props }: React.ComponentPropsWithoutRef<typeof RadixTabs.List>) {
  return (
    <RadixTabs.List
      className={cn('inline-flex items-center gap-1 rounded-full border border-sport-border bg-sport-gray-light p-1', className)}
      {...props}
    />
  )
}

export function TabsTrigger({ className, ...props }: React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger>) {
  return (
    <RadixTabs.Trigger
      className={cn(
        'rounded-full px-4 py-2 text-sm font-bold text-sport-gray transition-all data-[state=active]:bg-sport-orange data-[state=active]:text-white hover:text-sport-fg data-[state=active]:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sport-orange/50',
        className,
      )}
      {...props}
    />
  )
}

export function TabsContent({ className, ...props }: React.ComponentPropsWithoutRef<typeof RadixTabs.Content>) {
  return <RadixTabs.Content className={cn('mt-5 focus-visible:outline-none', className)} {...props} />
}
