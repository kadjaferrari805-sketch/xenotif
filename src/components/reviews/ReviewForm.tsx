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
    if (rating < 1 || comment.trim().length < 10) { setError(t('error')); return }
    setLoading(true)
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-next-intl-locale': locale },
      body: JSON.stringify({ type, productId, rating, comment: comment.trim() }),
    })
    setLoading(false)
    if (res.ok) onPublished()
    else setError(t('error'))
  }

  return (
    <form onSubmit={submit} className="bg-sport-card border border-sport-border rounded-xl p-5 space-y-4">
      <div>
        <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">{t('ratingLabel')}</label>
        <StarRating value={rating} onChange={setRating} size={24} />
      </div>
      <div>
        <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">{t('commentLabel')}</label>
        <textarea value={comment} onChange={e => setComment(e.target.value)} rows={4}
          placeholder={t('commentPlaceholder')}
          className="w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-sport-orange placeholder:text-sport-gray" />
      </div>
      {error && <p role="alert" className="text-red-400 text-xs">{error}</p>}
      <button type="submit" disabled={loading}
        className="bg-sport-orange text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-orange-600 disabled:opacity-60 transition-all">
        {loading ? t('submitting') : t('submit')}
      </button>
    </form>
  )
}
