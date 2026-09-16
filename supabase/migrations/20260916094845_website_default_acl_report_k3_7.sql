-- Phase 05-K.3.7-bis — RPC de diagnostic des default privileges dangereux.
--
-- POURQUOI CETTE FONCTION EXISTE
-- K.3.4 a neutralise les default privileges de anon et authenticated sur le
-- schema public (createur postgres). K.3.5 a confirme un chemin de regression :
-- XenotifFitness/packages/db/src/schema.sql ligne 2 contient un
-- `alter default privileges in schema public grant all on tables to postgres,
-- anon, authenticated, service_role` executable, que DEPLOYMENT.md prescrit
-- toujours d'appliquer. Une reexecution retablirait le comportement dangereux
-- SANS AUCUN SIGNAL.
--
-- K.3.7 a bute sur un obstacle technique : scripts/check-environment.mjs, qui
-- s'execute a chaque build Vercel, n'a aucun acces PostgreSQL, et pg_default_acl
-- vit dans pg_catalog — que PostgREST n'expose jamais. Meme la cle service_role
-- ne permet pas de le lire par l'API REST.
--
-- Cette fonction est le pont : un point de lecture, et rien d'autre, appelable
-- en RPC par le seul service_role.
--
-- LECTURE SEULE PAR CONSTRUCTION, PAS PAR CONVENTION
--   - `language sql` : aucun bloc procedural, donc aucun EXECUTE dynamique.
--   - `stable` : PostgreSQL REFUSE toute ecriture dans une fonction stable.
--     Ce n'est pas une promesse de l'auteur, c'est une contrainte du moteur.
--   - Le corps est un unique SELECT sur des catalogues systeme.
--
-- SECURITE (patron etabli en 05-K.3.1)
--   - SECURITY DEFINER, proprietaire postgres ;
--   - search_path fige a pg_catalog — toutes les references utilisees
--     (pg_default_acl, pg_namespace, aclexplode, pg_get_userbyid) y resident,
--     donc aucun detournement par un schema tiers n'est possible ;
--   - EXECUTE retire a PUBLIC, anon et authenticated, accorde au seul
--     service_role. Precaution NECESSAIRE et non decorative : en Preview, le
--     default privilege FUNCTION accorde encore EXECUTE a anon et authenticated,
--     si bien que la fonction y naitrait ouverte sans cette revocation.
--
-- PERIMETRE DU RAPPORT, conforme a l'audit 05-K.3.6
--   - createur : postgres UNIQUEMENT. Les 24 privileges de supabase_admin sur
--     public sont volontairement IGNORES : ils sont hors d'atteinte de postgres
--     (non superutilisateur, non membre de ce role) et hors politique K.3.4.
--   - schema : public UNIQUEMENT.
--   - beneficiaires signales : anon et authenticated UNIQUEMENT. postgres et
--     service_role sont legitimes et ne doivent jamais declencher d'alerte.
--
-- CE QUE CETTE FONCTION NE FAIT PAS : elle ne corrige rien, ne modifie aucun
-- privilege, aucune policy, aucune donnee. C'est un capteur, pas un correcteur.

begin;

create or replace function public.security_default_acl_report()
returns table (
  owner_role  text,
  schema_name text,
  object_type text,
  grantee     text,
  privilege   text
)
language sql
stable
security definer
set search_path = pg_catalog
as $fn$
  select
    pg_get_userbyid(d.defaclrole)::text as owner_role,
    n.nspname::text                     as schema_name,
    case d.defaclobjtype
      when 'r' then 'TABLE'
      when 'S' then 'SEQUENCE'
      when 'f' then 'FUNCTION'
      when 'T' then 'TYPE'
      when 'n' then 'SCHEMA'
      else d.defaclobjtype::text
    end                                 as object_type,
    pg_get_userbyid(x.grantee)::text    as grantee,
    x.privilege_type::text              as privilege
  from pg_default_acl d
  join pg_namespace n on n.oid = d.defaclnamespace
  cross join lateral aclexplode(d.defaclacl) x
  where n.nspname = 'public'
    and pg_get_userbyid(d.defaclrole) = 'postgres'
    and pg_get_userbyid(x.grantee) in ('anon', 'authenticated')
  order by 3, 4, 5;
$fn$;

revoke all on function public.security_default_acl_report() from public, anon, authenticated;
grant execute on function public.security_default_acl_report() to service_role;

