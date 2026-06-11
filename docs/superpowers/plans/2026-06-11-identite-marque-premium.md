# Identité de marque premium XENOTIF® — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Déployer la nouvelle identité XENOTIF® (marque Hexa-Tech titane + X orange, wordmark Orbitron) dans tout le site et tous les supports (header, footer, dashboard, auth, favicon, icône PWA/Apple, image OG), animations CSS sobres, + charte de marque.

**Architecture :** Composants React purs (SVG + CSS, aucune frontière client ajoutée → SSG/SEO préservés). Police Orbitron via `next/font/google`. Animations 100 % CSS dans `globals.css`. Assets bitmap générés par un script `sharp` à partir d'un SVG source unique. Image sociale via `next/og` (Orbitron embarquée). Spec : `docs/superpowers/specs/2026-06-11-identite-marque-premium-design.md`.

**Tech Stack :** Next.js 16.2 (App Router), React 19, next-intl, Tailwind v4, `next/font/google`, `next/og`, `sharp`, Jest 30 + @testing-library/react 16.

**Contexte AGENTS.md :** cette version de Next a des spécificités. Les guides pertinents ont déjà été lus pour ce plan : `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md`, `.../03-file-conventions/01-metadata/app-icons.md`, `.../03-file-conventions/01-metadata/opengraph-image.md`, `.../04-functions/image-response.md`. Les API utilisées ci-dessous en sont issues.

**Décisions clés (rappel spec) :**
- X du logo = **`#FF4500`** (token `--color-sport-orange` réel du site), pas `#F97316`.
- Dégradé titane : `#ffffff → #9ca3af → #e5e7eb` (id SVG `xeno-titane`).
- Géométrie (viewBox `0 0 48 48`) : hexagone `polygon points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5"` (stroke 2.4) ; X = deux `<line>` (17.5,17.5)→(30.5,30.5) et (30.5,17.5)→(17.5,30.5) (stroke 4.6, linecap round).
- `Logo` garde sa signature actuelle (`href`, `size`, `className`, `showText`) + nouvelle prop optionnelle `animated`.
- Le wordmark garde **`XENOTIF` comme nœud texte séparé** de `®` (les tests `Nav`/`Footer` font `getByText('XENOTIF')`).

---

## File Structure

| Fichier | Responsabilité | Action |
|---|---|---|
| `src/app/[locale]/layout.tsx` | charge Orbitron + expose `--font-orbitron` | Modifier |
| `src/app/globals.css` | token titane + keyframes animation logo | Modifier |
| `src/components/ui/Logo.tsx` | `XenotifMark`, `XenotifWordmark`, `Logo`, `LogoVertical` | Réécrire |
| `src/components/ui/Logo.test.tsx` | tests de rendu du logo | Créer |
| `src/components/layout/Nav.tsx` | header avec logo animé | Modifier (1 ligne) |
| `public/brand/xenotif-mark.svg` / `-mono.svg` | SVG source de vérité | Créer (par le script) |
| `src/app/icon.svg` | favicon vectoriel | Créer (par le script) |
| `scripts/gen-brand-assets.mjs` | génère SVG + PNG (favicon/app/PWA) | Créer |
| `src/app/icon.png` | favicon raster 32px | Créer (par le script) |
| `src/app/apple-icon.png` | icône iOS 180px | Remplacer (par le script) |
| `public/icon-192.png` / `icon-512.png` / `icon-maskable-512.png` | icônes PWA | Remplacer/Créer (par le script) |
| `src/app/favicon.ico` | ancien favicon | **Supprimer** |
| `src/app/manifest.ts` | ajoute l'icône maskable | Modifier |
| `src/app/_assets/Orbitron-ExtraBold.ttf` | police pour l'image OG | Créer (téléchargée) |
| `src/app/opengraph-image.tsx` | image sociale 1200×630 | Créer |
| `src/app/opengraph-image.jpg` / `opengraph-image.alt.txt` | ancienne image OG | **Supprimer** |
| `docs/brand/xenotif-brand-guide.md` | charte de marque | Créer |

---

## Task 1: Charger Orbitron (next/font/google)

**Files:**
- Modify: `src/app/[locale]/layout.tsx:2,16,98`

- [ ] **Step 1: Ajouter l'import Orbitron**

Dans `src/app/[locale]/layout.tsx`, sous la ligne `import { Inter } from 'next/font/google'` (ligne 2), remplacer par :

