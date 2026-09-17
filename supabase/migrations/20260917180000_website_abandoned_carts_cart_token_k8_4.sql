-- Phase 05-K8.4 — finding K8-03 : jeton de panier anonyme (etape A, ADDITIVE).
--
-- POURQUOI. L'audit K8.2 a etabli que la seule preuve de propriete d'une ligne
-- de `abandoned_carts` est la CONNAISSANCE DE L'ADRESSE E-MAIL : la cle primaire
-- est l'adresse elle-meme, il n'existe ni user_id, ni jeton, ni cle etrangere.
-- Quiconque connait une adresse peut donc remplacer le panier de son titulaire
-- et, parce que l'upsert remet `reminder_sent` et `recovered` a false,
-- REARMER un rappel deja envoye — puis declencher un nouvel e-mail Xenotif vers
-- cette adresse au cycle suivant.
--
-- CE QUE CETTE MIGRATION FAIT. Elle ajoute une capability secrete, generee par
-- le navigateur et independante de l'adresse : `cart_token`. Elle ajoute aussi
-- une cle de substitution `id`, conformement au motif deja retenu pour
-- `boutique_orders` (id PK + UNIQUE(stripe_session_id)).
--
-- CE QU'ELLE NE FAIT PAS, DELIBEREMENT. Elle NE bascule PAS la cle primaire :
-- `email` reste PK. La migration est donc strictement ADDITIVE et l'ancien code
-- — qui fait `upsert ... onConflict:'email'` — continue de fonctionner a
-- l'identique. La bascule vers `id` PRIMARY KEY appartient a une migration
-- SEPAREE (etape G), a n'appliquer qu'une fois le nouveau code deploye.
--
-- CONSEQUENCE A CONNAITRE PENDANT LA TRANSITION : tant que `email` est PK, deux
-- paniers distincts pour une meme adresse restent IMPOSSIBLES. Le nouveau code
-- traite le 23505 correspondant explicitement plutot que de le laisser remonter
-- en erreur 500.
--
-- REVERSIBILITE : `drop column cart_token, drop column id` suffit a revenir en
-- arriere ; aucune donnee existante n'est modifiee ni supprimee.

begin;

alter table public.abandoned_carts
  add column if not exists id         uuid default gen_random_uuid(),
  add column if not exists cart_token uuid;

-- Backfill : chaque ligne existante recoit ses identifiants. `gen_random_uuid()`
-- est evalue par ligne, les valeurs sont donc distinctes.
update public.abandoned_carts set id         = gen_random_uuid() where id is null;
update public.abandoned_carts set cart_token = gen_random_uuid() where cart_token is null;

alter table public.abandoned_carts
  alter column id         set not null,
  alter column cart_token set not null;

-- L'unicite du jeton est ce qui en fait une capability : deux paniers ne
-- peuvent pas partager la meme autorisation.
do $uniq$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.abandoned_carts'::regclass
      and conname = 'abandoned_carts_cart_token_key'
  ) then
    alter table public.abandoned_carts
      add constraint abandoned_carts_cart_token_key unique (cart_token);
  end if;
end
$uniq$;

-- Le cron selectionne par (reminder_sent, recovered, updated_at) — index deja
-- present — puis regroupe par adresse pour dedupliquer les rappels.
create index if not exists idx_abandoned_carts_email
  on public.abandoned_carts (email);

do $k84$
declare
  n            int;
  lignes       int;
  distincts    int;
  pk_colonne   text;
begin
  ------------------------------------------------------- les donnees existantes
  select count(*) into lignes from public.abandoned_carts;
  if lignes <> 2 then
    raise notice '[k8.4] % ligne(s) dans abandoned_carts (2 au moment de la conception)', lignes;
  end if;

  -- Aucune ligne ne doit avoir perdu ses identifiants ni ses valeurs metier.
  select count(*) into n from public.abandoned_carts where cart_token is null or id is null;
  if n <> 0 then
    raise exception '[k8.4] % ligne(s) sans identifiant apres backfill', n;
  end if;

  select count(distinct cart_token) into distincts from public.abandoned_carts;
  if distincts <> lignes then
    raise exception '[k8.4] jetons non uniques : % distincts pour % lignes', distincts, lignes;
  end if;

  select count(distinct id) into distincts from public.abandoned_carts;
  if distincts <> lignes then
    raise exception '[k8.4] identifiants non uniques : % distincts pour % lignes', distincts, lignes;
  end if;

  ------------------------------------------------------------ les contraintes
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.abandoned_carts'::regclass
      and conname = 'abandoned_carts_cart_token_key' and contype = 'u'
  ) then
    raise exception '[k8.4] la contrainte d unicite sur cart_token est absente';
  end if;

  -- La cle primaire DOIT rester `email` a ce stade : la bascule appartient a
  -- l'etape G. Si elle avait deja bouge, le code de transition serait invalide.
  select string_agg(a.attname, ',' order by a.attnum) into pk_colonne
  from pg_constraint c
  join pg_attribute a on a.attrelid = c.conrelid and a.attnum = any(c.conkey)
  where c.conrelid = 'public.abandoned_carts'::regclass and c.contype = 'p';

  if pk_colonne is distinct from 'email' then
    raise exception '[k8.4] la cle primaire vaut % au lieu de email — la bascule G a-t-elle deja eu lieu ?', pk_colonne;
  end if;

  ------------------------------------------------- les colonnes d origine
  -- Aucune des huit colonnes existantes ne doit avoir disparu ni change de type.
  select count(*) into n
  from pg_attribute a
  where a.attrelid = 'public.abandoned_carts'::regclass
    and a.attnum > 0 and not a.attisdropped
    and a.attname in ('email','items','reminder_sent','recovered','reminded_at','updated_at','created_at','locale');
  if n <> 8 then
    raise exception '[k8.4] % colonne(s) d origine sur 8 retrouvee(s)', n;
  end if;

  ------------------------------------------------------------------ acquis
  if to_regclass('public.rate_limits') is null then
    raise exception '[k8.4] la table rate_limits (K.5) a disparu';
  end if;

  select count(*) into n
  from pg_default_acl d
  join pg_namespace n2 on n2.oid = d.defaclnamespace
  cross join lateral aclexplode(d.defaclacl) x
  where n2.nspname = 'public'
    and pg_get_userbyid(d.defaclrole) = 'postgres'
    and pg_get_userbyid(x.grantee) in ('anon', 'authenticated');
  if n <> 0 then
    raise exception '[k8.4] % default privilege(s) dangereux detecte(s)', n;
  end if;

  -- anon et authenticated ne doivent toujours detenir AUCUN privilege ici.
  select count(*) into n
  from information_schema.role_table_grants
  where table_schema = 'public' and table_name = 'abandoned_carts'
    and grantee in ('anon', 'authenticated');
  if n <> 0 then
    raise exception '[k8.4] % privilege(s) anon/authenticated sur abandoned_carts', n;
  end if;

  raise notice '[k8.4] cart_token et id ajoutes : % ligne(s), jetons uniques, PK toujours email, 8 colonnes d origine intactes', lignes;
end
$k84$;

commit;
