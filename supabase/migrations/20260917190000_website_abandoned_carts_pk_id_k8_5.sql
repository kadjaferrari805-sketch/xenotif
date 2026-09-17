-- Phase 05-K8.5 — finding K8-03 (etape G) : bascule de la cle primaire.
--
-- POURQUOI. K8.4 a ajoute `id` et `cart_token` de facon strictement ADDITIVE, en
-- laissant `email` cle primaire. Tant que c'est le cas, deux paniers distincts
-- pour une meme adresse restent IMPOSSIBLES : un visiteur qui commande depuis
-- deux appareils, ou dont le localStorage a ete vide, voit sa seconde tentative
-- refusee en 23505. Le jeton ne peut donc pas jouer son role.
--
-- CE QUE CETTE MIGRATION FAIT. Elle deplace la cle primaire de `email` vers
-- `id`, et rien d'autre. `email` reste NOT NULL mais cesse d'etre unique :
-- plusieurs paniers peuvent desormais coexister pour une meme adresse, chacun
-- identifie par son propre `cart_token`.
--
-- CE QU'ELLE NE FAIT PAS. Elle ne touche ni aux donnees, ni aux colonnes, ni aux
-- grants, ni a RLS, ni aux policies, ni aux triggers, ni aux index secondaires.
-- `UNIQUE(cart_token)` est conservee telle quelle : c'est elle qui fait du jeton
-- une capability.
--
-- REVERSIBILITE — A LIRE AVANT TOUTE TENTATIVE DE ROLLBACK.
-- Le retour structurel vers `PRIMARY KEY (email)` n'est PAS garanti. Il n'est
-- possible que tant qu'aucune adresse ne porte deux paniers :
--
--   select count(*) from (
--     select lower(email) from public.abandoned_carts group by 1 having count(*) > 1
--   ) s;   -- doit valoir 0
--
-- Des le premier doublon, restaurer PK(email) exigerait de SUPPRIMER ou FUSIONNER
-- des lignes : ce n'est plus un rollback, c'est une migration destructrice. Le
-- rollback recommande est LOGIQUE — redeployer le code precedent en laissant
-- PK(id) en place. Le schema cible est strictement plus permissif que l'ancien :
-- l'ancien code fonctionne dessus tant qu'aucun doublon n'existe, et le seul
-- chemin qui en cree est /api/boutique/save-cart, que le redeploiement neutralise.
--
-- Toute garde ci-dessous qui echoue annule l'integralite de la transaction.

begin;

-- ─────────────────────────────────────────────────────────────────────────────
-- ETAPE 1 — PRECONDITIONS (controles 1 a 5), AVANT toute modification.
-- ─────────────────────────────────────────────────────────────────────────────
do $pre$
declare
  n  int;
  pk text;
begin
  -- (1) id renseigne sur toutes les lignes, ET declare NOT NULL.
  select count(*) into n from public.abandoned_carts where id is null;
  if n <> 0 then
    raise exception '[k8.5] % ligne(s) avec id null — backfill K8.4 incomplet', n;
  end if;
  if (select is_nullable from information_schema.columns
       where table_schema = 'public' and table_name = 'abandoned_carts' and column_name = 'id') <> 'NO' then
    raise exception '[k8.5] la colonne id n est pas declaree NOT NULL';
  end if;

  -- (2) id unique. Une PK sur une colonne non unique echouerait de toute facon,
  -- mais le message serait celui de Postgres : on prefere le notre.
  select count(*) into n
  from (select id from public.abandoned_carts group by id having count(*) > 1) s;
  if n <> 0 then
    raise exception '[k8.5] id non unique : % valeur(s) en double', n;
  end if;

  -- (3) cart_token renseigne partout, ET declare NOT NULL.
  select count(*) into n from public.abandoned_carts where cart_token is null;
  if n <> 0 then
    raise exception '[k8.5] % ligne(s) avec cart_token null', n;
  end if;
  if (select is_nullable from information_schema.columns
       where table_schema = 'public' and table_name = 'abandoned_carts' and column_name = 'cart_token') <> 'NO' then
    raise exception '[k8.5] la colonne cart_token n est pas declaree NOT NULL';
  end if;

  -- (4) cart_token unique — en donnees ET en contrainte.
  select count(*) into n
  from (select cart_token from public.abandoned_carts group by cart_token having count(*) > 1) s;
  if n <> 0 then
    raise exception '[k8.5] cart_token non unique : % valeur(s) en double', n;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.abandoned_carts'::regclass
      and conname = 'abandoned_carts_cart_token_key' and contype = 'u'
  ) then
    raise exception '[k8.5] la contrainte UNIQUE(cart_token) est absente — K8.4 appliquee ?';
  end if;

  -- (5) La cle primaire DOIT encore etre `email` : sinon la bascule a deja eu
  -- lieu, et rejouer cette migration n'aurait aucun sens.
  select string_agg(a.attname, ',' order by a.attnum) into pk
  from pg_constraint c
  join pg_attribute a on a.attrelid = c.conrelid and a.attnum = any(c.conkey)
  where c.conrelid = 'public.abandoned_carts'::regclass and c.contype = 'p';
  if pk is distinct from 'email' then
    raise exception '[k8.5] la cle primaire vaut % au lieu de email — bascule deja effectuee ?', pk;
  end if;
