-- Phase 05-K.3.3 — Lot 1 : retrait des privilèges inutilisables par PostgREST.
--
-- K.1 avait retiré TRUNCATE, REFERENCES et TRIGGER à anon et authenticated sur
-- les 21 tables du Website. Les 14 tables ci-dessous étaient hors de ce
-- périmètre et conservent donc les 8 privilèges (SIUDRTXM). Ce fichier leur
-- applique exactement le même traitement, ni plus ni moins.
--
-- POURQUOI CES TROIS PRIVILÈGES, ET SEULEMENT CEUX-LÀ :
--   - TRUNCATE n'est PAS filtré par RLS, contrairement à DELETE. C'est le seul
--     droit d'écriture de ces deux rôles qu'aucune policy ne peut contenir :
--     perte totale de orders, products, users, exercises, workout_sessions...
--   - REFERENCES et TRIGGER supposent de créer une contrainte ou un trigger ;
--     anon et authenticated n'ont aucun CREATE, ni sur le schéma public ni sur
--     la base (établi en 05-K.0 et 05-K.1). C'est de l'hygiène.
--   - Aucun des trois n'est un verbe du protocole PostgREST : ni le Website, ni
--     le Mobile, ni une Edge Function ne peut en dépendre, QUEL QUE SOIT le
--     binaire Mobile installé. La démonstration est structurelle, pas
--     empirique — elle ne dépend donc pas du build publié, resté indéterminable
--     lors de l'audit 05-K.3.3.
--
-- SELECT, INSERT, UPDATE et DELETE sont délibérément CONSERVÉS. Leur réduction
-- (Lot 2) dépend d'usages Mobile non vérifiés et n'entre pas dans cette phase.
--
-- Ni policy, ni RLS, ni trigger, ni fonction, ni colonne, ni donnée, ni
-- default privilege, ni service_role, ni postgres ne sont touchés.
--
-- NON VALIDÉ EN PREVIEW, ET C'EST ASSUMÉ : le projet Preview
-- (jmdfgpvxdbnwqjtdamcu) ne contient que 21 tables et AUCUNE des 14 ci-dessous.
-- Les y créer artificiellement fausserait le test. La garde transactionnelle
-- ci-dessous remplace donc la validation Preview : toute post-condition non
-- remplie annule l'intégralité de la migration.

begin;

revoke truncate, references, trigger on table public.achievements       from anon, authenticated;
revoke truncate, references, trigger on table public.coach_messages     from anon, authenticated;
revoke truncate, references, trigger on table public.exercises          from anon, authenticated;
revoke truncate, references, trigger on table public.favorite_exercises from anon, authenticated;
revoke truncate, references, trigger on table public.metrics            from anon, authenticated;
revoke truncate, references, trigger on table public.order_items        from anon, authenticated;
revoke truncate, references, trigger on table public.orders             from anon, authenticated;
revoke truncate, references, trigger on table public.products           from anon, authenticated;
revoke truncate, references, trigger on table public.program_sessions   from anon, authenticated;
revoke truncate, references, trigger on table public.programs           from anon, authenticated;
revoke truncate, references, trigger on table public.session_exercises  from anon, authenticated;
revoke truncate, references, trigger on table public.user_achievements  from anon, authenticated;
revoke truncate, references, trigger on table public.users              from anon, authenticated;
revoke truncate, references, trigger on table public.workout_sessions   from anon, authenticated;

do $k33$
declare
  v_tables   text[] := array[
    'achievements','coach_messages','exercises','favorite_exercises',
    'metrics','order_items','orders','products','program_sessions',
    'programs','session_exercises','user_achievements','users','workout_sessions'];
  v_retires  text[] := array['TRUNCATE','REFERENCES','TRIGGER'];
  v_gardes   text[] := array['SELECT','INSERT','UPDATE','DELETE'];
  v_complet  text[] := array['SELECT','INSERT','UPDATE','DELETE','REFERENCES','TRIGGER','TRUNCATE'];
  v_clients  text[] := array['anon','authenticated'];
  v_services text[] := array['service_role','postgres'];
  t text; p text; r text;
  v_oid oid;
  n_absents int := 0;
  n_conserves int := 0;
begin
  if array_length(v_tables, 1) <> 14 then
    raise exception '[k3.3] liste de tables corrompue : % entrees au lieu de 14', array_length(v_tables, 1);
  end if;

  foreach t in array v_tables loop
    v_oid := ('public.' || quote_ident(t))::regclass;

    -- 1. les trois privileges vises doivent avoir disparu pour anon et authenticated
    foreach r in array v_clients loop
      foreach p in array v_retires loop
        if has_table_privilege(r, v_oid, p) then
          raise exception '[k3.3] % conserve % sur public.%', r, p, t;
        end if;
        n_absents := n_absents + 1;
      end loop;
    end loop;

    -- 2. SELECT / INSERT / UPDATE / DELETE doivent rester STRICTEMENT intacts
    foreach r in array v_clients loop
      foreach p in array v_gardes loop
        if not has_table_privilege(r, v_oid, p) then
          raise exception '[k3.3] % a PERDU % sur public.% — hors perimetre du Lot 1', r, p, t;
        end if;
        n_conserves := n_conserves + 1;
      end loop;
    end loop;

    -- 3. service_role et postgres ne perdent rien
    foreach r in array v_services loop
      foreach p in array v_complet loop
        if not has_table_privilege(r, v_oid, p) then
          raise exception '[k3.3] % a PERDU % sur public.%', r, p, t;
        end if;
      end loop;
    end loop;

    -- 4. aucun grant de colonne ne doit apparaitre sur ces tables
    if exists (select 1 from pg_attribute a where a.attrelid = v_oid and a.attacl is not null) then
      raise exception '[k3.3] grant de colonne inattendu sur public.%', t;
    end if;
  end loop;

  -- 14 tables x 2 roles x 3 privileges = 84 paires role/privilege retirees,
  -- soit les 42 couples table/privilege attendus appliques aux deux roles.
  if n_absents <> 84 then
    raise exception '[k3.3] % paires role/privilege verifiees au lieu de 84', n_absents;
  end if;
  if n_conserves <> 112 then
    raise exception '[k3.3] % paires conservees verifiees au lieu de 112', n_conserves;
  end if;

  -- 5. le perimetre global n'a pas bouge
  if (select count(*) from pg_class c join pg_namespace n on n.oid = c.relnamespace
       where n.nspname = 'public' and c.relkind = 'r') <> 35 then
    raise exception '[k3.3] le nombre de tables du schema public a change';
  end if;
  if (select count(*) from pg_policies where schemaname = 'public') <> 37 then
    raise exception '[k3.3] le nombre de policies a change';
  end if;
  if (select count(*) from pg_attribute a
        where a.attrelid = 'public.profiles'::regclass and a.attacl is not null) <> 13 then
    raise exception '[k3.3] les 13 grants de colonne de profiles (K.3.2) ont change';
  end if;

  raise notice '[k3.3] 14 tables, 84 paires role/privilege retirees, 112 conservees, service_role et postgres intacts';
end
$k33$;

commit;
