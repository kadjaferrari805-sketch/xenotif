'use client'

import * as RadixDialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Drawer = RadixDialog.Root
export const DrawerTrigger = RadixDialog.Trigger
export const DrawerClose = RadixDialog.Close

export interface DrawerContentProps {
  open: boolean
  title: string
  side?: 'left' | 'right' | 'bottom'
  children: React.ReactNode
  className?: string
}

const SIDE_STYLE = {
  left: { base: 'inset-y-0 left-0 h-full w-[85vw] max-w-sm', from: { x: '-100%' } },
  right: { base: 'inset-y-0 right-0 h-full w-[85vw] max-w-sm', from: { x: '100%' } },
  bottom: { base: 'inset-x-0 bottom-0 w-full max-h-[85vh] rounded-t-2xl', from: { y: '100%' } },
} as const

// Panneau latéral/bas animé (même mécanique que Modal : Framer Motion piloté par
// `open`, Radix pour le focus trap/scroll lock/a11y). Sert au panier mobile, aux
// filtres exercices, etc.
export function DrawerContent({ open, title, side = 'right', children, className }: DrawerContentProps) {
  const style = SIDE_STYLE[side]
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
              initial={{ opacity: 0, ...style.from }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, ...style.from }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className={cn('fixed z-[101] flex flex-col bg-sport-card border-sport-border shadow-2xl shadow-black/20', style.base, className)}
            >
              <div className="flex items-center justify-between gap-4 p-5 border-b border-sport-border shrink-0">
                <RadixDialog.Title className="text-base font-black text-sport-fg">{title}</RadixDialog.Title>
                <RadixDialog.Close className="shrink-0 rounded-full p-1 text-sport-gray hover:text-sport-fg hover:bg-sport-fg/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sport-orange/50">
                  <X size={18} aria-hidden="true" />
                  <span className="sr-only">Fermer</span>
                </RadixDialog.Close>
              </div>
              <div className="overflow-y-auto p-5">{children}</div>
            </motion.div>
          </RadixDialog.Content>
        </RadixDialog.Portal>
      )}
    </AnimatePresence>
  )
}
