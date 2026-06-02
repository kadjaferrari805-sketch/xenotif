# Avis clients — Design

Date : 2026-06-02
Statut : validé (décisions de cadrage) — en attente de relecture du spec

## Objectif

Permettre aux clients de laisser un avis **vérifié** sur :
- les **produits digitaux Xenotif** (guides PDF) — avis produit ;
- la **plateforme** (abonnement) — témoignage.

Affiché en complément des notes/témoignages « marketing » statiques déjà en place.

## Décisions de cadrage

| Sujet | Décision |
|---|---|
| Périmètre | Témoignages plateforme **et** avis produits |
| Qui peut poster | **Acheteurs vérifiés** (connecté + achat/abonnement confirmé) |
| Modération | **Publication immédiate** + masquer/supprimer côté admin (a posteriori) |
| Articulation au statique | **Garder** les notes/témoignages statiques **+** ajouter une section « Avis clients » réelle |
| Produits Amazon affiliés | **Pas d'avis sur le site** (vente sur Amazon → non vérifiable). Avis produit **uniquement sur les guides digitaux** vendus via Stripe |

## Contrainte clé

« Acheteur vérifié » ne peut s'appliquer qu'à ce que Xenotif vend lui-même :
- **Guides digitaux** (d1–d4) → enregistrés dans `boutique_orders` (Stripe) → vérifiables.
- **Abonnement** → table `subscriptions` → vérifiable.
- **Produits affiliés Amazon** → vente hors site → **non vérifiables** → exclus des avis.

## Modèle de données

Nouvelle table Supabase `public.reviews` (migration : `supabase-reviews.sql`) :

| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid PK | `gen_random_uuid()` |
| `type` | text | `'platform'` \| `'product'` (check) |
| `product_id` | text null | id produit (ex. `d1`) ; null pour plateforme |
| `user_id` | uuid | auteur (auth.users) |
| `author_name` | text | nom affiché (snapshot du profil au moment de l'avis) |
| `rating` | int | 1–5 (check) |
| `comment` | text | non vide |
| `locale` | text | `'fr'`/`'en'` (langue de saisie) |
| `hidden` | boolean | défaut `false` — masquage admin |
| `created_at` / `updated_at` | timestamptz | défaut `now()` |

Unicité (1 avis par client & cible, modifiable) via index partiels :
- `unique (user_id, product_id) where type='product'`
- `unique (user_id) where type='platform'`

RLS : activée, **aucune policy publique** → accès uniquement via la **service_role** (les routes API), comme `boutique_orders`.

## Éligibilité (vérification, côté serveur)

L'utilisateur doit être **connecté** (session Supabase → user_id + email). Puis :
- **`product`** (guide digital) : il existe une ligne `boutique_orders` avec `email = user.email` (minuscule) **et** `product_id ∈ product_ids`. De plus, `productId` doit être un produit de **type `digital`** (sinon rejet — exclut les produits Amazon).
- **`platform`** : il existe une ligne `subscriptions` pour `user_id` avec `status ∈ (active, trialing)`.

## API

- `GET /api/reviews?type=platform` → témoignages non masqués (récents d'abord, limite ~20).
- `GET /api/reviews?type=product&productId=d1` → avis non masqués du produit.
- `GET /api/reviews/eligibility?type=…&productId=…` → `{ eligible: boolean, reason: 'guest'|'not_subscriber'|'not_buyer'|'ok', existing?: {...} }` pour la session courante (le client affiche le formulaire si éligible, pré-rempli si avis existant).
- `POST /api/reviews` → body `{ type, productId?, rating, comment }`. Vérifie session + éligibilité, **upsert** (1 par client/cible), `author_name` depuis le profil, `hidden=false`. Renvoie l'avis créé.
- Admin :
  - `GET /api/admin/reviews` → tous (y compris masqués).
  - `PATCH /api/admin/reviews` → `{ id, hidden }` (masquer/réafficher).
  - `DELETE /api/admin/reviews?id=…` → suppression.
  - Protégées selon le pattern d'auth admin existant (`/admin`, `/api/admin/send-email`).

Toutes les routes : `runtime nodejs`, service role pour la DB.

## UI / Affichage (compatible SSG)

Les pages accueil & boutique sont en **SSG** → l'affichage des avis se fait via un **composant client** qui charge les avis au montage (les pages restent statiques).

Composant `CustomerReviews` (`src/components/reviews/CustomerReviews.tsx`, `'use client'`), props `kind: 'product'|'platform'`, `productId?`. Rend :
1. la **liste** des avis (étoiles, nom, badge **« ✓ Achat vérifié »**, date locale, commentaire) ;
2. le **formulaire** « Laisser un avis » (étoiles 1–5 + commentaire, ≥ 10 caractères ; nom du profil en lecture seule) — affiché si `eligibility.eligible`, pré-rempli si avis existant ; sinon un message contextuel (« Connecte-toi », « Réservé aux acheteurs/abonnés »).

Intégration :
- **Fiche produit digitale** (`ProductDetail`, si `product.type === 'digital'`) : section « Avis clients » sous le contenu existant. La note marketing statique reste inchangée.
- **Accueil** : sous la section `Reviews` statique, un bloc « Ils ont laissé leur avis » avec les témoignages réels + le formulaire (si éligible).

## Admin

La page `/admin` reçoit une section « Avis » : liste (avec masqués), boutons **Masquer/Afficher** et **Supprimer**, via `/api/admin/reviews`.

## i18n

Namespace `reviews` dans `messages/{fr,en}.json` : titres de section, libellés du formulaire, aria des étoiles, badge « Achat vérifié », « Aucun avis pour l'instant », CTA d'éligibilité, erreurs, libellés admin. Les **commentaires** (contenu client) ne sont pas traduits (affichés tels quels ; `locale` stockée).

## Hors périmètre (YAGNI)

Votes « utile », réponses du vendeur, photos, historique d'édition, notifications email, captcha (la vérification d'achat limite déjà le spam), pagination avancée (simple limite suffisante).

## Vérification (definition of done)

- Migration `supabase-reviews.sql` fournie (à exécuter par l'utilisateur).
- Un acheteur connecté d'un guide digital peut poster/modifier 1 avis, visible aussitôt avec badge vérifié.
- Un abonné connecté peut poster/modifier 1 témoignage plateforme.
- Un non-connecté / non-acheteur / non-abonné ne peut pas poster (message clair).
- Produits Amazon : pas de section avis.
- Admin peut masquer/supprimer.
- `tsc` 0, `next build` OK, pages accueil & boutique restent statiques (SSG), parité FR/EN.
