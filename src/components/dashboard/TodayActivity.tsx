'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { MapPin, Timer, Smartphone, Play, TrendingUp, Activity } from 'lucide-react'
import { ActivityRing } from './ActivityRing'
import { createClient } from '@/lib/supabase/client'

// ── Estimations (à partir du nombre de pas détecté par le capteur) ──
const STRIDE_M = 0.72
const KCAL_PER_STEP = 0.04
const STEP_GOAL = 10000
const KCAL_GOAL = 500
const ACTIVE_MIN_GOAL = 30
const MOVING_WINDOW_MS = 4000 // « en mouvement » si un pas a été détecté il y a < 4 s

// Couleurs façon Apple Fitness (palette de marque)
const C_MOVE = '#FF4500'   // calories (anneau externe)
const C_EXER = '#A3FF00'   // minutes actives (anneau médian)
const C_STEP = '#38bdf8'   // pas (anneau interne)

type Status = 'init' | 'needtap' | 'running' | 'denied' | 'nosensor'
type DMEWithPermission = { requestPermission?: () => Promise<'granted' | 'denied' | 'default'> }

export interface TrendDay {
  label: string
  steps: number
  isToday: boolean
}

interface TodayActivityProps {
  initialSteps: number
  initialActiveSec: number
  weekly: TrendDay[]
  dateLabel: string
}

const dayKey = () => 'xeno_live_' + new Date().toISOString().split('T')[0]

