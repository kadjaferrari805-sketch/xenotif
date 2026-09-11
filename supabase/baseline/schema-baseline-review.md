# Baseline de schéma candidate — Xenotif Website

> **Statut : VALIDÉE (05-B.2a-FINAL) — READY FOR COMMIT REVIEW.** Rien n'est appliqué nulle part. Ne jamais exécuter sur la production.
> Branche locale `chore/schema-baseline-candidate`, fichiers non commités et non poussés. Migration versionnée : `supabase/migrations/20260911183926_website_baseline.sql`. Décisions validées : §14.

## 1. Source de vérité production

- Projet `pciadjwuxuevkqkdarut` « Xenotif », eu-west-1, `ACTIVE_HEALTHY`, PostgreSQL 17.6.1.127.
- Extraction par `SELECT` sur le catalogue uniquement (pas de `pg_dump`, absent) : `pg_attribute`, `pg_constraint` + `pg_get_constraintdef`, `pg_index` + `pg_get_indexdef`, `pg_policies`, `pg_proc` + `pg_get_functiondef`, `pg_trigger` + `pg_get_triggerdef`, `pg_event_trigger`, `aclexplode`, `storage.buckets` (métadonnées), `supabase_migrations.schema_migrations` (en-têtes d'instructions, INSERT/UPDATE/DELETE masqués).
- Volume lu : 35 tables, 291 colonnes, 102 contraintes, 66 index, 44 policies, 4 fonctions, 3 triggers, 1 event trigger, 105 droits. Aucune vue, séquence ni publication dans `public`.
- Aucune ligne de données lue ni exportée.

## 2. WEBSITE REQUIRED OBJECTS

Déterminé depuis le code du dépôt `xenotif` (`src/`, 318 fichiers hors tests) : appels `.from()`, `.rpc()`, `storage.from()`, Auth, routes API et cron, `proxy.ts`. Mentions textuelles écartées après lecture (faux positifs : `exercises`, `products`, `programs`, `orders`, `users` dans des contenus éditoriaux).

| Objet | Type | Accès site (`.from`) | Aussi mobile / Edge Function | Catégorie | Baseline |
|---|---|---|---|---|---|
| `abandoned_carts` | table | 3 | — | A — WEBSITE REQUIRED | incluse |
| `admin_users` | table | 9 | 1 | A — WEBSITE REQUIRED (partagé) | incluse |
| `boutique_orders` | table | 2 | — | A — WEBSITE REQUIRED | incluse |
| `coach_usage` | table | via RPC | — | A — WEBSITE REQUIRED | incluse |
| `content_discipline_i18n` | table | 3 | — | A — WEBSITE REQUIRED | incluse |
| `content_disciplines` | table | 4 | — | A — WEBSITE REQUIRED | incluse |
| `content_videos` | table | 3 | — | A — WEBSITE REQUIRED | incluse |
| `fitness_goals` | table | 1 | 2 | A — WEBSITE REQUIRED (partagé) | incluse |
| `health_metrics` | table | 4 | 5 | A — WEBSITE REQUIRED (partagé) | incluse |
| `newsletter_subscribers` | table | 2 | — | A — WEBSITE REQUIRED | incluse |
| `profiles` | table | 11 | 8 | A — WEBSITE REQUIRED (partagé) | incluse |
| `progress` | table | 5 | 7 | A — WEBSITE REQUIRED (partagé) | incluse |
| `push_tokens` | table | 2 | 1 | A — WEBSITE REQUIRED (partagé) | incluse |
| `reviews` | table | 3 | 1 | A — WEBSITE REQUIRED (partagé) | incluse |
| `smartwatch_connections` | table | 4 | 1 | A — WEBSITE REQUIRED (partagé) | incluse |
| `smartwatch_sessions` | table | 2 | — | A — WEBSITE REQUIRED | incluse |
| `stripe_events` | table | 1 | — | A — WEBSITE REQUIRED | incluse |
| `subscriptions` | table | 17 | 4 | A — WEBSITE REQUIRED (partagé) | incluse |
| `user_streaks` | table | 2 | 3 | A — WEBSITE REQUIRED (partagé) | incluse |
| `web_push_subscriptions` | table | 4 | — | A — WEBSITE REQUIRED | incluse |
| `workouts` | table | 4 | — | A — WEBSITE REQUIRED | incluse |
| `transformations` | table + bucket | 2 (+ 2 routes Storage) | — | **WEBSITE REQUIRED BUT ABSENT FROM PRODUCTION** | exclue (dérive) |
| `coach_consume_quota(uuid, integer)` | RPC | 1 (`/api/coach`) | — | A | incluse |
| `handle_new_user()` + `on_auth_user_created` | fonction + trigger `auth.users` | indirect (inscription) | indirect | A (partagé) | incluse |
| `handle_updated_at()` + `profiles_updated_at`, `subscriptions_updated_at` | fonction + triggers | indirect | indirect | A (partagé) | incluse |
| Auth e-mail / mot de passe | service | voir §11 | oui | A | configuration, pas SQL |

## 3. Objets hors site

| Objet | Catégorie | Constat | Baseline |
|---|---|---|---|
| `achievements` | B — MOBILE ONLY | `.from` mobile : 2 ; site : 0 | exclue |
| `exercises` | B — MOBILE ONLY | `.from` mobile : 3 ; site : 0 | exclue |
| `favorite_exercises` | B — MOBILE ONLY | `.from` mobile : 1 ; site : 0 | exclue |
| `program_sessions` | B — MOBILE ONLY | `.from` mobile : 3 ; site : 0 | exclue |
| `programs` | B — MOBILE ONLY | `.from` mobile : 2 ; site : 0 | exclue |
| `session_exercises` | B — MOBILE ONLY | `.from` mobile : 1 ; site : 0 | exclue |
| `user_achievements` | B — MOBILE ONLY | `.from` mobile : 3 ; site : 0 | exclue |
| `users` | C — SHARED / UNCERTAIN | 0 dans le site ; 1 `.from` dans `XenotifFitness/apps/web` (application distincte, déploiement NON VÉRIFIÉ) | exclue |
| `coach_messages` | D — OBSOLETE / UNUSED | aucun accès trouvé (site, mobile, Edge Functions, apps du monorepo) | exclue |
| `metrics` | D — OBSOLETE / UNUSED | aucun accès trouvé (site, mobile, Edge Functions, apps du monorepo) | exclue |
| `order_items` | D — OBSOLETE / UNUSED | aucun accès trouvé (site, mobile, Edge Functions, apps du monorepo) | exclue |
| `orders` | D — OBSOLETE / UNUSED | aucun accès trouvé (site, mobile, Edge Functions, apps du monorepo) | exclue |
| `products` | D — OBSOLETE / UNUSED | aucun accès trouvé (site, mobile, Edge Functions, apps du monorepo) | exclue |
| `workout_sessions` | D — OBSOLETE / UNUSED | aucun accès trouvé (site, mobile, Edge Functions, apps du monorepo) | exclue |
| bucket `avatars` (public) | B — MOBILE ONLY | référencé dans le code mobile | exclu |
| bucket `discipline-heroes` (public) | B — MOBILE ONLY | référencé dans le code mobile | exclu |
| bucket `exercise-demos` (public) | B — MOBILE ONLY | aucune référence dans le code ; créé par une migration mobile ; usage via URL en base probable (NON VÉRIFIÉ) | exclu |
| bucket `program-covers` (public) | B — MOBILE ONLY | aucune référence dans le code ; créé par une migration mobile ; usage via URL en base probable (NON VÉRIFIÉ) | exclu |
| `rls_auto_enable()` + event trigger `ensure_rls` | GÉNÉRIQUE (production uniquement) | voir §8 | non créé — note documentaire |

## 4. Contenu de la baseline candidate

`schema-baseline-candidate.sql` — 124 instructions validées par le parseur PostgreSQL (pglast v8.4 (libpg_query)) : CreateFunctionStmt 3, GrantStmt 25, CreateStmt 21, AlterTableStmt 36, IndexStmt 8, CreatePolicyStmt 28, CreateTrigStmt 3. Instructions de données : **0**.

Ordre : garde (migration uniquement) → fonctions → tables (colonnes, PK, UNIQUE, CHECK) → clés étrangères → index → RLS → policies → triggers → droits → note documentaire sur `rls_auto_enable`.

Les deux `insert` présents dans le fichier sont dans le corps des fonctions `handle_new_user` et `coach_consume_quota` : ce sont des définitions, pas des données.

Exclus volontairement : objets B, C, D ; dérives (§9) ; buckets et policies Storage ; données de contenu (`content_*`) ; utilisateurs.

## 5. profiles

| Colonne | Type | Null | Défaut | Source dépôt | Site (VERIFIED) | Mobile (mention lexicale) | Baseline |
|---|---|---|---|---|---|---|---|
| `id` | uuid | NOT NULL | — | `web:supabase/schema.sql` OK | lu | — | incluse |
| `full_name` | text | null | — | `web:supabase/schema.sql` OK | lu / écrit | — | incluse |
| `avatar_url` | text | null | — | `web:supabase/schema.sql` OK | non trouvé | — | incluse |
| `created_at` | timestamp with time zone | NOT NULL | now() | `web:supabase/schema.sql` OK | lu | — | incluse |
| `updated_at` | timestamp with time zone | NOT NULL | now() | `web:supabase/schema.sql` OK | trigger | — | incluse |
| `locale` | text | NOT NULL | 'fr'::text | `web:supabase-i18n-locale.sql` OK | lu / écrit | mobile:6, mono_packages:1 | incluse |
| `sex` | text | null | — | **aucune** → PRODUCTION-DERIVED / TO BE VERSIONED | non lu | mobile:1 | incluse |
| `birth_year` | integer | null | — | **aucune** → PRODUCTION-DERIVED / TO BE VERSIONED | non lu | — | incluse |
| `height_cm` | integer | null | — | **aucune** → PRODUCTION-DERIVED / TO BE VERSIONED | non lu | mono_packages:1 | incluse |
| `weight_kg` | numeric(5,1) | null | — | **aucune** → PRODUCTION-DERIVED / TO BE VERSIONED | non lu | mono_packages:1 | incluse |
| `fitness_level` | text | null | — | **aucune** → PRODUCTION-DERIVED / TO BE VERSIONED | non lu | mobile:2, mono_packages:1 | incluse |
| `main_goal` | text | null | — | **aucune** → PRODUCTION-DERIVED / TO BE VERSIONED | non lu | mobile:4 | incluse |
| `onboarded` | boolean | NOT NULL | false | **aucune** → PRODUCTION-DERIVED / TO BE VERSIONED | non lu | mobile:2 | incluse |
| `onboarded_at` | timestamp with time zone | null | — | **aucune** → PRODUCTION-DERIVED / TO BE VERSIONED | non lu | mobile:1 | incluse |
| `xp_points` | integer | NOT NULL | 0 | `mono:packages/db/src/schema.sql` OK; `mono:packages/db/migrations/2026-07-15-plan8-foundations.sql` OK | non lu | mobile:2 | incluse |
| `level` | integer | NOT NULL | 1 | `mono:packages/db/src/schema.sql` OK; `mono:packages/db/migrations/2026-07-15-plan8-foundations.sql` OK | non lu | mobile:6, mono_packages:2 | incluse |
| `onboarding_step` | — | — | — | `web:supabase-onboarding.sql` (int not null default 0) | **lu et écrit** (`cron/onboarding`, `lib/onboarding.ts`) | — | **exclue — APP/SCHEMA DRIFT** |

Les 8 colonnes sans source (`sex`, `birth_year`, `height_cm`, `weight_kg`, `fitness_level`, `main_goal`, `onboarded`, `onboarded_at`) ne sont lues ni écrites par le site ; elles sont conservées pour que la structure partagée de `profiles` reste identique à la production (classement SHARED / UNCERTAIN). `birth_year` n'apparaît dans aucun code analysé. Les mentions mobiles sont lexicales (le même mot peut viser `health_metrics.weight_kg`, par exemple).

Contraintes : `profiles_pkey` PRIMARY KEY (id) ; `profiles_id_fkey` → `auth.users(id)` ON DELETE CASCADE. Trigger `profiles_updated_at`. Droits : ALL pour anon, authenticated, service_role (défaut Supabase, protégé par la RLS).

| Policy | Rôle | Opération | USING | WITH CHECK | Source | Doublon / redondance | Recommandation |
|---|---|---|---|---|---|---|---|
| Service role access profiles | public | ALL | `(auth.role() = 'service_role'::text)` | `—` | `web:supabase/schema.sql` IDENTIQUE | REDONDANTE : service_role contourne la RLS sur Supabase | conserver (dédoublonnage = décision séparée) |
| Users update own profile | public | UPDATE | `(auth.uid() = id)` | `—` | `web:supabase/schema.sql` IDENTIQUE | DOUBLON (effet identique à « profiles self update ») | conserver (dédoublonnage = décision séparée) |
| Users view own profile | public | SELECT | `(auth.uid() = id)` | `—` | `web:supabase/schema.sql` IDENTIQUE | DOUBLON (effet identique à « profiles self select ») | conserver (dédoublonnage = décision séparée) |
| profiles self select | public | SELECT | `(auth.uid() = id)` | `—` | **aucune** → PRODUCTION-DERIVED / TO BE VERSIONED | DOUBLON (effet identique à « Users view own profile ») | conserver (dédoublonnage = décision séparée) |
| profiles self update | public | UPDATE | `(auth.uid() = id)` | `(auth.uid() = id)` | **aucune** → PRODUCTION-DERIVED / TO BE VERSIONED | DOUBLON (effet identique à « Users update own profile ») | conserver (dédoublonnage = décision séparée) |
| profiles self upsert | public | INSERT | `—` | `(auth.uid() = id)` | **aucune** → PRODUCTION-DERIVED / TO BE VERSIONED | — | conserver : seule policy INSERT côté client |

Aucune policy n'est retirée. Les rôles `public` incluent `anon`, pour qui `auth.uid()` est NULL : aucune ligne n'est accessible.

## 6. subscriptions

| Colonne | Type | Null | Défaut | Source dépôt | Site | Baseline |
|---|---|---|---|---|---|---|
| `id` | uuid | NOT NULL | gen_random_uuid() | `web:supabase/schema.sql` OK; `mono:packages/db/src/schema.sql` OK | — | incluse |
| `user_id` | uuid | NOT NULL | — | `web:supabase/schema.sql` OK; `mono:packages/db/src/schema.sql` OK | lu | incluse |
| `stripe_customer_id` | text | null | — | `web:supabase/schema.sql` OK | lu / écrit | incluse |
| `stripe_subscription_id` | text | null | — | `web:supabase/schema.sql` OK; `mono:packages/db/src/schema.sql` OK | lu / écrit | incluse |
| `plan` | text | NOT NULL | — | `web:supabase/schema.sql` OK | lu / écrit | incluse |
| `status` | text | NOT NULL | 'trialing'::text | `web:supabase/schema.sql` OK; `mono:packages/db/src/schema.sql` défaut None ≠ 'trialing'::text | lu / écrit | incluse |
| `trial_end` | timestamp with time zone | null | — | `web:supabase/schema.sql` OK | lu / écrit | incluse |
| `current_period_end` | timestamp with time zone | null | — | `web:supabase/schema.sql` OK; `mono:packages/db/src/schema.sql` not null True ≠ False | lu / écrit | incluse |
| `cancel_at_period_end` | boolean | null | false | `web:supabase/schema.sql` OK; `mono:packages/db/src/schema.sql` not null True ≠ False | lu / écrit | incluse |
| `created_at` | timestamp with time zone | NOT NULL | now() | `web:supabase/schema.sql` OK; `mono:packages/db/src/schema.sql` OK | — | incluse |
| `updated_at` | timestamp with time zone | NOT NULL | now() | `web:supabase/schema.sql` OK | trigger | incluse |
| `ga_purchase_sent` | boolean | NOT NULL | false | `web:supabase-ga-conversion.sql` OK | lu / écrit | incluse |
| `reactivation_sent_at` | — | — | — | `web:supabase-reactivation.sql` (timestamptz) | **lu et écrit** (`cron/reactivation`) | **exclue — APP/SCHEMA DRIFT** |
| `platform` | — | — | — | `mono:packages/db/src/schema.sql` seulement | non utilisé | exclue — MISSING IN PRODUCTION (déclaration obsolète) |
| `tier` | — | — | — | `mono:packages/db/src/schema.sql` seulement | non utilisé | exclue — MISSING IN PRODUCTION (déclaration obsolète) |
| `revenuecat_customer_id` | — | — | — | `mono:packages/db/src/schema.sql` seulement | non utilisé | exclue — MISSING IN PRODUCTION (déclaration obsolète) |
| `trial_ends_at` | — | — | — | `mono:packages/db/src/schema.sql` seulement | non utilisé | exclue — MISSING IN PRODUCTION (déclaration obsolète) |

Contraintes (production) : `subscriptions_plan_check` CHECK (plan = ANY (ARRAY['pro'::text, 'elite'::text])); `subscriptions_status_check` CHECK (status = ANY (ARRAY['trialing'::text, 'active'::text, 'canceled'::text, 'past_due'::text, 'incomplete'::text])); `subscriptions_user_id_fkey` FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE; `subscriptions_pkey` PRIMARY KEY (id); `subscriptions_stripe_customer_id_key` UNIQUE (stripe_customer_id); `subscriptions_stripe_subscription_id_key` UNIQUE (stripe_subscription_id); `subscriptions_user_id_unique` UNIQUE (user_id).

- Champs Stripe : `stripe_customer_id`, `stripe_subscription_id` (UNIQUE chacun), `ga_purchase_sent`. `plan` accepte encore `elite` (héritage).
- RevenueCat : aucune colonne dédiée en production. La fonction `revenuecat-webhook` (monorepo mobile) écrit des lignes avec `stripe_subscription_id` NULL et les colonnes `plan`, `status`, `current_period_end` (VERIFIED IN CODE). `platform`, `tier`, `revenuecat_customer_id`, `trial_ends_at` n'existent que dans un schéma déclaratif du monorepo, non utilisé : non ajoutés.
- La FK `subscriptions_user_id_fkey` → `profiles(id)` rend possible la jointure `select('*, profiles(full_name)')` utilisée par l'admin du site.

## 7. Policies du site (28, reprises à l'identique)

| Table | Policy | Opération | Rôles | USING | WITH CHECK | Production | Source dépôt | Doublon / redondance |
|---|---|---|---|---|---|---|---|---|
| `admin_users` | Admins view admin table | SELECT | public | `(auth.uid() = id)` | `—` | active | `web:supabase/schema.sql` IDENTIQUE | — |
| `admin_users` | Service role access admin | ALL | public | `(auth.role() = 'service_role'::text)` | `—` | active | `web:supabase/schema.sql` IDENTIQUE | REDONDANTE : service_role contourne la RLS sur Supabase |
| `content_discipline_i18n` | content_discipline_i18n read | SELECT | public | `true` | `—` | active | `web:supabase-content.sql` IDENTIQUE | — |
| `content_disciplines` | content_disciplines read | SELECT | public | `true` | `—` | active | `web:supabase-content.sql` IDENTIQUE | — |
| `content_videos` | content_videos read | SELECT | public | `true` | `—` | active | `web:supabase-content.sql` IDENTIQUE | — |
| `fitness_goals` | Users manage own goals | ALL | public | `(auth.uid() = user_id)` | `—` | active | `web:supabase/schema.sql` IDENTIQUE | DOUBLON (effet identique à « own_goals ») |
| `fitness_goals` | own_goals | ALL | public | `(auth.uid() = user_id)` | `(auth.uid() = user_id)` | active | `web:supabase-smartwatch.sql` IDENTIQUE | DOUBLON (effet identique à « Users manage own goals ») |
| `health_metrics` | Users manage own metrics | ALL | public | `(auth.uid() = user_id)` | `—` | active | `web:supabase/schema.sql` IDENTIQUE | DOUBLON (effet identique à « own_metrics ») |
| `health_metrics` | own_metrics | ALL | public | `(auth.uid() = user_id)` | `(auth.uid() = user_id)` | active | `web:supabase-smartwatch.sql` IDENTIQUE | DOUBLON (effet identique à « Users manage own metrics ») |
| `profiles` | Service role access profiles | ALL | public | `(auth.role() = 'service_role'::text)` | `—` | active | `web:supabase/schema.sql` IDENTIQUE | REDONDANTE : service_role contourne la RLS sur Supabase |
| `profiles` | Users update own profile | UPDATE | public | `(auth.uid() = id)` | `—` | active | `web:supabase/schema.sql` IDENTIQUE | DOUBLON (effet identique à « profiles self update ») |
| `profiles` | Users view own profile | SELECT | public | `(auth.uid() = id)` | `—` | active | `web:supabase/schema.sql` IDENTIQUE | DOUBLON (effet identique à « profiles self select ») |
| `profiles` | profiles self select | SELECT | public | `(auth.uid() = id)` | `—` | active | **aucune** → PRODUCTION-DERIVED / TO BE VERSIONED | DOUBLON (effet identique à « Users view own profile ») |
| `profiles` | profiles self update | UPDATE | public | `(auth.uid() = id)` | `(auth.uid() = id)` | active | **aucune** → PRODUCTION-DERIVED / TO BE VERSIONED | DOUBLON (effet identique à « Users update own profile ») |
| `profiles` | profiles self upsert | INSERT | public | `—` | `(auth.uid() = id)` | active | **aucune** → PRODUCTION-DERIVED / TO BE VERSIONED | — |
| `progress` | Users manage own progress | ALL | public | `(auth.uid() = user_id)` | `—` | active | `web:supabase/schema.sql` IDENTIQUE | — |
| `push_tokens` | Service role access push tokens | ALL | public | `(auth.role() = 'service_role'::text)` | `—` | active | `web:supabase/schema.sql` IDENTIQUE | REDONDANTE : service_role contourne la RLS sur Supabase |
| `push_tokens` | Users manage own push tokens | ALL | public | `(auth.uid() = user_id)` | `—` | active | `web:supabase/schema.sql` IDENTIQUE | — |
| `smartwatch_connections` | Users manage own connections | ALL | public | `(auth.uid() = user_id)` | `—` | active | `web:supabase/schema.sql` IDENTIQUE | DOUBLON (effet identique à « own_connections ») |
| `smartwatch_connections` | own_connections | ALL | public | `(auth.uid() = user_id)` | `(auth.uid() = user_id)` | active | `web:supabase-smartwatch.sql` IDENTIQUE | DOUBLON (effet identique à « Users manage own connections ») |
| `smartwatch_sessions` | Users manage own sessions | ALL | public | `(auth.uid() = user_id)` | `—` | active | `web:supabase/schema.sql` IDENTIQUE | DOUBLON (effet identique à « own_sessions ») |
| `smartwatch_sessions` | own_sessions | ALL | public | `(auth.uid() = user_id)` | `(auth.uid() = user_id)` | active | `web:supabase-smartwatch.sql` IDENTIQUE | DOUBLON (effet identique à « Users manage own sessions ») |
| `subscriptions` | Service role access subscriptions | ALL | public | `(auth.role() = 'service_role'::text)` | `—` | active | `web:supabase/schema.sql` IDENTIQUE | REDONDANTE : service_role contourne la RLS sur Supabase |
| `subscriptions` | Users view own subscription | SELECT | public | `(auth.uid() = user_id)` | `—` | active | `web:supabase/schema.sql` IDENTIQUE | — |
| `user_streaks` | own streak insert | INSERT | public | `—` | `(auth.uid() = user_id)` | active | `web:supabase-streaks.sql` IDENTIQUE | — |
| `user_streaks` | own streak select | SELECT | public | `(auth.uid() = user_id)` | `—` | active | `web:supabase-streaks.sql` IDENTIQUE | — |
| `user_streaks` | own streak update | UPDATE | public | `(auth.uid() = user_id)` | `(auth.uid() = user_id)` | active | `web:supabase-streaks.sql` IDENTIQUE | — |
| `workouts` | Users manage own workouts | ALL | public | `(auth.uid() = user_id)` | `—` | active | `web:supabase/schema.sql` IDENTIQUE | — |

Tables sous RLS **sans aucune policy** (accès service_role uniquement, via les routes serveur) : `abandoned_carts`, `boutique_orders`, `coach_usage`, `newsletter_subscribers`, `reviews`, `stripe_events`, `web_push_subscriptions`.
Comparaison par définition : commande, rôles, USING et WITH CHECK normalisés, via le parseur PostgreSQL des deux côtés. 0 divergence entre la baseline et la production.

## 8. Fonctions et triggers

| Objet | Attributs production | Droits EXECUTE | Source dépôt (définition comparée) | Baseline |
|---|---|---|---|---|
| `coach_consume_quota(p_user_id uuid, p_limit integer)` | security definer=False, config=['search_path=public'], owner=postgres | `{postgres=X/postgres,service_role=X/postgres}` | `web:supabase-security-hardening.sql` IDENTIQUE | incluse |
| `handle_new_user()` | security definer=True, config=None, owner=postgres | `{=X/postgres,postgres=X/postgres,anon=X/postgres,authenticated=X/postgres,service_role=X/postgres}` | `web:supabase/schema.sql` IDENTIQUE | incluse |
| `handle_updated_at()` | security definer=False, config=None, owner=postgres | `{=X/postgres,postgres=X/postgres,anon=X/postgres,authenticated=X/postgres,service_role=X/postgres}` | `web:supabase/schema.sql` IDENTIQUE | incluse |
| trigger `on_auth_user_created` | `CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user()` | — | `web:supabase/schema.sql` IDENTIQUE | incluse |
| trigger `profiles_updated_at` | `CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at()` | — | `web:supabase/schema.sql` IDENTIQUE | incluse |
| trigger `subscriptions_updated_at` | `CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION handle_updated_at()` | — | `web:supabase/schema.sql` IDENTIQUE | incluse |

Points à revoir (non corrigés) : `handle_new_user` est SECURITY DEFINER sans `search_path` fixé et exécutable par `anon`/`authenticated` (advisors Supabase WARN) ; `handle_updated_at` sans `search_path` (WARN). La baseline reproduit la production telle quelle.

### Fonction de sécurité générique : `rls_auto_enable` / `ensure_rls`

- Production : fonction SECURITY DEFINER, `search_path=pg_catalog`, owner postgres, EXECUTE `{=X/postgres,postgres=X/postgres,anon=X/postgres,authenticated=X/postgres,service_role=X/postgres}` ; event trigger `ensure_rls` sur `ddl_command_end` pour ['CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO'].
- Corps **identique** à l'extrait publié dans la documentation Supabase (guides/database/postgres/row-level-security). Aucune source dans les dépôts ni dans l'historique des migrations.
- Non requis par le site : chaque table de la baseline active la RLS explicitement. **Décision 7 (05-B.2a-FINAL) : non créé par la baseline** ; seule une note documentaire le mentionne.

## 9. Dérives application / schéma (non corrigées)

| Objet | Défini dans | Utilisé par le site | Effet en production (d'après le code) | Classement |
|---|---|---|---|---|
| table `transformations` (10 colonnes, index `transformations_status_idx`, RLS sans policy) + bucket Storage public `transformations` | `web:supabase-transformations.sql` (bucket à créer à la main selon l'en-tête) | 7 fichiers : `api/transformations`, `api/admin/transformations` (upload + URL publique), composants et pages | table et bucket absents : routes en erreur | WEBSITE REQUIRED BUT ABSENT FROM PRODUCTION |
| `profiles.onboarding_step` int not null default 0 | `web:supabase-onboarding.sql` | `cron/onboarding`, `lib/onboarding.ts` | colonne absente : le commentaire du cron indique une réponse 500 et aucun envoi | APP/SCHEMA DRIFT |
| `subscriptions.reactivation_sent_at` timestamptz | `web:supabase-reactivation.sql` | `cron/reactivation` (select, filtre, update) | colonne absente : le commentaire du cron indique une réponse 500 | APP/SCHEMA DRIFT |

Aucun de ces objets n'est ajouté à la baseline. Décision séparée : versionner et appliquer ces migrations, ou retirer les fonctionnalités.

## 10. Storage

- Le site appelle le Storage **uniquement** pour le bucket `transformations` (absent en production) — VERIFIED IN CODE (`storage.from(BUCKET)` dans 2 routes).
- Les 4 buckets de production (`avatars`, `discipline-heroes`, `exercise-demos`, `program-covers`) et leurs 7 policies `storage.objects` sont MOBILE ONLY : non inclus.
- Conséquence : la baseline ne crée aucun bucket. Le bucket `transformations` relève de la décision sur la dérive (§9).

## 11. Auth (configuration, hors SQL)

- Fournisseur : e-mail + mot de passe (`signUp`, `signInWithPassword`, `signOut`, `updateUser`, `onAuthStateChange`, `getUser` ×33). Seul fournisseur présent en production (19 identités `email`).
- Confirmation : `emailRedirectTo: ${location.origin}/auth/callback` ; route `[locale]/auth/callback` → `exchangeCodeForSession`.
- Mot de passe oublié : `resetPasswordForEmail(..., { redirectTo: ${location.origin}/auth/reset-password })`.
- Admin (service_role, serveur) : `admin.createUser`, `admin.generateLink`, `admin.listUsers` (×6), `admin.getUserById` (×4).
- Exigences pour une Preview : Site URL et liste de redirections couvrant les origines de preview pour `/auth/callback` et `/auth/reset-password` ; choix SMTP (décision manuelle) ; trigger `on_auth_user_created` (inclus dans la baseline).
- Configuration Auth de production (Site URL, SMTP, modèles) : **NON VÉRIFIÉE** (pas d'accès Management API). Aucun utilisateur ni session copié.

## 12. Vérifications

- Syntaxe : 124 instructions analysées sans erreur par le parseur PostgreSQL (pglast v8.4 (libpg_query)).
- Reconstruction depuis l'arbre syntaxique, comparée au catalogue : colonnes 176/176 (noms et types), contraintes 60/60, index 8/8, triggers 3/3, RLS 21/21, policies 28/28 avec 0 divergence de définition.
- PL/pgSQL : `handle_updated_at` JSON pglast non décodable (car. 125: ':{"refname":"old","dno":1}},{}},{}},{}},') — la compilation libpg_query a abouti; `handle_new_user` JSON pglast non décodable (car. 125: ':{"refname":"old","dno":1}},{}},{}},{}},') — la compilation libpg_query a abouti; `coach_consume_quota` OK. Les deux fonctions concernées sont déjà compilées et actives en production.
- Exécution sur base vide : voir §18 (PGlite, PostgreSQL 18.3, schéma `auth` et rôles simulés). NON VÉRIFIÉ sur une base Supabase réelle ; configuration Auth ; équivalence octet par octet des migrations `security_hardening_phase02` et `progress_program_scope` avec les fichiers des dépôts.

## 13. Décisions ouvertes à l'issue de 05-B.2a (état final : §14)

- [ ] Valider la liste A (21 tables) et le maintien des 8 colonnes mobiles sans source dans `profiles`.
- [ ] Dérives : `transformations` (+ bucket), `profiles.onboarding_step`, `subscriptions.reactivation_sent_at` — appliquer via migration versionnée, ou retirer le code.
- [ ] Doublons de policies (`profiles`, `fitness_goals`, `health_metrics`, `smartwatch_connections`, `smartwatch_sessions`) et policies « Service role access » redondantes : conserver ou dédoublonner (changement de sécurité distinct).
- [ ] `rls_auto_enable` / `ensure_rls` : l'activer ou non dans la Preview.
- [ ] `handle_new_user` / `handle_updated_at` : durcissement `search_path` et droits EXECUTE (hors baseline).
- [ ] Versionner dans les dépôts les 5 migrations de production sans fichier (mobile) et aligner les noms/versions des 2 migrations du site.
- [ ] Retirer ou marquer obsolètes les déclarations divergentes (`supabase-smartwatch.sql`, `packages/db/src/schema.sql`, 12 policies absentes de la production).
- [ ] Emplacement final et format de la baseline (migration Supabase horodatée) avant tout commit.
- [ ] Données de contenu nécessaires à la Preview (`content_*`) : seed séparé, jamais copié depuis les données personnelles.

## 14. Décisions validées (05-B.2a-FINAL)

| # | Décision | Traduction dans la baseline |
|---|---|---|
| 1 | 21 tables Website validées | 21 `create table`, aucune table B, C ou D |
| 2 | `profiles` : 8 colonnes production conservées telles quelles | `sex`, `birth_year`, `height_cm`, `weight_kg`, `fitness_level`, `main_goal`, `onboarded`, `onboarded_at` : type, défaut et nullabilité de production ; `onboarding_step` exclu (dérive) |
| 3 | `subscriptions` : structure production = référence | 12 colonnes ; `platform`, `tier`, `revenuecat_customer_id`, `trial_ends_at`, `reactivation_sent_at` exclues (§17) |
| 4 | `transformations` hors baseline | classé WEBSITE REQUIRED BUT ABSENT FROM PRODUCTION (§17) |
| 5 | 28 policies conservées à l'identique, aucun nettoyage | liste des doublons et redondances en §15 |
| 6 | Fonctions et triggers du site conservés | 3 fonctions, 3 triggers ; hardening futur en §16 |
| 7 | `rls_auto_enable` / `ensure_rls` non créés | note documentaire uniquement |
| 8 | Exclusion définitive des objets mobiles | achievements, exercises, favorite_exercises, programs, program_sessions, session_exercises, user_achievements, buckets avatars / discipline-heroes / exercise-demos / program-covers, seeds |
| 9 | Bucket `transformations` = WEBSITE FEATURE DRIFT | aucun bucket dans la baseline |
| 10 | Migration versionnée | `supabase/migrations/20260911183926_website_baseline.sql` (§18) |
| 11 | Test de reproductibilité honnête | statique + PGlite ; Supabase réel NON VÉRIFIÉ (§18) |
| 12 | Aucun push, merge ni suppression de fichier historique | branche locale, fichiers non commités ; définitions concurrentes laissées en place |

## 15. SECURITY CLEANUP — FUTURE PHASE

Aucune de ces policies n'est modifiée ni supprimée dans cette phase (production et baseline identiques).

**Doublons à effet identique** (même table, même opération, mêmes rôles, même USING et même WITH CHECK effectif) :

| Table | Policy 1 (source) | Policy 2 (source) |
|---|---|---|
| `profiles` | Users view own profile (`supabase/schema.sql`) | profiles self select (aucune → versionnée par la migration) |
| `profiles` | Users update own profile (`supabase/schema.sql`) | profiles self update (aucune → versionnée par la migration) |
| `fitness_goals` | Users manage own goals (`supabase/schema.sql`) | own_goals (`supabase-smartwatch.sql`) |
| `health_metrics` | Users manage own metrics (`supabase/schema.sql`) | own_metrics (`supabase-smartwatch.sql`) |
| `smartwatch_connections` | Users manage own connections (`supabase/schema.sql`) | own_connections (`supabase-smartwatch.sql`) |
| `smartwatch_sessions` | Users manage own sessions (`supabase/schema.sql`) | own_sessions (`supabase-smartwatch.sql`) |

**Redondantes** — `service_role` a `rolbypassrls = true` (VÉRIFIÉ en production), ces policies n'ajoutent rien :

| Table | Policy |
|---|---|
| `admin_users` | Service role access admin |
| `profiles` | Service role access profiles |
| `push_tokens` | Service role access push tokens |
| `subscriptions` | Service role access subscriptions |

Hors site (non inclus) : `user_achievements` — Service role manages user achievements.

Autres points à examiner : toutes les policies ciblent le rôle `public` (inclut `anon`, sans effet car `auth.uid()` est NULL) ; 7 tables sous RLS sans policy (accès `service_role` seul) ; droits `ALL` accordés à `anon` et `authenticated` sur les 21 tables (défaut Supabase, protégés par la RLS).

## 16. HARDENING — FUTURE PHASE (fonctions)

| Fonction | Constat production (reproduit tel quel) | Piste future |
|---|---|---|
| `handle_new_user()` | SECURITY DEFINER, **`search_path` non fixé**, EXECUTE accordé à PUBLIC, `anon`, `authenticated`, `service_role` (advisors WARN) | fixer `search_path`, retirer EXECUTE à `anon`/`authenticated`/PUBLIC |
| `handle_updated_at()` | SECURITY INVOKER, `search_path` non fixé, EXECUTE PUBLIC (advisor WARN) | fixer `search_path` |
| `rls_auto_enable()` (production uniquement) | SECURITY DEFINER, exécutable par `anon`/`authenticated` (advisor WARN) | hors baseline ; à traiter dans la phase de sécurité production |

Aucune correction dans cette phase ; aucune modification de la production.

## 17. Dérives et déclarations écartées

**WEBSITE REQUIRED BUT ABSENT FROM PRODUCTION**

- Table `transformations` (+ index `transformations_status_idx`) — définie dans `supabase-transformations.sql`, utilisée par 7 fichiers du site, absente de la production.
- Bucket Storage `transformations` — **WEBSITE FEATURE DRIFT** : utilisé par `api/transformations` et `api/admin/transformations` (upload, URL publique), absent de la production, jamais créé par migration (création manuelle prévue par l'en-tête du fichier). Non créé en production, non inclus dans la baseline.

**APP/SCHEMA DRIFT**

- `profiles.onboarding_step` (`supabase-onboarding.sql`) — lu et écrit par `cron/onboarding`.
- `subscriptions.reactivation_sent_at` (`supabase-reactivation.sql`) — lu et écrit par `cron/reactivation`.

**Déclarations obsolètes, sans usage** (documentées séparément, non ajoutées)

- `subscriptions.platform`, `subscriptions.tier`, `subscriptions.revenuecat_customer_id`, `subscriptions.trial_ends_at` — présentes uniquement dans `XenotifFitness/packages/db/src/schema.sql`, absentes de la production, lues par aucun code du site ni par les Edge Functions.

Phase corrective séparée : versionner et appliquer, ou retirer le code. Aucune correction ici.

## 18. Migration versionnée et reproductibilité

**Fichier** : `supabase/migrations/20260911183926_website_baseline.sql` — convention CLI Supabase `<AAAAMMJJHHMMSS>_<nom>.sql`.

- Le dépôt du site ne contenait aucune migration ni `supabase/config.toml` : aucun doublon d'objet possible dans ce dépôt.
- Version `20260911183926` postérieure à la dernière version de production (`20260911144140`), absente de son historique : pas de collision.
- Les fichiers `XenotifFitness/packages/db/migrations/*.sql` (format date, non CLI) et `supabase-*.sql` ne doivent **pas** être rejoués sur une base initialisée par cette baseline : `progress_program_scope` échouerait sur la contrainte déjà présente, `plan8_foundations` créerait des objets mobiles.
- Corps identique à `schema-baseline-candidate.sql` (sha256 du corps : `898e823828f3dfbe`) ; la migration ajoute l'en-tête et une **garde** qui refuse toute base où l'une des 21 tables existe.
- **Risque** : la CLI Supabase du dépôt est liée au projet de production (`supabase/.temp/linked-project.json`, dossier non ignoré par git). Un `supabase db push` depuis ce dépôt viserait la production. Barrières : historique distant incompatible (comportement CLI NON VÉRIFIÉ ici) et garde de la migration (VÉRIFIÉE sur PGlite). Recommandation 05-B.2b : lier explicitement la CLI à `xenotif-preview` avant tout push.

**Tests**

| Contrôle | Résultat | Niveau |
|---|---|---|
| Syntaxe (parseur PostgreSQL, pglast 8.4) | 125 instructions valides | VÉRIFIÉ |
| Ordre des dépendances (tables → FK/index/RLS/policies ; fonctions → triggers/GRANT) | OK | VÉRIFIÉ |
| Références externes | `auth.users`, `auth.uid()`, `auth.role()`, `now()`, `gen_random_uuid()` uniquement | VÉRIFIÉ |
| Données / secrets / objets exclus | 0 / 0 / 0 | VÉRIFIÉ |
| Exécution sur base vide PGlite 0.5.8 (**PostgreSQL 18.3** WASM, en mémoire ; rôles `anon`/`authenticated`/`service_role` et schéma `auth` **simulés**) | appliquée sans erreur | VÉRIFIÉ (hors Supabase) |
| Catalogue PGlite vs production, par définition | colonnes 176/176, contraintes 60/60, index 41/41, policies 28/28, triggers 3/3, fonctions 3/3 (corps, security definer, search_path, droits), RLS 21/21, droits 63/63 | VÉRIFIÉ |
| Garde (2ᵉ exécution) | refusée | VÉRIFIÉ |
| Tests fonctionnels (données fictives, en mémoire) | trigger d'inscription, `updated_at`, CHECK `plan`, UNIQUE `user_id`, FK, RLS (utilisateur A : 1 profil / 1 abonnement ; anon : 0 ; insertion du profil de B refusée ; service_role : 2), `coach_consume_quota` (quota 2 : true, true, false ; `authenticated` : permission refusée ; `service_role` : autorisé), cascade de suppression | VÉRIFIÉ |
| Exécution sur une base **Supabase** vide (PostgreSQL 17.6, vrai schéma `auth`, privilèges par défaut) | — | **NOT VERIFIED — EMPTY SUPABASE DATABASE EXECUTION** (05-B.2b) |
