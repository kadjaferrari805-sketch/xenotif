# B2 #1 — Schéma contenu + tranche verticale Musculation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Poser le schéma hybride de la bibliothèque de contenu, une couche de lecture testée, et servir la discipline **Musculation** depuis la base (tranche verticale), sans régression sur les 9 autres.

**Architecture:** 3 tables (`content_disciplines` relationnel + gating, `content_discipline_i18n` jsonb localisé, `content_videos` relationnel + `min_plan`). Une couche serveur `content-db.ts` assemble ces tables en la forme `DisciplineContent`/`DisciplineMeta` déjà consommée. Un script génère le SQL de seed depuis le contenu statique existant (réutilisable pour #2). La page publique `/disciplines/musculation` lit la base, avec **repli sur le statique** si la base est vide.

**Tech Stack:** Supabase (SQL manuel via SQL Editor), Next.js 16 (SSG), TypeScript, Jest, `tsx` pour le script de génération.

**Spec :** `docs/superpowers/specs/2026-06-11-b2-content-schema-design.md`
**Branche :** `feat-b2-content-schema`.

**Cadrage #1 :** on câble **uniquement la page publique** Musculation (serveur/SSG). L'onglet dashboard (client) reste sur le statique → bascule en #2.

---

## Préambule
- [ ] **Lire les guides Next.js requis par `AGENTS.md`** (`node_modules/next/dist/docs/`) avant de coder.

## Structure des fichiers
- Create `supabase-content.sql` — DDL des 3 tables + RLS + seed Musculation (généré).
- Create `src/lib/content-db.ts` — `assembleDiscipline` (pur) + `getDisciplineFromDb` (I/O service-role).
- Create `src/lib/content-db.test.ts` — tests de `assembleDiscipline`.
- Create `scripts/gen-content-seed.ts` — génère le SQL d'insertion depuis le contenu statique.
- Modify `src/app/[locale]/disciplines/[slug]/page.tsx` — Musculation lue depuis la base (repli statique).

---

## Task 1 : Schéma SQL (DDL + RLS)

**Files:** Create `supabase-content.sql`

- [ ] **Step 1 : Écrire le DDL** — `supabase-content.sql`

```sql
-- ──────────────────────────────────────────────────────────────────────
-- B2 — Bibliothèque de contenu (disciplines). À exécuter dans Supabase → SQL Editor.
-- Schéma hybride : structure+gating relationnels, contenu riche en jsonb.
-- ──────────────────────────────────────────────────────────────────────
create table if not exists public.content_disciplines (
  slug        text primary key,
  sort_order  int  not null default 0,
  color       text not null default 'orange',
  icon        text,
  min_plan    text not null default 'pro' check (min_plan in ('free','pro')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.content_discipline_i18n (
  discipline_slug text not null references public.content_disciplines(slug) on delete cascade,
  locale          text not null check (locale in ('fr','en','de')),
  meta            jsonb not null,
  sections        jsonb not null,
  primary key (discipline_slug, locale)
);

create table if not exists public.content_videos (
  id              uuid primary key default gen_random_uuid(),
  discipline_slug text not null references public.content_disciplines(slug) on delete cascade,
  idx             int  not null,
  youtube_ids     text[] not null,
  min_plan        text not null default 'pro' check (min_plan in ('free','pro')),
  i18n            jsonb not null,
  unique (discipline_slug, idx)
);

-- RLS : lecture publique (contenu rendu dans le HTML public pour le SEO) ; écritures service-role only.
alter table public.content_disciplines      enable row level security;
alter table public.content_discipline_i18n  enable row level security;
alter table public.content_videos           enable row level security;
create policy "content_disciplines read"     on public.content_disciplines     for select using (true);
create policy "content_discipline_i18n read" on public.content_discipline_i18n for select using (true);
create policy "content_videos read"          on public.content_videos          for select using (true);

-- ── SEED (généré par scripts/gen-content-seed.ts — Task 3) ──────────────
```

- [ ] **Step 2 : Commit**

```bash
git add supabase-content.sql
git commit -m "feat(b2): schéma SQL bibliothèque de contenu (3 tables + RLS)"
```

---

## Task 2 : Couche de lecture `content-db.ts` (TDD)

**Files:** Create `src/lib/content-db.ts`, Test `src/lib/content-db.test.ts`

- [ ] **Step 1 : Écrire le test qui échoue** — `src/lib/content-db.test.ts`

```ts
import { assembleDiscipline, type DisciplineRow, type I18nRow, type VideoRow } from './content-db'

const disc: DisciplineRow = { slug: 'musculation', min_plan: 'free', color: 'blue', icon: 'dumbbell', sort_order: 1 }
const i18n: I18nRow[] = [
  { discipline_slug: 'musculation', locale: 'fr', meta: { title: 'Musculation', tag: 'Force', description: 'd', stats: ['s'], levels: ['Débutant'] }, sections: { tagline: 'tl', heroStat: 'hs', guide: { technique: { emoji: '', title: '', items: [] }, equipment: { emoji: '', title: '', items: [] }, nutrition: { emoji: '', title: '', items: [] }, recovery: { emoji: '', title: '', items: [] } }, tips: [], exercises: [], program: [], faq: [] } },
  { discipline_slug: 'musculation', locale: 'en', meta: { title: 'Strength', tag: 'Strength', description: 'd', stats: ['s'], levels: ['Beginner'] }, sections: { tagline: 'tl-en', heroStat: 'hs', guide: { technique: { emoji: '', title: '', items: [] }, equipment: { emoji: '', title: '', items: [] }, nutrition: { emoji: '', title: '', items: [] }, recovery: { emoji: '', title: '', items: [] } }, tips: [], exercises: [], program: [], faq: [] } },
]
const videos: VideoRow[] = [
  { discipline_slug: 'musculation', idx: 1, youtube_ids: ['B'], min_plan: 'pro', i18n: { fr: { title: 'V2', description: '', duration: '', level: '' }, en: { title: 'V2en', description: '', duration: '', level: '' } } },
  { discipline_slug: 'musculation', idx: 0, youtube_ids: ['A'], min_plan: 'free', i18n: { fr: { title: 'V1', description: '', duration: '', level: '' }, en: { title: 'V1en', description: '', duration: '', level: '' } } },
]

describe('assembleDiscipline', () => {
  it('assemble meta + content (fr) avec vidéos ordonnées par idx', () => {
    const r = assembleDiscipline(disc, i18n, videos, 'fr')!
    expect(r.meta.title).toBe('Musculation')
    expect(r.content.tagline).toBe('tl')
    expect(r.content.videos.map(v => v.title)).toEqual(['V1', 'V2']) // ordre idx 0,1
    expect(r.content.videos[0].youtubeIds).toEqual(['A'])
    expect(r.minPlan).toBe('free')
    expect(r.videoMinPlans).toEqual(['free', 'pro'])
  })
  it('localise en anglais', () => {
    const r = assembleDiscipline(disc, i18n, videos, 'en')!
    expect(r.meta.title).toBe('Strength')
    expect(r.content.videos[0].title).toBe('V1en')
  })
  it('replie sur fr si la locale manque (de absent)', () => {
    const r = assembleDiscipline(disc, i18n, videos, 'de')!
    expect(r.meta.title).toBe('Musculation') // repli fr
    expect(r.content.videos[0].title).toBe('V1') // repli fr pour la vidéo
  })
  it('renvoie null si pas de i18n du tout', () => {
    expect(assembleDiscipline(disc, [], videos, 'fr')).toBeNull()
  })
})
```

- [ ] **Step 2 : Lancer, vérifier l'échec** — `npx jest content-db` → FAIL (module introuvable).

- [ ] **Step 3 : Implémenter** — `src/lib/content-db.ts`

```ts
import { createServiceClient } from '@/lib/supabase/server'
import type { DisciplineMeta, DisciplineContent, DisciplineVideo } from '@/lib/disciplines'

export type DisciplineRow = { slug: string; min_plan: string; color: string; icon: string | null; sort_order: number }
export type I18nRow = { discipline_slug: string; locale: string; meta: DisciplineMeta; sections: Omit<DisciplineContent, 'videos'> }
export type VideoRow = {
  discipline_slug: string; idx: number; youtube_ids: string[]; min_plan: string
  i18n: Record<string, { title: string; description: string; duration: string; level: string }>
}

export type DbDiscipline = {
  meta: DisciplineMeta
  content: DisciplineContent
  minPlan: string
  videoMinPlans: string[]
}

const LOCALES_FALLBACK = (locale: string) => [locale, 'fr']

// Pur : assemble les lignes en la forme consommée par les pages. null si pas de i18n.
export function assembleDiscipline(
  disc: DisciplineRow,
  i18n: I18nRow[],
  videos: VideoRow[],
  locale: string,
): DbDiscipline | null {
  const byLocale = new Map(i18n.map(r => [r.locale, r]))
  const row = LOCALES_FALLBACK(locale).map(l => byLocale.get(l)).find(Boolean)
  if (!row) return null

  const sorted = [...videos].sort((a, b) => a.idx - b.idx)
  const pick = (v: VideoRow) => v.i18n[locale] ?? v.i18n.fr ?? Object.values(v.i18n)[0]
  const assembledVideos: DisciplineVideo[] = sorted.map(v => {
    const x = pick(v)
    return { youtubeIds: v.youtube_ids, title: x.title, description: x.description, duration: x.duration, level: x.level }
  })

  return {
    meta: row.meta,
    content: { ...row.sections, videos: assembledVideos },
    minPlan: disc.min_plan,
    videoMinPlans: sorted.map(v => v.min_plan),
  }
}

// I/O : lit les 3 tables (service-role, fonctionne au build SSG) puis assemble.
export async function getDisciplineFromDb(slug: string, locale: string): Promise<DbDiscipline | null> {
  const supabase = await createServiceClient()
  const [{ data: disc }, { data: i18n }, { data: videos }] = await Promise.all([
    supabase.from('content_disciplines').select('slug,min_plan,color,icon,sort_order').eq('slug', slug).maybeSingle(),
    supabase.from('content_discipline_i18n').select('discipline_slug,locale,meta,sections').eq('discipline_slug', slug),
    supabase.from('content_videos').select('discipline_slug,idx,youtube_ids,min_plan,i18n').eq('discipline_slug', slug),
  ])
  if (!disc) return null
  return assembleDiscipline(disc as DisciplineRow, (i18n ?? []) as I18nRow[], (videos ?? []) as VideoRow[], locale)
}
```

- [ ] **Step 4 : Lancer, vérifier le succès** — `npx jest content-db` → PASS (4 tests). Puis `npx tsc --noEmit` → exit 0.

- [ ] **Step 5 : Commit**

```bash
git add src/lib/content-db.ts src/lib/content-db.test.ts
git commit -m "feat(b2): couche de lecture content-db (assemblage testé)"
```

---

## Task 3 : Script de génération du seed + seed Musculation

**Files:** Create `scripts/gen-content-seed.ts` ; Modify `supabase-content.sql`

- [ ] **Step 1 : Écrire le générateur** — `scripts/gen-content-seed.ts`

```ts
/* Génère le SQL d'insertion des disciplines depuis le contenu statique.
   Usage : npx tsx scripts/gen-content-seed.ts musculation [autre-slug ...]
   (sans argument → musculation). Émet le SQL sur stdout. */
import { FEATURES } from '../src/lib/constants'
import { getDisciplineContent, getDisciplineMeta } from '../src/lib/disciplines'

const LOCALES = ['fr', 'en', 'de'] as const
const FREE_DISCIPLINE = 'musculation'
const slugs = process.argv.slice(2).length ? process.argv.slice(2) : [FREE_DISCIPLINE]

// Échappe une valeur pour un littéral SQL ; jsonb via cast ::jsonb.
const s = (v: string) => `'${v.replace(/'/g, "''")}'`
const j = (v: unknown) => `${s(JSON.stringify(v))}::jsonb`
const arr = (a: string[]) => `array[${a.map(s).join(',')}]::text[]`

