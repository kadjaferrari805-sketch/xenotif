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
