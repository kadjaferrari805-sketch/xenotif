'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Décalage d'apparition (s) — pour décaler des éléments en cascade */
  delay?: number
  /** Distance de translation initiale (px) */
  y?: number
}

/**
 * Apparition premium au scroll : fondu + montée douce, une seule fois.
 * S'appuie sur Framer Motion `whileInView` (IntersectionObserver natif).
 */
export function Reveal({ children, className, delay = 0, y = 24 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
