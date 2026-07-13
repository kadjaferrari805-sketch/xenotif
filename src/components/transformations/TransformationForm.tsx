'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Upload, CheckCircle } from 'lucide-react'

const INPUT = 'w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-2.5 text-sport-fg text-sm focus:outline-none focus:border-sport-orange placeholder:text-sport-gray'

export function TransformationForm() {
  const t = useTranslations('transformations')
  const [before, setBefore] = useState<File | null>(null)
  const [after, setAfter] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const [weeks, setWeeks] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const canSubmit = consent && before !== null && after !== null && !loading

  async function submit() {
    setError('')
    if (!consent) { setError(t('errConsent')); return }
    if (!before || !after) { setError(t('errImage')); return }
    setLoading(true)
    try {
      const fd = new FormData()
      fd.set('before', before); fd.set('after', after)
      fd.set('caption', caption); fd.set('weeks', weeks); fd.set('displayName', displayName)
      fd.set('consent', 'true')
      const res = await fetch('/api/transformations', { method: 'POST', body: fd })
      const data = await res.json().catch(() => ({}))
      if (data.ok) setDone(true)
      else setError(data.error === 'image' ? t('errImage') : data.error === 'consent' ? t('errConsent') : t('errServer'))
    } catch { setError(t('errServer')) }
    setLoading(false)
  }

  if (done) {
    return (
      <div className="bg-sport-card border border-emerald-500/30 rounded-2xl p-6 flex items-center gap-3">
        <CheckCircle size={20} className="text-emerald-400 shrink-0" aria-hidden="true" />
        <p className="text-sm text-sport-fg">{t('success')}</p>
      </div>
    )
  }

  return (
    <div className="bg-sport-card border border-sport-border rounded-2xl p-6">
      <h3 className="text-sm font-black text-sport-fg">{t('shareTitle')}</h3>
      <p className="text-xs text-sport-gray mt-1 mb-5">{t('shareSubtitle')}</p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {[{ label: t('beforeLabel'), file: before, set: setBefore }, { label: t('afterLabel'), file: after, set: setAfter }].map((f, i) => (
          <label key={i} className="cursor-pointer">
            <span className="block text-[11px] font-bold text-sport-fg mb-1.5 uppercase tracking-wider">{f.label}</span>
            <div className="aspect-[3/4] rounded-xl border border-dashed border-sport-border bg-sport-dark flex items-center justify-center overflow-hidden">
              {f.file
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={URL.createObjectURL(f.file)} alt={f.label} className="w-full h-full object-cover" />
                : <Upload size={20} className="text-sport-gray" aria-hidden="true" />}
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={e => f.set(e.target.files?.[0] ?? null)} />
          </label>
        ))}
      </div>
      <div className="space-y-3 mb-4">
        <input className={INPUT} placeholder={t('captionLabel')} value={caption} onChange={e => setCaption(e.target.value)} maxLength={280} />
        <div className="grid grid-cols-2 gap-3">
          <input className={INPUT} type="number" min="0" placeholder={t('weeksLabel')} value={weeks} onChange={e => setWeeks(e.target.value)} />
          <input className={INPUT} placeholder={t('nameLabel')} value={displayName} onChange={e => setDisplayName(e.target.value)} maxLength={40} />
        </div>
      </div>
      <label className="flex items-start gap-2.5 mb-4 cursor-pointer">
        <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5 accent-sport-orange" />
        <span className="text-xs text-sport-gray leading-relaxed">{t('consentLabel')}</span>
      </label>
      {error && <p role="alert" className="text-red-400 text-xs mb-3">{error}</p>}
      <button onClick={submit} disabled={!canSubmit}
        className="inline-flex items-center gap-2 bg-sport-orange text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-orange-600 disabled:opacity-50 transition-all">
        {loading ? t('sending') : t('submit')}
      </button>
    </div>
  )
}
