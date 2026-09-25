import { getCampaignPush, getCampaignEmail, getDailyEmailTheme, normCampaignLocale } from './campaigns'

describe('campaigns - push content', () => {
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

describe('campaigns - email content', () => {
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

describe('campaigns - rotation du thème quotidien', () => {
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

// ─── Phase 09.8.5 — localisation du CTA « tarifs » ────────────────────────
//
// `src/lib/emails/index.ts` compose l'URL absolue ainsi :
//     c.ctaUrl.startsWith('http') ? c.ctaUrl : `${BASE_URL}${c.ctaUrl}`
// Un `ctaUrl` identique dans les trois langues envoyait donc les campagnes EN
// et DE vers l'accueil FRANÇAIS. Le préfixe de locale est porté par la donnée
// elle-même, puisque la table `EMAIL` est déjà indexée par langue.

describe('campaigns — CTA tarifs localisé', () => {
  it.each([
    ['fr', '/#tarifs'],
    ['en', '/en/#tarifs'],
    ['de', '/de/#tarifs'],
  ])('subscribe / %s → %s', (locale, attendu) => {
    expect(getCampaignEmail('subscribe', locale).ctaUrl).toBe(attendu)
  })

  it('URL absolue finale, composée comme le fait src/lib/emails/index.ts', () => {
    const BASE_URL = 'https://xenotif.com'
    const absolue = (locale: string) => {
      const u = getCampaignEmail('subscribe', locale).ctaUrl
      return u.startsWith('http') ? u : `${BASE_URL}${u}`
    }

    expect(absolue('fr')).toBe('https://xenotif.com/#tarifs')
    expect(absolue('en')).toBe('https://xenotif.com/en/#tarifs')
    expect(absolue('de')).toBe('https://xenotif.com/de/#tarifs')
  })

  it('CONTRÔLE NÉGATIF : EN et DE ne pointent plus vers l’accueil français', () => {
    expect(getCampaignEmail('subscribe', 'en').ctaUrl).not.toBe('/#tarifs')
    expect(getCampaignEmail('subscribe', 'de').ctaUrl).not.toBe('/#tarifs')
  })

  it('locale inconnue → CTA français, non préfixé', () => {
    expect(getCampaignEmail('subscribe', 'xx').ctaUrl).toBe('/#tarifs')
  })
})

describe('campaigns — ce que la phase 09.8.5 ne devait PAS toucher', () => {
  // Ces deux CTA souffrent du MÊME défaut de locale, mais le périmètre de la
  // phase les excluait explicitement. Ce test verrouille leur état actuel :
  // il échouera si on les corrige un jour sans le décider sciemment.
  it.each(['fr', 'en', 'de'])('le CTA boutique reste /boutique en %s', (locale) => {
    expect(getCampaignEmail('boutique', locale).ctaUrl).toBe('/boutique')
  })

  it.each(['fr', 'en', 'de'])('le CTA guide reste /dashboard/programme en %s', (locale) => {
    expect(getCampaignEmail('guide', locale).ctaUrl).toBe('/dashboard/programme')
  })

  it('les textes marketing du thème abonnement sont intacts', () => {
    expect(getCampaignEmail('subscribe', 'fr').cta).toBe('Voir les offres →')
    expect(getCampaignEmail('subscribe', 'en').cta).toBe('See the plans →')
    expect(getCampaignEmail('subscribe', 'de').cta).toBe('Angebote ansehen →')
  })

  it('les URL des notifications push ne sont pas affectées', () => {
    for (const locale of ['fr', 'en', 'de']) {
      expect(getCampaignPush('subscribe', locale).url).not.toContain('/en/')
      expect(getCampaignPush('subscribe', locale).url).not.toContain('/de/')
    }
  })
})
