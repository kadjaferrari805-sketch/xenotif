-- Phase 05-K.5 — compteurs de limitation de debit des endpoints publics.
--
-- POURQUOI CETTE TABLE EXISTE
-- L'audit K.4 a releve (F-01, P1) que /api/subscribe permet a un tiers non
-- authentifie de faire emettre des e-mails depuis noreply@xenotif.com vers des
-- adresses arbitraires : aucune limitation, aucun captcha, aucun honeypot.
-- F-02 (/api/contact), F-03 (/api/boutique/save-cart) et F-10 (/api/free-program)
-- partagent la meme cause.
--
-- Le depot ne possedait AUCUN stockage distribue (0 Upstash, 0 Vercel KV,
-- 0 Redis). Plutot que d'introduire un fournisseur externe — nouveau service,
-- nouveau secret, provisioning manuel — on reutilise Postgres, deja en place et
-- deja joint en service_role par trois des quatre routes concernees.
--
-- POURQUOI UNE FONCTION ET PAS UN SIMPLE UPSERT APPLICATIF
-- Compter cote application (lire puis ecrire) est contournable par rafale :
-- deux requetes simultanees lisent le meme compteur et passent toutes les deux.
-- `rate_limit_hit` fait l'upsert et l'increment en UNE instruction : l'atomicite
-- est garantie par le moteur, pas par une convention.
--
-- SECURITE (patron etabli en 05-K.3.1, repris en 05-K.3.7)
--   - SECURITY DEFINER, proprietaire postgres ;
--   - search_path fige a pg_catalog, public — `rate_limits` vit dans public,
--     les fonctions utilisees (now, clock_timestamp) dans pg_catalog ;
--   - EXECUTE retire a PUBLIC, anon et authenticated, accorde au seul
--     service_role : un client navigateur ne peut ni lire ni fausser un compteur.
--   - La table porte RLS sans aucune policy : anon et authenticated n'y ont
--     aucun acces, et aucun GRANT ne leur est accorde.
--
-- CE QUE CETTE MIGRATION NE FAIT PAS : elle ne touche a aucune table, policy,
-- fonction, trigger ou grant existant. Elle n'accorde rien a anon ni a
-- authenticated. Elle ne modifie aucun default privilege (acquis K.3.4).

begin;

create table if not exists public.rate_limits (
  bucket       text        primary key,
  hit_count    integer     not null default 0,
  window_start timestamptz not null default now()
);

alter table public.rate_limits enable row level security;

-- Purge des fenetres expirees : index partiel sur la date de debut.
create index if not exists rate_limits_window_start_idx
  on public.rate_limits (window_start);

revoke all on table public.rate_limits from public, anon, authenticated;
grant select, insert, update, delete on table public.rate_limits to service_role;

create or replace function public.rate_limit_hit(
  p_bucket         text,
  p_window_seconds integer
)
returns table (hit_count integer, reset_at timestamptz)
language plpgsql
volatile
security definer
set search_path = pg_catalog, public
as $fn$
declare
  v_now      timestamptz := now();
  v_window   interval;
  v_count    integer;
  v_start    timestamptz;
begin
  if p_bucket is null or length(p_bucket) = 0 or length(p_bucket) > 200 then
    raise exception '[k5] bucket invalide';
  end if;
  if p_window_seconds is null or p_window_seconds < 1 or p_window_seconds > 86400 then
    raise exception '[k5] fenetre invalide';
  end if;

  v_window := make_interval(secs => p_window_seconds);

  -- Fenetre fixe : on remet le compteur a 1 si la fenetre courante est expiree,
  -- sinon on incremente. L'upsert est atomique — deux appels concourants ne
  -- peuvent pas obtenir le meme compteur.
  insert into public.rate_limits as r (bucket, hit_count, window_start)
  values (p_bucket, 1, v_now)
  on conflict (bucket) do update
    set hit_count    = case when r.window_start + v_window <= v_now then 1 else r.hit_count + 1 end,
        window_start = case when r.window_start + v_window <= v_now then v_now else r.window_start end
  returning r.hit_count, r.window_start into v_count, v_start;

  hit_count := v_count;
  reset_at  := v_start + v_window;
  return next;
end;
$fn$;

