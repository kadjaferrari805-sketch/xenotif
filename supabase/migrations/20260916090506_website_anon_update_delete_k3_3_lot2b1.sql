-- Phase 05-K.3.3 Lot 2B-1 — retrait de UPDATE et DELETE au seul role anon.
--
-- PERIMETRE STRICT : 55 privileges retires, rien d'autre.
--   - UPDATE : 27 tables (profiles en est deja depourvu depuis K.3.2)
--   - DELETE : 28 tables
--   - role vise : anon UNIQUEMENT
--
-- POURQUOI C'EST SUR (audit 05-K.3.3 Lot 2B, read-only) :
--   1. Le Website n'execute AUCUNE operation sous anon. Le middleware
--      src/proxy.ts:82 redirige /dashboard, /dashboard/*, /admin et /admin/*
--      vers /auth/signin quand il n'y a pas d'utilisateur, et
--      dashboard/layout.tsx:24 redouble cette garde.
--   2. Le seul composant a client navigateur present sur les pages PUBLIQUES
--      est Nav.tsx (monte par ConditionalChrome depuis [locale]/layout.tsx:151).
--      Son unique acces base — un SELECT sur profiles ligne 54 — est place a
--      l'interieur de `if (data.user)` : il ne s'execute jamais sans session.
--   3. Les 4 pages auth/* a client navigateur ne font aucun .from().
--   4. AUCUNE policy n'autorise une ecriture anonyme : toutes les policies
--      d'ecriture exigent auth.uid(), et les policies `using = true` sont
--      exclusivement en cmd = SELECT. Un appelant anonyme n'a pas de user_id
--      et ne peut satisfaire aucun WITH CHECK.
--
-- RESERVE ASSUMEE, ET ELLE DIFFERE DU LOT 2A : pour un INSERT sans policy,
-- PostgreSQL renvoyait deja 42501, si bien que le retrait du GRANT ne changeait
-- rien pour le client. Ici ce n'est pas le cas — un UPDATE ou un DELETE sans
-- policy applicable REUSSIT aujourd'hui en affectant 0 ligne, et echouera
-- desormais en 42501. Le mode d'echec change donc, et c'est observable. Le
-- risque est juge nul parce qu'aucun appel de ce type n'existe et qu'un tel
-- appel ne pourrait rien accomplir — mais le niveau de preuve est inferieur a
-- celui du Lot 2A, et je ne le presente pas comme equivalent.
--
-- CE QUI N'EST PAS TOUCHE :
--   - anon SELECT : STRICTEMENT INCHANGE (28 tables). Les tables a policy
--     publique sont probablement lues par le Mobile avant login.
--   - authenticated : SELECT, INSERT, UPDATE et DELETE tous inchanges. Le
--     volet authenticated est BLOQUE (dependances Mobile non verifiables).
--   - service_role et postgres : aucun REVOKE.
--   - TRUNCATE, REFERENCES, TRIGGER : deja a 0 (K.1 et Lot 1).
--   - Les 13 grants de colonne de profiles (K.3.2).
--   - Ni policy, ni RLS, ni fonction, ni trigger, ni donnee, ni default
--     privilege, ni Storage, ni auth, ni realtime, ni graphql.
--
-- IDEMPOTENT : un REVOKE sur un privilege absent est un no-op en PostgreSQL.

begin;

revoke update on table
  public.achievements,
  public.admin_users,
  public.coach_messages,
  public.content_discipline_i18n,
  public.content_disciplines,
  public.content_videos,
  public.exercises,
  public.favorite_exercises,
  public.fitness_goals,
  public.health_metrics,
  public.metrics,
  public.order_items,
  public.orders,
  public.products,
  public.program_sessions,
  public.programs,
  public.progress,
  public.push_tokens,
  public.session_exercises,
  public.smartwatch_connections,
  public.smartwatch_sessions,
  public.subscriptions,
  public.user_achievements,
  public.user_streaks,
  public.users,
  public.workout_sessions,
  public.workouts
from anon;

revoke delete on table
  public.achievements,
  public.admin_users,
  public.coach_messages,
  public.content_discipline_i18n,
  public.content_disciplines,
  public.content_videos,
  public.exercises,
  public.favorite_exercises,
  public.fitness_goals,
  public.health_metrics,
  public.metrics,
  public.order_items,
  public.orders,
  public.products,
  public.profiles,
  public.program_sessions,
  public.programs,
  public.progress,
  public.push_tokens,
  public.session_exercises,
  public.smartwatch_connections,
  public.smartwatch_sessions,
  public.subscriptions,
  public.user_achievements,
  public.user_streaks,
  public.users,
  public.workout_sessions,
  public.workouts
from anon;

do $lot2b1$
declare
  n int;
begin
  ------------------------------------------------------------------ anon vise
  select count(*) into n from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
   where ns.nspname = 'public' and c.relkind = 'r'
     and has_table_privilege('anon', c.oid, 'UPDATE');
  if n <> 0 then raise exception '[lot2b1] anon conserve UPDATE sur % table(s)', n; end if;

  select count(*) into n from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
   where ns.nspname = 'public' and c.relkind = 'r'
     and has_table_privilege('anon', c.oid, 'DELETE');
  if n <> 0 then raise exception '[lot2b1] anon conserve DELETE sur % table(s)', n; end if;

  --------------------------------------------------- anon SELECT/INSERT intacts
  select count(*) into n from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
   where ns.nspname = 'public' and c.relkind = 'r'
     and has_table_privilege('anon', c.oid, 'SELECT');
  if n <> 28 then raise exception '[lot2b1] anon SELECT = % au lieu de 28 — HORS PERIMETRE', n; end if;

  select count(*) into n from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
   where ns.nspname = 'public' and c.relkind = 'r'
     and has_table_privilege('anon', c.oid, 'INSERT');
  if n <> 0 then raise exception '[lot2b1] anon INSERT = % au lieu de 0', n; end if;

  ------------------------------------------- authenticated STRICTEMENT INCHANGE
  select count(*) into n from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
   where ns.nspname = 'public' and c.relkind = 'r'
     and has_table_privilege('authenticated', c.oid, 'SELECT');
  if n <> 28 then raise exception '[lot2b1] authenticated SELECT = % au lieu de 28', n; end if;

  select count(*) into n from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
   where ns.nspname = 'public' and c.relkind = 'r'
     and has_table_privilege('authenticated', c.oid, 'INSERT');
  if n <> 11 then raise exception '[lot2b1] authenticated INSERT = % au lieu de 11', n; end if;

  select count(*) into n from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
   where ns.nspname = 'public' and c.relkind = 'r'
     and has_table_privilege('authenticated', c.oid, 'UPDATE');
  if n <> 27 then raise exception '[lot2b1] authenticated UPDATE = % au lieu de 27', n; end if;

  select count(*) into n from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
   where ns.nspname = 'public' and c.relkind = 'r'
     and has_table_privilege('authenticated', c.oid, 'DELETE');
  if n <> 28 then raise exception '[lot2b1] authenticated DELETE = % au lieu de 28', n; end if;

  ---------------------------------------------- service_role et postgres intacts
  select count(*) into n from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
   where ns.nspname = 'public' and c.relkind = 'r'
     and has_table_privilege('service_role', c.oid, 'SELECT')
     and has_table_privilege('service_role', c.oid, 'INSERT')
     and has_table_privilege('service_role', c.oid, 'UPDATE')
     and has_table_privilege('service_role', c.oid, 'DELETE');
  if n <> 35 then raise exception '[lot2b1] service_role SIUD sur % tables au lieu de 35', n; end if;

  select count(*) into n from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
   where ns.nspname = 'public' and c.relkind = 'r'
     and has_table_privilege('postgres', c.oid, 'SELECT')
     and has_table_privilege('postgres', c.oid, 'INSERT')
     and has_table_privilege('postgres', c.oid, 'UPDATE')
     and has_table_privilege('postgres', c.oid, 'DELETE');
  if n <> 35 then raise exception '[lot2b1] postgres SIUD sur % tables au lieu de 35', n; end if;

  ------------------------------------------- acquis K.1 et Lot 1 toujours en place
  select count(*) into n from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
   where ns.nspname = 'public' and c.relkind = 'r'
     and (has_table_privilege('anon', c.oid, 'TRUNCATE')
       or has_table_privilege('anon', c.oid, 'REFERENCES')
       or has_table_privilege('anon', c.oid, 'TRIGGER')
       or has_table_privilege('authenticated', c.oid, 'TRUNCATE')
       or has_table_privilege('authenticated', c.oid, 'REFERENCES')
       or has_table_privilege('authenticated', c.oid, 'TRIGGER'));
  if n <> 0 then raise exception '[lot2b1] TRUNCATE/REFERENCES/TRIGGER reapparus sur % table(s)', n; end if;

  --------------------------------------------------------- perimetre et integrite
  if (select count(*) from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
       where ns.nspname = 'public' and c.relkind = 'r') <> 35 then
    raise exception '[lot2b1] le nombre de tables a change';
  end if;

  if (select count(*) from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
       where ns.nspname = 'public' and c.relkind = 'r' and c.relrowsecurity) <> 35 then
    raise exception '[lot2b1] RLS n est plus actif sur les 35 tables';
  end if;

  if (select count(*) from pg_policies where schemaname = 'public') <> 37 then
    raise exception '[lot2b1] le nombre de policies a change';
  end if;

  if (select md5(string_agg(tablename || '.' || policyname || '|' || cmd || '|' || roles::text || '|' ||
                 coalesce(qual, '') || '|' || coalesce(with_check, ''), ';' order by tablename, policyname))
        from pg_policies where schemaname = 'public')
     <> '713241be63215b12d4f91f7788aa446d' then
    raise exception '[lot2b1] la definition d au moins une policy a change';
  end if;

  if (select count(*) from pg_attribute a
       where a.attrelid = 'public.profiles'::regclass and a.attacl is not null) <> 13 then
    raise exception '[lot2b1] les 13 grants de colonne de profiles ont change';
  end if;

  if (select md5(string_agg(p.proname || '=' || md5(pg_get_functiondef(p.oid)) || '|' ||
                 coalesce(p.proacl::text, 'NULL'), ';' order by p.proname))
        from pg_proc p join pg_namespace ns on ns.oid = p.pronamespace where ns.nspname = 'public')
     <> '14e736650f6ec6d19367783fccd7ee61' then
    raise exception '[lot2b1] une fonction de public ou son ACL a change';
  end if;

  if (select md5(string_agg(c.relname || '.' || t.tgname || '=' || pg_get_triggerdef(t.oid), ';'
                 order by c.relname, t.tgname))
        from pg_trigger t join pg_class c on c.oid = t.tgrelid
        join pg_namespace ns on ns.oid = c.relnamespace
       where ns.nspname = 'public' and not t.tgisinternal)
     <> 'b962c9097b1ba7cdee59ab410440f801' then
    raise exception '[lot2b1] un trigger de public a change';
  end if;

  if (select count(*) from public.profiles) <> 19
     or (select count(*) from auth.users) <> 19
     or (select count(*) from public.subscriptions) <> 5 then
    raise exception '[lot2b1] les volumes de donnees ont change';
  end if;

  raise notice '[lot2b1] anon : UPDATE 27->0 et DELETE 28->0 (55 privileges) ; anon SELECT inchange a 28 ; authenticated 28/11/27/28 inchange ; service_role et postgres 35/35 ; policies, fonctions, triggers et donnees inchanges';
end
$lot2b1$;

commit;
