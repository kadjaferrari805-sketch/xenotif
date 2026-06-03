'use client'
import { useEffect, useState, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { StarRating } from './StarRating'
import { ReviewForm } from './ReviewForm'
import type { Review, ReviewType, Eligibility } from '@/lib/reviews/types'

interface Props { kind: ReviewType; productId?: string }

export function CustomerReviews({ kind, productId }: Props) {
  const t = useTranslations('reviews')
  const locale = useLocale()
  const [reviews, setReviews] = useState<Review[] | null>(null)
  const [elig, setElig] = useState<Eligibility | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [done, setDone] = useState(false)

  const qs = kind === 'product' ? `type=product&productId=${encodeURIComponent(productId ?? '')}` : 'type=platform'

  const load = useCallback(async () => {
    const r = await fetch(`/api/reviews?${qs}`).then(r => r.json()).catch(() => ({ reviews: [] }))
    setReviews(r.reviews ?? [])
  }, [qs])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    fetch(`/api/reviews/eligibility?${qs}`).then(r => r.json()).then(setElig).catch(() => setElig({ eligible: false, reason: 'guest' }))
  }, [qs])

  function onPublished() { setFormOpen(false); setDone(true); load() }

  const title = kind === 'product' ? t('productTitle') : t('platformTitle')

  return (
    <section className="py-8">
      <h2 className="text-lg font-black text-white mb-4">{title}{reviews ? ` (${reviews.length})` : ''}</h2>

      {reviews && reviews.length === 0 && <p className="text-sport-gray text-sm mb-4">{t('none')}</p>}

      <div className="space-y-4 mb-6">
        {(reviews ?? []).map((r) => (
          <div key={r.id} className="bg-sport-card border border-sport-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-bold text-white">{r.author_name}</span>
              <span className="text-[10px] font-bold text-emerald-400">{t('verified')}</span>
            </div>
            <StarRating value={r.rating} />
            <p className="text-sm text-sport-gray mt-2 leading-relaxed whitespace-pre-wrap">{r.comment}</p>
            <p className="text-[10px] text-sport-gray mt-2">{new Date(r.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR')}</p>
          </div>
        ))}
      </div>

      {done && <p className="text-emerald-400 text-sm font-semibold">{t('thanks')}</p>}

      {!done && elig && (
        elig.eligible ? (
          formOpen ? (
            <ReviewForm type={kind} productId={productId} initial={elig.existing} onPublished={onPublished} />
          ) : (
            <button onClick={() => setFormOpen(true)} className="bg-sport-orange text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-orange-600 transition-all">
              {elig.existing ? t('editReview') : t('leaveReview')}
            </button>
          )
        ) : (
          <p className="text-sport-gray text-xs">
            {elig.reason === 'guest' ? t('mustLogin') : elig.reason === 'not_subscriber' ? t('mustSubscribe') : t('mustBuy')}
          </p>
        )
      )}
    </section>
  )
}
