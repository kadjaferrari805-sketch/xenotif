'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Flame, Clock, TrendingUp, Award, ArrowRight, ArrowLeft, Bot, Eye } from 'lucide-react'
import { ActivityRings } from '@/components/dashboard/smartwatch/ActivityRings'
import { WeeklyChart } from '@/components/dashboard/smartwatch/WeeklyChart'
import { PreviewWeightChart } from './PreviewWeightChart'
import { PreviewNutrition } from './PreviewNutrition'
import { XpLevelBar } from '@/components/gamification/XpLevelBar'
import { ChallengesCard } from '@/components/gamification/ChallengesCard'
import { PREVIEW } from '@/lib/preview-data'

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
}

export function PreviewDashboard() {
  const t = useTranslations('dashboardPreview')
  const stats = [
    { Icon: Flame, label: t('statSessions'), value: PREVIEW.stats.sessionsWeek, color: 'text-sport-orange' },
    { Icon: Clock, label: t('statHours'), value: `${PREVIEW.stats.hours}h`, color: 'text-sport-blue' },
    { Icon: TrendingUp, label: t('statActiveDays'), value: PREVIEW.stats.activeDays, color: 'text-[#1E7F5A]' },
    { Icon: Award, label: t('statBadges'), value: PREVIEW.stats.badges, color: 'text-yellow-400' },
  ]
  return (
    <div className="min-h-screen bg-sport-dark text-sport-fg">
      {/* Bannière aperçu — le lien retour était en absolute left-6 avec le texte
          centré sur toute la largeur : sur mobile les deux se chevauchaient.
          Sous sm : ligne unique, lien retour à gauche / badge à droite (justify-between).
          Texte plus petit + whitespace-nowrap sous sm : à 12px les deux blocs
          (~357px) dépassaient la largeur dispo sur un vrai téléphone (~343-358px
          à 375-390px), ce qui les faisait passer chacun sur 2 lignes.
          demo-banner-safe (padding-top + safe-area-inset-top) : la page est en
          viewport-fit=cover (edge-to-edge), donc sans ça la bannière démarre sous
          l'encoche/Dynamic Island au lieu d'en dessous.
          À partir de sm : lien en absolute à gauche, badge centré sur toute la largeur. */}
      <div className="bg-sport-orange/10 border-b border-sport-orange/30 px-3 sm:px-6 pb-2.5 demo-banner-safe flex flex-row items-center justify-between sm:justify-center gap-1 sm:gap-0 sm:relative">
        <Link
          href="/"
          className="sm:absolute sm:left-6 inline-flex items-center gap-1 sm:gap-1.5 whitespace-nowrap text-[10px] sm:text-xs font-bold text-sport-orange hover:opacity-80 transition-opacity"
        >
          <ArrowLeft size={11} className="sm:hidden" aria-hidden="true" />
          <ArrowLeft size={13} className="hidden sm:block" aria-hidden="true" />
          {t('backToHome')}
        </Link>
        <span className="inline-flex items-center gap-1 sm:gap-2 whitespace-nowrap text-[10px] sm:text-xs font-bold text-sport-orange">
          <Eye size={11} className="sm:hidden" aria-hidden="true" />
          <Eye size={13} className="hidden sm:block" aria-hidden="true" />
          {t('demoBanner')}
        </span>
      </div>

      <div className="max-w-5xl mx-auto p-6 md:p-8 pb-20">
        <motion.div {...reveal} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black">{t('greeting', { name: PREVIEW.name })}</h1>
          <p className="text-sport-gray text-sm mt-1">{t('subtitle')}</p>
        </motion.div>

        <motion.div {...reveal} className="mb-8">
          <XpLevelBar xp={PREVIEW.gamification.xp} levelKey={PREVIEW.gamification.levelKey} xpInLevel={PREVIEW.gamification.xpInLevel} xpForNext={PREVIEW.gamification.xpForNext} />
        </motion.div>

        <motion.div {...reveal} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-sport-card border border-sport-border rounded-2xl p-6 flex items-center justify-center">
            <ActivityRings rings={PREVIEW.rings.map(r => ({ ...r }))} size={220} />
          </div>
          <div className="bg-sport-card border border-sport-border rounded-2xl p-6">
            <h3 className="text-sm font-black mb-4">{t('weekActivity')}</h3>
            <WeeklyChart data={PREVIEW.weekly.map(d => ({ ...d }))} metric="steps" color="#FF4500" />
          </div>
        </motion.div>

        <motion.div {...reveal} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(({ Icon, label, value, color }) => (
            <div key={label} className="bg-sport-card border border-sport-border rounded-xl p-4">
              <Icon size={18} className={`${color} mb-2`} aria-hidden="true" />
              <p className="text-2xl font-black">{value}</p>
              <p className="text-[11px] text-sport-gray mt-0.5 leading-tight">{label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div {...reveal} className="bg-sport-card border border-sport-border rounded-2xl p-6 mb-8">
          <h3 className="text-sm font-black mb-5">{t('byDiscipline')}</h3>
          <div className="space-y-4">
            {PREVIEW.disciplines.map(d => (
              <div key={d.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold">{d.name}</span>
                  <span className="text-sport-orange font-bold">{d.pct}%</span>
                </div>
                <div className="w-full bg-sport-dark rounded-full h-2">
                  <div className="bg-sport-orange h-2 rounded-full" style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...reveal} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <PreviewWeightChart points={[...PREVIEW.weight.points]} unit={PREVIEW.weight.unit} goal={PREVIEW.weight.goal} />
          <PreviewNutrition {...PREVIEW.nutrition} />
        </motion.div>

        <motion.div {...reveal} className="bg-sport-card border border-sport-border rounded-2xl p-6 mb-8">
          <h3 className="text-sm font-black mb-5">{t('badges')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PREVIEW.badges.map(b => (
              <div key={b.label} className="rounded-xl p-4 text-center bg-yellow-400/10 border border-yellow-400/30">
                <span className="text-3xl block mb-2">{b.icon}</span>
                <p className="text-[10px] font-black text-yellow-400 leading-tight">{b.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...reveal} className="mb-8">
          <ChallengesCard titleKey="weeklyTitle" challenges={[...PREVIEW.gamification.weekly]} />
        </motion.div>

        <motion.div {...reveal} className="bg-gradient-to-br from-sport-orange/20 via-sport-card to-sport-card border border-sport-orange/30 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-sport-orange/15 border border-sport-orange/30 flex items-center justify-center mb-3">
            <Bot size={22} className="text-sport-orange" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-black">{t('ctaTitle')}</h3>
          <p className="text-sport-gray text-sm mt-1 mb-5 max-w-md mx-auto">{t('ctaSubtitle')}</p>
          <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-sport-orange text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-orange-600 transition-all">
            {t('ctaButton')} <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
