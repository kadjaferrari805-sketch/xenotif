# B2 #3 — Back-office (CMS) d'édition du contenu + revalidation à la demande

- **Date** : 2026-06-11
- **Statut** : design validé, prêt pour le plan d'implémentation
- **Position** : **sous-projet #3 (dernier) de B2**. Suit #1 (schéma) et #2 (#2a serveur + #2b client), tous mergés/déployés.

## Contexte

Le contenu des 10 disciplines est en base (`content_disciplines` / `content_discipline_i18n` jsonb / `content_videos`) et servi partout (pages publiques `/disciplines/[slug]` en **SSG** ; dashboard *Programme* via `/api/disciplines/[slug]` ; accueil). Aujourd'hui, **modifier le contenu = ré-exécuter le SQL de seed** (pas d'édition en ligne). #3 ajoute un **back-office** pour éditer le contenu et `min_plan`, avec **revalidation à la demande** des pages SSG → enfin « éditer sans redéploiement ».

L'admin existe : `/admin` (gated par la table `admin_users`), avec des sections (`AdminEmailForm`, `AdminPushForm`, `AdminReviews`). Le CMS sera de **nouvelles pages admin**. **Aucune revalidation/ISR** n'existe encore.

## Décisions (validées)

- **B — gating + meta (champs) + éditeur JSON pour les sections riches** (+ vidéos en JSON). Pas de WYSIWYG.
- **A — édition seule** des 10 disciplines existantes (pas de création/suppression).
- **Revalidation à la demande** des pages publiques après enregistrement.

## Architecture

### 1. Routes admin (gated `admin_users`)
- **`/admin/content`** (`src/app/[locale]/admin/content/page.tsx`, serveur) : vérifie l'admin (même check que `/admin` : user connecté + présent dans `admin_users`, sinon `redirect`). Liste les 10 disciplines (`FEATURES` pour les libellés/ordre + `content_disciplines` pour `min_plan`), chacune → lien vers l'éditeur.
- **`/admin/content/[slug]`** (`.../content/[slug]/page.tsx`, serveur) : même garde admin ; charge les **lignes brutes** via service-role (`content_disciplines` : `min_plan` ; `content_discipline_i18n` : `meta`/`sections` par locale ; `content_videos` : tableau) et les passe au formulaire client `ContentEditor`.

### 2. Éditeur — `src/components/admin/ContentEditor.tsx` (client)
- Prop : les données initiales chargées (min_plan, `{fr,en,de}: {meta, sections}`, videos[]).
- **`min_plan` discipline** : `<select>` `free`/`pro`.
- **Onglets langue (fr/en/de)** : pour chaque locale —
  - **Meta en champs** : `title`, `tag` (inputs), `description` (textarea), `stats` (textarea, une ligne par entrée), `levels` (textarea, une ligne par entrée).
  - **`sections`** : `<textarea>` JSON (pré-rempli `JSON.stringify(sections, null, 2)`).
- **Vidéos** : `<textarea>` JSON éditant `[{ idx, youtube_ids, min_plan, i18n }]` (pré-rempli formaté).
- Bouton **Enregistrer** → `POST /api/admin/content/[slug]` avec `{ minPlan, byLocale: { fr:{meta,sectionsJson}, en:…, de:… }, videosJson }`. Affiche succès / erreur de validation.

### 3. Validation — `src/lib/content-cms.ts` (pur, testé)
`parseContentPayload(input)` :
- parse chaque `sectionsJson` → objet ; vérifie les clés requises `{ tagline, heroStat, guide, tips, exercises, program, faq }`.
- parse `videosJson` → doit être un **tableau** d'objets `{ idx:number, youtube_ids:string[], min_plan:'free'|'pro', i18n:object }`.
- `minPlan` ∈ `{free,pro}`.
- meta : assemble `{ title, tag, description, stats[], levels[] }` (stats/levels = lignes non vides du textarea).
- Renvoie `{ ok: true, data }` ou `{ ok: false, error }`. **Aucune écriture si invalide.**

### 4. API d'enregistrement — `POST /api/admin/content/[slug]` (`runtime nodejs`)
- Garde **admin** (user connecté + `admin_users`), sinon 401/403.
- `parseContentPayload` ; si invalide → 400 + message.
- Écritures **service-role** : `content_disciplines` (upsert `min_plan`, `updated_at=now()`), `content_discipline_i18n` (upsert les 3 lignes `meta`+`sections`), `content_videos` (remplacer par `idx` : upsert `on conflict (discipline_slug, idx)` + supprimer les `idx` au-delà du nouveau nombre).
- **Revalidation** : `revalidatePath('/[locale]/disciplines/[slug]', 'page')` pour les variantes (ou `revalidatePath('/'+locale+'/disciplines/'+slug)` pour fr/en/de). Le dashboard lit en direct (`/api/disciplines/[slug]` non caché) → rien à revalider.
- Renvoie `{ ok: true }`.

### 5. Flux
Admin édite → Enregistrer → API valide + écrit + revalide → pages publiques régénérées au prochain hit (ISR à la demande) ; dashboard déjà en direct.

## Cas limites
- JSON invalide / clés manquantes → 400, rien écrit, message à l'éditeur.
- Non-admin → 403 (API) / redirect (pages).
- Discipline absente de la base (seed pas exécuté) → l'éditeur charge des valeurs vides ; le 1ᵉʳ enregistrement crée les lignes (upsert).
- Réduction du nombre de vidéos → les lignes `content_videos` d'`idx` supérieurs sont supprimées.

## Tests & vérification
- **Tests unitaires** `parseContentPayload` (JSON valide → data ; JSON invalide → erreur ; clés `sections` manquantes → erreur ; videos non-tableau → erreur ; `min_plan` invalide → erreur ; stats/levels multi-lignes).
- `tsc` + `eslint` + `jest` + `next build` ✅ ; `/admin/content` et `[slug]` rendus (dynamiques, gated).
- Vérif manuelle : éditer le `min_plan` d'une discipline (ex. passer une discipline en `free`) → après save, la page publique reflète le changement (revalidation) sans redéploiement ; un JSON sections invalide est refusé proprement.

## Hors périmètre
- Création/suppression de disciplines ; éditeurs WYSIWYG (sections/vidéos restent en JSON) ; édition de `FEATURES` (couleur/icône/photos/slug) ; gestion d'images/upload. B2 est terminé après #3.
