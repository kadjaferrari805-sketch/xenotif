'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Heart, Flame, Footprints, Moon, Activity, Watch } from 'lucide-react'

const METRIC_ICONS = [Heart, Flame, Footprints, Moon, Activity]
const DEVICES = ['Apple Watch', 'Garmin', 'Samsung Health', 'Google Health Connect']

export function DevicesSync() {
  const t = useTranslations('devicesSync')
  const metrics = t.raw('metrics') as string[]
  return (
    <section className="px-6 py-20 bg-sport-card border-y border-sport-border" aria-label={t('title')}>
      <motion.div className="max-w-5xl mx-auto" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-white">{t('title')}</h2>
          <p className="text-sport-gray text-sm mt-3 max-w-xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="bg-sport-dark border border-sport-border rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" /> {t('liveBadge')}
            </span>
            <span className="text-xs text-sport-gray">{t('liveSource')}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {metrics.map((m, i) => {
              const Icon = METRIC_ICONS[i] ?? Activity
              return (
                <div key={m} className="flex flex-col items-center text-center gap-2">
                  <span className="w-11 h-11 rounded-xl bg-sport-orange/10 border border-sport-orange/20 flex items-center justify-center">
                    <Icon size={18} className="text-sport-orange" aria-hidden="true" />
                  </span>
                  <span className="text-[11px] font-bold text-white leading-tight">{m}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-sport-gray text-center mb-4">{t('soonTitle')}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {DEVICES.map(d => (
              <div key={d} className="flex items-center gap-2.5 bg-sport-dark border border-sport-border rounded-xl px-4 py-3">
                <Watch size={16} className="text-sport-gray shrink-0" aria-hidden="true" />
                <span className="text-xs font-bold text-white flex-1">{d}</span>
                <span className="text-[9px] font-black uppercase text-sport-orange bg-sport-orange/10 rounded px-1.5 py-0.5">{t('soonTag')}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
