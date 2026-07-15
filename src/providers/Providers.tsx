'use client'

import { TooltipProvider } from '@radix-ui/react-tooltip'
import { SmoothScrollProvider } from './SmoothScrollProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      <TooltipProvider delayDuration={200}>
        {children}
      </TooltipProvider>
    </SmoothScrollProvider>
  )
}