end
$pre$;

-- ─────────────────────────────────────────────────────────────────────────────
-- ETAPE 2 — EMPREINTE COMPLETE AVANT (controle 6).
-- Tout ce qui doit rester identique est fige ici, puis RECOMPARE en etape 4.
-- La comparaison est EXECUTEE, pas argumentee.
-- ─────────────────────────────────────────────────────────────────────────────
create temp table k85_avant on commit drop as
select
  (select count(*) from public.abandoned_carts) as lignes,

  -- Les 10 colonnes, ordonnees par id (stable et unique).
  (select md5(coalesce(string_agg(
            email || '|' || items::text || '|' || reminder_sent::text || '|' || recovered::text || '|'
         || coalesce(reminded_at::text, '-') || '|' || created_at::text || '|' || updated_at::text || '|'
         || locale || '|' || id::text || '|' || cart_token::text, '#' order by id), ''))
     from public.abandoned_carts) as donnees,

  -- Les 8 colonnes historiques, ordonnees par email : empreinte de continuite
  -- avec K8.4, qui permet de rapprocher ce controle de celui de la phase
  -- precedente sans figer ici une valeur en dur.
  (select md5(coalesce(string_agg(
            email || '|' || items::text || '|' || reminder_sent::text || '|' || recovered::text || '|'
         || coalesce(reminded_at::text, '-') || '|' || created_at::text || '|' || updated_at::text || '|'
         || locale, '#' order by email), ''))
     from public.abandoned_carts) as donnees_k84,

  (select md5(coalesce(string_agg(grantee || ':' || privilege_type, '|'
                                  order by grantee, privilege_type), ''))
     from information_schema.role_table_grants
    where table_schema = 'public' and table_name = 'abandoned_carts') as grants,

  (select count(*) from pg_policies
    where schemaname = 'public' and tablename = 'abandoned_carts') as policies_n,

  (select md5(coalesce(string_agg(policyname || ':' || cmd || ':' || coalesce(qual, '')
                                  || ':' || coalesce(with_check, ''), '|' order by policyname), ''))
     from pg_policies where schemaname = 'public' and tablename = 'abandoned_carts') as policies,

  (select md5(coalesce(string_agg(tgname || ':' || pg_get_triggerdef(oid), '|' order by tgname), ''))
     from pg_trigger
    where tgrelid = 'public.abandoned_carts'::regclass and not tgisinternal) as triggers,

  (select md5(coalesce(string_agg(n.nspname || '.' || p.proname, '|'
                                  order by n.nspname, p.proname), ''))
     from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where p.prosrc ilike '%abandoned_carts%') as fonctions,

  (select relrowsecurity from pg_class
    where oid = 'public.abandoned_carts'::regclass) as rls,

  -- Index SECONDAIRES uniquement : abandoned_carts_pkey est exclue puisque
  -- c'est precisement elle qui change de colonne.
  (select md5(coalesce(string_agg(indexdef, '|' order by indexname), ''))
     from pg_indexes
    where schemaname = 'public' and tablename = 'abandoned_carts'
      and indexname <> 'abandoned_carts_pkey') as index_secondaires;

