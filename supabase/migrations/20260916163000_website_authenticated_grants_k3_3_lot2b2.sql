-- Phase 05-K.3.3 Lot 2B-2 (K.6) — retrait de UPDATE et DELETE au seul role authenticated.
--
-- PERIMETRE STRICT : 34 privileges retires, rien d'autre.
--   - UPDATE : 17 tables
--   - DELETE : 17 tables
--   - role vise : authenticated UNIQUEMENT
--
-- POURQUOI C'EST SUR (audit 05-K.6, read-only) :
--   1. AUCUNE ecriture Website n'emprunte le chemin `authenticated` sur ces tables.
--      Les six seules tables ecrites sous ce role sont profiles, progress, workouts,
--      health_metrics, smartwatch_connections et user_streaks — aucune n'est ciblee.
--      Tout le reste (admin, cron, webhook Stripe, push, reviews, subscribe,
--      transformations, save-cart) passe par service_role.
--   2. Point verifie et non presume : `linkSubscriptionToUser`, qui ecrit
--      `subscriptions`, recoit `createServiceClient()` depuis ses QUATRE appelants,
--      y compris les routes authentifiees /api/subscription et /api/subscription/sync
--      — lesquelles n'utilisent le client utilisateur que pour identifier l'appelant.
--   3. Les builds Mobile PUBLIES (XenotifFitness iOS 2.1.0 #38 = 30d486c7,
--      xenotif-app iOS 1.0.0 #15 = 4ef2af63) n'ecrivent que favorite_exercises,
--      fitness_goals, health_metrics, profiles, progress, push_tokens,
--      smartwatch_connections, user_achievements et workouts. Aucune cible.
--   4. Les deux Edge Functions Mobile s'executent en service_role.
--   5. Aucune fonction de `public` ne reference une cible, et aucune n'est
--      executable par authenticated : il n'existe aucun chemin d'ecriture indirect.
--   6. Aucune policy UPDATE ou DELETE applicable a authenticated n'existe sur ces
--      tables — uniquement SELECT, ou ALL reservee a service_role.
--
-- RESERVE ASSUMEE, ET ELLE DIFFERE DU LOT 2A : pour un INSERT sans policy,
-- PostgreSQL renvoyait deja 42501, si bien que le retrait du GRANT etait invisible.
-- Ici le mode d'echec CHANGE : la sonde sous `authenticated` reel montre que
-- UPDATE et DELETE renvoient aujourd'hui « 0 ligne » (RLS filtre, le privilege est
-- bien present) et renverront desormais 42501. C'est observable. Le risque est juge
-- nul parce qu'aucun appel de ce type n'existe et qu'un tel appel ne pourrait rien
-- accomplir — mais le niveau de preuve est inferieur a celui du Lot 2A, et je ne le
-- presente pas comme equivalent.
--
-- CE QUI N'EST PAS TOUCHE :
--   - SELECT des 17 tables : STRICTEMENT INCHANGE. Onze d'entre elles sont lues par
--     le Website ou le Mobile, et un SELECT ne se retire pas pour non-usage.
--   - INSERT : inchange (11 tables).
--   - profiles : AUCUNE modification. Son DELETE authenticated est sans usage
--     demontre (la suppression de compte passe par admin.auth.admin.deleteUser en
--     service_role) mais reste HORS PERIMETRE F-04 : KEEP assume.
--   - Les 8 tables SIUD dont le DELETE est inutilise : KEEP, fonctionnalite plausible.
--   - anon : deja depourvu de UPDATE/DELETE depuis le Lot 2B-1.
--   - service_role et postgres : aucun REVOKE.
--   - TRUNCATE, REFERENCES, TRIGGER : deja a 0 (K.1 et Lot 1).
--   - Les 13 grants de colonne de profiles (K.3.2).
--   - rate_limits et rate_limit_hit (K.5).
--   - Ni policy, ni RLS, ni fonction, ni trigger, ni donnee, ni default privilege.
--
-- IDEMPOTENT : un REVOKE sur un privilege absent est un no-op en PostgreSQL.