```tsx
import { Inter, Orbitron } from 'next/font/google'
```

- [ ] **Step 2: Instancier la police**

Sous `const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })` (ligne 16), ajouter :

```tsx
// Orbitron = wordmark/identité de marque uniquement (police variable → pas de `weight`).
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron', display: 'swap' })
```

- [ ] **Step 3: Exposer la variable CSS sur `<html>`**

Remplacer `<html lang={locale} className={inter.variable}>` (ligne 98) par :

```tsx
    <html lang={locale} className={`${inter.variable} ${orbitron.variable}`}>
```

- [ ] **Step 4: Vérifier le typecheck**

Run: `npx tsc --noEmit`
Expected: aucune erreur liée à `layout.tsx`.

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/layout.tsx
git commit -m "feat(brand): charge la police Orbitron (--font-orbitron)"
```

---

## Task 2: Token titane + animations CSS du logo

**Files:**
- Modify: `src/app/globals.css` (bloc `@theme inline` ~ligne 14 ; ajout en fin de `@layer base` ou après)

- [ ] **Step 1: Ajouter le token titane**

Dans `@theme inline { ... }`, après la ligne `--color-sport-gray: #9CA3AF;`, ajouter :

```css
  --color-sport-titane: #9CA3AF;
```

- [ ] **Step 2: Ajouter les animations du logo**

À la fin de `src/app/globals.css`, ajouter :

```css
/* ===== Marque XENOTIF® — animations (sobres, premium) ===== */
/* Désactivées si l'utilisateur préfère moins de mouvement. */
.xeno-mark { transition: transform .15s ease, filter .15s ease; }

@media (prefers-reduced-motion: no-preference) {
  /* Intro : le X se trace dans l'hexagone. */
  .xeno-mark--animated .xeno-x line {
    stroke-dasharray: 20;
    stroke-dashoffset: 20;
    animation: xeno-draw 0.6s ease-out forwards;
  }
  /* Puis une unique pulsation de lueur orange. */
  .xeno-mark--animated {
    animation: xeno-pulse 0.9s ease-out 0.6s 1;
  }
  /* Survol du lien logo (header) : léger lift + glow. */
  a:hover .xeno-mark {
    transform: translateY(-1px);
    filter: drop-shadow(0 2px 10px rgba(255, 69, 0, 0.45));
  }
}

@keyframes xeno-draw {
  to { stroke-dashoffset: 0; }
}
@keyframes xeno-pulse {
  0%   { filter: drop-shadow(0 0 0 rgba(255, 69, 0, 0)); }
  40%  { filter: drop-shadow(0 0 10px rgba(255, 69, 0, 0.55)); }
  100% { filter: drop-shadow(0 0 0 rgba(255, 69, 0, 0)); }
}
```

- [ ] **Step 3: Vérifier la présence**

