# Diff — production ↔ dépôts ↔ historique des migrations

> Phase 05-B.2a (validée 05-B.2a-FINAL). Structure uniquement. Comparaisons par définition (parseur PostgreSQL), pas seulement par nom. Migration : `supabase/migrations/20260911183926_website_baseline.sql`.

## 1. Historique des migrations de production (`supabase_migrations`)

SQL disponible pour les 14 migrations (lu sous forme d'en-têtes ; valeurs de données masquées). Le schéma de base antérieur au 15 juillet a été créé hors migrations (fichiers `supabase*.sql` exécutés dans l'éditeur SQL).

| Ordre | Version | Nom | Objets | Fichier équivalent dans les dépôts | Pertinence |
|---|---|---|---|---|---|
| 1 | `20260715181105` | plan8_foundations | profiles.xp_points / level ; programs ; program_sessions ; FK user_achievements→profiles ; INSERT (masqués) | mono:packages/db/migrations/2026-07-15-plan8-foundations.sql | PARTAGÉ (colonnes profiles) |
| 2 | `20260717162613` | programs_rls_policies | 2 policies programs / program_sessions | mono:…/2026-07-17-programs-rls-policies.sql | MOBILE |
| 3 | `20260717202412` | achievements_rls_policies | 4 policies achievements / user_achievements | mono:…/2026-07-17-achievements-rls-policies.sql | MOBILE |
| 4 | `20260717204128` | avatars_storage_bucket | bucket avatars + 4 policies storage | mono:…/2026-07-17-avatars-storage-bucket.sql | MOBILE |
| 5 | `20260718075311` | exercises_library | table exercises + index + policy ; bucket exercise-demos + policy | mono:…/2026-07-18-exercises-library.sql | MOBILE |
| 6 | `20260718092319` | program_covers_storage_bucket | bucket program-covers + policy | mono:…/2026-07-18-program-covers-storage-bucket.sql | MOBILE |
| 7 | `20260718102659` | discipline_heroes_storage_bucket | bucket discipline-heroes + policy | **AUCUN** | MOBILE |
| 8 | `20260719124000` | favorite_exercises | table favorite_exercises + index + policy | mono:…/2026-07-19-favorite-exercises.sql | MOBILE |
| 9 | `20260719155418` | seed_exercises_from_site_content | INSERT public.exercises (données, masquées) | **AUCUN** | MOBILE (données) |
| 10 | `20260719160508` | replace_placeholder_programs_with_real_site_programs | DELETE + INSERT programs / program_sessions (données, masquées) | **AUCUN** | MOBILE (données) |
| 11 | `20260719203908` | add_session_exercises_table | table session_exercises + index + policy + INSERT (masqués) | **AUCUN** | MOBILE |
| 12 | `20260719204301` | add_session_exercises_fk_to_exercises | FK session_exercises → exercises(slug) | **AUCUN** | MOBILE |
| 13 | `20260901084717` | progress_program_scope | progress.program_slug + commentaire + contrainte unique remplacée | mono:…/2026-08-25-progress-program-scope.sql (date ≠ version) | **SITE** (progress) |
| 14 | `20260911144140` | security_hardening_phase02 | coach_usage + RLS ; coach_consume_quota + REVOKE/GRANT ; stripe_events + RLS | web:supabase-security-hardening.sql (nom ≠, équivalence octet NON VÉRIFIÉE) | **SITE** |

Aucune migration de production n'a de fichier portant son numéro de version. 5 n'ont aucun équivalent (toutes mobiles).

## 2. Colonnes

35 tables de production : MATCH 247, CONFLICTING DEFINITION 26, MISSING IN REPO 16, DIFFERENT IN REPO 2.

### MISSING IN REPO (16)

