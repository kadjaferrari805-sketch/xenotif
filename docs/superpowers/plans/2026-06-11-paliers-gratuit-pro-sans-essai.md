# Paliers Gratuit limité + PRO sans essai — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Donner un accès gratuit limité (Musculation + Progression + Notifications), réserver Coach IA + Montre + les 9 autres disciplines à PRO, et supprimer l'essai 7 jours (PRO débité immédiatement).

**Architecture:** Un module `content-access.ts` centralise les règles d'accès au contenu (constantes ; futur seam pour la base en B2). Les wrappers serveur du dashboard appliquent Paywall sur coach/montre uniquement ; programme/progression/notifications/accueil deviennent accessibles au gratuit, avec gating par discipline dans `ProgrammeClient`. Le checkout retire l'essai. Le messaging (i18n/CGV/emails) est nettoyé de toute mention d'essai.

**Tech Stack:** Next.js 16 (App Router, next-intl), React 19, Supabase, Stripe, Jest.

**Spec :** `docs/superpowers/specs/2026-06-11-paliers-gratuit-pro-sans-essai-design.md`
**Branche :** `feat-paliers-gratuit-pro-sans-essai` (déjà créée, basée sur main post-PR #91).

**Note de périmètre :** les pages publiques `/disciplines/[slug]` restent ouvertes (SEO/marketing) ; l'enforcement par élément (et la limite stricte « 1 vidéo ») relèvera de **B2**. Ce lot gate l'expérience **dashboard**.

---

## Préambule

- [ ] **Lire les guides Next.js requis par `AGENTS.md`** (`node_modules/next/dist/docs/`) avant de coder (conventions App Router / Server vs Client Components).

---

## Structure des fichiers

**Créés :**
- `src/lib/content-access.ts` — constantes + helpers `canUseService` / `canAccessDiscipline` / `canAccessVideo`.
- `src/lib/content-access.test.ts` — tests unitaires.

**Modifiés :**
- `src/app/[locale]/dashboard/coach/page.tsx`, `.../smartwatch/page.tsx` — conservent le Paywall (PRO-only).
- `src/app/[locale]/dashboard/programme/page.tsx` — retire le Paywall, passe `isPro` au client.
- `src/app/[locale]/dashboard/programme/ProgrammeClient.tsx` — reçoit `isPro`, gate les disciplines non gratuites + l'affichage vidéos.
- `src/app/[locale]/dashboard/progression/page.tsx`, `.../notifications/page.tsx` — retirent le Paywall.
- `src/app/[locale]/dashboard/page.tsx` (overview) — retire le Paywall, masque les blocs PRO pour le gratuit, carte d'abonnement sans essai.
- `src/app/api/checkout/route.ts` — retrait `trial_period_days` + `trial_settings`.
- `src/lib/emails/index.ts` — email de bienvenue « actif » au lieu de « essai ».
- `src/components/home/Pricing.tsx` n'a pas besoin de changement structurel (les cartes viennent de l'i18n).
- `messages/fr.json`, `messages/en.json`, `messages/de.json` — cartes Gratuit/PRO + retrait messaging d'essai.
- `src/lib/legal.tsx` — CGV : garantie recadrée (sans « essai »).
- `src/components/home/Hero.tsx`, `StickyCheckout.tsx`, `HowItWorks.tsx` (et tout composant affichant un texte d'essai) — retrait des mentions d'essai (pilotées par i18n ; vérifier par grep).

---

## Task 1 : Module `content-access.ts` (cœur, TDD)

**Files:**
- Create: `src/lib/content-access.ts`
- Test: `src/lib/content-access.test.ts`

- [ ] **Step 1 : Écrire le test qui échoue** — `src/lib/content-access.test.ts`

```ts
import { canUseService, canAccessDiscipline, canAccessVideo, FREE_DISCIPLINE } from './content-access'
import type { Access } from './access'

const mk = (over: Partial<Access>): Access => ({
  role: 'free', isPro: false, isAdmin: false, status: null, plan: null,
  trialEnd: null, renewDate: null, cancelAtPeriodEnd: false, ...over,
})
const guest = mk({ role: 'guest' })
const free = mk({ role: 'free' })
const pro = mk({ role: 'pro', isPro: true, status: 'active' })
const admin = mk({ role: 'admin', isPro: true, isAdmin: true })

describe('content-access', () => {
  it('FREE_DISCIPLINE = musculation', () => {
    expect(FREE_DISCIPLINE).toBe('musculation')
  })

  describe('canUseService', () => {
    it('pro/admin : tous les services', () => {
      for (const s of ['coach', 'smartwatch', 'programme', 'progression', 'notifications']) {
        expect(canUseService(pro, s)).toBe(true)
        expect(canUseService(admin, s)).toBe(true)
      }
    })
    it('free : programme/progression/notifications oui, coach/smartwatch non', () => {
      expect(canUseService(free, 'programme')).toBe(true)
      expect(canUseService(free, 'progression')).toBe(true)
      expect(canUseService(free, 'notifications')).toBe(true)
      expect(canUseService(free, 'coach')).toBe(false)
      expect(canUseService(free, 'smartwatch')).toBe(false)
    })
    it('guest : aucun', () => {
      expect(canUseService(guest, 'programme')).toBe(false)
    })
  })

  describe('canAccessDiscipline', () => {
    it('free : seulement musculation', () => {
      expect(canAccessDiscipline(free, 'musculation')).toBe(true)
      expect(canAccessDiscipline(free, 'yoga')).toBe(false)
    })
    it('pro/admin : toutes', () => {
      expect(canAccessDiscipline(pro, 'yoga')).toBe(true)
      expect(canAccessDiscipline(admin, 'natation')).toBe(true)
    })
    it('guest : aucune', () => {
      expect(canAccessDiscipline(guest, 'musculation')).toBe(false)
    })
  })

  describe('canAccessVideo', () => {
    it('free : 1ʳᵉ vidéo de musculation seulement', () => {
      expect(canAccessVideo(free, 'musculation', 0)).toBe(true)
      expect(canAccessVideo(free, 'musculation', 1)).toBe(false)
      expect(canAccessVideo(free, 'yoga', 0)).toBe(false)
    })
    it('pro : toutes', () => {
      expect(canAccessVideo(pro, 'yoga', 3)).toBe(true)
    })
  })
})
```

- [ ] **Step 2 : Lancer, vérifier l'échec** — `npx jest content-access` → FAIL (module introuvable).

- [ ] **Step 3 : Implémenter** — `src/lib/content-access.ts`

```ts
import type { Access } from './access'

// Règles d'accès au contenu (palier unique gratuit + PRO).
// Source = constantes pour l'instant ; sera rebranché sur la base lors de B2.
export const FREE_DISCIPLINE = 'musculation'
export const FREE_VIDEO_COUNT = 1
export const PRO_ONLY_SERVICES = ['coach', 'smartwatch'] as const

// PRO/admin : accès total. Free : tout sauf les services PRO-only. Guest : rien.
export function canUseService(access: Access, key: string): boolean {
  if (access.isPro) return true
  if (access.role !== 'free') return false
  return !(PRO_ONLY_SERVICES as readonly string[]).includes(key)
}

export function canAccessDiscipline(access: Access, slug: string): boolean {
  if (access.isPro) return true
  if (access.role !== 'free') return false
  return slug === FREE_DISCIPLINE
}

export function canAccessVideo(access: Access, slug: string, index: number): boolean {
  if (access.isPro) return true
  if (access.role !== 'free') return false
  return slug === FREE_DISCIPLINE && index < FREE_VIDEO_COUNT
}
```

- [ ] **Step 4 : Lancer, vérifier le succès** — `npx jest content-access` → PASS. Puis `npx tsc --noEmit` → exit 0.

- [ ] **Step 5 : Commit**

```bash
git add src/lib/content-access.ts src/lib/content-access.test.ts
git commit -m "feat(access): module content-access (gating discipline/vidéo/service)"
```

---

## Task 2 : Wrappers serveur — gratuit accède à progression/notifications

**Files:**
- Modify: `src/app/[locale]/dashboard/progression/page.tsx`
- Modify: `src/app/[locale]/dashboard/notifications/page.tsx`
- (Inchangés : `coach/page.tsx` et `smartwatch/page.tsx` gardent leur Paywall. `programme/page.tsx` est traité en Task 3, avec `ProgrammeClient`, pour que tsc compile par task.)

- [ ] **Step 1 : `progression/page.tsx`** — accessible au gratuit (login déjà garanti par le layout) :

```tsx
import { ProgressionClient } from './ProgressionClient'

export default function Page() {
  return <ProgressionClient />
}
```

- [ ] **Step 2 : `notifications/page.tsx`** — idem :

```tsx
import { NotificationsClient } from './NotificationsClient'

export default function Page() {
  return <NotificationsClient />
}
```

- [ ] **Step 3 : Vérifier** — `npx tsc --noEmit` → exit 0 ; `npx eslint "src/app/[locale]/dashboard/progression/page.tsx" "src/app/[locale]/dashboard/notifications/page.tsx"` → exit 0.

- [ ] **Step 4 : Commit**

```bash
git add "src/app/[locale]/dashboard/progression/page.tsx" "src/app/[locale]/dashboard/notifications/page.tsx"
git commit -m "feat(access): gratuit accède à progression/notifications (sans paywall)"
```

---

## Task 3 : Gating des disciplines dans `ProgrammeClient` (+ son wrapper)

**Files:**
- Modify: `src/app/[locale]/dashboard/programme/page.tsx`
- Modify: `src/app/[locale]/dashboard/programme/ProgrammeClient.tsx`

But : un gratuit ne voit le **programme** que pour Musculation ; les autres disciplines affichent un cadenas dans les onglets et, si sélectionnées, un encart « Passe à PRO » ; la vignette vidéos indique le nombre gratuit.

- [ ] **Step 0 : Wrapper `programme/page.tsx`** — retirer le Paywall et passer `isPro` au client :

```tsx
import { getAccess } from '@/lib/access'
import { ProgrammeClient } from './ProgrammeClient'

export default async function Page() {
  const access = await getAccess()
  return <ProgrammeClient isPro={access.isPro} />
}
```

- [ ] **Step 1 : Imports + signature** — en tête, ajouter l'icône `Lock` et les constantes ; changer la signature exportée :

```tsx
import { CheckCircle, Circle, Play, ArrowRight, Lock } from 'lucide-react'
import { FREE_DISCIPLINE, FREE_VIDEO_COUNT } from '@/lib/content-access'
import { Link } from '@/i18n/navigation'
```

Et :

```tsx
export function ProgrammeClient({ isPro }: { isPro: boolean }) {
  return <Suspense fallback={<div className="p-8 text-sport-gray text-sm" />}><ProgrammeContent isPro={isPro} /></Suspense>
}
```

- [ ] **Step 2 : `ProgrammeContent` reçoit `isPro` et calcule l'accès** — changer la signature et ajouter le calcul :

```tsx
function ProgrammeContent({ isPro }: { isPro: boolean }) {
  const t = useTranslations('dashboard.programme')
  const searchParams = useSearchParams()
  const initialSlug = searchParams.get('discipline') ?? 'running-cardio'

  const [selected, setSelected] = useState(initialSlug)
  // ... (états existants inchangés)

  const content = DISCIPLINE_CONTENT[selected]
  const unlocked = (slug: string) => isPro || slug === FREE_DISCIPLINE
  const selectedUnlocked = unlocked(selected)
```

- [ ] **Step 3 : Onglets avec cadenas** — remplacer le bloc des onglets (la `<div className="flex gap-2 flex-wrap mb-8">…`) par :

```tsx
      {/* Discipline tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {DISCIPLINES.map(d => {
          const locked = !unlocked(d.slug)
          return (
            <button
              key={d.slug}
              onClick={() => setSelected(d.slug)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border inline-flex items-center gap-1.5 ${
                selected === d.slug
                  ? COLOR[d.color]
                  : 'border-sport-border text-sport-gray hover:text-white hover:border-sport-gray bg-transparent'
              }`}
            >
              {locked && <Lock size={11} aria-hidden="true" />}
              {t(`disciplines.${d.slug}`)}
            </button>
          )
        })}
      </div>
