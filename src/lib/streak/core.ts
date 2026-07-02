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
