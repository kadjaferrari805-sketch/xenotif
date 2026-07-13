'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useInView } from 'react-intersection-observer'
import { Users, BookOpen, Layers, Star } from 'lucide-react'
import { Tilt3D } from '@/components/premium/Tilt3D'

// Données structurelles des stats (icône, valeur, couleurs). Les libellés
// (label, sublabel) viennent de messages → home.proof.stats.
const STAT_STYLE = [
  { Icon: Users,    end: 12000, suffix: '+',  color: 'text-sport-orange', bg: 'bg-sport-orange/10 border-sport-orange/20' },
  { Icon: BookOpen, end: 50,    suffix: '+',  color: 'text-sport-blue',   bg: 'bg-sport-blue/10 border-sport-blue/20' },
  { Icon: Layers,   end: 10,    suffix: '',   color: 'text-sport-lime',   bg: 'bg-sport-lime/10 border-sport-lime/20' },
  { Icon: Star,     end: 49,    suffix: '/5', color: 'text-sport-orange', bg: 'bg-sport-orange/10 border-sport-orange/20', decimal: true },
]

function Counter({ end, suffix, decimal, active }: { end: number; suffix: string; decimal?: boolean; active: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    let startTime: number | null = null
    const duration = 1800

    function step(timestamp: number) {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(step)
      else setCount(end)
    }
    requestAnimationFrame(step)
  }, [active, end])

  const display = decimal ? (count / 10).toFixed(1) : count >= 1000 ? `${Math.floor(count / 1000)} ${String(count % 1000).padStart(3, '0')}` : String(count)

  return <>{display}{suffix}</>
}

export function ProofBar() {
  const t = useTranslations('home.proof')
  const labels = t.raw('stats') as { label: string; sublabel: string }[]
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <section aria-label={t('aria')} className="bg-sport-card border-y border-sport-border py-14 px-6 relative overflow-hidden">
      {/* subtle grid pattern */}
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px'}} />

      {/* Grille de stats en <div> (pas <dl>) : la structure animée (Tilt3D +
          motion.div + icône + sous-libellé) ne respecte pas les contraintes de
          contenu d'une liste de définition → on évite l'erreur a11y. */}
      <div className="max-w-6xl mx-auto relative" ref={ref}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {STAT_STYLE.map((stat, i) => (
            <Tilt3D key={labels[i].label} max={9} glare={false} className="relative">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center gap-1.5 group"
            >
              <div
                aria-hidden="true"
                className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${stat.bg}`}
              >
                <stat.Icon size={20} className={stat.color} />
              </div>
              <div className={`text-4xl font-black ${stat.color} tabular-nums`}>
                <Counter end={stat.end} suffix={stat.suffix} decimal={stat.decimal} active={inView} />
              </div>
              <div className="text-xs font-bold text-sport-fg uppercase tracking-widest mt-1">{labels[i].label}</div>
              <span className="text-[11px] text-sport-gray">{labels[i].sublabel}</span>
            </motion.div>
            </Tilt3D>
          ))}
        </div>
      </div>
    </section>
  )
}
