# Nouveau modèle de paliers : Gratuit limité + PRO illimité sans essai

- **Date** : 2026-06-11
- **Statut** : design validé, prêt pour le plan d'implémentation
- **Position** : sous-projet **#5** (incrémental « (i) ») d'un chantier plus large « bibliothèque de contenu B2 » (les sous-projets #1–#4 = schéma, migration, bascule du rendu, back-office, viendront **ensuite**, voir « Suite »).

## Contexte

Fait suite au socle d'accès PRO (PR #91, mergée) : `src/lib/access.ts` (`getAccess`/`deriveAccess`/`requirePro`, rôles `guest/free/pro/admin`, `isPro = status ∈ {active,trialing}`). Aujourd'hui le dashboard applique un **paywall total** (free = aucun accès) et l'abonnement PRO a un **essai gratuit de 7 jours** (carte requise, débit auto à J+7).

Ce sous-projet **inverse** ces deux points, sur décision produit de l'utilisateur :
- Le **palier Gratuit** donne un **accès limité réel** (échantillon).
- L'**essai 7 jours est supprimé** : PRO devient un abonnement payant **débité immédiatement**.

Le contenu (10 disciplines + programmes + vidéos) est **statique** (`src/lib/disciplines.ts` + `.en.ts` + `.de.ts`) et le reste pour ce lot. Les règles d'accès passent par un **module dédié** `content-access.ts` (constantes aujourd'hui), seam qui sera rebranché sur la base lors de B2.

## Décisions produit (verrouillées)

| | **Gratuit** (compte gratuit, sans carte) | **PRO** (9,99 €/mois, **sans essai**, débit immédiat) |
|---|---|---|
| Programme | **Musculation uniquement** : son programme + sa **1ʳᵉ vidéo** | Les 10 disciplines, toutes les vidéos |
| Progression | ✅ (suivi de ses propres séances) | ✅ |
| Notifications / rappels | ✅ | ✅ |
| Coach IA | 🔒 PRO | ✅ |
| Montre connectée | 🔒 PRO | ✅ |
| Accueil (overview) | ✅ (widgets PRO masqués) | ✅ complet |

- 2 paliers seulement : **Gratuit + PRO**.
- Upgrade vers PRO = accès illimité.

## Architecture

### 1. Module de gating — `src/lib/content-access.ts` (nouveau)

Source unique des règles d'accès au contenu (constantes ; futur seam B2). Helpers **purs** prenant un `Access` (cf. `access.ts`) :

```ts
export const FREE_DISCIPLINE = 'musculation'
export const FREE_VIDEO_COUNT = 1
export const PRO_ONLY_SERVICES = ['coach', 'smartwatch'] as const

// pro/admin : tout ; free : selon les règles ci-dessous ; guest : false
export function canUseService(access: Access, key: string): boolean
export function canAccessDiscipline(access: Access, slug: string): boolean
export function canAccessVideo(access: Access, slug: string, index: number): boolean
```

Règles (free) : `canUseService` = `key ∉ PRO_ONLY_SERVICES` ; `canAccessDiscipline` = `slug === FREE_DISCIPLINE` ; `canAccessVideo` = `slug === FREE_DISCIPLINE && index < FREE_VIDEO_COUNT`. (admin/pro → toujours `true` ; guest → `false`.)

### 2. Accès par page (remplace le paywall total)

Les wrappers serveur posés en PR #91 changent ainsi :

| Page | Gratuit | Mécanisme |
|---|---|---|
| `coach` | 🔒 Paywall | wrapper `if (!isPro) <Paywall/>` |
| `smartwatch` | 🔒 Paywall | wrapper `if (!isPro) <Paywall/>` |
| `programme` | ✅ (Musculation seule) | wrapper rend le client ; gating **par discipline/vidéo** dans le client |
| `progression` | ✅ | wrapper sans paywall (rend le client) |
| `notifications` | ✅ | wrapper sans paywall |
| `dashboard` (overview) | ✅ (widgets PRO masqués) | garde, mais sans paywall ; masque les blocs PRO (anneaux Apple Fitness / smartwatch) pour le gratuit |

`/api/coach` conserve `requirePro()` (déjà en place).

### 3. Gating du contenu dans `programme`

`ProgrammeClient` reçoit du wrapper serveur les infos d'accès (`isPro` + `freeDiscipline`). Pour un gratuit :
- onglets de discipline : Musculation active ; les 9 autres affichent un **cadenas** et, au clic, un encart « Passe à PRO » au lieu du contenu ;
- la vignette « vidéos » ne propose que la 1ʳᵉ vidéo de Musculation (les autres → cadenas/upgrade).

### 4. Retrait de l'essai (facturation)

