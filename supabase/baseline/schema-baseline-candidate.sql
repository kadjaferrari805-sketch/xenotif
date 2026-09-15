-- ============================================================================
-- XENOTIF WEBSITE — BASELINE DE SCHÉMA (STRUCTURE UNIQUEMENT) — CANDIDATE VALIDÉE 05-B.2a-FINAL
-- Extraite le 2026-09-11 du catalogue de production (pciadjwuxuevkqkdarut), en SELECT uniquement.
-- Copie de référence du corps de supabase/migrations/20260911183926_website_baseline.sql.
-- NE PAS APPLIQUER À LA PRODUCTION. Aucune donnée, aucun utilisateur, aucun secret.
-- Exclu : MOBILE ONLY (achievements, exercises, favorite_exercises, programs, program_sessions,
--   session_exercises, user_achievements, buckets avatars / discipline-heroes / exercise-demos /
--   program-covers, seeds) ; OBSOLETE (coach_messages, metrics, orders, order_items, products,
--   workout_sessions) ; users (incertain) ; dérives : transformations (+ bucket),
--   profiles.onboarding_step, subscriptions.reactivation_sent_at ; colonnes platform, tier,
--   revenuecat_customer_id, trial_ends_at.
-- ============================================================================

-- SECTION 1 — Extensions requises
-- gen_random_uuid() et now() sont natifs (PostgreSQL 13+). Aucune extension supplémentaire requise.

-- SECTION 2 — Fonctions (définitions exactes de production)
-- handle_updated_at() : security_definer=False, config=None, acl production={=X/postgres,postgres=X/postgres,anon=X/postgres,authenticated=X/postgres,service_role=X/postgres}
CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;
grant execute on function public.handle_updated_at() to anon, authenticated, service_role;

-- handle_new_user() : security_definer=True, config=None, acl production={=X/postgres,postgres=X/postgres,anon=X/postgres,authenticated=X/postgres,service_role=X/postgres}
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$function$;
grant execute on function public.handle_new_user() to anon, authenticated, service_role;

-- coach_consume_quota(p_user_id uuid, p_limit integer) : security_definer=False, config=['search_path=public'], acl production={postgres=X/postgres,service_role=X/postgres}
CREATE OR REPLACE FUNCTION public.coach_consume_quota(p_user_id uuid, p_limit integer)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  v_count integer;
begin
  insert into public.coach_usage as u (user_id, day, count)
  values (p_user_id, (now() at time zone 'utc')::date, 1)
  on conflict (user_id, day) do update
    set count = u.count + 1
    where u.count < p_limit
  returning u.count into v_count;

  return v_count is not null;
end;
$function$;
revoke all on function public.coach_consume_quota(uuid, integer) from PUBLIC, anon, authenticated;
grant execute on function public.coach_consume_quota(uuid, integer) to service_role;

-- SECTION 3 — Tables, colonnes, clés primaires, contraintes UNIQUE et CHECK
create table public."abandoned_carts" (
  "email" text not null,
  "items" jsonb not null,
  "reminder_sent" boolean default false not null,
  "recovered" boolean default false not null,
  "reminded_at" timestamp with time zone,
  "updated_at" timestamp with time zone default now() not null,
  "created_at" timestamp with time zone default now() not null,
  "locale" text default 'fr'::text not null,
  constraint "abandoned_carts_pkey" PRIMARY KEY (email)
);

create table public."admin_users" (
  "id" uuid not null,
  "created_at" timestamp with time zone default now() not null,
  constraint "admin_users_pkey" PRIMARY KEY (id)
);

create table public."boutique_orders" (
  "id" uuid default gen_random_uuid() not null,
  "email" text not null,
  "customer_name" text,
  "stripe_session_id" text not null,
  "product_ids" text[] default '{}'::text[] not null,
  "amount_total" integer default 0 not null,
  "created_at" timestamp with time zone default now() not null,
  constraint "boutique_orders_pkey" PRIMARY KEY (id),
  constraint "boutique_orders_stripe_session_id_key" UNIQUE (stripe_session_id)
);

create table public."coach_usage" (
  "user_id" uuid not null,
  "day" date not null,
  "count" integer default 0 not null,
  constraint "coach_usage_pkey" PRIMARY KEY (user_id, day)
);

