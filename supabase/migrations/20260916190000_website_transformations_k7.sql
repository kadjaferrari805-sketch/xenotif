-- Phase 05-K.7 — restauration de « transformations avant/apres ».
--
-- POURQUOI CETTE MIGRATION EXISTE
-- L'audit K.7 a etabli que le code de la fonctionnalite est COMPLET et MONTE :
-- TransformationForm est rendu par ProgressionClient, AdminTransformations par
-- la page admin, et deux routes API service_role les servent. Seul le socle de
-- donnees manque : la table public.transformations n'a jamais ete creee et le
-- bucket Storage « transformations » n'a jamais existe. Le fichier historique
-- supabase-transformations.sql portait le schema mais n'a jamais ete applique,
-- et son en-tete demandait une creation MANUELLE du bucket via le Dashboard —
-- etape qui n'a jamais eu lieu. La fonctionnalite est donc morte en production.
--
-- CETTE MIGRATION NE CHANGE PAS LE SCHEMA HISTORIQUE. Les 10 colonnes, leurs
-- types, leurs contraintes NOT NULL, leurs valeurs par defaut et l'index sont
-- repris a l'identique de supabase-transformations.sql. On ne profite pas de
-- l'occasion pour « ameliorer » le modele : la prudence prime.
--
-- MODELE D'ACCES (inchange par rapport a l'intention d'origine)
--   - RLS active, AUCUNE policy : anon et authenticated n'ont aucun chemin de
--     lecture ou d'ecriture directe, meme si un GRANT reapparaissait par erreur.
--   - Aucun GRANT a public, anon ou authenticated ; service_role seul detient
--     SELECT/INSERT/UPDATE/DELETE. Les deux routes API sont l'unique porte, et
--     elles portent l'authentification, la moderation et la limitation K.5.
--   - RLS + absence de GRANT sont deux verrous independants : c'est voulu.
--
-- LE BUCKET. Sa creation par migration reprend le patron deja valide sur
-- program-covers (XenotifFitness/packages/db/migrations). La sonde de capacite
-- de la phase D a confirme que le role `postgres` — celui qui applique les
-- migrations — detient un INSERT explicite sur storage.buckets et peut creer
-- une policy sur storage.objects, sans passer par supabase_storage_admin.
-- Aucune intervention manuelle au Dashboard n'est donc necessaire.
--
-- UNE SEULE POLICY STORAGE, EN LECTURE. Les televersements passent par
-- service_role, qui contourne RLS : aucune policy d'ecriture n'est requise.
-- N'accorder que la lecture publique evite d'ouvrir un chemin d'ecriture que
-- personne n'utiliserait.
--
-- CE QUE CETTE MIGRATION NE FAIT PAS. Elle ne touche a aucune table, policy,
-- fonction, trigger ou grant existant. Elle ne modifie aucun autre bucket. Elle
-- ne touche ni aux compteurs K.5 ni aux revocations K.6. Elle n'introduit aucun
-- secret et ne modifie aucun default privilege (acquis K.3.4 / K.3.7).

begin;

create table if not exists public.transformations (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null,
  display_name text,
  before_path  text not null,
  after_path   text not null,
  caption      text,
  weeks        int,
  consent      boolean not null default false,
  status       text not null default 'pending',   -- pending | approved | rejected
  created_at   timestamptz default now()
);

-- Sert la lecture publique (status = 'approved', created_at desc) comme la file
-- de moderation (status = 'pending', created_at desc) : un seul index couvre
-- les deux acces de l'application.
create index if not exists transformations_status_idx
  on public.transformations (status, created_at desc);

alter table public.transformations enable row level security;

revoke all on table public.transformations from public, anon, authenticated;
grant select, insert, update, delete on table public.transformations to service_role;

-- ------------------------------------------------------------------ Storage
-- Bucket public : les URL rendues par getPublicUrl doivent etre lisibles sans
-- jeton par n'importe quel visiteur de la galerie.
insert into storage.buckets (id, name, public)
values ('transformations', 'transformations', true)
on conflict (id) do nothing;

-- `create policy` n'accepte pas `if not exists` : on garde l'idempotence de la
-- migration en verifiant d'abord le catalogue.
do $pol$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'Transformations are publicly accessible'
  ) then
    execute 'create policy "Transformations are publicly accessible" on storage.objects
               for select using (bucket_id = ''transformations'')';
  end if;
end
$pol$;

-- ------------------------------------------------------- assertions de garde
-- Elles portent sur les INVARIANTS, pas sur des comptes globaux : une assertion
-- du type « il doit y avoir exactement 37 tables » echouerait sur tout projet
-- dont l'etat differe legitimement (Preview, par exemple). Le passage 36 -> 37
-- est verifie par la simulation en transaction annulee, ou le point de depart
-- est connu ; ici on verifie ce qui doit etre vrai partout.
do $k7$
declare
  v_cols text;
  n int;
