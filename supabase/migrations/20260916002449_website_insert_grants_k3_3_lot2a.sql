-- Phase 05-K.3.3 Lot 2A — retrait du privilege INSERT la ou aucune policy
-- INSERT n'est applicable au role.
--
-- PERIMETRE STRICT : 45 REVOKE INSERT, rien d'autre.
--   - anon          : 28 tables (toutes celles qui lui accordent encore INSERT)
--   - authenticated : 17 tables, celles ou aucune policy INSERT ne s'applique
--
-- POURQUOI C'EST DEMONTRE, ET NON SUPPOSE :
-- un INSERT depourvu de policy WITH CHECK applicable echoue DEJA avec le
-- SQLSTATE 42501 (« new row violates row-level security policy »). Apres ce
-- REVOKE il echouera avec le SQLSTATE 42501 (« permission denied for table »).
-- Le code d'erreur recu par le client est IDENTIQUE avant et apres : aucun
-- client — Website, Mobile, quel que soit le binaire publie — ne peut
-- distinguer les deux situations ni voir son comportement changer.
-- Ce point a ete verifie empiriquement en transaction annulee avant
-- application, sur quatre tables representatives plus un temoin positif.
--
-- CE QUI EST DELIBEREMENT CONSERVE :
--   - INSERT authenticated sur les 11 tables ou une policy INSERT s'applique :
--     profiles, progress, workouts, health_metrics, smartwatch_connections,
--     user_streaks, fitness_goals, push_tokens, favorite_exercises,
--     user_achievements, smartwatch_sessions.
--   - SELECT, UPDATE et DELETE : intouches pour les deux roles. Leur reduction
--     (Lot 2B) dependrait d'usages Mobile non verifiables et changerait le mode
--     d'echec observable (0 ligne -> 42501).
--   - REFERENCES, TRIGGER, TRUNCATE : deja retires en K.1 et K.3.3 Lot 1.
--   - service_role et postgres : aucun REVOKE.
--
-- Ni policy, ni RLS, ni trigger, ni fonction, ni colonne, ni donnee, ni default
-- privilege, ni Storage, ni auth, ni realtime, ni graphql ne sont touches.
--
-- IDEMPOTENT : REVOKE sur un privilege absent est un no-op en PostgreSQL.

begin;

-- ---------------------------------------------------------------- anon (28)
revoke insert on table public.achievements            from anon;
revoke insert on table public.admin_users             from anon;
revoke insert on table public.coach_messages          from anon;
revoke insert on table public.content_discipline_i18n from anon;
revoke insert on table public.content_disciplines     from anon;
revoke insert on table public.content_videos          from anon;
revoke insert on table public.exercises               from anon;
revoke insert on table public.favorite_exercises      from anon;
revoke insert on table public.fitness_goals           from anon;
revoke insert on table public.health_metrics          from anon;
revoke insert on table public.metrics                 from anon;
revoke insert on table public.order_items             from anon;
revoke insert on table public.orders                  from anon;
revoke insert on table public.products                from anon;
revoke insert on table public.profiles                from anon;
revoke insert on table public.program_sessions        from anon;
revoke insert on table public.programs                from anon;
revoke insert on table public.progress                from anon;
revoke insert on table public.push_tokens             from anon;
revoke insert on table public.session_exercises       from anon;
revoke insert on table public.smartwatch_connections  from anon;
revoke insert on table public.smartwatch_sessions     from anon;
revoke insert on table public.subscriptions           from anon;
revoke insert on table public.user_achievements       from anon;
revoke insert on table public.user_streaks            from anon;
revoke insert on table public.users                   from anon;
revoke insert on table public.workout_sessions        from anon;
revoke insert on table public.workouts                from anon;