Run: `grep -n "xeno-draw\|--color-sport-titane\|xeno-mark--animated" src/app/globals.css`
Expected: les trois identifiants apparaissent.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(brand): token titane + animations CSS du logo (reduced-motion safe)"
```

---

## Task 3: Refonte des composants Logo (TDD)

**Files:**
- Create: `src/components/ui/Logo.test.tsx`
- Rewrite: `src/components/ui/Logo.tsx`

- [ ] **Step 1: Écrire les tests (qui échouent)**

Créer `src/components/ui/Logo.test.tsx` :

```tsx
import { render, screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { XenotifMark, XenotifWordmark, Logo, LogoVertical } from './Logo'

describe('XenotifMark', () => {
  it('rend un hexagone et les deux segments du X', () => {
    const { container } = render(<XenotifMark />)
    expect(container.querySelector('polygon')).toBeInTheDocument()
    expect(container.querySelectorAll('.xeno-x line')).toHaveLength(2)
  })

  it('utilise l’orange de marque (#FF4500) pour le X en bi-ton', () => {
    const { container } = render(<XenotifMark variant="biton" />)
    expect(container.querySelector('.xeno-x')?.getAttribute('stroke')).toBe('#FF4500')
  })

  it('n’utilise pas d’orange en mono-white', () => {
    const { container } = render(<XenotifMark variant="mono-white" />)
    expect(container.innerHTML).not.toContain('#FF4500')
  })

  it('ajoute la classe d’animation quand animated', () => {
    const { container } = render(<XenotifMark animated />)
    expect(container.querySelector('.xeno-mark--animated')).toBeInTheDocument()
  })
})

describe('XenotifWordmark', () => {
  it('rend XENOTIF (nœud texte séparé) et ®', () => {
    render(<XenotifWordmark />)
    expect(screen.getByText('XENOTIF')).toBeInTheDocument()
    expect(screen.getByText('®')).toBeInTheDocument()
  })
})

describe('Logo', () => {
  it('rend un lien', () => {
    renderWithIntl(<Logo />)
    expect(screen.getByRole('link')).toBeInTheDocument()
  })

  it('masque le wordmark quand showText est false', () => {
    renderWithIntl(<Logo showText={false} />)
    expect(screen.queryByText('XENOTIF')).not.toBeInTheDocument()
  })
})

describe('LogoVertical', () => {
  it('rend la marque et le wordmark', () => {
    const { container } = renderWithIntl(<LogoVertical />)
    expect(container.querySelector('polygon')).toBeInTheDocument()
    expect(screen.getByText('XENOTIF')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Lancer les tests → ils échouent**

Run: `npx jest src/components/ui/Logo.test.tsx`
Expected: FAIL (le module exporte encore l'ancien `XenotifMark`/pas de `LogoVertical`, et le X n'a ni classe `.xeno-x` ni `polygon`).

- [ ] **Step 3: Réécrire le composant**

Remplacer **tout** le contenu de `src/components/ui/Logo.tsx` par :

```tsx
import { Link } from '@/i18n/navigation'

interface LogoProps {
  href?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showText?: boolean
  animated?: boolean
}

const sizes = {
  sm: { mark: 28, text: 'text-base', gap: 'gap-2' },
  md: { mark: 36, text: 'text-xl', gap: 'gap-2.5' },
  lg: { mark: 48, text: 'text-2xl', gap: 'gap-3' },
}

type MarkVariant = 'biton' | 'mono-white' | 'mono-titane'

// Marque « Hexa-Tech » : hexagone (contour titane) + X orange.
// SVG pur + CSS → reste rendable côté serveur (pas de 'use client').
export function XenotifMark({
  size = 36,
  variant = 'biton',
  animated = false,
}: {
  size?: number
  variant?: MarkVariant
  animated?: boolean
}) {
  const hexStroke = variant === 'mono-white' ? '#ffffff' : 'url(#xeno-titane)'
  const xStroke =
    variant === 'biton' ? '#FF4500' : variant === 'mono-white' ? '#ffffff' : 'url(#xeno-titane)'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`xeno-mark${animated ? ' xeno-mark--animated' : ''}`}
    >
      <defs>
        {/* Dégradé titane/argent. Id stable : plusieurs instances partagent la même def. */}
        <linearGradient id="xeno-titane" x1="6" y1="3" x2="42" y2="45" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#9ca3af" />
          <stop offset="100%" stopColor="#e5e7eb" />
        </linearGradient>
      </defs>

      {/* Hexagone */}
      <polygon
        points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5"
        fill="none"
        stroke={hexStroke}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* X (deux segments) — la classe .xeno-x sert de cible à l'animation de tracé */}
      <g className="xeno-x" stroke={xStroke} strokeWidth="4.6" strokeLinecap="round">
        <line x1="17.5" y1="17.5" x2="30.5" y2="30.5" />
        <line x1="30.5" y1="17.5" x2="17.5" y2="30.5" />
      </g>
    </svg>
  )
}

// Wordmark : XENOTIF en Orbitron, ® orange. « XENOTIF » reste un nœud texte distinct.
export function XenotifWordmark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`font-[family-name:var(--font-orbitron)] font-extrabold tracking-[0.02em] uppercase text-white ${className}`}
    >
      XENOTIF
      <sup className="align-super text-[0.5em] text-sport-orange ml-[0.06em]">®</sup>
    </span>
  )
}

// Lockup horizontal (header, footer, dashboard, auth).
export function Logo({
  href = '/',
  size = 'md',
  className = '',
  showText = true,
  animated = false,
}: LogoProps) {
  const { mark, text, gap } = sizes[size]

  const inner = (
    <span className={`flex items-center ${gap} ${className}`}>
      <XenotifMark size={mark} animated={animated} />
      {showText && <XenotifWordmark className={text} />}
    </span>
  )

  return href ? (
    <Link href={href} className="inline-flex items-center">
      {inner}
    </Link>
  ) : (
    inner
  )
}

// Lockup vertical (splash / checkout) : marque au-dessus, wordmark dessous.
export function LogoVertical({
  href = '/',
  size = 'md',
  className = '',
}: Omit<LogoProps, 'showText' | 'animated'>) {
  const { mark, text } = sizes[size]

  const inner = (
    <span className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <XenotifMark size={mark} />
      <XenotifWordmark className={text} />
    </span>
  )

  return href ? (
    <Link href={href} className="inline-flex">
      {inner}
    </Link>
  ) : (
    inner
  )
}
```

- [ ] **Step 4: Lancer les tests → ils passent**

Run: `npx jest src/components/ui/Logo.test.tsx`
Expected: PASS (tous les `describe`).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/Logo.tsx src/components/ui/Logo.test.tsx
git commit -m "feat(brand): nouveau logo Hexa-Tech (mark variants + Orbitron + LogoVertical)"
```

---

## Task 4: Intégration header + non-régression Nav/Footer

**Files:**
- Modify: `src/components/layout/Nav.tsx:75`

- [ ] **Step 1: Activer l'animation sur le logo du header**

Dans `src/components/layout/Nav.tsx`, remplacer `<Logo href="/" size="sm" />` (ligne 75) par :

```tsx
          <Logo href="/" size="sm" animated />
```

(Footer, dashboard et pages auth ne changent pas : la signature de `Logo` est inchangée, ils affichent automatiquement le nouveau rendu.)

- [ ] **Step 2: Vérifier les tests existants Nav + Footer**

Run: `npx jest src/components/layout/Nav.test.tsx src/components/layout/Footer.test.tsx`
Expected: PASS (le wordmark conserve le nœud texte « XENOTIF »).

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Nav.tsx
git commit -m "feat(brand): header avec logo animé (intro + hover)"
```

---

## Task 5: SVG source + génération favicon / icônes d'app (sharp)

**Files:**
- Create: `scripts/gen-brand-assets.mjs`
- Create (par le script): `public/brand/xenotif-mark.svg`, `public/brand/xenotif-mark-mono.svg`, `src/app/icon.svg`, `src/app/icon.png`, `src/app/apple-icon.png`, `public/icon-192.png`, `public/icon-512.png`, `public/icon-maskable-512.png`
- Delete: `src/app/favicon.ico`

- [ ] **Step 1: Écrire le script de génération**

Créer `scripts/gen-brand-assets.mjs` :

```js
// Génère tous les assets bitmap de la marque depuis un SVG unique.
// Lancer : node scripts/gen-brand-assets.mjs
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const ROOT = process.cwd()
const TITANE =
  '<linearGradient id="xeno-titane" x1="6" y1="3" x2="42" y2="45" gradientUnits="userSpaceOnUse">' +
  '<stop offset="0%" stop-color="#ffffff"/><stop offset="50%" stop-color="#9ca3af"/>' +
  '<stop offset="100%" stop-color="#e5e7eb"/></linearGradient>'

// Corps de la marque (sans <svg>). hex = couleur hexagone, x = couleur du X.
const markBody = (hex = 'url(#xeno-titane)', x = '#FF4500') =>
  `<defs>${TITANE}</defs>` +
  `<polygon points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5" fill="none" stroke="${hex}" stroke-width="2.4" stroke-linejoin="round"/>` +
  `<g stroke="${x}" stroke-width="4.6" stroke-linecap="round">` +
  '<line x1="17.5" y1="17.5" x2="30.5" y2="30.5"/><line x1="30.5" y1="17.5" x2="17.5" y2="30.5"/></g>'

// Marque seule, fond transparent.
const plainSvg = (hex, x) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">${markBody(hex, x)}</svg>`

// Tuile sombre arrondie + marque centrée (icônes d'app). pad/radius en fraction de la taille.
const tileSvg = (px, pad, radius) => {
  const r = Math.round(px * radius)
  const inner = px * (1 - 2 * pad)
  const off = px * pad
  const scale = inner / 48
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 ${px} ${px}">` +
    `<rect width="${px}" height="${px}" rx="${r}" fill="#0A0B0F"/>` +
    `<g transform="translate(${off},${off}) scale(${scale})">${markBody()}</g></svg>`
  )
}

async function writeText(rel, content) {
  const abs = join(ROOT, rel)
  await mkdir(dirname(abs), { recursive: true })
  await writeFile(abs, content)
  console.log('svg ', rel)
}

async function writePng(rel, svg, px) {
  const abs = join(ROOT, rel)
  await mkdir(dirname(abs), { recursive: true })
  await sharp(Buffer.from(svg)).resize(px, px).png().toFile(abs)
  console.log('png ', rel, `${px}x${px}`)
}

// SVG sources de vérité
await writeText('public/brand/xenotif-mark.svg', plainSvg())
await writeText('public/brand/xenotif-mark-mono.svg', plainSvg('currentColor', 'currentColor'))
await writeText('src/app/icon.svg', plainSvg())

// Favicon raster + icônes d'app (tuile sombre)
await writePng('src/app/icon.png', plainSvg(), 32)
await writePng('src/app/apple-icon.png', tileSvg(180, 0.19, 0.22), 180)
await writePng('public/icon-192.png', tileSvg(192, 0.19, 0.22), 192)
await writePng('public/icon-512.png', tileSvg(512, 0.19, 0.22), 512)
// Maskable : fond plein (rx 0) + marge de sécurité ~28 % (zone sûre).
await writePng('public/icon-maskable-512.png', tileSvg(512, 0.28, 0), 512)

console.log('Assets de marque générés.')
```

- [ ] **Step 2: Lancer le script**

Run: `node scripts/gen-brand-assets.mjs`
Expected: 8 lignes `svg`/`png` puis « Assets de marque générés. »

- [ ] **Step 3: Vérifier les sorties**

Run: `node -e "const s=require('sharp');for(const f of ['src/app/icon.png','src/app/apple-icon.png','public/icon-192.png','public/icon-512.png','public/icon-maskable-512.png']){s(f).metadata().then(m=>console.log(f,m.width+'x'+m.height)).catch(e=>{console.log('ERR',f);process.exit(1)})}"`
Expected: dimensions correctes (32, 180, 192, 512, 512). Ouvrir visuellement `public/icon-512.png` pour confirmer le rendu (hexagone titane + X orange sur tuile sombre).

- [ ] **Step 4: Supprimer l'ancien favicon.ico**

Run: `git rm src/app/favicon.ico`
(`src/app/icon.svg` + `src/app/icon.png` couvrent tous les navigateurs.)

- [ ] **Step 5: Commit**

```bash
git add scripts/gen-brand-assets.mjs public/brand src/app/icon.svg src/app/icon.png src/app/apple-icon.png public/icon-192.png public/icon-512.png public/icon-maskable-512.png
git commit -m "feat(brand): favicon + icônes app/PWA (script sharp depuis SVG source)"
```

---

## Task 6: Manifest PWA — icône maskable

**Files:**
- Modify: `src/app/manifest.ts:19-23`

- [ ] **Step 1: Ajouter l'icône maskable dédiée**

Dans `src/app/manifest.ts`, remplacer le tableau `icons: [...]` par :

```ts
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
```

- [ ] **Step 2: Vérifier le typecheck**

Run: `npx tsc --noEmit`
Expected: aucune erreur.

- [ ] **Step 3: Commit**

```bash
git add src/app/manifest.ts
git commit -m "feat(brand): icône PWA maskable dédiée"
```

---

## Task 7: Image sociale Open Graph (next/og + Orbitron)

**Files:**
- Create: `src/app/_assets/Orbitron-ExtraBold.ttf` (téléchargée)
- Create: `src/app/opengraph-image.tsx`
- Delete: `src/app/opengraph-image.jpg`, `src/app/opengraph-image.alt.txt`

- [ ] **Step 1: Télécharger la police Orbitron (statique, gras)**

Run:
```bash
mkdir -p src/app/_assets && \
curl -fsSL "https://raw.githubusercontent.com/google/fonts/main/ofl/orbitron/static/Orbitron-ExtraBold.ttf" -o src/app/_assets/Orbitron-ExtraBold.ttf && \
file src/app/_assets/Orbitron-ExtraBold.ttf
```
Expected: `... TrueType Font ...`.
Si l'URL renvoie 404, fallback (police variable) :
```bash
curl -fsSL "https://raw.githubusercontent.com/google/fonts/main/ofl/orbitron/Orbitron%5Bwght%5D.ttf" -o src/app/_assets/Orbitron-ExtraBold.ttf && file src/app/_assets/Orbitron-ExtraBold.ttf
```
(Le dossier `_assets/` préfixé `_` est privé → non routé par Next.)

- [ ] **Step 2: Créer la route image OG**

Créer `src/app/opengraph-image.tsx` :

```tsx
import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Image OG générée à la compilation (aucune API request-time → statiquement optimisée).
export const alt = 'XENOTIF® — Coaching fitness premium'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const orbitron = readFileSync(join(process.cwd(), 'src/app/_assets/Orbitron-ExtraBold.ttf'))

// Marque embarquée en data-URI (formes + dégradé, sans texte → rendu fiable).
const MARK =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="180" height="180">' +
  '<defs><linearGradient id="t" x1="6" y1="3" x2="42" y2="45" gradientUnits="userSpaceOnUse">' +
  '<stop offset="0%" stop-color="#ffffff"/><stop offset="50%" stop-color="#9ca3af"/>' +
  '<stop offset="100%" stop-color="#e5e7eb"/></linearGradient></defs>' +
  '<polygon points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5" fill="none" stroke="url(#t)" stroke-width="2.4" stroke-linejoin="round"/>' +
  '<g stroke="#FF4500" stroke-width="4.6" stroke-linecap="round">' +
  '<line x1="17.5" y1="17.5" x2="30.5" y2="30.5"/><line x1="30.5" y1="17.5" x2="17.5" y2="30.5"/></g></svg>'
const markSrc = `data:image/svg+xml;base64,${Buffer.from(MARK).toString('base64')}`

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A0B0F',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img width={180} height={180} src={markSrc} alt="" />
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            marginTop: 28,
            fontFamily: 'Orbitron',
            fontWeight: 800,
            fontSize: 96,
            color: '#ffffff',
            letterSpacing: 2,
          }}
        >
          XENOTIF
          <span style={{ fontSize: 36, color: '#FF4500', marginLeft: 6 }}>®</span>
        </div>
        <div
          style={{
            marginTop: 12,
            fontFamily: 'Orbitron',
            fontWeight: 800,
            fontSize: 26,
            color: '#9ca3af',
            letterSpacing: 8,
          }}
        >
          COACHING FITNESS PREMIUM
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Orbitron', data: orbitron, weight: 800, style: 'normal' }],
    },
  )
}
```

- [ ] **Step 3: Supprimer l'ancienne image OG**

Run: `git rm src/app/opengraph-image.jpg src/app/opengraph-image.alt.txt`
(Un seul `opengraph-image.*` par segment ; la route `.tsx` remplace le `.jpg` et porte son propre `alt`.)

- [ ] **Step 4: Vérifier le typecheck**

Run: `npx tsc --noEmit`
Expected: aucune erreur dans `opengraph-image.tsx`.

> Le rendu pixel de l'OG est validé visuellement sur la preview Vercel (non testable en unitaire). En cas d'échec de la police, vérifier que le `.ttf` fait > 30 Ko (`ls -l src/app/_assets`).

- [ ] **Step 5: Commit**

```bash
git add src/app/opengraph-image.tsx src/app/_assets/Orbitron-ExtraBold.ttf
git commit -m "feat(brand): image OG dynamique (next/og, lockup Orbitron sur fond noir)"
```

---

## Task 8: Charte de marque

**Files:**
- Create: `docs/brand/xenotif-brand-guide.md`

- [ ] **Step 1: Rédiger la charte**

Créer `docs/brand/xenotif-brand-guide.md` :

```markdown
# Charte de marque XENOTIF®

