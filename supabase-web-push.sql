-- ──────────────────────────────────────────────────────────────────────
-- Web Push (PWA) — abonnements navigateur/téléphone
-- Un (navigateur × appareil) = une souscription, identifiée par son endpoint.
-- À exécuter dans Supabase → SQL Editor.
-- ──────────────────────────────────────────────────────────────────────
create table if not exists public.web_push_subscriptions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  endpoint    text not null unique,
  p256dh      text not null,
  auth        text not null,
  user_agent  text,
  created_at  timestamptz not null default now()
);

create index if not exists web_push_subscriptions_user_idx
  on public.web_push_subscriptions (user_id);

-- Table protégée : accès uniquement via la service-role (code serveur).
alter table public.web_push_subscriptions enable row level security;
-- (Aucune policy publique : ni lecture ni écriture côté client.)