- `src/app/api/checkout/route.ts` : retirer `subscription_data.trial_period_days: 7` et `trial_settings`. Conserver `payment_method_collection: 'always'` (carte requise pour débiter). L'abonnement démarre **`active`** et est débité immédiatement.
- `src/app/api/webhook/stripe/route.ts` : avec `trial_end` nul, le rappel d'essai (`daysLeft === 3 → sendTrialReminderEmail`) ne se déclenche plus — laisser inerte (pas de régression).
- `src/lib/emails/index.ts` (`sendWelcomeEmail`) : remplacer le discours « ton essai de 7 jours démarre » par « ton abonnement PRO est actif ». (`sendTrialReminderEmail` devient inutilisé → laisser ou retirer, sans risque.)
- `getAccess` reste correct (`active` ⇒ `isPro`).

### 5. Messaging / i18n / CGV (fr/en/de)

Retrait de « essai gratuit 7 jours » et « 0 € aujourd'hui » **partout** :
- `messages/*.json` : `home.pricing.subtitle`, `home.pricing.freeTrialNote`, cartes `plans` (PRO : CTA « S'abonner » au lieu de « Essai gratuit 7 jours »), `auth.signup` (wording paiement), `home.sticky` (note d'essai), `home.hero`/`home.howItWorks`/`home.cta` (notes « 0 € / sans carte / essai »), `dashboard.overview` (retrait `trialDaysLeft`), `dashboard.abonnement` (références essai).
- Nouveau discours PRO : « 9,99 €/mois · sans engagement · annulable en 1 clic ».
- **Carte Gratuit** (`home.pricing.plans[0]`, `auth.signup.plans[0]`) : features réelles → « Musculation : programme + 1 vidéo », « Suivi de progression », « Rappels & notifications », « Sans carte ». CTA « Commencer gratuitement ».
- **CGV** (`src/lib/legal.tsx`, FR + EN) : la garantie « satisfait ou remboursé 30 j » référence le « 1ᵉʳ débit après la période d'essai » → recadrer en « ton paiement ». Retirer les mentions d'essai.

⚠️ Cohérence avec [[project-billing]] : le discours « sans carte » avait été corrigé (la carte EST requise). On reste honnête : PRO = **carte requise + débit immédiat**, pas d'essai.

### 6. Accueil & abonnement (dashboard)

- `dashboard/page.tsx` (overview) : retirer le garde paywall (le gratuit y accède) ; masquer pour le gratuit les blocs PRO (activité montre/Apple Fitness) ; la carte d'abonnement affiche « Compte gratuit — Passe à PRO » (gratuit) ou le renouvellement (PRO), sans « jours d'essai ».
- `dashboard/abonnement/page.tsx` : retirer les références à l'essai ; pour un gratuit, afficher un CTA « Passer à PRO ».

## Modèle de données

**Aucun changement de schéma.** Règles en constantes (`content-access.ts`). Le contenu reste statique. (B2 introduira les tables + `min_plan`.)

## Cas limites

| Cas | Comportement |
|---|---|
| Non connecté | redirigé vers signin (layout) |
| Connecté sans abo (free) | accès limité : Musculation + Progression + Notifications + overview (widgets PRO masqués) ; coach/smartwatch → Paywall |
| `active` (PRO) | accès total |
| `past_due` | non-PRO → traité comme free (accès limité) ; peut régler sa carte via `abonnement` |
| Admin | accès total |
| Reliquat `trialing` (abo créé avant ce lot) | `isPro` true → accès complet (pas de régression pour un éventuel essai en cours) |

## Tests & vérification

- **Tests unitaires** `content-access.test.ts` : `canUseService`/`canAccessDiscipline`/`canAccessVideo` pour guest/free/pro/admin (Musculation free vs autres lockées, 1ʳᵉ vidéo free vs suivantes lockées, coach/smartwatch PRO-only).
- La suite `access` reste verte ; `messages.test.ts` (parité fr/en/de) reste verte.
- `tsc` + `eslint` + `next build` ✅.
- Vérif manuelle : compte gratuit → Musculation accessible, autres disciplines lockées, coach/montre → Paywall, progression/notifications OK ; checkout PRO → débit immédiat (plus d'essai) ; aucune mention « essai 7 jours » sur le site.

## Suite (hors de ce lot) — B2

Une fois ce lot livré, construire la **bibliothèque de contenu** en sous-projets dédiés (chacun son spec → plan) :
1. Schéma `disciplines`/`programs`/`videos` (+ exercices/nutrition/bonus) avec `min_plan` + locales.
2. Migration des données existantes (`disciplines.ts`/`.en`/`.de`) vers la base.
3. Bascule du rendu (dashboard + pages publiques `/disciplines` + accueil) sur la base, gestion SSG/ISR (cf. [[project-perf-ssg]]).
4. Back-office d'édition (CRUD contenu + `min_plan` + 3 langues).

À ce moment, `content-access.ts` lira `min_plan` depuis la base au lieu des constantes — le reste du code (helpers, pages) ne changera pas.