begin;

revoke update on table public.achievements from authenticated;
revoke delete on table public.achievements from authenticated;

revoke update on table public.admin_users from authenticated;
revoke delete on table public.admin_users from authenticated;

revoke update on table public.coach_messages from authenticated;
revoke delete on table public.coach_messages from authenticated;

revoke update on table public.content_disciplines from authenticated;
revoke delete on table public.content_disciplines from authenticated;

revoke update on table public.content_discipline_i18n from authenticated;
revoke delete on table public.content_discipline_i18n from authenticated;

revoke update on table public.content_videos from authenticated;
revoke delete on table public.content_videos from authenticated;

revoke update on table public.exercises from authenticated;
revoke delete on table public.exercises from authenticated;

revoke update on table public.metrics from authenticated;
revoke delete on table public.metrics from authenticated;

revoke update on table public.order_items from authenticated;
revoke delete on table public.order_items from authenticated;

revoke update on table public.orders from authenticated;
revoke delete on table public.orders from authenticated;

revoke update on table public.products from authenticated;
revoke delete on table public.products from authenticated;

revoke update on table public.program_sessions from authenticated;
revoke delete on table public.program_sessions from authenticated;

revoke update on table public.programs from authenticated;
revoke delete on table public.programs from authenticated;

revoke update on table public.session_exercises from authenticated;
revoke delete on table public.session_exercises from authenticated;

revoke update on table public.subscriptions from authenticated;
revoke delete on table public.subscriptions from authenticated;

revoke update on table public.users from authenticated;
revoke delete on table public.users from authenticated;

revoke update on table public.workout_sessions from authenticated;
revoke delete on table public.workout_sessions from authenticated;

do $lot2b2$
declare
  v_cibles text[] := array[
    'achievements','admin_users','coach_messages','content_disciplines',
    'content_discipline_i18n','content_videos','exercises','metrics',
    'order_items','orders','products','program_sessions','programs',
    'session_exercises','subscriptions','users','workout_sessions'];
  v_legitimes text[] := array[
    'favorite_exercises','fitness_goals','health_metrics','progress','push_tokens',
    'smartwatch_connections','smartwatch_sessions','user_achievements','user_streaks','workouts'];
  t text;
  n int;
