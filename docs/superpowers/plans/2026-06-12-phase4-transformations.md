# Phase 4 « Transformations avant/après » — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** Pipeline de transformations avant/après envoyées par les clients (upload Storage + consentement + modération admin) avec galerie publique des éléments approuvés.

**Architecture :** Calqué sur le système d'avis (table RLS service-role, routes API, gate admin `admin_users`). Nouveauté : upload images vers Supabase Storage (bucket `transformations`). Galerie publique masquée si vide.

**Tech Stack :** Next 16 route handlers (Node), Supabase (Postgres + Storage), React, next-intl, Jest. Spec : `docs/superpowers/specs/2026-06-12-phase4-transformations-design.md`.

**⚠️ Setup manuel (utilisateur) requis avant que ça fonctionne en prod** : exécuter `supabase-transformations.sql` + créer le bucket Storage public `transformations` (Task 1).

---

## File Structure
| Fichier | Responsabilité | Action |
|---|---|---|
| `supabase-transformations.sql` | DDL + RLS (à exécuter manuellement) | Créer |
| `src/lib/transformations.ts` | validation image (pure) | Créer |
| `src/lib/transformations.test.ts` | tests validation | Créer |
| `src/app/api/transformations/route.ts` | GET public approuvés + POST upload | Créer |
| `src/app/api/admin/transformations/route.ts` | modération admin | Créer |
| `src/components/transformations/TransformationsGallery.tsx` | galerie publique | Créer |
| `src/components/transformations/TransformationForm.tsx` | formulaire d'envoi (membre) | Créer |
| `src/components/transformations/AdminTransformations.tsx` | modération | Créer |
| `*.test.tsx` | tests composants | Créer |
| `messages/{fr,en,de}.json` | namespace `transformations` | Modifier |
| `src/app/[locale]/page.tsx` | galerie sur l'accueil | Modifier |
| `src/app/[locale]/dashboard/progression/ProgressionClient.tsx` | bloc « partage ta transfo » | Modifier |
| `src/app/[locale]/admin/page.tsx` | modération admin | Modifier |

---

## Task 1 : Schéma SQL + bucket (setup manuel)

**Files:** Create `supabase-transformations.sql`

- [ ] **Step 1 — créer le SQL :** `supabase-transformations.sql`
```sql
-- ============================================================
-- XENOTIF® — Transformations avant/après (preuves sociales)
-- À EXÉCUTER dans Supabase → SQL Editor.
-- + Créer un bucket Storage PUBLIC nommé "transformations"
--   (Dashboard → Storage → New bucket → Public).
-- ============================================================
create table if not exists public.transformations (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null,
  display_name text,
  before_path  text not null,
  after_path   text not null,
  caption      text,
  weeks        int,
  consent      boolean not null default false,
  status       text not null default 'pending',   -- pending | approved | rejected
  created_at   timestamptz default now()
);
create index if not exists transformations_status_idx
  on public.transformations (status, created_at desc);

-- RLS : aucune policy publique → accès uniquement via service_role (routes API).
alter table public.transformations enable row level security;
```

