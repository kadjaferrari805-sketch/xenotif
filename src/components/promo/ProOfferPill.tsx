'use client'

import { Sparkles } from 'lucide-react'

// Upsell « essai Pro » pour la carte Gratuit, inspiré du pricing Higgsfield :
// highlight en gradient, prix barré → inclus, badge d'économie. Accent émeraude.
export function ProOfferPill({
  badge,
  headline,
  price,
  free,
  save,
  benefit,
}: {
  badge: string
  headline: string
  price: string
  free: string
  save: string
  benefit: string
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/45 bg-gradient-to-br from-emerald-500/[0.18] via-emerald-900/25 to-sport-card p-4 shadow-[0_0_30px_rgba(16,185,129,0.16)]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full bg-emerald-500/20 blur-2xl"
      />
      <div className="relative">
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[2px] text-emerald-300">
            <Sparkles size={12} aria-hidden="true" /> {badge}
          </span>
          <span className="shrink-0 rounded-full bg-emerald-400 px-2.5 py-0.5 text-[10px] font-black text-emerald-950">
            {save}
          </span>
        </div>
        <p className="text-[17px] font-black leading-tight text-white">{headline}</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-bold text-sport-gray line-through decoration-emerald-400/60">{price}</span>
          <span className="text-sm font-black text-emerald-300">{free}</span>
        </div>
        <p className="mt-2 text-[11px] leading-snug text-sport-gray">{benefit}</p>
      </div>
    </div>
  )
}
