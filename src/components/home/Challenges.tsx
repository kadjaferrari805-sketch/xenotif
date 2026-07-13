'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import { ChallengeCards } from '@/components/challenges/ChallengeCards'

// Section home « Défis » — engagement/rétention (inspiré des challenges Strava).
// Objectifs guidés reliés aux programmes ; renvoie vers la page /defis.
export function Challenges() {
  const t = useTranslations('home.challenges')

  return (
    <section aria-labelledby="defis-title" className="py-24 px-6 bg-sport-dark">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[11px] font-black tracking-[3px] uppercase text-sport-orange mb-3">{t('eyebrow')}</p>
          <h2 id="defis-title" className="text-3xl md:text-5xl font-black text-sport-fg mb-4">{t('title')}</h2>
          <p className="text-lg text-sport-fg max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        <ChallengeCards />

        <div className="text-center mt-10">
          <Link href="/defis" className="inline-flex items-center gap-2 text-sm text-sport-orange hover:underline font-bold">
            {t('seeAll')} <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
