-- ============================================================
-- XENOTIF® — Transformations avant/après (preuves sociales)
-- À EXÉCUTER dans Supabase → SQL Editor.
-- + Créer un bucket Storage PUBLIC nommé "transformations"
--   (Dashboard → Storage → New bucket → cocher "Public bucket").
-- ============================================================
create table if not exists public.transformations (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null,
  display_name text,
  before_path  text not null,
  after_path   text not null,
  caption      text,
  weeks        int,
  consent      boolean not null default false,
  status       text not null default 'pending',   -- pending | approved | rejected
  created_at   timestamptz default now()
);
create index if not exists transformations_status_idx
  on public.transformations (status, created_at desc);

-- RLS : aucune policy publique → accès uniquement via service_role (routes API).
alter table public.transformations enable row level security;
