-- ════════════════════════════════════════════════════════
-- Xenotif® — Avis clients (avis produit digital + témoignage plateforme)
-- À exécuter dans Supabase → SQL Editor
-- ════════════════════════════════════════════════════════

create table if not exists public.reviews (
  id           uuid primary key default gen_random_uuid(),
  type         text not null check (type in ('platform','product')),
  product_id   text,                          -- ex. 'd1' ; null pour 'platform'
  user_id      uuid not null,                 -- auth.users.id
  author_name  text not null,
  rating       int  not null check (rating between 1 and 5),
  comment      text not null,
  locale       text not null default 'fr',
  hidden       boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- 1 avis par client et par cible (modifiable) — index partiels (gèrent le null)
create unique index if not exists uniq_review_product
  on public.reviews (user_id, product_id) where type = 'product';
create unique index if not exists uniq_review_platform
  on public.reviews (user_id) where type = 'platform';

-- Lecture rapide par cible
create index if not exists idx_reviews_product on public.reviews (product_id) where type = 'product';

-- RLS : accès uniquement via service_role (les routes API). Aucune policy publique.
alter table public.reviews enable row level security;
