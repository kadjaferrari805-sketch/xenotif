# Socle d'accès PRO (RBAC) + suppression d'ÉLITE — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Réserver réellement le contenu PRO aux abonnés (essai/actif) via un contrôle d'accès unique, supprimer le plan ÉLITE de bout en bout, et aligner les promesses sur le produit réel.

**Architecture:** Une source de vérité serveur (`getAccess()`) déduit le rôle (`guest`/`free`/`pro`/`admin`) à partir de `subscriptions` + `admin_users`. Les pages PRO du dashboard deviennent de fins wrappers serveur qui rendent soit le contenu, soit un `<Paywall/>`. Les routes API PRO appellent `requirePro()`. ÉLITE est retiré du checkout, du webhook, des APIs de sync, de l'UI marketing et de l'i18n ; tout reliquat `elite` est normalisé en `pro`.

**Tech Stack:** Next.js 16 (App Router, `next-intl`), React 19, Supabase (`@supabase/ssr` + service-role), Stripe, Jest.

**Spec de référence :** `docs/superpowers/specs/2026-06-11-socle-acces-pro-rbac-design.md`

**Branche :** `feat-acces-pro-socle` (déjà créée).

---

## Préambule (obligatoire avant de coder)

- [ ] **Lire les guides Next.js requis par `AGENTS.md`** : parcourir `node_modules/next/dist/docs/` pour les conventions App Router (Server Components, layouts, route handlers) avant toute modification. Cette version peut différer des habitudes.

---

## Structure des fichiers

**Créés :**
- `src/lib/access.ts` — `deriveAccess()` (pur, testable), `getAccess()` (I/O), `requirePro()`.
- `src/lib/access.test.ts` — tests unitaires de `deriveAccess`.
- `src/components/dashboard/Paywall.tsx` — écran « Passe à PRO ».
- `src/app/[locale]/dashboard/coach/CoachClient.tsx` — ex-contenu client de coach.
- `src/app/[locale]/dashboard/programme/ProgrammeClient.tsx` — ex-contenu client de programme.
- `src/app/[locale]/dashboard/progression/ProgressionClient.tsx` — ex-contenu client de progression.
- `src/app/[locale]/dashboard/smartwatch/SmartwatchClient.tsx` — ex-contenu client de smartwatch.
- `src/app/[locale]/dashboard/notifications/NotificationsClient.tsx` — ex-contenu client de notifications.

**Modifiés :**
- `src/app/[locale]/dashboard/{coach,programme,progression,smartwatch,notifications}/page.tsx` — wrappers serveur gatés.
- `src/app/[locale]/dashboard/page.tsx` — ajout du garde (déjà serveur).
- `src/app/api/coach/route.ts` — `requirePro()`.
- `src/app/api/checkout/route.ts`, `api/webhook/stripe/route.ts`, `api/subscription/route.ts`, `api/subscription/sync/route.ts` — retrait ÉLITE + normalisation `pro`.
- `src/components/home/Pricing.tsx`, `src/app/[locale]/auth/signup/page.tsx` — retrait carte/option ÉLITE.
- `src/components/home/IntensityLevels.tsx`, `StickyCheckout.tsx`, `src/components/layout/Footer.tsx`, `src/app/[locale]/success/page.tsx`, `src/app/[locale]/dashboard/abonnement/page.tsx`, `src/app/[locale]/dashboard/progression/ProgressionClient.tsx`, `src/lib/emails/index.ts` — retrait mentions ÉLITE + alignement promesses.
- `messages/fr.json`, `messages/en.json`, `messages/de.json` — retrait entrées ÉLITE + features PRO alignées.

**Hors code (checklist) :** archivage des prix Stripe ÉLITE.

---

## Task 1 : Modèle d'accès `access.ts` (cœur, TDD)

**Files:**
- Create: `src/lib/access.ts`
- Test: `src/lib/access.test.ts`

- [ ] **Step 1 : Écrire le test qui échoue** — `src/lib/access.test.ts`

