# B2 #2 — Migration complète + bascule du rendu + gating piloté par la base

- **Date** : 2026-06-11
- **Statut** : design validé, prêt pour le plan d'implémentation
- **Position** : **sous-projet #2 de B2**. Suit #1 (schéma + Musculation en base, mergé/déployé). Précède #3 (back-office CMS).

## Contexte

#1 a posé le schéma (`content_disciplines` / `content_discipline_i18n` / `content_videos`), la couche `src/lib/content-db.ts` (`assembleDiscipline` pur testé + `getDisciplineFromDb` avec garde env → repli statique), un générateur de seed (`scripts/gen-content-seed.ts`), et a câblé **Musculation** sur la base.

#2 généralise : **les 10 disciplines** servies depuis la base, **toutes les pages** basculées, et le **gating piloté par les `min_plan` de la base** (au lieu de la constante `FREE_DISCIPLINE`). Le **contenu statique est conservé en repli** (décision validée : résilience + générateur fonctionnel).

Consommateurs du contenu statique recensés :
- Serveur : `disciplines/[slug]/page.tsx`, `dashboard/page.tsx` (overview), `blog/[slug]/page.tsx` (meta), `sitemap.ts` (slugs).
- Client : `dashboard/programme/ProgrammeClient.tsx`, `dashboard/progression/ProgressionClient.tsx`.

## Décisions (validées)

- **Repli statique conservé** (option A) : la base est la source quand elle répond ; sinon `disciplines*.ts`.
- **Gating piloté par `min_plan` DB** : remplace la constante `FREE_DISCIPLINE`.
- **Contrôle de périmètre** : `progression`, `blog` (meta) et `sitemap` restent sur le statique (contenu/labels stables, non premium) — hors #2.
- Possibilité de **scinder serveur/client** au moment du plan si trop gros d'un bloc.

## Architecture

### 1. Migration — seed des 10 disciplines
- Lancer `npx tsx scripts/gen-content-seed.ts running-cardio musculation hiit cyclisme natation crossfit yoga boxing stretching nutrition` → SQL d'insertion des 10 disciplines (3 langues), idempotent (`on conflict do update`).
- Le SQL généré remplace la section SEED de `supabase-content.sql` (ou un fichier `supabase-content-seed.sql` dédié, vu la taille). **Exécution manuelle par l'utilisateur** dans Supabase → SQL Editor.
- `min_plan` : `musculation = 'free'` (vidéo 0 free), les 9 autres `'pro'` — règle déjà dans le générateur.

### 2. Lecture serveur → base (repli statique)
- `src/app/[locale]/disciplines/[slug]/page.tsx` : retirer le cas spécial Musculation → `const db = await getDisciplineFromDb(slug, locale)` pour **toutes** les disciplines ; `meta = db?.meta ?? getDisciplineMeta(...)`, `content = db?.content ?? getDisciplineContent(...)[slug]`. Passer `minPlan = db?.minPlan ?? (slug === 'musculation' ? 'free' : 'pro')` au `SubscriberGate` (cf. §4).
- `src/app/[locale]/dashboard/page.tsx` (overview) : là où il lit `DISCIPLINE_CONTENT[slug]`, lire la base (repli statique). (Composant serveur → lecture directe.)
- Reste **SSG** (lecture au build via `generateStaticParams`).

### 3. Route API + dashboard *Programme* (client)
- **Nouvelle route `GET /api/disciplines/[slug]?locale=fr|en|de`** (`runtime nodejs`) → `{ meta, content, minPlan, videoMinPlans } | null` via `getDisciplineFromDb` ; **publique** (le contenu est déjà public). Repli : si `null`, le client utilise le statique.
- `ProgrammeClient.tsx` : au changement d'onglet (`selected`), `fetch('/api/disciplines/<slug>?locale=')` → utilise `content` renvoyé (repli `DISCIPLINE_CONTENT[selected]` si échec/null), et **gate** via `minPlan` renvoyé : `locked = !isPro && minPlan !== 'free'` (au lieu de `slug === FREE_DISCIPLINE`). Compte vidéos gratuites : `videoMinPlans.filter(p => p==='free').length` (repli `FREE_VIDEO_COUNT`).

### 4. Gating piloté par la base — `content-access.ts` + `SubscriberGate`
- `content-access.ts` : ajouter `canAccessByPlan(access, minPlan)` = `access.isPro || minPlan === 'free'`. Conserver `PRO_ONLY_SERVICES` + `canUseService` (les services ne sont pas en base). Les helpers/constantes devenus inutilisés (`FREE_DISCIPLINE`, `canAccessDiscipline`, `canAccessVideo`, `FREE_VIDEO_COUNT` selon usage restant) sont retirés **uniquement s'ils ne sont plus référencés** (sinon conservés), avec mise à jour de `content-access.test.ts`.
- `SubscriberGate.tsx` : remplacer le check interne `slug === FREE_DISCIPLINE` par un prop **`minPlan`** : `isUnlockedFree = minPlan === 'free'`. La page publique passe `db?.minPlan`. (Le fetch `/api/subscription` pour l'état PRO reste.)

### 5. Restent sur le statique (hors #2)
`progression/ProgressionClient.tsx` (libellés des séances de l'utilisateur), `blog/[slug]` (meta d'une discipline liée), `sitemap.ts` (slugs) — inchangés.

## Cas limites
- Base vide / env Supabase absent (build local) → `getDisciplineFromDb`/route renvoient `null` → repli statique (zéro régression).
- Discipline absente de la base mais présente en statique (ex. avant exécution du seed complet) → repli statique.
- `minPlan` inconnu côté client (fetch échoué) → repli : `slug === 'musculation' ? 'free' : 'pro'`.

## Tests & vérification
- Test unitaire `canAccessByPlan` (pro/free/min_plan). `assembleDiscipline` déjà couvert.
- `tsc` + `eslint` + `jest` + `next build` (disciplines `●` SSG) ✅.
- Vérif manuelle (après seed) : chaque discipline publique servie depuis la base ; dashboard *Programme* — Musculation déverrouillée, autres cadenassées (selon `min_plan` DB) ; gating cohérent.

## Hors périmètre
- **#3** : back-office (CMS) — CRUD contenu + `min_plan` + 3 langues + revalidation à la demande (ISR) pour éditer sans redéploiement. C'est là qu'arrive le vrai bénéfice « éditable sans redéploiement ».
