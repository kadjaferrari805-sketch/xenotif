-- Phase 05-K.3.4 — neutralisation des default privileges du schéma public.
--
-- CAUSE RACINE (audit 05-K.3.4, lecture directe du fichier) :
-- XenotifFitness/packages/db/src/schema.sql ligne 2 contient l'instruction
-- EXÉCUTABLE `alter default privileges in schema public grant all on tables
-- to postgres, anon, authenticated, service_role;`, que DEPLOYMENT.md ligne 28
-- prescrit d'appliquer (`cat packages/db/src/schema.sql | supabase db push`).
--
-- CONSÉQUENCE MESURÉE : toute table créée dans public par postgres naissait
-- avec les 8 privilèges pour anon ET authenticated, TRUNCATE compris. Or
-- TRUNCATE n'est pas filtré par RLS. Un simple CREATE TABLE défaisait donc
-- K.1, K.3.2 et K.3.3 sur la table concernée, sans aucun signal.
--
-- CE QUI EST FAIT : retirer à anon et authenticated les privilèges accordés
-- PAR DÉFAUT aux objets FUTURS de public créés par postgres. Rien d'autre.
--
-- CE QUI N'EST PAS TOUCHÉ, ET POURQUOI C'EST STRUCTUREL :
-- un default ACL n'est consulté qu'au moment du CREATE. Les privilèges déjà
-- matérialisés dans pg_class.relacl ne sont jamais recalculés. Les 35 tables
-- existantes sont donc intactes par construction — et la garde ci-dessous le
-- vérifie par empreinte plutôt que de le supposer.
--
-- PÉRIMÈTRE STRICT : rôle créateur postgres, schéma public, rôles anon et
-- authenticated. service_role et postgres conservent l'intégralité de leurs
-- defaults (8 TABLE + 3 SEQUENCE + 1 FUNCTION chacun).
--
-- DEUX LIMITES ASSUMÉES, NON CORRIGÉES ICI :
--   1. Les 3 entrées de default du rôle supabase_admin sur public restent en
--      place : postgres n'est ni superutilisateur (rolsuper=false) ni membre de
--      supabase_admin (pg_has_role=false), l'ALTER échouerait. Impact mesuré
--      nul : 0 objet de public appartient à supabase_admin, les 35 tables
--      appartiennent toutes à postgres.
--   2. Tant que XenotifFitness/packages/db/src/schema.sql:2 subsiste et que
--      DEPLOYMENT.md prescrit son exécution, une réexécution restaurerait le
--      default. Le dépôt Mobile est hors périmètre de cette phase.
--
-- SÉQUENCES : public n'en contient aucune, et aucune colonne IDENTITY ni
-- serial (mesuré). Les clés primaires sont uuid, text ou date. Le retrait ne
-- peut donc rien casser aujourd'hui.
--
-- FONCTIONS : les 4 fonctions de public portent déjà un ACL explicite sans
-- anon ni authenticated. La seule RPC appelée (coach_consume_quota) l'est en
-- service_role. Le retrait ferme le vecteur d'exposition PostgREST automatique
-- d'une fonction future.
--
-- NON VALIDÉ EN PREVIEW, ET C'EST ASSUMÉ : Preview a son propre jeu de default
-- privileges et seulement 21 tables. La garde transactionnelle ci-dessous
-- remplace cette validation : toute post-condition non remplie annule tout.

begin;

alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated;

alter default privileges for role postgres in schema public
  revoke all on sequences from anon, authenticated;

alter default privileges for role postgres in schema public
  revoke all on functions from anon, authenticated;

do $k34$
declare
  v_priv_table    text[] := array['SELECT','INSERT','UPDATE','DELETE','TRUNCATE','REFERENCES','TRIGGER','MAINTAIN'];
  v_priv_sequence text[] := array['SELECT','UPDATE','USAGE'];
  v_priv_function text[] := array['EXECUTE'];
  v_clients       text[] := array['anon','authenticated'];
  v_services      text[] := array['service_role','postgres'];
  p text; r text;
  n int;