create table public."content_discipline_i18n" (
  "discipline_slug" text not null,
  "locale" text not null,
  "meta" jsonb not null,
  "sections" jsonb not null,
  constraint "content_discipline_i18n_pkey" PRIMARY KEY (discipline_slug, locale),
  constraint "content_discipline_i18n_locale_check" CHECK (locale = ANY (ARRAY['fr'::text, 'en'::text, 'de'::text]))
);

create table public."content_disciplines" (
  "slug" text not null,
  "sort_order" integer default 0 not null,
  "color" text default 'orange'::text not null,
  "icon" text,
  "min_plan" text default 'pro'::text not null,
  "created_at" timestamp with time zone default now() not null,
  "updated_at" timestamp with time zone default now() not null,
  constraint "content_disciplines_pkey" PRIMARY KEY (slug),
  constraint "content_disciplines_min_plan_check" CHECK (min_plan = ANY (ARRAY['free'::text, 'pro'::text]))
);

create table public."content_videos" (
  "id" uuid default gen_random_uuid() not null,
  "discipline_slug" text not null,
  "idx" integer not null,
  "youtube_ids" text[] not null,
  "min_plan" text default 'pro'::text not null,
  "i18n" jsonb not null,
  constraint "content_videos_pkey" PRIMARY KEY (id),
  constraint "content_videos_discipline_slug_idx_key" UNIQUE (discipline_slug, idx),
  constraint "content_videos_min_plan_check" CHECK (min_plan = ANY (ARRAY['free'::text, 'pro'::text]))
);

create table public."fitness_goals" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "steps_daily" integer default 10000,
  "calories_daily" integer default 500,
  "active_minutes_daily" integer default 30,
  "sleep_minutes_daily" integer default 480,
  "water_ml_daily" integer default 2000,
  "workouts_weekly" integer default 4,
  "created_at" timestamp with time zone default now() not null,
  "updated_at" timestamp with time zone default now() not null,
  constraint "fitness_goals_pkey" PRIMARY KEY (id),
  constraint "fitness_goals_user_id_key" UNIQUE (user_id)
);

create table public."health_metrics" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "date" date not null,
  "steps" integer default 0,
  "calories_burned" integer default 0,
  "heart_rate_avg" integer,
  "heart_rate_max" integer,
  "heart_rate_resting" integer,
  "active_minutes" integer default 0,
  "distance_meters" integer default 0,
  "sleep_minutes" integer default 0,
  "sleep_score" integer,
  "weight_kg" numeric(5,2),
  "hydration_ml" integer default 0,
  "source" text,
  "created_at" timestamp with time zone default now() not null,
  "updated_at" timestamp with time zone default now() not null,
  constraint "health_metrics_pkey" PRIMARY KEY (id),
  constraint "health_metrics_user_id_date_source_key" UNIQUE (user_id, date, source)
);

create table public."newsletter_subscribers" (
  "email" text not null,
  "source" text default 'newsletter'::text,
  "subscribed_at" timestamp with time zone default now() not null,
  "locale" text default 'fr'::text not null,
  constraint "newsletter_subscribers_pkey" PRIMARY KEY (email)
);

create table public."profiles" (
  "id" uuid not null,
  "full_name" text,
  "avatar_url" text,
  "created_at" timestamp with time zone default now() not null,
  "updated_at" timestamp with time zone default now() not null,
  "locale" text default 'fr'::text not null,
  "sex" text,
  "birth_year" integer,
  "height_cm" integer,
  "weight_kg" numeric(5,1),
  "fitness_level" text,
  "main_goal" text,
  "onboarded" boolean default false not null,
  "onboarded_at" timestamp with time zone,
  "xp_points" integer default 0 not null,
  "level" integer default 1 not null,
  constraint "profiles_pkey" PRIMARY KEY (id)
);

create table public."progress" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "discipline" text not null,
  "week" integer not null,
  "session_name" text not null,
  "completed" boolean default false,
  "completed_at" timestamp with time zone,
  "created_at" timestamp with time zone default now() not null,
  "program_slug" text default ''::text not null,
  constraint "progress_pkey" PRIMARY KEY (id),
  constraint "progress_user_id_discipline_program_week_session_key" UNIQUE (user_id, discipline, program_slug, week, session_name)
);

create table public."push_tokens" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "token" text not null,
  "platform" text not null,
  "created_at" timestamp with time zone default now() not null,
  constraint "push_tokens_pkey" PRIMARY KEY (id),
  constraint "push_tokens_token_key" UNIQUE (token),
  constraint "push_tokens_platform_check" CHECK (platform = ANY (ARRAY['ios'::text, 'android'::text]))
);

