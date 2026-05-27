import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateDemoMetrics, generateDemoWeekly, generateDemoSessions } from '@/lib/smartwatch/demo-data'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const today = new Date().toISOString().split('T')[0]

  // Try to load real connections
  const { data: connections } = await supabase
    .from('smartwatch_connections')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)

  // Try to load real metrics
  const { data: realMetrics } = await supabase
    .from('health_metrics')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today)
    .single()

  // Try to load weekly metrics
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]
  const { data: weeklyMetrics } = await supabase
    .from('health_metrics')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', weekAgo)
    .order('date', { ascending: true })

  // Try to load sessions
  const { data: sessions } = await supabase
    .from('smartwatch_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('started_at', { ascending: false })
    .limit(10)

  // Try to load goals
  const { data: goals } = await supabase
    .from('fitness_goals')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const hasRealDevice = (connections ?? []).length > 0
  const todayMetrics = realMetrics ?? generateDemoMetrics(today)

  // Build weekly data from real data or demo
  const demoWeekly = generateDemoWeekly()
  const weeklyData = weeklyMetrics && weeklyMetrics.length > 0
    ? weeklyMetrics.map(m => ({
        day: new Date(m.date).toLocaleDateString('fr-FR', { weekday: 'short' }).slice(0, 3),
        steps: m.steps ?? 0,
        calories: m.calories_burned ?? 0,
        activeMinutes: m.active_minutes ?? 0,
        heartRate: m.heart_rate_avg,
      }))
    : demoWeekly

  const sessionsData = sessions && sessions.length > 0 ? sessions : generateDemoSessions()

  const defaultGoals = {
    steps_daily: 10000,
    calories_daily: 500,
    active_minutes_daily: 30,
    sleep_minutes_daily: 480,
    water_ml_daily: 2000,
    workouts_weekly: 4,
  }

  return NextResponse.json({
    isDemo: !hasRealDevice,
    connections: connections ?? [],
    today: todayMetrics,
    weekly: weeklyData,
    sessions: sessionsData,
    goals: goals ?? defaultGoals,
  })
}
