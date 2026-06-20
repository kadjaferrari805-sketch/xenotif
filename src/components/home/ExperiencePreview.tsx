'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Eye, LayoutDashboard, TrendingUp, Trophy, Bot, Flame, Clock, CalendarCheck, Award } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Tilt3D } from '@/components/premium/Tilt3D'
import { XpLevelBar } from '@/components/gamification/XpLevelBar'
import { PREVIEW } from '@/lib/preview-data'

type Pillar = { title: string; desc: string }

const PILLAR_ICONS = [LayoutDashboard, TrendingUp, Trophy, Bot]

// Section « confiance avant inscription » : un aperçu réel de l'espace membre
// (niveau XP + stats + badges, données démo PREVIEW) qui prouve la valeur et
// pousse vers la démo interactive /dashboard-preview (sans compte).
export function ExperiencePreview() {
  const t = useTranslations('home.experience')
  const td = useTranslations('dashboardPreview')
  const pillars = t.raw('pillars') as Pillar[]

  const tiles = [
    { Icon: Flame, label: td('statSessions'), value: PREVIEW.stats.sessionsWeek, color: 'text-sport-orange' },
    { Icon: Clock, label: td('statHours'), value: `${PREVIEW.stats.hours}h`, color: 'text-sport-blue' },
    { Icon: CalendarCheck, label: td('statActiveDays'), value: PREVIEW.stats.activeDays, color: 'text-emerald-400' },
    { Icon: Award, label: td('statBadges'), value: PREVIEW.stats.badges, color: 'text-yellow-400' },
  ]

  return (
    <section aria-labelledby="home-experience" className="border-y border-sport-border bg-sport-card px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader id="home-experience" label={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Aperçu — cadre app premium avec effet 3D */}
          <Tilt3D className="relative rounded-3xl" max={8}>
            <div className="rounded-3xl border border-sport-border bg-sport-dark p-5 shadow-2xl shadow-black/40">
              <div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-sport-gray">
                <Eye size={13} className="text-sport-orange" aria-hidden="true" /> {t('previewLabel')}
              </div>
              <XpLevelBar
                xp={PREVIEW.gamification.xp}
                levelKey={PREVIEW.gamification.levelKey}
                xpInLevel={PREVIEW.gamification.xpInLevel}
                xpForNext={PREVIEW.gamification.xpForNext}
                compact
              />
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {tiles.map(({ Icon, label, value, color }) => (
                  <div key={label} className="rounded-xl border border-sport-border bg-sport-card p-3">
                    <Icon size={16} className={`${color} mb-1.5`} aria-hidden="true" />
                    <p className="text-xl font-black tabular-nums text-white">{value}</p>
                    <p className="text-[10px] leading-tight text-sport-gray">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center gap-3">
                {PREVIEW.badges.map((b) => (
                  <span
                    key={b.label}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-yellow-400/30 bg-yellow-400/10 text-xl"
                    title={b.label}
                    aria-hidden="true"
                  >
                    {b.icon}
                  </span>
                ))}
              </div>
            </div>
          </Tilt3D>

          {/* Piliers de l'expérience + CTA vers la démo */}
          <div>
            <ul className="space-y-5">
              {pillars.map((p, i) => {
                const Icon = PILLAR_ICONS[i]
                return (
                  <motion.li
                    key={p.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="flex gap-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sport-orange/30 bg-sport-orange/10">
                      <Icon size={18} className="text-sport-orange" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-black text-white">{p.title}</h3>
                      <p className="mt-0.5 text-sm leading-relaxed text-sport-gray">{p.desc}</p>
                    </div>
                  </motion.li>
                )
              })}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard-preview" className="btn-primary inline-flex items-center gap-2">
                {t('ctaDemo')} <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href="/auth/signup" className="btn-secondary">
                {t('ctaSignup')}
              </Link>
            </div>
            <p className="mt-3 flex items-center gap-2 text-xs text-sport-gray">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-sport-lime" />
              {t('note')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
