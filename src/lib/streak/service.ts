// src/lib/streak/service.ts
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  reconcile, bucketActiveDaysByWeek,
  MIN_SMARTWATCH_SECONDS, type StreakState, type StreakView,
} from './core'

const DEFAULT_GOAL = 3
const LOOKBACK_DAYS = 77 // ~11 semaines

function defaultState(goal = DEFAULT_GOAL): StreakState {
  return { weeklyGoal: goal, currentStreak: 0, longestStreak: 0, freezesAvailable: 0, lastFinalizedWeek: null }
}

type StreakRow = {
  weekly_goal: number
  current_streak: number
  longest_streak: number
  freezes_available: number
  last_finalized_week: string | null
}

function toState(row: StreakRow): StreakState {
  return {
    weeklyGoal: row.weekly_goal,
    currentStreak: row.current_streak,
    longestStreak: row.longest_streak,
    freezesAvailable: row.freezes_available,
    lastFinalizedWeek: row.last_finalized_week,
  }
}

async function loadActivityDates(supabase: SupabaseClient, userId: string, sinceISO: string): Promise<string[]> {
  const [w, p, s] = await Promise.all([
    supabase.from('workouts').select('completed_at').eq('user_id', userId).gte('completed_at', sinceISO),
    supabase.from('progress').select('completed_at').eq('user_id', userId).eq('completed', true).gte('completed_at', sinceISO),
    supabase.from('smartwatch_sessions').select('started_at, duration_seconds').eq('user_id', userId).gte('started_at', sinceISO),
  ])
  return [
    ...((w.data ?? []) as { completed_at: string }[]).map(r => r.completed_at),
    ...((p.data ?? []) as { completed_at: string }[]).map(r => r.completed_at),
    ...((s.data ?? []) as { started_at: string; duration_seconds: number | null }[])
      .filter(r => (r.duration_seconds ?? 0) >= MIN_SMARTWATCH_SECONDS).map(r => r.started_at),
  ].filter(Boolean) as string[]
}

export async function getStreak(supabase: SupabaseClient, userId: string): Promise<StreakView> {
  const { data: row } = await supabase.from('user_streaks').select('*').eq('user_id', userId).maybeSingle()
  const state = row ? toState(row) : defaultState()

  const sinceISO = new Date(Date.now() - LOOKBACK_DAYS * 86400000).toISOString()
  const dates = await loadActivityDates(supabase, userId, sinceISO)
  const now = new Date()
  const { state: next, view } = reconcile(state, bucketActiveDaysByWeek(dates), now)

  await supabase.from('user_streaks').upsert({
    user_id: userId,
    weekly_goal: next.weeklyGoal,
    current_streak: next.currentStreak,
    longest_streak: next.longestStreak,
    freezes_available: next.freezesAvailable,
    last_finalized_week: next.lastFinalizedWeek,
    updated_at: now.toISOString(),
  }, { onConflict: 'user_id' })

  return view
}

export async function setGoal(supabase: SupabaseClient, userId: string, goal: number): Promise<StreakView> {
  const g = Math.max(2, Math.min(7, Math.round(goal)))
  await supabase.from('user_streaks').upsert(
    { user_id: userId, weekly_goal: g, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' },
  )
  return getStreak(supabase, userId)
}
