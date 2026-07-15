'use client'

import { TooltipProvider } from '@radix-ui/react-tooltip'
import { SmoothScrollProvider } from './SmoothScrollProvider'
import { ToastProvider } from '@/components/ui/Toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      <TooltipProvider delayDuration={200}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </TooltipProvider>
    </SmoothScrollProvider>
  )
}
