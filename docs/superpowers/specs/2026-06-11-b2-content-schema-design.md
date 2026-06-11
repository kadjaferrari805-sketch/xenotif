# B2 #1 — Schéma bibliothèque de contenu (hybride) + tranche verticale Musculation

- **Date** : 2026-06-11
- **Statut** : design validé, prêt pour le plan d'implémentation
- **Position** : **sous-projet #1** de **B2** (bibliothèque de contenu en base). Suite : #2 migration des 9 autres disciplines + bascule complète + `content-access` lit la base ; #3 back-office (CMS).

## Contexte

Le contenu des disciplines est aujourd'hui **statique** : `src/lib/disciplines.ts` (fr) + `.en.ts` + `.de.ts` (~5 000 lignes), exposé via `getDisciplineContent(locale)` et `getDisciplineMeta(slug, locale)`. Types existants à reproduire fidèlement :
- `DisciplineMeta` = `{ title, tag, description, stats[], levels[] }`
- `DisciplineContent` = `{ tagline, heroStat, guide{technique,equipment,nutrition,recovery}, tips[], videos[], exercises[], program[], faq[] }`
- `DisciplineVideo` = `{ youtubeIds[], title, description, duration, level }`

Le gating actuel est un **soft-paywall client-side** (`SubscriberGate`, le contenu reste dans le HTML pour le SEO) + `src/lib/content-access.ts` (constantes). B2 remplace progressivement le contenu statique par une base de données, pilotée par `min_plan`.

Les migrations Supabase de ce projet sont **manuelles** : un fichier `supabase-*.sql` exécuté dans le SQL Editor.

## Décisions (validées)

- **Schéma hybride (option C)** : `disciplines` + `videos` relationnels (avec `min_plan`, pour le gating) ; le contenu descriptif riche (meta, guide, tips, exercises, program, faq) en **jsonb**.
- **Soft-paywall conservé** : le contenu PRO reste dans le HTML public (SEO) ; le gating reste **client-side**. Donc lecture publique autorisée sur les tables de contenu.
- **Tranche verticale** : #1 migre et câble **uniquement Musculation** de bout en bout. Les 9 autres disciplines restent sur le contenu statique → zéro régression.

## Schéma — `supabase-content.sql` (à exécuter dans Supabase)

```sql
-- Structure + gating, indépendant de la langue
create table if not exists public.content_disciplines (
  slug        text primary key,           -- ex. 'musculation'
  sort_order  int  not null default 0,
  color       text not null default 'orange',
  icon        text,
  min_plan    text not null default 'pro' check (min_plan in ('free','pro')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Contenu riche localisé (jsonb)
create table if not exists public.content_discipline_i18n (
  discipline_slug text not null references public.content_disciplines(slug) on delete cascade,
  locale          text not null check (locale in ('fr','en','de')),
  meta            jsonb not null,   -- { title, tag, description, stats[], levels[] }
  sections        jsonb not null,   -- { tagline, heroStat, guide, tips, exercises, program, faq }
  primary key (discipline_slug, locale)
);

-- Vidéos : relationnel pour le gating par vidéo
create table if not exists public.content_videos (
  id              uuid primary key default gen_random_uuid(),
  discipline_slug text not null references public.content_disciplines(slug) on delete cascade,
  idx             int  not null,            -- ordre d'affichage (0-based)
  youtube_ids     text[] not null,
  min_plan        text not null default 'pro' check (min_plan in ('free','pro')),
  i18n            jsonb not null,           -- { fr:{title,description,duration,level}, en:{…}, de:{…} }
  unique (discipline_slug, idx)
);

-- RLS : lecture publique (contenu rendu dans le HTML public, SEO) ; écritures service-role only.
alter table public.content_disciplines      enable row level security;
alter table public.content_discipline_i18n  enable row level security;
alter table public.content_videos           enable row level security;
create policy "content_disciplines read"     on public.content_disciplines     for select using (true);
create policy "content_discipline_i18n read" on public.content_discipline_i18n for select using (true);
create policy "content_videos read"          on public.content_videos          for select using (true);
-- (Aucune policy d'écriture → seules les requêtes service-role écrivent.)
```