-- ------------------------------------------------------- authenticated (17)
revoke insert on table public.achievements            from authenticated;
revoke insert on table public.admin_users             from authenticated;
revoke insert on table public.coach_messages          from authenticated;
revoke insert on table public.content_discipline_i18n from authenticated;
revoke insert on table public.content_disciplines     from authenticated;
revoke insert on table public.content_videos          from authenticated;
revoke insert on table public.exercises               from authenticated;
revoke insert on table public.metrics                 from authenticated;
revoke insert on table public.order_items             from authenticated;
revoke insert on table public.orders                  from authenticated;
revoke insert on table public.products                from authenticated;
revoke insert on table public.program_sessions        from authenticated;
revoke insert on table public.programs                from authenticated;
revoke insert on table public.session_exercises       from authenticated;
revoke insert on table public.subscriptions           from authenticated;
revoke insert on table public.users                   from authenticated;
revoke insert on table public.workout_sessions        from authenticated;

do $lot2a$
declare
  v_anon text[] := array[
    'achievements','admin_users','coach_messages','content_discipline_i18n',
    'content_disciplines','content_videos','exercises','favorite_exercises',
    'fitness_goals','health_metrics','metrics','order_items','orders','products',
    'profiles','program_sessions','programs','progress','push_tokens',
    'session_exercises','smartwatch_connections','smartwatch_sessions',
    'subscriptions','user_achievements','user_streaks','users',
    'workout_sessions','workouts'];
  v_auth text[] := array[
    'achievements','admin_users','coach_messages','content_discipline_i18n',
    'content_disciplines','content_videos','exercises','metrics','order_items',
    'orders','products','program_sessions','programs','session_exercises',
    'subscriptions','users','workout_sessions'];
  v_garde text[] := array[
    'profiles','progress','workouts','health_metrics','smartwatch_connections',
    'user_streaks','fitness_goals','push_tokens','favorite_exercises',
    'user_achievements','smartwatch_sessions'];
  t text; n int;
