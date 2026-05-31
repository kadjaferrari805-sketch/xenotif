-- ════════════════════════════════════════════════════════
-- Xenotif® — Commandes boutique (livraison guides digitaux)
-- À exécuter dans Supabase → SQL Editor
-- (table dédiée boutique_orders pour ne pas entrer en conflit
--  avec une éventuelle table « orders » existante)
-- ════════════════════════════════════════════════════════

-- Commandes (chaque achat de programme/guide digital)
create table if not exists public.boutique_orders (
  id                 uuid primary key default gen_random_uuid(),
  email              text not null,
  customer_name      text,
  stripe_session_id  text not null unique,   -- idempotence : 1 commande par session
  product_ids        text[] not null default '{}',
  amount_total       integer not null default 0,  -- en centimes
  created_at         timestamptz not null default now()
);

-- Recherche par email (historique client / back-office)
create index if not exists idx_boutique_orders_email on public.boutique_orders (email);

-- RLS : table accessible uniquement via la service_role key (webhook serveur).
-- Pas de policy publique = aucun accès anon/authenticated → sécurisé par défaut.
alter table public.boutique_orders enable row level security;
