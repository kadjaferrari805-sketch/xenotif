-- Phase 09.7.12 — etat de l'onboarding Website (public.website_onboarding).
--
-- POURQUOI CETTE TABLE EXISTE, ET POURQUOI ELLE EST SEPAREE
-- Les audits 09.7.5 a 09.7.9.1 ont etabli qu'AUCUNE source existante ne peut
-- porter l'etat de l'onboarding Website :
--   - profiles.onboarded / onboarded_at sont des GARDES DE NAVIGATION Mobile
--     (XenotifFitness _layout.tsx, xenotif-app index.tsx). Les ecrire rendrait
--     l'ecran de personnalisation Mobile inatteignable.
--   - profiles.main_goal / fitness_level portent DEUX vocabulaires Mobile
--     incompatibles (intersection {endurance} pour l'un, VIDE pour l'autre).
--   - profiles.onboarding_step appartient au cron e-mail ; `authenticated` n'a
--     aucun grant UPDATE dessus (42501 depuis le navigateur).
--   - workouts est ecrite aussi par xenotif-app (lib/workout-log.ts) : une
--     seance enregistree depuis le telephone marquerait l'onboarding WEBSITE
--     termine.
--   - progress est ecrite aussi par XenotifFitness (session/[sessionId].tsx).
--   - health_metrics est ecrite AUTOMATIQUEMENT par le capteur de mouvement
--     (TodayActivity, toutes les 15 s) et avec des valeurs de DEMONSTRATION
--     codees en dur par /api/smartwatch/sync : elle ne prouve aucun usage.
--   - user_streaks est creee par cron, « meme sans ouverture de l'app ».
-- D'ou une frontiere de donnees dediee, independante du Mobile et de toute
-- table d'activite partagee.
--
-- NOT_STARTED N'EST PAS STOCKE. L'absence de ligne l'encode. Stocker cet etat
-- imposerait d'ecrire une ligne vide de sens a chaque inscription.
--
-- POURQUOI service_role EST EXPLICITEMENT REVOQUE — POINT CRITIQUE
-- Le privilege par defaut du schema public, concede par `postgres`, est
--   {postgres=arwdDxtm, service_role=arwdDxtm}
-- Une CREATE TABLE accorde donc AUTOMATIQUEMENT tous les droits a service_role.
-- Verifie empiriquement en production sur rate_limits, transformations et
-- web_push_subscriptions : ces trois tables, creees sans grant explicite,
-- portent service_role avec tous les droits. Sans la revocation ci-dessous, la
-- regle « ne rien accorder par speculation » serait violee en silence.
-- La cascade de suppression de compte n'en souffre pas : une action
-- referentielle s'execute independamment des privileges du role appelant.
--
-- CE QUE CETTE MIGRATION NE FAIT PAS
-- Elle ne touche a aucune table, colonne, policy, fonction, trigger, grant ni
-- bucket existant. Elle ne modifie ni profiles, ni workouts, ni progress, ni
-- health_metrics, ni aucune donnee Mobile. Elle n'ecrit AUCUNE donnee : les
-- comptes existants restent NOT_STARTED par absence de ligne, et la regle
-- LEGACY vit dans la logique d'eligibilite applicative, jamais dans le schema.
--
-- NI TRIGGER, NI INDEX SUPPLEMENTAIRE, NI HORODATAGE
--   - La cle primaire user_id fournit deja l'index de la seule requete servie :
--     .eq('user_id', ...).single().
--   - La monotonie de current_step est une garantie APPLICATIVE
--     (GREATEST(existant, nouveau)). Une regression ferait revoir une etape
--     anterieure : consequence cosmetique, sans corruption ni faille — le seuil
--     justifiant un trigger n'est pas atteint.
--   - La terminalite de COMPLETED est egalement applicative : une CHECK valide
--     une ligne, pas une transition.
--   - started_at / updated_at / completed_at / dismissed_at sont ANALYTIQUES,
--     non requis par le comportement, et chacun pourrait contredire `state`.
--     Ils s'ajouteront par ALTER TABLE le jour ou ils serviront.
--
-- CREATION APPLICATIVE — PIEGE A NE PAS REPRODUIRE
-- La creation de la ligne DOIT utiliser :
--     upsert(..., { onConflict: 'user_id', ignoreDuplicates: true })
-- Un upsert ORDINAIRE execute un UPDATE en cas de conflit : deux onglets
-- ouvrant le parcours en meme temps REINITIALISERAIENT en 'in_progress' un
-- utilisateur deja 'completed'. `ignoreDuplicates` n'est pas un confort, c'est
-- une exigence de correction.
--
-- PREMIERE CREATION, PAS DE REJOUABILITE ARTIFICIELLE. Ni `if not exists` sur
-- la table, ni `drop policy` prealable : cette migration cree un objet neuf et
-- doit echouer bruyamment si cet objet existe deja.