| Colonne | Production | Dépôts | Site |
|---|---|---|---|
| `profiles.sex` | text, null, défaut — | — | oui |
| `profiles.birth_year` | integer, null, défaut — | — | oui |
| `profiles.height_cm` | integer, null, défaut — | — | oui |
| `profiles.weight_kg` | numeric(5,1), null, défaut — | — | oui |
| `profiles.fitness_level` | text, null, défaut — | — | oui |
| `profiles.main_goal` | text, null, défaut — | — | oui |
| `profiles.onboarded` | boolean, NOT NULL, défaut false | — | oui |
| `profiles.onboarded_at` | timestamp with time zone, null, défaut — | — | oui |
| `session_exercises.id` | uuid, NOT NULL, défaut gen_random_uuid() | — | non |
| `session_exercises.session_id` | uuid, NOT NULL, défaut — | — | non |
| `session_exercises.exercise_slug` | text, NOT NULL, défaut — | — | non |
| `session_exercises.order_index` | integer, NOT NULL, défaut — | — | non |
| `session_exercises.sets` | integer, NOT NULL, défaut 3 | — | non |
| `session_exercises.reps` | text, NOT NULL, défaut '10'::text | — | non |
| `session_exercises.rest_seconds` | integer, NOT NULL, défaut 60 | — | non |
| `session_exercises.work_seconds` | integer, null, défaut — | — | non |

### CONFLICTING DEFINITION (26)

| Colonne | Production | Dépôts | Site |
|---|---|---|---|
| `fitness_goals.steps_daily` | integer, null, défaut 10000 | `web:supabase-smartwatch.sql`: not null True ≠ False; `web:supabase/schema.sql`: OK | oui |
| `fitness_goals.calories_daily` | integer, null, défaut 500 | `web:supabase-smartwatch.sql`: not null True ≠ False; `web:supabase/schema.sql`: OK | oui |
| `fitness_goals.active_minutes_daily` | integer, null, défaut 30 | `web:supabase-smartwatch.sql`: not null True ≠ False; `web:supabase/schema.sql`: OK | oui |
| `fitness_goals.sleep_minutes_daily` | integer, null, défaut 480 | `web:supabase-smartwatch.sql`: not null True ≠ False; `web:supabase/schema.sql`: OK | oui |
| `fitness_goals.water_ml_daily` | integer, null, défaut 2000 | `web:supabase-smartwatch.sql`: not null True ≠ False; `web:supabase/schema.sql`: OK | oui |
| `fitness_goals.workouts_weekly` | integer, null, défaut 4 | `web:supabase-smartwatch.sql`: not null True ≠ False; `web:supabase/schema.sql`: OK | oui |
| `health_metrics.steps` | integer, null, défaut 0 | `web:supabase-smartwatch.sql`: not null True ≠ False; `web:supabase/schema.sql`: OK | oui |
| `health_metrics.calories_burned` | integer, null, défaut 0 | `web:supabase-smartwatch.sql`: not null True ≠ False; `web:supabase/schema.sql`: OK | oui |
| `health_metrics.active_minutes` | integer, null, défaut 0 | `web:supabase-smartwatch.sql`: not null True ≠ False; `web:supabase/schema.sql`: OK | oui |
| `health_metrics.distance_meters` | integer, null, défaut 0 | `web:supabase-smartwatch.sql`: not null True ≠ False; `web:supabase/schema.sql`: OK | oui |
| `health_metrics.sleep_minutes` | integer, null, défaut 0 | `web:supabase-smartwatch.sql`: not null True ≠ False; `web:supabase/schema.sql`: OK | oui |
| `health_metrics.weight_kg` | numeric(5,2), null, défaut — | `web:supabase-smartwatch.sql`: type numeric ≠ numeric(5,2); `web:supabase/schema.sql`: OK | oui |
| `health_metrics.hydration_ml` | integer, null, défaut 0 | `web:supabase-smartwatch.sql`: not null True ≠ False; `web:supabase/schema.sql`: OK | oui |
| `health_metrics.source` | text, null, défaut — | `web:supabase-smartwatch.sql`: not null True ≠ False; défaut 'manual' ≠ None; `web:supabase/schema.sql`: OK | oui |
| `smartwatch_connections.is_active` | boolean, null, défaut true | `web:supabase-smartwatch.sql`: not null True ≠ False; `web:supabase/schema.sql`: OK | oui |
| `smartwatch_sessions.ended_at` | timestamp with time zone, NOT NULL, défaut — | `web:supabase-smartwatch.sql`: not null False ≠ True; `web:supabase/schema.sql`: OK | oui |
| `smartwatch_sessions.duration_seconds` | integer, NOT NULL, défaut — | `web:supabase-smartwatch.sql`: défaut 0 ≠ None; `web:supabase/schema.sql`: OK | oui |
| `smartwatch_sessions.calories_burned` | integer, null, défaut 0 | `web:supabase-smartwatch.sql`: not null True ≠ False; `web:supabase/schema.sql`: OK | oui |
| `smartwatch_sessions.distance_meters` | integer, null, défaut 0 | `web:supabase-smartwatch.sql`: not null True ≠ False; `web:supabase/schema.sql`: OK | oui |
| `smartwatch_sessions.avg_pace_per_km` | integer, null, défaut — | `web:supabase-smartwatch.sql`: type numeric ≠ integer; `web:supabase/schema.sql`: OK | oui |
| `smartwatch_sessions.elevation_gain_meters` | integer, null, défaut 0 | `web:supabase-smartwatch.sql`: not null True ≠ False; `web:supabase/schema.sql`: OK | oui |
| `smartwatch_sessions.steps` | integer, null, défaut 0 | `web:supabase-smartwatch.sql`: not null True ≠ False; `web:supabase/schema.sql`: OK | oui |
| `smartwatch_sessions.source` | text, null, défaut — | `web:supabase-smartwatch.sql`: not null True ≠ False; défaut 'manual' ≠ None; `web:supabase/schema.sql`: OK | oui |
| `subscriptions.status` | text, NOT NULL, défaut 'trialing'::text | `web:supabase/schema.sql`: OK; `mono:packages/db/src/schema.sql`: défaut None ≠ 'trialing'::text | oui |
| `subscriptions.current_period_end` | timestamp with time zone, null, défaut — | `web:supabase/schema.sql`: OK; `mono:packages/db/src/schema.sql`: not null True ≠ False | oui |
| `subscriptions.cancel_at_period_end` | boolean, null, défaut false | `web:supabase/schema.sql`: OK; `mono:packages/db/src/schema.sql`: not null True ≠ False | oui |

