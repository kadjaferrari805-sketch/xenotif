-- ════════════════════════════════════════════════════════
-- Xenotif® — FIX : contrainte UNIQUE sur subscriptions.user_id
-- À exécuter dans Supabase → SQL Editor.
--
-- Pourquoi : tout le code enregistre l'abonnement via
--   upsert(..., { onConflict: 'user_id' })
-- ce qui ÉCHOUE tant que `user_id` n'a pas de contrainte UNIQUE
-- (« no unique or exclusion constraint matching the ON CONFLICT
-- specification »). Conséquence : aucun abonnement n'était enregistré
-- → invisible dans l'espace, résiliation/portail en échec.
-- ════════════════════════════════════════════════════════

-- 1) Sécurité : supprime d'éventuels doublons (garde la ligne la plus récente)
delete from public.subscriptions a
using public.subscriptions b
where a.user_id = b.user_id
  and a.created_at < b.created_at;

-- 2) Ajoute la contrainte UNIQUE si elle n'existe pas déjà (idempotent)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'subscriptions_user_id_unique'
  ) then
    alter table public.subscriptions
      add constraint subscriptions_user_id_unique unique (user_id);
  end if;
end $$;
