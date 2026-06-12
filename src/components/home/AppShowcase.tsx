'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Dumbbell, Apple, TrendingUp, Bot, WifiOff, ArrowRight, Smartphone } from 'lucide-react'
import { ActivityRings } from '@/components/dashboard/smartwatch/ActivityRings'

const FEATURE_ICONS = [Dumbbell, Apple, TrendingUp, Bot, WifiOff]

export function AppShowcase() {
  const t = useTranslations('appShowcase')
  const features = t.raw('features') as string[]
  const rings = [
    { value: 8420, max: 10000, color: '#FF4500', label: 'Pas', unit: 'pas' },
    { value: 612, max: 700, color: '#A3FF00', label: 'Calories', unit: 'kcal' },
    { value: 47, max: 60, color: '#2563EB', label: 'Minutes', unit: 'min' },
  ]
  return (
    <section className="px-6 py-20 bg-sport-dark overflow-hidden" aria-label={t('title')}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-sport-orange bg-sport-orange/10 border border-sport-orange/20 rounded-full px-3 py-1">
            <Smartphone size={12} aria-hidden="true" /> {t('badge')}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-4">{t('title')}</h2>
          <p className="text-sport-gray text-sm mt-3 max-w-md">{t('subtitle')}</p>
          <ul className="mt-6 space-y-3">
            {features.map((f, i) => {
              const Icon = FEATURE_ICONS[i] ?? Dumbbell
              return (
                <li key={f} className="flex items-center gap-3 text-sm text-white">
                  <span className="w-8 h-8 shrink-0 rounded-lg bg-sport-orange/10 border border-sport-orange/20 flex items-center justify-center">
                    <Icon size={15} className="text-sport-orange" aria-hidden="true" />
                  </span>
                  {f}
                </li>
              )
            })}
          </ul>
          <Link href="/app" className="inline-flex items-center gap-2 mt-8 bg-sport-orange text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-orange-600 transition-all">
            {t('cta')} <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30, rotate: 2 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="flex justify-center">
          <div className="relative w-[270px] rounded-[2.5rem] border-[10px] border-sport-border bg-sport-dark shadow-2xl shadow-sport-orange/10" style={{ aspectRatio: '9 / 19' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-sport-border rounded-b-2xl z-10" aria-hidden="true" />
            <div className="p-5 pt-8 h-full flex flex-col gap-4">
              <p className="text-white font-black text-sm tracking-wide">XENOTIF<span className="text-sport-orange text-[0.6em] align-super">®</span></p>
              <div className="flex justify-center"><ActivityRings rings={rings} size={130} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-sport-card border border-sport-border rounded-xl p-2.5">
                  <p className="text-lg font-black text-white">5</p>
                  <p className="text-[9px] text-sport-gray">{t('mockSessions')}</p>
                </div>
                <div className="bg-sport-card border border-sport-border rounded-xl p-2.5">
                  <p className="text-lg font-black text-sport-orange">920 XP</p>
                  <p className="text-[9px] text-sport-gray">{t('mockLevel')}</p>
                </div>
              </div>
              <div className="bg-sport-card border border-sport-border rounded-xl p-3 mt-auto">
                <div className="flex justify-between text-[9px] text-sport-gray mb-1"><span>{t('mockProgress')}</span><span className="text-sport-orange font-bold">72%</span></div>
                <div className="w-full bg-sport-dark rounded-full h-1.5"><div className="bg-sport-orange h-1.5 rounded-full" style={{ width: '72%' }} /></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
