'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Footprints, Flame, MapPin, Timer, Smartphone, Play } from 'lucide-react'
import { ActivityRing } from './ActivityRing'
import { createClient } from '@/lib/supabase/client'

// Estimations
const STRIDE_M = 0.72
const KCAL_PER_STEP = 0.04
const STEP_GOAL = 10000
const KCAL_GOAL = 400
const DIST_GOAL_M = 5000
const MOVING_WINDOW_MS = 4000 // « en mouvement » si un pas a été détecté il y a < 4 s

type Status = 'init' | 'needtap' | 'running' | 'denied' | 'nosensor'
type DMEWithPermission = { requestPermission?: () => Promise<'granted' | 'denied' | 'default'> }

const dayKey = () => 'xeno_live_' + new Date().toISOString().split('T')[0]

export function LiveActivity() {
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

  // Charge le cumul du jour (persistance locale → activité du jour)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(dayKey()) ?? '{}') as { steps?: number; activeSec?: number }
      baseSteps.current = saved.steps ?? 0
      baseActive.current = saved.activeSec ?? 0
      setSteps(baseSteps.current)
      setActiveSec(baseActive.current)
    } catch { /* ignore */ }
  }, [])

  // Enregistre automatiquement (local + base de données best-effort)
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

  const calories = Math.round(steps * KCAL_PER_STEP)
  const distanceM = Math.round(steps * STRIDE_M)
  const distanceKm = (distanceM / 1000).toFixed(2)
  const mm = String(Math.floor(activeSec / 60)).padStart(2, '0')
  const ss = String(activeSec % 60).padStart(2, '0')

  const tracking = status === 'running' || status === 'init'

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-sport-card to-sport-dark border border-sport-border rounded-2xl p-6 mb-6">
      <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-sport-lime/10 blur-3xl" />

      <div className="relative flex items-center justify-between mb-5">
        <h2 className="text-sm font-black uppercase tracking-wider text-white">{t('title')}</h2>
        {status === 'running' ? (
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${moving ? 'border-red-500/40 bg-red-500/10 text-red-400' : 'border-sport-border bg-sport-dark/60 text-sport-gray'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${moving ? 'bg-red-500 animate-pulse' : 'bg-sport-gray'}`} />
            {moving ? t('moving') : t('paused')}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-sport-gray">
            <Smartphone size={12} /> {t('phoneSensor')}
          </span>
        )}
      </div>

      {tracking ? (
        <>
          <div className="relative flex flex-col sm:flex-row items-center gap-7">
            <ActivityRing
              rings={[
                { value: steps,     max: STEP_GOAL,   color: '#A3FF00', label: 'Pas' },
                { value: calories,  max: KCAL_GOAL,   color: '#FF4500', label: 'Calories' },
                { value: distanceM, max: DIST_GOAL_M, color: '#2563EB', label: 'Distance' },
              ]}
              size={172}
              strokeWidth={15}
            >
              <span className="text-[24px] font-black text-white tabular-nums">{steps.toLocaleString(numLocale)}</span>
              <span className="text-[9px] font-bold uppercase tracking-[2px] text-sport-gray mt-1">{t('stepsUnit')}</span>
            </ActivityRing>

            <div className="flex-1 w-full space-y-4">
              {[
                { Icon: Footprints, label: t('steps'),          value: steps.toLocaleString(numLocale), color: '#A3FF00' },
                { Icon: Flame,      label: t('calories'),       value: `${calories} kcal`,              color: '#FF4500' },
                { Icon: MapPin,     label: t('distance'),       value: `${distanceKm} km`,              color: '#2563EB' },
                { Icon: Timer,      label: t('activeDuration'), value: `${mm}:${ss}`,                   color: '#9aa2ad' },
              ].map(({ Icon, label, value, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: `${color}1f`, border: `1px solid ${color}40` }}>
                    <Icon size={15} style={{ color }} aria-hidden="true" />
                  </div>
                  <div className="flex flex-1 items-baseline justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sport-gray">{label}</span>
                    <span className="text-lg font-black text-white tabular-nums">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="relative mt-5 text-[10px] text-sport-gray text-center">
            {t('autoSaved')}
          </p>
        </>
      ) : (
        <div className="relative text-center py-4">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sport-lime/15 border border-sport-lime/30">
            <Footprints size={26} className="text-sport-lime" />
          </div>

          {status === 'needtap' && (
            <>
              <p className="text-white font-bold mb-1">{t('tapToStart')}</p>
              <p className="text-xs text-sport-gray max-w-xs mx-auto mb-5 leading-relaxed">
                {t('tapHint')}
              </p>
            </>
          )}
          {status === 'denied' && (
            <p className="text-xs text-red-400 mb-5 max-w-xs mx-auto">{t('denied')}</p>
          )}
          {status === 'nosensor' && (
            <p className="text-xs text-orange-400 mb-5 max-w-xs mx-auto">{t('noSensor')}</p>
          )}

          {status !== 'nosensor' && (
            <button
              onClick={start}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sport-lime px-6 py-3 text-sm font-black text-sport-dark hover:brightness-110 transition-all"
            >
              <Play size={15} fill="currentColor" /> {t('startTracking')}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