do $k37$
declare
  v_oid oid;
  n int;
begin
  ---------------------------------------------------------- la fonction existe
  select p.oid into v_oid
  from pg_proc p join pg_namespace ns on ns.oid = p.pronamespace
  where ns.nspname = 'public' and p.proname = 'security_default_acl_report'
    and p.pronargs = 0;
  if v_oid is null then
    raise exception '[k3.7] la fonction security_default_acl_report est absente';
  end if;

  ------------------------------------------------------- proprietes de securite
  if not (select p.prosecdef from pg_proc p where p.oid = v_oid) then
    raise exception '[k3.7] la fonction n est pas SECURITY DEFINER';
  end if;

  if (select p.provolatile from pg_proc p where p.oid = v_oid) <> 's' then
    raise exception '[k3.7] la fonction n est pas STABLE — l ecriture ne serait plus interdite par le moteur';
  end if;

  if (select p.prolang from pg_proc p where p.oid = v_oid)
     <> (select l.oid from pg_language l where l.lanname = 'sql') then
    raise exception '[k3.7] la fonction n est pas en language sql — du SQL dynamique redeviendrait possible';
  end if;

  if coalesce((select array_to_string(p.proconfig, ',') from pg_proc p where p.oid = v_oid), '')
     not like '%search_path=pg_catalog%' then
    raise exception '[k3.7] le search_path n est pas fige a pg_catalog';
  end if;

  if (select pg_get_userbyid(p.proowner) from pg_proc p where p.oid = v_oid) <> 'postgres' then
    raise exception '[k3.7] la fonction n appartient pas a postgres';
  end if;

  ------------------------------------------------------------------ ACL stricte
  if has_function_privilege('anon', v_oid, 'EXECUTE') then
    raise exception '[k3.7] anon peut EXECUTE la fonction';
  end if;
  if has_function_privilege('authenticated', v_oid, 'EXECUTE') then
    raise exception '[k3.7] authenticated peut EXECUTE la fonction';
  end if;
  if not has_function_privilege('service_role', v_oid, 'EXECUTE') then
    raise exception '[k3.7] service_role ne peut pas EXECUTE la fonction';
  end if;
  if (select p.proacl::text from pg_proc p where p.oid = v_oid) like '%=X/%'
     and (select p.proacl::text from pg_proc p where p.oid = v_oid) like '%"=X%' then
    raise exception '[k3.7] EXECUTE est encore accorde a PUBLIC';
  end if;

  --------------------------------------------- auto-coherence du rapport produit
  -- Le resultat de la fonction doit etre rigoureusement identique a la requete
  -- directe equivalente. Portable : on compare deux mesures du meme etat, sans
  -- presumer d'une valeur absolue, qui differe entre Preview et Production.
  select count(*) into n from (
    select owner_role, schema_name, object_type, grantee, privilege
      from public.security_default_acl_report()
    except
    select pg_get_userbyid(d.defaclrole)::text, n2.nspname::text,
           case d.defaclobjtype when 'r' then 'TABLE' when 'S' then 'SEQUENCE'
                when 'f' then 'FUNCTION' when 'T' then 'TYPE' when 'n' then 'SCHEMA'
                else d.defaclobjtype::text end,
           pg_get_userbyid(x.grantee)::text, x.privilege_type::text
      from pg_default_acl d
      join pg_namespace n2 on n2.oid = d.defaclnamespace
      cross join lateral aclexplode(d.defaclacl) x
     where n2.nspname = 'public'
       and pg_get_userbyid(d.defaclrole) = 'postgres'
       and pg_get_userbyid(x.grantee) in ('anon', 'authenticated')
  ) ecart;
  if n <> 0 then
    raise exception '[k3.7] le rapport diverge de la requete directe : % ligne(s) en trop', n;
  end if;

  ------------------------------------------- aucun beneficiaire hors perimetre
  select count(*) into n
  from public.security_default_acl_report()
  where grantee not in ('anon', 'authenticated')
     or owner_role <> 'postgres'
     or schema_name <> 'public';
  if n <> 0 then
    raise exception '[k3.7] le rapport contient % ligne(s) hors perimetre', n;
  end if;

  raise notice '[k3.7] security_default_acl_report creee : SECURITY DEFINER, stable, language sql, search_path=pg_catalog, EXECUTE reserve a service_role ; rapport auto-coherent et limite a postgres/public/anon+authenticated';
end
$k37$;

commit;
