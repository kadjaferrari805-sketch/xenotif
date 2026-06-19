# Audit premium XENOTIF® — 2026-06-19

> Audit ancré dans le code réel (`src/`), pas un audit générique. Objectif de la mission : hisser le site au niveau de Nike Training / Gymshark / Freeletics / Apple Fitness+.

## Verdict global

**Le site n'est PAS un site basique à reconstruire.** Il est déjà à un niveau premium avancé :
Next.js 16 (App Router, React Compiler), next-intl fr/en/de, framer-motion + GSAP + lenis + three.js installés et utilisés, Hero vidéo cinématique + parallaxe 3D, carrousels 3D, `/dashboard-preview` public, blog 15 articles avec articles liés, boutique 65 produits avec catalogue filtrable, lead magnet PDF, Meta Pixel + GA4 + CAPI, SEO canonique + sitemap, PWA, gamification, transformations avant/après, emails cycle de vie complet.

La mission suppose un blank slate. La réalité : **80 % des 12 phases sont déjà faites**. Reconstruire à l'aveugle dégraderait un site qui génère du revenu. L'audit identifie donc les **vrais manques additifs et à fort ROI**.

---

## Phase par phase : état réel

| Phase | Sujet | État | Détail |
|------|-------|------|--------|
| 1 | Audit | ✅ | Ce document |
| 2 | Hero / landing | ✅ Fait | `Hero.tsx` : vidéo cinématique (poster LCP + fondu), parallaxe souris, headline/accent animés (AnimatePresence), 2 CTA, preuve sociale ★, badges, scroll indicator, reduced-motion respecté |
| 3 | Carrousels | ⚠️ Partiel | `Carousel.tsx` (3D perspective, swipe, flèches) utilisé pour **produits** (`ProductShowcase`). **MANQUE : carrousel Disciplines, carrousel Programmes populaires, carrousel Blog** |
| 4 | Dashboard premium | ✅ Fait | `/dashboard-preview` public (`PreviewDashboard`), graphes recharts, ActivityRings, gamification (XP/badges/défis) |
| 5 | Programmes digitaux | ✅ Fait | Bibliothèque PDF (guides d1–d4 ×3 langues), génération à la volée, livraison email |
| 6 | Boutique e-commerce | ✅ Fait (sauf mobile) | `Catalogue.tsx` : filtre discipline + recherche + tri ; 65 produits ; best-sellers ; recos par produit. **MANQUE : best-sellers en carrousel mobile** |
| 7 | Blog SEO | ✅ Quasi-fait | Catégories filtrables, cartes Tilt3D, articles liés, CTA signup par article, métadonnées + hreflang. Améliorable : recherche, section blog sur l'accueil |
| 8 | Animations | ✅ Fait | framer-motion partout, GSAP + lenis (`SmoothScroll`), `Tilt3D`, `Counter`, reveal au scroll |
| 9 | Design premium | ✅ Fait | Tokens `sport-orange #FF4500`, `text-3d`, glassmorphism (backdrop-blur), ombres orange |
| 10 | Conversion | ⚠️ Partiel | Newsletter (capture email), lead magnet `/api/free-program`, StickyCheckout, Pricing. **MANQUE : pop-up intelligent (exit-intent / timing) programme gratuit** |
| 11 | Mobile-first | ⚠️ Partiel | Globalement responsive. **Boutique best-sellers reste une grille (pas carrousel) sur mobile** |
| 12 | Performance | ✅ Fait | SSG via `setRequestLocale` + ConditionalChrome, images Next/AVIF, poster LCP |

---

## Les VRAIS manques (priorisés par ROI / risque)

### 🔴 P1 — Carrousel Disciplines sur l'accueil (Phase 3·1)
Aujourd'hui la section `#disciplines` = `Features.tsx` (grille de bénéfices), **pas** un carrousel de disciplines. Les meilleures marques (Nike Training, Freeletics) ouvrent sur les disciplines. À créer : carrousel swipeable Musculation / Running / HIIT / Yoga / CrossFit / Boxe / Cycling / Natation → liens internes (`/disciplines/[slug]` ou ancres). Cartes 3D (réutiliser `Carousel` + `Tilt3D`). **Impact : engagement + temps passé + maillage interne SEO.** Risque faible (additif).

### 🔴 P2 — Boutique best-sellers en carrousel mobile (Phases 6/11)
`boutique/page.tsx` ligne 100 : grille `grid sm:grid-cols-2 lg:grid-cols-3`. Sur mobile → carrousel horizontal snap, scrollbar masquée, défilement fluide/rapide. (C'était la tâche en cours avant cette mission.) **Impact : UX mobile + ventes affiliées.** Risque faible.

### 🟠 P3 — Carrousel « Nos programmes populaires » sur l'accueil (Phase 3·2)
Cartes programme (image premium, niveau, durée, CTA Découvrir) → liens guides/programmes digitaux. **Impact : ventes boutique digitale + inscriptions.** Risque faible.

### 🟠 P4 — Section/carrousel Blog sur l'accueil « Conseils Fitness » (Phase 3·4)
L'accueil n'a **aucune** section blog. Ajouter un carrousel des derniers articles. **Impact : SEO maillage + temps passé + autorité.** Risque faible.

### 🟡 P5 — Pop-up intelligent lead magnet (Phase 10)
Pop-up programme gratuit déclenché par timing/exit-intent (1×/visiteur via localStorage), respect reduced-motion, fermable. Branché sur `/api/free-program` + `/api/subscribe`. **Impact : capture email + conversion.** Risque modéré (UX intrusive si mal calibré → fréquence stricte).

### 🟡 P6 — Recherche blog (Phase 7)
Champ de recherche client sur `/blog` (titre/extrait/catégorie). **Impact : SEO/UX.** Risque faible.

---

## Hors périmètre / déjà couvert (ne PAS refaire)
- Hero, design system, dashboard-preview, bibliothèque PDF, catalogue boutique, animations GSAP, SEO technique, perf SSG, PWA, emails — déjà en place.
- Contraintes mémoire : pas d'ÉLITE, pas de boutons App Store/Play, tags Amazon distincts (xenotif-21 / xenotif21-21), Best Sellers/Sélections home restent supprimés (NE PAS réintroduire CoachDemo/Reveal), chiffres marketing voulus.

## Méthode d'implémentation recommandée
Par lots, chacun : branche depuis `main` → composant + i18n fr/en/de → tests si logique → PR → merge → vérif LIVE sur xenotif.com. Réutiliser `Carousel`, `Tilt3D`, `ProductCard`, `SectionHeader` pour cohérence et perf. Lire `node_modules/next/dist/docs/` avant tout code (consigne AGENTS.md).