create table public."reviews" (
  "id" uuid default gen_random_uuid() not null,
  "type" text not null,
  "product_id" text,
  "user_id" uuid not null,
  "author_name" text not null,
  "rating" integer not null,
  "comment" text not null,
  "locale" text default 'fr'::text not null,
  "hidden" boolean default false not null,
  "created_at" timestamp with time zone default now() not null,
  "updated_at" timestamp with time zone default now() not null,
  constraint "reviews_pkey" PRIMARY KEY (id),
  constraint "reviews_rating_check" CHECK (rating >= 1 AND rating <= 5),
  constraint "reviews_type_check" CHECK (type = ANY (ARRAY['platform'::text, 'product'::text]))
);

create table public."smartwatch_connections" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "provider" text not null,
  "provider_user_id" text,
  "access_token" text,
  "refresh_token" text,
  "token_expires_at" timestamp with time zone,
  "device_name" text,
  "device_model" text,
  "is_active" boolean default true,
  "last_sync_at" timestamp with time zone,
  "created_at" timestamp with time zone default now() not null,
  "updated_at" timestamp with time zone default now() not null,
  constraint "smartwatch_connections_pkey" PRIMARY KEY (id),
  constraint "smartwatch_connections_user_id_provider_key" UNIQUE (user_id, provider)
);

create table public."smartwatch_sessions" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "provider" text not null,
  "provider_session_id" text,
  "activity_type" text not null,
  "started_at" timestamp with time zone not null,
  "ended_at" timestamp with time zone not null,
  "duration_seconds" integer not null,
  "calories_burned" integer default 0,
  "distance_meters" integer default 0,
  "avg_heart_rate" integer,
  "max_heart_rate" integer,
  "avg_pace_per_km" integer,
  "elevation_gain_meters" integer default 0,
  "steps" integer default 0,
  "source" text,
  "raw_data" jsonb,
  "created_at" timestamp with time zone default now() not null,
  constraint "smartwatch_sessions_pkey" PRIMARY KEY (id),
  constraint "smartwatch_sessions_user_id_provider_session_id_key" UNIQUE (user_id, provider_session_id)
);

create table public."stripe_events" (
  "id" text not null,
  "type" text not null,
  "processed_at" timestamp with time zone default now() not null,
  constraint "stripe_events_pkey" PRIMARY KEY (id)
);

create table public."subscriptions" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "stripe_customer_id" text,
  "stripe_subscription_id" text,
  "plan" text not null,
  "status" text default 'trialing'::text not null,
  "trial_end" timestamp with time zone,
  "current_period_end" timestamp with time zone,
  "cancel_at_period_end" boolean default false,
  "created_at" timestamp with time zone default now() not null,
  "updated_at" timestamp with time zone default now() not null,
  "ga_purchase_sent" boolean default false not null,
  constraint "subscriptions_pkey" PRIMARY KEY (id),
  constraint "subscriptions_stripe_customer_id_key" UNIQUE (stripe_customer_id),
  constraint "subscriptions_stripe_subscription_id_key" UNIQUE (stripe_subscription_id),
  constraint "subscriptions_user_id_unique" UNIQUE (user_id),
  constraint "subscriptions_plan_check" CHECK (plan = ANY (ARRAY['pro'::text, 'elite'::text])),
  constraint "subscriptions_status_check" CHECK (status = ANY (ARRAY['trialing'::text, 'active'::text, 'canceled'::text, 'past_due'::text, 'incomplete'::text]))
);

create table public."user_streaks" (
  "user_id" uuid not null,
  "weekly_goal" smallint default 3 not null,
  "current_streak" smallint default 0 not null,
  "longest_streak" smallint default 0 not null,
  "freezes_available" smallint default 0 not null,
  "last_finalized_week" date,
  "created_at" timestamp with time zone default now() not null,
  "updated_at" timestamp with time zone default now() not null,
  constraint "user_streaks_pkey" PRIMARY KEY (user_id),
  constraint "user_streaks_current_streak_check" CHECK (current_streak >= 0),
  constraint "user_streaks_freezes_available_check" CHECK (freezes_available >= 0 AND freezes_available <= 2),
  constraint "user_streaks_longest_streak_check" CHECK (longest_streak >= 0),
  constraint "user_streaks_weekly_goal_check" CHECK (weekly_goal >= 2 AND weekly_goal <= 7)
);

