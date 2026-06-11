import { assembleDiscipline, type DisciplineRow, type I18nRow, type VideoRow } from './content-db'

const disc: DisciplineRow = { slug: 'musculation', min_plan: 'free', color: 'blue', icon: 'dumbbell', sort_order: 1 }
const emptyGuide = {
  technique: { emoji: '', title: '', items: [] },
  equipment: { emoji: '', title: '', items: [] },
  nutrition: { emoji: '', title: '', items: [] },
  recovery: { emoji: '', title: '', items: [] },
}
const i18n: I18nRow[] = [
  { discipline_slug: 'musculation', locale: 'fr', meta: { title: 'Musculation', tag: 'Force', description: 'd', stats: ['s'], levels: ['Débutant'] }, sections: { tagline: 'tl', heroStat: 'hs', guide: emptyGuide, tips: [], exercises: [], program: [], faq: [] } },
  { discipline_slug: 'musculation', locale: 'en', meta: { title: 'Strength', tag: 'Strength', description: 'd', stats: ['s'], levels: ['Beginner'] }, sections: { tagline: 'tl-en', heroStat: 'hs', guide: emptyGuide, tips: [], exercises: [], program: [], faq: [] } },
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
    expect(r.content.videos.map(v => v.title)).toEqual(['V1', 'V2'])
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
    expect(r.meta.title).toBe('Musculation')
    expect(r.content.videos[0].title).toBe('V1')
  })
  it('renvoie null si pas de i18n du tout', () => {
    expect(assembleDiscipline(disc, [], videos, 'fr')).toBeNull()
  })
})
