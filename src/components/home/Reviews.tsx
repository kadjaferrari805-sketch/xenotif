import { SectionHeader } from '@/components/ui/SectionHeader'
import { REVIEWS } from '@/lib/constants'

const AVATAR_COLORS: Record<string, string> = {
  teal: 'bg-primary',
  amber: 'bg-amber-500',
  violet: 'bg-violet-600',
}

export function Reviews() {
  return (
    <section id="reviews" className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Témoignages"
          title="Ce que disent nos clients"
          subtitle="Plus de 248 avis vérifiés · Note moyenne 4.9/5"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {REVIEWS.map(review => (
            <div key={review.name} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${AVATAR_COLORS[review.color]} rounded-full flex items-center justify-center font-bold text-white`}>
                  {review.initial}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{review.name}</p>
                  <p className="text-xs text-gray-400">{review.date}</p>
                </div>
              </div>
              <div className="text-amber-400 text-sm mb-2">{'★'.repeat(review.rating)}</div>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">{review.text}</p>
              <span className="inline-flex items-center gap-1 bg-primary-light text-primary text-[10px] font-bold px-2 py-1 rounded-lg">
                ✓ Achat vérifié
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