begin
  ------------------------------------------------------------------ la table
  if to_regclass('public.transformations') is null then
    raise exception '[k7] la table transformations est absente';
  end if;

  select string_agg(a.attname, ',' order by a.attnum) into v_cols
  from pg_attribute a
  where a.attrelid = 'public.transformations'::regclass
    and a.attnum > 0 and not a.attisdropped;

  if v_cols <> 'id,user_id,display_name,before_path,after_path,caption,weeks,consent,status,created_at' then
    raise exception '[k7] schema inattendu pour transformations : %', v_cols;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.transformations'::regclass and contype = 'p'
  ) then
    raise exception '[k7] transformations n a pas de cle primaire';
  end if;

  if not exists (
    select 1 from pg_indexes
    where schemaname = 'public' and tablename = 'transformations'
      and indexname = 'transformations_status_idx'
  ) then
    raise exception '[k7] l index transformations_status_idx est absent';
  end if;

  if not (select c.relrowsecurity from pg_class c where c.oid = 'public.transformations'::regclass) then
    raise exception '[k7] RLS n est pas actif sur transformations';
  end if;

  if (select count(*) from pg_policies
      where schemaname = 'public' and tablename = 'transformations') <> 0 then
    raise exception '[k7] transformations ne doit porter aucune policy';
  end if;

  ------------------------------------------------------------------ les acces
  select count(*) into n
  from pg_class c
  where c.oid = 'public.transformations'::regclass
    and (has_table_privilege('anon', c.oid, 'SELECT')
      or has_table_privilege('anon', c.oid, 'INSERT')
      or has_table_privilege('anon', c.oid, 'UPDATE')
      or has_table_privilege('anon', c.oid, 'DELETE')
      or has_table_privilege('authenticated', c.oid, 'SELECT')
      or has_table_privilege('authenticated', c.oid, 'INSERT')
      or has_table_privilege('authenticated', c.oid, 'UPDATE')
      or has_table_privilege('authenticated', c.oid, 'DELETE'));
  if n <> 0 then
    raise exception '[k7] anon ou authenticated detient un privilege sur transformations';
  end if;

  if not has_table_privilege('service_role', 'public.transformations', 'SELECT')
     or not has_table_privilege('service_role', 'public.transformations', 'INSERT')
     or not has_table_privilege('service_role', 'public.transformations', 'UPDATE')
     or not has_table_privilege('service_role', 'public.transformations', 'DELETE') then
    raise exception '[k7] service_role ne peut pas exploiter transformations';
  end if;

  ----------------------------------------------------------------- le Storage
  if not exists (select 1 from storage.buckets where id = 'transformations') then
    raise exception '[k7] le bucket transformations est absent';
  end if;

  if not (select public from storage.buckets where id = 'transformations') then
    raise exception '[k7] le bucket transformations n est pas public';
  end if;

  select count(*) into n
  from pg_policies
  where schemaname = 'storage' and tablename = 'objects'
    and qual like '%transformations%';
  if n <> 1 then
    raise exception '[k7] % policy(s) storage visent le bucket transformations, 1 attendue', n;
  end if;

  -- La policy creee est en LECTURE seule : aucune ecriture directe n'est ouverte.
  if exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'Transformations are publicly accessible'
      and cmd <> 'SELECT'
  ) then
    raise exception '[k7] la policy storage transformations n est pas en lecture seule';
  end if;

  ------------------------------------------- acquis des phases precedentes
  -- K.5 : les compteurs de limitation doivent etre intacts — la route POST
  -- restauree s'appuie dessus.
  if to_regclass('public.rate_limits') is null then
    raise exception '[k7] la table rate_limits (K.5) a disparu';
  end if;
  if not (select c.relrowsecurity from pg_class c where c.oid = 'public.rate_limits'::regclass) then
    raise exception '[k7] RLS n est plus actif sur rate_limits (K.5)';
  end if;
  if not exists (
    select 1 from pg_proc p join pg_namespace ns on ns.oid = p.pronamespace
    where ns.nspname = 'public' and p.proname = 'rate_limit_hit' and p.pronargs = 2
  ) then
    raise exception '[k7] la fonction rate_limit_hit (K.5) a disparu';
  end if;

  -- K.3.4 / K.3.7 : aucun default privilege dangereux ne doit avoir reapparu.
  select count(*) into n
  from pg_default_acl d
  join pg_namespace n2 on n2.oid = d.defaclnamespace
  cross join lateral aclexplode(d.defaclacl) x
  where n2.nspname = 'public'
    and pg_get_userbyid(d.defaclrole) = 'postgres'
    and pg_get_userbyid(x.grantee) in ('anon', 'authenticated');
  if n <> 0 then
    raise exception '[k7] % default privilege(s) dangereux detecte(s) — voir K.3.4', n;
  end if;

  ------------------------------------------------------------------ rapport
  select count(*) into n from pg_class c
  join pg_namespace ns on ns.oid = c.relnamespace
  where ns.nspname = 'public' and c.relkind = 'r';
  raise notice '[k7] transformations creee : RLS actif, 0 policy, 0 privilege anon/authenticated, service_role SIUD ; bucket public + 1 policy de lecture ; % tables dans public', n;
end
$k7$;

commit;
