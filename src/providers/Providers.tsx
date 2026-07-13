'use client'

import { TooltipProvider } from '@radix-ui/react-tooltip'
import { SmoothScrollProvider } from './SmoothScrollProvider'
import { ThemeProvider } from './ThemeProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SmoothScrollProvider>
        <TooltipProvider delayDuration={200}>
          {children}
        </TooltipProvider>
      </SmoothScrollProvider>
    </ThemeProvider>
  )
}