export function TodayActivity({ initialSteps, initialActiveSec, weekly, dateLabel }: TodayActivityProps) {
  const t = useTranslations('dashboard.liveActivity')
  const locale = useLocale()
  const numLocale = locale === 'en' ? 'en-US' : 'fr-FR'
  const [status, setStatus] = useState<Status>('init')
  const [steps, setSteps] = useState(0)         // total du jour
  const [activeSec, setActiveSec] = useState(0) // temps actif total du jour
  const [moving, setMoving] = useState(false)

  const baseSteps = useRef(0)
  const baseActive = useRef(0)
  const sessSteps = useRef(0)
  const sessActive = useRef(0)
  const avg = useRef(9.8)
  const wasPeak = useRef(false)
  const lastStepPerf = useRef(0)
  const lastStepWall = useRef(0)
  const gotData = useRef(false)

  // Cumul du jour = max(persistance locale, données déjà enregistrées en base)
  useEffect(() => {
    let savedSteps = 0, savedActive = 0
    try {
      const saved = JSON.parse(localStorage.getItem(dayKey()) ?? '{}') as { steps?: number; activeSec?: number }
      savedSteps = saved.steps ?? 0
      savedActive = saved.activeSec ?? 0
    } catch { /* ignore */ }
    baseSteps.current = Math.max(savedSteps, initialSteps)
    baseActive.current = Math.max(savedActive, initialActiveSec)
    setSteps(baseSteps.current)
    setActiveSec(baseActive.current)
  }, [initialSteps, initialActiveSec])

  // Enregistrement automatique (local + base de données best-effort)
  const persist = useCallback(async () => {
    const totalSteps = baseSteps.current + sessSteps.current
    const totalActive = baseActive.current + sessActive.current
    try { localStorage.setItem(dayKey(), JSON.stringify({ steps: totalSteps, activeSec: totalActive })) } catch { /* */ }
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('health_metrics').upsert({
          user_id: user.id,
          date: new Date().toISOString().split('T')[0],
          source: 'live',
          steps: totalSteps,
          calories_burned: Math.round(totalSteps * KCAL_PER_STEP),
          distance_meters: Math.round(totalSteps * STRIDE_M),
          active_minutes: Math.round(totalActive / 60),
        }, { onConflict: 'user_id,date,source' })
      }
    } catch { /* best-effort */ }
  }, [])

  const onMotion = useCallback((e: DeviceMotionEvent) => {
    const a = e.accelerationIncludingGravity ?? e.acceleration
    if (!a || a.x == null) return
    gotData.current = true
    const mag = Math.sqrt((a.x ?? 0) ** 2 + (a.y ?? 0) ** 2 + (a.z ?? 0) ** 2)
    avg.current = avg.current * 0.9 + mag * 0.1
    const dev = mag - avg.current
    const now = performance.now()
    if (dev > 2.0 && !wasPeak.current && now - lastStepPerf.current > 280) {
      sessSteps.current += 1
      lastStepPerf.current = now
      lastStepWall.current = Date.now()
      wasPeak.current = true
      setSteps(baseSteps.current + sessSteps.current)
    }
    if (dev < 1.0) wasPeak.current = false
  }, [])

  const beginListening = useCallback(() => {
    window.addEventListener('devicemotion', onMotion)
    setStatus('running')
    window.setTimeout(() => {
      if (!gotData.current) {
        window.removeEventListener('devicemotion', onMotion)
        setStatus('nosensor')
      }
    }, 3500)
  }, [onMotion])

  const start = useCallback(async () => {
    const DME = (typeof window !== 'undefined' ? window.DeviceMotionEvent : undefined) as unknown as DMEWithPermission | undefined
    if (!DME) { setStatus('nosensor'); return }
    if (typeof DME.requestPermission === 'function') {
      try {
        const res = await DME.requestPermission()
        if (res !== 'granted') { setStatus('denied'); return }
      } catch { setStatus('denied'); return }
    }
    beginListening()
  }, [beginListening])

  // Démarrage AUTOMATIQUE
  useEffect(() => {
    const DME = (typeof window !== 'undefined' ? window.DeviceMotionEvent : undefined) as unknown as DMEWithPermission | undefined
    if (!DME) { setStatus('nosensor'); return }
    if (typeof DME.requestPermission === 'function') {
      setStatus('needtap')
      const handler = () => void start()
      window.addEventListener('pointerdown', handler, { once: true })
      return () => window.removeEventListener('pointerdown', handler)
    }
    beginListening()
    return () => window.removeEventListener('devicemotion', onMotion)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Chronomètre : compte uniquement pendant le mouvement
  useEffect(() => {
    if (status !== 'running') return
    const id = window.setInterval(() => {
      const isMoving = Date.now() - lastStepWall.current < MOVING_WINDOW_MS
      setMoving(isMoving)
      if (isMoving) {
        sessActive.current += 1
        setActiveSec(baseActive.current + sessActive.current)
      }
    }, 1000)
    return () => window.clearInterval(id)
  }, [status])

  // Enregistrement automatique (toutes les 15 s + en quittant)
  useEffect(() => {
    if (status !== 'running') return
    const id = window.setInterval(() => void persist(), 15000)
    const onHide = () => void persist()
    window.addEventListener('pagehide', onHide)
    document.addEventListener('visibilitychange', onHide)
    return () => {
      window.clearInterval(id)
      window.removeEventListener('pagehide', onHide)
      document.removeEventListener('visibilitychange', onHide)
      void persist()
    }
  }, [status, persist])

  useEffect(() => () => { window.removeEventListener('devicemotion', onMotion) }, [onMotion])

  // ── Valeurs dérivées (temps réel) ──
  const calories = Math.round(steps * KCAL_PER_STEP)
  const distanceM = Math.round(steps * STRIDE_M)
  const distanceKm = (distanceM / 1000).toFixed(2)
  const activeMin = Math.round(activeSec / 60)
  const mm = String(Math.floor(activeSec / 60)).padStart(2, '0')
  const ss = String(activeSec % 60).padStart(2, '0')

  // Tendance 7 jours : la barre du jour suit la valeur live
  const trend = weekly.map(d => (d.isToday ? { ...d, steps: Math.max(d.steps, steps) } : d))
  const trendMax = Math.max(STEP_GOAL, ...trend.map(d => d.steps))
  const weekTotal = trend.reduce((acc, d) => acc + d.steps, 0)

  const rings = [
    { value: calories,  max: KCAL_GOAL,        color: C_MOVE, label: t('move') },
    { value: activeMin, max: ACTIVE_MIN_GOAL,  color: C_EXER, label: t('exercise') },
    { value: steps,     max: STEP_GOAL,        color: C_STEP, label: t('steps') },
  ]

  const ringStats = [
    { color: C_MOVE, label: t('move'),     value: calories, goal: KCAL_GOAL,       unit: 'KCAL' },
    { color: C_EXER, label: t('exercise'), value: activeMin, goal: ACTIVE_MIN_GOAL, unit: 'MIN' },
    { color: C_STEP, label: t('steps'),    value: steps,    goal: STEP_GOAL,       unit: t('stepsUnit').toUpperCase() },
  ]

  return (
    <>
      {/* ─── Hero : anneaux d'activité temps réel ─── */}
      <div className="relative overflow-hidden rounded-3xl border border-sport-border bg-gradient-to-br from-sport-card via-sport-card to-sport-dark p-6 md:p-7 mb-6">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sport-orange/10 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-sport-lime/10 blur-3xl" />

        {/* Header : date + statut */}
        <div className="relative flex items-start justify-between gap-3 mb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-sport-gray">{t('title')}</p>
            <p className="text-lg md:text-xl font-black text-white leading-tight first-letter:uppercase">{dateLabel}</p>
          </div>

          {status === 'running' ? (
            <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${moving ? 'border-red-500/40 bg-red-500/10 text-red-400' : 'border-sport-lime/40 bg-sport-lime/10 text-sport-lime'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${moving ? 'bg-red-500 animate-pulse' : 'bg-sport-lime'}`} />
              {t('liveBadge')}
            </span>
          ) : status === 'nosensor' ? (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-sport-border bg-sport-dark/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-sport-gray">
              <Smartphone size={12} /> {t('daySaved')}
            </span>
          ) : (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-sport-border bg-sport-dark/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-sport-gray">
              <Activity size={12} /> {t('phoneSensor')}
            </span>
          )}
        </div>

        {/* Anneaux + détail par anneau */}
        <div className="relative flex flex-col sm:flex-row items-center gap-7 sm:gap-9">
          <ActivityRing rings={rings} size={196} strokeWidth={17}>
            <span className="text-[28px] font-black text-white tabular-nums leading-none">{steps.toLocaleString(numLocale)}</span>
            <span className="text-[9px] font-bold uppercase tracking-[2px] text-sport-gray mt-1.5">{t('stepsUnit')}</span>
          </ActivityRing>

          <div className="flex-1 w-full space-y-4">
            {ringStats.map(s => {
              const pct = Math.min(s.value / Math.max(s.goal, 1), 1) * 100
              return (
                <div key={s.label}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-sport-gray">
                      <span className="h-2 w-2 rounded-full" style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }} />
                      {s.label}
                    </span>
                    <span className="text-sm font-black tabular-nums" style={{ color: s.color }}>
                      {s.value.toLocaleString(numLocale)}
                      <span className="text-sport-gray font-bold"> / {s.goal.toLocaleString(numLocale)} {s.unit}</span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-sport-dark">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tuiles live : distance + durée active */}
        <div className="relative mt-6 grid grid-cols-2 gap-3">
          {[
            { Icon: MapPin, label: t('distance'),       value: `${distanceKm} km`, color: C_STEP },
            { Icon: Timer,  label: t('activeDuration'), value: `${mm}:${ss}`,      color: '#9aa2ad' },
          ].map(({ Icon, label, value, color }) => (
            <div key={label} className="flex items-center gap-3 rounded-2xl border border-sport-border bg-sport-dark/40 px-4 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: `${color}1f`, border: `1px solid ${color}40` }}>
                <Icon size={15} style={{ color }} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-sport-gray leading-none">{label}</p>
                <p className="text-lg font-black text-white tabular-nums leading-tight">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pied : statut / invite selon l'état du capteur */}
        <div className="relative mt-5">
          {status === 'running' && (
            <p className="text-center text-[10px] text-sport-gray">{t('autoSaved')}</p>
          )}

          {status === 'needtap' && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-sport-lime/20 bg-sport-lime/5 px-4 py-4 text-center">
              <p className="text-sm font-bold text-white">{t('tapToStart')}</p>
              <p className="max-w-xs text-[11px] leading-relaxed text-sport-gray">{t('tapHint')}</p>
              <button
                onClick={start}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sport-lime px-5 py-2.5 text-sm font-black text-sport-dark transition-all hover:brightness-110"
              >
                <Play size={14} fill="currentColor" /> {t('startTracking')}
              </button>
            </div>
          )}

          {status === 'denied' && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-4 text-center">
              <p className="max-w-xs text-[11px] leading-relaxed text-red-400">{t('denied')}</p>
              <button
                onClick={start}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sport-lime px-5 py-2.5 text-sm font-black text-sport-dark transition-all hover:brightness-110"
              >
                <Play size={14} fill="currentColor" /> {t('startTracking')}
              </button>
            </div>
          )}

          {status === 'nosensor' && (
            <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-sport-gray">
              <Smartphone size={12} /> {t('openOnPhone')}
            </p>
          )}
        </div>
      </div>

      {/* ─── Tendance 7 jours ─── */}
      <div className="rounded-3xl border border-sport-border bg-sport-card p-5 md:p-6 mb-6">
        <div className="mb-5 flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm font-black text-white">
            <TrendingUp size={15} className="text-sport-orange" /> {t('trendTitle')}
          </p>
          <span className="text-[11px] font-semibold text-sport-gray">
            {t('trendTotal', { steps: weekTotal.toLocaleString(numLocale) })}
          </span>
        </div>
        <div className="flex h-32 items-end justify-between gap-2 sm:gap-3">
          {trend.map((d, i) => {
            const pct = Math.min((d.steps / trendMax) * 100, 100)
            return (
              <div key={`${d.label}-${i}`} className="flex flex-1 flex-col items-center gap-2">
                <span className={`text-[9px] font-bold tabular-nums ${d.isToday ? 'text-white' : 'text-sport-gray'}`}>
                  {d.steps >= 1000 ? `${(d.steps / 1000).toFixed(1)}k` : d.steps || ''}
                </span>
                <div className="relative flex w-full flex-1 items-end" style={{ minHeight: 0 }}>
                  <div className="absolute bottom-0 w-full rounded-md bg-sport-dark" style={{ height: '100%' }} />
                  <div
                    className="relative w-full rounded-md transition-all duration-1000"
                    style={{
                      height: `${Math.max(pct, 3)}%`,
                      background: d.isToday ? C_EXER : C_STEP,
                      opacity: d.isToday ? 1 : 0.55,
                      boxShadow: d.isToday ? `0 0 10px ${C_EXER}80` : 'none',
                    }}
                  />
                </div>
                <span className={`text-[9px] font-bold ${d.isToday ? 'text-white' : 'text-sport-gray'}`}>{d.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
