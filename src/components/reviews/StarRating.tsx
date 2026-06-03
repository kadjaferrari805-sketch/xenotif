'use client'
import { useTranslations } from 'next-intl'
import { Star } from 'lucide-react'

export function StarRating({ value, onChange, size = 16 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  const t = useTranslations('reviews')
  const interactive = !!onChange
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value
        const cls = `${filled ? 'fill-sport-orange text-sport-orange' : 'fill-sport-border text-sport-border'}`
        return interactive ? (
          <button key={n} type="button" onClick={() => onChange!(n)} aria-label={t('starAria', { n })} className="transition-transform hover:scale-110">
            <Star size={size} className={cls} />
          </button>
        ) : (
          <Star key={n} size={size} className={cls} aria-hidden="true" />
        )
      })}
    </div>
  )
}