```ts
import { deriveAccess } from './access'

const sub = (over: Partial<{ plan: string; status: string; cancel_at_period_end: boolean }>) => ({
  plan: 'pro', status: 'active', trial_end: null, current_period_end: null,
  cancel_at_period_end: false, ...over,
})

describe('deriveAccess', () => {
  it('guest si non authentifié', () => {
    const a = deriveAccess({ isAuthenticated: false, isAdmin: false, sub: null })
    expect(a.role).toBe('guest'); expect(a.isPro).toBe(false)
  })
  it('free si connecté sans abonnement', () => {
    const a = deriveAccess({ isAuthenticated: true, isAdmin: false, sub: null })
    expect(a.role).toBe('free'); expect(a.isPro).toBe(false)
  })
  it('pro pendant l’essai (trialing)', () => {
    const a = deriveAccess({ isAuthenticated: true, isAdmin: false, sub: sub({ status: 'trialing' }) })
    expect(a.role).toBe('pro'); expect(a.isPro).toBe(true)
  })
  it('pro si actif', () => {
    const a = deriveAccess({ isAuthenticated: true, isAdmin: false, sub: sub({ status: 'active' }) })
    expect(a.isPro).toBe(true)
  })
  it('free si canceled', () => {
    const a = deriveAccess({ isAuthenticated: true, isAdmin: false, sub: sub({ status: 'canceled' }) })
    expect(a.role).toBe('free'); expect(a.isPro).toBe(false)
  })
  it('non-pro si past_due', () => {
    const a = deriveAccess({ isAuthenticated: true, isAdmin: false, sub: sub({ status: 'past_due' }) })
    expect(a.isPro).toBe(false)
  })
  it('admin → accès total même sans abonnement', () => {
    const a = deriveAccess({ isAuthenticated: true, isAdmin: true, sub: null })
    expect(a.role).toBe('admin'); expect(a.isPro).toBe(true)
  })
  it('normalise un plan elite hérité en pro', () => {
    const a = deriveAccess({ isAuthenticated: true, isAdmin: false, sub: sub({ plan: 'elite', status: 'active' }) })
    expect(a.plan).toBe('pro'); expect(a.isPro).toBe(true)
  })
  it('garde l’accès si résiliation en fin de période (encore active)', () => {
    const a = deriveAccess({ isAuthenticated: true, isAdmin: false, sub: sub({ status: 'active', cancel_at_period_end: true }) })
    expect(a.isPro).toBe(true); expect(a.cancelAtPeriodEnd).toBe(true)
  })
})
```

- [ ] **Step 2 : Lancer le test, vérifier l'échec**

Run: `npx jest access`
Expected: FAIL (`Cannot find module './access'` ou `deriveAccess is not a function`).

- [ ] **Step 3 : Écrire l'implémentation minimale** — `src/lib/access.ts`

```ts
import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export type Role = 'guest' | 'free' | 'pro' | 'admin'

export type Access = {
  role: Role
  isPro: boolean
  isAdmin: boolean
  status: string | null
  plan: string | null
  trialEnd: Date | null
  renewDate: Date | null
  cancelAtPeriodEnd: boolean
}

type SubRow = {
  plan: string | null
  status: string | null
  trial_end: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean | null
} | null

const PRO_STATUSES = new Set(['active', 'trialing'])

// Déduction pure (testable sans I/O) du niveau d'accès.
export function deriveAccess(opts: {
  isAuthenticated: boolean
  isAdmin: boolean
  sub: SubRow
}): Access {
  const { isAuthenticated, isAdmin, sub } = opts
  const status = sub?.status ?? null
  // Plan unique : toute valeur héritée 'elite' est normalisée en 'pro'.
  const plan = sub?.plan ? (sub.plan === 'elite' ? 'pro' : sub.plan) : null
  const isProSub = !!status && PRO_STATUSES.has(status)

  let role: Role = 'guest'
  if (isAuthenticated) role = isAdmin ? 'admin' : isProSub ? 'pro' : 'free'

  return {
    role,
    isPro: isAdmin || isProSub,
    isAdmin,
    status,
    plan,
    trialEnd: sub?.trial_end ? new Date(sub.trial_end) : null,
    renewDate: sub?.current_period_end ? new Date(sub.current_period_end) : null,
    cancelAtPeriodEnd: !!sub?.cancel_at_period_end,
  }
}

// Source de vérité serveur : auth user + subscriptions (service-role) + admin_users.
export async function getAccess(): Promise<Access> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return deriveAccess({ isAuthenticated: false, isAdmin: false, sub: null })

  const service = await createServiceClient()
  const [{ data: sub }, { data: admin }] = await Promise.all([
    service
      .from('subscriptions')
      .select('plan,status,trial_end,current_period_end,cancel_at_period_end')
      .eq('user_id', user.id)
      .maybeSingle(),
    service.from('admin_users').select('id').eq('id', user.id).maybeSingle(),
  ])
  return deriveAccess({ isAuthenticated: true, isAdmin: !!admin, sub: sub as SubRow })
}

// Pour les routes API : renvoie l'Access si PRO, sinon une Response 403 à retourner directement.
export async function requirePro(): Promise<Access | NextResponse> {
  const access = await getAccess()
  if (!access.isPro) {
    return NextResponse.json({ error: 'Réservé aux abonnés' }, { status: 403 })
  }
  return access
}
```

