export type WorkoutLite = { discipline: string; duration_minutes: number; completed_at: string }

export const XP_PER_WORKOUT = 50
export const XP_PER_SESSION = 30

export const LEVELS = [
  { key: 'recrue', minXp: 0 },
  { key: 'athlete', minXp: 300 },
  { key: 'competiteur', minXp: 800 },
  { key: 'elite', minXp: 1600 },
  { key: 'champion', minXp: 3000 },
  { key: 'legende', minXp: 5000 },
] as const

export type Badge = { id: string; icon: string; earned: boolean }
export type Challenge = { id: string; target: number; current: number }
export type Gamification = {
  xp: number
  levelIndex: number
  levelKey: string
  xpInLevel: number
  xpForNext: number | null
  badges: Badge[]
  weekly: Challenge[]
  monthly: Challenge[]
}

export function computeXp(workoutCount: number, programSessionsCompleted: number): number {
  return workoutCount * XP_PER_WORKOUT + programSessionsCompleted * XP_PER_SESSION
}

export function xpToLevel(xp: number) {
  let i = 0
  for (let k = 0; k < LEVELS.length; k++) if (xp >= LEVELS[k].minXp) i = k
  const level = LEVELS[i]
  const next = LEVELS[i + 1]
  return {
    levelIndex: i,
    levelKey: level.key as string,
    xpInLevel: xp - level.minXp,
    xpForNext: next ? next.minXp - level.minXp : null,
  }
}

function startOfWeek(now: Date): Date {
  const d = new Date(now); d.setHours(0, 0, 0, 0)
  const dow = (d.getDay() + 6) % 7 // 0 = lundi
  d.setDate(d.getDate() - dow)
  return d
}

export function computeGamification(input: { workouts: WorkoutLite[]; programSessionsCompleted: number; now?: Date }): Gamification {
  const { workouts, programSessionsCompleted } = input
  const now = input.now ?? new Date()
  const xp = computeXp(workouts.length, programSessionsCompleted)
  const lvl = xpToLevel(xp)

  const totalMinutes = workouts.reduce((a, w) => a + (w.duration_minutes ?? 0), 0)
  const disciplines = new Set(workouts.map(w => w.discipline))

  const badges: Badge[] = [
    { id: 'first', icon: '🏃', earned: workouts.length >= 1 },
    { id: 'week', icon: '📅', earned: workouts.length >= 7 },
    { id: 'month', icon: '🏆', earned: workouts.length >= 30 },
    { id: 'century', icon: '💯', earned: workouts.length >= 100 },
    { id: 'tenHours', icon: '⏱️', earned: totalMinutes >= 600 },
    { id: 'fiveDisciplines', icon: '🎯', earned: disciplines.size >= 5 },
  ]

  const weekStart = startOfWeek(now).getTime()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
  const inWeek = workouts.filter(w => new Date(w.completed_at).getTime() >= weekStart)
  const inMonth = workouts.filter(w => new Date(w.completed_at).getTime() >= monthStart)
  const min = (arr: WorkoutLite[]) => arr.reduce((a, w) => a + (w.duration_minutes ?? 0), 0)

  const weekly: Challenge[] = [
    { id: 'weekMinutes', target: 120, current: min(inWeek) },
    { id: 'weekDisciplines', target: 2, current: new Set(inWeek.map(w => w.discipline)).size },
  ]
  const monthly: Challenge[] = [
    { id: 'monthSessions', target: 12, current: inMonth.length },
    { id: 'monthMinutes', target: 600, current: min(inMonth) },
  ]

  return { xp, ...lvl, badges, weekly, monthly }
}
