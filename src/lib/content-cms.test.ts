import { parseContentPayload, type CmsInput } from './content-cms'

const sections = { tagline: 't', heroStat: 'h', guide: {}, tips: [], exercises: [], program: [], faq: [] }
const baseLocale = { title: 'T', tag: 'Tag', description: 'D', statsText: 'a\nb', levelsText: 'L1\nL2', sectionsJson: JSON.stringify(sections) }
const input = (over: Partial<CmsInput> = {}): CmsInput => ({
  minPlan: 'free',
  byLocale: { fr: { ...baseLocale }, en: { ...baseLocale }, de: { ...baseLocale } },
  videosJson: JSON.stringify([{ idx: 0, youtube_ids: ['A'], min_plan: 'free', i18n: { fr: { title: 'v', description: '', duration: '', level: '' } } }]),
  ...over,
})

describe('parseContentPayload', () => {
  it('valide une entrée correcte', () => {
    const r = parseContentPayload(input())
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.data.minPlan).toBe('free')
      expect(r.data.byLocale.fr.meta.stats).toEqual(['a', 'b'])
      expect(r.data.byLocale.fr.meta.levels).toEqual(['L1', 'L2'])
      expect(r.data.byLocale.fr.sections).toEqual(sections)
      expect(r.data.videos[0].idx).toBe(0)
    }
  })
  it('rejette un min_plan invalide', () => {
    expect(parseContentPayload(input({ minPlan: 'gold' })).ok).toBe(false)
  })
  it('rejette un JSON sections invalide', () => {
    const bad = input(); bad.byLocale.fr.sectionsJson = '{ not json'
    expect(parseContentPayload(bad).ok).toBe(false)
  })
  it('rejette des clés sections manquantes', () => {
    const bad = input(); bad.byLocale.en.sectionsJson = JSON.stringify({ tagline: 'x' })
    expect(parseContentPayload(bad).ok).toBe(false)
  })
  it('rejette des vidéos non-tableau', () => {
    expect(parseContentPayload(input({ videosJson: '{}' })).ok).toBe(false)
  })
})