- [ ] **Step 2 — commit (le SQL n'est pas exécuté automatiquement) :**
```bash
git add supabase-transformations.sql
git commit -m "feat(transformations): schéma SQL + RLS (setup manuel)"
```

---

## Task 2 : Validation (lib pure, TDD)

**Files:** Create `src/lib/transformations.ts`, `src/lib/transformations.test.ts`

- [ ] **Step 1 — test (échoue) :** `src/lib/transformations.test.ts`
```ts
import { validateImage, extFromType, MAX_IMAGE_BYTES } from './transformations'

describe('validateImage', () => {
  it('rejette l’absence de fichier', () => {
    expect(validateImage(null).reason).toBe('missing')
  })
  it('rejette un type non-image', () => {
    expect(validateImage({ type: 'application/pdf', size: 100 }).reason).toBe('type')
  })
  it('rejette > 5 Mo', () => {
    expect(validateImage({ type: 'image/jpeg', size: MAX_IMAGE_BYTES + 1 }).reason).toBe('size')
  })
  it('accepte une image valide', () => {
    expect(validateImage({ type: 'image/jpeg', size: 1000 }).ok).toBe(true)
  })
  it('déduit l’extension', () => {
    expect(extFromType('image/png')).toBe('png')
    expect(extFromType('image/jpeg')).toBe('jpg')
  })
})
```

- [ ] **Step 2 — run (échec) :** `npx jest src/lib/transformations.test.ts` → FAIL.

- [ ] **Step 3 — implémenter :** `src/lib/transformations.ts`
```ts
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export function validateImage(file: { type: string; size: number } | null): { ok: boolean; reason?: 'missing' | 'type' | 'size' } {
  if (!file) return { ok: false, reason: 'missing' }
  if (!file.type.startsWith('image/')) return { ok: false, reason: 'type' }
  if (file.size > MAX_IMAGE_BYTES) return { ok: false, reason: 'size' }
  return { ok: true }
}

export function extFromType(type: string): string {
  return type === 'image/png' ? 'png' : type === 'image/webp' ? 'webp' : 'jpg'
}

export type TransformationItem = {
  id: string; displayName: string | null; caption: string | null; weeks: number | null; beforeUrl: string; afterUrl: string
}
```

- [ ] **Step 4 — run (passe) :** `npx jest src/lib/transformations.test.ts` → PASS.

- [ ] **Step 5 — commit :**
```bash
git add src/lib/transformations.ts src/lib/transformations.test.ts
git commit -m "feat(transformations): validation image (pure, testée)"
```

---

## Task 3 : i18n

**Files:** Modify `messages/{fr,en,de}.json` (namespace `transformations`, inséré avant `"common"`).

- [ ] **Step 1 — insérer le namespace.** fr :
```json
"transformations": {
  "galleryTitle": "Ils l'ont fait", "gallerySubtitle": "De vraies transformations de membres Xenotif®.",
  "before": "Avant", "after": "Après", "weeks": "{weeks} semaines", "defaultName": "Membre Xenotif®",
  "shareTitle": "Partage ta transformation", "shareSubtitle": "Inspire la communauté avec ton avant/après.",
  "beforeLabel": "Photo avant", "afterLabel": "Photo après", "captionLabel": "Légende (optionnel)",
  "weeksLabel": "Durée (semaines)", "nameLabel": "Pseudo affiché (optionnel)",
  "consentLabel": "J'autorise XENOTIF® à publier mes photos (après modération).",
  "submit": "Envoyer", "sending": "Envoi…", "success": "Merci ! Ta transformation est en attente de validation.",
  "errConsent": "Le consentement est requis.", "errImage": "Ajoute deux photos (image, max 5 Mo).", "errServer": "Erreur. Réessaie.",
  "adminTitle": "Transformations — modération", "approve": "Approuver", "reject": "Rejeter", "adminEmpty": "Aucune transformation en attente."
}
```
en :
```json
"transformations": {
  "galleryTitle": "They did it", "gallerySubtitle": "Real transformations from Xenotif® members.",
  "before": "Before", "after": "After", "weeks": "{weeks} weeks", "defaultName": "Xenotif® member",
  "shareTitle": "Share your transformation", "shareSubtitle": "Inspire the community with your before/after.",
  "beforeLabel": "Before photo", "afterLabel": "After photo", "captionLabel": "Caption (optional)",
  "weeksLabel": "Duration (weeks)", "nameLabel": "Display name (optional)",
  "consentLabel": "I allow XENOTIF® to publish my photos (after moderation).",
  "submit": "Submit", "sending": "Sending…", "success": "Thanks! Your transformation is pending review.",
  "errConsent": "Consent is required.", "errImage": "Add two photos (image, max 5 MB).", "errServer": "Error. Try again.",
  "adminTitle": "Transformations — moderation", "approve": "Approve", "reject": "Reject", "adminEmpty": "No pending transformations."
}
```
de :
```json
"transformations": {
  "galleryTitle": "Sie haben es geschafft", "gallerySubtitle": "Echte Transformationen von Xenotif®-Mitgliedern.",
  "before": "Vorher", "after": "Nachher", "weeks": "{weeks} Wochen", "defaultName": "Xenotif®-Mitglied",
  "shareTitle": "Teile deine Transformation", "shareSubtitle": "Inspiriere die Community mit deinem Vorher/Nachher.",
  "beforeLabel": "Vorher-Foto", "afterLabel": "Nachher-Foto", "captionLabel": "Beschriftung (optional)",
  "weeksLabel": "Dauer (Wochen)", "nameLabel": "Anzeigename (optional)",
  "consentLabel": "Ich erlaube XENOTIF®, meine Fotos zu veröffentlichen (nach Prüfung).",
  "submit": "Senden", "sending": "Senden…", "success": "Danke! Deine Transformation wird geprüft.",
  "errConsent": "Zustimmung erforderlich.", "errImage": "Füge zwei Fotos hinzu (Bild, max. 5 MB).", "errServer": "Fehler. Erneut versuchen.",
  "adminTitle": "Transformationen — Moderation", "approve": "Freigeben", "reject": "Ablehnen", "adminEmpty": "Keine ausstehenden Transformationen."
}
```

- [ ] **Step 2 — valider JSON + commit :**
```bash
git add messages/fr.json messages/en.json messages/de.json
git commit -m "feat(transformations): i18n (fr/en/de)"
```

---

## Task 4 : API publique + upload `POST /api/transformations`

**Files:** Create `src/app/api/transformations/route.ts`

- [ ] **Step 1 — implémenter :**
```ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { validateImage, extFromType } from '@/lib/transformations'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const BUCKET = 'transformations'

// GET : transformations approuvées (public).
export async function GET() {
  const service = await createServiceClient()
  const { data, error } = await service.from('transformations')
    .select('id, display_name, before_path, after_path, caption, weeks')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(12)
  if (error) return NextResponse.json({ items: [] })
  const items = (data ?? []).map(r => ({
    id: r.id, displayName: r.display_name, caption: r.caption, weeks: r.weeks,
    beforeUrl: service.storage.from(BUCKET).getPublicUrl(r.before_path).data.publicUrl,
    afterUrl: service.storage.from(BUCKET).getPublicUrl(r.after_path).data.publicUrl,
  }))
  return NextResponse.json({ items })
}

// POST : envoi d'une transformation (connecté, multipart).
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'guest' }, { status: 401 })

    const form = await req.formData()
    const before = form.get('before') as File | null
    const after = form.get('after') as File | null
    const consent = form.get('consent') === 'true'
    const caption = ((form.get('caption') as string) ?? '').trim().slice(0, 280) || null
    const displayName = ((form.get('displayName') as string) ?? '').trim().slice(0, 40) || null
    const weeks = Math.min(520, Math.max(0, parseInt((form.get('weeks') as string) ?? '0') || 0)) || null

    if (!consent) return NextResponse.json({ error: 'consent' }, { status: 400 })
    if (!validateImage(before).ok || !validateImage(after).ok) return NextResponse.json({ error: 'image' }, { status: 400 })

    const service = await createServiceClient()
    const id = crypto.randomUUID()
    const beforePath = `${user.id}/${id}-before.${extFromType(before!.type)}`
    const afterPath = `${user.id}/${id}-after.${extFromType(after!.type)}`
    const ub = await service.storage.from(BUCKET).upload(beforePath, Buffer.from(await before!.arrayBuffer()), { contentType: before!.type })
    const ua = await service.storage.from(BUCKET).upload(afterPath, Buffer.from(await after!.arrayBuffer()), { contentType: after!.type })
    if (ub.error || ua.error) return NextResponse.json({ error: 'upload_failed' }, { status: 500 })

    const { error } = await service.from('transformations').insert({
      user_id: user.id, display_name: displayName, before_path: beforePath, after_path: afterPath,
      caption, weeks, consent: true, status: 'pending',
    })
    if (error) return NextResponse.json({ error: 'insert_failed' }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[POST /api/transformations]', e)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
```

- [ ] **Step 2 — typecheck :** `npx tsc --noEmit` → OK. **Commit :**
```bash
git add "src/app/api/transformations/route.ts"
git commit -m "feat(transformations): API GET approuvés + POST upload (Storage)"
```

---

## Task 5 : API admin `src/app/api/admin/transformations/route.ts`

**Files:** Create `src/app/api/admin/transformations/route.ts`

- [ ] **Step 1 — implémenter :**
```ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const BUCKET = 'transformations'

async function adminService() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const service = await createServiceClient()
  const { data: admin } = await service.from('admin_users').select('id').eq('id', user.id).single()
  return admin ? service : null
}

export async function GET() {
  const service = await adminService()
  if (!service) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const { data } = await service.from('transformations')
    .select('id, display_name, before_path, after_path, caption, weeks, created_at')
    .eq('status', 'pending').order('created_at', { ascending: false })
  const items = (data ?? []).map(r => ({
    id: r.id, displayName: r.display_name, caption: r.caption, weeks: r.weeks, createdAt: r.created_at,
    beforeUrl: service.storage.from(BUCKET).getPublicUrl(r.before_path).data.publicUrl,
    afterUrl: service.storage.from(BUCKET).getPublicUrl(r.after_path).data.publicUrl,
  }))
  return NextResponse.json({ items })
}

export async function POST(req: NextRequest) {
  const service = await adminService()
  if (!service) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const body = await req.json().catch(() => null) as { id?: string; status?: string } | null
  const status = body?.status === 'approved' || body?.status === 'rejected' ? body.status : null
  if (!body?.id || !status) return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  const { error } = await service.from('transformations').update({ status }).eq('id', body.id)
  if (error) return NextResponse.json({ error: 'update_failed' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 2 — typecheck + commit :**
```bash
git add "src/app/api/admin/transformations/route.ts"
git commit -m "feat(transformations): API admin (liste pending + modération)"
```

---

## Task 6 : Galerie publique + intégration accueil

**Files:** Create `src/components/transformations/TransformationsGallery.tsx`, `...test.tsx` ; Modify `src/app/[locale]/page.tsx`.

- [ ] **Step 1 — test (échoue) :** `src/components/transformations/TransformationsGallery.test.tsx`
```tsx
import { screen, waitFor } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { TransformationsGallery } from './TransformationsGallery'

afterEach(() => jest.restoreAllMocks())

it('ne rend rien si aucune transformation', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({ json: async () => ({ items: [] }) } as Response)
  const { container } = renderWithIntl(<TransformationsGallery />)
  await waitFor(() => expect(container.querySelector('section')).toBeNull())
})

