# Phase 1 — « Montrer la valeur » — Spécification

**Date :** 2026-06-12
**Branche :** `feat-phase1-montrer-la-valeur`
**Contexte :** 1ʳᵉ phase de la transformation premium de XENOTIF. Problème ciblé : le site ne montre pas assez ce que l'utilisateur obtient après abonnement → faible conversion. Décisions actées : PWA (pas de boutons stores), preuves sociales via envoi clients (phase ultérieure), aperçu démo étiqueté, démo IA scriptée, stats honnêtes.

## Objectif
Augmenter confiance + conversion en rendant la valeur **visible** sur la surface publique, sans rien inventer.

## Livrables (4)

### 1. `/dashboard-preview` — aperçu public de l'espace membre
- **Route :** `src/app/[locale]/dashboard-preview/page.tsx` — **publique**, SSG (pas d'auth, pas de DB). `generateStaticParams` via locales (comme les autres pages [locale]).
- **Bannière persistante** en haut : « Aperçu — données de démonstration » (badge clair, athlète fictif « Alex »).
- **Sections** (langage visuel du vrai dashboard, mais 100 % présentationnel avec données statiques) :
  1. En-tête « Bonjour Alex » + badge aperçu.
  2. **Anneaux d'activité** (pas / calories / minutes actives) — réutilise `ActivityRings` (`src/components/dashboard/smartwatch/ActivityRings.tsx`, props `{ rings: Ring[]; size }`).
  3. **Graphe semaine** — réutilise `WeeklyChart` (props `{ data, metric, color }`).
  4. **Stats** (séances, heures, jours actifs, badges) — cartes count-up (Framer Motion).
  5. **Progression par discipline** — barres de progression (mêmes classes que `ProgressionClient`).
  6. **Suivi du poids** — mini-courbe (sparkline SVG simple, données démo).
  7. **Snapshot nutrition** — macros (protéines/glucides/lipides + calories) en barres/anneaux.
  8. **Badges** — grille (réutilise le style badges existant).
  9. **Carte teaser Coach IA** → lien vers la section démo + CTA.
- **Animations premium** : reveal au scroll (Framer Motion `whileInView`), count-up des chiffres. Respecte `prefers-reduced-motion`.
- **CTA forts** répétés : « Crée ton compte gratuit » (`/auth/signup`) + « Passe Pro » (`/#tarifs`).
- **Responsive + safe-area** (classes `pt-safe` etc. si barres fixes ; sinon flux normal).
- **Composants à créer :**
  - `src/components/preview/PreviewDashboard.tsx` (client — assemble les sections + animations).
  - `src/components/preview/PreviewWeightChart.tsx` (sparkline SVG présentationnel).
  - `src/components/preview/PreviewNutrition.tsx` (macros).
  - `src/lib/preview-data.ts` (données démo typées : profil Alex, semaine, disciplines, poids, nutrition, badges).
- **i18n :** namespace `dashboardPreview` dans `messages/{fr,en,de}.json` (titres, labels, badge aperçu, CTA). Les valeurs chiffrées démo restent dans `preview-data.ts` (non traduites).

### 2. Section « Découvrez votre Coach IA » (démo scriptée)
- **Composant :** `src/components/home/CoachDemo.tsx` (client, **sans API, sans coût, sans auth**).
- **Comportement :** conversation pré-écrite réaliste qui s'anime (messages apparaissent séquentiellement avec effet « écrit… »). 3-4 **puces cliquables** (sport / nutrition / adaptation programme / progression) → affichent une réponse préparée du coach. Bouton « Rejoue la démo ».
- **UI :** reprend le style du vrai coach (bulles user/assistant, avatar Bot). `prefers-reduced-motion` → affichage instantané sans animation de frappe.
- **i18n :** namespace `coachDemo` (scripts de conversation + libellés) dans `messages/{fr,en,de}.json`.
- **Placement :** nouvelle section sur l'accueil (`src/app/[locale]/page.tsx`), après une section existante pertinente (ex. après `HowItWorks` ou `Features`). Également liée depuis `/dashboard-preview`.

### 3. Bandeau confiance sous le Hero (#13)
- **Composant :** `src/components/home/TrustRow.tsx` (présentationnel).
- **Contenu :** 🔒 Paiement sécurisé (Stripe) · 🛡️ Garantie 30 jours · ✕ Annulation en 1 clic · 💬 Support réactif. Icônes lucide, 4 colonnes (2×2 mobile).
- **Placement :** dans `src/app/[locale]/page.tsx`, juste après le `Hero`.
- **i18n :** namespace `trust` dans `messages/{fr,en,de}.json`. (Réutilise les faits existants : garantie 30j déjà présente sur le site.)

### 4. Honnêteté des stats (#8)
Retirer les **comptes d'utilisateurs inventés** et ne garder que le **vérifiable**.

**Emplacements identifiés & remplacements proposés** (l'utilisateur confirme les chiffres) :

| Emplacement | Actuel (inventé) | Remplacement proposé (vérifiable) |
|---|---|---|
| `ProofBar.tsx` `STAT_STYLE[0]` | `12 000+` athlètes (icône Users) | **Coaching IA 24/7** (icône Bot) — ou « Garantie 30j » |
| `ProofBar.tsx` `STAT_STYLE[3]` | `4.9/5` note | conserver **uniquement si** appuyé par de vrais avis ; sinon remplacer par « Sans engagement » |
| `messages` `home.proof.stats` | libellés liés aux chiffres ci-dessus | adapter aux nouvelles tuiles |
| `messages` `home.metaDescription` | « Rejoins 12 000+ athlètes… » | « 10 disciplines, coaching IA personnalisé, 300+ séances… » (sans headcount) |
| `messages` `home.disciplines.cards[].stats` | « +4 200 coureurs », « +3 800 membres », « +900 nageurs », « +1 200 boxeurs », « +2 000 pratiquants », « +1 600 membres », « +1 800 athlètes »… | garder uniquement les faits de **contenu** déjà présents (« 120+ plans », « 12 semaines moy. », « 20–60 min / séance ») ; **retirer les headcounts** |
| `messages` (lignes 219/411/577) « 12 000+ » | bandeaux divers | reformuler sans headcount |
| Footer (si présent) | éventuel « X membres » | retirer |

Conservés car vérifiables : **10 disciplines**, **50+ / 300+ séances** (à confirmer vs contenu réel), **garantie 30j**, **paiement sécurisé Stripe**, **annulation en 1 clic**.

> ⚠️ Les nombres « 300+ séances » / « 50+ programmes » doivent être confirmés par l'utilisateur comme reflétant le contenu réel ; sinon on les arrondit honnêtement ou on les retire.

## Intégration
- **Nav** (`src/components/layout/Nav.tsx`) : ajouter un lien vers `/dashboard-preview` (libellé « L'espace membre » ou « Aperçu »).
- **Footer** : lien vers `/dashboard-preview`.
- **Sitemap** (`src/app/sitemap.ts`) : ajouter `/dashboard-preview` (priority 0.7).
- **Accueil** (`page.tsx`) : insérer `<TrustRow/>` (après Hero) et `<CoachDemo/>` (section dédiée).

## Architecture / isolation
- Tout est **présentationnel** : aucune dépendance auth/DB → la page `/dashboard-preview` reste SSG et publique (bon pour SEO + perf).
- Réutilisation des pièces existantes (`ActivityRings`, `WeeklyChart`, classes de progression/badges) plutôt que duplication.
- Données démo centralisées dans `src/lib/preview-data.ts` (une seule source).

## Tests (Jest, légers / présentationnels)
- `PreviewDashboard` : rend le badge « aperçu », le nom « Alex », au moins un anneau + une barre de progression.
- `CoachDemo` : rend la 1ʳᵉ bulle ; un clic sur une puce affiche une réponse ; respecte le rendu sans animation (pas d'assertion sur le timing).
- `TrustRow` : rend les 4 éléments (paiement, garantie, annulation, support).
- Garde-fou stats : test qui vérifie que `messages/fr.json` ne contient plus « 12 000+ athlètes » (anti-régression honnêteté).
- Non-régression : tests existants (`ProofBar.test`, `Hero.test`, `Nav.test`, `Footer.test`) mis à jour si assertions impactées.

## Performance / SEO (#15, transverse)
- `/dashboard-preview` en SSG, images/animations légères, lazy au scroll.
- Metadata propre (title/description) + entrée sitemap + lien interne (maillage).

## Hors périmètre (phases suivantes)
Gamification réelle (#9/#10), app & montres (#3/#4), vidéos témoignages & avant/après (#5/#6), boutique premium (#11), emails étendus (#12), vidéo Hero (#7). Le `/dashboard-preview` **montre** badges/poids/nutrition mais ne crée pas encore le système réel correspondant.

## Critères de succès
1. `/dashboard-preview` publique, premium, clairement étiquetée « aperçu », montre progression/stats/poids/nutrition/badges/teaser IA.
2. Section démo Coach IA interactive (scriptée) sur l'accueil.
3. Bandeau confiance sous le Hero.
4. Plus aucune statistique d'utilisateurs inventée sur le site (seulement du vérifiable).
5. Lien dans Nav/footer/sitemap. Responsive + SSG + tests verts.
