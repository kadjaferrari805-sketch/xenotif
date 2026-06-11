# Identité de marque premium XENOTIF® — Spécification

**Date :** 2026-06-11
**Branche :** `feat-premium-logo` (réutilise la PR #101, qui sera mise à jour puis re-titrée)
**Statut :** Validé visuellement (mark + palette + typographie), prêt pour plan d'implémentation.

---

## 1. Objectif

Refondre l'identité visuelle de XENOTIF® pour un rendu **premium, iconique et cohérent** sur tout le site et tous les supports (header, footer, mobile, dashboard, checkout, favicon, icône PWA, image sociale), avec une charte de marque documentée.

## 2. Direction validée (verrouillée)

- **Marque (symbole) :** « Hexa-Tech » — un **hexagone** (contour dégradé titane/argent) contenant un **X** centré. Sensation ingénierie / performance.
- **Palette bi-ton :** hexagone en **titane** (dégradé argent), X en **orange de marque**.
- **Wordmark :** `XENOTIF®` en **Orbitron** (futuriste, technique), `®` en orange superscript.

### 2.1 Couleurs de marque

| Rôle | Valeur | Note |
|---|---|---|
| Noir profond (fond) | `#0A0B0F` | = token existant `--color-sport-dark` |
| Blanc premium | `#FFFFFF` | texte / mono clair |
| Titane (dégradé sombre→clair) | `#FFFFFF → #9CA3AF → #E5E7EB` | hexagone sur fond sombre |
| Titane (variante fond clair) | `#D1D5DB → #6B7280 → #9CA3AF` | hexagone sur fond clair |
| **Orange de marque** | **`#FF4500`** | = token existant `--color-sport-orange`. **Décision : le X utilise le token réel du site (et non `#F97316` des maquettes) pour une cohérence totale avec CTA/focus/skip-link.** |

> Un nouveau token `--color-sport-titane: #9CA3AF` (teinte médiane) est ajouté à `@theme inline` dans `globals.css` pour réutilisation (déjà proche de `--color-sport-gray`, mais nommé explicitement « titane » pour la marque).

### 2.2 Géométrie de référence (viewBox `0 0 48 48`)

```
Hexagone (contour) : polygon points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5"
                     fill=none  stroke-width=2.4  stroke-linejoin=round
X (deux segments)  : (17.5,17.5)→(30.5,30.5) et (30.5,17.5)→(17.5,30.5)
                     stroke-width=4.6  stroke-linecap=round
```

Aux petites tailles (favicon ≤ 32px) les épaisseurs sont augmentées (hexagone 3–3.4, X 5.4–6.2) pour rester lisibles.

## 3. Architecture & unités

Chaque unité a une responsabilité unique et une interface claire.

### 3.1 SVG source de vérité
- **Créer `public/brand/xenotif-mark.svg`** — la marque seule (hexagone titane + X orange), source unique rasterisée par le script d'assets et réutilisée par `icon.svg`.
- **Créer `public/brand/xenotif-mark-mono.svg`** — variante monochrome (tout en `currentColor`) pour usages sur photo.

### 3.2 Composants React — `src/components/ui/Logo.tsx` (refonte)
Interfaces publiques **stables** (les imports existants ne changent pas) :

- `XenotifMark({ size?: number; variant?: 'biton' | 'mono-white' | 'mono-titane'; animated?: boolean })`
  - `biton` (défaut) : hexagone titane + X orange.
  - `mono-white` / `mono-titane` : tout blanc / tout titane.
  - `animated` (défaut `false`) : ajoute la classe CSS `xeno-mark--animated` (intro + lueur, cf. §4). Reste **SSR-safe** (pur SVG + CSS, aucun `'use client'`).
- `XenotifWordmark({ className?: string })` — `XENOTIF` en Orbitron (via `var(--font-orbitron)`), `®` superscript orange. Le texte reste dans le DOM (SEO).
- `Logo({ href?, size?: 'sm'|'md'|'lg', className?, showText?, animated? })` — **lockup horizontal**. Signature actuelle conservée + prop `animated` optionnelle.
- `LogoVertical({ href?, size?, className? })` — **lockup vertical** (mark au-dessus, wordmark dessous), pour splash / checkout.

Le composant reste un **Server Component** (pas de framer-motion ici) : l'animation est 100 % CSS, donc aucune frontière client n'est introduite et le SSG/SEO est préservé.

### 3.3 Typographie — `src/app/[locale]/layout.tsx`
- Ajouter `import { Orbitron } from 'next/font/google'`.
- `const orbitron = Orbitron({ subsets: ['latin'], weight: ['600','700','800'], variable: '--font-orbitron', display: 'swap' })`.
- Ajouter `${orbitron.variable}` à `className` du `<html>` (à côté de `inter.variable`).
- Le wordmark applique la police via la classe Tailwind arbitraire `font-[family-name:var(--font-orbitron)]` (auto-suffisant, pas de dépendance au `@theme`).

> **AGENTS.md** : avant d'écrire le code `next/font` et les conventions de fichiers metadata (`icon`, `apple-icon`, `opengraph-image`, `manifest`), consulter `node_modules/next/dist/docs/` (cette version de Next a des spécificités). Le plan d'implémentation le rappelle dans les tâches concernées.

## 4. Animations (CSS, premium & sobres)

Toutes définies dans `src/app/globals.css`, **gardées par `@media (prefers-reduced-motion: no-preference)`** (désactivées sinon).

- **Intro (au montage)** sur `.xeno-mark--animated` :
  1. Les deux segments du X se **tracent** (`stroke-dasharray`/`stroke-dashoffset`, ~600 ms `ease-out`).
  2. Puis **une** pulsation de lueur orange (`drop-shadow` orange qui apparaît puis s'estompe, une seule fois, ~900 ms).
- **Survol (header)** : léger `translateY(-1px)` + intensification du glow orange (~150 ms). Appliqué via `.xeno-mark` au `:hover` du lien logo.

Pas de JS requis ; framer-motion (déjà présent, v12.40) reste disponible mais n'est pas nécessaire pour ces effets.

## 5. Intégration site

| Emplacement | Fichier | Changement |
|---|---|---|
| Header | `src/components/layout/Nav.tsx` | `<Logo size="sm" animated />` (intro + hover) |
| Footer | `src/components/layout/Footer.tsx` | `<Logo size="sm" />` (nouveau rendu, sans intro) |
| Dashboard | `src/app/[locale]/dashboard/layout.tsx` | nouveau rendu (inchangé côté API) |
| Auth (3 pages) | `auth/signin`, `forgot-password`, `reset-password` | nouveau rendu (inchangé côté API) |
| Checkout / splash | usage de `LogoVertical` là où pertinent | optionnel, si un écran s'y prête |

Aucun changement d'API d'appel : `Logo` garde sa signature, donc l'intégration se limite au rendu (+ `animated` sur le header).

## 6. Assets statiques

Source unique : `public/brand/xenotif-mark.svg`.

### 6.1 Marks sans texte → script `sharp` (`scripts/gen-brand-assets.mjs`, exécuté `node scripts/gen-brand-assets.mjs`)
Compose le mark sur fond (tuile arrondie sombre `#0A0B0F` pour les icônes d'app) et écrit :
- `src/app/icon.png` (32×32) — fallback favicon raster.
- `src/app/apple-icon.png` (180×180) — remplace l'ancien (tuile sombre + mark centré).
- `public/icon-192.png`, `public/icon-512.png` — icônes PWA (`purpose: any`).
- `public/icon-maskable-512.png` (512×512, marge de sécurité ~10 %) — `purpose: maskable`.

### 6.2 Favicon vectoriel
- **Créer `src/app/icon.svg`** (= mark, fond transparent) → Next émet `<link rel="icon" type="image/svg+xml">`. Crisp sur tous écrans.
- **Supprimer `src/app/favicon.ico`** (ancien logo) : `icon.svg` + `icon.png` couvrent tous les navigateurs ; on évite d'afficher l'ancienne marque.

### 6.3 Image sociale (Open Graph) → `next/og`
- **Créer `src/app/opengraph-image.tsx`** (ImageResponse, 1200×630) : fond `#0A0B0F`, lockup centré (mark embarqué en `<img>` data-URI SVG + wordmark `XENOTIF®` en **Orbitron** chargée via buffer de police — fetch de la `.ttf` au build avec **fallback** police système bold si le fetch échoue), `export const alt`, `size`, `contentType`.
- **Supprimer `src/app/opengraph-image.jpg` et `opengraph-image.alt.txt`** (remplacés par la route dynamique).

### 6.4 Manifest PWA — `src/app/manifest.ts`
- Ajouter l'icône **maskable** `public/icon-maskable-512.png` (en plus des `any`).
- `theme_color` / `background_color` restent `#0A0B0F`.

## 7. Charte de marque

- **Créer `docs/brand/xenotif-brand-guide.md`** : marque & symbolisme, géométrie, palette + tokens (`#0A0B0F`, blanc, titane, `#FF4500`), typographie (Orbitron wordmark, Inter texte courant), variantes (biton / mono-blanc / mono-titane), tailles min, zone de protection (clear space = hauteur du X autour du mark), do/don't (ne pas déformer, ne pas recolorer le X hors orange de marque, ne pas poser le biton sur fond chargé sans tuile), aperçus des lockups (horizontal/vertical/icône/favicon/OG).

## 8. Tests

Le repo utilise Jest. Tests ciblés (rendu, pas de pixels) :
- `Logo.test.tsx` (mettre à jour / créer) :
  - `XenotifMark` rend un `<svg>` avec un `<polygon>` (hexagone) et deux segments du X ; `variant="mono-white"` n'utilise pas l'orange.
  - `animated` ajoute la classe `xeno-mark--animated`.
  - `XenotifWordmark` rend le texte `XENOTIF` (présent dans le DOM) + `®`.
  - `Logo` rend un lien (`href`) et masque le wordmark si `showText={false}`.
  - `LogoVertical` rend mark + wordmark.
- Vérifier que les tests existants de `Nav`/`Footer` passent toujours (le texte « XENOTIF » reste présent).

> Les assets binaires (PNG/OG) et l'animation CSS ne sont pas testés en unitaire ; validation visuelle via preview de déploiement.

## 9. Hors périmètre (YAGNI)

- Pas de refonte de la palette globale du site (les CTA restent `#FF4500`).
- Pas de typeface sur-mesure ni de logo dessiné à la main (génératif SVG/CSS uniquement).
- Pas de migration de Inter vers une autre police de texte courant (Orbitron = wordmark/titres de marque uniquement).
- Pas d'animation GSAP (CSS suffit ; framer-motion reste dispo si un besoin émerge).

## 10. Critères de succès

1. Le nouveau lockup (mark hexa titane + X `#FF4500` + Orbitron) s'affiche dans header, footer, dashboard, pages auth.
2. Favicon, icône d'app (Apple + PWA 192/512 + maskable) et image OG reflètent la nouvelle marque.
3. Animation d'intro + hover visibles, désactivées en `prefers-reduced-motion`.
4. `docs/brand/xenotif-brand-guide.md` documente la charte complète.
5. Tests Jest verts ; build Next OK ; SSG/SEO préservés (texte « XENOTIF » dans le DOM, pas de frontière client ajoutée sur le logo).
