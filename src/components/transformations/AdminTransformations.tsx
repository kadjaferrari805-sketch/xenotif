'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Check, X } from 'lucide-react'

type Pending = { id: string; displayName: string | null; caption: string | null; weeks: number | null; beforeUrl: string; afterUrl: string }

export function AdminTransformations() {
  const t = useTranslations('transformations')
  const [items, setItems] = useState<Pending[]>([])

  function load() {
    fetch('/api/admin/transformations').then(r => r.json()).then(d => setItems(d.items ?? [])).catch(() => setItems([]))
  }
  useEffect(load, [])

  async function moderate(id: string, status: 'approved' | 'rejected') {
    await fetch('/api/admin/transformations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div className="mt-10 bg-sport-card border border-sport-border rounded-2xl p-6">
      <h2 className="text-sm font-black text-sport-fg mb-5">{t('adminTitle')} ({items.length})</h2>
      {items.length === 0 ? (
        <p className="text-sport-gray text-sm">{t('adminEmpty')}</p>
      ) : (
        <div className="space-y-4">
          {items.map(it => (
            <div key={it.id} className="flex items-center gap-4 bg-sport-dark border border-sport-border rounded-xl p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.beforeUrl} alt={t('before')} className="w-16 h-20 object-cover rounded-lg" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.afterUrl} alt={t('after')} className="w-16 h-20 object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-sport-fg">{it.displayName ?? t('defaultName')}{it.weeks ? ` · ${t('weeks', { weeks: it.weeks })}` : ''}</p>
                {it.caption && <p className="text-xs text-sport-gray truncate">{it.caption}</p>}
              </div>
              <button onClick={() => moderate(it.id, 'approved')} aria-label={t('approve')} className="w-9 h-9 rounded-lg bg-emerald-500/15 text-[#1E7F5A] flex items-center justify-center hover:bg-emerald-500/25"><Check size={16} /></button>
              <button onClick={() => moderate(it.id, 'rejected')} aria-label={t('reject')} className="w-9 h-9 rounded-lg bg-red-500/15 text-red-400 flex items-center justify-center hover:bg-red-500/25"><X size={16} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
