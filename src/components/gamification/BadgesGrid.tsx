import { useTranslations } from 'next-intl'
import { CheckCircle } from 'lucide-react'
import type { Badge } from '@/lib/gamification'

export function BadgesGrid({ badges }: { badges: Badge[] }) {
  const t = useTranslations('gamification')
  return (
    <div className="bg-sport-card border border-sport-border rounded-2xl p-6">
      <h3 className="text-base font-black text-sport-fg mb-5">{t('badgesTitle')}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map(b => (
          <div key={b.id} className={`rounded-xl p-4 text-center border transition-all ${b.earned ? 'bg-yellow-400/10 border-yellow-400/30' : 'bg-sport-dark border-sport-border opacity-50'}`}>
            <span className="text-3xl block mb-2">{b.icon}</span>
            <p className={`text-[11px] font-black leading-tight ${b.earned ? 'text-yellow-400' : 'text-sport-gray'}`}>{t(`badges.${b.id}`)}</p>
            {b.earned && <CheckCircle size={12} className="text-emerald-400 mx-auto mt-2" aria-hidden="true" />}
          </div>
        ))}
      </div>
    </div>
  )
}
