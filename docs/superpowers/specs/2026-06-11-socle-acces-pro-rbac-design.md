# Socle d'accès PRO (RBAC) — suppression d'ÉLITE & alignement des promesses

- **Date** : 2026-06-11
- **Statut** : design validé, prêt pour le plan d'implémentation
- **Sous-projet** : #1 d'un chantier plus large (voir « Décomposition » en fin de doc)

## Contexte (résultat de l'audit)

Le site XENOTIF vend deux paliers payants (PRO 9,99 €/mois, ÉLITE 24,99 €/mois) + un palier
Gratuit affiché sur la page tarifs. L'audit a révélé :

- **Aucun contrôle d'accès par plan.** Le seul verrou, partout, est « être connecté »
  (`if (!user) redirect` dans `dashboard/layout.tsx`). Pas de middleware, aucun check de
  `plan` ni de `status`.
- **Conséquences** : un compte gratuit accède à tout le dashboard ; un résilié/expiré garde
  l'accès complet ; **PRO et ÉLITE livrent exactement la même chose**.
- **Promesses vs réel** :
  - *Existe mais non verrouillé* : programmes (10 disciplines), coach IA (`/api/coach`),
    suivi/stats, vidéos.
  - *Promis mais inexistant* : coach personnel dédié, bilan visio 1-1, plan nutrition sur
    mesure, analyse biomécanique vidéo, accès anticipé (côté ÉLITE) ; support prioritaire
    7j/7, challenges communautaires (côté PRO).
- `subscriptions` (Supabase) stocke `plan` (`pro`/`elite`), `status`
  (`trialing`/`active`/`canceled`/`past_due`), `trial_end`, `current_period_end`,
  `cancel_at_period_end`, ids Stripe. La table est protégée par RLS (lecture service-role).
- `admin_users` identifie les admins.
- Le contenu (programmes + vidéos) est **statique**, codé en dur dans `src/lib/disciplines.ts`
  et servi aussi sur des pages publiques `/disciplines/[slug]`.

## Décisions produit (verrouillées avec l'utilisateur)

1. **Supprimer le plan ÉLITE.** Un seul palier payant : **PRO**. Aucune migration (aucun
   abonné ÉLITE actuel ; bascule rendue sûre malgré tout).
2. **Rôles : Gratuit / PRO / Admin.** Accès au contenu PRO = statut `trialing` ou `active`.
3. **Paywall total** : le dashboard (contenu) est réservé aux abonnés ; un utilisateur gratuit
   voit un écran « Passe à PRO ». L'essai gratuit 7 jours (`trialing`) donne déjà l'accès complet.
4. **Aligner les promesses PRO** sur le produit réel (retirer/recadrer les features inexistantes).

## Objectif de ce sous-projet

Garantir que le contenu PRO est réellement réservé aux abonnés (essai ou actif), supprimer
proprement ÉLITE de bout en bout, et rendre les pages de vente honnêtes. À lui seul, ce socle
atteint l'objectif central : **accès payant réel + promesses tenables**.

## Architecture

### 1. Modèle d'accès — `src/lib/access.ts` (nouveau, serveur uniquement)

Source de vérité unique. Le **rôle est déduit** des données d'abonnement (jamais stocké, pour
éviter toute désynchronisation).

```ts
export type Role = 'guest' | 'free' | 'pro' | 'admin'

export type Access = {
  role: Role
  isPro: boolean            // a accès au contenu réservé
  isAdmin: boolean
  status: string | null     // trialing | active | canceled | past_due | null
  plan: string | null       // normalisé : 'pro' (toute valeur 'elite' legacy ⇒ 'pro')
  trialEnd: Date | null
  renewDate: Date | null    // current_period_end
  cancelAtPeriodEnd: boolean
}

// Lit l'utilisateur (createClient) + subscriptions (service-role) + admin_users.
export async function getAccess(): Promise<Access>
```

**Règle d'accès** : `isPro = status ∈ {'active','trialing'}`.
- `past_due` ⇒ non-PRO (voit le paywall, mais peut régler sa carte via `abonnement`).
- `cancel_at_period_end = true` ⇒ reste `active` jusqu'à la fin de période, donc accès maintenu
  jusqu'à l'échéance (comportement Stripe standard).
- **Admin** (présent dans `admin_users`) ⇒ `role = 'admin'`, `isPro = true` (accès total).
- Non connecté ⇒ `role = 'guest'`.
- Connecté sans abonnement actif/essai ⇒ `role = 'free'`.

**Helper API** : `requirePro()` (dans `access.ts` ou un module voisin) pour les routes :
renvoie l'`Access` si PRO, sinon une `Response` 403 prête à retourner.

### 2. Application du verrou + Paywall

**Pages PRO gatées** (rendent `<Paywall/>` si non-PRO) :
`dashboard` (overview), `dashboard/coach`, `dashboard/programme`, `dashboard/progression`,
`dashboard/smartwatch`, `dashboard/notifications`.

**Pattern** : chaque page devient un **fin wrapper serveur** qui appelle `getAccess()` et rend
soit le contenu, soit le paywall :

```tsx
// dashboard/programme/page.tsx (serveur)
import { getAccess } from '@/lib/access'
import { Paywall } from '@/components/dashboard/Paywall'
import { ProgrammeClient } from './ProgrammeClient'

export default async function Page() {
  const access = await getAccess()
  if (!access.isPro) return <Paywall />
  return <ProgrammeClient />
}
```

