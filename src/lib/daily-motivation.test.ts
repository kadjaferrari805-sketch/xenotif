import { getDailyPushContent, getEveningPushContent } from './daily-motivation'

describe('getDailyPushContent', () => {
  // 2026-06-07 est un dimanche (getDay() === 0), 2026-06-08 un lundi (1)…
  const sunday = new Date('2026-06-07T08:00:00Z')
  const monday = new Date('2026-06-08T08:00:00Z')

  it('renvoie un titre + corps non vides pour chaque jour et chaque langue', () => {
    for (const locale of ['fr', 'en', 'de']) {
      for (let d = 0; d < 7; d++) {
        const day = new Date('2026-06-07T08:00:00Z')
        day.setDate(7 + d)
        const c = getDailyPushContent(locale, day)
        expect(c.title.trim()).toBeTruthy()
        expect(c.body.trim()).toBeTruthy()
      }
    }
  })

  it('varie selon le jour de la semaine', () => {
    expect(getDailyPushContent('fr', sunday)).not.toEqual(getDailyPushContent('fr', monday))
  })

  it('varie selon la langue', () => {
    expect(getDailyPushContent('fr', monday).body).not.toEqual(getDailyPushContent('en', monday).body)
    expect(getDailyPushContent('de', monday).body).not.toEqual(getDailyPushContent('en', monday).body)
  })

  it('retombe sur le français pour une locale inconnue ou absente', () => {
    expect(getDailyPushContent('xx', monday)).toEqual(getDailyPushContent('fr', monday))
    expect(getDailyPushContent(undefined, monday)).toEqual(getDailyPushContent('fr', monday))
  })
})

describe('getEveningPushContent', () => {
  const sunday = new Date('2026-06-07T18:00:00Z')
  const monday = new Date('2026-06-08T18:00:00Z')

  it('renvoie un titre + corps non vides pour chaque jour et chaque langue', () => {
    for (const locale of ['fr', 'en', 'de']) {
      for (let d = 0; d < 7; d++) {
        const day = new Date('2026-06-07T18:00:00Z')
        day.setDate(7 + d)
        const c = getEveningPushContent(locale, day)
        expect(c.title.trim()).toBeTruthy()
        expect(c.body.trim()).toBeTruthy()
      }
    }
  })

  it('varie selon le jour de la semaine', () => {
    expect(getEveningPushContent('fr', sunday)).not.toEqual(getEveningPushContent('fr', monday))
  })

  it('varie selon la langue', () => {
    expect(getEveningPushContent('fr', monday).body).not.toEqual(getEveningPushContent('en', monday).body)
    expect(getEveningPushContent('de', monday).body).not.toEqual(getEveningPushContent('en', monday).body)
  })

  it('diffère du push du matin (créneau distinct)', () => {
    expect(getEveningPushContent('fr', monday)).not.toEqual(getDailyPushContent('fr', monday))
  })

  it('retombe sur le français pour une locale inconnue ou absente', () => {
    expect(getEveningPushContent('xx', monday)).toEqual(getEveningPushContent('fr', monday))
    expect(getEveningPushContent(undefined, monday)).toEqual(getEveningPushContent('fr', monday))
  })
})
