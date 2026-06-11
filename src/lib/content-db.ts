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

const localesFallback = (locale: string) => [locale, 'fr']

// Pur : assemble les lignes en la forme consommée par les pages. null si pas de i18n.
export function assembleDiscipline(
  disc: DisciplineRow,
  i18n: I18nRow[],
  videos: VideoRow[],
  locale: string,
): DbDiscipline | null {
  const byLocale = new Map(i18n.map(r => [r.locale, r]))
  const row = localesFallback(locale).map(l => byLocale.get(l)).find(Boolean)
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
