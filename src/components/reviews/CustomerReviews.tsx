'use client'
import { useEffect, useState, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { StarRating } from './StarRating'
import { ReviewForm } from './ReviewForm'
import { Carousel } from '@/components/ui/Carousel'
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

  useEffect(() => {
    let cancelled = false
    fetch(`/api/reviews?${qs}`).then(r => r.json()).catch(() => ({ reviews: [] }))
      .then(r => { if (!cancelled) setReviews(r.reviews ?? []) })
    return () => { cancelled = true }
  }, [qs])
  useEffect(() => {
    fetch(`/api/reviews/eligibility?${qs}`).then(r => r.json()).then(setElig).catch(() => setElig({ eligible: false, reason: 'guest' }))
  }, [qs])

  function onPublished() { setFormOpen(false); setDone(true); load() }

  const isPlatform = kind === 'platform'
  const empty = reviews !== null && reviews.length === 0
  const canReview = !!elig?.eligible

  // Pendant le chargement : ne rien afficher (évite un flash de section vide).
  if (reviews === null) return null
  // Aucun avis encore → on n'affiche RIEN au public (pas de section « aucun avis »).
  // Seul un utilisateur éligible (acheteur du guide / abonné) voit une invitation
  // à laisser le premier avis — sinon le CTA de l'email mènerait à une page sans formulaire.
  if (empty && !done && !canReview) return null

  const body = (
    <>
      {empty ? (
        !done && (
          <p className={`text-sm font-semibold text-sport-fg mb-4 ${isPlatform ? 'text-center' : ''}`}>{t('beFirst')}</p>
        )
      ) : isPlatform ? (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-sport-fg">{t('communityTitle')}</h2>
          <p className="text-sport-gray text-sm mt-1.5">{t('communitySubtitle')}</p>
        </div>
      ) : (
        <h2 className="text-lg font-black text-sport-fg mb-4">{t('productTitle')} ({reviews.length})</h2>
      )}

      {!empty && (() => {
        const cards = reviews.map((r) => (
          <div key={r.id} className={`bg-sport-card border border-sport-border rounded-xl p-4${isPlatform ? ' shrink-0 w-[300px] mr-4 self-stretch' : ''}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-bold text-sport-fg">{r.author_name}</span>
              <span className="text-[10px] font-bold text-[#1E7F5A]">{t('verified')}</span>
            </div>
            <StarRating value={r.rating} />
            <p className="text-sm text-sport-gray mt-2 leading-relaxed whitespace-pre-wrap">{r.comment}</p>
            <p className="text-[10px] text-sport-gray mt-2">{new Date(r.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR')}</p>
          </div>
        ))
        // Accueil (plateforme) : carrousel continu. Fiche produit : liste verticale.
        return isPlatform
          ? <div className="mb-6"><Carousel>{cards}</Carousel></div>
          : <div className="space-y-4 mb-6">{cards}</div>
      })()}

      <div className={isPlatform ? 'text-center' : ''}>
        {done && <p className="text-[#1E7F5A] text-sm font-semibold">{t('thanks')}</p>}

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
      </div>
    </>
  )

  // Variante plateforme (accueil) : le composant porte lui-même sa section décorative
  // (filet + espacement + fond) pour que TOUT disparaisse ensemble quand il n'y a pas
  // d'avis — sinon une bande vide resterait visible sur la page.
  if (isPlatform) {
    return (
      <section className="px-6 pb-16 bg-sport-dark">
        <div className="max-w-3xl mx-auto border-t border-sport-border pt-12">
          {body}
        </div>
      </section>
    )
  }

  // Variante produit (fiche) : porte aussi son propre séparateur, pour disparaître
  // entièrement (trait inclus) quand il n'y a pas encore d'avis.
  return <section className="pt-8 border-t border-sport-border">{body}</section>
}
