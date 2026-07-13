import { useTranslations } from 'next-intl'
import { CheckCircle } from 'lucide-react'
import type { Challenge } from '@/lib/gamification'

export function ChallengesCard({ titleKey, challenges }: { titleKey: 'weeklyTitle' | 'monthlyTitle'; challenges: Challenge[] }) {
  const t = useTranslations('gamification')
  return (
    <div className="bg-sport-card border border-sport-border rounded-2xl p-6">
      <h3 className="text-sm font-black text-sport-fg mb-4">{t(titleKey)}</h3>
      <div className="space-y-4">
        {challenges.map(c => {
          const pct = Math.min(100, Math.round((c.current / c.target) * 100))
          const done = c.current >= c.target
          return (
            <div key={c.id}>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-sport-gray">{t(`challenges.${c.id}`, { current: c.current, target: c.target })}</span>
                {done && <span className="inline-flex items-center gap-1 text-emerald-400 font-bold"><CheckCircle size={11} aria-hidden="true" /> {t('done')}</span>}
              </div>
              <div className="w-full bg-sport-dark rounded-full h-1.5">
                <div className={`${done ? 'bg-emerald-400' : 'bg-sport-orange'} h-1.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