Les composants client actuels (`programme/page.tsx`, `coach/page.tsx`, `progression/page.tsx`,
`smartwatch/...`) sont renommés en `XxxClient.tsx` et importés par le wrapper serveur.
`dashboard/page.tsx` est déjà un composant serveur → on y ajoute simplement le check.

**Pages NON gatées** (connexion seule, pas de paywall) : `dashboard/abonnement`,
`dashboard/profil`. **Crucial** : un abonné résilié/expiré doit pouvoir revenir s'abonner et
gérer sa carte.

**Nouveau composant** `src/components/dashboard/Paywall.tsx` :
écran « Passe à PRO pour tout débloquer » + liste des bénéfices (section 4) + CTA vers le
checkout (réutilise le flux signup/checkout existant, `?plan=pro`). Textes i18n fr/en/de.

**APIs PRO** : appliquer `requirePro()` sur `/api/coach` (livre du contenu PRO). Auditer les
autres routes serveur qui exposent du contenu réservé et les protéger de la même façon.
(Les écritures `progress`/`progression` passent par le client Supabase avec RLS par `user_id`
= données personnelles de l'utilisateur, hors périmètre du verrou PRO.)

### 3. Suppression d'ÉLITE (de bout en bout)

**UI / marketing** :
- `src/components/home/Pricing.tsx` (+ tableau `PLANS`) : retirer la carte ÉLITE.
- `src/components/home/IntensityLevels.tsx`, `src/components/home/StickyCheckout.tsx`.
- `src/app/[locale]/auth/signup/page.tsx` : retirer la gestion `?plan=elite`.
- `src/app/[locale]/success/page.tsx`.
- `src/app/[locale]/dashboard/page.tsx`, `.../abonnement/page.tsx`, `.../progression/page.tsx`.
- `src/components/layout/Footer.tsx`.
- `src/lib/emails/index.ts`.

**APIs** :
- `src/app/api/checkout/route.ts`, `subscription/route.ts`, `subscription/sync/route.ts`,
  `webhook/stripe/route.ts` : retirer la gestion du prix ÉLITE.
- **Filet de sécurité** : toute souscription dont le plan résoudrait à `elite` est normalisée
  en `pro` (dans `getAccess` et au webhook) → un éventuel reliquat reste pleinement fonctionnel.

**i18n** : nettoyer les entrées ÉLITE dans `messages/fr.json`, `en.json`, `de.json`
(notamment `featuresElite`, libellés de plan).

**Stripe** : **archiver** (désactiver, ne pas supprimer) les prix `STRIPE_PRICE_ELITE` et
`STRIPE_PRICE_ELITE_ANNUAL` pour préserver l'historique. Les variables d'env Vercel
correspondantes peuvent rester (inertes) ou être retirées dans un second temps.

### 4. Alignement des promesses PRO

Nouvelle liste, chaque ligne = une feature **réelle** (à traduire fr/en/de) :

1. Accès illimité aux 10 disciplines & programmes
2. Coach IA personnalisé
3. Suivi & statistiques de progression
4. Vidéos d'entraînement HD
5. Rappels & motivation quotidienne (notifications push) — *remplace « challenges communautaires »*
6. Synchronisation montre connectée / Apple Fitness
7. Support par email — *remplace « support prioritaire 7j/7 »*

À mettre à jour partout où les features PRO sont listées (page tarifs, `dashboard/abonnement`
`featuresPro`, emails le cas échéant).

## Modèle de données

**Aucun changement de schéma.** On réutilise `subscriptions` (plan/status/dates) et
`admin_users`. Le rôle est calculé à la volée par `getAccess()`.

## Cas limites

| Cas | Comportement |
|---|---|
| Non connecté | `guest` → redirigé vers signin (comportement existant du layout) |
| Connecté, jamais abonné | `free` → Paywall sur les pages PRO ; `abonnement`/`profil` OK |
| En essai (`trialing`) | `pro` → accès complet |
| Actif (`active`) | `pro` → accès complet |
| Résilié en fin de période (`cancel_at_period_end`, encore `active`) | `pro` jusqu'à l'échéance |
| Expiré / `canceled` | `free` → Paywall, peut se réabonner via `abonnement` |
| Impayé (`past_due`) | non-PRO → Paywall, peut régler sa carte via `abonnement` |
| Admin | `admin` → accès total |
| Reliquat plan `elite` | normalisé en `pro`, accès complet |

## Tests & vérification

- **Test unitaire** de la déduction de rôle de `getAccess` (logique pure : statut/plan/admin →
  `role`/`isPro`), façon `src/lib/constants.test.ts`. La partie I/O (lecture Supabase) est
  isolée pour rester testable.
- `tsc --noEmit`, `eslint`, suite `jest` au vert.
- **Vérif manuelle** : compte gratuit → Paywall ; essai/actif → accès ; page `abonnement`
  joignable même non-PRO ; plus aucune mention d'ÉLITE sur le site.
- Avant d'écrire le code : lire les guides pertinents dans `node_modules/next/dist/docs/`
  (exigence `AGENTS.md`).

## Hors périmètre (sous-projets ultérieurs)

2. **Bibliothèque de contenu structurée** — migrer programmes/vidéos/guides/bonus en base avec
   un `min_plan`, attribution automatique, RLS (défense en profondeur).
3. **Dashboard enrichi** — badges du plan, contenu débloqué, dates de renouvellement,
   recommandations personnalisées.
4. **Durcissement de la synchronisation post-paiement** — création de compte, activation,
   cas limites de facturation (downgrade, expiration), idempotence du webhook.

Chacun fera l'objet de son propre spec → plan → implémentation.
