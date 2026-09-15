-- Phase 05-K.1 — durcissement des droits : volet à impact fonctionnel démontré nul.
--
-- Deux constats de l'audit 05-K.0 motivent ce fichier, et rien d'autre :
--
--   * `anon` et `authenticated` détiennent TRUNCATE sur les 21 tables du site.
--     TRUNCATE est le seul de leurs droits que RLS ne filtre pas : contrairement
--     à DELETE, aucune policy ne s'y applique. REFERENCES et TRIGGER ne sont,
--     eux, jamais émis par PostgREST ni par aucun des trois dépôts.
--
--   * Sept tables ont RLS actif et aucune policy. Elles sont donc déjà
--     entièrement fermées à `anon` et `authenticated`, et servies uniquement par
--     `service_role` dans le code. Les droits qu'elles portent sont morts : les
--     retirer ne peut rien casser, mais supprime la dépendance à RLS seul.
--
-- Périmètre volontairement étroit. Ne sont touchés ni les policies, ni les
-- colonnes, ni les fonctions, ni les default privileges, ni le schéma, ni les
-- données, ni les droits de `service_role`, ni SELECT/INSERT/UPDATE/DELETE sur
-- les quatorze autres tables. Le reste du plan 05-K.0 attend une phase ultérieure.

begin;

-- 1) Tables à RLS sans aucune policy : révocation intégrale pour les deux rôles
--    exposés. `service_role` conserve ses droits et continue de les servir.
revoke all on table
  public.abandoned_carts,
  public.boutique_orders,
  public.coach_usage,
  public.newsletter_subscribers,
  public.reviews,
  public.stripe_events,
  public.web_push_subscriptions
  from anon, authenticated;

-- 2) Droits jamais émis par l'API, sur les 21 tables du périmètre Website.
--    Sans effet sur les sept tables ci-dessus, déjà vidées : REVOKE est idempotent.
revoke truncate, references, trigger on table
  public.abandoned_carts,
  public.admin_users,
  public.boutique_orders,
  public.coach_usage,
  public.content_discipline_i18n,
  public.content_disciplines,
  public.content_videos,
  public.fitness_goals,
  public.health_metrics,
  public.newsletter_subscribers,
  public.profiles,
  public.progress,
  public.push_tokens,
  public.reviews,
  public.smartwatch_connections,
  public.smartwatch_sessions,
  public.stripe_events,
  public.subscriptions,
  public.user_streaks,
  public.web_push_subscriptions,
  public.workouts
  from anon, authenticated;

-- Trace d'exécution : la migration doit laisser trois compteurs à zéro et le
-- compteur `service_role` à 147 (21 tables x 7 droits).
do $trace$
declare
  v_tables text[] := array[
    'abandoned_carts','admin_users','boutique_orders','coach_usage',
    'content_discipline_i18n','content_disciplines','content_videos',
    'fitness_goals','health_metrics','newsletter_subscribers','profiles',
    'progress','push_tokens','reviews','smartwatch_connections',
    'smartwatch_sessions','stripe_events','subscriptions','user_streaks',
    'web_push_subscriptions','workouts'];
  v_vides text[] := array[
    'abandoned_carts','boutique_orders','coach_usage','newsletter_subscribers',
    'reviews','stripe_events','web_push_subscriptions'];
  v_dangereux int := 0;
  v_mortes int := 0;
  v_service int := 0;
  t text;
  r text;
  p text;
begin
  foreach t in array v_tables loop
    foreach r in array array['anon','authenticated'] loop
      foreach p in array array['TRUNCATE','REFERENCES','TRIGGER'] loop
        if has_table_privilege(r, 'public.' || quote_ident(t), p) then
          v_dangereux := v_dangereux + 1;
        end if;
      end loop;
    end loop;
    foreach p in array array['SELECT','INSERT','UPDATE','DELETE','TRUNCATE','REFERENCES','TRIGGER'] loop
      if has_table_privilege('service_role', 'public.' || quote_ident(t), p) then
        v_service := v_service + 1;
      end if;
    end loop;
  end loop;

  foreach t in array v_vides loop
    foreach r in array array['anon','authenticated'] loop
      foreach p in array array['SELECT','INSERT','UPDATE','DELETE','TRUNCATE','REFERENCES','TRIGGER'] loop
        if has_table_privilege(r, 'public.' || quote_ident(t), p) then
          v_mortes := v_mortes + 1;
        end if;
      end loop;
    end loop;
  end loop;

  raise notice '[k1] TRUNCATE/REFERENCES/TRIGGER restants pour anon+authenticated : % (attendu 0)', v_dangereux;
  raise notice '[k1] droits restants sur les 7 tables sans policy : % (attendu 0)', v_mortes;
  raise notice '[k1] droits service_role sur les 21 tables : % (attendu 147)', v_service;

  if v_dangereux <> 0 or v_mortes <> 0 or v_service <> 147 then
    raise exception '[k1] etat inattendu apres revocation : dangereux=%, mortes=%, service=%',
      v_dangereux, v_mortes, v_service;
  end if;
end
$trace$;

commit;
