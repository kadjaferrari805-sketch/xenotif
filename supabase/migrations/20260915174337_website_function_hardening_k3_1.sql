-- Phase 05-K.3.1 — durcissement des fonctions du site.
--
-- Périmètre strict : trois fonctions, rien d'autre. Ni policy, ni grant de
-- table, ni default privilege, ni colonne, ni donnée. `coach_consume_quota`
-- est déjà conforme (INVOKER, search_path=public, EXECUTE réservé à
-- service_role) et n'est volontairement pas touchée.
--
-- Ce que l'audit 05-K.3 a établi, mesure à l'appui :
--
--   * `handle_new_user` est SECURITY DEFINER, appartient à `postgres`, et n'a
--     aucun `search_path` fixé. Son EXECUTE est ouvert à PUBLIC, `anon` et
--     `authenticated`. L'appel direct échoue (0A000 : une fonction trigger ne
--     s'appelle pas hors trigger) et le corps qualifie explicitement
--     `public.profiles` : aucun chemin d'exploitation n'a été démontré. Le
--     privilège reste néanmoins accordé sans raison.
--
--   * `handle_updated_at` est SECURITY INVOKER : aucune escalade possible par
--     construction. Le durcissement y est de l'hygiène.
--
--   * `rls_auto_enable` n'existe qu'en Production. Contrairement aux deux
--     autres, son corps s'exécute RÉELLEMENT sous `anon` comme sous
--     `authenticated` (constaté : aucune erreur levée). L'effet est nul — la
--     boucle n'itère sur aucune commande hors contexte event-trigger, et sa
--     seule action possible serait d'ACTIVER RLS — mais le privilège n'a pas
--     lieu d'être. Le bloc est gardé par `if exists` pour rester applicable
--     aux deux environnements.
--
-- POINT DE VIGILANCE : `supabase_auth_admin` tient son EXECUTE de PUBLIC, que
-- cette migration révoque. PostgreSQL vérifie le privilège EXECUTE d'une
-- fonction trigger à la CRÉATION du trigger, pas à chaque déclenchement : le
-- signup doit donc continuer de fonctionner. Cette propriété est vérifiée en
-- Preview par un test de création de compte, avant toute application ailleurs.

begin;

-- 1) handle_new_user — SECURITY DEFINER, appelée par le trigger
--    auth.users.on_auth_user_created.
alter function public.handle_new_user()
  set search_path = public, pg_temp;

revoke all on function public.handle_new_user()
  from public, anon, authenticated;

-- 2) handle_updated_at — SECURITY INVOKER, appelée par les triggers
--    profiles_updated_at et subscriptions_updated_at.
alter function public.handle_updated_at()
  set search_path = public, pg_temp;

revoke all on function public.handle_updated_at()
  from public, anon, authenticated;

-- 3) rls_auto_enable — Production uniquement. Sans effet en Preview.
do $k31_rls$
begin
  if exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'rls_auto_enable'
  ) then
    execute 'alter function public.rls_auto_enable() set search_path = pg_catalog';
    execute 'revoke all on function public.rls_auto_enable() from public, anon, authenticated';
    raise notice '[k3.1] rls_auto_enable durcie';
  else
    raise notice '[k3.1] rls_auto_enable absente de cet environnement — aucune action';
  end if;
end
$k31_rls$;

-- Post-condition : la migration échoue et s'annule si l'état obtenu n'est pas
-- exactement celui visé.
--
-- Le `search_path` est comparé sous forme NORMALISÉE (guillemets et espaces
-- retirés) : PostgreSQL stocke `set search_path = public, pg_temp` dans un
-- unique élément de `proconfig` contenant lui-même la virgule, et la
-- représentation exacte n'est pas un contrat stable.
do $k31_trace$
declare
  f record;
  v_attendu text;
  v_public boolean;
begin
  for f in
    select p.oid, p.proname,
           coalesce(replace(replace(array_to_string(p.proconfig, ','), '"', ''), ' ', ''), '(aucun)') as config
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in ('handle_new_user', 'handle_updated_at', 'rls_auto_enable')
  loop
    v_attendu := case when f.proname = 'rls_auto_enable'
                      then 'search_path=pg_catalog'
                      else 'search_path=public,pg_temp' end;

    if f.config <> v_attendu then
      raise exception '[k3.1] search_path inattendu sur % : % (attendu %)',
        f.proname, f.config, v_attendu;
    end if;

    if has_function_privilege('anon', f.oid, 'EXECUTE') then
      raise exception '[k3.1] anon conserve EXECUTE sur %', f.proname;
    end if;

    if has_function_privilege('authenticated', f.oid, 'EXECUTE') then
      raise exception '[k3.1] authenticated conserve EXECUTE sur %', f.proname;
    end if;

    if not has_function_privilege('service_role', f.oid, 'EXECUTE') then
      raise exception '[k3.1] service_role a PERDU EXECUTE sur %', f.proname;
    end if;

    select exists (
      select 1 from pg_proc p2, unnest(p2.proacl) a
      where p2.oid = f.oid and a::text like '=%'
    ) into v_public;

    if v_public then
      raise exception '[k3.1] PUBLIC conserve un privilege sur %', f.proname;
    end if;

    raise notice '[k3.1] % : search_path=%, anon/authenticated/PUBLIC sans EXECUTE, service_role conserve',
      f.proname, f.config;
  end loop;

  -- coach_consume_quota doit rester strictement inchangée.
  if not exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'coach_consume_quota'
      and replace(replace(array_to_string(p.proconfig, ','), '"', ''), ' ', '') = 'search_path=public'
      and has_function_privilege('service_role', p.oid, 'EXECUTE')
      and not has_function_privilege('anon', p.oid, 'EXECUTE')
      and not has_function_privilege('authenticated', p.oid, 'EXECUTE')
  ) then
    raise exception '[k3.1] coach_consume_quota a ete modifiee ou n''est plus conforme';
  end if;
end
$k31_trace$;

commit;
