-- ──────────────────────────────────────────────────────────────────────
-- Séries hebdomadaires (Streaks) — registre persistant.
-- Ne stocke QUE ce qui n'est pas dérivable de l'activité : objectif, série
-- courante, record, gels, dernière semaine finalisée.
-- À exécuter dans Supabase → SQL Editor.
-- ──────────────────────────────────────────────────────────────────────
create table if not exists public.user_streaks (
  user_id             uuid primary key references public.profiles (id) on delete cascade,
  weekly_goal         smallint not null default 3 check (weekly_goal between 2 and 7),
  current_streak      smallint not null default 0 check (current_streak >= 0),
  longest_streak      smallint not null default 0 check (longest_streak >= 0),
  freezes_available   smallint not null default 0 check (freezes_available between 0 and 2),
  last_finalized_week date,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.user_streaks enable row level security;

-- L'utilisateur lit/écrit uniquement sa propre ligne. Le cron passe par la
-- service-role (bypass RLS).
create policy "own streak select" on public.user_streaks
  for select using (auth.uid() = user_id);
create policy "own streak insert" on public.user_streaks
  for insert with check (auth.uid() = user_id);
create policy "own streak update" on public.user_streaks
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
