'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Watch, RefreshCw, Loader2, Footprints, Flame, Heart,
  Zap, Moon, Droplets, MapPin, TrendingUp, Brain, ChevronRight,
  Wifi, WifiOff,
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

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: <TrendingUp size={14} /> },
  { id: 'devices',  label: 'Appareils',        icon: <Watch size={14} /> },
  { id: 'history',  label: 'Historique',        icon: <Zap size={14} /> },
  { id: 'goals',    label: 'Objectifs',          icon: <Flame size={14} /> },
]

const AI_RECS = [
  { icon: '🏃', text: 'Tu as atteint 84% de ton objectif de pas aujourd\'hui — un sprint de 10 min suffit pour boucler ça !', color: '#FF4500' },
  { icon: '💤', text: 'Ton sommeil est légèrement en dessous de 7h. Couche-toi 30 min plus tôt ce soir pour optimiser ta récupération.', color: '#6366f1' },
  { icon: '💧', text: 'Hydratation à 87% — bois 250ml avant ta prochaine séance pour maintenir ta performance.', color: '#38bdf8' },
  { icon: '❤️', text: 'Ta fréquence cardiaque au repos de 58 bpm indique une excellente condition cardiovasculaire. Continue !', color: '#ef4444' },
]

function formatSleep(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${h}h`
}

export default function SmartWatchPage() {
  const [tab, setTab] = useState<Tab>('overview')
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
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

  useEffect(() => { fetchData() }, [fetchData])

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
          <p className="text-sport-gray text-sm">Chargement des données fitness...</p>
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
            <h1 className="text-xl md:text-2xl font-black text-white leading-none">Montre Connectée</h1>
            <p className="text-[11px] text-sport-gray">Synchronisation fitness en temps réel</p>
          </div>
        </div>

        <div className="bg-sport-card border border-sport-border rounded-2xl p-8 text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-sport-orange/10 border border-sport-orange/20 flex items-center justify-center mx-auto mb-6">
            <Watch size={36} className="text-sport-orange" />
          </div>
          <h2 className="text-xl font-black text-white mb-2">Connecte ta montre</h2>
          <p className="text-sport-gray text-sm max-w-md mx-auto mb-6">
            Synchronise ta montre connectée pour afficher tes vraies données de santé — pas, calories, fréquence cardiaque, sommeil et bien plus.
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
            <p className="text-xs font-bold text-white mb-1">Données chiffrées & RGPD</p>
            <p className="text-[11px] text-sport-gray leading-relaxed">
              Tes données de santé sont chiffrées et stockées sur des serveurs sécurisés en Europe. Aucune donnée n&apos;est revendue à des tiers.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const rings = [
    { value: today.active_minutes,  max: goals.active_minutes_daily, color: '#FF4500', label: 'Activité',  unit: 'min' },
    { value: today.calories_burned, max: goals.calories_daily,       color: '#A3FF00', label: 'Calories',  unit: 'kcal' },
    { value: today.steps,           max: goals.steps_daily,          color: '#38bdf8', label: 'Pas',       unit: '' },
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
              <h1 className="text-xl md:text-2xl font-black text-white leading-none">Montre Connectée</h1>
              <p className="text-[11px] text-sport-gray">Synchronisation fitness en temps réel</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {connectedDevice && (
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">
              <Wifi size={11} className="text-emerald-400" />
              <span className="text-[11px] text-emerald-400 font-bold">Synchronisé</span>
            </div>
          )}

          {connectedDevice && (
            <button
              onClick={() => handleSync()}
              disabled={syncing}
              className="flex items-center gap-2 bg-sport-card border border-sport-border hover:border-white/20 rounded-xl px-4 py-2 text-xs font-bold text-white transition-all"
            >
              {syncing ? <Loader2 size={13} className="animate-spin text-sport-orange" /> : <RefreshCw size={13} className="text-sport-orange" />}
              Synchroniser
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-sport-card border border-sport-border rounded-xl p-1 mb-6 overflow-x-auto scrollbar-hide">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex-1 justify-center ${
              tab === t.id
                ? 'bg-sport-orange text-white shadow-lg shadow-sport-orange/20'
                : 'text-sport-gray hover:text-white'
            }`}
          >
            {t.icon}
            {t.label}
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
              <ActivityRings rings={rings} size={180} />
              <div className="w-full grid grid-cols-3 gap-2 text-center">
                {rings.map(r => (
                  <div key={r.label}>
                    <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ background: r.color }} />
                    <p className="text-xs font-black text-white">{r.value >= 1000 ? `${(r.value / 1000).toFixed(1)}k` : r.value}</p>
                    <p className="text-[9px] text-sport-gray">{r.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Today metrics grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Footprints size={15} className="text-sky-400" />,   label: 'Pas aujourd\'hui', value: today.steps.toLocaleString('fr-FR'), unit: `/ ${(goals.steps_daily / 1000).toFixed(0)}k`, color: '#38bdf8' },
                { icon: <Flame size={15} className="text-sport-orange" />,    label: 'Calories brûlées',  value: today.calories_burned.toString(),     unit: 'kcal',                                    color: '#FF4500' },
                { icon: <MapPin size={15} className="text-purple-400" />,     label: 'Distance',          value: `${(today.distance_meters / 1000).toFixed(1)}`, unit: 'km',                             color: '#a78bfa' },
                { icon: <Droplets size={15} className="text-cyan-400" />,     label: 'Hydratation',       value: `${today.hydration_ml}`,             unit: 'ml',                                      color: '#22d3ee' },
                { icon: <Moon size={15} className="text-indigo-400" />,       label: 'Sommeil',           value: formatSleep(today.sleep_minutes),    unit: today.sleep_score ? `score ${today.sleep_score}` : '', color: '#818cf8' },
                { icon: <Zap size={15} className="text-sport-lime" />,        label: 'Minutes actives',   value: today.active_minutes.toString(),     unit: `/ ${goals.active_minutes_daily} min`,     color: '#A3FF00' },
              ].map(m => (
                <div key={m.label} className="bg-sport-card border border-sport-border rounded-xl p-3 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${m.color}15` }}>
                      {m.icon}
                    </div>
                    <p className="text-[10px] text-sport-gray leading-tight">{m.label}</p>
                  </div>
                  <p className="text-lg font-black text-white leading-none">{m.value}</p>
                  {m.unit && <p className="text-[10px] text-sport-gray">{m.unit}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Heart rate */}
          <div className="bg-sport-card border border-sport-border rounded-2xl p-5">
            <p className="text-sm font-black text-white mb-4 flex items-center gap-2">
              <Heart size={14} className="text-red-400" /> Fréquence cardiaque
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
              <p className="text-sm font-black text-white">Activité hebdomadaire</p>
              <div className="flex gap-1">
                {(['steps', 'calories', 'activeMinutes'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setChartMetric(m)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                      chartMetric === m ? 'bg-sport-orange text-white' : 'text-sport-gray hover:text-white'
                    }`}
                  >
                    {m === 'steps' ? 'Pas' : m === 'calories' ? 'Cal' : 'Actif'}
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
            <p className="text-sm font-black text-white mb-4 flex items-center gap-2">
              <Brain size={14} className="text-sport-orange" /> Coach IA — Recommandations personnalisées
            </p>
            <div className="space-y-3">
              {AI_RECS.map((r, i) => (
                <div key={i} className="flex items-start gap-3 bg-sport-dark/60 rounded-xl p-3">
                  <span className="text-base mt-0.5">{r.icon}</span>
                  <p className="text-xs text-sport-gray leading-relaxed">{r.text}</p>
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
            <p className="text-sm font-black text-white mb-1">Appareils supportés</p>
            <p className="text-xs text-sport-gray">Connecte ta montre pour synchroniser automatiquement tes données fitness après chaque séance.</p>
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
              <p className="text-xs font-bold text-white mb-1">Données chiffrées & RGPD</p>
              <p className="text-[11px] text-sport-gray leading-relaxed">
                Tes données de santé sont chiffrées et stockées sur des serveurs sécurisés en Europe.
                Tu peux supprimer toutes tes données à tout moment depuis ton profil. Aucune donnée n&apos;est revendue à des tiers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── History ───────────────────────────────── */}
      {tab === 'history' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-black text-white">Séances récentes</p>
            <span className="text-[11px] text-sport-gray">{sessions.length} séances</span>
          </div>
          {sessions.map(s => (
            <SessionCard key={s.id} session={s} />
          ))}
          {sessions.length === 0 && (
            <div className="bg-sport-card border border-sport-border rounded-2xl p-10 text-center">
              <Watch size={32} className="text-sport-gray mx-auto mb-3" />
              <p className="text-sport-gray text-sm">Aucune séance enregistrée.</p>
              <p className="text-[11px] text-sport-gray mt-1">Connecte ta montre pour voir ton historique.</p>
            </div>
          )}
        </div>
      )}

      {/* ─── Goals ─────────────────────────────────── */}
      {tab === 'goals' && (
        <div className="space-y-4">
          <div className="bg-sport-card border border-sport-border rounded-2xl p-4 mb-2">
            <p className="text-sm font-black text-white mb-1">Objectifs quotidiens</p>
            <p className="text-xs text-sport-gray">Tes objectifs sont mis à jour en temps réel depuis ta montre connectée.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <GoalRing label="Pas quotidiens"    value={today.steps}           goal={goals.steps_daily}          unit="pas"  color="#38bdf8" icon="👟" />
            <GoalRing label="Calories brûlées"  value={today.calories_burned} goal={goals.calories_daily}       unit="kcal" color="#FF4500" icon="🔥" />
            <GoalRing label="Minutes actives"   value={today.active_minutes}  goal={goals.active_minutes_daily} unit="min"  color="#A3FF00" icon="⚡" />
            <GoalRing label="Sommeil"           value={today.sleep_minutes}   goal={goals.sleep_minutes_daily}  unit="min"  color="#818cf8" icon="🌙" />
            <GoalRing label="Hydratation"       value={today.hydration_ml}    goal={goals.water_ml_daily}       unit="ml"   color="#22d3ee" icon="💧" />
            <GoalRing label="Séances / semaine" value={sessions.filter(s => {
              const d = new Date(s.started_at)
              const now = new Date()
              const weekAgo = new Date(now.getTime() - 7 * 86400000)
              return d >= weekAgo
            }).length} goal={goals.workouts_weekly} unit="séances" color="#f59e0b" icon="💪" />
          </div>

          {/* Weekly summary */}
          <div className="bg-gradient-to-r from-sport-orange/10 to-sport-card border border-sport-orange/20 rounded-2xl p-5">
            <p className="text-sm font-black text-white mb-3 flex items-center gap-2">
              <TrendingUp size={14} className="text-sport-orange" /> Bilan de la semaine
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Pas total',    value: weekly.reduce((a, d) => a + d.steps, 0).toLocaleString('fr-FR'),     unit: 'pas' },
                { label: 'Cal. brûlées', value: weekly.reduce((a, d) => a + d.calories, 0).toString(),               unit: 'kcal' },
                { label: 'Min. actives', value: weekly.reduce((a, d) => a + d.activeMinutes, 0).toString(),          unit: 'min' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-xl font-black text-white">{s.value}</p>
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