### DIFFERENT IN REPO (2)

| Colonne | Production | Dépôts | Site |
|---|---|---|---|
| `user_achievements.user_id` | uuid, NOT NULL, défaut — | `mono:packages/db/src/schema.sql`: not null False ≠ True | non |
| `user_achievements.achievement_id` | uuid, NOT NULL, défaut — | `mono:packages/db/src/schema.sql`: not null False ≠ True | non |

### MISSING IN PRODUCTION

| Colonne | Défini dans | Utilisé par le site | Classement |
|---|---|---|---|
| `profiles.onboarding_step` | `web:supabase-onboarding.sql` | **oui** | APP/SCHEMA DRIFT |
| `subscriptions.platform` | `mono:packages/db/src/schema.sql` | non | déclaration obsolète |
| `subscriptions.reactivation_sent_at` | `web:supabase-reactivation.sql` | **oui** | APP/SCHEMA DRIFT |
| `subscriptions.revenuecat_customer_id` | `mono:packages/db/src/schema.sql` | non | déclaration obsolète |
| `subscriptions.tier` | `mono:packages/db/src/schema.sql` | non | déclaration obsolète |
| `subscriptions.trial_ends_at` | `mono:packages/db/src/schema.sql` | non | déclaration obsolète |
| `transformations.after_path` | `web:supabase-transformations.sql` | **oui** | APP/SCHEMA DRIFT |
| `transformations.before_path` | `web:supabase-transformations.sql` | **oui** | APP/SCHEMA DRIFT |
| `transformations.caption` | `web:supabase-transformations.sql` | **oui** | APP/SCHEMA DRIFT |
| `transformations.consent` | `web:supabase-transformations.sql` | **oui** | APP/SCHEMA DRIFT |
| `transformations.created_at` | `web:supabase-transformations.sql` | **oui** | APP/SCHEMA DRIFT |
| `transformations.display_name` | `web:supabase-transformations.sql` | **oui** | APP/SCHEMA DRIFT |
| `transformations.id` | `web:supabase-transformations.sql` | **oui** | APP/SCHEMA DRIFT |
| `transformations.status` | `web:supabase-transformations.sql` | **oui** | APP/SCHEMA DRIFT |
| `transformations.user_id` | `web:supabase-transformations.sql` | **oui** | APP/SCHEMA DRIFT |
| `transformations.weeks` | `web:supabase-transformations.sql` | **oui** | APP/SCHEMA DRIFT |

## 3. Policies

44 policies de production : IDENTIQUE 39, MISSING IN REPO 5. Aucune définition divergente parmi celles qui ont une source.

