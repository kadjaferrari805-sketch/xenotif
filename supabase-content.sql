-- ──────────────────────────────────────────────────────────────────────
-- B2 — Bibliothèque de contenu (disciplines). À exécuter dans Supabase → SQL Editor.
-- Schéma hybride : structure+gating relationnels, contenu riche en jsonb.
-- ──────────────────────────────────────────────────────────────────────
create table if not exists public.content_disciplines (
  slug        text primary key,
  sort_order  int  not null default 0,
  color       text not null default 'orange',
  icon        text,
  min_plan    text not null default 'pro' check (min_plan in ('free','pro')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.content_discipline_i18n (
  discipline_slug text not null references public.content_disciplines(slug) on delete cascade,
  locale          text not null check (locale in ('fr','en','de')),
  meta            jsonb not null,
  sections        jsonb not null,
  primary key (discipline_slug, locale)
);

create table if not exists public.content_videos (
  id              uuid primary key default gen_random_uuid(),
  discipline_slug text not null references public.content_disciplines(slug) on delete cascade,
  idx             int  not null,
  youtube_ids     text[] not null,
  min_plan        text not null default 'pro' check (min_plan in ('free','pro')),
  i18n            jsonb not null,
  unique (discipline_slug, idx)
);

-- RLS : lecture publique (contenu rendu dans le HTML public pour le SEO) ; écritures service-role only.
alter table public.content_disciplines      enable row level security;
alter table public.content_discipline_i18n  enable row level security;
alter table public.content_videos           enable row level security;
create policy "content_disciplines read"     on public.content_disciplines     for select using (true);
create policy "content_discipline_i18n read" on public.content_discipline_i18n for select using (true);
create policy "content_videos read"          on public.content_videos          for select using (true);

-- ── SEED (généré par scripts/gen-content-seed.ts — Task 3) ──────────────
