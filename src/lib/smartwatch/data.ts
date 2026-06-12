import type { SupabaseClient } from '@supabase/supabase-js'
import { generateDemoMetrics, generateDemoWeekly, generateDemoSessions } from './demo-data'
import type { HealthMetrics, SmartWatchSession, WeeklyData, FitnessGoals, SmartWatchConnection } from './types'

export interface SmartwatchDashboard {
  isDemo: boolean
  connections: SmartWatchConnection[]
  today: HealthMetrics
  weekly: WeeklyData[]
  sessions: SmartWatchSession[]
  goals: FitnessGoals
}

const DEFAULT_GOALS: FitnessGoals = {
  steps_daily: 10000,
  calories_daily: 500,
  active_minutes_daily: 30,
  sleep_minutes_daily: 480,
  water_ml_daily: 2000,
  workouts_weekly: 4,
}

// Assemble les données du tableau de bord « montre » (réelles si un appareil est
// connecté, sinon démo). Partagé entre la route /api/smartwatch/data et la page
// serveur → la page peut pré-charger ces données et s'ouvrir immédiatement.
export async function getSmartwatchDashboard(supabase: SupabaseClient, userId: string): Promise<SmartwatchDashboard> {
  const today = new Date().toISOString().split('T')[0]
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]

  // 5 requêtes indépendantes → en parallèle.
  const [connRes, todayRes, weeklyRes, sessionsRes, goalsRes] = await Promise.all([
    supabase.from('smartwatch_connections').select('*').eq('user_id', userId).eq('is_active', true),
    supabase.from('health_metrics').select('*').eq('user_id', userId).eq('date', today),
    supabase.from('health_metrics').select('*').eq('user_id', userId).gte('date', weekAgo).order('date', { ascending: true }),
    supabase.from('smartwatch_sessions').select('*').eq('user_id', userId).order('started_at', { ascending: false }).limit(10),
    supabase.from('fitness_goals').select('*').eq('user_id', userId).maybeSingle(),
  ])

  const connections = (connRes.data ?? []) as SmartWatchConnection[]
  // Plusieurs sources possibles aujourd'hui (démo + fitbit) → on privilégie la
  // métrique d'un appareil réellement connecté, sinon la première dispo.
  const todayList = todayRes.data ?? []
  const realMetrics = todayList.find(m => connections.some(c => c.provider === m.source)) ?? todayList[0] ?? null
  const weeklyMetrics = weeklyRes.data
  const sessions = sessionsRes.data
  const goals = goalsRes.data

  const hasRealDevice = connections.length > 0
  const todayMetrics = (realMetrics ?? generateDemoMetrics(today)) as HealthMetrics

  const weeklyData: WeeklyData[] = weeklyMetrics && weeklyMetrics.length > 0
    ? weeklyMetrics.map(m => ({
        day: new Date(m.date).toLocaleDateString('fr-FR', { weekday: 'short' }).slice(0, 3),
        steps: m.steps ?? 0,
        calories: m.calories_burned ?? 0,
        activeMinutes: m.active_minutes ?? 0,
        heartRate: m.heart_rate_avg,
      }))
    : generateDemoWeekly()

  const sessionsData = (sessions && sessions.length > 0 ? sessions : generateDemoSessions()) as SmartWatchSession[]

  return {
    isDemo: !hasRealDevice,
    connections,
    today: todayMetrics,
    weekly: weeklyData,
    sessions: sessionsData,
    goals: (goals ?? DEFAULT_GOALS) as FitnessGoals,
  }
}
