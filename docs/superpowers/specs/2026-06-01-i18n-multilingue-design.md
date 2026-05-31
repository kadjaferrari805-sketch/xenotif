# Spec — Internationalisation (i18n) multilingue de xenotif.com

**Date** : 2026-06-01
**Statut** : Validé (design), en attente de plan d'implémentation
**Auteur** : Dave + Claude

---

## 1. Contexte & objectif

Le site `xenotif.com` (Next.js App Router, déployé sur Vercel) est aujourd'hui **100 % en français**. Objectif : le rendre **multilingue de qualité professionnelle** pour des marchés clés, avec adaptation automatique à la langue du visiteur.

### Décisions cadrées (brainstorming)

| Sujet | Décision |
| --- | --- |
| **Priorité** | Qualité pro sur des marchés clés (pas un widget de traduction auto) |
| **Langues** | `fr` (défaut) + `en`, `de`, `it`, `es` |
| **Détection** | Langue du navigateur (`Accept-Language`) + sélecteur manuel + mémorisation du choix |
| **Périmètre** | Tout : UI, marketing, disciplines, produits, blog, guides PDF, emails |
| **Production des traductions** | **Fournies par un pro** → on construit la plomberie i18n + on extrait tout le texte FR dans des fichiers « gabarits » que le traducteur remplit |
| **Dashboard membre** | Localisé en **dernière phase** (priorité SEO = pages publiques) |
| **Livraison** | **Par phases** (voir §8) |

### Non-objectifs

- Pas de traduction automatique IA en production (choix « qualité pro »).
- Pas de couverture de « toutes » les langues du monde — uniquement les 5 retenues.
- Pas de refonte visuelle ni fonctionnelle au-delà de ce qu'impose l'i18n.

---

## 2. Approche retenue

