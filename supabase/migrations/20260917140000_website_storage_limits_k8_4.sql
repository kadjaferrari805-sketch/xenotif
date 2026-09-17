-- Phase 05-K8.1 — finding K8-04 : bornes serveur sur les buckets Storage.
--
-- POURQUOI. Les cinq buckets sont publics, sans `file_size_limit` ni
-- `allowed_mime_types`. Deux d'entre eux acceptent des televersements
-- d'utilisateurs :
--   - `avatars`  : policy « Users upload their own avatar », tout compte
--     authentifie ecrit dans `avatars/<son uid>/`. Le Mobile est le seul client
--     (XenotifFitness/apps/mobile/src/lib/avatar.ts) et n'impose AUCUNE limite
--     de taille. Le bucket est donc la seule borne serveur possible.
--   - `transformations` : les televersements passent par service_role, et la
--     validation (5 Mo, image/*) vit uniquement dans l'application. Un appel
--     direct a l'API Storage la contournerait.
--
-- CHOIX DES VALEURS, tires du code et des donnees, non arbitraires :
--   - 5 242 880 octets = 5 Mo, exactement `MAX_IMAGE_BYTES`
--     (src/lib/transformations.ts:1). `transformations` reproduit ainsi la
--     regle applicative ; `avatars` s'aligne sur la meme convention, avec une
--     marge de 16x sur le plus gros objet existant (310 788 octets).
--   - `image/*` plutot qu'une liste explicite : avatar.ts envoie
--     `contentType: asset.mimeType ?? 'image/jpeg'`, valeur issue du selecteur
--     systeme. Un iPhone peut transmettre `image/heic` ; enumerer
--     jpeg/png/webp CASSERAIT l'upload iOS. Le joker reproduit exactement
--     `validateImage`, qui teste `file.type.startsWith('image/')`.
--
-- CE QUE CETTE MIGRATION NE FAIT PAS. Elle ne touche ni a
-- `discipline-heroes`, ni a `exercise-demos` (videos de 9,6 Mo), ni a
-- `program-covers`. Elle ne supprime aucun objet, ne modifie aucune policy
-- Storage, ne change aucun statut public/prive. Les restrictions s'appliquent
-- aux televersements FUTURS : les objets deja stockes ne sont pas invalides,
-- y compris le `.emptyFolderPlaceholder` de `transformations`, conserve
-- volontairement.
--
-- CE QU'ELLE NE PEUT PAS FAIRE : le finding K8-01 (TRUNCATE accorde a anon et
-- authenticated sur storage.objects/buckets) n'est PAS corrige ici. Les tables
-- appartiennent a `supabase_storage_admin`, `postgres` n'en est pas membre et
-- ne peut pas y basculer (42501). Un REVOKE emis par postgres est ACCEPTE SANS
-- EFFET. Ecrire un tel REVOKE donnerait l'illusion d'une correction : il est
-- donc volontairement absent. Voir K8-01 = BLOCKED_BY_ROLE_OWNERSHIP.
--
-- IDEMPOTENCE : l'ecriture est un UPDATE sur des valeurs cibles fixes, rejouable
-- sans effet de bord. Un bucket absent est ignore avec un `notice` — c'est le
-- cas d'un projet sans Storage, par exemple Preview.

begin;

do $k84$
declare
  v_limit  bigint := 5242880;              -- 5 Mo, = MAX_IMAGE_BYTES
  v_mime   text[] := array['image/*'];
  v_cibles text[] := array['avatars', 'transformations'];
  b            text;
  n            int;
  traites      int := 0;
  objets_avant int;
  objets_apres int;
  cur_limit    bigint;
  cur_mime     text[];
  cur_public   boolean;
begin
  select count(*) into objets_avant from storage.objects;

  foreach b in array v_cibles loop
    if not exists (select 1 from storage.buckets where id = b) then
      raise notice '[k8.4] bucket % absent — ignore', b;
      continue;
    end if;

    update storage.buckets
       set file_size_limit    = v_limit,
           allowed_mime_types = v_mime
     where id = b;

    -- CONTROLE POST-ECRITURE. Une ecriture acceptee ne prouve rien : K8-01 a
    -- montre qu'un REVOKE non autorise reussit sans rien changer. On relit donc
    -- la valeur reellement enregistree et on echoue bruyamment si elle ne
    -- correspond pas, plutot que d'afficher un succes trompeur.
    select file_size_limit, allowed_mime_types, public
      into cur_limit, cur_mime, cur_public
      from storage.buckets where id = b;

    if cur_limit is distinct from v_limit then
      raise exception '[k8.4] % : file_size_limit vaut % au lieu de % — ecriture sans effet',
        b, coalesce(cur_limit::text, 'NULL'), v_limit;
    end if;

    if cur_mime is distinct from v_mime then
      raise exception '[k8.4] % : allowed_mime_types vaut % au lieu de % — ecriture sans effet',
        b, coalesce(array_to_string(cur_mime, ','), 'NULL'), array_to_string(v_mime, ',');
    end if;

    if not cur_public then
      raise exception '[k8.4] % : le statut public a change, ce n est pas le role de cette migration', b;
    end if;

    traites := traites + 1;
    raise notice '[k8.4] % : file_size_limit=% allowed_mime_types=%',
      b, cur_limit, array_to_string(cur_mime, ',');
  end loop;

  if traites = 0 then
    raise notice '[k8.4] aucun bucket cible present — rien a faire sur ce projet';
    return;
  end if;

  ------------------------------------------------------------------ garde-fous
  -- Les trois buckets hors perimetre doivent rester exactement en l'etat.
  select count(*) into n
    from storage.buckets
   where id in ('discipline-heroes', 'exercise-demos', 'program-covers')
     and (file_size_limit is not null or allowed_mime_types is not null);
  if n <> 0 then
    raise exception '[k8.4] % bucket(s) hors perimetre porte(nt) desormais une restriction', n;
  end if;

  -- Aucun objet ne doit avoir disparu.
  select count(*) into objets_apres from storage.objects;
  if objets_apres <> objets_avant then
    raise exception '[k8.4] le nombre d objets est passe de % a %', objets_avant, objets_apres;
  end if;

  -- Les policies Storage ne sont pas du ressort de cette migration.
  select count(*) into n
    from pg_policies where schemaname = 'storage' and tablename = 'objects';
  raise notice '[k8.4] % bucket(s) configure(s) ; % objets intacts ; % policies storage.objects inchangees',
    traites, objets_apres, n;
end
$k84$;

commit;
