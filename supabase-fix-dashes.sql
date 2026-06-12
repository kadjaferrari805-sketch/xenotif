-- =====================================================================
-- XENOTIF® — Normalisation des plages en tiret demi-cadratin « – »
-- Table servie en prod : public.content_discipline_i18n (meta + sections)
--
-- Seules 3 disciplines avaient une durée en trait d'union dans la base :
--   hiit       : 20-30 min   (de : 20-30 Min)
--   yoga       : 20-60 min   (de : 20-60 Min)
--   stretching : 10-30 min   (de : 10-30 Min)
--
-- Remplacement LITTÉRAL (jamais une date ni un vrai trait d'union),
-- idempotent : relancer ne change rien de plus.
-- =====================================================================

-- 1) APERÇU (lecture seule) — lignes encore en trait d'union
select discipline_slug, locale
from public.content_discipline_i18n
where meta::text     ~ '(20-30|20-60|10-30) ?[Mm]in'
   or sections::text ~ '(20-30|20-60|10-30) ?[Mm]in'
order by discipline_slug, locale;

-- 2) CORRECTION
update public.content_discipline_i18n
set meta = replace(replace(replace(replace(replace(replace(meta::text,
        '20-30 min','20–30 min'),'20-30 Min','20–30 Min'),
        '20-60 min','20–60 min'),'20-60 Min','20–60 Min'),
        '10-30 min','10–30 min'),'10-30 Min','10–30 Min')::jsonb,
    sections = replace(replace(replace(replace(replace(replace(sections::text,
        '20-30 min','20–30 min'),'20-30 Min','20–30 Min'),
        '20-60 min','20–60 min'),'20-60 Min','20–60 Min'),
        '10-30 min','10–30 min'),'10-30 Min','10–30 Min')::jsonb
where meta::text     ~ '(20-30|20-60|10-30) ?[Mm]in'
   or sections::text ~ '(20-30|20-60|10-30) ?[Mm]in';

-- 3) VÉRIFICATION (doit renvoyer 0 ligne)
select discipline_slug, locale
from public.content_discipline_i18n
where meta::text     ~ '(20-30|20-60|10-30) ?[Mm]in'
   or sections::text ~ '(20-30|20-60|10-30) ?[Mm]in';