- [ ] **Step 4 : Lancer le test, vérifier le succès**

Run: `npx jest access`
Expected: PASS (9 tests).

- [ ] **Step 5 : Commit**

```bash
git add src/lib/access.ts src/lib/access.test.ts
git commit -m "feat(access): socle RBAC getAccess/deriveAccess/requirePro"
```

---

## Task 2 : Protéger l'API coach avec `requirePro()`

**Files:**
- Modify: `src/app/api/coach/route.ts`

- [ ] **Step 1 : Lire le fichier** pour situer le point après `getUser()` (l'API renvoie `401` si non connecté). Repérer la ligne `if (!user) return new Response('Non authentifié', { status: 401 })`.

- [ ] **Step 2 : Ajouter le garde PRO** juste après le contrôle d'authentification existant :

```ts
import { requirePro } from '@/lib/access'
// ...
// (après if (!user) ... 401)
const access = await requirePro()
if (access instanceof Response) return access
```

- [ ] **Step 3 : Vérifier la compilation**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 4 : Commit**

```bash
git add src/app/api/coach/route.ts
git commit -m "feat(access): coach API réservé aux abonnés (requirePro)"
```

---

## Task 3 : Composant Paywall

**Files:**
- Create: `src/components/dashboard/Paywall.tsx`

- [ ] **Step 1 : Créer le composant** (serveur, sans état ; CTA = lien vers le checkout via signup `?plan=pro`). Utilise `next-intl` côté serveur.

```tsx
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Lock, ArrowRight, CheckCircle } from 'lucide-react'

// Écran affiché à la place du contenu PRO pour un utilisateur non-abonné.
export async function Paywall() {
  const t = await getTranslations('dashboard.paywall')
  const features = t.raw('features') as string[]

  return (
    <div className="p-6 md:p-10 max-w-xl mx-auto pb-24 md:pb-10">
      <div className="rounded-2xl border border-sport-border bg-sport-card p-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-sport-orange/15 border border-sport-orange/30">
          <Lock size={24} className="text-sport-orange" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">{t('title')}</h1>
        <p className="text-sport-gray text-sm leading-relaxed mb-6">{t('subtitle')}</p>

        <ul className="space-y-2.5 text-left mb-8">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-sport-gray">
              <CheckCircle size={15} className="shrink-0 mt-0.5 text-sport-orange" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>

        <Link
          href="/auth/signup?plan=pro"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-sport-orange px-6 py-3.5 font-bold text-sm text-white hover:bg-orange-600 transition-all"
        >
          {t('cta')} <ArrowRight size={14} aria-hidden="true" />
        </Link>

        <p className="text-[11px] text-sport-gray mt-4">{t('trialNote')}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2 : Ajouter les clés i18n** `dashboard.paywall` dans `messages/fr.json`, `en.json`, `de.json`. Insérer dans l'objet `dashboard` de chaque fichier. Version FR :

```json
"paywall": {
  "title": "Passe à PRO pour tout débloquer",
  "subtitle": "Cette section est réservée aux abonnés. Commence ton essai gratuit de 7 jours et accède à l'intégralité de Xenotif®.",
  "features": [
    "Accès illimité aux 10 disciplines & programmes",
    "Coach IA personnalisé",
    "Suivi & statistiques de progression",
    "Vidéos d'entraînement HD",
    "Rappels & motivation quotidienne",
    "Synchronisation montre / Apple Fitness"
  ],
  "cta": "Démarrer mon essai gratuit",
  "trialNote": "7 jours gratuits · Sans engagement · Annulable en 1 clic"
},
```

Version EN (clé `paywall` dans `dashboard`) :

```json
"paywall": {
  "title": "Go PRO to unlock everything",
  "subtitle": "This section is for subscribers. Start your 7-day free trial and unlock all of Xenotif®.",
  "features": [
    "Unlimited access to all 10 disciplines & programs",
    "Personalized AI coach",
    "Progress tracking & statistics",
    "HD training videos",
    "Daily reminders & motivation",
    "Smartwatch / Apple Fitness sync"
  ],
  "cta": "Start my free trial",
  "trialNote": "7 days free · No commitment · Cancel in 1 click"
},
```

Version DE (clé `paywall` dans `dashboard`) :

```json
"paywall": {
  "title": "Hol dir PRO und schalte alles frei",
  "subtitle": "Dieser Bereich ist Abonnenten vorbehalten. Starte deine 7-tägige Testphase und nutze Xenotif® komplett.",
  "features": [
    "Unbegrenzter Zugang zu allen 10 Disziplinen & Programmen",
    "Personalisierter KI-Coach",
    "Fortschritt & Statistiken",
    "HD-Trainingsvideos",
    "Tägliche Erinnerungen & Motivation",
    "Smartwatch-/Apple-Fitness-Synchronisierung"
  ],
  "cta": "Kostenlose Testphase starten",
  "trialNote": "7 Tage gratis · Ohne Verpflichtung · Jederzeit kündbar"
},
```

- [ ] **Step 3 : Vérifier la cohérence des messages**

Run: `npx jest messages`
Expected: PASS (le test `src/i18n/messages.test.ts` vérifie que fr/en/de ont les mêmes clés — il échouera si une locale a été oubliée).

- [ ] **Step 4 : Commit**

```bash
git add src/components/dashboard/Paywall.tsx messages/fr.json messages/en.json messages/de.json
git commit -m "feat(access): composant Paywall + i18n"
```

---

## Task 4 : Garde sur la page Overview (déjà serveur)

**Files:**
- Modify: `src/app/[locale]/dashboard/page.tsx`

- [ ] **Step 1 : Lire `dashboard/page.tsx`** (composant serveur `async`). Repérer le `redirect('/auth/signin')` si pas d'utilisateur.

- [ ] **Step 2 : Ajouter le garde PRO** juste après la vérification de l'utilisateur :

```tsx
import { getAccess } from '@/lib/access'
import { Paywall } from '@/components/dashboard/Paywall'
// ... dans le composant, après avoir obtenu `user` :
const access = await getAccess()
if (!access.isPro) return <Paywall />
```

- [ ] **Step 3 : Vérifier la compilation** — `npx tsc --noEmit` → exit 0.

- [ ] **Step 4 : Commit**

```bash
git add "src/app/[locale]/dashboard/page.tsx"
git commit -m "feat(access): paywall sur le tableau de bord (overview)"
```

---

## Task 5 : Gater les pages PRO client (coach, programme, progression, smartwatch, notifications)

Chaque page client devient `XxxClient.tsx` et un nouveau `page.tsx` serveur fait le garde. **Répéter les 4 étapes pour chacune des 5 pages.**

**Files (par page, exemple `programme`):**
- Create: `src/app/[locale]/dashboard/programme/ProgrammeClient.tsx`
- Modify: `src/app/[locale]/dashboard/programme/page.tsx`

- [ ] **Step 1 (coach) : Déplacer le contenu client**
  - `git mv "src/app/[locale]/dashboard/coach/page.tsx" "src/app/[locale]/dashboard/coach/CoachClient.tsx"`
  - Dans `CoachClient.tsx` : garder `'use client'` en tête, renommer l'export `export default function CoachPage()` → `export function CoachClient()`. Si le fichier utilise un wrapper `Suspense` avec un sous-composant, exporter le composant par défaut sous le nom `CoachClient`.

- [ ] **Step 2 (coach) : Créer le wrapper serveur** — `src/app/[locale]/dashboard/coach/page.tsx`

```tsx
import { getAccess } from '@/lib/access'
import { Paywall } from '@/components/dashboard/Paywall'
import { CoachClient } from './CoachClient'

export default async function Page() {
  const access = await getAccess()
  if (!access.isPro) return <Paywall />
  return <CoachClient />
}
```

- [ ] **Step 3 (programme) : Déplacer le contenu client**
  - `git mv "src/app/[locale]/dashboard/programme/page.tsx" "src/app/[locale]/dashboard/programme/ProgrammeClient.tsx"`
  - Dans `ProgrammeClient.tsx` : garder `'use client'`, renommer l'export par défaut `ProgrammePage` → `export function ProgrammeClient()`. (Ce fichier exporte par défaut `ProgrammePage` qui rend `<Suspense><ProgrammeContent/></Suspense>` — renommer `ProgrammePage` en `ProgrammeClient` et le passer en export nommé.)

- [ ] **Step 4 (programme) : Créer le wrapper serveur** — `src/app/[locale]/dashboard/programme/page.tsx`

```tsx
import { getAccess } from '@/lib/access'
import { Paywall } from '@/components/dashboard/Paywall'
import { ProgrammeClient } from './ProgrammeClient'

export default async function Page() {
  const access = await getAccess()
  if (!access.isPro) return <Paywall />
  return <ProgrammeClient />
}
```

- [ ] **Step 5 (progression) : Déplacer + wrapper** (même schéma)
  - `git mv "src/app/[locale]/dashboard/progression/page.tsx" "src/app/[locale]/dashboard/progression/ProgressionClient.tsx"`, export nommé `ProgressionClient`.
  - `page.tsx` serveur :

```tsx
import { getAccess } from '@/lib/access'
import { Paywall } from '@/components/dashboard/Paywall'
import { ProgressionClient } from './ProgressionClient'

export default async function Page() {
  const access = await getAccess()
  if (!access.isPro) return <Paywall />
  return <ProgressionClient />
}
```

- [ ] **Step 6 (smartwatch) : Déplacer + wrapper** (même schéma)
  - `git mv "src/app/[locale]/dashboard/smartwatch/page.tsx" "src/app/[locale]/dashboard/smartwatch/SmartwatchClient.tsx"`, export nommé `SmartwatchClient`.
  - `page.tsx` serveur :

```tsx
import { getAccess } from '@/lib/access'
import { Paywall } from '@/components/dashboard/Paywall'
import { SmartwatchClient } from './SmartwatchClient'

export default async function Page() {
  const access = await getAccess()
  if (!access.isPro) return <Paywall />
  return <SmartwatchClient />
}
```

- [ ] **Step 7 (notifications) : Déplacer + wrapper** (même schéma)
  - `git mv "src/app/[locale]/dashboard/notifications/page.tsx" "src/app/[locale]/dashboard/notifications/NotificationsClient.tsx"`, export nommé `NotificationsClient`.
  - `page.tsx` serveur :

```tsx
import { getAccess } from '@/lib/access'
import { Paywall } from '@/components/dashboard/Paywall'
import { NotificationsClient } from './NotificationsClient'

export default async function Page() {
  const access = await getAccess()
  if (!access.isPro) return <Paywall />
  return <NotificationsClient />
}
```

- [ ] **Step 8 : Vérifier compilation + lint**

Run: `npx tsc --noEmit && npx eslint "src/app/[locale]/dashboard/**/*.tsx"`
Expected: exit 0 pour les deux. (Attention : un export par défaut renommé en export nommé ne doit plus laisser de `export default` orphelin dans les fichiers `XxxClient.tsx`.)

- [ ] **Step 9 : Commit**

```bash
git add "src/app/[locale]/dashboard/coach" "src/app/[locale]/dashboard/programme" "src/app/[locale]/dashboard/progression" "src/app/[locale]/dashboard/smartwatch" "src/app/[locale]/dashboard/notifications"
git commit -m "feat(access): paywall sur toutes les pages PRO du dashboard"
```

---

## Task 6 : Retirer ÉLITE des APIs Stripe (+ normaliser en `pro`)

**Files:**
- Modify: `src/app/api/checkout/route.ts`
- Modify: `src/app/api/webhook/stripe/route.ts`
- Modify: `src/app/api/subscription/route.ts`
- Modify: `src/app/api/subscription/sync/route.ts`

- [ ] **Step 1 : `checkout/route.ts`** — supprimer l'entrée `elite` de `PLAN_CONFIG` (lignes 11-16), et simplifier le calcul du `priceId` qui ne gère plus qu'un seul plan :

```ts
const priceId = isAnnual ? process.env.STRIPE_PRICE_PRO_ANNUAL : process.env.STRIPE_PRICE_PRO
```

(La validation `if (!plan || !(plan in PLAN_CONFIG))` reste : seule la clé `pro` existe désormais, donc tout `plan=elite` est rejeté en `400` — comportement voulu.)

- [ ] **Step 2 : `webhook/stripe/route.ts`** — dans `case 'customer.subscription.updated'`, remplacer la déduction du plan (lignes 192-193) par un plan fixe (palier unique) :

```ts
const plan = 'pro'
```

(Le `case 'checkout.session.completed'` lit déjà `session.metadata?.plan ?? 'pro'` ; comme le checkout n'envoie plus que `pro`, aucun changement requis là, mais on peut forcer `const plan = 'pro'` pour être explicite.)

- [ ] **Step 3 : `subscription/route.ts`** — remplacer la déduction (lignes 40-41) par :

```ts
const plan = 'pro'
```

- [ ] **Step 4 : `subscription/sync/route.ts`** — remplacer la déduction (lignes 45-46) par :

```ts
const plan = 'pro'
```

- [ ] **Step 5 : Vérifier qu'il ne reste aucune référence ÉLITE dans les APIs**

Run: `grep -rniE "elite|élite" src/app/api`
Expected: aucune correspondance (sortie vide).

- [ ] **Step 6 : Vérifier compilation** — `npx tsc --noEmit` → exit 0.

- [ ] **Step 7 : Commit**

```bash
git add src/app/api/checkout/route.ts src/app/api/webhook/stripe/route.ts src/app/api/subscription/route.ts src/app/api/subscription/sync/route.ts
git commit -m "feat(billing): plan unique PRO côté Stripe (retrait ÉLITE + normalisation)"
```

---

## Task 7 : Retirer ÉLITE de l'UI (tarifs, signup, marketing, footer, abonnement)

**Files:**
- Modify: `src/components/home/Pricing.tsx`
- Modify: `src/app/[locale]/auth/signup/page.tsx`
- Modify: `src/components/home/IntensityLevels.tsx`
- Modify: `src/components/home/StickyCheckout.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/app/[locale]/success/page.tsx`
- Modify: `src/app/[locale]/dashboard/abonnement/page.tsx`
- Modify: `src/app/[locale]/dashboard/page.tsx`
- Modify: `src/app/[locale]/dashboard/progression/ProgressionClient.tsx`

- [ ] **Step 1 : `Pricing.tsx`**
  - Type : `type PlanId = 'gratuit' | 'pro'`.
  - Tableau `PLANS` : supprimer la ligne `{ id: 'elite', ... }` (ligne 20).
  - Grille : `grid-cols-1 md:grid-cols-3` → `grid-cols-1 md:grid-cols-2` (ligne 89).

- [ ] **Step 2 : `signup/page.tsx`**
  - Type : `type PlanId = 'gratuit' | 'pro'`.
  - Tableau `PLANS` : supprimer la ligne `{ id: 'elite', ... }` (ligne 19).
  - Validation : `['gratuit', 'pro', 'elite'].includes(plan)` → `['gratuit', 'pro'].includes(plan)` (ligne 48).
  - Grille du sélecteur : `grid grid-cols-3` → `grid grid-cols-2` (ligne 162).

- [ ] **Step 3 : Localiser et retirer les mentions ÉLITE des autres composants**

Run: `grep -rniE "elite|élite" src/components src/app/\[locale\]/success src/app/\[locale\]/dashboard src/lib/emails`

Pour chaque correspondance dans `IntensityLevels.tsx`, `StickyCheckout.tsx`, `Footer.tsx`, `success/page.tsx`, `emails/index.ts` : retirer l'option/carte/lien ÉLITE ou le remplacer par PRO selon le contexte (ex. un lien `?plan=elite` → `?plan=pro` ; une carte ÉLITE → suppression). Lire chaque fichier avant édition.

- [ ] **Step 4 : `dashboard/abonnement/page.tsx`** — supprimer la branche ÉLITE de l'affichage :
  - Prix (ligne ~238) : remplacer `sub.plan === 'elite' ? '24,99 €' : '9,99 €'` par `'9,99 €'`.
  - Nom du plan (ligne ~191) : remplacer `sub.plan === 'elite' ? ... : 'Pro'` par `'Pro'`.
  - Liste de features (ligne ~270) : utiliser toujours `t.raw('featuresPro')` (retirer le ternaire `featuresElite`).

- [ ] **Step 5 : `dashboard/page.tsx`** — `planLabel` (ligne ~97) : remplacer `plan === 'elite' ? ... : 'Pro'` par `'Pro'` (le plan est toujours Pro).

- [ ] **Step 6 : `dashboard/progression/ProgressionClient.tsx`** — retirer toute mention/branche ÉLITE repérée par le grep du Step 3.

- [ ] **Step 7 : Vérifier qu'il ne reste plus aucune mention ÉLITE dans le code**

Run: `grep -rniE "elite|élite" src`
Expected: aucune correspondance (sortie vide).

- [ ] **Step 8 : Vérifier compilation + lint** — `npx tsc --noEmit && npx eslint src` → exit 0.

- [ ] **Step 9 : Commit**

```bash
git add src/components src/app
git commit -m "feat(ui): retrait du plan ÉLITE (tarifs, signup, marketing, abonnement)"
```

---

## Task 8 : Nettoyer l'i18n + aligner les promesses PRO

**Files:**
- Modify: `messages/fr.json`, `messages/en.json`, `messages/de.json`

- [ ] **Step 1 : Repérer les tableaux `plans` à 3 entrées et les libellés ÉLITE**

Run: `grep -nE "\"plans\"|elite|Élite|Elite|featuresElite|24,99|24\.99|19,99|19\.99" messages/fr.json`

Tableaux concernés (chaque locale) : `home.pricing.plans` (3 entrées : gratuit/pro/elite) et `auth.signup.plans` (3 entrées). Le 3e élément (ÉLITE) doit être supprimé pour rester aligné sur le tableau `PLANS` du code (qui n'a plus que 2 entrées).

- [ ] **Step 2 : Dans `fr.json`, `en.json`, `de.json`** :
  - Supprimer le **3e élément** (ÉLITE) des tableaux `home.pricing.plans` et `auth.signup.plans`.
  - Supprimer la clé `featuresElite` partout où elle existe (notamment sous `dashboard.abonnement`).
  - Supprimer les libellés de plan ÉLITE (ex. l'entrée `"elite": "Élite — 24,99 €/mois"` autour de la ligne 69 de `fr.json`, et l'`"elite": "Élite"` de sélecteurs ~ligne 33).

- [ ] **Step 3 : Aligner la liste `featuresPro`** (et la liste `features` du plan PRO dans `home.pricing.plans` / `auth.signup.plans`) sur le réel. Remplacer le contenu PRO par (FR) :

```json
[
  "Accès illimité aux 10 disciplines & programmes",
  "Coach IA personnalisé",
  "Suivi & statistiques de progression",
  "Vidéos d'entraînement HD",
  "Rappels & motivation quotidienne",
  "Synchronisation montre / Apple Fitness",
  "Support par email"
]
```

EN :

```json
[
  "Unlimited access to all 10 disciplines & programs",
  "Personalized AI coach",
  "Progress tracking & statistics",
  "HD training videos",
  "Daily reminders & motivation",
  "Smartwatch / Apple Fitness sync",
  "Email support"
]
```

DE :

```json
[
  "Unbegrenzter Zugang zu allen 10 Disziplinen & Programmen",
  "Personalisierter KI-Coach",
  "Fortschritt & Statistiken",
  "HD-Trainingsvideos",
  "Tägliche Erinnerungen & Motivation",
  "Smartwatch-/Apple-Fitness-Synchronisierung",
  "E-Mail-Support"
]
```

(Le détail des listes `features` dans `home.pricing.plans` / `auth.signup.plans` peut être plus court pour tenir dans les cartes — garder 3-4 lignes parmi celles ci-dessus, sans aucune promesse inexistante.)

- [ ] **Step 4 : Valider la cohérence des clés et le JSON**

Run: `npx jest messages && node -e "for(const l of['fr','en','de'])JSON.parse(require('fs').readFileSync('messages/'+l+'.json','utf8'));console.log('JSON OK')"`
Expected: PASS + `JSON OK`. (Le test `messages.test.ts` garantit fr/en/de structurellement alignés.)

- [ ] **Step 5 : Commit**

```bash
git add messages/fr.json messages/en.json messages/de.json
git commit -m "i18n: retrait ÉLITE + promesses PRO alignées sur le réel"
```

---

## Task 9 : Archiver les prix ÉLITE dans Stripe (checklist hors-code)

**But :** désactiver les prix ÉLITE pour qu'aucun nouveau checkout ne puisse les utiliser, sans casser l'historique. **Ne pas supprimer.**

- [ ] **Step 1 : Récupérer les IDs de prix ÉLITE** depuis Vercel (Settings → Environment Variables) : `STRIPE_PRICE_ELITE` et `STRIPE_PRICE_ELITE_ANNUAL`.

- [ ] **Step 2 : Archiver via le dashboard Stripe** (Produits → prix ÉLITE → « Archiver »), **ou** via API avec une clé secrète live (à lancer par l'utilisateur, pas committé) :

```bash
# Remplacer price_xxx par les IDs réels ; STRIPE_SECRET_KEY = clé live
curl -s https://api.stripe.com/v1/prices/price_ELITE_MENSUEL -u "$STRIPE_SECRET_KEY:" -d active=false
curl -s https://api.stripe.com/v1/prices/price_ELITE_ANNUEL  -u "$STRIPE_SECRET_KEY:" -d active=false
```

- [ ] **Step 3 : (Optionnel)** retirer les variables `STRIPE_PRICE_ELITE*` de Vercel une fois le code déployé (elles deviennent inertes). À faire dans un second temps pour éviter tout effet de bord pendant la transition.

*(Pas de commit : action externe.)*

---

## Task 10 : Vérification finale

- [ ] **Step 1 : Suite complète + types + lint + build**

Run:
```bash
npx jest && npx tsc --noEmit && npx eslint src && npm run build
```
Expected: tests au vert (dont `access` et `messages`), `tsc` exit 0, eslint exit 0, build OK.

- [ ] **Step 2 : Vérifier l'absence totale de mentions ÉLITE**

Run: `grep -rniE "elite|élite" src messages`
Expected: sortie vide.

- [ ] **Step 3 : Vérification manuelle** (à la main, sur un déploiement preview) :
  - Compte **gratuit** (connecté, sans abonnement) → pages dashboard de contenu affichent le **Paywall** ; pages `abonnement` et `profil` restent accessibles.
  - Compte **en essai / actif** → accès complet au contenu.
  - Appel `POST /api/coach` sans abonnement → `403`.
  - Page tarifs et signup n'affichent plus que **Gratuit + PRO** ; aucune mention « Élite », « support prioritaire 7j/7 » ou « challenges communautaires ».

- [ ] **Step 4 : Commit éventuel** (si des ajustements de build ont été nécessaires) puis ouverture de PR.

---

## Notes d'exécution

- Frequent commits : un commit par task (déjà prévu).
- DRY : `getAccess()`/`Paywall` sont la seule source de vérité du gating ; ne pas dupliquer la logique d'accès dans les pages.
- YAGNI : pas de colonne `role` en base, pas de RLS sur le contenu (statique) — réservé aux sous-projets ultérieurs (bibliothèque de contenu).