revoke all on function public.rate_limit_hit(text, integer) from public, anon, authenticated;
grant execute on function public.rate_limit_hit(text, integer) to service_role;

do $k5$
declare
  v_oid oid;
  n int;
begin
  ------------------------------------------------------------------ la table
  if to_regclass('public.rate_limits') is null then
    raise exception '[k5] la table rate_limits est absente';
  end if;

  if not (select c.relrowsecurity from pg_class c where c.oid = 'public.rate_limits'::regclass) then
    raise exception '[k5] RLS n est pas actif sur rate_limits';
  end if;

  if (select count(*) from pg_policies where schemaname = 'public' and tablename = 'rate_limits') <> 0 then
    raise exception '[k5] rate_limits ne doit porter aucune policy';
  end if;

  select count(*) into n
  from pg_class c
  where c.oid = 'public.rate_limits'::regclass
    and (has_table_privilege('anon', c.oid, 'SELECT')
      or has_table_privilege('anon', c.oid, 'INSERT')
      or has_table_privilege('anon', c.oid, 'UPDATE')
      or has_table_privilege('anon', c.oid, 'DELETE')
      or has_table_privilege('authenticated', c.oid, 'SELECT')
      or has_table_privilege('authenticated', c.oid, 'INSERT')
      or has_table_privilege('authenticated', c.oid, 'UPDATE')
      or has_table_privilege('authenticated', c.oid, 'DELETE'));
  if n <> 0 then
    raise exception '[k5] anon ou authenticated detient un privilege sur rate_limits';
  end if;

  if not has_table_privilege('service_role', 'public.rate_limits', 'SELECT')
     or not has_table_privilege('service_role', 'public.rate_limits', 'INSERT')
     or not has_table_privilege('service_role', 'public.rate_limits', 'UPDATE') then
    raise exception '[k5] service_role ne peut pas utiliser rate_limits';
  end if;

  ---------------------------------------------------------------- la fonction
  select p.oid into v_oid
  from pg_proc p join pg_namespace ns on ns.oid = p.pronamespace
  where ns.nspname = 'public' and p.proname = 'rate_limit_hit' and p.pronargs = 2;
  if v_oid is null then
    raise exception '[k5] la fonction rate_limit_hit est absente';
  end if;

  if not (select p.prosecdef from pg_proc p where p.oid = v_oid) then
    raise exception '[k5] rate_limit_hit n est pas SECURITY DEFINER';
  end if;

  if (select pg_get_userbyid(p.proowner) from pg_proc p where p.oid = v_oid) <> 'postgres' then
    raise exception '[k5] rate_limit_hit n appartient pas a postgres';
  end if;

  if coalesce((select array_to_string(p.proconfig, ',') from pg_proc p where p.oid = v_oid), '')
     not like '%search_path=pg_catalog, public%' then
    raise exception '[k5] le search_path de rate_limit_hit n est pas fige';
  end if;

  if has_function_privilege('anon', v_oid, 'EXECUTE') then
    raise exception '[k5] anon peut EXECUTE rate_limit_hit';
  end if;
  if has_function_privilege('authenticated', v_oid, 'EXECUTE') then
    raise exception '[k5] authenticated peut EXECUTE rate_limit_hit';
  end if;
  if not has_function_privilege('service_role', v_oid, 'EXECUTE') then
    raise exception '[k5] service_role ne peut pas EXECUTE rate_limit_hit';
  end if;

  ------------------------------------------- acquis des phases precedentes
  -- Aucun default privilege dangereux ne doit avoir reapparu (K.3.4 / K.3.7).
  select count(*) into n
  from pg_default_acl d
  join pg_namespace n2 on n2.oid = d.defaclnamespace
  cross join lateral aclexplode(d.defaclacl) x
  where n2.nspname = 'public'
    and pg_get_userbyid(d.defaclrole) = 'postgres'
    and pg_get_userbyid(x.grantee) in ('anon', 'authenticated');
  if n <> 0 then
    raise exception '[k5] % default privilege(s) dangereux detecte(s) — voir K.3.4', n;
  end if;

  raise notice '[k5] rate_limits creee : RLS actif, aucune policy, aucun privilege anon/authenticated ; rate_limit_hit SECURITY DEFINER, search_path fige, EXECUTE reserve a service_role';
end
$k5$;

commit;