## 1. La marque
XENOTIF® — plateforme fitness premium. Symbole « Hexa-Tech » : un **X** (la marque) inscrit dans un **hexagone** (ingénierie, structure, performance). Bi-ton : hexagone **titane** (exigence, durabilité), X **orange** (énergie, action).

## 2. Géométrie (viewBox 0 0 48 48)
- Hexagone : `polygon points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5"`, `stroke-width` 2.4, `stroke-linejoin` round.
- X : segments (17.5,17.5)→(30.5,30.5) et (30.5,17.5)→(17.5,30.5), `stroke-width` 4.6, `stroke-linecap` round.
- Petites tailles (≤ 32 px) : épaissir (hexagone 3–3.4, X 5.4–6.2).

## 3. Couleurs
| Rôle | Hex | Token |
|---|---|---|
| Noir profond (fond) | `#0A0B0F` | `--color-sport-dark` |
| Blanc premium | `#FFFFFF` | — |
| Titane (dégradé) | `#FFFFFF → #9CA3AF → #E5E7EB` | `--color-sport-titane` (médian) |
| Orange de marque | `#FF4500` | `--color-sport-orange` |

Le X est **toujours** orange `#FF4500` (jamais une autre teinte) en version bi-ton.

## 4. Typographie
- **Wordmark / titres de marque :** Orbitron (ExtraBold 800), `--font-orbitron`. `XENOTIF` + `®` orange superscript.
- **Texte courant :** Inter (`--font-inter`).

