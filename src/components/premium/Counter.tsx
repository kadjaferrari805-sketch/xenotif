'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'

type CounterProps = {
  to: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

/**
 * Compteur animé : démarre quand le nombre entre dans le viewport, monte de 0 → `to`.
 * setState dans le callback `onUpdate` (pas dans le corps de l'effet) → conforme lint.
 */
export function Counter({ to, suffix = '', prefix = '', duration = 1.6, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString('fr-FR')}
      {suffix}
    </span>
  )
}