### MISSING IN REPO

| Policy | Table | Opération | USING | WITH CHECK | Site |
|---|---|---|---|---|---|
| profiles self select | `public.profiles` | SELECT | `(auth.uid() = id)` | `—` | oui |
| profiles self update | `public.profiles` | UPDATE | `(auth.uid() = id)` | `(auth.uid() = id)` | oui |
| profiles self upsert | `public.profiles` | INSERT | `—` | `(auth.uid() = id)` | oui |
| Session exercises are publicly readable | `public.session_exercises` | SELECT | `true` | `—` | non (mobile) |
| Discipline hero images are publicly accessible | `storage.objects` | SELECT | `(bucket_id = 'discipline-heroes'::text)` | `—` | non (mobile) |

### MISSING IN PRODUCTION (présentes seulement dans les dépôts)

| Policy | Table | Fichier |
|---|---|---|
| Service role access connections | `smartwatch_connections` | `web:supabase/schema.sql` |
| Service role access metrics | `health_metrics` | `web:supabase/schema.sql` |
| Service role access sessions | `smartwatch_sessions` | `web:supabase/schema.sql` |
| Service role access goals | `fitness_goals` | `web:supabase/schema.sql` |
| Users can view own profile | `users` | `mono:packages/db/src/schema.sql` |
| Users can update own profile | `users` | `mono:packages/db/src/schema.sql` |
| Users can view own subscriptions | `subscriptions` | `mono:packages/db/src/schema.sql` |
| Users can manage own metrics | `metrics` | `mono:packages/db/src/schema.sql` |
| Users can manage own sessions | `workout_sessions` | `mono:packages/db/src/schema.sql` |
| Users can view own achievements | `user_achievements` | `mono:packages/db/src/schema.sql` |
| Users can manage own messages | `coach_messages` | `mono:packages/db/src/schema.sql` |
| Users can view own orders | `orders` | `mono:packages/db/src/schema.sql` |

### DUPLICATE POLICY / redondances (production)

| Table | Policy | Constat |
|---|---|---|
| `admin_users` | Service role access admin | REDONDANTE : service_role contourne la RLS sur Supabase |
| `fitness_goals` | Users manage own goals | DOUBLON (effet identique à « own_goals ») |
| `fitness_goals` | own_goals | DOUBLON (effet identique à « Users manage own goals ») |
| `health_metrics` | Users manage own metrics | DOUBLON (effet identique à « own_metrics ») |
| `health_metrics` | own_metrics | DOUBLON (effet identique à « Users manage own metrics ») |
| `profiles` | Service role access profiles | REDONDANTE : service_role contourne la RLS sur Supabase |
| `profiles` | Users update own profile | DOUBLON (effet identique à « profiles self update ») |
| `profiles` | Users view own profile | DOUBLON (effet identique à « profiles self select ») |
| `profiles` | profiles self select | DOUBLON (effet identique à « Users view own profile ») |
| `profiles` | profiles self update | DOUBLON (effet identique à « Users update own profile ») |
| `push_tokens` | Service role access push tokens | REDONDANTE : service_role contourne la RLS sur Supabase |
| `smartwatch_connections` | Users manage own connections | DOUBLON (effet identique à « own_connections ») |
| `smartwatch_connections` | own_connections | DOUBLON (effet identique à « Users manage own connections ») |
| `smartwatch_sessions` | Users manage own sessions | DOUBLON (effet identique à « own_sessions ») |
| `smartwatch_sessions` | own_sessions | DOUBLON (effet identique à « Users manage own sessions ») |
| `subscriptions` | Service role access subscriptions | REDONDANTE : service_role contourne la RLS sur Supabase |
| `user_achievements` | Service role manages user achievements | REDONDANTE : service_role contourne la RLS sur Supabase |

## 4. Fonctions, triggers, index, buckets

