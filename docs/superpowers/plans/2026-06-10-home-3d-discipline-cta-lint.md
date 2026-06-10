# Plan — Scène 3D (hero), CTA disciplines → connexion, nettoyage lint

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter une scène 3D animée dans le hero, rediriger le CTA « Découvrir » des disciplines vers la connexion si non connecté, et ramener le lint à 0 erreur (web + mobile).

**Architecture:** Next.js 16 / React 19 (React Compiler) / `src/` (web) + `mobile/` (Expo). 3D = react-three-fiber chargé en `dynamic ssr:false`. Auth client web via `@/lib/supabase/client`. Tests = Jest + Testing Library.

**Tech Stack:** three, @react-three/fiber, @react-three/drei, next-intl, supabase-js, Jest.

**Découpage recommandé :** **PR 1** = Phases 1 & 2 (features A + B). **PR 2** = Phase 3 (nettoyage lint, en commits par lots). Le lint étant risqué et indépendant, le séparer protège la review et la prod.

**Spec :** `docs/superpowers/specs/2026-06-10-home-3d-discipline-cta-lint-design.md`

**Gates globaux (à repasser à la fin de chaque phase) :** `npx tsc --noEmit` = 0 · `npm test` vert · `npm run build` vert.

---

## File Structure

| Fichier | Action | Responsabilité |
|---|---|---|
| `package.json` | Modify | deps three/r3f/drei |
| `src/components/home/Hero3D.tsx` | Create | Canvas + scène 3D abstraite animée |
| `src/components/home/Hero.tsx` | Modify | intégrer `<Hero3D>` (dynamic) ; fix lint (memo + setState) |
| `src/components/home/Features.tsx` | Modify | CTA Découvrir conditionnel selon auth |
| `src/components/home/Features.test.tsx` | Create | test href CTA (connecté vs non) |
| `eslint.config.mjs` | Modify | ignorer les configs CommonJS intentionnelles |
| `src/lib/boutique/wishlist.ts` + ~18 fichiers web/mobile | Modify | corrections lint par catégorie (Phase 3) |

---

# PHASE 1 — Scène 3D (A)

### Task 1 : Installer les dépendances 3D

**Files:** Modify `package.json`, `package-lock.json`

- [ ] **Step 1 :** Installer
```bash
cd /Users/dave/xenotif
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```
- [ ] **Step 2 :** Vérifier
Run: `node -e "require('three'); console.log('three ok')"`
Expected: `three ok`
- [ ] **Step 3 :** Commit
```bash
git add package.json package-lock.json
git commit -m "chore(deps): three + react-three-fiber + drei pour la scène 3D"
```

### Task 2 : Composant Hero3D

**Files:** Create `src/components/home/Hero3D.tsx`

- [ ] **Step 1 :** Écrire le composant (forme abstraite, distort orange, rotation + réaction souris, perf bornée, prefers-reduced-motion)
```tsx
'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Icosahedron } from '@react-three/drei'
import type { Mesh } from 'three'

function Blob() {
  const ref = useRef<Mesh>(null)
  useFrame((state, delta) => {
    const m = ref.current
    if (!m) return
    m.rotation.x += delta * 0.15
    m.rotation.y += delta * 0.2
    // Parallaxe douce vers le pointeur (state.pointer ∈ [-1,1])
    m.position.x += (state.pointer.x * 0.6 - m.position.x) * 0.05
    m.position.y += (state.pointer.y * 0.4 - m.position.y) * 0.05
  })
  return (
    <Icosahedron ref={ref} args={[1.2, 6]}>
      <MeshDistortMaterial
        color="#f97316"
        emissive="#7c2d12"
        emissiveIntensity={0.35}
        metalness={0.6}
        roughness={0.25}
        distort={0.35}
        speed={1.6}
      />
    </Icosahedron>
  )
}

export default function Hero3D() {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4], fov: 45 }}
      frameloop={reduced ? 'demand' : 'always'}
      gl={{ antialias: true, alpha: true }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 3]} intensity={1.2} />
      <pointLight position={[-3, -2, -2]} intensity={0.5} color="#84cc16" />
      <Blob />
    </Canvas>
  )
}
```
- [ ] **Step 2 :** Typecheck du fichier
Run: `npx tsc --noEmit`
Expected: 0 erreur (si erreur de typage drei/r3f, ajuster les imports de types)
- [ ] **Step 3 :** Commit
```bash
git add src/components/home/Hero3D.tsx
git commit -m "feat(home): composant Hero3D (scène abstraite animée r3f)"
```

### Task 3 : Intégrer Hero3D dans le hero

**Files:** Modify `src/components/home/Hero.tsx`

- [ ] **Step 1 :** Ajouter l'import dynamique en haut du fichier (après les imports existants)
```tsx
import dynamic from 'next/dynamic'

const Hero3D = dynamic(() => import('./Hero3D'), { ssr: false })
```
- [ ] **Step 2 :** Placer la scène en overlay décoratif dans la `<section>` du hero (au-dessus des slides de fond, sous le texte). Insérer ce bloc juste après l'`AnimatePresence` des slides de fond, avant le contenu textuel :
```tsx
{/* Scène 3D décorative (non bloquante, pointer-events none) */}
<div className="pointer-events-none absolute inset-0 z-10 hidden md:block opacity-80">
  <Hero3D />
</div>
```
  *(Ajuster `z-`/position selon le layout réel pour ne pas masquer le texte ; le texte du hero doit rester au-dessus avec un `z-` supérieur.)*
