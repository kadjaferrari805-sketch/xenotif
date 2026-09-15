-- ============================================================================
-- Migration 20260915075212_website_schema_repair — Xenotif website
--
-- Répare deux objets utilisés par le code du site mais absents de Production
-- ET de Preview (audit 05-D). Cause racine : `supabase/migrations/` n'existait
-- pas ; les scripts `supabase-*.sql` de la racine devaient être exécutés à la
-- main dans l'éditeur SQL Supabase, et ces deux-là ne l'ont jamais été.
--
-- Preuve d'impact (05-D) : le cron /api/cron/onboarding échouait tous les jours
-- à 09:30 en Production avec `42703 column profiles.onboarding_step does not
-- exist`, et n'envoyait donc AUCUN e-mail d'onboarding.
--
-- Sources reprises à l'identique, sans rien inventer :
--   supabase-onboarding.sql   → profiles.onboarding_step
--   supabase-reactivation.sql → subscriptions.reactivation_sent_at
--
-- Hors périmètre, volontairement : la table `transformations` et son bucket
-- Storage restent DIFFÉRÉS (décision produit, audit 05-E).
--
-- Structure uniquement, à une exception près et une seule : les abonnements
-- déjà résiliés au moment de l'application sont marqués comme « déjà relancés »
-- (voir section 3). Aucune autre donnée métier n'est touchée.
-- ============================================================================

begin;

-- ---------------------------------------------------------------- SECTION 1
-- profiles.onboarding_step — dernière étape d'onboarding envoyée.
-- 0 = aucune, 1 = J+1, 2 = J+3, 3 = J+6. Source : supabase-onboarding.sql.
--
-- Aucun envoi rétroactif à craindre : `nextOnboardingStep` (src/lib/onboarding.ts)
-- borne ses fenêtres des deux côtés (1≤age<3, 3≤age<6, 6≤age<8). Un compte de
-- 8 jours ou plus ne déclenche rien, quelle que soit la valeur de cette colonne.
-- Vérifié en base le 2026-09-15 : 0 compte de Production dans la fenêtre 1–6 j.
alter table public.profiles
  add column if not exists onboarding_step int not null default 0;

-- ---------------------------------------------------------------- SECTION 2
-- subscriptions.reactivation_sent_at — horodatage de l'e-mail de win-back.
-- NULL = jamais relancé. Source : supabase-reactivation.sql.
alter table public.subscriptions
  add column if not exists reactivation_sent_at timestamptz;

-- ---------------------------------------------------------------- SECTION 3
-- Neutralisation des résiliations ANTÉRIEURES à cette migration.
--
-- Pourquoi : /api/cron/reactivation sélectionne `status = 'canceled'` AND
-- `reactivation_sent_at IS NULL`, SANS AUCUNE BORNE TEMPORELLE. Sans ce
-- marquage, son premier passage (mardi 10:00) relancerait des abonnés résiliés
-- depuis 74 à 96 jours — 3 e-mails et 3 notifications push rétroactifs.
-- Décision produit (05-E, option B) : les neutraliser.
--
-- Le filtre est exactement celui du cron : on ne marque que l'ensemble
-- réellement éligible, jamais toutes les lignes. Idempotent — un second passage
-- ne trouve plus de ligne à `reactivation_sent_at IS NULL`.
--
-- Dans la même transaction que la création de la colonne : aucun cron ne peut
-- s'intercaler entre les deux.
update public.subscriptions
   set reactivation_sent_at = now()
 where status = 'canceled'
   and reactivation_sent_at is null;

-- Trace du nombre de lignes marquées, visible dans la sortie d'application.
do $trace$
declare
  v_marquees integer;
begin
  select count(*) into v_marquees
    from public.subscriptions
   where status = 'canceled'
     and reactivation_sent_at is not null;
  raise notice 'website_schema_repair : % abonnement(s) résilié(s) marqué(s) comme déjà relancé(s).', v_marquees;
end
$trace$;

commit;

-- FIN — Aucun DROP, TRUNCATE, DELETE ni INSERT. Aucun changement de grants,
-- de policies ni de RLS. Aucune autre table modifiée.