| Objet | Production | Dépôts (définition) |
|---|---|---|
| fonction `handle_updated_at` | présente | `web:supabase/schema.sql` IDENTIQUE |
| fonction `handle_new_user` | présente | `web:supabase/schema.sql` IDENTIQUE |
| fonction `coach_consume_quota` | présente | `web:supabase-security-hardening.sql` IDENTIQUE |
| fonction `rls_auto_enable` + event trigger `ensure_rls` | présents | MISSING IN REPO (identique à la doc Supabase) |
| trigger `on_auth_user_created` | présent | `web:supabase/schema.sql` IDENTIQUE |
| trigger `profiles_updated_at` | présent | `web:supabase/schema.sql` IDENTIQUE |
| trigger `subscriptions_updated_at` | présent | `web:supabase/schema.sql` IDENTIQUE |
| trigger `fitness_goals_updated_at` | **absent** | `web:supabase/schema.sql` → MISSING IN PRODUCTION |
| trigger `health_metrics_updated_at` | **absent** | `web:supabase/schema.sql` → MISSING IN PRODUCTION |
| trigger `smartwatch_connections_updated_at` | **absent** | `web:supabase/schema.sql` → MISSING IN PRODUCTION |
| index `exercises_discipline_slug_idx` (mobile) | `CREATE INDEX exercises_discipline_slug_idx ON public.exercises USING btree (discipline_slug, sort_order)` | `mono:packages/db/migrations/2026-07-18-exercises-library.sql` IDENTIQUE |
| index `favorite_exercises_user_id_idx` (mobile) | `CREATE INDEX favorite_exercises_user_id_idx ON public.favorite_exercises USING btree (user_id, created_at DESC)` | `mono:packages/db/migrations/2026-07-19-favorite-exercises.sql` IDENTIQUE |
| index `idx_abandoned_carts_pending` (site) | `CREATE INDEX idx_abandoned_carts_pending ON public.abandoned_carts USING btree (reminder_sent, recovered, updated_at)` | `web:supabase-marketing.sql` IDENTIQUE |
| index `idx_boutique_orders_email` (site) | `CREATE INDEX idx_boutique_orders_email ON public.boutique_orders USING btree (email)` | `web:supabase-orders.sql` IDENTIQUE |
| index `idx_health_metrics_user_date` (site) | `CREATE INDEX idx_health_metrics_user_date ON public.health_metrics USING btree (user_id, date)` | `web:supabase-smartwatch.sql` IDENTIQUE |
| index `idx_reviews_product` (site) | `CREATE INDEX idx_reviews_product ON public.reviews USING btree (product_id) WHERE (type = 'product'::text)` | `web:supabase-reviews.sql` IDENTIQUE |
| index `idx_smartwatch_sessions_user` (site) | `CREATE INDEX idx_smartwatch_sessions_user ON public.smartwatch_sessions USING btree (user_id, started_at DESC)` | `web:supabase-smartwatch.sql` IDENTIQUE |
| index `session_exercises_session_idx` (mobile) | `CREATE INDEX session_exercises_session_idx ON public.session_exercises USING btree (session_id, order_index)` | MISSING IN REPO |
| index `uniq_review_platform` (site) | `CREATE UNIQUE INDEX uniq_review_platform ON public.reviews USING btree (user_id) WHERE (type = 'platform'::text)` | `web:supabase-reviews.sql` IDENTIQUE |
| index `uniq_review_product` (site) | `CREATE UNIQUE INDEX uniq_review_product ON public.reviews USING btree (user_id, product_id) WHERE (type = 'product'::text)` | `web:supabase-reviews.sql` IDENTIQUE |
| index `web_push_subscriptions_user_idx` (site) | `CREATE INDEX web_push_subscriptions_user_idx ON public.web_push_subscriptions USING btree (user_id)` | `web:supabase-web-push.sql` IDENTIQUE |
| index `transformations_status_idx` | **absent** | `web:supabase-transformations.sql` → APP/SCHEMA DRIFT |
| bucket `avatars` | public | migration mobile |
| bucket `discipline-heroes` | public | MISSING IN REPO |
| bucket `exercise-demos` | public | migration mobile |
| bucket `program-covers` | public | migration mobile |
| bucket `transformations` | **absent** | en-tête de `web:supabase-transformations.sql` (création manuelle) → APP/SCHEMA DRIFT |

## 5. Définitions concurrentes par table

