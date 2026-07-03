// src/lib/streak/core.ts
// Semaine ISO lundi→dimanche, calculée en UTC (déterministe, = fuseau serveur Vercel).

export function startOfWeek(now: Date): Date {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const dow = (d.getUTCDay() + 6) % 7 // 0 = lundi
  d.setUTCDate(d.getUTCDate() - dow)
  return d
}

export function dayKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
}

export function weekKeyOf(d: Date): string {
  return dayKey(startOfWeek(d))
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d)
  x.setUTCDate(x.getUTCDate() + n)
  return x
}

export function parseWeekKey(key: string): Date {
  const [y, m, dd] = key.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, dd))
}

// Ajouter dans src/lib/streak/core.ts
export const MILESTONES = [4, 12, 26, 52] as const

export function bucketActiveDaysByWeek(activityDates: string[]): Map<string, number> {
  const byWeek = new Map<string, Set<string>>()
  for (const iso of activityDates) {
    if (!iso) continue
    const d = new Date(iso)
    const wk = weekKeyOf(d)
    if (!byWeek.has(wk)) byWeek.set(wk, new Set())
    byWeek.get(wk)!.add(dayKey(d))
  }
  const counts = new Map<string, number>()
  for (const [wk, days] of byWeek) counts.set(wk, days.size)
  return counts
}

export function nextMilestone(current: number): number | null {
  for (const m of MILESTONES) if (m > current) return m
  return null
}

// Ajouter dans src/lib/streak/core.ts
export const MAX_FREEZES = 2
export const FREEZE_EVERY = 4
export const MIN_SMARTWATCH_SECONDS = 600
const WEEKS_LOOKBACK = 10
const GRACE_MS = 24 * 60 * 60 * 1000

export type StreakState = {
  weeklyGoal: number
  currentStreak: number
  longestStreak: number
  freezesAvailable: number
  lastFinalizedWeek: string | null // 'YYYY-MM-DD' (lundi) ou null
}

export type StreakView = StreakState & {
  activeDaysThisWeek: number
  weekValidated: boolean
  nextMilestone: number | null
}

function firstCursor(state: StreakState, activeDaysByWeek: Map<string, number>, now: Date): Date {
  if (state.lastFinalizedWeek) return addDays(parseWeekKey(state.lastFinalizedWeek), 7)
  const keys = [...activeDaysByWeek.keys()].sort()
  const earliest = keys.length ? parseWeekKey(keys[0]) : startOfWeek(now)
  const cap = addDays(startOfWeek(now), -7 * WEEKS_LOOKBACK)
  return earliest.getTime() < cap.getTime() ? cap : earliest
}

export function reconcile(
  input: StreakState,
  activeDaysByWeek: Map<string, number>,
  now: Date,
): { state: StreakState; view: StreakView } {
  const state: StreakState = { ...input }
  const thisWeekKey = weekKeyOf(now)
  let cursor = firstCursor(state, activeDaysByWeek, now)

  while (true) {
    const wkKey = dayKey(cursor)
    if (wkKey >= thisWeekKey) break // semaine en cours ou future : ne pas finaliser
    const weekEnd = addDays(cursor, 7) // lundi suivant 00:00 = borne de fin
    if (now.getTime() < weekEnd.getTime() + GRACE_MS) break // grâce 24 h

    const validated = (activeDaysByWeek.get(wkKey) ?? 0) >= state.weeklyGoal
    if (validated) {
      state.currentStreak += 1
      if (state.currentStreak % FREEZE_EVERY === 0 && state.freezesAvailable < MAX_FREEZES) {
        state.freezesAvailable += 1
      }
    } else if (state.freezesAvailable > 0) {
      state.freezesAvailable -= 1 // semaine gelée : série préservée, non incrémentée
    } else {
      state.longestStreak = Math.max(state.longestStreak, state.currentStreak)
      state.currentStreak = 0
      state.freezesAvailable = 0
    }
    state.lastFinalizedWeek = wkKey
    cursor = addDays(cursor, 7)
  }

  state.longestStreak = Math.max(state.longestStreak, state.currentStreak)
  const activeDaysThisWeek = activeDaysByWeek.get(thisWeekKey) ?? 0
  const view: StreakView = {
    ...state,
    activeDaysThisWeek,
    weekValidated: activeDaysThisWeek >= state.weeklyGoal,
    nextMilestone: nextMilestone(state.currentStreak),
  }
  return { state, view }
}
