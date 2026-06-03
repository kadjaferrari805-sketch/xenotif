# Avis clients — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permettre aux acheteurs vérifiés de laisser un avis (★ + commentaire) sur les guides digitaux (avis produit) et sur la plateforme (témoignage), affiché en complément du statique, avec modération admin a posteriori.

**Architecture:** Table Supabase `reviews` (accès via service-role uniquement, comme `boutique_orders`). Routes API Next (`/api/reviews`, `/api/reviews/eligibility`, `/api/admin/reviews`) pour lecture/écriture/admin avec vérification serveur (connecté + achat/abonnement). Affichage via composant **client** `CustomerReviews` qui charge les avis au montage → les pages accueil/boutique restent en SSG. i18n fr+en pour l'UI ; commentaires non traduits.

**Tech Stack:** Next.js 16 App Router, Supabase (auth + Postgres, clients `createClient`/`createServiceClient`), next-intl, Tailwind, lucide-react.

**Vérification (convention du repo, pas de jest sur ce périmètre):** chaque tâche se valide par `npx tsc --noEmit`, `npm run build`, `curl` des routes, inspection du HTML prérendu, et le script de parité FR/EN. Commits fréquents.

**Pré-requis branche:** travailler sur `feat-customer-reviews`. ⚠️ Cette branche a été créée avant la PR #12 (fix Nav/Amazon). Avant de toucher `ProductDetail.tsx` / `products.ts` (Tâches 7–8), **rebaser/merger `main` à jour** pour récupérer les correctifs et éviter les conflits :
```bash
git fetch origin && git merge origin/main   # résoudre si besoin, puis continuer
```

---

## Structure des fichiers

| Fichier | Rôle |
|---|---|
| `supabase-reviews.sql` *(create)* | Migration : table `reviews` + index + RLS |
| `src/lib/reviews/types.ts` *(create)* | Type `Review`, `ReviewType`, `EligibilityReason` |
| `src/lib/reviews/eligibility.ts` *(create)* | `checkEligibility()` serveur (abonnement / achat digital) |
| `src/app/api/reviews/route.ts` *(create)* | `GET` liste (non masqués) + `POST` create/upsert |
| `src/app/api/reviews/eligibility/route.ts` *(create)* | `GET` éligibilité de la session courante |
| `src/app/api/admin/reviews/route.ts` *(create)* | `GET` tous + `PATCH` masquer + `DELETE` |
| `src/components/reviews/StarRating.tsx` *(create)* | Étoiles (affichage + saisie) |
| `src/components/reviews/ReviewForm.tsx` *(create)* | Formulaire (★ + commentaire) |
| `src/components/reviews/CustomerReviews.tsx` *(create)* | Orchestrateur client (liste + form) |
| `messages/{fr,en}.json` *(modify)* | Namespace `reviews` |
| `src/app/[locale]/boutique/[slug]/ProductDetail.tsx` *(modify)* | Section avis pour produits `digital` |
| `src/app/[locale]/page.tsx` *(modify)* | Bloc témoignages réels sous la section Reviews |
| `src/app/[locale]/admin/page.tsx` *(modify)* | Section gestion des avis (ou sous-composant client) |

---

## Task 1 : Migration SQL `reviews`

**Files:**
- Create: `supabase-reviews.sql`

- [ ] **Step 1: Écrire la migration**

```sql
-- ════════════════════════════════════════════════════════
-- Xenotif® — Avis clients (avis produit digital + témoignage plateforme)
-- À exécuter dans Supabase → SQL Editor
-- ════════════════════════════════════════════════════════

create table if not exists public.reviews (
  id           uuid primary key default gen_random_uuid(),
  type         text not null check (type in ('platform','product')),
  product_id   text,                          -- ex. 'd1' ; null pour 'platform'
  user_id      uuid not null,                 -- auth.users.id
  author_name  text not null,
  rating       int  not null check (rating between 1 and 5),
  comment      text not null,
  locale       text not null default 'fr',
  hidden       boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- 1 avis par client et par cible (modifiable) — index partiels (gèrent le null)
create unique index if not exists uniq_review_product
  on public.reviews (user_id, product_id) where type = 'product';
create unique index if not exists uniq_review_platform
  on public.reviews (user_id) where type = 'platform';

-- Lecture rapide par cible
create index if not exists idx_reviews_product on public.reviews (product_id) where type = 'product';

-- RLS : accès uniquement via service_role (les routes API). Aucune policy publique.
alter table public.reviews enable row level security;
```

