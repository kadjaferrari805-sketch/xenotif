'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { TransformationItem } from '@/lib/transformations'

export function TransformationsGallery() {
  const t = useTranslations('transformations')
  const [items, setItems] = useState<TransformationItem[] | null>(null)

  useEffect(() => {
    let alive = true
    fetch('/api/transformations').then(r => r.json()).then(d => { if (alive) setItems(d.items ?? []) }).catch(() => { if (alive) setItems([]) })
    return () => { alive = false }
  }, [])

  if (!items || items.length === 0) return null

  return (
    <section className="px-6 py-20 bg-sport-dark" aria-label={t('galleryTitle')}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-sport-fg">{t('galleryTitle')}</h2>
          <p className="text-sport-gray text-sm mt-3">{t('gallerySubtitle')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(it => (
            <figure key={it.id} className="bg-sport-card border border-sport-border rounded-2xl overflow-hidden">
              <div className="grid grid-cols-2">
                {[{ url: it.beforeUrl, label: t('before') }, { url: it.afterUrl, label: t('after') }].map((img, i) => (
                  <div key={i} className="relative aspect-[3/4] bg-sport-dark">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" loading="lazy" />
                    <span className="absolute top-2 left-2 text-[10px] font-black uppercase tracking-wider bg-black/60 text-white rounded px-2 py-0.5">{img.label}</span>
                  </div>
                ))}
              </div>
              <figcaption className="p-4">
                <p className="text-sm font-bold text-sport-fg">{it.displayName ?? t('defaultName')}{it.weeks ? <span className="text-sport-orange font-black"> · {t('weeks', { weeks: it.weeks })}</span> : null}</p>
                {it.caption && <p className="text-xs text-sport-gray mt-1 leading-relaxed">{it.caption}</p>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
