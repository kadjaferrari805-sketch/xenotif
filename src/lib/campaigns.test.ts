import { getCampaignPush, getCampaignEmail, getDailyEmailTheme, normCampaignLocale } from './campaigns'

describe('campaigns — push content', () => {
  const themes = ['boutique', 'guide', 'subscribe'] as const

  it('renvoie titre + corps + url + tag non vides pour chaque thème et chaque langue', () => {
    for (const theme of themes) {
      for (const locale of ['fr', 'en', 'de']) {
        const p = getCampaignPush(theme, locale)
        expect(p.title.trim()).toBeTruthy()
        expect(p.body.trim()).toBeTruthy()
        expect(p.url.startsWith('/')).toBe(true)
        expect(p.tag.trim()).toBeTruthy()
      }
    }
  })

  it('varie selon la langue', () => {
    expect(getCampaignPush('boutique', 'fr').body).not.toEqual(getCampaignPush('boutique', 'en').body)
    expect(getCampaignPush('boutique', 'de').body).not.toEqual(getCampaignPush('boutique', 'en').body)
  })

  it('retombe sur le français pour une locale inconnue', () => {
    expect(getCampaignPush('guide', 'xx')).toEqual(getCampaignPush('guide', 'fr'))
    expect(normCampaignLocale(undefined)).toBe('fr')
  })
})

describe('campaigns — email content', () => {
  const themes = ['boutique', 'guide', 'subscribe'] as const
  it('a subject/headline/body/cta/ctaUrl non vides en fr/en/de', () => {
    for (const theme of themes) {
      for (const locale of ['fr', 'en', 'de']) {
        const e = getCampaignEmail(theme, locale)
        for (const v of [e.subject, e.headline, e.body, e.cta, e.ctaUrl]) expect(v.trim()).toBeTruthy()
      }
    }
  })
})

describe('campaigns — rotation du thème quotidien', () => {
  it('abonné : ne propose jamais le thème abonnement', () => {
    for (let d = 0; d < 7; d++) {
      const day = new Date('2026-06-07T09:00:00Z'); day.setDate(7 + d)
      expect(getDailyEmailTheme(true, day)).not.toBe('subscribe')
    }
  })
  it('non-abonné : le thème abonnement apparaît dans la semaine', () => {
    const themes = new Set<string>()
    for (let d = 0; d < 7; d++) {
      const day = new Date('2026-06-07T09:00:00Z'); day.setDate(7 + d)
      themes.add(getDailyEmailTheme(false, day))
    }
    expect(themes.has('subscribe')).toBe(true)
  })
})