- [ ] **Step 2: Valider la syntaxe**

Relire le fichier. (L'utilisateur l'exécutera dans Supabase ; noter dans le récap final qu'il est REQUIS.)

- [ ] **Step 3: Commit**

```bash
git add supabase-reviews.sql
git commit -m "feat(reviews): migration SQL table reviews"
```

---

## Task 2 : Types partagés

**Files:**
- Create: `src/lib/reviews/types.ts`

- [ ] **Step 1: Écrire les types**

```ts
export type ReviewType = 'platform' | 'product'

export interface Review {
  id: string
  type: ReviewType
  product_id: string | null
  user_id: string
  author_name: string
  rating: number
  comment: string
  locale: string
  hidden: boolean
  created_at: string
}

export type EligibilityReason = 'ok' | 'guest' | 'not_subscriber' | 'not_buyer' | 'invalid_product'

export interface Eligibility {
  eligible: boolean
  reason: EligibilityReason
  authorName?: string
  existing?: Pick<Review, 'rating' | 'comment'> | null
}
```

- [ ] **Step 2: tsc**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: exit 0

- [ ] **Step 3: Commit**

```bash
git add src/lib/reviews/types.ts
git commit -m "feat(reviews): types partagés"
```

---

## Task 3 : Helper d'éligibilité (serveur)

**Files:**
- Create: `src/lib/reviews/eligibility.ts`

Dépend de : `createServiceClient` (`src/lib/supabase/server.ts`), `getProductById` (`src/lib/boutique/products`).

- [ ] **Step 1: Écrire le helper**

```ts
import type { SupabaseClient } from '@supabase/supabase-js'
import { getProductById } from '@/lib/boutique/products'
import type { ReviewType, Eligibility } from './types'

// Vérifie qu'un utilisateur connecté a le droit de laisser un avis.
// - product : doit avoir acheté ce guide digital (boutique_orders) ; le produit doit être de type 'digital'.
// - platform : doit avoir un abonnement actif/trialing.
export async function checkEligibility(
  service: SupabaseClient,
  user: { id: string; email?: string | null },
  type: ReviewType,
  productId: string | null,
): Promise<Eligibility> {
  // Nom affiché depuis le profil (fallback email)
  const { data: profile } = await service.from('profiles').select('full_name').eq('id', user.id).maybeSingle()
  const authorName = (profile?.full_name?.trim() || (user.email ?? '').split('@')[0] || 'Client')

  if (type === 'platform') {
    const { data: sub } = await service
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing'])
      .maybeSingle()
    return sub
      ? { eligible: true, reason: 'ok', authorName }
      : { eligible: false, reason: 'not_subscriber', authorName }
  }

  // type === 'product'
  const product = productId ? getProductById(productId) : undefined
  if (!product || product.type !== 'digital') {
    return { eligible: false, reason: 'invalid_product', authorName }
  }
  const email = (user.email ?? '').toLowerCase()
  if (!email) return { eligible: false, reason: 'not_buyer', authorName }
  const { data: order } = await service
    .from('boutique_orders')
    .select('id')
    .eq('email', email)
    .contains('product_ids', [productId])
    .limit(1)
    .maybeSingle()
  return order
    ? { eligible: true, reason: 'ok', authorName }
    : { eligible: false, reason: 'not_buyer', authorName }
}
```

- [ ] **Step 2: tsc**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: exit 0 (si `getProductById` n'existe pas, vérifier le nom exact dans `src/lib/boutique/products.ts` — il existe : `export function getProductById`).

- [ ] **Step 3: Commit**

```bash
git add src/lib/reviews/eligibility.ts
git commit -m "feat(reviews): helper éligibilité (achat/abonnement)"
```

---

## Task 4 : Route API `/api/reviews` (GET liste + POST upsert)

**Files:**
- Create: `src/app/api/reviews/route.ts`

- [ ] **Step 1: Écrire la route**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { checkEligibility } from '@/lib/reviews/eligibility'
import type { ReviewType } from '@/lib/reviews/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function parseType(v: string | null): ReviewType | null {
  return v === 'platform' || v === 'product' ? v : null
}

// GET : liste des avis non masqués pour une cible
export async function GET(req: NextRequest) {
  const type = parseType(req.nextUrl.searchParams.get('type'))
  const productId = req.nextUrl.searchParams.get('productId')
  if (!type) return NextResponse.json({ error: 'bad_type' }, { status: 400 })
  if (type === 'product' && !productId) return NextResponse.json({ error: 'missing_product' }, { status: 400 })

  const service = await createServiceClient()
  let q = service.from('reviews')
    .select('id, type, product_id, author_name, rating, comment, locale, created_at')
    .eq('type', type)
    .eq('hidden', false)
    .order('created_at', { ascending: false })
    .limit(50)
  if (type === 'product') q = q.eq('product_id', productId)
  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ reviews: data ?? [] })
}

