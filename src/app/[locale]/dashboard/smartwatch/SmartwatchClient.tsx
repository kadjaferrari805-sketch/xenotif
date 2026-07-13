'use client'

import { useState, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import {
  Watch, RefreshCw, Loader2, Footprints, Flame, Heart,
  Zap, Moon, Droplets, MapPin, TrendingUp, Brain,
  Wifi,
} from 'lucide-react'
import { ActivityRings } from '@/components/dashboard/smartwatch/ActivityRings'
import { WeeklyChart } from '@/components/dashboard/smartwatch/WeeklyChart'
import { HeartRateDisplay } from '@/components/dashboard/smartwatch/HeartRateDisplay'
import { DeviceCard } from '@/components/dashboard/smartwatch/DeviceCard'
import { SessionCard } from '@/components/dashboard/smartwatch/SessionCard'
import { GoalRing } from '@/components/dashboard/smartwatch/GoalRing'
import { WATCH_PROVIDERS } from '@/lib/smartwatch/types'
import type {
  HealthMetrics, SmartWatchSession, WeeklyData,
  FitnessGoals, SmartWatchConnection,
} from '@/lib/smartwatch/types'

type Tab = 'overview' | 'devices' | 'history' | 'goals'

interface DashboardData {
  isDemo: boolean
  connections: SmartWatchConnection[]
  today: HealthMetrics
  weekly: WeeklyData[]
  sessions: SmartWatchSession[]
  goals: FitnessGoals
}

const TABS: { id: Tab; icon: React.ReactNode }[] = [
  { id: 'overview', icon: <TrendingUp size={14} /> },
  { id: 'devices',  icon: <Watch size={14} /> },
  { id: 'history',  icon: <Zap size={14} /> },
  { id: 'goals',    icon: <Flame size={14} /> },
]

const AI_REC_META = ['🏃', '💤', '💧', '❤️']

function formatSleep(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${h}h`
}

export function SmartwatchClient({ initialData }: { initialData: DashboardData }) {
  const t = useTranslations('dashboard.smartwatch')
  const locale = useLocale()
  const numLocale = locale === 'en' ? 'en-US' : 'fr-FR'
  const [tab, setTab] = useState<Tab>('overview')
  const [data, setData] = useState<DashboardData | null>(initialData)
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [chartMetric, setChartMetric] = useState<'steps' | 'calories' | 'activeMinutes'>('steps')

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/smartwatch/data')
      if (res.ok) setData(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])


  async function handleConnect(provider: string) {
    const res = await fetch('/api/smartwatch/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider }),
    })
    const json = await res.json()
    if (json.type === 'oauth' && json.url) {
      window.location.href = json.url
    } else {
      await fetchData()
    }
  }

  async function handleDisconnect(provider: string) {
    await fetch('/api/smartwatch/disconnect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider }),
    })
    await fetchData()
  }

  async function handleSync(provider?: string) {
    const target = provider ?? data?.connections?.[0]?.provider
    if (!target) return
    setSyncing(true)
    try {
      await fetch('/api/smartwatch/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: target }),
      })
      await fetchData()
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-sport-orange/10 border border-sport-orange/20 flex items-center justify-center">
            <Watch size={28} className="text-sport-orange animate-pulse" />
          </div>
          <p className="text-sport-gray text-sm">{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { today, weekly, sessions, goals, connections, isDemo } = data
  const connectedDevice = connections.find(c => c.is_active)

  // Si pas de montre connectée → afficher uniquement l'écran de connexion
  if (isDemo) {
    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto pb-28 md:pb-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-sport-orange/10 border border-sport-orange/20 flex items-center justify-center">
            <Watch size={20} className="text-sport-orange" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-sport-fg leading-none">{t('title')}</h1>
            <p className="text-[11px] text-sport-gray">{t('subtitle')}</p>
          </div>
        </div>

        <div className="bg-sport-card border border-sport-border rounded-2xl p-8 text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-sport-orange/10 border border-sport-orange/20 flex items-center justify-center mx-auto mb-6">
            <Watch size={36} className="text-sport-orange" />
          </div>
          <h2 className="text-xl font-black text-sport-fg mb-2">{t('connectTitle')}</h2>
          <p className="text-sport-gray text-sm max-w-md mx-auto mb-6">
            {t('connectDesc')}
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs text-sport-gray mb-8">
            {['⌚ Apple Watch', '🏃 Garmin', '💪 Fitbit', '📱 Samsung Health', '🔵 Polar', '⚡ Suunto'].map(w => (
              <span key={w} className="rounded-full border border-sport-border bg-sport-dark px-3 py-1.5 font-semibold">{w}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {WATCH_PROVIDERS.map(provider => {
            const connection = connections.find(c => c.provider === provider.id && c.is_active)
            return (
              <DeviceCard
                key={provider.id}
                provider={provider}
                connection={connection}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                onSync={handleSync}
              />
            )
          })}
        </div>

        <div className="bg-sport-card border border-sport-border rounded-2xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-sm">🔒</span>
          </div>
          <div>
            <p className="text-xs font-bold text-sport-fg mb-1">{t('securityTitle')}</p>
            <p className="text-[11px] text-sport-gray leading-relaxed">
              {t('securityDescShort')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const rings = [
    { value: today.active_minutes,  max: goals.active_minutes_daily, color: '#FF4500', label: t('rings.activity'), unit: 'min' },
    { value: today.calories_burned, max: goals.calories_daily,       color: '#A3FF00', label: t('rings.calories'), unit: 'kcal' },
    { value: today.steps,           max: goals.steps_daily,          color: '#38bdf8', label: t('rings.steps'),    unit: '' },
  ]

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-28 md:pb-10">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-sport-orange/10 border border-sport-orange/20 flex items-center justify-center">
              <Watch size={20} className="text-sport-orange" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-sport-fg leading-none">{t('title')}</h1>
              <p className="text-[11px] text-sport-gray">{t('subtitle')}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {connectedDevice && (
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">
              <Wifi size={11} className="text-[#1E7F5A]" />
              <span className="text-[11px] text-[#1E7F5A] font-bold">{t('synced')}</span>
            </div>
          )}

          {connectedDevice && (
            <button
              onClick={() => handleSync()}
              disabled={syncing}
              className="flex items-center gap-2 bg-sport-card border border-sport-border hover:border-sport-fg/20 rounded-xl px-4 py-2 text-xs font-bold text-sport-fg transition-all"
            >
              {syncing ? <Loader2 size={13} className="animate-spin text-sport-orange" /> : <RefreshCw size={13} className="text-sport-orange" />}
              {t('sync')}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-sport-card border border-sport-border rounded-xl p-1 mb-6 overflow-x-auto scrollbar-hide">
        {TABS.map(tb => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex-1 justify-center ${
              tab === tb.id
                ? 'bg-sport-orange text-sport-fg shadow-lg shadow-sport-orange/20'
                : 'text-sport-gray hover:text-sport-fg'
            }`}
          >
            {tb.icon}
            {t(`tabs.${tb.id}`)}
          </button>
        ))}
      </div>

      {/* ─── Overview ─────────────────────────────── */}
      {tab === 'overview' && (
        <div className="space-y-4">

          {/* Activity rings + metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Rings */}
            <div className="bg-sport-card border border-sport-border rounded-2xl p-6 flex flex-col items-center gap-4">
              <ActivityRings rings={rings} size={220} />
              <div className="w-full grid grid-cols-3 gap-2 text-center">
                {rings.map(r => (
                  <div key={r.label}>
                    <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ background: r.color }} />
                    <p className="text-xs font-black text-sport-fg">{r.value >= 1000 ? `${(r.value / 1000).toFixed(1)}k` : r.value}</p>
                    <p className="text-[9px] text-sport-gray">{r.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Today metrics grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Footprints size={15} className="text-sky-400" />,   label: t('metrics.stepsToday'),    value: today.steps.toLocaleString(numLocale), unit: `/ ${(goals.steps_daily / 1000).toFixed(0)}k`, color: '#38bdf8' },
                { icon: <Flame size={15} className="text-sport-orange" />,    label: t('metrics.caloriesBurned'), value: today.calories_burned.toString(),      unit: 'kcal',                                    color: '#FF4500' },
                { icon: <MapPin size={15} className="text-purple-400" />,     label: t('metrics.distance'),       value: `${(today.distance_meters / 1000).toFixed(1)}`, unit: 'km',                             color: '#a78bfa' },
                { icon: <Droplets size={15} className="text-cyan-400" />,     label: t('metrics.hydration'),      value: `${today.hydration_ml}`,               unit: 'ml',                                      color: '#22d3ee' },
                { icon: <Moon size={15} className="text-indigo-400" />,       label: t('metrics.sleep'),          value: formatSleep(today.sleep_minutes),      unit: today.sleep_score ? t('sleepScore', { score: today.sleep_score }) : '', color: '#818cf8' },
                { icon: <Zap size={15} className="text-sport-lime" />,        label: t('metrics.activeMinutes'),  value: today.active_minutes.toString(),       unit: `/ ${goals.active_minutes_daily} min`,     color: '#A3FF00' },
              ].map(m => (
                <div key={m.label} className="bg-sport-card border border-sport-border rounded-xl p-3 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${m.color}15` }}>
                      {m.icon}
                    </div>
                    <p className="text-[10px] text-sport-gray leading-tight">{m.label}</p>
                  </div>
                  <p className="text-lg font-black text-sport-fg leading-none">{m.value}</p>
                  {m.unit && <p className="text-[10px] text-sport-gray">{m.unit}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Heart rate */}
          <div className="bg-sport-card border border-sport-border rounded-2xl p-5">
            <p className="text-sm font-black text-sport-fg mb-4 flex items-center gap-2">
              <Heart size={14} className="text-red-400" /> {t('heartRateTitle')}
            </p>
            <HeartRateDisplay
              avg={today.heart_rate_avg ?? 72}
              max={today.heart_rate_max ?? 156}
              resting={today.heart_rate_resting ?? 58}
            />
          </div>

          {/* Weekly chart */}
          <div className="bg-sport-card border border-sport-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-black text-sport-fg">{t('weeklyActivity')}</p>
              <div className="flex gap-1">
                {(['steps', 'calories', 'activeMinutes'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setChartMetric(m)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                      chartMetric === m ? 'bg-sport-orange text-sport-fg' : 'text-sport-gray hover:text-sport-fg'
                    }`}
                  >
                    {t(`chartToggle.${m}`)}
                  </button>
                ))}
              </div>
            </div>
            <WeeklyChart
              data={weekly}
              metric={chartMetric}
              color={chartMetric === 'steps' ? '#38bdf8' : chartMetric === 'calories' ? '#FF4500' : '#A3FF00'}
            />
          </div>

          {/* AI Recommendations */}
          <div className="bg-gradient-to-br from-sport-orange/10 via-sport-card to-sport-card border border-sport-orange/20 rounded-2xl p-5">
            <p className="text-sm font-black text-sport-fg mb-4 flex items-center gap-2">
              <Brain size={14} className="text-sport-orange" /> {t('aiTitle')}
            </p>
            <div className="space-y-3">
              {(t.raw('aiRecs') as string[]).map((text, i) => (
                <div key={i} className="flex items-start gap-3 bg-sport-dark/60 rounded-xl p-3">
                  <span className="text-base mt-0.5">{AI_REC_META[i]}</span>
                  <p className="text-xs text-sport-gray leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Devices ───────────────────────────────── */}
      {tab === 'devices' && (
        <div className="space-y-4">
          <div className="bg-sport-card border border-sport-border rounded-2xl p-4">
            <p className="text-sm font-black text-sport-fg mb-1">{t('supportedTitle')}</p>
            <p className="text-xs text-sport-gray">{t('supportedDesc')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {WATCH_PROVIDERS.map(provider => {
              const connection = connections.find(c => c.provider === provider.id && c.is_active)
              return (
                <DeviceCard
                  key={provider.id}
                  provider={provider}
                  connection={connection}
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                  onSync={handleSync}
                />
              )
            })}
          </div>

          {/* Security note */}
          <div className="bg-sport-card border border-sport-border rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <span className="text-sm">🔒</span>
            </div>
            <div>
              <p className="text-xs font-bold text-sport-fg mb-1">{t('securityTitle')}</p>
              <p className="text-[11px] text-sport-gray leading-relaxed">
                {t('securityDescLong')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── History ───────────────────────────────── */}
      {tab === 'history' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-black text-sport-fg">{t('recentSessions')}</p>
            <span className="text-[11px] text-sport-gray">{t('sessionsCount', { count: sessions.length })}</span>
          </div>
          {sessions.map(s => (
            <SessionCard key={s.id} session={s} />
          ))}
          {sessions.length === 0 && (
            <div className="bg-sport-card border border-sport-border rounded-2xl p-10 text-center">
              <Watch size={32} className="text-sport-gray mx-auto mb-3" />
              <p className="text-sport-gray text-sm">{t('noSessions')}</p>
              <p className="text-[11px] text-sport-gray mt-1">{t('noSessionsHint')}</p>
            </div>
          )}
        </div>
      )}

      {/* ─── Goals ─────────────────────────────────── */}
      {tab === 'goals' && (
        <div className="space-y-4">
          <div className="bg-sport-card border border-sport-border rounded-2xl p-4 mb-2">
            <p className="text-sm font-black text-sport-fg mb-1">{t('dailyGoals')}</p>
            <p className="text-xs text-sport-gray">{t('dailyGoalsDesc')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <GoalRing label={t('goalLabels.steps')}        value={today.steps}           goal={goals.steps_daily}          unit={t('goalUnitSteps')} color="#38bdf8" icon="👟" />
            <GoalRing label={t('goalLabels.calories')}     value={today.calories_burned} goal={goals.calories_daily}       unit="kcal"               color="#FF4500" icon="🔥" />
            <GoalRing label={t('goalLabels.activeMinutes')} value={today.active_minutes}  goal={goals.active_minutes_daily} unit="min"                color="#A3FF00" icon="⚡" />
            <GoalRing label={t('goalLabels.sleep')}        value={today.sleep_minutes}   goal={goals.sleep_minutes_daily}  unit="min"                color="#818cf8" icon="🌙" />
            <GoalRing label={t('goalLabels.hydration')}    value={today.hydration_ml}    goal={goals.water_ml_daily}       unit="ml"                 color="#22d3ee" icon="💧" />
            <GoalRing label={t('goalLabels.sessionsWeek')} value={sessions.filter(s => {
              const d = new Date(s.started_at)
              const now = new Date()
              const weekAgo = new Date(now.getTime() - 7 * 86400000)
              return d >= weekAgo
            }).length} goal={goals.workouts_weekly} unit={t('goalUnitSessions')} color="#f59e0b" icon="💪" />
          </div>

          {/* Weekly summary */}
          <div className="bg-gradient-to-r from-sport-orange/10 to-sport-card border border-sport-orange/20 rounded-2xl p-5">
            <p className="text-sm font-black text-sport-fg mb-3 flex items-center gap-2">
              <TrendingUp size={14} className="text-sport-orange" /> {t('weekSummary')}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: t('summary.totalSteps'),    value: weekly.reduce((a, d) => a + d.steps, 0).toLocaleString(numLocale), unit: t('summaryUnitSteps') },
                { label: t('summary.caloriesBurned'), value: weekly.reduce((a, d) => a + d.calories, 0).toString(),            unit: 'kcal' },
                { label: t('summary.activeMinutes'), value: weekly.reduce((a, d) => a + d.activeMinutes, 0).toString(),        unit: 'min' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-xl font-black text-sport-fg">{s.value}</p>
                  <p className="text-[10px] text-sport-gray">{s.unit}</p>
                  <p className="text-[9px] text-sport-gray mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
