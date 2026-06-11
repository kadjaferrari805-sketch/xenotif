const LOCALES = ['fr', 'en', 'de'] as const
type Locale = typeof LOCALES[number]
const SECTION_KEYS = ['tagline', 'heroStat', 'guide', 'tips', 'exercises', 'program', 'faq'] as const

export type LocaleInput = { title: string; tag: string; description: string; statsText: string; levelsText: string; sectionsJson: string }
export type CmsInput = { minPlan: string; byLocale: Record<Locale, LocaleInput>; videosJson: string }

export type CmsMeta = { title: string; tag: string; description: string; stats: string[]; levels: string[] }
export type CmsVideo = { idx: number; youtube_ids: string[]; min_plan: string; i18n: Record<string, unknown> }
export type CmsData = {
  minPlan: 'free' | 'pro'
  byLocale: Record<Locale, { meta: CmsMeta; sections: Record<string, unknown> }>
  videos: CmsVideo[]
}

const lines = (s: string) => s.split('\n').map(x => x.trim()).filter(Boolean)

export function parseContentPayload(input: CmsInput): { ok: true; data: CmsData } | { ok: false; error: string } {
  if (input.minPlan !== 'free' && input.minPlan !== 'pro') return { ok: false, error: 'min_plan doit être free ou pro' }

  const byLocale = {} as CmsData['byLocale']
  for (const locale of LOCALES) {
    const li = input.byLocale[locale]
    if (!li) return { ok: false, error: `langue manquante : ${locale}` }
    let sections: Record<string, unknown>
    try { sections = JSON.parse(li.sectionsJson) } catch { return { ok: false, error: `JSON « sections » invalide (${locale})` } }
    if (typeof sections !== 'object' || sections === null || Array.isArray(sections)) return { ok: false, error: `« sections » doit être un objet (${locale})` }
    for (const k of SECTION_KEYS) if (!(k in sections)) return { ok: false, error: `clé « ${k} » manquante dans sections (${locale})` }
    byLocale[locale] = {
      meta: { title: li.title, tag: li.tag, description: li.description, stats: lines(li.statsText), levels: lines(li.levelsText) },
      sections,
    }
  }

  let videos: unknown
  try { videos = JSON.parse(input.videosJson) } catch { return { ok: false, error: 'JSON « vidéos » invalide' } }
  if (!Array.isArray(videos)) return { ok: false, error: '« vidéos » doit être un tableau' }
  for (const v of videos as CmsVideo[]) {
    if (typeof v?.idx !== 'number' || !Array.isArray(v?.youtube_ids) || (v?.min_plan !== 'free' && v?.min_plan !== 'pro') || typeof v?.i18n !== 'object') {
      return { ok: false, error: 'chaque vidéo doit avoir idx (nombre), youtube_ids (tableau), min_plan (free|pro), i18n (objet)' }
    }
  }

  return { ok: true, data: { minPlan: input.minPlan, byLocale, videos: videos as CmsVideo[] } }
}