const out: string[] = []
for (const slug of slugs) {
  const f = FEATURES.find(x => x.slug === slug)
  if (!f) { console.error(`slug inconnu: ${slug}`); process.exit(1) }
  const discMinPlan = slug === FREE_DISCIPLINE ? 'free' : 'pro'
  const sortOrder = FEATURES.findIndex(x => x.slug === slug)

  out.push(`-- ${slug}`)
  out.push(`insert into public.content_disciplines (slug, sort_order, color, icon, min_plan) values (${s(slug)}, ${sortOrder}, ${s(f.color)}, ${s(f.icon)}, ${s(discMinPlan)}) on conflict (slug) do update set sort_order=excluded.sort_order, color=excluded.color, icon=excluded.icon, min_plan=excluded.min_plan, updated_at=now();`)

  for (const locale of LOCALES) {
    const meta = getDisciplineMeta(slug, locale)!
    const c = getDisciplineContent(locale)[slug]
    const metaJson = { title: meta.title, tag: meta.tag, description: meta.description, stats: meta.stats, levels: meta.levels }
    // sections = tout DisciplineContent SAUF videos (videos vont dans content_videos)
    const sections = { tagline: c.tagline, heroStat: c.heroStat, guide: c.guide, tips: c.tips, exercises: c.exercises, program: c.program, faq: c.faq }
    out.push(`insert into public.content_discipline_i18n (discipline_slug, locale, meta, sections) values (${s(slug)}, ${s(locale)}, ${j(metaJson)}, ${j(sections)}) on conflict (discipline_slug, locale) do update set meta=excluded.meta, sections=excluded.sections;`)
  }

  // Vidéos : ordre/ids/min_plan depuis le FR (canonique) ; i18n = par langue.
  const frVideos = getDisciplineContent('fr')[slug].videos
  frVideos.forEach((_, idx) => {
    const ytIds = frVideos[idx].youtubeIds
    const minPlan = slug === FREE_DISCIPLINE && idx === 0 ? 'free' : 'pro'
    const i18n: Record<string, unknown> = {}
    for (const locale of LOCALES) {
      const v = getDisciplineContent(locale)[slug].videos[idx] ?? frVideos[idx]
      i18n[locale] = { title: v.title, description: v.description, duration: v.duration, level: v.level }
    }
    out.push(`insert into public.content_videos (discipline_slug, idx, youtube_ids, min_plan, i18n) values (${s(slug)}, ${idx}, ${arr(ytIds)}, ${s(minPlan)}, ${j(i18n)}) on conflict (discipline_slug, idx) do update set youtube_ids=excluded.youtube_ids, min_plan=excluded.min_plan, i18n=excluded.i18n;`)
  })
}
process.stdout.write(out.join('\n') + '\n')
```

- [ ] **Step 2 : Générer le seed Musculation et l'ajouter à `supabase-content.sql`**

Run: `npx tsx scripts/gen-content-seed.ts musculation >> supabase-content.sql`
Vérifier ensuite que `supabase-content.sql` contient bien des `insert into public.content_disciplines ... 'musculation'`, 3 lignes i18n, et des lignes `content_videos`. (Si `tsx` indisponible : `node --experimental-strip-types scripts/gen-content-seed.ts musculation >> supabase-content.sql`.)

- [ ] **Step 3 : Commit**

```bash
git add scripts/gen-content-seed.ts supabase-content.sql
git commit -m "feat(b2): générateur de seed + seed SQL Musculation (fr/en/de)"
```

- [ ] **Step 4 : (ACTION UTILISATEUR, hors agent)** exécuter `supabase-content.sql` dans Supabase → SQL Editor. Tant que ce n'est pas fait, la page Musculation reste sur le contenu statique (repli, Task 4).

---

## Task 4 : Câbler la page publique Musculation sur la base

**Files:** Modify `src/app/[locale]/disciplines/[slug]/page.tsx`

- [ ] **Step 1 : Importer la lecture DB** — en tête du fichier, ajouter :

```tsx
import { getDisciplineFromDb } from '@/lib/content-db'
```

- [ ] **Step 2 : Lire depuis la base pour Musculation, repli statique** — dans `DisciplinePage`, remplacer les lignes qui calculent `meta` et `content` :

Avant :
```tsx
  const meta = getDisciplineMeta(slug, locale)
  if (!base || !meta) notFound()

  const t = await getTranslations('disciplines')

  const photo   = DISC_PHOTOS[slug] ?? ''
  const content = getDisciplineContent(locale)[slug]
