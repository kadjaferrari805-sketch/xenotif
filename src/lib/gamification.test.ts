import { computeXp, xpToLevel, computeGamification, XP_PER_WORKOUT, XP_PER_SESSION } from './gamification'

const NOW = new Date('2026-06-12T12:00:00') // vendredi
const w = (date: string, discipline = 'musculation', min = 45) => ({ discipline, duration_minutes: min, completed_at: date })

describe('computeXp / xpToLevel', () => {
  it('cumule l’XP séances + sessions', () => {
    expect(computeXp(3, 4)).toBe(3 * XP_PER_WORKOUT + 4 * XP_PER_SESSION)
  })
  it('niveau 0 (recrue) à 0 XP', () => {
    const l = xpToLevel(0)
    expect(l.levelIndex).toBe(0)
    expect(l.levelKey).toBe('recrue')
    expect(l.xpInLevel).toBe(0)
    expect(l.xpForNext).toBe(300)
  })
  it('passe athlète à 300 XP', () => {
    expect(xpToLevel(300).levelKey).toBe('athlete')
    expect(xpToLevel(450).xpInLevel).toBe(150)
  })
  it('niveau max (légende) sans next', () => {
    const l = xpToLevel(99999)
    expect(l.levelKey).toBe('legende')
    expect(l.xpForNext).toBeNull()
  })
})

describe('computeGamification - badges', () => {
  it('débloque first à 1 séance, pas week', () => {
    const g = computeGamification({ workouts: [w('2026-06-10')], programSessionsCompleted: 0, now: NOW })
    expect(g.badges.find(b => b.id === 'first')!.earned).toBe(true)
    expect(g.badges.find(b => b.id === 'week')!.earned).toBe(false)
  })
  it('tenHours quand total minutes >= 600', () => {
    const many = Array.from({ length: 14 }, () => w('2026-01-01', 'musculation', 45)) // 630 min
    const g = computeGamification({ workouts: many, programSessionsCompleted: 0, now: NOW })
    expect(g.badges.find(b => b.id === 'tenHours')!.earned).toBe(true)
  })
  it('fiveDisciplines quand 5 disciplines distinctes', () => {
    const five = ['a', 'b', 'c', 'd', 'e'].map(d => w('2026-01-01', d))
    const g = computeGamification({ workouts: five, programSessionsCompleted: 0, now: NOW })
    expect(g.badges.find(b => b.id === 'fiveDisciplines')!.earned).toBe(true)
  })
})

describe('computeGamification - défis', () => {
  it('compte les minutes du mois courant', () => {
    const ws = [w('2026-06-03T10:00:00', 'm', 60), w('2026-06-20T10:00:00', 'm', 90), w('2026-05-30T10:00:00', 'm', 120)]
    const g = computeGamification({ workouts: ws, programSessionsCompleted: 0, now: NOW })
    expect(g.monthly.find(c => c.id === 'monthMinutes')!.current).toBe(150)
  })
})