begin;

create table public.website_onboarding (
  user_id      uuid     primary key
                        references public.profiles (id) on delete cascade,
  state        text     not null,
  current_step smallint not null default 1,

  constraint website_onboarding_state_check
    check (state in ('in_progress', 'dismissed', 'completed')),

  constraint website_onboarding_current_step_check
    check (current_step between 1 and 4)
);

alter table public.website_onboarding enable row level security;

-- ------------------------------------------------------------------ policies
-- Trois policies PAR COMMANDE, jamais une seule policy ALL : le motif ALL de
-- `workouts` rend le contrat d'ecriture implicite (son WITH CHECK est nul) et
-- concede DELETE sans intention explicite. Aucune policy DELETE ici.
create policy website_onboarding_select_own
  on public.website_onboarding
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy website_onboarding_insert_own
  on public.website_onboarding
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Le WITH CHECK est evalue sur la ligne APRES modification : il interdit de
-- reattribuer user_id a autrui. C'est precisement ce qui manque a la policy
-- « Users update own profile » en production.
create policy website_onboarding_update_own
  on public.website_onboarding
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- -------------------------------------------------------- privileges de table
-- Revocation AVANT tout grant : le resultat doit etre deterministe quel que
-- soit le role qui applique la migration (cf. en-tete, service_role).
revoke all on table public.website_onboarding
  from public, anon, authenticated, service_role;

-- Grants minimaux. INSERT et UPDATE sont accordes AU NIVEAU COLONNE :
-- l'exclusion de user_id de l'UPDATE rend la propriete immuable au niveau du
-- PRIVILEGE, donc AVANT toute evaluation RLS. Deux barrieres independantes
-- protegent ainsi l'appartenance de la ligne.
grant select                                   on table public.website_onboarding to authenticated;
grant insert (user_id, state, current_step)    on table public.website_onboarding to authenticated;
grant update (state, current_step)             on table public.website_onboarding to authenticated;

-- Aucun DELETE : ni grant, ni policy. Un membre n'a pas a supprimer son etat.
-- Aucun acces service_role : aucune tache systeme n'en a besoin aujourd'hui.

-- ------------------------------------------------------- assertions de garde
-- Elles portent sur les INVARIANTS de cette table, jamais sur des comptes
-- globaux : une assertion du type « il doit y avoir 38 tables » echouerait sur
-- tout projet dont l'etat differe legitimement (Preview, par exemple).
do $onb$
declare
  v_cols text;
  n int;