// POST : créer/mettre à jour son avis (1 par client/cible)
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null) as
    { type?: string; productId?: string | null; rating?: number; comment?: string } | null
  const type = parseType(body?.type ?? null)
  const productId = type === 'product' ? (body?.productId ?? null) : null
  const rating = Number(body?.rating)
  const comment = (body?.comment ?? '').trim()

  if (!type) return NextResponse.json({ error: 'bad_type' }, { status: 400 })
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return NextResponse.json({ error: 'bad_rating' }, { status: 400 })
  if (comment.length < 10) return NextResponse.json({ error: 'comment_too_short' }, { status: 400 })
  if (type === 'product' && !productId) return NextResponse.json({ error: 'missing_product' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'guest' }, { status: 401 })

  const service = await createServiceClient()
  const elig = await checkEligibility(service, user, type, productId)
  if (!elig.eligible) return NextResponse.json({ error: elig.reason }, { status: 403 })

  // Remplace l'avis existant (1 par client/cible) : delete + insert.
  // Approche robuste qui ne dépend pas d'une contrainte `onConflict` nommée
  // (la Task 1 utilise des index partiels, mal adaptés à l'upsert Supabase).
  let del = service.from('reviews').delete().eq('user_id', user.id).eq('type', type)
  if (type === 'product' && productId) del = del.eq('product_id', productId)
  await del
  const { data, error } = await service.from('reviews').insert({
    type, product_id: productId, user_id: user.id,
    author_name: elig.authorName ?? 'Client',
    rating, comment,
    locale: req.headers.get('x-next-intl-locale') ?? 'fr',
  }).select('id, type, product_id, author_name, rating, comment, locale, created_at').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ review: data })
}
```

- [ ] **Step 2: tsc + build**

Run: `npx tsc --noEmit -p tsconfig.json && npm run build`
Expected: exit 0 ; la route `ƒ /api/reviews` apparaît.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/reviews/route.ts
git commit -m "feat(reviews): API GET liste + POST upsert avis"
```

---

## Task 5 : Route `/api/reviews/eligibility` (GET)

**Files:**
- Create: `src/app/api/reviews/eligibility/route.ts`

- [ ] **Step 1: Écrire la route**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { checkEligibility } from '@/lib/reviews/eligibility'
import type { ReviewType } from '@/lib/reviews/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type')
  const productId = req.nextUrl.searchParams.get('productId')
  if (type !== 'platform' && type !== 'product') return NextResponse.json({ error: 'bad_type' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ eligible: false, reason: 'guest' })

  const service = await createServiceClient()
  const elig = await checkEligibility(service, user, type as ReviewType, type === 'product' ? productId : null)

  // Avis existant (pour pré-remplir le formulaire)
  let existing = null
  if (elig.eligible) {
    let q = service.from('reviews').select('rating, comment').eq('user_id', user.id).eq('type', type)
    if (type === 'product' && productId) q = q.eq('product_id', productId)
    const { data } = await q.maybeSingle()
    existing = data ?? null
  }
  return NextResponse.json({ ...elig, existing })
}
```

- [ ] **Step 2: tsc + build**

Run: `npx tsc --noEmit -p tsconfig.json && npm run build`
Expected: exit 0 ; route `ƒ /api/reviews/eligibility`.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/reviews/eligibility/route.ts
git commit -m "feat(reviews): API éligibilité session"
```

---

## Task 6 : Route admin `/api/admin/reviews` (GET/PATCH/DELETE)

**Files:**
- Create: `src/app/api/admin/reviews/route.ts`

Pattern admin (cf. `src/app/[locale]/admin/page.tsx`) : connecté + présent dans `admin_users`.