```

- [ ] **Step 4 : Encart upgrade si discipline verrouillée** — juste après les onglets, court-circuiter le rendu du contenu : remplacer tout le bloc à partir de `{/* Progress bar */}` jusqu'à la fin du `return` par un branchement. Concrètement, insérer ce bloc AVANT `{/* Progress bar */}` et envelopper le reste dans `selectedUnlocked && (...)` :

```tsx
      {!selectedUnlocked && (
        <div className="rounded-2xl border border-sport-border bg-sport-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sport-orange/15 border border-sport-orange/30">
            <Lock size={20} className="text-sport-orange" aria-hidden="true" />
          </div>
          <p className="text-lg font-black text-white mb-1">{t('lockedTitle')}</p>
          <p className="text-sport-gray text-sm mb-5">{t('lockedSubtitle', { name: t(`disciplines.${selected}`) })}</p>
          <Link href="/dashboard/abonnement" className="inline-flex items-center gap-2 rounded-full bg-sport-orange px-5 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-all">
            {t('lockedCta')} <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      )}

      {selectedUnlocked && (<>
      {/* Progress bar */}
      ... (TOUT le contenu existant à partir de "Progress bar" jusqu'au dernier bloc "Program weeks") ...
      </>)}
```

(Le contenu interne — barre de progression, vignette vidéos, semaines — reste identique ; il est juste enveloppé dans `selectedUnlocked && (<>…</>)`.)

- [ ] **Step 5 : Vignette vidéos — compte gratuit** — dans le bloc « Videos quick link », adapter le nombre affiché pour un gratuit (1 vidéo) :

```tsx
      {content?.videos && content.videos.length > 0 && (
        <Link
          href={`/disciplines/${selected}`}
          className="flex items-center justify-between bg-sport-card border border-sport-border rounded-xl px-5 py-4 mb-6 hover:border-sport-orange/50 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sport-orange/15 rounded-lg flex items-center justify-center">
              <Play size={14} className="text-sport-orange ml-0.5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{t('videosAvailable', { count: isPro ? content.videos.length : FREE_VIDEO_COUNT })}</p>
              <p className="text-[11px] text-sport-gray">{isPro ? t('videosSubtitle') : t('videosFreeHint')}</p>
            </div>
          </div>
          <ArrowRight size={14} className="text-sport-gray group-hover:text-sport-orange transition-colors" />
        </Link>
      )}
```

- [ ] **Step 6 : Clés i18n** — ajouter sous `dashboard.programme` dans `messages/fr.json`, `en.json`, `de.json` : `lockedTitle`, `lockedSubtitle` (avec `{name}`), `lockedCta`, `videosFreeHint`. FR :

```json
"lockedTitle": "Réservé aux abonnés PRO",
"lockedSubtitle": "{name} fait partie des disciplines PRO. Passe à PRO pour débloquer les 10 disciplines.",
"lockedCta": "Passer à PRO",
"videosFreeHint": "Aperçu gratuit · plus de vidéos avec PRO",
```

EN :

```json
"lockedTitle": "PRO members only",
"lockedSubtitle": "{name} is a PRO discipline. Go PRO to unlock all 10 disciplines.",
"lockedCta": "Upgrade to PRO",
"videosFreeHint": "Free preview · more videos with PRO",
```

DE :

```json
"lockedTitle": "Nur für PRO-Mitglieder",
"lockedSubtitle": "{name} ist eine PRO-Disziplin. Hol dir PRO, um alle 10 Disziplinen freizuschalten.",
"lockedCta": "Auf PRO upgraden",
"videosFreeHint": "Kostenlose Vorschau · mehr Videos mit PRO",
```

- [ ] **Step 7 : Vérifier** — `npx tsc --noEmit` → exit 0 ; `npx jest messages` → PASS (parité) ; `npx eslint "src/app/[locale]/dashboard/programme/ProgrammeClient.tsx"` → exit 0.

- [ ] **Step 8 : Commit**

```bash
git add "src/app/[locale]/dashboard/programme" messages/fr.json messages/en.json messages/de.json
git commit -m "feat(access): Programme — Musculation gratuite, autres disciplines PRO (cadenas + upgrade)"
```

---

## Task 4 : Accueil (overview) — accès gratuit, sans essai, blocs PRO masqués

**Files:**
- Modify: `src/app/[locale]/dashboard/page.tsx`

- [ ] **Step 1 : Retirer le garde Paywall** — supprimer ces lignes (ajoutées en PR #91) :

```tsx
  // Contenu réservé aux abonnés (essai/actif) ; les non-abonnés voient le paywall.
  const access = await getAccess()
  if (!access.isPro) return <Paywall />
```

et les remplacer par (on garde `access` pour conditionner l'affichage) :

```tsx
  const access = await getAccess()
```

(Garder les imports `getAccess` ; retirer l'import `Paywall` s'il n'est plus utilisé → sinon eslint warning.)

- [ ] **Step 2 : Masquer le bloc activité montre/Apple Fitness pour le gratuit** — entourer le composant `<TodayActivity .../>` d'une condition `access.isPro` :

```tsx
      {access.isPro && (
        <TodayActivity
          initialSteps={todaySteps}
          initialActiveSec={todayActiveSec}
          weekly={weekly}
          dateLabel={dateLabel}
        />
      )}
```

- [ ] **Step 3 : Carte d'abonnement sans essai** — le bloc « Subscription card » référence `daysLeft`/`trialing`. Remplacer son contenu conditionnel par : pour un gratuit (`!access.isPro`), afficher un CTA « Passe à PRO » ; pour PRO actif, afficher le renouvellement. Remplacer le bloc interne `<div>… StatusBadge … daysLeft … renewDate …</div>` par :

```tsx
          <div>
            <div className="flex items-center gap-3 mb-3">
              <StatusBadge status={access.isPro ? 'active' : 'free'} label={access.isPro ? t('statusShort.active') : t('overview.freeBadge')} />
              <span className="text-[11px] text-sport-gray font-semibold uppercase tracking-wider">
                {t('overview.plan', { plan: access.isPro ? 'Pro' : t('overview.freePlan') })}
              </span>
            </div>
            {access.isPro && renewDate && (
              <p className="text-sm text-sport-gray">
                {t.rich('overview.renewOn', { date: renewDate, o: (c) => <strong className="text-white">{c}</strong> })}
              </p>
            )}
            {!access.isPro && (
              <p className="text-sm text-white font-semibold">{t('overview.freeUpsell')}</p>
            )}
          </div>
```

(Ajouter `'free'` au map `STATUS_CLS` : `free: 'bg-white/10 text-sport-gray border-sport-border'`. Les variables `daysLeft`, `status`, `trialEnd` devenues inutilisées doivent être retirées pour éviter les warnings eslint — supprimer leurs déclarations.)

- [ ] **Step 4 : Clés i18n overview** — ajouter sous `dashboard.overview` (fr/en/de) : `freeBadge`, `freePlan`, `freeUpsell`. FR : `"freeBadge": "Gratuit"`, `"freePlan": "Gratuit"`, `"freeUpsell": "Passe à PRO pour débloquer toutes les disciplines, le coach IA et la montre connectée."`. EN : `"freeBadge": "Free"`, `"freePlan": "Free"`, `"freeUpsell": "Go PRO to unlock all disciplines, the AI coach and smartwatch sync."`. DE : `"freeBadge": "Kostenlos"`, `"freePlan": "Kostenlos"`, `"freeUpsell": "Hol dir PRO für alle Disziplinen, den KI-Coach und die Smartwatch-Synchronisierung."`.

- [ ] **Step 5 : Vérifier** — `npx tsc --noEmit` ; `npx jest messages` ; `npx eslint "src/app/[locale]/dashboard/page.tsx"` (zéro warning unused-var).

- [ ] **Step 6 : Commit**

```bash
git add "src/app/[locale]/dashboard/page.tsx" messages/fr.json messages/en.json messages/de.json
git commit -m "feat(access): accueil accessible au gratuit (blocs PRO masqués, carte abo sans essai)"
```

---

## Task 5 : Checkout — retrait de l'essai (débit immédiat)

**Files:**
- Modify: `src/app/api/checkout/route.ts`

- [ ] **Step 1 : Retirer l'essai** — dans `subscription_data`, supprimer `trial_period_days: 7` et tout le bloc `trial_settings: { ... }`. Le `subscription_data` ne garde que `metadata`. Avant :

```ts
      subscription_data: {
        trial_period_days: 7,
        trial_settings: {
          end_behavior: { missing_payment_method: 'cancel' },
        },
        metadata: { plan, period, locale, user_id: userId ?? '' },
      },
```

Après :

```ts
      subscription_data: {
        metadata: { plan, period, locale, user_id: userId ?? '' },
      },
```

(Conserver `payment_method_collection: 'always'` : la carte reste requise pour le débit immédiat. Le commentaire au-dessus mentionnant l'essai peut être mis à jour.)

- [ ] **Step 2 : Vérifier** — `npx tsc --noEmit` → exit 0 ; `npx eslint src/app/api/checkout/route.ts` → exit 0.

- [ ] **Step 3 : Commit**

```bash
git add src/app/api/checkout/route.ts
git commit -m "feat(billing): PRO sans essai — débit immédiat à l'abonnement"
```

---

## Task 6 : Email de bienvenue — « abonnement actif » au lieu d'« essai »

**Files:**
- Modify: `src/lib/emails/index.ts`

- [ ] **Step 1 : Remplacer le sujet + intro (EN et FR)** dans `sendWelcomeEmail` (objet `c`). Remplacer :

```ts
  const c = en ? {
    subject: `Welcome to Xenotif® — your ${planLabel} trial starts now!`,
    h1: `Welcome${first ? `, ${first}` : ''}! 💪`,
    intro: `Your <strong style="color:#fff;">7-day</strong> free trial on the <strong style="color:#F97316;">${planLabel} plan</strong> has just begun. No charge until the trial period ends.`,
```

par :

```ts
  const c = en ? {
    subject: `Welcome to Xenotif® — your ${planLabel} membership is active!`,
    h1: `Welcome${first ? `, ${first}` : ''}! 💪`,
    intro: `Your <strong style="color:#F97316;">${planLabel} membership</strong> is now active. Welcome aboard — let's get to work!`,
```

et le bloc FR, remplacer :

```ts
    subject: `Bienvenue sur Xenotif® — ton essai ${planLabel} commence !`,
    h1: `Bienvenue${first ? `, ${first}` : ''} ! 💪`,
    intro: `Ton essai gratuit de <strong style="color:#fff;">7 jours</strong> sur le <strong style="color:#F97316;">Plan ${planLabel}</strong> vient de commencer. Aucun débit avant la fin de la période d'essai.`,
```

par :

```ts
    subject: `Bienvenue sur Xenotif® — ton abonnement ${planLabel} est actif !`,
    h1: `Bienvenue${first ? `, ${first}` : ''} ! 💪`,
    intro: `Ton <strong style="color:#F97316;">abonnement ${planLabel}</strong> est maintenant actif. Bienvenue — au travail !`,
```

- [ ] **Step 2 : Vérifier** — `npx tsc --noEmit` → exit 0. (`sendTrialReminderEmail` reste défini mais n'est plus déclenché — laisser ; pas de régression.)

- [ ] **Step 3 : Commit**

```bash
git add src/lib/emails/index.ts
git commit -m "feat(emails): bienvenue 'abonnement actif' (retrait du discours d'essai)"
```

---

## Task 7 : Messaging i18n + cartes + CGV (retrait de l'essai, carte Gratuit = Musculation)

**Files:**
- Modify: `messages/fr.json`, `messages/en.json`, `messages/de.json`
- Modify: `src/lib/legal.tsx`

- [ ] **Step 1 : Localiser toutes les mentions d'essai/0 €** — exécuter et traiter chaque occurrence :

Run: `grep -rniE "essai|trial|7 jours|7 days|7 Tage|0 ?€|0 ?€ aujourd|sans carte|no card|ohne Karte" messages/ src/lib/legal.tsx`

- [ ] **Step 2 : Carte Gratuit (features réelles = Musculation)** — dans `home.pricing.plans[0]` et `auth.signup.plans[0]` (fr/en/de), remplacer les features par :
  - FR pricing : `["Discipline Musculation (programme + 1 vidéo)", "Suivi de progression", "Rappels & notifications", "Sans carte"]` ; signup : `["Musculation", "Suivi de progression", "Sans carte"]`.
  - EN pricing : `["Strength Training discipline (program + 1 video)", "Progress tracking", "Reminders & notifications", "No card"]` ; signup : `["Strength Training", "Progress tracking", "No card"]`.
  - DE pricing : `["Krafttraining (Programm + 1 Video)", "Fortschritts-Tracking", "Erinnerungen & Benachrichtigungen", "Ohne Karte"]` ; signup : `["Krafttraining", "Fortschritts-Tracking", "Ohne Karte"]`.
  - Mettre à jour la `description` de la carte Gratuit (pricing) : FR `"Commence gratuitement avec la Musculation. Passe à PRO pour tout débloquer."` · EN `"Start free with Strength Training. Go PRO to unlock everything."` · DE `"Starte kostenlos mit Krafttraining. Hol dir PRO, um alles freizuschalten."`.

- [ ] **Step 3 : Carte PRO — retrait essai** — dans `home.pricing.plans` (entrée PRO) et `auth.signup.plans` (entrée PRO) :
  - CTA `cta` : FR `"S'abonner"` · EN `"Subscribe"` · DE `"Abonnieren"` (au lieu de « Essai gratuit 7 jours »).

- [ ] **Step 4 : Sous-titre + notes tarifs (fr/en/de)** :
  - `home.pricing.subtitle` : retirer « Essai gratuit 7 jours … 0 € aujourd'hui ». FR → `"Un seul abonnement, tout l'entraînement Xenotif®. Sans engagement, annulable en 1 clic."` · EN → `"One subscription, all of Xenotif®. No commitment, cancel in 1 click."` · DE → `"Ein Abo, ganz Xenotif®. Ohne Verpflichtung, jederzeit kündbar."`.
  - `home.pricing.freeTrialNote` : remplacer par une note sans engagement. FR → `"✓ Sans engagement · annulable en 1 clic"` · EN → `"✓ No commitment · cancel in 1 click"` · DE → `"✓ Ohne Verpflichtung · jederzeit kündbar"`.

- [ ] **Step 5 : Sticky / Hero / HowItWorks** — pour chaque clé trouvée au Step 1 dans `home.sticky`, `home.hero`, `home.howItWorks`, `home.cta` mentionnant l'essai/0 €/sans carte, reformuler en « sans engagement, annulable en 1 clic » (et retirer la promesse « 0 € aujourd'hui »/« sans carte » côté PRO). Garder le wording cohérent fr/en/de. (Lire chaque chaîne avant de la réécrire ; ne pas casser les variables/`<b>` éventuelles.)

- [ ] **Step 6 : CGV (`src/lib/legal.tsx`)** — retirer la référence à l'essai dans la garantie. FR : remplacer `(pour un abonnement : le premier débit après la période d'essai gratuite)` par `(pour un abonnement : ton premier paiement)`. EN : remplacer `(for a subscription: the first charge after the free trial)` par `(for a subscription: your first payment)`. Traiter toute autre mention « essai/trial » trouvée au Step 1 dans `legal.tsx`.

- [ ] **Step 7 : Vérifier** — `node -e "for(const l of['fr','en','de'])JSON.parse(require('fs').readFileSync('messages/'+l+'.json','utf8'));console.log('JSON OK')"` → `JSON OK` ; `npx jest messages` → PASS (parité) ; `npx tsc --noEmit` ; `npx eslint src`. Puis re-grep du Step 1 : il ne doit plus rester de promesse d'essai 7 jours / 0 € côté PRO (les « sans carte » restants ne concernent QUE la carte Gratuit, ce qui est correct).

- [ ] **Step 8 : Commit**

```bash
git add messages/fr.json messages/en.json messages/de.json src/lib/legal.tsx
git commit -m "i18n+legal: retrait de l'essai 7 jours, carte Gratuit = Musculation, discours PRO sans engagement"
```

---

## Task 8 : Vérification finale

- [ ] **Step 1 : Suite complète + types + lint + build**

Run:
```bash
npx jest && npx tsc --noEmit && npx eslint src && npm run build
```
Expected: tests verts (dont `content-access`, `access`, `messages`), tsc/eslint exit 0, build OK.

- [ ] **Step 2 : Vérif manuelle (preview)** :
  - Compte **gratuit** : Programme → Musculation accessible, 9 autres disciplines cadenassées (encart upgrade) ; Progression + Notifications accessibles ; Coach IA + Montre → Paywall ; Accueil sans bloc Apple Fitness, carte « Gratuit · Passe à PRO ».
  - Compte **PRO actif** : tout accessible.
  - **Checkout PRO** : redirige vers Stripe **sans mention d'essai**, débit immédiat (plus de `trial_period_days`).
  - Page tarifs/signup : carte Gratuit = Musculation ; carte PRO « S'abonner », aucune mention « essai 7 jours »/« 0 € aujourd'hui ».

- [ ] **Step 3 : (si ajustements)** commit, puis push + PR.

---

## Notes
- DRY : `content-access.ts` est la seule source des règles ; les pages/clients ne dupliquent pas la logique (le client `ProgrammeClient` reçoit `isPro` et utilise les constantes).
- YAGNI : pas de migration DB ici (c'est B2). Pas d'enforcement sur les pages publiques `/disciplines` (SEO).
- Frequent commits : un commit par task.