**`next-intl`** (standard de fait pour l'i18n en Next.js App Router) + **catalogues JSON** par langue.

> ⚠️ L'`AGENTS.md` du repo signale que ce Next.js a des changements cassants. La version de `next-intl` devra être **compatible avec la version de Next installée** ; lire la doc de `next-intl` correspondante avant intégration.

Alternative écartée : i18n « maison » (sans dépendance) — réinvente détection, pluriels, formatage, helpers `hreflang` ; plus de code et de risques pour aucun gain ici.

---

## 3. Langues & structure d'URL

- Locales : `fr` (défaut), `en`, `de`, `it`, `es`.
- `localePrefix: 'as-needed'` :
  - **FR à la racine, URLs inchangées** : `xenotif.com/boutique`, `/blog/...`, `/disciplines/musculation` → **préserve l'indexation Google actuelle**.
  - Autres langues préfixées : `/en/boutique`, `/de/...`, `/it/...`, `/es/...`.
- Les routes publiques passent sous `app/[locale]/…`. Le `RootLayout` reste global ; un layout par locale gère `<html lang>`, le provider `next-intl` et les messages.

---

## 4. Détection & sélecteur de langue

- **Middleware `next-intl`** : détecte `Accept-Language`, redirige le premier visiteur vers sa langue, lit/écrit le cookie `NEXT_LOCALE` pour mémoriser le choix.
- **Composition avec le middleware existant** : le projet a déjà un middleware (auth dashboard + en-tête `x-current-path` lu par le `RootLayout`). Il faut **chaîner** le middleware i18n avec cette logique (pas le remplacer). Vérifier que `x-current-path` et les redirections d'auth continuent de fonctionner après préfixe de locale.
- **Sélecteur de langue** : composant dans la `Nav` (et le `Footer`) — menu des 5 langues, change de langue **en conservant le chemin courant** et met à jour le cookie.

---

## 5. Où vivent les traductions (handoff traducteur)

### 5.1 UI + contenu court → catalogues JSON
`messages/fr.json` (source, rempli) + `messages/{en,de,it,es}.json` (mêmes clés, **gabarits à remplir**).

Découpage par namespaces, p.ex. :
- `common` (nav, footer, boutons, CTA récurrents)
- `home`, `pricing`, `faq`, `auth`
- `boutique` (UI liste/panier/succès) + `products.<id>.*` (nom, description, longDescription, features, badge)
- `disciplines.<slug>.*` (titre, tagline, paragraphes, listes…)
- `guides.<id>.*` (titres/blocs des guides PDF)
- `emails.<type>.*`

### 5.2 Articles de blog → fichiers par langue
Texte long → **un fichier Markdown par langue et par article** : `content/blog/<slug>/<locale>.md` (+ frontmatter pour titre/meta/cover). Plus maniable que du JSON pour de longs articles.

### 5.3 Données TS = immuable seulement
`products.ts`, `disciplines.ts`, `guides.ts` conservent **id, slug, prix, images, type, ordre** ; tout **texte** est déplacé vers les catalogues et lu via la clé (`t('products.e1.name')`, etc.). Le générateur PDF (`guide-pdf.ts`) lit les blocs **localisés**.

### 5.4 Format de livraison au traducteur
JSON (standard, géré par toutes les agences) + Markdown pour le blog. Fournir un **README de traduction** listant les fichiers à remplir et les conventions (ne pas traduire les clés, garder les variables `{name}`, etc.).

---

## 6. Repli (fallback) tant que les traductions manquent

`next-intl` configuré avec un **`getMessageFallback` → français** : si une clé n'est pas encore traduite dans une langue, on affiche le **texte français** plutôt que du vide ou la clé brute.

→ Conséquence clé : on peut **livrer la structure et remplir progressivement** sans jamais casser le site. Une page `/en` non encore traduite s'affiche en français dans la coquille EN.

---

## 7. SEO international

- **`hreflang`** : chaque page déclare ses variantes de langue (`alternates.languages`) + `x-default` → FR.
- **Canonical par langue** (chaque locale est canonique d'elle-même).
- **`<html lang={locale}>`** dynamique.
- **Sitemap** : `sitemap.ts` étendu pour émettre **toutes les URLs × toutes les langues** avec les annotations `alternates`/`hreflang`.
- **Métadonnées** (title/description/OG) **traduites** depuis les catalogues.
- L'image OG par défaut (capture d'accueil) reste valable ; on pourra localiser plus tard si besoin.

---

## 8. Livraison par phases

| Phase | Contenu | Résultat |
| --- | --- | --- |
| **P1 — Socle** | next-intl, routing `app/[locale]`, middleware (composé avec l'existant), sélecteur, repli FR, SEO (hreflang + sitemap + métadonnées), extraction UI : `common`/nav/footer + accueil + tarifs + FAQ + pages auth | Site multilingue **fonctionnel** : FR rempli, EN/DE/IT/ES en gabarit (repli FR) |
| **P2** | Disciplines (`disciplines.ts` → catalogues) + boutique (liste + fiches produit) | Pages disciplines & produits localisables |
| **P3** | Articles de blog (Markdown par langue) + guides PDF (blocs localisés, `guide-pdf.ts`) | Contenu long localisable + PDF multilingues |
| **P4** | Dashboard membre + emails transactionnels (langue du destinataire) | Couverture complète |

Chaque phase est **livrable et testable indépendamment** (le site reste fonctionnel après chacune grâce au repli FR).

---

## 9. Emails localisés

- Les fonctions de `lib/emails/index.ts` prennent un paramètre **`locale`**.
- Source de la langue : préférence stockée au **profil** (utilisateurs) et/ou **capturée au checkout** (commandes boutique) ; défaut = `fr`.
- Les textes des emails passent dans les catalogues (`emails.*`) et/ou des gabarits par langue.

---

## 10. Tests

- **Intégrité des clés** : test qui vérifie qu'aucune clé n'est manquante/orpheline entre `fr.json` et les autres langues (au moins : toutes les clés FR existent dans chaque langue, repli toléré mais signalé).
- **Middleware** : redirection selon `Accept-Language`, respect du cookie, non-régression de l'auth et de `x-current-path`.
- **SEO** : présence des `hreflang` et du canonical par langue sur quelques pages clés.
- **Build par locale** : `next build` passe ; pages générées pour chaque locale.
- Les tests de composants existants doivent continuer à passer (adapter le provider `next-intl` dans le setup de test si nécessaire).

---

## 11. Risques & points d'attention

- **P1 porte le risque** : déplacer toutes les routes sous `[locale]` touche tout le site (layouts, liens internes via `<Link>` doivent devenir locale-aware, redirections, middleware). P2→P4 sont surtout de l'extraction de texte, plus mécaniques.
- **Composition middleware** : ne pas casser l'auth dashboard ni `x-current-path`.
- **Liens internes** : tous les `<Link href>` doivent passer par le helper de navigation locale-aware de `next-intl` (sinon perte de la langue à la navigation).
- **Préserver les URLs FR** (`localePrefix: as-needed`) pour ne pas casser l'indexation Google récemment obtenue.
- **Version `next-intl`** compatible avec ce Next.js (changements cassants) — lire la doc avant.
- **Volume de traduction** : le périmètre « tout » est énorme côté contenu ; le repli FR permet de livrer la mécanique sans attendre les traductions.

---

## 12. Décisions confirmées

- Dashboard membre & emails = **P4** (confirmé).
- Pages légales (`mentions-legales`, `confidentialite`) : **traduites comme le reste** (confirmé).
- **Devise = euro partout**, pas de conversion par pays (confirmé) — **hors scope**.
- Premier plan d'implémentation = **Phase 1 uniquement** (socle) ; P2→P4 suivront par plans séparés.