begin
  if array_length(v_anon,1) <> 28 then
    raise exception '[lot2a] liste anon corrompue : % entrees au lieu de 28', array_length(v_anon,1);
  end if;
  if array_length(v_auth,1) <> 17 then
    raise exception '[lot2a] liste authenticated corrompue : % entrees au lieu de 17', array_length(v_auth,1);
  end if;
  if array_length(v_garde,1) <> 11 then
    raise exception '[lot2a] liste de garde corrompue : % entrees au lieu de 11', array_length(v_garde,1);
  end if;

  -- 1. anon n'a plus AUCUN INSERT sur les 28
  foreach t in array v_anon loop
    if has_table_privilege('anon', ('public.'||quote_ident(t))::regclass, 'INSERT') then
      raise exception '[lot2a] anon conserve INSERT sur public.%', t;
    end if;
  end loop;

  -- 2. authenticated n'a plus INSERT sur les 17
  foreach t in array v_auth loop
    if has_table_privilege('authenticated', ('public.'||quote_ident(t))::regclass, 'INSERT') then
      raise exception '[lot2a] authenticated conserve INSERT sur public.%', t;
    end if;
  end loop;

  -- 3. authenticated CONSERVE INSERT sur les 11 necessaires
  foreach t in array v_garde loop
    if not has_table_privilege('authenticated', ('public.'||quote_ident(t))::regclass, 'INSERT') then
      raise exception '[lot2a] authenticated a PERDU INSERT sur public.% — hors perimetre', t;
    end if;
  end loop;

  -- 4. service_role et postgres gardent INSERT sur les 35 tables
  select count(*) into n from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
   where ns.nspname = 'public' and c.relkind = 'r'
     and has_table_privilege('service_role', c.oid, 'INSERT');
  if n <> 35 then
    raise exception '[lot2a] service_role a INSERT sur % tables au lieu de 35', n;
  end if;
  select count(*) into n from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
   where ns.nspname = 'public' and c.relkind = 'r'
     and has_table_privilege('postgres', c.oid, 'INSERT');
  if n <> 35 then
    raise exception '[lot2a] postgres a INSERT sur % tables au lieu de 35', n;
  end if;

  -- 5. SELECT / UPDATE / DELETE strictement inchanges pour les deux roles
  select count(*) into n from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
   where ns.nspname='public' and c.relkind='r' and has_table_privilege('anon', c.oid, 'SELECT');
  if n <> 28 then raise exception '[lot2a] anon SELECT = % au lieu de 28', n; end if;
  select count(*) into n from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
   where ns.nspname='public' and c.relkind='r' and has_table_privilege('anon', c.oid, 'UPDATE');
  if n <> 27 then raise exception '[lot2a] anon UPDATE = % au lieu de 27', n; end if;
  select count(*) into n from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
   where ns.nspname='public' and c.relkind='r' and has_table_privilege('anon', c.oid, 'DELETE');
  if n <> 28 then raise exception '[lot2a] anon DELETE = % au lieu de 28', n; end if;

  select count(*) into n from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
   where ns.nspname='public' and c.relkind='r' and has_table_privilege('authenticated', c.oid, 'SELECT');
  if n <> 28 then raise exception '[lot2a] authenticated SELECT = % au lieu de 28', n; end if;
  select count(*) into n from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
   where ns.nspname='public' and c.relkind='r' and has_table_privilege('authenticated', c.oid, 'UPDATE');
  if n <> 27 then raise exception '[lot2a] authenticated UPDATE = % au lieu de 27', n; end if;
  select count(*) into n from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
   where ns.nspname='public' and c.relkind='r' and has_table_privilege('authenticated', c.oid, 'DELETE');
  if n <> 28 then raise exception '[lot2a] authenticated DELETE = % au lieu de 28', n; end if;

  -- 6. INSERT authenticated restant : exactement 11
  select count(*) into n from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
   where ns.nspname='public' and c.relkind='r' and has_table_privilege('authenticated', c.oid, 'INSERT');
  if n <> 11 then raise exception '[lot2a] authenticated INSERT = % au lieu de 11', n; end if;
  select count(*) into n from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
   where ns.nspname='public' and c.relkind='r' and has_table_privilege('anon', c.oid, 'INSERT');
  if n <> 0 then raise exception '[lot2a] anon INSERT = % au lieu de 0', n; end if;

  -- 7. le perimetre global n'a pas bouge
  if (select count(*) from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
       where ns.nspname='public' and c.relkind='r') <> 35 then
    raise exception '[lot2a] le nombre de tables a change';
  end if;
  if (select count(*) from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
       where ns.nspname='public' and c.relkind='r' and c.relrowsecurity) <> 35 then
    raise exception '[lot2a] RLS n est plus actif sur les 35 tables';
  end if;
  if (select count(*) from pg_policies where schemaname='public') <> 37 then
    raise exception '[lot2a] le nombre de policies a change';
  end if;
  if (select md5(string_agg(tablename||'.'||policyname||'|'||cmd||'|'||roles::text||'|'||
                 coalesce(qual,'')||'|'||coalesce(with_check,''), ';' order by tablename, policyname))
        from pg_policies where schemaname='public')
     <> '713241be63215b12d4f91f7788aa446d' then
    raise exception '[lot2a] la definition d au moins une policy a change';
  end if;
  if (select count(*) from pg_attribute a
       where a.attrelid = 'public.profiles'::regclass and a.attacl is not null) <> 13 then
    raise exception '[lot2a] les 13 grants de colonne de profiles ont change';
  end if;
  if (select md5(string_agg(p.proname||'='||md5(pg_get_functiondef(p.oid)), ';' order by p.proname))
        from pg_proc p join pg_namespace ns on ns.oid = p.pronamespace where ns.nspname='public')
     <> '2e2c10416c170b1adc2725eb8e2b0e3d' then
    raise exception '[lot2a] au moins une fonction a change';
  end if;
  if (select count(*) from public.profiles) <> 19
     or (select count(*) from auth.users) <> 19
     or (select count(*) from public.subscriptions) <> 5 then
    raise exception '[lot2a] les volumes de donnees ont change';
  end if;

  raise notice '[lot2a] 45 INSERT retires (28 anon + 17 authenticated) ; 11 INSERT authenticated conserves ; SELECT/UPDATE/DELETE, service_role, postgres, policies, fonctions et donnees inchanges';
end
$lot2a$;

commit;
