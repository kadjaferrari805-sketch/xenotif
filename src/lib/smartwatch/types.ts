export type WatchProvider =
  | 'apple_health'
  | 'google_fit'
  | 'fitbit'
  | 'garmin'
  | 'samsung_health'
  | 'polar'
  | 'huawei_health'
  | 'xiaomi_health'
  | 'wear_os'

export interface WatchProviderMeta {
  id: WatchProvider
  name: string
  logo: string
  color: string
  bgColor: string
  oauthSupported: boolean
  description: string
  comingSoon?: boolean
}

export const WATCH_PROVIDERS: WatchProviderMeta[] = [
  {
    id: 'apple_health',
    name: 'Apple Watch',
    logo: '🍎',
    color: '#ffffff',
    bgColor: '#1c1c1e',
    oauthSupported: false,
    description: 'Via Health Export CSV',
    comingSoon: false,
  },
  {
    id: 'google_fit',
    name: 'Google Fit',
    logo: '🏃',
    color: '#4285F4',
    bgColor: '#0d1117',
    oauthSupported: true,
    description: 'OAuth 2.0 direct',
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    logo: '💪',
    color: '#00B0B9',
    bgColor: '#011f2b',
    oauthSupported: true,
    description: 'Fitbit Web API',
  },
  {
    id: 'garmin',
    name: 'Garmin',
    logo: '⌚',
    color: '#007CC2',
    bgColor: '#001a2e',
    oauthSupported: true,
    description: 'Garmin Health API',
  },
  {
    id: 'samsung_health',
    name: 'Samsung Galaxy',
    logo: '🔵',
    color: '#1428A0',
    bgColor: '#070d2a',
    oauthSupported: false,
    description: 'Bientôt disponible',
    comingSoon: true,
  },
  {
    id: 'polar',
    name: 'Polar',
    logo: '❄️',
    color: '#D0021B',
    bgColor: '#1a0003',
    oauthSupported: true,
    description: 'Polar AccessLink API',
  },
  {
    id: 'huawei_health',
    name: 'Huawei Watch',
    logo: '🟥',
    color: '#CF0A2C',
    bgColor: '#1a0006',
    oauthSupported: false,
    description: 'Bientôt disponible',
    comingSoon: true,
  },
  {
    id: 'xiaomi_health',
    name: 'Xiaomi Smart Band',
    logo: '🟠',
    color: '#FF6900',
    bgColor: '#1a0c00',
    oauthSupported: false,
    description: 'Bientôt disponible',
    comingSoon: true,
  },
]

export interface SmartWatchConnection {
  id: string
  user_id: string
  provider: WatchProvider
  device_name: string | null
  device_model: string | null
  is_active: boolean
  last_sync_at: string | null
  created_at: string
}

export interface HealthMetrics {
  id?: string
  user_id?: string
  date: string
  steps: number
  calories_burned: number
  heart_rate_avg: number | null
  heart_rate_max: number | null
  heart_rate_resting: number | null
  active_minutes: number
  distance_meters: number
  sleep_minutes: number
  sleep_score: number | null
  weight_kg: number | null
  hydration_ml: number
  source: string
}

export interface SmartWatchSession {
  id: string
  activity_type: string
  started_at: string
  ended_at: string
  duration_seconds: number
  calories_burned: number
  distance_meters: number
  avg_heart_rate: number | null
  max_heart_rate: number | null
  avg_pace_per_km: number | null
  elevation_gain_meters: number
  steps: number
  source: string
}

export interface FitnessGoals {
  steps_daily: number
  calories_daily: number
  active_minutes_daily: number
  sleep_minutes_daily: number
  water_ml_daily: number
  workouts_weekly: number
}

export interface WeeklyData {
  day: string
  steps: number
  calories: number
  activeMinutes: number
  heartRate: number | null
}
