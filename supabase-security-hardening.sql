-- ════════════════════════════════════════════════════════
-- Xenotif® — Durcissement sécurité & facturation (Phase 02)
-- À exécuter dans Supabase → SQL Editor AVANT de déployer le code
-- de la branche security-billing-hardening.
-- Idempotent : peut être rejoué sans effet.
-- ════════════════════════════════════════════════════════

-- 1) Quota quotidien du coach IA ──────────────────────────
-- Un compteur par membre et par jour (UTC). Sans cette table, /api/coach
-- répond 503 : le quota est fermé par défaut.
create table if not exists public.coach_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  count integer not null default 0,
  primary key (user_id, day)
);

alter table public.coach_usage enable row level security;
-- Aucune policy : seul le service_role (serveur) lit et écrit.

-- Consomme une unité si le plafond n'est pas atteint. Atomique : deux requêtes
-- simultanées ne peuvent pas dépasser la limite.
create or replace function public.coach_consume_quota(p_user_id uuid, p_limit integer)
returns boolean
language plpgsql
set search_path = public
as $$
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
$$;

-- Les fonctions de `public` sont exposées par l'API : on réserve celle-ci au serveur.
revoke all on function public.coach_consume_quota(uuid, integer) from public, anon, authenticated;
grant execute on function public.coach_consume_quota(uuid, integer) to service_role;

-- 2) Journal des événements Stripe traités ────────────────
-- Le webhook ignore un événement déjà traité (Stripe relance après une erreur 500).
-- Sans cette table, le webhook fonctionne, mais sans déduplication.
create table if not exists public.stripe_events (
  id text primary key,
  type text not null,
  processed_at timestamptz not null default now()
);

alter table public.stripe_events enable row level security;
-- Aucune policy : seul le service_role (serveur) lit et écrit.
