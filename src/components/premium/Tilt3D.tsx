'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

type Tilt3DProps = {
  children: ReactNode
  className?: string
  /** Inclinaison max en degrés */
  max?: number
  /** Reflet lumineux qui suit le curseur */
  glare?: boolean
}

/**
 * Enveloppe un élément d'un effet de carte 3D : inclinaison fluide vers le
 * curseur (perspective réelle) + reflet de lumière. 100% CSS 3D / Framer Motion
 * → accéléré GPU, fluide sur mobile, aucun WebGL. À poser sur un conteneur
 * `relative` (le reflet est en `absolute inset-0`).
 */
export function Tilt3D({ children, className, max = 12, glare = true }: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0) // -0.5 → 0.5
  const py = useMotionValue(0)

  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), { stiffness: 200, damping: 20 })

  const gx = useTransform(px, [-0.5, 0.5], ['0%', '100%'])
  const gy = useTransform(py, [-0.5, 0.5], ['0%', '100%'])
  const glareBg = useTransform(
    [gx, gy],
    ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.22), transparent 55%)`
  )

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  function handleLeave() {
    px.set(0)
    py.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', transformPerspective: 900 }}
      className={className}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: glareBg }}
        />
      )}
    </motion.div>
  )
}
