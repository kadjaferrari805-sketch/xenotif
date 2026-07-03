-- ──────────────────────────────────────────────────────────────────────
-- Suivi de conversion serveur (GA4 Measurement Protocol).
-- Flag pour n'envoyer la conversion « purchase » qu'UNE fois par abonnement
-- (le 1er vrai paiement = acquisition), pas à chaque renouvellement.
-- À exécuter dans Supabase → SQL Editor.
-- ──────────────────────────────────────────────────────────────────────
alter table public.subscriptions
  add column if not exists ga_purchase_sent boolean not null default false;
