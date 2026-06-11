'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const LOCALES = ['fr', 'en', 'de'] as const
type Locale = typeof LOCALES[number]
export type EditorLocale = { title: string; tag: string; description: string; statsText: string; levelsText: string; sectionsJson: string }
export type EditorInitial = { minPlan: string; byLocale: Record<Locale, EditorLocale>; videosJson: string }

const FIELD = 'w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sport-orange'

export function ContentEditor({ slug, initial }: { slug: string; initial: EditorInitial }) {
  const router = useRouter()
  const [minPlan, setMinPlan] = useState(initial.minPlan)
  const [byLocale, setByLocale] = useState(initial.byLocale)
  const [videosJson, setVideosJson] = useState(initial.videosJson)
  const [tab, setTab] = useState<Locale>('fr')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  function setField(l: Locale, k: keyof EditorLocale, v: string) {
    setByLocale(prev => ({ ...prev, [l]: { ...prev[l], [k]: v } }))
  }

  async function save() {
    setSaving(true); setMsg(null)
    const res = await fetch(`/api/admin/content/${slug}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ minPlan, byLocale, videosJson }),
    })
    const data = await res.json()
    setSaving(false)
    if (res.ok) { setMsg({ ok: true, text: 'Enregistré ✓' }); router.refresh() }
    else setMsg({ ok: false, text: data.error ?? 'Erreur' })
  }

  const L = byLocale[tab]
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-sport-gray mb-2">Accès (min_plan)</label>
        <select value={minPlan} onChange={e => setMinPlan(e.target.value)} className={FIELD}>
          <option value="free">free (gratuit)</option>
          <option value="pro">pro</option>
        </select>
      </div>

      <div className="flex gap-2">
        {LOCALES.map(l => (
          <button key={l} onClick={() => setTab(l)} className={`px-4 py-1.5 rounded-full text-xs font-bold border ${tab === l ? 'bg-sport-orange text-white border-sport-orange' : 'border-sport-border text-sport-gray'}`}>{l.toUpperCase()}</button>
        ))}
      </div>

      <div className="space-y-3">
        <input className={FIELD} placeholder="Titre" value={L.title} onChange={e => setField(tab, 'title', e.target.value)} />
        <input className={FIELD} placeholder="Tag" value={L.tag} onChange={e => setField(tab, 'tag', e.target.value)} />
        <textarea className={FIELD} rows={2} placeholder="Description" value={L.description} onChange={e => setField(tab, 'description', e.target.value)} />
        <textarea className={FIELD} rows={3} placeholder="Stats (une par ligne)" value={L.statsText} onChange={e => setField(tab, 'statsText', e.target.value)} />
        <textarea className={FIELD} rows={3} placeholder="Niveaux (un par ligne)" value={L.levelsText} onChange={e => setField(tab, 'levelsText', e.target.value)} />
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-sport-gray mb-2">Sections (JSON) — {tab}</label>
          <textarea className={`${FIELD} font-mono text-xs`} rows={14} value={L.sectionsJson} onChange={e => setField(tab, 'sectionsJson', e.target.value)} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-sport-gray mb-2">Vidéos (JSON)</label>
        <textarea className={`${FIELD} font-mono text-xs`} rows={10} value={videosJson} onChange={e => setVideosJson(e.target.value)} />
      </div>

      <div className="flex items-center gap-4">
        <button onClick={save} disabled={saving} className="bg-sport-orange text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-orange-600 disabled:opacity-60 transition-all">
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
        {msg && <span className={`text-sm font-semibold ${msg.ok ? 'text-emerald-400' : 'text-red-400'}`}>{msg.text}</span>}
      </div>
    </div>
  )
}