## 5. Variantes du symbole
- **Bi-ton** (défaut) : hexagone titane + X orange. Fonds sombres.
- **Mono blanc** : tout blanc. Sur photo / fond coloré.
- **Mono titane** : tout argent. Usages sobres.

## 6. Lockups
- **Horizontal** : marque + wordmark (header, footer, dashboard, auth).
- **Vertical** : marque au-dessus, wordmark dessous (splash, checkout).
- **Icône seule** : marque sur tuile sombre arrondie (app, favicon).

## 7. Zone de protection & tailles min
- Clear space autour du lockup ≥ hauteur du X.
- Taille mini lisible du lockup horizontal : ~120 px de large ; symbole seul : 16 px.

## 8. Animations
- Intro : tracé du X (~0.6 s) puis une pulsation de lueur orange (~0.9 s).
- Survol header : lift -1 px + glow orange.
- Toujours désactivées sous `prefers-reduced-motion: reduce`.

## 9. À ne pas faire
- Ne pas déformer / incliner / changer les proportions.
- Ne pas recolorer le X hors `#FF4500`.
- Ne pas poser le bi-ton sur un fond chargé sans tuile sombre.
- Ne pas remplacer Orbitron par une autre police pour le wordmark.

## 10. Assets
Source : `public/brand/xenotif-mark.svg` (+ `-mono.svg`). Régénérer les bitmaps : `node scripts/gen-brand-assets.mjs`.
```

- [ ] **Step 2: Commit**

```bash
git add docs/brand/xenotif-brand-guide.md
git commit -m "docs(brand): charte de marque XENOTIF®"
```

---

## Task 9: Vérification finale

- [ ] **Step 1: Suite de tests complète**

Run: `npx jest`
Expected: tous les tests PASS (notamment `Logo`, `Nav`, `Footer`).

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: aucune erreur.

- [ ] **Step 3: Lint des fichiers touchés**

Run: `npx eslint src/components/ui/Logo.tsx src/components/layout/Nav.tsx src/app/opengraph-image.tsx src/app/manifest.ts "src/app/[locale]/layout.tsx"`
Expected: aucune erreur (warnings tolérés).

- [ ] **Step 4: Finaliser la branche**

Utiliser la skill **superpowers:finishing-a-development-branch**. La branche `feat-premium-logo` porte déjà la PR #101 : mettre à jour le titre/description de la PR pour refléter la refonte complète (et non plus le premier jet du logo).

---

## Self-Review (couverture spec)

- §2 direction validée → Tasks 3, 5 (mark + variants), 1 (Orbitron). ✅
- §2.1 couleurs / token titane → Task 2 (`--color-sport-titane`), Task 3 (X `#FF4500`). ✅
- §3.2 composants (Mark variants, Wordmark, Logo signature stable, LogoVertical) → Task 3. ✅
- §3.3 typographie next/font → Task 1. ✅
- §4 animations CSS + reduced-motion → Task 2 (+ classe via Task 3). ✅
- §5 intégration (header animé ; footer/dashboard/auth automatiques) → Task 4. ✅
- §6 assets (icon.svg, icon.png, apple-icon, PWA 192/512/maskable, suppression favicon.ico, OG via next/og, suppression opengraph-image.jpg) → Tasks 5, 6, 7. ✅
- §7 charte → Task 8. ✅
- §8 tests → Task 3 (unitaires) + Task 9 (suite complète). ✅
- §9 hors-périmètre respecté (pas de refonte palette globale, pas de GSAP, Inter conservé). ✅

Pas de placeholder ; types/identifiants cohérents (`xeno-titane`, `.xeno-x`, `.xeno-mark--animated`, `--font-orbitron`, `--color-sport-titane`) entre tâches.
```
