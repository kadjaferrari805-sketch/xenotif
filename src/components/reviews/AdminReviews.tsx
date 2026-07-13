'use client'
import { useEffect, useState } from 'react'
import { StarRating } from './StarRating'
import type { Review } from '@/lib/reviews/types'

export function AdminReviews() {
  const [items, setItems] = useState<Review[]>([])
  const load = () => fetch('/api/admin/reviews').then(r => r.json()).then(d => setItems(d.reviews ?? [])).catch(() => {})
  useEffect(() => { load() }, [])

  async function toggle(id: string, hidden: boolean) {
    await fetch('/api/admin/reviews', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, hidden: !hidden }) })
    load()
  }
  async function remove(id: string) {
    await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="bg-sport-card border border-sport-border rounded-2xl p-6 mt-8">
      <h2 className="text-sm font-black text-sport-fg mb-4">Avis clients ({items.length})</h2>
      <div className="space-y-3">
        {items.map((r) => (
          <div key={r.id} className={`border rounded-xl p-4 ${r.hidden ? 'border-red-500/30 opacity-60' : 'border-sport-border'}`}>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-sport-fg">{r.author_name} · {r.type === 'product' ? r.product_id : 'plateforme'}</span>
              <StarRating value={r.rating} />
            </div>
            <p className="text-sm text-sport-gray mt-2 whitespace-pre-wrap">{r.comment}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => toggle(r.id, r.hidden)} className="text-xs border border-sport-border px-3 py-1.5 rounded-full text-sport-gray hover:text-sport-fg transition-colors">
                {r.hidden ? 'Afficher' : 'Masquer'}
              </button>
              <button onClick={() => remove(r.id)} className="text-xs border border-red-500/30 px-3 py-1.5 rounded-full text-red-400 hover:bg-red-500/10 transition-colors">
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sport-gray text-sm">Aucun avis pour l&apos;instant.</p>}
      </div>
    </div>
  )
}
