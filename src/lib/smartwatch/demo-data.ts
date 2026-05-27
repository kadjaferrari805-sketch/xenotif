import type { HealthMetrics, SmartWatchSession, WeeklyData } from './types'

export function generateDemoMetrics(date: string): HealthMetrics {
  return {
    date,
    steps: 8432,
    calories_burned: 487,
    heart_rate_avg: 72,
    heart_rate_max: 156,
    heart_rate_resting: 58,
    active_minutes: 47,
    distance_meters: 6200,
    sleep_minutes: 432,
    sleep_score: 78,
    weight_kg: 74.5,
    hydration_ml: 1750,
    source: 'demo',
  }
}

export function generateDemoWeekly(): WeeklyData[] {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
  const stepsBase  = [7200, 9800, 5400, 11200, 8800, 12400, 6100]
  const calBase    = [380, 520, 290, 610, 460, 680, 320]
  const activeBase = [35, 55, 22, 68, 44, 72, 28]
  const hrBase     = [71, 74, 69, 76, 72, 78, 70]

  return days.map((day, i) => ({
    day,
    steps:         stepsBase[i],
    calories:      calBase[i],
    activeMinutes: activeBase[i],
    heartRate:     hrBase[i],
  }))
}

export function generateDemoSessions(): SmartWatchSession[] {
  const now = new Date()
  const sessions: SmartWatchSession[] = [
    {
      id: 'demo-1',
      activity_type: 'running',
      started_at: new Date(now.getTime() - 86400000 * 1).toISOString(),
      ended_at:   new Date(now.getTime() - 86400000 * 1 + 2700000).toISOString(),
      duration_seconds: 2700,
      calories_burned: 312,
      distance_meters: 5400,
      avg_heart_rate: 158,
      max_heart_rate: 178,
      avg_pace_per_km: 500,
      elevation_gain_meters: 48,
      steps: 5200,
      source: 'demo',
    },
    {
      id: 'demo-2',
      activity_type: 'strength_training',
      started_at: new Date(now.getTime() - 86400000 * 2).toISOString(),
      ended_at:   new Date(now.getTime() - 86400000 * 2 + 3600000).toISOString(),
      duration_seconds: 3600,
      calories_burned: 280,
      distance_meters: 0,
      avg_heart_rate: 142,
      max_heart_rate: 168,
      avg_pace_per_km: null,
      elevation_gain_meters: 0,
      steps: 1800,
      source: 'demo',
    },
    {
      id: 'demo-3',
      activity_type: 'cycling',
      started_at: new Date(now.getTime() - 86400000 * 4).toISOString(),
      ended_at:   new Date(now.getTime() - 86400000 * 4 + 5400000).toISOString(),
      duration_seconds: 5400,
      calories_burned: 520,
      distance_meters: 24000,
      avg_heart_rate: 148,
      max_heart_rate: 172,
      avg_pace_per_km: null,
      elevation_gain_meters: 210,
      steps: 0,
      source: 'demo',
    },
    {
      id: 'demo-4',
      activity_type: 'yoga',
      started_at: new Date(now.getTime() - 86400000 * 5).toISOString(),
      ended_at:   new Date(now.getTime() - 86400000 * 5 + 2700000).toISOString(),
      duration_seconds: 2700,
      calories_burned: 145,
      distance_meters: 0,
      avg_heart_rate: 88,
      max_heart_rate: 112,
      avg_pace_per_km: null,
      elevation_gain_meters: 0,
      steps: 0,
      source: 'demo',
    },
    {
      id: 'demo-5',
      activity_type: 'hiit',
      started_at: new Date(now.getTime() - 86400000 * 6).toISOString(),
      ended_at:   new Date(now.getTime() - 86400000 * 6 + 1800000).toISOString(),
      duration_seconds: 1800,
      calories_burned: 385,
      distance_meters: 2100,
      avg_heart_rate: 172,
      max_heart_rate: 192,
      avg_pace_per_km: null,
      elevation_gain_meters: 0,
      steps: 2400,
      source: 'demo',
    },
  ]
  return sessions
}

export const ACTIVITY_LABELS: Record<string, string> = {
  running:           'Course à pied',
  cycling:           'Cyclisme',
  strength_training: 'Musculation',
  yoga:              'Yoga',
  hiit:              'HIIT',
  swimming:          'Natation',
  walking:           'Marche',
  crossfit:          'CrossFit',
  boxing:            'Boxe',
  stretching:        'Stretching',
}

export const ACTIVITY_ICONS: Record<string, string> = {
  running:           '🏃',
  cycling:           '🚴',
  strength_training: '💪',
  yoga:              '🧘',
  hiit:              '⚡',
  swimming:          '🏊',
  walking:           '🚶',
  crossfit:          '🔥',
  boxing:            '🥊',
  stretching:        '🤸',
}
