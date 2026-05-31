-- ════════════════════════════════════════════════════════
-- Xenotif® — Montres connectées (santé / activité)
-- À exécuter dans Supabase → SQL Editor
-- (sans ces tables, la page Montre Connectée fonctionne en
--  mode démo ; avec, les connexions/synchros sont persistées)
-- ════════════════════════════════════════════════════════

-- Appareils connectés (+ tokens OAuth pour les vrais fournisseurs ex. Fitbit)
create table if not exists public.smartwatch_connections (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  provider         text not null,
  device_name      text,
  device_model     text,
  is_active        boolean not null default true,
  last_sync_at     timestamptz,
  access_token     text,
  refresh_token    text,
  token_expires_at timestamptz,
  provider_user_id text,
  created_at       timestamptz not null default now(),
  unique (user_id, provider)
);
-- Si la table existait déjà sans les colonnes tokens :
alter table public.smartwatch_connections add column if not exists access_token text;
alter table public.smartwatch_connections add column if not exists refresh_token text;
alter table public.smartwatch_connections add column if not exists token_expires_at timestamptz;
alter table public.smartwatch_connections add column if not exists provider_user_id text;

-- Métriques santé quotidiennes
create table if not exists public.health_metrics (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  date               date not null,
  steps              integer not null default 0,
  calories_burned    integer not null default 0,
  heart_rate_avg     integer,
  heart_rate_max     integer,
  heart_rate_resting integer,
  active_minutes     integer not null default 0,
  distance_meters    integer not null default 0,
  sleep_minutes      integer not null default 0,
  sleep_score        integer,
  weight_kg          numeric,
  hydration_ml       integer not null default 0,
  source             text not null default 'manual',
  created_at         timestamptz not null default now(),
  unique (user_id, date, source)
);
create index if not exists idx_health_metrics_user_date on public.health_metrics (user_id, date);

-- Séances enregistrées par la montre
create table if not exists public.smartwatch_sessions (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  activity_type         text not null,
  started_at            timestamptz not null,
  ended_at              timestamptz,
  duration_seconds      integer not null default 0,
  calories_burned       integer not null default 0,
  distance_meters       integer not null default 0,
  avg_heart_rate        integer,
  max_heart_rate        integer,
  avg_pace_per_km       numeric,
  elevation_gain_meters integer not null default 0,
  steps                 integer not null default 0,
  source                text not null default 'manual',
  created_at            timestamptz not null default now()
);
create index if not exists idx_smartwatch_sessions_user on public.smartwatch_sessions (user_id, started_at desc);

-- Objectifs fitness (1 par utilisateur)
create table if not exists public.fitness_goals (
  user_id              uuid primary key references auth.users(id) on delete cascade,
  steps_daily          integer not null default 10000,
  calories_daily       integer not null default 500,
  active_minutes_daily integer not null default 30,
  sleep_minutes_daily  integer not null default 480,
  water_ml_daily       integer not null default 2000,
  workouts_weekly      integer not null default 4,
  created_at           timestamptz not null default now()
);

-- ── RLS : chaque utilisateur n'accède qu'à SES données ──────────────
alter table public.smartwatch_connections enable row level security;
alter table public.health_metrics          enable row level security;
alter table public.smartwatch_sessions     enable row level security;
alter table public.fitness_goals           enable row level security;

create policy "own_connections" on public.smartwatch_connections
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own_metrics" on public.health_metrics
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own_sessions" on public.smartwatch_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own_goals" on public.fitness_goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
