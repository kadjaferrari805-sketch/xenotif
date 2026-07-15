'use client'

import * as RadixProgress from '@radix-ui/react-progress'
import { cn } from '@/lib/utils'

export function Progress({
  value,
  max = 100,
  className,
  barClassName,
}: {
  /** 0-100 (ou 0-max si `max` fourni). */
  value: number
  max?: number
  className?: string
  barClassName?: string
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <RadixProgress.Root
      value={value}
      max={max}
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-sport-gray-light', className)}
    >
      <RadixProgress.Indicator
        className={cn('h-full rounded-full bg-sport-orange transition-transform duration-500 ease-out', barClassName)}
        style={{ transform: `translateX(-${100 - pct}%)` }}
      />
    </RadixProgress.Root>
  )
}
