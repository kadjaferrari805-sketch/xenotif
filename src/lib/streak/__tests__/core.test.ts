// src/lib/streak/__tests__/core.test.ts
import { startOfWeek, dayKey, weekKeyOf, addDays, parseWeekKey } from '../core'

describe('helpers de date UTC', () => {
  test('startOfWeek renvoie le lundi 00:00 UTC', () => {
    // 2026-07-02 est un jeudi
    const mon = startOfWeek(new Date('2026-07-02T15:30:00Z'))
    expect(dayKey(mon)).toBe('2026-06-29') // lundi
  })

  test('dimanche appartient encore à la semaine du lundi précédent', () => {
    expect(weekKeyOf(new Date('2026-07-05T23:00:00Z'))).toBe('2026-06-29') // dimanche
    expect(weekKeyOf(new Date('2026-07-06T00:00:00Z'))).toBe('2026-07-06') // lundi suivant
  })

  test('addDays et parseWeekKey', () => {
    expect(dayKey(addDays(parseWeekKey('2026-06-29'), 7))).toBe('2026-07-06')
  })
})

// Ajouter dans src/lib/streak/__tests__/core.test.ts
import { bucketActiveDaysByWeek, nextMilestone, MILESTONES } from '../core'

describe('bucketActiveDaysByWeek', () => {
  test('compte les JOURS actifs distincts par semaine (2 activités le même jour = 1)', () => {
    const map = bucketActiveDaysByWeek([
      '2026-06-29T08:00:00Z', // lundi
      '2026-06-29T18:00:00Z', // lundi (même jour)
      '2026-07-01T12:00:00Z', // mercredi
      '2026-07-06T09:00:00Z', // lundi semaine suivante
    ])
    expect(map.get('2026-06-29')).toBe(2)
    expect(map.get('2026-07-06')).toBe(1)
  })

  test('map vide pour aucune activité', () => {
    expect(bucketActiveDaysByWeek([]).size).toBe(0)
  })
})

describe('nextMilestone', () => {
  test('renvoie le prochain jalon strictement supérieur', () => {
    expect(nextMilestone(0)).toBe(4)
    expect(nextMilestone(4)).toBe(12)
    expect(nextMilestone(12)).toBe(26)
    expect(nextMilestone(60)).toBeNull()
    expect(MILESTONES).toEqual([4, 12, 26, 52])
  })
})