it('rend une carte avant/après si une transformation', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({ json: async () => ({ items: [{ id: '1', displayName: 'Alex', caption: 'Top', weeks: 12, beforeUrl: 'b.jpg', afterUrl: 'a.jpg' }] }) } as Response)
  renderWithIntl(<TransformationsGallery />)
  await waitFor(() => expect(screen.getByText(/ils l'ont fait/i)).toBeInTheDocument())
  expect(screen.getByText('Alex')).toBeInTheDocument()
})
```

- [ ] **Step 2 — run (échec) :** `npx jest src/components/transformations/TransformationsGallery.test.tsx` → FAIL.

- [ ] **Step 3 — implémenter :** `src/components/transformations/TransformationsGallery.tsx`
```tsx
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
          <h2 className="text-3xl md:text-4xl font-black text-white">{t('galleryTitle')}</h2>
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
                <p className="text-sm font-bold text-white">{it.displayName ?? t('defaultName')}{it.weeks ? <span className="text-sport-orange font-black"> · {t('weeks', { weeks: it.weeks })}</span> : null}</p>
                {it.caption && <p className="text-xs text-sport-gray mt-1 leading-relaxed">{it.caption}</p>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4 — intégrer :** dans `src/app/[locale]/page.tsx`, importer `import { TransformationsGallery } from '@/components/transformations/TransformationsGallery'` et l'insérer **après `<CustomerReviews kind="platform" />`**.

- [ ] **Step 5 — run :** `npx jest src/components/transformations/TransformationsGallery.test.tsx` → PASS.

- [ ] **Step 6 — commit :**
```bash
git add src/components/transformations/TransformationsGallery.tsx src/components/transformations/TransformationsGallery.test.tsx "src/app/[locale]/page.tsx"
git commit -m "feat(transformations): galerie publique (masquée si vide) + accueil"
```

---

## Task 7 : Formulaire d'envoi + intégration espace membre

**Files:** Create `src/components/transformations/TransformationForm.tsx`, `...test.tsx` ; Modify `src/app/[locale]/dashboard/progression/ProgressionClient.tsx`.

- [ ] **Step 1 — test (échoue) :** `src/components/transformations/TransformationForm.test.tsx`
```tsx
import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { TransformationForm } from './TransformationForm'

it('le bouton d’envoi est désactivé sans consentement', () => {
  renderWithIntl(<TransformationForm />)
  expect(screen.getByRole('button', { name: /envoyer/i })).toBeDisabled()
})
```

- [ ] **Step 2 — run (échec) :** `npx jest src/components/transformations/TransformationForm.test.tsx` → FAIL.

- [ ] **Step 3 — implémenter :** `src/components/transformations/TransformationForm.tsx`
```tsx
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Upload, CheckCircle } from 'lucide-react'

const INPUT = 'w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sport-orange'

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
        <p className="text-sm text-white">{t('success')}</p>
      </div>
    )
  }

  return (
    <div className="bg-sport-card border border-sport-border rounded-2xl p-6">
      <h3 className="text-sm font-black text-white">{t('shareTitle')}</h3>
      <p className="text-xs text-sport-gray mt-1 mb-5">{t('shareSubtitle')}</p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {[{ label: t('beforeLabel'), file: before, set: setBefore }, { label: t('afterLabel'), file: after, set: setAfter }].map((f, i) => (
          <label key={i} className="cursor-pointer">
            <span className="block text-[11px] font-bold text-white mb-1.5 uppercase tracking-wider">{f.label}</span>
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
```

- [ ] **Step 4 — intégrer :** dans `ProgressionClient.tsx`, importer `import { TransformationForm } from '@/components/transformations/TransformationForm'` et l'insérer en bas du rendu (avant la dernière `</div>` du conteneur), avec un espacement (`<div className="mt-8"><TransformationForm /></div>`).

- [ ] **Step 5 — run :** `npx jest src/components/transformations/TransformationForm.test.tsx` → PASS.

- [ ] **Step 6 — commit :**
```bash
git add src/components/transformations/TransformationForm.tsx src/components/transformations/TransformationForm.test.tsx "src/app/[locale]/dashboard/progression/ProgressionClient.tsx"
git commit -m "feat(transformations): formulaire d'envoi (membre)"
```

---

## Task 8 : Modération admin

**Files:** Create `src/components/transformations/AdminTransformations.tsx` ; Modify `src/app/[locale]/admin/page.tsx`.

- [ ] **Step 1 — implémenter :** `src/components/transformations/AdminTransformations.tsx`
```tsx
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
      <h2 className="text-sm font-black text-white mb-5">{t('adminTitle')} ({items.length})</h2>
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
                <p className="text-sm font-bold text-white">{it.displayName ?? t('defaultName')}{it.weeks ? ` · ${t('weeks', { weeks: it.weeks })}` : ''}</p>
                {it.caption && <p className="text-xs text-sport-gray truncate">{it.caption}</p>}
              </div>
              <button onClick={() => moderate(it.id, 'approved')} aria-label={t('approve')} className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/25"><Check size={16} /></button>
              <button onClick={() => moderate(it.id, 'rejected')} aria-label={t('reject')} className="w-9 h-9 rounded-lg bg-red-500/15 text-red-400 flex items-center justify-center hover:bg-red-500/25"><X size={16} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2 — intégrer :** dans `src/app/[locale]/admin/page.tsx`, importer `import { AdminTransformations } from '@/components/transformations/AdminTransformations'` et l'ajouter après `<AdminReviews />`.

- [ ] **Step 3 — typecheck + commit :**
```bash
git add src/components/transformations/AdminTransformations.tsx "src/app/[locale]/admin/page.tsx"
git commit -m "feat(transformations): modération admin sur /admin"
```

---

## Task 9 : Vérification finale
- [ ] **Step 1 :** `npx jest` → tous verts.
- [ ] **Step 2 :** `npx tsc --noEmit` → OK.
- [ ] **Step 3 :** `npx eslint` sur les fichiers créés/modifiés → 0 erreur.
- [ ] **Step 4 :** JSON fr/en/de valides.
- [ ] **Step 5 :** skill `superpowers:finishing-a-development-branch` → PR, merge, déploiement. **Rappeler à l'utilisateur le setup manuel** (SQL + bucket `transformations`). Vérif live : `/api/transformations` (GET) renvoie `{ items: [] }` (200) ; l'accueil n'affiche PAS de section vide ; `/admin` montre le bloc modération (pour un admin).

---

## Self-Review (couverture spec)
- Livrable 1 (SQL/Storage) → Task 1. ✅
- Livrable 2 (API public+post, admin) → Tasks 4, 5. ✅
- Livrable 3 (Gallery, Form, AdminTransformations) → Tasks 6, 7, 8. ✅
- Livrable 4 (intégration accueil/membre/admin + i18n) → Tasks 3, 6, 7, 8. ✅
- Tests (validation, gallery hidden-if-empty, form consent) → Tasks 2, 6, 7. ✅
- Sécurité (RLS service-role, consentement obligatoire, pseudo défaut) → Tasks 1, 4. ✅
- Hors périmètre (pas de vidéo) respecté. ✅

Cohérence : `TransformationItem` (Task 2) consommé par la galerie (Task 6) ; bucket `transformations` constant dans les 2 routes ; `validateImage`/`extFromType` (Task 2) utilisés en Task 4 ; clés i18n `transformations.*` (Task 3) avant usage ; gate admin identique aux pages `/admin`.
