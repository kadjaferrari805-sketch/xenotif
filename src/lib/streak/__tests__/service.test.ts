// src/lib/streak/__tests__/service.test.ts
import { getStreak } from '../service'

// Faux client Supabase minimal : renvoie des données seedées par table.
function fakeClient(seed: {
  user_streaks?: any | null
  workouts?: any[]
  progress?: any[]
  smartwatch_sessions?: any[]
}) {
  const upserts: any[] = []
  const api: any = {
    _upserts: upserts,
    from(table: string) {
      const chain: any = {
        select: () => chain,
        eq: () => chain,
        gte: () => chain,
        maybeSingle: async () =>
          table === 'user_streaks' ? { data: seed.user_streaks ?? null } : { data: null },
        upsert: async (row: any) => { upserts.push(row); return { data: row, error: null } },
        // Les lectures d'activité résolvent la promesse via then()
        then: (resolve: any) => resolve({ data: (seed as any)[table] ?? [] }),
      }
      return chain
    },
  }
  return api
}

describe('getStreak', () => {
  test('nouvel utilisateur sans activité → série 0, ligne upsertée', async () => {
    const client = fakeClient({ user_streaks: null })
    const view = await getStreak(client, 'u1')
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
    const view = await getStreak(client, 'u1')
    // 3 sources mais le même jour → 1 jour actif ; la session <10min est ignorée
    expect(view.activeDaysThisWeek).toBe(1)
  })
})
