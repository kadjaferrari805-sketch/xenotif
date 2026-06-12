# Phase 4 — « Transformations avant/après » — Spécification

**Date :** 2026-06-12
**Branche :** `feat-phase4-transformations`
**Contexte :** Phase 4 de la transformation premium (cf. [[transformation-premium]]) — preuves sociales (#5/#6). Décisions actées : **système d'envoi par les clients** (jamais de faux contenu, cf. [[project_reviews]]) ; **photos avant/après** (Supabase Storage) ; vidéos via lien YouTube curé **plus tard** ; galerie publique **affichée uniquement une fois remplie**.

## Objectif
Preuve sociale puissante (vraies transformations clients) avec consentement + modération, sans rien inventer.

## Principe & modèle
Calqué sur le système d'**avis** existant : table protégée RLS (accès **service_role** via routes API), modération admin (`admin_users`), affichage public des éléments **approuvés**. Nouveauté : **upload média** vers **Supabase Storage** (jamais utilisé jusqu'ici).

## Setup manuel requis (utilisateur, dans Supabase)
1. Exécuter `supabase-transformations.sql` (DDL + RLS).
2. Créer un **bucket Storage public** nommé `transformations` (lecture publique, écriture service-role).
Le plan fournira le SQL et les étapes exactes.

## Livrable 1 — Schéma `supabase-transformations.sql`
```sql
create table if not exists public.transformations (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null,                       -- auth.users.id
  display_name text,                                -- pseudo affiché (sinon « Membre Xenotif »)
  before_path  text not null,                       -- chemin dans le bucket Storage
  after_path   text not null,
  caption      text,
  weeks        int,                                 -- durée (semaines)
  consent      boolean not null default false,      -- consentement publication
  status       text not null default 'pending',     -- pending | approved | rejected
  created_at   timestamptz default now()
);
create index if not exists transformations_status_idx on public.transformations (status, created_at desc);
alter table public.transformations enable row level security; -- aucune policy → accès via service_role uniquement
```
Bucket Storage `transformations` : public en lecture (`render`/URL publique), écriture via service-role (routes API).

## Livrable 2 — Routes API
- **`POST /api/transformations`** (connecté) : `FormData` { before: File, after: File, caption, weeks, displayName, consent }.
  - Auth via `createClient().auth.getUser()` (401 si invité). Refus si `consent !== 'true'`.
  - Validation : type `image/*`, taille ≤ 5 Mo chacune.
  - Upload `service.storage.from('transformations').upload(\`${user.id}/${uuid}-before.<ext>\`, buffer, { contentType })` (idem after).
  - Insert row `{ user_id, display_name, before_path, after_path, caption, weeks, consent: true, status: 'pending' }`.
  - Retour `{ ok: true }`.
- **`GET /api/transformations`** (public) : renvoie les transformations **`status='approved'`** (limit ~12, ordre récent), avec **URLs publiques** (`service.storage.from('transformations').getPublicUrl(path)`). Forme : `{ items: [{ id, displayName, beforeUrl, afterUrl, caption, weeks }] }`.
- **`GET /api/admin/transformations`** (admin) : liste les `pending`. **`POST /api/admin/transformations`** (admin) : `{ id, status: 'approved' | 'rejected' }`. Gating admin identique aux pages `/admin` (`admin_users`).

## Livrable 3 — Composants
- **`src/components/transformations/TransformationForm.tsx`** (`'use client'`, espace membre) : 2 `input[type=file]` (avant/après) avec **aperçu** (URL.createObjectURL), légende, durée (semaines), pseudo optionnel, **case consentement** obligatoire → `POST` (FormData). États loading/erreur/succès (« en attente de validation »).
- **`src/components/transformations/TransformationsGallery.tsx`** (`'use client'`, public) : `useEffect` → `GET /api/transformations`. **Ne rend RIEN si `items.length === 0`**. Sinon section « Ils l'ont fait » : cartes **avant/après** côte à côte (2 images) + légende + durée + pseudo.
- **`src/components/transformations/AdminTransformations.tsx`** (`'use client'`, admin) : liste `pending` (aperçu avant/après) + boutons Approuver / Rejeter (`POST /api/admin/transformations`).

## Livrable 4 — Intégration
- **Espace membre** : carte « Partage ta transformation » → ouvre/affiche `TransformationForm`. Placement : page `/dashboard/progression` (près de l'invitation à laisser un avis) ou bloc dédié.
- **Accueil** (`src/app/[locale]/page.tsx`) : `<TransformationsGallery />` après les avis (`CustomerReviews`). Masquée tant que vide → pas de section vide.
- **Admin** : `<AdminTransformations />` ajouté à la page `/admin`.
- **i18n** : namespace `transformations` (fr/en/de) — titres, libellés du formulaire (avant/après, légende, durée, consentement), états, galerie, modération.

## Tests (Jest)
- **Validation** (lib pure `src/lib/transformations.ts` : `validateImage(file)` → ok/erreur taille/type) — testée unitairement.
- `TransformationsGallery` : ne rend rien si `items` vide (mock fetch → []), rend une carte si un item (mock fetch).
- `TransformationForm` : la soumission est bloquée sans consentement (bouton désactivé / message).
- Non-régression : suite existante.

## Sécurité / confidentialité
- RLS : table accessible **uniquement** via service_role (routes API), comme `reviews`.
- Consentement **obligatoire** avant publication ; modération **manuelle** (rien n'est public sans approbation admin).
- Pseudo par défaut (« Membre Xenotif ») si pas de `display_name` → pas d'exposition du nom réel sans choix.
- Bucket public en **lecture seule** ; écriture service-role.

## Hors périmètre
- Vidéos témoignages (lien YouTube curé — phase ultérieure).
- Recadrage/transcodage automatique, notifications, signalement.

## Critères de succès
1. Un membre connecté peut soumettre une transfo avant/après (avec consentement) → stockée en `pending`.
2. L'admin modère (approuve/rejette) sur `/admin`.
3. La galerie publique affiche les transformations **approuvées** (et reste masquée si vide).
4. RLS service-role, consentement obligatoire, pseudo par défaut. i18n fr/en/de, tests verts, tsc, lint.
5. SQL + bucket documentés pour exécution manuelle.
