-- Phase 05-K.3.2 — sécurité colonne de public.profiles.
--
-- `authenticated` disposait d'un UPDATE table-level : tout membre pouvait donc
-- écrire n'importe quelle colonne de SA PROPRE ligne (RLS filtre les lignes,
-- pas les colonnes). On remplace ce droit par un UPDATE restreint aux colonnes
-- réellement écrites par le Website et par le Mobile.
--
-- Colonnes protégées : id, created_at, updated_at, onboarding_step.
--   - id / created_at / updated_at : écrites par personne (updated_at l'est par
--     le trigger profiles_updated_at, qui n'a pas besoin du privilège colonne).
--   - onboarding_step : écrite uniquement par le cron en service_role, et
--     absente des deux dépôts Mobile (aucun commit, aucune branche — audit
--     05-K.3.2 Mobile Release Verification).
--
-- xp_points et level restent ouverts : le Mobile les écrit (achievements.ts).
-- Les fermer casserait l'app, et leur falsification n'ouvre aucun accès payant
-- (l'accès dérive de subscriptions + admin_users, jamais de profiles).
--
-- Ni policy, ni RLS, ni trigger, ni fonction, ni donnée ne sont touchés.
--
-- VALIDÉ EN PREVIEW (jmdfgpvxdbnwqjtdamcu, version 20260915191203) — le SQL
-- exécutable de ce fichier est identique à celui qui y a été appliqué et testé :
--   * UPDATE full_name sous `authenticated` : réussi, et `updated_at` rafraîchi
--     par le trigger ALORS QUE le rôle n'a AUCUN privilège colonne dessus
--     (has_column_privilege = false). PostgreSQL contrôle les privilèges sur la
--     clause SET, pas sur les affectations d'un trigger. C'était le seul point
--     qui restait supposé ; il est désormais constaté.
--   * UPDATE de id / created_at / updated_at / onboarding_step sous
--     `authenticated` : 42501 pour chacune, aucune donnée modifiée.
--   * RLS inchangé : l'utilisateur A ne modifie pas la ligne de B (0 ligne).
--   * service_role conserve l'écriture sur les 17 colonnes.
--   * policies (6), RLS, trigger et fonctions strictement identiques avant/après.

begin;

revoke update on table public.profiles from authenticated, anon;

grant update (
  full_name,
  avatar_url,
  locale,
  sex,
  birth_year,
  height_cm,
  weight_kg,
  fitness_level,
  main_goal,
  onboarded,
  onboarded_at,
  xp_points,
  level
) on table public.profiles to authenticated;

do $k32$
declare
  v_autorisees text[] := array['full_name','avatar_url','locale','sex','birth_year',
                               'height_cm','weight_kg','fitness_level','main_goal',
                               'onboarded','onboarded_at','xp_points','level'];
  v_protegees  text[] := array['id','created_at','updated_at','onboarding_step'];
  c text;
begin
  foreach c in array v_autorisees loop
    if not has_column_privilege('authenticated','public.profiles',c,'UPDATE') then
      raise exception '[k3.2] authenticated a PERDU UPDATE sur la colonne autorisee %', c;
    end if;
  end loop;

  foreach c in array v_protegees loop
    if has_column_privilege('authenticated','public.profiles',c,'UPDATE') then
      raise exception '[k3.2] authenticated conserve UPDATE sur la colonne protegee %', c;
    end if;
  end loop;

  foreach c in array (v_autorisees || v_protegees) loop
    if has_column_privilege('anon','public.profiles',c,'UPDATE') then
      raise exception '[k3.2] anon conserve UPDATE sur %', c;
    end if;
  end loop;

  if not has_table_privilege('service_role','public.profiles','UPDATE') then
    raise exception '[k3.2] service_role a PERDU UPDATE au niveau table';
  end if;
  foreach c in array v_protegees loop
    if not has_column_privilege('service_role','public.profiles',c,'UPDATE') then
      raise exception '[k3.2] service_role a PERDU UPDATE sur %', c;
    end if;
  end loop;

  if not (has_table_privilege('authenticated','public.profiles','SELECT')
      and has_table_privilege('authenticated','public.profiles','INSERT')
      and has_table_privilege('authenticated','public.profiles','DELETE')) then
    raise exception '[k3.2] SELECT/INSERT/DELETE de authenticated alteres';
  end if;

  if (select count(*) from pg_policies where schemaname='public' and tablename='profiles') <> 6 then
    raise exception '[k3.2] nombre de policies modifie';
  end if;

  raise notice '[k3.2] 13 colonnes autorisees, 4 protegees, anon sans UPDATE, service_role intact, 6 policies';
end
$k32$;

commit;
