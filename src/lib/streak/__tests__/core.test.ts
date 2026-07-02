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
