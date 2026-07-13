'use client'
import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { StarRating } from './StarRating'
import type { ReviewType } from '@/lib/reviews/types'

interface Props {
  type: ReviewType
  productId?: string
  initial?: { rating: number; comment: string } | null
  onPublished: () => void
}

export function ReviewForm({ type, productId, initial, onPublished }: Props) {
  const t = useTranslations('reviews')
  const locale = useLocale()
  const [rating, setRating] = useState(initial?.rating ?? 0)
  const [comment, setComment] = useState(initial?.comment ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    // Validation côté client avec message précis (sinon le client ne sait pas pourquoi ça bloque).
    if (rating < 1) { setError(t('errorRating')); return }
    if (comment.trim().length < 10) { setError(t('errorLength')); return }
    setLoading(true)
    let res: Response
    try {
      res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-next-intl-locale': locale },
        body: JSON.stringify({ type, productId, rating, comment: comment.trim() }),
      })
    } catch {
      setLoading(false)
      setError(t('error'))
      return
    }
    setLoading(false)
    if (res.ok) { onPublished(); return }
    // Affiche le motif précis renvoyé par l'API plutôt qu'un message générique.
    const data = await res.json().catch(() => null) as { error?: string } | null
    const code = data?.error
    setError(
      code === 'not_subscriber' ? t('mustSubscribe')
        : code === 'not_buyer' || code === 'invalid_product' ? t('mustBuy')
        : code === 'guest' ? t('mustLogin')
        : code === 'comment_too_short' ? t('errorLength')
        : code === 'bad_rating' ? t('errorRating')
        : t('error'),
    )
  }

  return (
    <form onSubmit={submit} className="bg-sport-card border border-sport-border rounded-xl p-5 space-y-4">
      <div>
        <label className="block text-xs font-bold text-sport-fg mb-2 uppercase tracking-wider">{t('ratingLabel')}</label>
        <StarRating value={rating} onChange={setRating} size={24} />
      </div>
      <div>
        <label className="block text-xs font-bold text-sport-fg mb-2 uppercase tracking-wider">{t('commentLabel')}</label>
        <textarea value={comment} onChange={e => setComment(e.target.value)} rows={4}
          placeholder={t('commentPlaceholder')}
          className="w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-3 text-sport-fg text-sm resize-none focus:outline-none focus:border-sport-orange placeholder:text-sport-gray" />
      </div>
      {error && <p role="alert" className="text-red-400 text-xs">{error}</p>}
      <button type="submit" disabled={loading}
        className="bg-sport-orange text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-orange-600 disabled:opacity-60 transition-all">
        {loading ? t('submitting') : t('submit')}
      </button>
    </form>
  )
}
