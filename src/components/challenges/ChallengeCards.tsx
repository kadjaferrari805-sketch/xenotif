'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useInView } from 'react-intersection-observer'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Clock, Target, TrendingUp } from 'lucide-react'
import { CHALLENGES } from '@/lib/challenges'

type ChallengeText = { title: string; goal: string; duration: string; level: string; desc: string }

// Grille de cartes de défis, partagée par la section home et la page /defis.
// Structure (icône, couleur, lien) → CHALLENGES ; textes → home.challenges.items.
export function ChallengeCards() {
  const t = useTranslations('home.challenges')
  const items = t.raw('items') as ChallengeText[]
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {CHALLENGES.map((c, i) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className="group bg-sport-card border border-sport-border rounded-2xl p-6 flex flex-col hover:border-sport-orange/40 transition-colors"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-12 h-12 shrink-0 rounded-2xl border flex items-center justify-center text-2xl ${c.ring}`} aria-hidden="true">
              {c.emoji}
            </div>
            <div>
              <h3 className="text-lg font-black text-sport-fg">{items[i].title}</h3>
              <p className={`text-sm font-bold ${c.tint}`}>{items[i].goal}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-sport-dark border border-sport-border text-sport-gray">
              <Clock size={12} aria-hidden="true" /> {items[i].duration}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-sport-dark border border-sport-border text-sport-gray">
              <TrendingUp size={12} aria-hidden="true" /> {items[i].level}
            </span>
          </div>

          <p className="text-sm text-sport-gray leading-relaxed mb-5">{items[i].desc}</p>

          <Link
            href={c.href}
            className="mt-auto inline-flex items-center gap-2 text-sport-orange text-sm font-bold group-hover:gap-3 transition-all"
            aria-label={`${t('startChallenge')} — ${items[i].title}`}
          >
            <Target size={14} aria-hidden="true" /> {t('startChallenge')} <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