begin
  ------------------------------------------------------------------ A / B / C
  -- anon et authenticated ne doivent plus avoir AUCUN default sur public
  -- pour les objets créés par postgres, privilège par privilège.
  foreach r in array v_clients loop
    foreach p in array v_priv_table loop
      select count(*) into n
      from pg_default_acl d
      join pg_namespace n2 on n2.oid = d.defaclnamespace
      cross join lateral aclexplode(d.defaclacl) x
      where n2.nspname = 'public'
        and pg_get_userbyid(d.defaclrole) = 'postgres'
        and d.defaclobjtype = 'r'
        and pg_get_userbyid(x.grantee) = r
        and x.privilege_type = p;
      if n <> 0 then
        raise exception '[k3.4] % conserve le default TABLE %', r, p;
      end if;
    end loop;

    foreach p in array v_priv_sequence loop
      select count(*) into n
      from pg_default_acl d
      join pg_namespace n2 on n2.oid = d.defaclnamespace
      cross join lateral aclexplode(d.defaclacl) x
      where n2.nspname = 'public'
        and pg_get_userbyid(d.defaclrole) = 'postgres'
        and d.defaclobjtype = 'S'
        and pg_get_userbyid(x.grantee) = r
        and x.privilege_type = p;
      if n <> 0 then
        raise exception '[k3.4] % conserve le default SEQUENCE %', r, p;
      end if;
    end loop;

    foreach p in array v_priv_function loop
      select count(*) into n
      from pg_default_acl d
      join pg_namespace n2 on n2.oid = d.defaclnamespace
      cross join lateral aclexplode(d.defaclacl) x
      where n2.nspname = 'public'
        and pg_get_userbyid(d.defaclrole) = 'postgres'
        and d.defaclobjtype = 'f'
        and pg_get_userbyid(x.grantee) = r
        and x.privilege_type = p;
      if n <> 0 then
        raise exception '[k3.4] % conserve le default FUNCTION %', r, p;
      end if;
    end loop;
  end loop;

  ---------------------------------------------------------------------- D / E
  -- service_role et postgres conservent TOUT : 8 TABLE, 3 SEQUENCE, 1 FUNCTION.
  foreach r in array v_services loop
    foreach p in array v_priv_table loop
      select count(*) into n
      from pg_default_acl d
      join pg_namespace n2 on n2.oid = d.defaclnamespace
      cross join lateral aclexplode(d.defaclacl) x
      where n2.nspname = 'public'
        and pg_get_userbyid(d.defaclrole) = 'postgres'
        and d.defaclobjtype = 'r'
        and pg_get_userbyid(x.grantee) = r
        and x.privilege_type = p;
      if n <> 1 then
        raise exception '[k3.4] % a PERDU le default TABLE %', r, p;
      end if;
    end loop;

    foreach p in array v_priv_sequence loop
      select count(*) into n
      from pg_default_acl d
      join pg_namespace n2 on n2.oid = d.defaclnamespace
      cross join lateral aclexplode(d.defaclacl) x
      where n2.nspname = 'public'
        and pg_get_userbyid(d.defaclrole) = 'postgres'
        and d.defaclobjtype = 'S'
        and pg_get_userbyid(x.grantee) = r
        and x.privilege_type = p;
      if n <> 1 then
        raise exception '[k3.4] % a PERDU le default SEQUENCE %', r, p;
      end if;
    end loop;

    select count(*) into n
    from pg_default_acl d
    join pg_namespace n2 on n2.oid = d.defaclnamespace
    cross join lateral aclexplode(d.defaclacl) x
    where n2.nspname = 'public'
      and pg_get_userbyid(d.defaclrole) = 'postgres'
      and d.defaclobjtype = 'f'
      and pg_get_userbyid(x.grantee) = r
      and x.privilege_type = 'EXECUTE';
    if n <> 1 then
      raise exception '[k3.4] % a PERDU le default FUNCTION EXECUTE', r;
    end if;
  end loop;

  ------------------------------------------------------- hors périmètre intact
  -- les defaults de supabase_admin sur public ne doivent PAS avoir bougé
  select count(*) into n
  from pg_default_acl d
  join pg_namespace n2 on n2.oid = d.defaclnamespace
  cross join lateral aclexplode(d.defaclacl) x
  where n2.nspname = 'public'
    and pg_get_userbyid(d.defaclrole) = 'supabase_admin';
  if n <> 48 then
    raise exception '[k3.4] les defaults de supabase_admin ont change (% au lieu de 48)', n;
  end if;

  -- les defaults des autres schémas ne doivent PAS avoir bougé
  select count(*) into n
  from pg_default_acl d
  left join pg_namespace n2 on n2.oid = d.defaclnamespace
  where coalesce(n2.nspname, '') <> 'public';
  if n <> 18 then
    raise exception '[k3.4] les defaults hors public ont change (% entrees au lieu de 18)', n;
  end if;

  ---------------------------------------------------------------- F : existant
  if (select md5(string_agg(c.relname || '=' || coalesce(c.relacl::text, 'NULL'), ';' order by c.relname))
        from pg_class c join pg_namespace n2 on n2.oid = c.relnamespace
       where n2.nspname = 'public' and c.relkind = 'r')
     <> 'c89ff8a23b8ee0141120be6d309ce295' then
    raise exception '[k3.4] l ACL d au moins une des 35 tables a change';
  end if;

  if (select count(*) from pg_class c join pg_namespace n2 on n2.oid = c.relnamespace
       where n2.nspname = 'public' and c.relkind = 'r') <> 35 then
    raise exception '[k3.4] le nombre de tables de public a change';
  end if;

  if (select count(*) from pg_class c join pg_namespace n2 on n2.oid = c.relnamespace
       where n2.nspname = 'public' and c.relkind = 'r' and c.relrowsecurity) <> 35 then
    raise exception '[k3.4] RLS n est plus actif sur les 35 tables';
  end if;

  if (select count(*) from pg_policies where schemaname = 'public') <> 37 then
    raise exception '[k3.4] le nombre de policies a change';
  end if;

  if (select md5(string_agg(tablename || '.' || policyname || '|' || cmd || '|' || roles::text || '|' ||
                            coalesce(qual, '') || '|' || coalesce(with_check, ''), ';' order by tablename, policyname))
        from pg_policies where schemaname = 'public')
     <> '713241be63215b12d4f91f7788aa446d' then
    raise exception '[k3.4] la definition d au moins une policy a change';
  end if;

  if (select count(*) from pg_attribute a
       where a.attrelid = 'public.profiles'::regclass and a.attacl is not null) <> 13 then
    raise exception '[k3.4] les 13 grants de colonne de profiles (K.3.2) ont change';
  end if;

  if (select md5(string_agg(p2.proname || '=' || md5(pg_get_functiondef(p2.oid)), ';' order by p2.proname))
        from pg_proc p2 join pg_namespace n2 on n2.oid = p2.pronamespace
       where n2.nspname = 'public')
     <> '2e2c10416c170b1adc2725eb8e2b0e3d' then
    raise exception '[k3.4] au moins une fonction de public a change';
  end if;

  if (select md5(string_agg(c.relname || '.' || t.tgname || '=' || pg_get_triggerdef(t.oid), ';'
                            order by c.relname, t.tgname))
        from pg_trigger t join pg_class c on c.oid = t.tgrelid
        join pg_namespace n2 on n2.oid = c.relnamespace
       where n2.nspname = 'public' and not t.tgisinternal)
     <> 'b962c9097b1ba7cdee59ab410440f801' then
    raise exception '[k3.4] au moins un trigger de public a change';
  end if;

  if (select count(*) from pg_class c join pg_namespace n2 on n2.oid = c.relnamespace
       where n2.nspname = 'public' and c.relkind = 'S') <> 0 then
    raise exception '[k3.4] une sequence est apparue dans public';
  end if;

  if (select count(*) from public.profiles) <> 19
     or (select count(*) from auth.users) <> 19
     or (select count(*) from public.subscriptions) <> 5 then
    raise exception '[k3.4] les volumes de donnees ont change';
  end if;

  raise notice '[k3.4] defaults TABLES/SEQUENCES/FUNCTIONS retires a anon et authenticated ; service_role et postgres intacts ; 35 tables, 37 policies, 13 grants de colonne, fonctions, triggers et donnees inchanges';
end
$k34$;

commit;
