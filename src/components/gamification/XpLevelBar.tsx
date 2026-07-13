'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Zap } from 'lucide-react'

export function XpLevelBar({ xp, levelKey, xpInLevel, xpForNext, compact = false }: { xp: number; levelKey: string; xpInLevel: number; xpForNext: number | null; compact?: boolean }) {
  const t = useTranslations('gamification')
  const pct = xpForNext ? Math.min(100, Math.round((xpInLevel / xpForNext) * 100)) : 100
  return (
    <div className={`bg-sport-card border border-sport-border rounded-2xl ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-sport-orange/15 border border-sport-orange/30 flex items-center justify-center">
            <Zap size={16} className="text-sport-orange" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-sport-gray leading-none">{t('level')}</p>
            <p className="text-base font-black text-sport-fg leading-tight">{t(`levels.${levelKey}`)}</p>
          </div>
        </div>
        <span className="text-sm font-black text-sport-orange tabular-nums">{xp} {t('xp')}</span>
      </div>
      <div className="w-full bg-sport-dark rounded-full h-2 overflow-hidden">
        <motion.div className="bg-sport-orange h-2 rounded-full" initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} />
      </div>
      {xpForNext && (
        <p className="text-[11px] text-sport-gray mt-1.5 text-right">{xpInLevel}/{xpForNext} {t('xp')} · {t('nextLevel')}</p>
      )}
    </div>
  )
}