create table public."web_push_subscriptions" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "endpoint" text not null,
  "p256dh" text not null,
  "auth" text not null,
  "user_agent" text,
  "created_at" timestamp with time zone default now() not null,
  constraint "web_push_subscriptions_pkey" PRIMARY KEY (id),
  constraint "web_push_subscriptions_endpoint_key" UNIQUE (endpoint)
);

create table public."workouts" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "discipline" text not null,
  "duration_minutes" integer default 0,
  "notes" text,
  "completed_at" timestamp with time zone default now() not null,
  constraint "workouts_pkey" PRIMARY KEY (id)
);

-- SECTION 4 — Clés étrangères (ajoutées après toutes les tables)
alter table public."admin_users" add constraint "admin_users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
alter table public."coach_usage" add constraint "coach_usage_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
alter table public."content_discipline_i18n" add constraint "content_discipline_i18n_discipline_slug_fkey" FOREIGN KEY (discipline_slug) REFERENCES public.content_disciplines(slug) ON DELETE CASCADE;
alter table public."content_videos" add constraint "content_videos_discipline_slug_fkey" FOREIGN KEY (discipline_slug) REFERENCES public.content_disciplines(slug) ON DELETE CASCADE;
alter table public."fitness_goals" add constraint "fitness_goals_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
alter table public."health_metrics" add constraint "health_metrics_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
alter table public."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
alter table public."progress" add constraint "progress_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
alter table public."push_tokens" add constraint "push_tokens_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
alter table public."smartwatch_connections" add constraint "smartwatch_connections_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
alter table public."smartwatch_sessions" add constraint "smartwatch_sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
alter table public."subscriptions" add constraint "subscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
alter table public."user_streaks" add constraint "user_streaks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
alter table public."web_push_subscriptions" add constraint "web_push_subscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
alter table public."workouts" add constraint "workouts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- SECTION 5 — Index hors contraintes
CREATE INDEX idx_abandoned_carts_pending ON public.abandoned_carts USING btree (reminder_sent, recovered, updated_at);
CREATE INDEX idx_boutique_orders_email ON public.boutique_orders USING btree (email);
CREATE INDEX idx_health_metrics_user_date ON public.health_metrics USING btree (user_id, date);
CREATE INDEX idx_reviews_product ON public.reviews USING btree (product_id) WHERE (type = 'product'::text);
CREATE UNIQUE INDEX uniq_review_platform ON public.reviews USING btree (user_id) WHERE (type = 'platform'::text);
CREATE UNIQUE INDEX uniq_review_product ON public.reviews USING btree (user_id, product_id) WHERE (type = 'product'::text);
CREATE INDEX idx_smartwatch_sessions_user ON public.smartwatch_sessions USING btree (user_id, started_at DESC);
CREATE INDEX web_push_subscriptions_user_idx ON public.web_push_subscriptions USING btree (user_id);

-- SECTION 6 — Row Level Security (activée explicitement sur les 21 tables)
alter table public."abandoned_carts" enable row level security;
alter table public."admin_users" enable row level security;
alter table public."boutique_orders" enable row level security;
alter table public."coach_usage" enable row level security;
alter table public."content_discipline_i18n" enable row level security;
alter table public."content_disciplines" enable row level security;
alter table public."content_videos" enable row level security;
alter table public."fitness_goals" enable row level security;
alter table public."health_metrics" enable row level security;
alter table public."newsletter_subscribers" enable row level security;
alter table public."profiles" enable row level security;
alter table public."progress" enable row level security;
alter table public."push_tokens" enable row level security;
alter table public."reviews" enable row level security;
alter table public."smartwatch_connections" enable row level security;
alter table public."smartwatch_sessions" enable row level security;
alter table public."stripe_events" enable row level security;
alter table public."subscriptions" enable row level security;
alter table public."user_streaks" enable row level security;
alter table public."web_push_subscriptions" enable row level security;
alter table public."workouts" enable row level security;

