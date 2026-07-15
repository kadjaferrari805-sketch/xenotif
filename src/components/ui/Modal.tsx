'use client'

import * as RadixDialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Modal = RadixDialog.Root
export const ModalTrigger = RadixDialog.Trigger
export const ModalClose = RadixDialog.Close

export interface ModalContentProps {
  open: boolean
  title: string
  /** Description accessible (lue par les lecteurs d'écran) - visible ou via VisuallyHidden selon `descriptionHidden`. */
  description?: string
  descriptionHidden?: boolean
  children: React.ReactNode
  className?: string
  onOpenChange?: (open: boolean) => void
}

// Contenu de modale animé (fade + scale, respecte prefers-reduced-motion via
// Framer Motion) - `open` piloté depuis l'extérieur pour synchroniser
// AnimatePresence avec l'état Radix (Radix démonte immédiatement sans lui).
export function ModalContent({ open, title, description, descriptionHidden, children, className }: ModalContentProps) {
  return (
    <AnimatePresence>
      {open && (
        <RadixDialog.Portal forceMount>
          <RadixDialog.Overlay asChild forceMount>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            />
          </RadixDialog.Overlay>
          <RadixDialog.Content asChild forceMount>
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-sport-card border border-sport-border shadow-2xl shadow-black/20 p-6',
                className,
              )}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <RadixDialog.Title className="text-lg font-black text-sport-fg">{title}</RadixDialog.Title>
                <RadixDialog.Close className="shrink-0 rounded-full p-1 text-sport-gray hover:text-sport-fg hover:bg-sport-fg/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sport-orange/50">
                  <X size={18} aria-hidden="true" />
                  <span className="sr-only">Fermer</span>
                </RadixDialog.Close>
              </div>
              {description && (
                <RadixDialog.Description className={descriptionHidden ? 'sr-only' : 'text-sm text-sport-gray mb-4'}>
                  {description}
                </RadixDialog.Description>
              )}
              {children}
            </motion.div>
          </RadixDialog.Content>
        </RadixDialog.Portal>
      )}
    </AnimatePresence>
  )
}