| Table | Fichiers définissant la table (`CREATE TABLE`) | Fichier conforme à la production |
|---|---|---|
| `fitness_goals` | `web:supabase-smartwatch.sql`, `web:supabase/schema.sql` | `web:supabase/schema.sql` |
| `health_metrics` | `web:supabase-smartwatch.sql`, `web:supabase/schema.sql` | `web:supabase/schema.sql` |
| `program_sessions` | `mono:packages/db/migrations/2026-07-15-plan8-foundations.sql`, `mono:packages/db/src/schema.sql` | `mono:packages/db/migrations/2026-07-15-plan8-foundations.sql`, `mono:packages/db/src/schema.sql` |
| `programs` | `mono:packages/db/migrations/2026-07-15-plan8-foundations.sql`, `mono:packages/db/src/schema.sql` | `mono:packages/db/migrations/2026-07-15-plan8-foundations.sql`, `mono:packages/db/src/schema.sql` |
| `smartwatch_connections` | `web:supabase-smartwatch.sql`, `web:supabase/schema.sql` | `web:supabase/schema.sql` |
| `smartwatch_sessions` | `web:supabase-smartwatch.sql`, `web:supabase/schema.sql` | `web:supabase/schema.sql` |
| `subscriptions` | `mono:packages/db/src/schema.sql`, `web:supabase/schema.sql` | `web:supabase-ga-conversion.sql`, `web:supabase/schema.sql` |

## 6. Matrice de revue