-- SECTION 7 — Policies (28, définitions exactes de production, doublons et redondances compris)
-- Doublons et policies « Service role access » : voir SECURITY CLEANUP — FUTURE PHASE (review.md).
create policy "Admins view admin table" on public."admin_users" as permissive for select to public using ((auth.uid() = id));
create policy "Service role access admin" on public."admin_users" as permissive for all to public using ((auth.role() = 'service_role'::text));
create policy "content_discipline_i18n read" on public."content_discipline_i18n" as permissive for select to public using (true);
create policy "content_disciplines read" on public."content_disciplines" as permissive for select to public using (true);
create policy "content_videos read" on public."content_videos" as permissive for select to public using (true);
create policy "Users manage own goals" on public."fitness_goals" as permissive for all to public using ((auth.uid() = user_id));
create policy "own_goals" on public."fitness_goals" as permissive for all to public using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));
create policy "Users manage own metrics" on public."health_metrics" as permissive for all to public using ((auth.uid() = user_id));
create policy "own_metrics" on public."health_metrics" as permissive for all to public using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));
create policy "Service role access profiles" on public."profiles" as permissive for all to public using ((auth.role() = 'service_role'::text));
create policy "Users update own profile" on public."profiles" as permissive for update to public using ((auth.uid() = id));
create policy "Users view own profile" on public."profiles" as permissive for select to public using ((auth.uid() = id));
create policy "profiles self select" on public."profiles" as permissive for select to public using ((auth.uid() = id));
create policy "profiles self update" on public."profiles" as permissive for update to public using ((auth.uid() = id)) with check ((auth.uid() = id));
create policy "profiles self upsert" on public."profiles" as permissive for insert to public with check ((auth.uid() = id));
create policy "Users manage own progress" on public."progress" as permissive for all to public using ((auth.uid() = user_id));
create policy "Service role access push tokens" on public."push_tokens" as permissive for all to public using ((auth.role() = 'service_role'::text));
create policy "Users manage own push tokens" on public."push_tokens" as permissive for all to public using ((auth.uid() = user_id));
create policy "Users manage own connections" on public."smartwatch_connections" as permissive for all to public using ((auth.uid() = user_id));
create policy "own_connections" on public."smartwatch_connections" as permissive for all to public using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));
create policy "Users manage own sessions" on public."smartwatch_sessions" as permissive for all to public using ((auth.uid() = user_id));
create policy "own_sessions" on public."smartwatch_sessions" as permissive for all to public using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));
create policy "Service role access subscriptions" on public."subscriptions" as permissive for all to public using ((auth.role() = 'service_role'::text));
create policy "Users view own subscription" on public."subscriptions" as permissive for select to public using ((auth.uid() = user_id));
create policy "own streak insert" on public."user_streaks" as permissive for insert to public with check ((auth.uid() = user_id));
create policy "own streak select" on public."user_streaks" as permissive for select to public using ((auth.uid() = user_id));
create policy "own streak update" on public."user_streaks" as permissive for update to public using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));
create policy "Users manage own workouts" on public."workouts" as permissive for all to public using ((auth.uid() = user_id));

-- SECTION 8 — Triggers
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- SECTION 9 — Droits sur les tables (identiques à la production)
grant all on table public."abandoned_carts" to anon, authenticated, service_role;
grant all on table public."admin_users" to anon, authenticated, service_role;
grant all on table public."boutique_orders" to anon, authenticated, service_role;
grant all on table public."coach_usage" to anon, authenticated, service_role;
grant all on table public."content_discipline_i18n" to anon, authenticated, service_role;
grant all on table public."content_disciplines" to anon, authenticated, service_role;
grant all on table public."content_videos" to anon, authenticated, service_role;
grant all on table public."fitness_goals" to anon, authenticated, service_role;
grant all on table public."health_metrics" to anon, authenticated, service_role;
grant all on table public."newsletter_subscribers" to anon, authenticated, service_role;
grant all on table public."profiles" to anon, authenticated, service_role;
grant all on table public."progress" to anon, authenticated, service_role;
grant all on table public."push_tokens" to anon, authenticated, service_role;
grant all on table public."reviews" to anon, authenticated, service_role;
grant all on table public."smartwatch_connections" to anon, authenticated, service_role;
grant all on table public."smartwatch_sessions" to anon, authenticated, service_role;
grant all on table public."stripe_events" to anon, authenticated, service_role;
grant all on table public."subscriptions" to anon, authenticated, service_role;
grant all on table public."user_streaks" to anon, authenticated, service_role;
grant all on table public."web_push_subscriptions" to anon, authenticated, service_role;
grant all on table public."workouts" to anon, authenticated, service_role;

-- NOTE — rls_auto_enable() et l'event trigger ensure_rls existent en production (extrait de la
-- documentation Supabase). Ils ne sont PAS une dépendance du site (RLS activée explicitement en
-- SECTION 6) et ne sont PAS créés par cette baseline.

-- FIN — Aucun INSERT. Aucun bucket Storage. Aucun objet MOBILE ONLY, OBSOLETE ni dérive app/schéma.
