-- ════════════════════════════════════════════════════════
-- Xenotif® — Réactivation (win-back) des abonnés résiliés (P5)
-- À exécuter dans Supabase → SQL Editor
-- Ajoute la colonne de déduplication lue par le cron
-- /api/cron/reactivation : on n'envoie l'email de win-back
-- qu'UNE SEULE FOIS par abonnement résilié.
-- ════════════════════════════════════════════════════════

-- Horodatage de l'envoi de l'email de réactivation.
-- NULL = jamais relancé ; le cron ne cible que les lignes status='canceled'
-- dont reactivation_sent_at IS NULL, puis le remplit après envoi.
alter table public.subscriptions
  add column if not exists reactivation_sent_at timestamptz;