-- ─────────────────────────────────────────────────────────────────────────────
-- ETAPE 3 — LA BASCULE (controles 7 et 8). Deux instructions, rien d'autre.
-- `drop constraint` supprime l'index unique sur email ; `add constraint` cree
-- celui sur id. Aucune donnee n'est lue ni ecrite.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.abandoned_carts drop constraint abandoned_carts_pkey;
alter table public.abandoned_carts add  constraint abandoned_carts_pkey primary key (id);

-- ─────────────────────────────────────────────────────────────────────────────
-- ETAPE 4 — CONTROLES POST-ECRITURE (controles 9 a 17).
-- Si une seule valeur attendue n'est pas effectivement enregistree : exception,
-- donc ROLLBACK de toute la transaction.
-- ─────────────────────────────────────────────────────────────────────────────
do $post$
declare
  n  int;
  pk text;
  av k85_avant%rowtype;
begin
  select * into av from k85_avant;

  -- La bascule elle-meme.
  select string_agg(a.attname, ',' order by a.attnum) into pk
  from pg_constraint c
  join pg_attribute a on a.attrelid = c.conrelid and a.attnum = any(c.conkey)
  where c.conrelid = 'public.abandoned_carts'::regclass and c.contype = 'p';
  if pk is distinct from 'id' then
    raise exception '[k8.5] apres bascule, la cle primaire vaut % au lieu de id', pk;
  end if;

  -- (9) UNIQUE(cart_token) conservee : sans elle le jeton ne serait plus une
  -- capability, et deux paniers pourraient partager la meme autorisation.
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.abandoned_carts'::regclass
      and conname = 'abandoned_carts_cart_token_key' and contype = 'u'
  ) then
    raise exception '[k8.5] la contrainte UNIQUE(cart_token) a disparu';
  end if;

  -- (10) Plus AUCUN index unique portant sur la seule colonne email : c'est
  -- exactement ce qui autorise plusieurs paniers par adresse.
  select count(*) into n
  from pg_index i
  where i.indrelid = 'public.abandoned_carts'::regclass
    and i.indisunique
    and i.indnkeyatts = 1
    and (select a.attname from pg_attribute a
          where a.attrelid = i.indrelid and a.attnum = i.indkey[0]) = 'email';
  if n <> 0 then
    raise exception '[k8.5] % index unique subsiste sur email — le multi-panier reste impossible', n;
  end if;

  -- (11) email conserve, et toujours NOT NULL.
  if (select is_nullable from information_schema.columns
       where table_schema = 'public' and table_name = 'abandoned_carts' and column_name = 'email') <> 'NO' then
    raise exception '[k8.5] email n est plus NOT NULL';
  end if;

  -- (12) RLS toujours active, et dans le meme etat qu'avant.
  if not (select relrowsecurity from pg_class where oid = 'public.abandoned_carts'::regclass) then
    raise exception '[k8.5] RLS desactivee';
  end if;
  if (select relrowsecurity from pg_class where oid = 'public.abandoned_carts'::regclass)
     is distinct from av.rls then
    raise exception '[k8.5] l etat RLS a change';
  end if;

  -- (13) Grants a l'identique, et garde absolue du programme : anon et
  -- authenticated ne doivent detenir AUCUN privilege sur cette table.
  if (select md5(coalesce(string_agg(grantee || ':' || privilege_type, '|'
                                     order by grantee, privilege_type), ''))
        from information_schema.role_table_grants
       where table_schema = 'public' and table_name = 'abandoned_carts')
     is distinct from av.grants then
    raise exception '[k8.5] les privileges de table ont change';
  end if;
  select count(*) into n from information_schema.role_table_grants
   where table_schema = 'public' and table_name = 'abandoned_carts'
     and grantee in ('anon', 'authenticated');
  if n <> 0 then
    raise exception '[k8.5] % privilege(s) anon/authenticated sur abandoned_carts', n;
  end if;

  -- (14) Policies inchangees, en nombre et en contenu.
  if (select count(*) from pg_policies
       where schemaname = 'public' and tablename = 'abandoned_carts') <> av.policies_n then
    raise exception '[k8.5] le nombre de policies a change';
  end if;
  if (select md5(coalesce(string_agg(policyname || ':' || cmd || ':' || coalesce(qual, '')
                                     || ':' || coalesce(with_check, ''), '|' order by policyname), ''))
        from pg_policies where schemaname = 'public' and tablename = 'abandoned_carts')
     is distinct from av.policies then
    raise exception '[k8.5] les policies ont change';
  end if;

  -- (15) Triggers et fonctions dependantes inchanges.
  if (select md5(coalesce(string_agg(tgname || ':' || pg_get_triggerdef(oid), '|' order by tgname), ''))
        from pg_trigger
       where tgrelid = 'public.abandoned_carts'::regclass and not tgisinternal)
     is distinct from av.triggers then
    raise exception '[k8.5] les triggers ont change';
  end if;
  if (select md5(coalesce(string_agg(n2.nspname || '.' || p.proname, '|'
                                     order by n2.nspname, p.proname), ''))
        from pg_proc p join pg_namespace n2 on n2.oid = p.pronamespace
       where p.prosrc ilike '%abandoned_carts%')
     is distinct from av.fonctions then
    raise exception '[k8.5] les fonctions dependantes ont change';
  end if;

  -- Index secondaires preserves : le cron (idx_abandoned_carts_pending) et les
  -- recherches par adresse (idx_abandoned_carts_email) en dependent.
  if (select md5(coalesce(string_agg(indexdef, '|' order by indexname), ''))
        from pg_indexes
       where schemaname = 'public' and tablename = 'abandoned_carts'
         and indexname <> 'abandoned_carts_pkey')
     is distinct from av.index_secondaires then
    raise exception '[k8.5] les index secondaires ont change';
  end if;
  if not exists (select 1 from pg_indexes
                  where schemaname = 'public' and tablename = 'abandoned_carts'
                    and indexname = 'idx_abandoned_carts_pending') then
    raise exception '[k8.5] idx_abandoned_carts_pending a disparu';
  end if;
  if not exists (select 1 from pg_indexes
                  where schemaname = 'public' and tablename = 'abandoned_carts'
                    and indexname = 'idx_abandoned_carts_email') then
    raise exception '[k8.5] idx_abandoned_carts_email a disparu';
  end if;

  -- (16) Aucune ligne perdue ni ajoutee.
  if (select count(*) from public.abandoned_carts) <> av.lignes then
    raise exception '[k8.5] nombre de lignes modifie : % attendues', av.lignes;
  end if;

  -- (17) Aucune VALEUR modifiee — les 10 colonnes, puis les 8 historiques.
  if (select md5(coalesce(string_agg(
            email || '|' || items::text || '|' || reminder_sent::text || '|' || recovered::text || '|'
         || coalesce(reminded_at::text, '-') || '|' || created_at::text || '|' || updated_at::text || '|'
         || locale || '|' || id::text || '|' || cart_token::text, '#' order by id), ''))
        from public.abandoned_carts)
     is distinct from av.donnees then
    raise exception '[k8.5] EMPREINTE DES DONNEES MODIFIEE';
  end if;
  if (select md5(coalesce(string_agg(
            email || '|' || items::text || '|' || reminder_sent::text || '|' || recovered::text || '|'
         || coalesce(reminded_at::text, '-') || '|' || created_at::text || '|' || updated_at::text || '|'
         || locale, '#' order by email), ''))
        from public.abandoned_carts)
     is distinct from av.donnees_k84 then
    raise exception '[k8.5] EMPREINTE DE CONTINUITE K8.4 MODIFIEE';
  end if;

  raise notice '[k8.5] PK basculee sur id : % ligne(s), UNIQUE(cart_token) conservee, email NOT NULL et NON unique, aucune donnee modifiee', av.lignes;
end
$post$;

commit;