| Objet | Production | Repository | Website utilisé | Mobile utilisé | Baseline | Décision requise |
|---|---|---|---|---|---|---|
| table `abandoned_carts` (A) | oui | 1 source(s) | oui | non | incluse | — |
| table `achievements` (B) | oui | 1 source(s) | non | oui | exclue | — |
| table `admin_users` (A) | oui | 1 source(s) | oui | oui | incluse | — |
| table `boutique_orders` (A) | oui | 1 source(s) | oui | non | incluse | — |
| table `coach_messages` (D) | oui | 1 source(s) | non | non | exclue | — |
| table `coach_usage` (A) | oui | 1 source(s) | via RPC | non | incluse | — |
| table `content_discipline_i18n` (A) | oui | 1 source(s) | oui | non | incluse | — |
| table `content_disciplines` (A) | oui | 1 source(s) | oui | non | incluse | — |
| table `content_videos` (A) | oui | 1 source(s) | oui | non | incluse | — |
| table `exercises` (B) | oui | 1 source(s) | non | oui | exclue | — |
| table `favorite_exercises` (B) | oui | 1 source(s) | non | oui | exclue | — |
| table `fitness_goals` (A) | oui | 2 source(s) | oui | oui | incluse | CONFLICTING DEFINITION, DUPLICATE POLICY |
| table `health_metrics` (A) | oui | 2 source(s) | oui | oui | incluse | CONFLICTING DEFINITION, DUPLICATE POLICY |
| table `metrics` (D) | oui | 1 source(s) | non | non | exclue | — |
| table `newsletter_subscribers` (A) | oui | 1 source(s) | oui | non | incluse | — |
| table `order_items` (D) | oui | 1 source(s) | non | non | exclue | — |
| table `orders` (D) | oui | 1 source(s) | non | non | exclue | — |
| table `products` (D) | oui | 1 source(s) | non | non | exclue | — |
| table `profiles` (A) | oui | 1 source(s) | oui | oui | incluse | DUPLICATE POLICY |
| table `program_sessions` (B) | oui | 2 source(s) | non | oui | exclue | sources multiples |
| table `programs` (B) | oui | 2 source(s) | non | oui | exclue | sources multiples |
| table `progress` (A) | oui | 1 source(s) | oui | oui | incluse | — |
| table `push_tokens` (A) | oui | 1 source(s) | oui | oui | incluse | — |
| table `reviews` (A) | oui | 1 source(s) | oui | oui | incluse | — |
| table `session_exercises` (B) | oui | **aucune** source(s) | non | oui | exclue | MISSING IN REPO |
| table `smartwatch_connections` (A) | oui | 2 source(s) | oui | oui | incluse | CONFLICTING DEFINITION, DUPLICATE POLICY |
| table `smartwatch_sessions` (A) | oui | 2 source(s) | oui | non | incluse | CONFLICTING DEFINITION, DUPLICATE POLICY |
| table `stripe_events` (A) | oui | 1 source(s) | oui | non | incluse | — |
| table `subscriptions` (A) | oui | 2 source(s) | oui | oui | incluse | CONFLICTING DEFINITION |
| table `transformations` (drift) | **non** | 1 source(s) | oui | non | exclue | MISSING IN PRODUCTION, APP/SCHEMA DRIFT |
| table `user_achievements` (B) | oui | 1 source(s) | non | oui | exclue | — |
| table `user_streaks` (A) | oui | 1 source(s) | oui | oui | incluse | — |
| table `users` (C) | oui | 1 source(s) | non | apps/web monorepo | exclue | — |
| table `web_push_subscriptions` (A) | oui | 1 source(s) | oui | non | incluse | — |
| table `workout_sessions` (D) | oui | 1 source(s) | non | non | exclue | — |
| table `workouts` (A) | oui | 1 source(s) | oui | non | incluse | — |
| colonne `profiles.sex` | oui | **aucune** | non | mention lexicale | incluse | MISSING IN REPO — versionner |
| colonne `profiles.birth_year` | oui | **aucune** | non | mention lexicale | incluse | MISSING IN REPO — versionner |
| colonne `profiles.height_cm` | oui | **aucune** | non | mention lexicale | incluse | MISSING IN REPO — versionner |
| colonne `profiles.weight_kg` | oui | **aucune** | non | mention lexicale | incluse | MISSING IN REPO — versionner |
| colonne `profiles.fitness_level` | oui | **aucune** | non | mention lexicale | incluse | MISSING IN REPO — versionner |
| colonne `profiles.main_goal` | oui | **aucune** | non | mention lexicale | incluse | MISSING IN REPO — versionner |
| colonne `profiles.onboarded` | oui | **aucune** | non | mention lexicale | incluse | MISSING IN REPO — versionner |
| colonne `profiles.onboarded_at` | oui | **aucune** | non | mention lexicale | incluse | MISSING IN REPO — versionner |
| colonne `profiles.onboarding_step` | **non** | `supabase-onboarding.sql` | **oui** | non | exclue | APP/SCHEMA DRIFT |
| colonne `subscriptions.reactivation_sent_at` | **non** | `supabase-reactivation.sql` | **oui** | non | exclue | APP/SCHEMA DRIFT |
| colonnes `subscriptions.platform`, `tier`, `revenuecat_customer_id`, `trial_ends_at` | **non** | `packages/db/src/schema.sql` | non | non | exclues | MISSING IN PRODUCTION — déclaration obsolète |
| policies `profiles self select/update/upsert` | oui | **aucune** | oui (table) | oui (table) | incluses | MISSING IN REPO, DUPLICATE POLICY (select/update) |
| policies `own_*` + `Users manage own *` (4 tables montres/santé) | oui | 2 fichiers | oui | partiel | incluses | DUPLICATE POLICY |
| policies « Service role access » (4 site) | oui | `supabase/schema.sql` | oui | — | incluses | redondantes (BYPASSRLS) — décision |
| 12 policies des dépôts | **non** | schema.sql web / monorepo | — | — | exclues | MISSING IN PRODUCTION |
| fonction `rls_auto_enable` + `ensure_rls` | oui | **aucune** | non | non | non créée (note) | MISSING IN REPO — hors baseline (décision 7) |
| fonction `handle_new_user` | oui | `supabase/schema.sql` | indirect | indirect | incluse | durcissement sécurité (advisor) — décision |
| 3 triggers `*_updated_at` (goals, metrics, connections) | **non** | `supabase/schema.sql` | — | — | exclus | MISSING IN PRODUCTION |
| bucket `discipline-heroes` | oui | **aucune** | non | oui | exclu | MISSING IN REPO (mobile) |
| bucket `transformations` | **non** | en-tête SQL | **oui** | non | exclu | WEBSITE FEATURE DRIFT |
| 5 migrations de production sans fichier | oui | **aucune** | non | oui | — | MISSING IN REPO (mobile) |

## 7. Migration versionnée (05-B.2a-FINAL)

- `supabase/migrations/20260911183926_website_baseline.sql` : garde + corps identique à `supabase/baseline/schema-baseline-candidate.sql`.
- Objets créés : 3 fonctions, 21 tables, 45 PK/UNIQUE/CHECK, 15 FK, 8 index, 21 RLS, 28 policies, 3 triggers, droits tables et fonctions.
- Aucun chevauchement avec une migration existante du dépôt du site (aucune). Historique de production : 14 versions, aucune identique.
- Détail des décisions, du nettoyage de sécurité futur et des tests : `schema-baseline-review.md` §14 à §18.
