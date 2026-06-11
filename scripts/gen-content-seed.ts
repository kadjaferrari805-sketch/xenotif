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
