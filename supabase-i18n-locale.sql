-- ════════════════════════════════════════════════════════
-- Xenotif® — Locale destinataire pour les emails (i18n P2)
-- À exécuter dans Supabase → SQL Editor
-- Stocke la langue préférée (fr/en) pour envoyer les emails
-- (motivation quotidienne, relance panier) dans la bonne langue.
-- ════════════════════════════════════════════════════════

-- Langue de l'utilisateur, capturée à l'inscription (checkout abonnement).
-- Lue par le cron de motivation quotidienne.
alter table public.profiles
  add column if not exists locale text not null default 'fr';

-- Langue du visiteur au moment de la sauvegarde du panier.
-- Lue par le cron de relance panier abandonné.
alter table public.abandoned_carts
  add column if not exists locale text not null default 'fr';
