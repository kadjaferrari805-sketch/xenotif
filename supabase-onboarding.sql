-- ════════════════════════════════════════════════════════
-- Xenotif® — Onboarding des nouveaux comptes en essai (P5)
-- À exécuter dans Supabase → SQL Editor
-- Suit la dernière étape d'onboarding envoyée par le cron
-- /api/cron/onboarding (séquence J+1 / J+3 / J+6 de l'essai 7 j).
-- 0 = aucune, 1 = J+1 envoyé, 2 = J+3 envoyé, 3 = J+6 envoyé.
-- ════════════════════════════════════════════════════════

alter table public.profiles
  add column if not exists onboarding_step int not null default 0;