- [ ] **Step 3 :** Lancer le dev et vérifier visuellement
Run: `npm run dev` puis ouvrir `/` — la forme 3D orange tourne et suit la souris, le texte reste lisible.
- [ ] **Step 4 :** Build
Run: `npm run build`
Expected: succès (la route `/` reste générée ; `Hero3D` est client-only)
- [ ] **Step 5 :** Commit
```bash
git add src/components/home/Hero.tsx
git commit -m "feat(home): intègre la scène 3D dans le hero (dynamic ssr:false)"
```

---

# PHASE 2 — CTA « Découvrir » → connexion si non connecté (B)

### Task 4 : Href conditionnel + test

**Files:** Modify `src/components/home/Features.tsx` ; Create `src/components/home/Features.test.tsx`

- [ ] **Step 1 :** Écrire le test d'abord
```tsx
import { render, screen } from '@testing-library/react'
import { Features } from './Features'

// Mock i18n navigation Link → <a>
jest.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...p }: any) => <a href={href} {...p}>{children}</a>,
}))
jest.mock('next-intl', () => ({
  useTranslations: () => Object.assign((k: string) => k, { raw: () => [] }),
}))

const mockGetUser = jest.fn()
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: mockGetUser,
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    },
  }),
}))

test('CTA → /auth/signin quand non connecté', async () => {
  mockGetUser.mockResolvedValue({ data: { user: null } })
  render(<Features />)
  const links = await screen.findAllByRole('link')
  const discover = links.find((l) => l.getAttribute('href')?.includes('signin'))
  expect(discover).toBeTruthy()
})
```
  *(Note : adapter les mocks `next-intl` au vrai usage de `Features` — `t.raw('...')` pour FEATURES. Vérifier le format réel en lisant le haut de `Features.tsx` à l'implémentation.)*
- [ ] **Step 2 :** Lancer le test → échoue (CTA pointe encore vers /disciplines)
Run: `npm test -- Features`
Expected: FAIL
- [ ] **Step 3 :** Implémenter l'auth + href conditionnel dans `Features.tsx`
  - Ajouter en haut du composant :
```tsx
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
// ... dans le composant Features() :
const [authed, setAuthed] = useState<boolean | null>(null)
useEffect(() => {
  const supabase = createClient()
  supabase.auth.getUser().then(({ data }) => setAuthed(!!data.user))      // setState en callback async → OK lint
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_e, session) => setAuthed(!!session?.user)
  )
  return () => subscription.unsubscribe()
}, [])
```
  - Remplacer le `href` du `<Link>` (ligne ~111) :
```tsx
href={authed ? `/disciplines/${feat.slug}` : '/auth/signin'}
```
  *(Défaut prudent : tant que `authed === null`, on envoie vers `/auth/signin`.)*
- [ ] **Step 4 :** Test passe
Run: `npm test -- Features`
Expected: PASS
- [ ] **Step 5 :** Lint du fichier (vérifier qu'on n'a PAS introduit de set-state-in-effect)
Run: `npm run lint 2>&1 | grep Features.tsx || echo "Features.tsx clean"`
Expected: `Features.tsx clean`
- [ ] **Step 6 :** Commit
```bash
git add src/components/home/Features.tsx src/components/home/Features.test.tsx
git commit -m "feat(disciplines): CTA Découvrir → /auth/signin si non connecté"
```

**→ Fin PR 1. Repasser les gates globaux (tsc/test/build) + vérif visuelle 3D, puis ouvrir la PR features.**

---

# PHASE 3 — Nettoyage lint (C) → PR 2 séparée

> Créer une branche dédiée depuis `main` après merge de PR 1 (ou continuer ici si tu préfères un seul gros PR). Commits petits, `npm run lint` après chaque lot.

### Task 5 : Exclure les configs CommonJS intentionnelles

**Files:** Modify `eslint.config.mjs`

- [ ] **Step 1 :** Ajouter aux `globalIgnores` : `"stripe-setup.js"`, `"mobile/tailwind.config.js"`
```js
globalIgnores([
  ".next/**", "out/**", "build/**", "next-env.d.ts",
  "stripe-setup.js",
  "mobile/tailwind.config.js",
]),
```
- [ ] **Step 2 :** Lint
Run: `npm run lint 2>&1 | grep -E "stripe-setup|tailwind.config" || echo "exclus ok"`
Expected: `exclus ok`
- [ ] **Step 3 :** Commit `chore(lint): exclut les configs CommonJS intentionnelles`

### Task 6 : Corrections sûres (vars inutilisées + init paresseuse)

**Files:** Modify `src/lib/boutique/wishlist.ts` + fichiers à vars inutilisées (panier, abonnement, programme, _layout, programme.tsx mobile, stripe-setup ignoré).

- [ ] **Step 1 :** `wishlist.ts` — init paresseuse
```ts
// avant: const [ids, setIds] = useState<string[]>([]) ; useEffect(() => { setIds(load()) }, [])
const [ids, setIds] = useState<string[]>(() => load())
// supprimer le useEffect d'init
```
- [ ] **Step 2 :** Supprimer chaque variable inutilisée signalée par le lint (`total`, `cancelled`, `si`, `color`, `FlatList`, `couponCreated`…). Lire chaque ligne signalée, retirer la déclaration/import.
- [ ] **Step 3 :** Lint partiel
Run: `npm run lint 2>&1 | grep -c "no-unused-vars"` → tend vers 0
- [ ] **Step 4 :** Commit `fix(lint): vars inutilisées + init paresseuse wishlist`

### Task 7 : setState-in-effect (web) — par fichier

**Files (un commit par fichier) :** `home/Hero.tsx` (l.47), `components/AppInstall.tsx` (l.30), `dashboard/NotificationBell.tsx` (l.29), `dashboard/TodayActivity.tsx` (l.146), `disciplines/VideoCard.tsx` (l.30), `reviews/CustomerReviews.tsx` (l.25), `dashboard/programme/page.tsx` (l.55), `auth/signup/page.tsx` (l.46)

Pattern par fichier :
- [ ] **Step 1 :** Lire le composant ; identifier le `setState` synchrone dans le corps de l'effet.
- [ ] **Step 2 :** Refactor selon le cas :
  - init au montage dérivée d'une source pure → `useState(() => …)`.
  - valeur calculée à partir des props/deps → `useMemo` ou calcul direct au render (pas d'effet).
  - effet de synchro réelle → garder l'effet mais appeler `setState` dans un **callback** (rAF, promesse, abonnement), pas en synchrone direct.
- [ ] **Step 3 :** `npm run lint 2>&1 | grep <fichier> || echo clean` → clean
- [ ] **Step 4 :** `npm test` (si le composant a un test) → vert
- [ ] **Step 5 :** Commit `fix(lint): setState-in-effect <fichier>`

### Task 8 : Anti-patterns render (web) — cas par cas

**Files :** `AppInstall.tsx` (« create components during render », l.66/85 → **hoister la définition du composant hors de `render`/hors du composant parent**), `NotificationBell.tsx` (« impure function during render », l.19 → déplacer l'appel impur dans un `useEffect`/handler), `boutique/panier/page.tsx` + `dashboard/coach/page.tsx` (« value cannot be modified », l.58/48 → ne pas muter une valeur dérivée/const ; cloner avant modif), `home/Hero.tsx` (« memoization could not be preserved », l.36/40 → retirer les `useCallback` manuels superflus, laisser le React Compiler mémoïser ; réévaluer les deps de l'effet).

- [ ] Par fichier : lire → appliquer le refactor ci-dessus → `npm run lint | grep <fichier>` clean → `npm test` vert → commit `fix(lint): <règle> <fichier>`.

### Task 9 : Mobile — no-explicit-any + refs-in-render

**Files :** `mobile/app/(auth)/signup.tsx`, `(tabs)/_layout.tsx`, `(tabs)/index.tsx`, `(tabs)/profil.tsx`, `(tabs)/programme.tsx`, `(tabs)/smartwatch.tsx`, `discipline/[slug].tsx`, `onboarding.tsx`

- [ ] **Step 1 :** `no-explicit-any` : remplacer chaque `any` par le vrai type (types Supabase, props de navigation Expo Router, etc.). Lire le contexte de chaque occurrence.
- [ ] **Step 2 :** `onboarding.tsx` « Cannot access refs during render » (l.48) : déplacer l'accès au ref hors du render (dans un effet/handler).
- [ ] **Step 3 :** `(tabs)/index.tsx` setState-in-effect + exhaustive-deps : même pattern que Task 7.
- [ ] **Step 4 :** Lint mobile
Run: `npm run lint 2>&1 | grep -c "mobile/"` → 0
- [ ] **Step 5 :** Commit(s) `fix(lint): mobile any-types + refs/effects`

### Task 10 : Gate final lint

- [ ] **Step 1 :** `npm run lint` → **0 erreur, 0 warning** (ou warnings résiduels assumés et listés)
- [ ] **Step 2 :** `npx tsc --noEmit` → 0
- [ ] **Step 3 :** `npm test` → vert
- [ ] **Step 4 :** `npm run build` → vert
- [ ] **Step 5 :** Ouvrir PR 2 (lint).

---

## Notes d'exécution
- La 3D ne se teste pas en CI → **vérif visuelle manuelle obligatoire** avant merge de PR 1.
- Les refactors React Compiler (Tasks 7-9) touchent des composants **en prod** : commits par fichier + `npm test` après chaque, pour pouvoir bisecter une régression.
- Si un refactor React Compiler s'avère trop risqué/incertain sur un composant, **le signaler** plutôt que de deviner (option de repli : `// eslint-disable-next-line` ciblé documenté, à valider avec l'utilisateur).