- [ ] **Step 1: Écrire la route**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const service = await createServiceClient()
  const { data: admin } = await service.from('admin_users').select('id').eq('id', user.id).maybeSingle()
  return admin ? service : null
}

export async function GET() {
  const service = await requireAdmin()
  if (!service) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const { data, error } = await service.from('reviews').select('*').order('created_at', { ascending: false }).limit(200)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ reviews: data ?? [] })
}

export async function PATCH(req: NextRequest) {
  const service = await requireAdmin()
  if (!service) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const { id, hidden } = await req.json().catch(() => ({})) as { id?: string; hidden?: boolean }
  if (!id || typeof hidden !== 'boolean') return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  const { error } = await service.from('reviews').update({ hidden }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const service = await requireAdmin()
  if (!service) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  const { error } = await service.from('reviews').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 2: tsc + build**

Run: `npx tsc --noEmit -p tsconfig.json && npm run build`
Expected: exit 0 ; route `ƒ /api/admin/reviews`.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/reviews/route.ts
git commit -m "feat(reviews): API admin (liste/masquer/supprimer)"
```

---

## Task 7 : i18n + composants UI (StarRating, ReviewForm, CustomerReviews)

**Files:**
- Modify: `messages/fr.json`, `messages/en.json`
- Create: `src/components/reviews/StarRating.tsx`, `ReviewForm.tsx`, `CustomerReviews.tsx`

- [ ] **Step 1: Ajouter le namespace `reviews` (fr puis en)**

Insérer dans `messages/fr.json` (au niveau racine, ex. avant `"dashboard"`) :

```json
"reviews": {
  "productTitle": "Avis clients",
  "platformTitle": "Ils ont laissé leur avis",
  "verified": "✓ Achat vérifié",
  "none": "Aucun avis pour l'instant.",
  "beFirst": "Sois le premier à laisser un avis !",
  "leaveReview": "Laisser un avis",
  "editReview": "Modifier mon avis",
  "ratingLabel": "Ta note",
  "commentLabel": "Ton commentaire",
  "commentPlaceholder": "Partage ton expérience (10 caractères min.)…",
  "submit": "Publier mon avis",
  "submitting": "Publication…",
  "thanks": "Merci, ton avis est publié !",
  "starAria": "{n} étoile(s) sur 5",
  "mustLogin": "Connecte-toi pour laisser un avis.",
  "mustBuy": "Réservé aux clients ayant acheté ce guide.",
  "mustSubscribe": "Réservé aux abonnés.",
  "error": "Une erreur est survenue. Réessaie."
}
```

Et dans `messages/en.json` :

```json
"reviews": {
  "productTitle": "Customer reviews",
  "platformTitle": "What our members say",
  "verified": "✓ Verified purchase",
  "none": "No reviews yet.",
  "beFirst": "Be the first to leave a review!",
  "leaveReview": "Leave a review",
  "editReview": "Edit my review",
  "ratingLabel": "Your rating",
  "commentLabel": "Your review",
  "commentPlaceholder": "Share your experience (10 characters min.)…",
  "submit": "Publish my review",
  "submitting": "Publishing…",
  "thanks": "Thanks, your review is live!",
  "starAria": "{n} of 5 stars",
  "mustLogin": "Log in to leave a review.",
  "mustBuy": "Reserved for customers who purchased this guide.",
  "mustSubscribe": "Reserved for subscribers.",
  "error": "Something went wrong. Please try again."
}
```

- [ ] **Step 2: Vérifier la parité**

Run:
```bash
node -e "const en=require('./messages/en.json'),fr=require('./messages/fr.json');function f(o,p=''){return Object.entries(o).flatMap(([k,v])=>v&&typeof v==='object'&&!Array.isArray(v)?f(v,p+k+'.'):[p+k])}const e=new Set(f(en)),F=new Set(f(fr));console.log('parité:', e.size===F.size && [...e].every(x=>F.has(x)))"
```
Expected: `parité: true`

- [ ] **Step 3: `StarRating.tsx`**

```tsx
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
```

- [ ] **Step 4: `ReviewForm.tsx`**

```tsx
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
```

- [ ] **Step 5: `CustomerReviews.tsx`**

```tsx
'use client'
import { useEffect, useState, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { StarRating } from './StarRating'
import { ReviewForm } from './ReviewForm'
import type { Review, ReviewType, Eligibility } from '@/lib/reviews/types'

interface Props { kind: ReviewType; productId?: string }

export function CustomerReviews({ kind, productId }: Props) {
  const t = useTranslations('reviews')
  const locale = useLocale()
  const [reviews, setReviews] = useState<Review[] | null>(null)
  const [elig, setElig] = useState<Eligibility | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [done, setDone] = useState(false)

  const qs = kind === 'product' ? `type=product&productId=${encodeURIComponent(productId ?? '')}` : 'type=platform'

  const load = useCallback(async () => {
    const r = await fetch(`/api/reviews?${qs}`).then(r => r.json()).catch(() => ({ reviews: [] }))
    setReviews(r.reviews ?? [])
  }, [qs])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    fetch(`/api/reviews/eligibility?${qs}`).then(r => r.json()).then(setElig).catch(() => setElig({ eligible: false, reason: 'guest' }))
  }, [qs])

  function onPublished() { setFormOpen(false); setDone(true); load() }

  const title = kind === 'product' ? t('productTitle') : t('platformTitle')

  return (
    <section className="py-8">
      <h2 className="text-lg font-black text-white mb-4">{title}{reviews ? ` (${reviews.length})` : ''}</h2>

      {reviews && reviews.length === 0 && <p className="text-sport-gray text-sm mb-4">{t('none')}</p>}

      <div className="space-y-4 mb-6">
        {(reviews ?? []).map((r) => (
          <div key={r.id} className="bg-sport-card border border-sport-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-bold text-white">{r.author_name}</span>
              <span className="text-[10px] font-bold text-emerald-400">{t('verified')}</span>
            </div>
            <StarRating value={r.rating} />
            <p className="text-sm text-sport-gray mt-2 leading-relaxed whitespace-pre-wrap">{r.comment}</p>
            <p className="text-[10px] text-sport-gray mt-2">{new Date(r.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR')}</p>
          </div>
        ))}
      </div>

      {done && <p className="text-emerald-400 text-sm font-semibold">{t('thanks')}</p>}

      {!done && elig && (
        elig.eligible ? (
          formOpen ? (
            <ReviewForm type={kind} productId={productId} initial={elig.existing} onPublished={onPublished} />
          ) : (
            <button onClick={() => setFormOpen(true)} className="bg-sport-orange text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-orange-600 transition-all">
              {elig.existing ? t('editReview') : t('leaveReview')}
            </button>
          )
        ) : (
          <p className="text-sport-gray text-xs">
            {elig.reason === 'guest' ? t('mustLogin') : elig.reason === 'not_subscriber' ? t('mustSubscribe') : t('mustBuy')}
          </p>
        )
      )}
    </section>
  )
}
```

- [ ] **Step 6: tsc + build + commit**

Run: `npx tsc --noEmit -p tsconfig.json && npm run build`
Expected: exit 0
```bash
git add messages/fr.json messages/en.json src/components/reviews/
git commit -m "feat(reviews): i18n + composants UI (étoiles, formulaire, liste)"
```

---

## Task 8 : Intégration fiche produit (digital) + accueil

**Files:**
- Modify: `src/app/[locale]/boutique/[slug]/ProductDetail.tsx`
- Modify: `src/app/[locale]/page.tsx`

⚠️ Rebaser `main` d'abord (cf. pré-requis branche) pour récupérer la PR #12.

- [ ] **Step 1: Fiche produit — section avis pour les digitaux**

Dans `ProductDetail.tsx`, importer le composant et l'afficher pour les produits `digital` (sous le contenu existant, avant la fermeture du conteneur principal) :

```tsx
import { CustomerReviews } from '@/components/reviews/CustomerReviews'
// …
{product.type === 'digital' && (
  <CustomerReviews kind="product" productId={product.id} />
)}
```

- [ ] **Step 2: Accueil — témoignages réels sous la section statique**

Dans `src/app/[locale]/page.tsx`, après `<Reviews />`, insérer dans un conteneur centré :

```tsx
import { CustomerReviews } from '@/components/reviews/CustomerReviews'
// …
<section className="px-6 bg-sport-dark">
  <div className="max-w-3xl mx-auto">
    <CustomerReviews kind="platform" />
  </div>
</section>
```

- [ ] **Step 3: tsc + build + vérif SSG**

Run: `npx tsc --noEmit -p tsconfig.json && npm run build`
Expected: exit 0 ; `/[locale]` et `/[locale]/boutique/[slug]` restent **`●` (SSG)** dans la table des routes (le composant est client, il ne dynamise pas la page).

- [ ] **Step 4: Commit**

```bash
git add "src/app/[locale]/boutique/[slug]/ProductDetail.tsx" "src/app/[locale]/page.tsx"
git commit -m "feat(reviews): intégration fiche produit digitale + accueil"
```

---

## Task 9 : Gestion admin des avis

**Files:**
- Modify: `src/app/[locale]/admin/page.tsx`
- Create: `src/components/reviews/AdminReviews.tsx` (client)

- [ ] **Step 1: Composant admin client**

```tsx
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
    <div className="space-y-3">
      <h2 className="text-lg font-black text-white">Avis clients ({items.length})</h2>
      {items.map((r) => (
        <div key={r.id} className={`bg-sport-card border rounded-xl p-4 ${r.hidden ? 'border-red-500/30 opacity-60' : 'border-sport-border'}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">{r.author_name} · {r.type === 'product' ? r.product_id : 'plateforme'}</span>
            <StarRating value={r.rating} />
          </div>
          <p className="text-sm text-sport-gray mt-2 whitespace-pre-wrap">{r.comment}</p>
          <div className="flex gap-2 mt-3">
            <button onClick={() => toggle(r.id, r.hidden)} className="text-xs border border-sport-border px-3 py-1.5 rounded-full text-sport-gray hover:text-white">
              {r.hidden ? 'Afficher' : 'Masquer'}
            </button>
            <button onClick={() => remove(r.id)} className="text-xs border border-red-500/30 px-3 py-1.5 rounded-full text-red-400 hover:bg-red-500/10">
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Brancher dans la page admin**

Dans `src/app/[locale]/admin/page.tsx` (server component, déjà protégé par `admin_users`), importer et rendre `<AdminReviews />` dans une section.

```tsx
import { AdminReviews } from '@/components/reviews/AdminReviews'
// … dans le JSX :
<AdminReviews />
```

- [ ] **Step 3: tsc + build + commit**

Run: `npx tsc --noEmit -p tsconfig.json && npm run build`
Expected: exit 0
```bash
git add "src/app/[locale]/admin/page.tsx" src/components/reviews/AdminReviews.tsx
git commit -m "feat(reviews): gestion admin (masquer/supprimer)"
```

---

## Task 10 : Vérification finale

- [ ] **Step 1: tsc + build complet**

Run: `npx tsc --noEmit -p tsconfig.json && npm run build`
Expected: exit 0 ; pages accueil/boutique en `●` (SSG) ; routes `ƒ /api/reviews`, `/api/reviews/eligibility`, `/api/admin/reviews`.

- [ ] **Step 2: Parité FR/EN**

Run (script de la Task 7 Step 2). Expected: `parité: true`.

- [ ] **Step 3: Test manuel (après exécution de `supabase-reviews.sql` en base + déploiement preview)**

Sur le preview :
- Connecté + abonné → témoignage plateforme s'affiche aussitôt (badge vérifié). ✓
- Connecté + acheteur d'un guide digital → avis sur la fiche du guide. ✓
- Non connecté / non éligible → message « connecte-toi / réservé… », pas de formulaire. ✓
- Produit Amazon → pas de section avis. ✓
- Admin → masquer/supprimer fonctionne. ✓

- [ ] **Step 4: Commit final éventuel + PR**

```bash
git push -u origin feat-customer-reviews
gh pr create --base main --title "feat: avis clients vérifiés (produits digitaux + plateforme)" --body "…"
```

Rappeler dans la PR : **exécuter `supabase-reviews.sql`** dans Supabase avant déploiement.

---

## Notes d'implémentation

- **SSG préservé** : tout l'affichage passe par `CustomerReviews` (client) → les pages restent statiques. Ne PAS faire de fetch d'avis dans un Server Component d'une page SSG (cela la dynamiserait).
- **`author_name`** : snapshot du profil au moment de l'avis (pas de jointure à l'affichage).
- **Sécurité** : aucune écriture côté client ne contourne la vérification (POST refait `checkEligibility`). RLS bloque tout accès hors service-role.
- **i18n** : les libellés via `reviews.*` ; les commentaires restent dans leur langue (champ `locale` indicatif).
