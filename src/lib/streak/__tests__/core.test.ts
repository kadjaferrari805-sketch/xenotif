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

// Ajouter dans src/lib/streak/__tests__/core.test.ts
import { reconcile, type StreakState } from '../core'

const base: StreakState = {
  weeklyGoal: 3, currentStreak: 0, longestStreak: 0, freezesAvailable: 0, lastFinalizedWeek: null,
}
// Semaines : W1=2026-06-15, W2=2026-06-22, W3=2026-06-29 (lundis). "now" mardi 2026-07-07.
const NOW = new Date('2026-07-07T10:00:00Z')

function daysMap(entries: Record<string, number>): Map<string, number> {
  return new Map(Object.entries(entries))
}

describe('reconcile', () => {
  test('semaine validée incrémente la série', () => {
    const { state } = reconcile(
      { ...base, lastFinalizedWeek: '2026-06-22' }, // finaliser W3 (2026-06-29)
      daysMap({ '2026-06-29': 3 }), NOW,
    )
    expect(state.currentStreak).toBe(1)
    expect(state.lastFinalizedWeek).toBe('2026-06-29')
  })

  test('un gel est gagné toutes les 4 semaines validées (max 2)', () => {
    const s = { ...base, currentStreak: 3, lastFinalizedWeek: '2026-06-22' }
    const { state } = reconcile(s, daysMap({ '2026-06-29': 5 }), NOW)
    expect(state.currentStreak).toBe(4)
    expect(state.freezesAvailable).toBe(1)
  })

  test('semaine ratée avec gel : série préservée, gel consommé', () => {
    const s = { ...base, currentStreak: 7, freezesAvailable: 1, lastFinalizedWeek: '2026-06-22' }
    const { state } = reconcile(s, daysMap({ '2026-06-29': 1 }), NOW) // 1 < 3
    expect(state.currentStreak).toBe(7)
    expect(state.freezesAvailable).toBe(0)
  })

  test('semaine ratée sans gel : reset + record conservé + gels à 0', () => {
    const s = { ...base, currentStreak: 9, freezesAvailable: 0, lastFinalizedWeek: '2026-06-22' }
    const { state } = reconcile(s, daysMap({ '2026-06-29': 0 }), NOW)
    expect(state.currentStreak).toBe(0)
    expect(state.longestStreak).toBe(9)
    expect(state.freezesAvailable).toBe(0)
  })

  test('semaine EN COURS non finalisée : exposée dans la vue seulement', () => {
    // now dans la semaine 2026-07-06 ; W=2026-07-06 ne doit PAS être finalisée
    const now = new Date('2026-07-08T10:00:00Z')
    const { state, view } = reconcile(
      { ...base, lastFinalizedWeek: '2026-06-29' },
      daysMap({ '2026-07-06': 2 }), now,
    )
    expect(state.lastFinalizedWeek).toBe('2026-06-29') // inchangé
    expect(view.activeDaysThisWeek).toBe(2)
    expect(view.weekValidated).toBe(false)
  })

  test('grâce 24 h : une semaine finie depuis < 24 h n’est pas finalisée', () => {
    // W=2026-06-29 finit dimanche 2026-07-05 23:59 ; fin+24h = 2026-07-06 23:59:59
    const now = new Date('2026-07-06T12:00:00Z') // < fin+24h
    const { state } = reconcile(
      { ...base, lastFinalizedWeek: '2026-06-22' },
      daysMap({ '2026-06-29': 3 }), now,
    )
    expect(state.lastFinalizedWeek).toBe('2026-06-22') // pas encore finalisée
  })

  test('changement d’objectif : validation utilise le nouvel objectif', () => {
    const s = { ...base, weeklyGoal: 2, lastFinalizedWeek: '2026-06-22' }
    const { state } = reconcile(s, daysMap({ '2026-06-29': 2 }), NOW)
    expect(state.currentStreak).toBe(1) // 2 >= 2
  })

  test('deux semaines ratées consécutives : gel puis reset', () => {
    // finaliser W2(06-22) et W3(06-29), toutes deux ratées, 1 gel en réserve
    const s = { ...base, currentStreak: 5, freezesAvailable: 1, lastFinalizedWeek: '2026-06-15' }
    const { state } = reconcile(s, daysMap({ '2026-06-22': 0, '2026-06-29': 0 }), NOW)
    expect(state.currentStreak).toBe(0)     // gel absorbe W2, reset sur W3
    expect(state.longestStreak).toBe(5)
    expect(state.freezesAvailable).toBe(0)
  })
})