begin
  ------------------------------------------------- les 34 privileges sont retires
  foreach t in array v_cibles loop
    if has_table_privilege('authenticated', ('public.'||t)::regclass, 'UPDATE') then
      raise exception '[lot2b2] authenticated conserve UPDATE sur %', t;
    end if;
    if has_table_privilege('authenticated', ('public.'||t)::regclass, 'DELETE') then
      raise exception '[lot2b2] authenticated conserve DELETE sur %', t;
    end if;
    -- le SELECT ne doit PAS avoir ete touche
    if not has_table_privilege('authenticated', ('public.'||t)::regclass, 'SELECT') then
      raise exception '[lot2b2] authenticated a PERDU SELECT sur % — HORS PERIMETRE', t;
    end if;
  end loop;

  --------------------------------------- les 10 tables legitimes restent intactes
  foreach t in array v_legitimes loop
    if not has_table_privilege('authenticated', ('public.'||t)::regclass, 'SELECT')
       or not has_table_privilege('authenticated', ('public.'||t)::regclass, 'INSERT')
       or not has_table_privilege('authenticated', ('public.'||t)::regclass, 'UPDATE')
       or not has_table_privilege('authenticated', ('public.'||t)::regclass, 'DELETE') then
      raise exception '[lot2b2] authenticated a perdu un privilege sur % — HORS PERIMETRE', t;
    end if;
  end loop;

  ------------------------------------------------------------ comptes d'ensemble
  select count(*) into n from pg_class c join pg_namespace ns on ns.oid=c.relnamespace
   where ns.nspname='public' and c.relkind='r'
     and has_table_privilege('authenticated', c.oid, 'SELECT');
  if n <> 28 then raise exception '[lot2b2] authenticated SELECT = % au lieu de 28', n; end if;

  select count(*) into n from pg_class c join pg_namespace ns on ns.oid=c.relnamespace
   where ns.nspname='public' and c.relkind='r'
     and has_table_privilege('authenticated', c.oid, 'INSERT');
  if n <> 11 then raise exception '[lot2b2] authenticated INSERT = % au lieu de 11', n; end if;

  select count(*) into n from pg_class c join pg_namespace ns on ns.oid=c.relnamespace
   where ns.nspname='public' and c.relkind='r'
     and has_table_privilege('authenticated', c.oid, 'UPDATE');
  if n <> 10 then raise exception '[lot2b2] authenticated UPDATE = % au lieu de 10', n; end if;

  select count(*) into n from pg_class c join pg_namespace ns on ns.oid=c.relnamespace
   where ns.nspname='public' and c.relkind='r'
     and has_table_privilege('authenticated', c.oid, 'DELETE');
  -- 10 tables legitimes + profiles, dont le DELETE est un KEEP assume
  if n <> 11 then raise exception '[lot2b2] authenticated DELETE = % au lieu de 11', n; end if;

  ------------------------------------------------------ profiles STRICTEMENT intact
  if not has_table_privilege('authenticated', 'public.profiles', 'SELECT')
     or not has_table_privilege('authenticated', 'public.profiles', 'INSERT')
     or not has_table_privilege('authenticated', 'public.profiles', 'DELETE') then
    raise exception '[lot2b2] profiles a ete modifie — HORS PERIMETRE';
  end if;
  if has_table_privilege('authenticated', 'public.profiles', 'UPDATE') then
    raise exception '[lot2b2] profiles a gagne UPDATE au niveau table — K.3.2 compromis';
  end if;
  if (select count(*) from pg_attribute a
       where a.attrelid='public.profiles'::regclass and a.attacl is not null) <> 13 then
    raise exception '[lot2b2] les 13 grants de colonne de profiles (K.3.2) ont change';
  end if;

  ---------------------------------------------- anon, service_role et postgres intacts
  select count(*) into n from pg_class c join pg_namespace ns on ns.oid=c.relnamespace
   where ns.nspname='public' and c.relkind='r'
     and has_table_privilege('anon', c.oid, 'SELECT');
  if n <> 28 then raise exception '[lot2b2] anon SELECT = % au lieu de 28', n; end if;

  select count(*) into n from pg_class c join pg_namespace ns on ns.oid=c.relnamespace
   where ns.nspname='public' and c.relkind='r'
     and (has_table_privilege('anon', c.oid, 'UPDATE') or has_table_privilege('anon', c.oid, 'DELETE'));
  if n <> 0 then raise exception '[lot2b2] anon a regagne UPDATE/DELETE sur % table(s)', n; end if;

  select count(*) into n from pg_class c join pg_namespace ns on ns.oid=c.relnamespace
   where ns.nspname='public' and c.relkind='r'
     and has_table_privilege('service_role', c.oid, 'SELECT')
     and has_table_privilege('service_role', c.oid, 'INSERT')
     and has_table_privilege('service_role', c.oid, 'UPDATE')
     and has_table_privilege('service_role', c.oid, 'DELETE');
  if n <> 36 then raise exception '[lot2b2] service_role SIUD sur % tables au lieu de 36', n; end if;

  select count(*) into n from pg_class c join pg_namespace ns on ns.oid=c.relnamespace
   where ns.nspname='public' and c.relkind='r'
     and has_table_privilege('postgres', c.oid, 'SELECT')
     and has_table_privilege('postgres', c.oid, 'INSERT')
     and has_table_privilege('postgres', c.oid, 'UPDATE')
     and has_table_privilege('postgres', c.oid, 'DELETE');
  if n <> 36 then raise exception '[lot2b2] postgres SIUD sur % tables au lieu de 36', n; end if;

  ------------------------------------------ acquis K.1 / Lot 1 toujours en place
  select count(*) into n from pg_class c join pg_namespace ns on ns.oid=c.relnamespace
   where ns.nspname='public' and c.relkind='r'
     and (has_table_privilege('anon', c.oid, 'TRUNCATE')
       or has_table_privilege('anon', c.oid, 'REFERENCES')
       or has_table_privilege('anon', c.oid, 'TRIGGER')
       or has_table_privilege('authenticated', c.oid, 'TRUNCATE')
       or has_table_privilege('authenticated', c.oid, 'REFERENCES')
       or has_table_privilege('authenticated', c.oid, 'TRIGGER'));
  if n <> 0 then raise exception '[lot2b2] TRUNCATE/REFERENCES/TRIGGER reapparus sur % table(s)', n; end if;

  --------------------------------------------------- perimetre, RLS et policies
  if (select count(*) from pg_class c join pg_namespace ns on ns.oid=c.relnamespace
       where ns.nspname='public' and c.relkind='r') <> 36 then
    raise exception '[lot2b2] le nombre de tables a change';
  end if;

  if (select count(*) from pg_class c join pg_namespace ns on ns.oid=c.relnamespace
       where ns.nspname='public' and c.relkind='r' and c.relrowsecurity) <> 36 then
    raise exception '[lot2b2] RLS n est plus actif sur les 36 tables';
  end if;

  if (select count(*) from pg_policies where schemaname='public') <> 37 then
    raise exception '[lot2b2] le nombre de policies a change';
  end if;

  if (select md5(string_agg(tablename || '.' || policyname || '|' || cmd || '|' || roles::text || '|' ||
                 coalesce(qual, '') || '|' || coalesce(with_check, ''), ';' order by tablename, policyname))
        from pg_policies where schemaname = 'public')
     <> '713241be63215b12d4f91f7788aa446d' then
    raise exception '[lot2b2] la definition d au moins une policy a change';
  end if;

  ------------------------------------------------- acquis K.3.4 / K.3.7 et K.5
  select count(*) into n
  from pg_default_acl d
  join pg_namespace n2 on n2.oid = d.defaclnamespace
  cross join lateral aclexplode(d.defaclacl) x
  where n2.nspname = 'public'
    and pg_get_userbyid(d.defaclrole) = 'postgres'
    and pg_get_userbyid(x.grantee) in ('anon', 'authenticated');
  if n <> 0 then raise exception '[lot2b2] % default privilege(s) dangereux — voir K.3.4', n; end if;

  if to_regclass('public.rate_limits') is null then
    raise exception '[lot2b2] la table rate_limits (K.5) a disparu';
  end if;
  if (select count(*) from pg_proc p join pg_namespace ns on ns.oid=p.pronamespace
       where ns.nspname='public' and p.proname='rate_limit_hit') <> 1 then
    raise exception '[lot2b2] la fonction rate_limit_hit (K.5) a disparu';
  end if;
  if (select count(*) from pg_proc p join pg_namespace ns on ns.oid=p.pronamespace
       where ns.nspname='public') <> 6 then
    raise exception '[lot2b2] le nombre de fonctions de public a change';
  end if;

  ------------------------------------------------------------------- donnees
  if (select count(*) from public.profiles) <> 19
     or (select count(*) from auth.users) <> 19
     or (select count(*) from public.subscriptions) <> 5 then
    raise exception '[lot2b2] les volumes de donnees ont change';
  end if;

  raise notice '[lot2b2] authenticated : UPDATE 27->10 et DELETE 28->11 (34 privileges retires sur 17 tables) ; SELECT inchange a 28 ; INSERT inchange a 11 ; profiles, anon, service_role, postgres, policies, RLS, fonctions et donnees inchanges';
end
$lot2b2$;

commit;