```
Après :
```tsx
  // B2 : Musculation est servie depuis la base (repli sur le statique si vide).
  const db = slug === 'musculation' ? await getDisciplineFromDb(slug, locale) : null
  const meta = db?.meta ?? getDisciplineMeta(slug, locale)
  if (!base || !meta) notFound()

  const t = await getTranslations('disciplines')

  const photo   = DISC_PHOTOS[slug] ?? ''
  const content = db?.content ?? getDisciplineContent(locale)[slug]
```

(Le reste de la page utilise `meta` et `content` inchangés. `color`/`icon` restent issus de `base` = `FEATURES`.)

- [ ] **Step 3 : Vérifier** — `npx tsc --noEmit` → exit 0 ; `npx eslint "src/app/[locale]/disciplines/[slug]/page.tsx" src/lib/content-db.ts` → exit 0.

- [ ] **Step 4 : Build — la page reste SSG**

Run: `npm run build` puis vérifier la ligne `● /[locale]/disciplines/[slug]` (SSG). Expected: build OK, page en `●`.

- [ ] **Step 5 : Commit**

```bash
git add "src/app/[locale]/disciplines/[slug]/page.tsx"
git commit -m "feat(b2): page publique Musculation servie depuis la base (repli statique)"
```

---

## Task 5 : Vérification finale

- [ ] **Step 1 : Suite + types + lint + build**

Run: `npx jest && npx tsc --noEmit && npx eslint src && npm run build`
Expected: tests verts (dont `content-db`), tsc/eslint exit 0, build OK, `/disciplines/[slug]` en `●` SSG.

- [ ] **Step 2 : Vérif manuelle** (après que l'utilisateur a exécuté `supabase-content.sql`) : `/disciplines/musculation` (fr/en/de) affiche le même contenu qu'avant, servi depuis la base ; les 9 autres disciplines inchangées (statique) ; le `SubscriberGate` continue de gater (Musculation `min_plan=free` → vidéos/programme accessibles).

- [ ] **Step 3 :** push + PR.

---

## Notes
- DRY : `content-db.ts` est la seule source de lecture DB ; `assembleDiscipline` (pur) est la seule logique d'assemblage. Le générateur réutilise les accesseurs statiques existants → fidélité garantie.
- YAGNI : pas de CMS ni de migration des 9 autres ici (#2/#3). Onglet dashboard non câblé (#2).
- Sécurité : lecture via service-role côté serveur (build/SSG) ; RLS lecture publique sur les tables (contenu déjà public via le HTML).
