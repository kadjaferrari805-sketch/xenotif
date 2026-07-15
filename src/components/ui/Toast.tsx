'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import * as RadixToast from '@radix-ui/react-toast'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastVariant = 'success' | 'error' | 'info'
type ToastItem = { id: string; title: string; description?: string; variant: ToastVariant }

const VARIANT_STYLE: Record<ToastVariant, { wrap: string; icon: React.ElementType }> = {
  success: { wrap: 'border-emerald-200 bg-emerald-50', icon: CheckCircle2 },
  error: { wrap: 'border-red-200 bg-red-50', icon: XCircle },
  info: { wrap: 'border-sport-border bg-sport-card', icon: Info },
}

const ToastCtx = createContext<((toast: Omit<ToastItem, 'id'>) => void) | null>(null)

/** Hook d'émission : `useToast()({ title, description?, variant })`. */
export function useToast() {
  const emit = useContext(ToastCtx)
  if (!emit) throw new Error('useToast doit être utilisé dans <ToastProvider>')
  return emit
}

// Provider global (monté une fois dans src/providers/Providers.tsx) - file
// d'attente de toasts éphémères (confirmation d'action, erreur non bloquante).
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const emit = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { ...toast, id }])
  }, [])

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastCtx.Provider value={emit}>
      <RadixToast.Provider swipeDirection="right" duration={5000}>
        {children}
        {toasts.map(({ id, title, description, variant }) => {
          const { wrap, icon: Icon } = VARIANT_STYLE[variant]
          return (
            <RadixToast.Root
              key={id}
              onOpenChange={(open) => !open && remove(id)}
              className={cn(
                'toast-anim flex items-start gap-3 rounded-xl border p-4 shadow-lg shadow-black/10 data-[state=open]:animate-[toast-in_0.25s_ease-out] data-[state=closed]:animate-[toast-out_0.2s_ease-in] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]',
                wrap,
              )}
            >
              <Icon size={18} aria-hidden="true" className="shrink-0 mt-0.5 text-sport-fg" />
              <div className="flex-1 min-w-0">
                <RadixToast.Title className="text-sm font-bold text-sport-fg">{title}</RadixToast.Title>
                {description && <RadixToast.Description className="text-xs text-sport-gray mt-0.5">{description}</RadixToast.Description>}
              </div>
              <RadixToast.Close aria-label="Fermer" className="shrink-0 text-sport-gray hover:text-sport-fg transition-colors">
                <X size={15} aria-hidden="true" />
              </RadixToast.Close>
            </RadixToast.Root>
          )
        })}
        <RadixToast.Viewport className="fixed bottom-4 right-4 z-[200] flex w-full max-w-sm flex-col gap-2.5 outline-none" />
      </RadixToast.Provider>
    </ToastCtx.Provider>
  )
}
