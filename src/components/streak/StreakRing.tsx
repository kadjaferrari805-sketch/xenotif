'use client'

import { useTranslations } from 'next-intl'
import type { StreakView } from '@/lib/streak/core'

const R = 52
const CIRC = 2 * Math.PI * R

export function StreakRing({ view, compact = false }: { view: StreakView; compact?: boolean }) {
  const t = useTranslations('streak')
  const { currentStreak, longestStreak, weeklyGoal, activeDaysThisWeek } = view
  const ratio = weeklyGoal > 0 ? Math.min(1, activeDaysThisWeek / weeklyGoal) : 0
  const offset = CIRC * (1 - ratio)
  const isEmpty = currentStreak === 0 && activeDaysThisWeek === 0

  return (
    <div className="bg-sport-card border border-sport-border rounded-2xl p-5 flex flex-col items-center gap-3">
      <div className="self-start text-[11px] uppercase tracking-wider text-sport-gray">{t('title')}</div>
      <svg width="132" height="132" viewBox="0 0 132 132" role="img" aria-label={t('title')}>
        <circle cx="66" cy="66" r={R} fill="none" stroke="#1E2028" strokeWidth="10" />
        <circle
          cx="66" cy="66" r={R} fill="none" stroke="#FF4500" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={CIRC} strokeDashoffset={offset} transform="rotate(-90 66 66)"
        />
        <text x="66" y="58" textAnchor="middle" fontSize="24">🔥</text>
        <text x="66" y="88" textAnchor="middle" fontSize="26" fill="#fff" fontWeight="800">{currentStreak}</text>
        <text x="66" y="106" textAnchor="middle" fontSize="11" fill="#8B929F">{t('weeks')}</text>
      </svg>
      {isEmpty ? (
        <p className="text-sm text-sport-gray text-center">{t('empty')}</p>
      ) : (
        <div className="text-[13px] text-sport-gray">
          {t('thisWeek')} <span className="text-white font-bold">{activeDaysThisWeek} / {weeklyGoal}</span>
          {' · '}{t('record')} <span className="text-white font-bold">{longestStreak}</span>
        </div>
      )}
      {!compact && view.freezesAvailable > 0 && (
        <div className="text-[12px] text-sport-gray" title={t('freezeTooltip')}>
          {t('freezes')}: {'❄️'.repeat(view.freezesAvailable)}
        </div>
      )}
    </div>
  )
}
