'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ReviewForm } from './ReviewForm'
import type { Eligibility } from '@/lib/reviews/types'

// Invitation à laisser un témoignage plateforme — affichée uniquement aux abonnés éligibles
// (dashboard). N'affiche PAS la liste des avis : c'est une simple incitation.
export function ReviewInvite() {
  const t = useTranslations('reviews')
  const [elig, setElig] = useState<Eligibility | null>(null)
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    fetch('/api/reviews/eligibility?type=platform')
      .then(r => r.json())
      .then(setElig)
      .catch(() => setElig({ eligible: false, reason: 'guest' }))
  }, [])

  if (!elig?.eligible) return null

  return (
    <div className="bg-gradient-to-br from-sport-orange/10 via-sport-card to-sport-card border border-sport-orange/20 rounded-2xl p-5">
      <p className="text-sm font-black text-white mb-1">{t('inviteTitle')}</p>
      <p className="text-xs text-sport-gray mb-4">{t('inviteSubtitle')}</p>
      {done ? (
        <p className="text-emerald-400 text-sm font-semibold">{t('thanks')}</p>
      ) : open ? (
        <ReviewForm type="platform" initial={elig.existing} onPublished={() => { setOpen(false); setDone(true) }} />
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-sport-orange text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-orange-600 transition-all"
        >
          {elig.existing ? t('editReview') : t('leaveReview')}
        </button>
      )}
    </div>
  )
}
