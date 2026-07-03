// src/lib/streak/__tests__/service.test.ts
import type { SupabaseClient } from '@supabase/supabase-js'
import { getStreak } from '../service'

type Row = Record<string, unknown>
type Seed = {
  user_streaks?: Row | null
  workouts?: Row[]
  progress?: Row[]
  smartwatch_sessions?: Row[]
}

// Faux client Supabase minimal : renvoie des données seedées par table.
function fakeClient(seed: Seed) {
  const upserts: Row[] = []
  const from = (table: string) => {
    const chain = {
      select: () => chain,
      eq: () => chain,
      gte: () => chain,
      maybeSingle: async () =>
        table === 'user_streaks' ? { data: seed.user_streaks ?? null } : { data: null },
      upsert: async (row: Row) => { upserts.push(row); return { data: row, error: null } },
      // Les lectures d'activité résolvent la promesse via then()
      then: (resolve: (v: { data: unknown }) => void) =>
        resolve({ data: (seed as Record<string, Row[]>)[table] ?? [] }),
    }
    return chain
  }
  return { from, _upserts: upserts }
}

const asClient = (c: ReturnType<typeof fakeClient>) => c as unknown as SupabaseClient

describe('getStreak', () => {
  test('nouvel utilisateur sans activité → série 0, ligne upsertée', async () => {
    const client = fakeClient({ user_streaks: null })
    const view = await getStreak(asClient(client), 'u1')
    expect(view.currentStreak).toBe(0)
    expect(view.weeklyGoal).toBe(3)
    expect(client._upserts.length).toBe(1)
  })

  test('agrège workouts + progress + montre (≥10min) en jours actifs', async () => {
    const now = new Date()
    const iso = now.toISOString()
    const client = fakeClient({
      user_streaks: { weekly_goal: 3, current_streak: 0, longest_streak: 0, freezes_available: 0, last_finalized_week: null },
      workouts: [{ completed_at: iso }],
      progress: [{ completed_at: iso }],
      smartwatch_sessions: [{ started_at: iso, duration_seconds: 900 }, { started_at: iso, duration_seconds: 120 }],
    })
    const view = await getStreak(asClient(client), 'u1')
    // 3 sources mais le même jour → 1 jour actif ; la session <10min est ignorée
    expect(view.activeDaysThisWeek).toBe(1)
  })
})
