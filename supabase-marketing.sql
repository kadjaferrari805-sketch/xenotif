-- ════════════════════════════════════════════════════════
-- Xenotif® — Tables marketing (newsletter + panier abandonné)
-- À exécuter dans Supabase → SQL Editor
-- ════════════════════════════════════════════════════════

-- Abonnés newsletter
create table if not exists public.newsletter_subscribers (
  email         text primary key,
  source        text default 'newsletter',
  subscribed_at timestamptz not null default now()
);

-- Paniers abandonnés (relance automatique)
create table if not exists public.abandoned_carts (
  email         text primary key,
  items         jsonb not null,
  reminder_sent boolean not null default false,
  recovered     boolean not null default false,
  reminded_at   timestamptz,
  updated_at    timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

-- Index pour le cron (paniers à relancer)
create index if not exists idx_abandoned_carts_pending
  on public.abandoned_carts (reminder_sent, recovered, updated_at);

-- RLS : ces tables ne sont accessibles que via la service_role key (API serveur).
-- Pas de policy publique = aucun accès anon/authenticated → sécurisé par défaut.
alter table public.newsletter_subscribers enable row level security;
alter table public.abandoned_carts        enable row level security;
