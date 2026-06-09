# Design — Scène 3D (hero), CTA disciplines → connexion, nettoyage lint

- **Date** : 2026-06-10
- **Statut** : validé (design approuvé par l'utilisateur)
- **Branche** : `feat-3d-hero-cta-lint`

## Objectif

Trois changements indépendants sur le site Xenotif (Next.js 16, `src/`) :

1. **A.** Ajouter une scène 3D interactive (abstraite, animée) dans le hero de la page d'accueil.
2. **B.** Faire que le bouton « Découvrir » de chaque carte discipline redirige vers la page de connexion **uniquement si l'utilisateur n'est pas connecté**.
3. **C.** Nettoyer les erreurs de lint (37 erreurs → 0) sans changement visible.

Périmètre volontairement limité à ces trois points. Pas de refactoring non lié.

---

## A. Scène 3D interactive (hero accueil)

### Approche retenue
react-three-fiber + drei, **forme abstraite procédurale** (aucun asset `.glb`). Approche 1 des 3 proposées : `MeshDistortMaterial` (drei) sur un icosaèdre — meilleur ratio impact/effort/perf. (Rejetées : shader GLSL custom = trop risqué ; particules instanciées = trop lourd mobile.)

### Dépendances
Ajouter : `three`, `@react-three/fiber`, `@react-three/drei`.

### Composants
- `src/components/home/Hero3D.tsx` (`'use client'`) — le `<Canvas>` :
  - Mesh : icosaèdre (ou sphère) avec `MeshDistortMaterial` couleurs marque (orange `#f97316` métallique/émissif).
  - Animation : rotation continue (`useFrame`) + réaction au pointeur (parallaxe légère / intensité de distorsion).
  - Éclairage : ambiant + 1-2 lumières directionnelles/point.
- Intégration : importé dans `Hero.tsx` via `next/dynamic` avec `ssr: false` et un `fallback` léger (le `<Canvas>` ne peut pas être rendu côté serveur). Placé en arrière-plan/à côté du titre selon le layout existant, sans casser le contenu textuel (qui reste SSR pour le SEO).

### Perf & accessibilité
- `dpr={[1, 1.5]}` (plafonné), `frameloop` raisonnable.
- Pause hors-écran (IntersectionObserver ou `frameloop="demand"` au besoin).
- `prefers-reduced-motion` : scène figée ou non montée → fallback statique.

### Data flow / dépendances
Composant autonome, sans état applicatif ni réseau. Dépend uniquement de three/r3f/drei et des couleurs de thème.

---

## B. CTA « Découvrir » → connexion si non connecté

### Cible
`src/components/home/Features.tsx` (déjà `'use client'`). Le CTA est un `<Link href={`/disciplines/${feat.slug}`}>` (~ligne 110), `Link` venant de `@/i18n/navigation` (locale-aware).

### Comportement
- **Connecté** → `href = /disciplines/[slug]` (inchangé).
- **Non connecté** → `href = /auth/signin?redirect=/disciplines/[slug]` (retour sur la discipline après connexion, si le flux signin gère `redirect` ; sinon `/auth/signin`).

### État de connexion
Lu côté client via le client Supabase navigateur (`@/lib/supabase/client`) :
- `supabase.auth.getUser()` au montage + `onAuthStateChange`.
- setState **dans le callback** (async), pas synchrone dans le corps de l'effet → ne crée **pas** de nouvelle violation `set-state-in-effect`.
- La page d'accueil reste **statique** (SEO préservé) ; l'auth est résolue côté client.
- Défaut prudent pendant le chargement de l'auth : lien vers la connexion.

### Vérification
Confirmer à l'implémentation que `/auth/signin` lit bien un paramètre `redirect` ; sinon, soit l'ajouter (petit), soit rediriger simplement vers `/auth/signin`.

---

## C. Nettoyage lint (37 erreurs → 0) — périmètre COMPLET (web + mobile)

Décision : corriger **toutes** les erreurs, `src/` (web) ET `mobile/`. Découpage en **plusieurs PR** recommandé (features A+B séparées du nettoyage lint) pour limiter le risque de régression sur la prod.

### Catégories (depuis `npm run lint`)
- **React Compiler / react-hooks** (refactors réels de composants live) :
  - `setState` synchrone dans `useEffect` (~10) : `home/Hero.tsx`, `AppInstall.tsx`, `dashboard/NotificationBell.tsx`, `dashboard/TodayActivity.tsx`, `disciplines/VideoCard.tsx`, `reviews/CustomerReviews.tsx`, `lib/boutique/wishlist.ts`, `dashboard/programme/page.tsx`, `auth/signup/page.tsx`, `mobile/app/(tabs)/index.tsx`.
  - « Cannot create components during render » : `AppInstall.tsx`.
  - « Cannot call impure function during render » : `NotificationBell.tsx`.
  - « This value cannot be modified » : `boutique/panier/page.tsx`, `dashboard/coach/page.tsx`.
  - « memoization could not be preserved » : `Hero.tsx`.
  - « Cannot access refs during render » : `mobile/app/onboarding.tsx`.
- **`no-explicit-any`** (surtout mobile) : signup, _layout, index, profil, programme, smartwatch, discipline/[slug], onboarding.
- **`no-unused-vars`** (warnings) : divers.
- **`no-require-imports`** : `stripe-setup.js`, `mobile/tailwind.config.js` → **intentionnels (configs CommonJS)** → exclure du lint, ne pas réécrire.

### Stratégie par catégorie
- `setState`-in-effect : init paresseuse (`useState(() => …)`) si init au montage ; sinon déplacer le setState dans un callback async / restructurer les deps.
- create-components / impure / value-modified / refs-in-render : refactor au cas par cas (hoister la définition de composant hors render ; déplacer l'appel impur dans un effet/handler ; ne pas muter une valeur dérivée).
- `no-explicit-any` : typer correctement. `unused-vars` : supprimer. require intentionnels : ignores eslint.

### Garde-fous
- `npm run lint` = 0 erreur ; `npx tsc --noEmit` = 0 ; `npm test` (Jest) vert ; `npm run build` vert.
- Commits petits par fichier/catégorie ; tests après chaque lot de refactor.

---

## Tests / validation
- `npm run lint` = 0 erreur.
- `npx tsc --noEmit` = 0 erreur.
- `npm test` (Jest) = vert.
- `npm run build` = vert.
- Vérif visuelle manuelle de la 3D (la 3D ne se teste pas en CI) avant merge.

## Livraison
Branche `feat-3d-hero-cta-lint` → PR (comme #79). Pas de merge sans la vérif visuelle de la scène 3D.

## Hors périmètre
- Génération d'images 3D par IA (Runway) — non concerné (modèle procédural).
- Toute autre refonte visuelle ou refactoring non listé ici.