## Modèle `min_plan`

- **Discipline** : `musculation = 'free'`, les autres `'pro'`. Pilotera (en #2/#3) le `SubscriberGate` du contenu riche + programme.
- **Vidéo** : dans Musculation, **idx 0 → `'free'`, idx ≥ 1 → `'pro'`** (la « 1 vidéo gratuite ») ; ailleurs `'pro'`.
- En #1 le schéma **stocke** ces `min_plan`. Le rewiring de `content-access.ts` pour qu'il **lise** ces valeurs (au lieu des constantes) fait partie de #2/#3 ; en #1, `content-access` reste basé sur les constantes (pas de régression).

## Couche de lecture — `src/lib/content-db.ts` (nouveau, serveur)

```ts
// Assemble les 3 tables en la forme déjà consommée par les pages → bascule = drop-in.
export type DbDiscipline = { meta: DisciplineMeta; content: DisciplineContent; minPlan: string; videoMinPlans: string[] }
export async function getDisciplineFromDb(slug: string, locale: string): Promise<DbDiscipline | null>
```

- Lit `content_disciplines` + `content_discipline_i18n` (par locale, repli `fr`) + `content_videos` (ordonnées par `idx`, champ localisé via `i18n[locale]`).
- Reconstruit `content` = `{ ...sections, videos: [...] }` et `meta` depuis le jsonb `meta`.
- **Fonction d'assemblage pure** `assembleDiscipline(rows)` (rows → `DbDiscipline`) isolée et **testée** (mocks, sans Supabase). `getDisciplineFromDb` = I/O (service client) + `assembleDiscipline`.
- `color`/`icon` restent lus depuis `FEATURES` (constants) par les pages en #1 (données structurelles non localisées) — la colonne existe en base pour le futur CMS, mais on ne re-câble pas les pages là-dessus en #1.

## Tranche verticale Musculation

- **Seed** dans `supabase-content.sql` : insère `musculation` (1 ligne `content_disciplines`, 3 lignes i18n fr/en/de, N lignes `content_videos`) à partir du contenu existant. Idempotent (`on conflict do nothing`/`do update`).
- **Câblage** : `src/app/[locale]/disciplines/[slug]/page.tsx` et l'onglet Musculation du dashboard lisent via `getDisciplineFromDb('musculation', locale)` **uniquement pour `slug === 'musculation'`** ; sinon, contenu statique (inchangé). Repli sur le statique si la lecture DB renvoie `null` (sécurité).
- Reste **SSG** (lecture au build via `generateStaticParams`). La revalidation à la demande (édition sans redéploiement) viendra avec le CMS (#3).

## Tests & vérification

- **Tests unitaires** de `assembleDiscipline` (rows mock → `DbDiscipline`) : forme `DisciplineContent`/`Meta` correcte, vidéos ordonnées par `idx` + localisées, repli locale `fr`, `min_plan` (discipline free, vidéo 0 free / 1+ pro).
- `tsc` + `eslint` + `next build` ✅ ; `/disciplines/musculation` reste en SSG.
- Vérif manuelle : la page Musculation affiche le même contenu qu'avant (servi depuis la base) ; les autres disciplines inchangées.

## Hors périmètre (sous-projets suivants)

- **#2** : migrer les 9 autres disciplines (fr/en/de) ; basculer toutes les pages sur `getDisciplineFromDb` ; faire lire à `content-access.ts` les `min_plan` de la base ; retirer le contenu statique `disciplines*.ts`.
- **#3** : back-office (CMS) — CRUD contenu + `min_plan` + 3 langues + revalidation à la demande (ISR) pour éditer sans redéploiement.