begin
  ------------------------------------------------------------------ structure
  if to_regclass('public.website_onboarding') is null then
    raise exception '[09.7.12] la table website_onboarding est absente';
  end if;

  select string_agg(a.attname, ',' order by a.attnum) into v_cols
  from pg_attribute a
  where a.attrelid = 'public.website_onboarding'::regclass
    and a.attnum > 0 and not a.attisdropped;

  if v_cols <> 'user_id,state,current_step' then
    raise exception '[09.7.12] schema inattendu : % (attendu user_id,state,current_step)', v_cols;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.website_onboarding'::regclass
      and contype = 'p'
      and conkey = array[(select attnum from pg_attribute
                          where attrelid = 'public.website_onboarding'::regclass
                            and attname = 'user_id')]
  ) then
    raise exception '[09.7.12] la cle primaire n est pas portee par user_id seul';
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.website_onboarding'::regclass
      and contype = 'f'
      and confrelid = 'public.profiles'::regclass
      and confdeltype = 'c'
  ) then
    raise exception '[09.7.12] la FK vers profiles(id) ON DELETE CASCADE est absente';
  end if;

  if not exists (select 1 from pg_constraint
                 where conrelid = 'public.website_onboarding'::regclass
                   and conname = 'website_onboarding_state_check') then
    raise exception '[09.7.12] website_onboarding_state_check est absente';
  end if;

  if not exists (select 1 from pg_constraint
                 where conrelid = 'public.website_onboarding'::regclass
                   and conname = 'website_onboarding_current_step_check') then
    raise exception '[09.7.12] website_onboarding_current_step_check est absente';
  end if;

  ------------------------------------------------------------ RLS et policies
  if not (select c.relrowsecurity from pg_class c
          where c.oid = 'public.website_onboarding'::regclass) then
    raise exception '[09.7.12] RLS n est pas actif';
  end if;

  select count(*) into n from pg_policies
  where schemaname = 'public' and tablename = 'website_onboarding';
  if n <> 3 then
    raise exception '[09.7.12] % policy(s) trouvee(s), 3 attendues', n;
  end if;

  if exists (select 1 from pg_policies
             where schemaname = 'public' and tablename = 'website_onboarding'
               and cmd = 'DELETE') then
    raise exception '[09.7.12] une policy DELETE existe : aucune n est autorisee';
  end if;

  if exists (select 1 from pg_policies
             where schemaname = 'public' and tablename = 'website_onboarding'
               and cmd = 'UPDATE' and with_check is null) then
    raise exception '[09.7.12] la policy UPDATE n a pas de WITH CHECK';
  end if;

  ----------------------------------------------------------------- privileges
  -- anon et service_role ne doivent apparaitre NULLE PART : ni au niveau
  -- table, ni au niveau colonne. PUBLIC (grantee 0) non plus.
  select count(*) into n
  from pg_class c
  cross join lateral aclexplode(coalesce(c.relacl, '{}'::aclitem[])) x
  where c.oid = 'public.website_onboarding'::regclass
    and (x.grantee = 0
      or (x.grantee <> 0 and pg_get_userbyid(x.grantee) in ('anon', 'service_role')));
  if n <> 0 then
    raise exception '[09.7.12] % privilege(s) de table pour PUBLIC, anon ou service_role', n;
  end if;

  select count(*) into n
  from pg_attribute a
  cross join lateral aclexplode(coalesce(a.attacl, '{}'::aclitem[])) x
  where a.attrelid = 'public.website_onboarding'::regclass
    and a.attnum > 0 and not a.attisdropped
    and (x.grantee = 0
      or (x.grantee <> 0 and pg_get_userbyid(x.grantee) in ('anon', 'service_role')));
  if n <> 0 then
    raise exception '[09.7.12] % privilege(s) de colonne pour PUBLIC, anon ou service_role', n;
  end if;

  -- authenticated : SELECT au niveau table ; INSERT et UPDATE au niveau
  -- COLONNE. has_table_privilege renvoie false pour un droit accorde
  -- uniquement par colonne — c'est has_column_privilege qu'il faut interroger,
  -- faute de quoi cette garde echouerait a tort.
  if not has_table_privilege('authenticated', 'public.website_onboarding', 'SELECT') then
    raise exception '[09.7.12] authenticated ne peut pas lire son etat';
  end if;

  if not has_column_privilege('authenticated', 'public.website_onboarding', 'user_id', 'INSERT')
     or not has_column_privilege('authenticated', 'public.website_onboarding', 'state', 'INSERT')
     or not has_column_privilege('authenticated', 'public.website_onboarding', 'current_step', 'INSERT') then
    raise exception '[09.7.12] authenticated ne peut pas creer son etat';
  end if;

  if not has_column_privilege('authenticated', 'public.website_onboarding', 'state', 'UPDATE')
     or not has_column_privilege('authenticated', 'public.website_onboarding', 'current_step', 'UPDATE') then
    raise exception '[09.7.12] authenticated ne peut pas faire progresser son etat';
  end if;

  -- LE CONTROLE CENTRAL : user_id doit etre immuable.
  if has_column_privilege('authenticated', 'public.website_onboarding', 'user_id', 'UPDATE') then
    raise exception '[09.7.12] authenticated peut modifier user_id : propriete non immuable';
  end if;

  if has_table_privilege('authenticated', 'public.website_onboarding', 'DELETE') then
    raise exception '[09.7.12] authenticated detient DELETE';
  end if;

  ------------------------------------------------- ni index ni trigger de plus
  select count(*) into n from pg_indexes
  where schemaname = 'public' and tablename = 'website_onboarding';
  if n <> 1 then
    raise exception '[09.7.12] % index trouve(s), 1 attendu (la seule cle primaire)', n;
  end if;

  select count(*) into n from pg_trigger t
  where t.tgrelid = 'public.website_onboarding'::regclass and not t.tgisinternal;
  if n <> 0 then
    raise exception '[09.7.12] % trigger(s) trouve(s), aucun attendu', n;
  end if;

  ----------------------------------------------------- aucune donnee ecrite
  select count(*) into n from public.website_onboarding;
  if n <> 0 then
    raise exception '[09.7.12] la table contient % ligne(s) : aucun backfill n est prevu', n;
  end if;

  ------------------------------------------------------------------- rapport
  raise notice '[09.7.12] website_onboarding creee : 3 colonnes, PK user_id, FK profiles CASCADE, 2 CHECK nommees, RLS actif, 3 policies (aucune DELETE), authenticated en SELECT/INSERT/UPDATE sans user_id, 0 privilege anon/service_role/PUBLIC, 1 index, 0 trigger, 0 ligne';
end
$onb$;

commit;
