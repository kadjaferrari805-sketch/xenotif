'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Heart, Flame, MapPin, Clock } from 'lucide-react'
import { ACTIVITY_ICONS } from '@/lib/smartwatch/demo-data'
import type { SmartWatchSession } from '@/lib/smartwatch/types'

interface SessionCardProps {
  session: SmartWatchSession
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h${m.toString().padStart(2, '0')}`
  return `${m} min`
}

function formatDistance(meters: number): string {
  if (meters === 0) return '—'
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`
  return `${meters} m`
}

function formatPace(paceSeconds: number | null): string {
  if (!paceSeconds) return '—'
  const m = Math.floor(paceSeconds / 60)
  const s = paceSeconds % 60
  return `${m}:${s.toString().padStart(2, '0')}/km`
}

export function SessionCard({ session }: SessionCardProps) {
  const t = useTranslations('dashboard.smartwatch')
  const locale = useLocale()
  const numLocale = locale === 'en' ? 'en-US' : 'fr-FR'
  const label = t.has(`activities.${session.activity_type}`) ? t(`activities.${session.activity_type}`) : session.activity_type
  const icon = ACTIVITY_ICONS[session.activity_type] ?? '🏅'
  const date = new Date(session.started_at).toLocaleDateString(numLocale, {
    day: 'numeric', month: 'short',
  })
  const time = new Date(session.started_at).toLocaleTimeString(numLocale, {
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="bg-sport-card border border-sport-border rounded-2xl p-4 hover:border-sport-fg/10 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sport-dark border border-sport-border flex items-center justify-center text-lg">
            {icon}
          </div>
          <div>
            <p className="text-sm font-black text-sport-fg">{label}</p>
            <p className="text-[11px] text-sport-gray">{date} · {time}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-sport-fg">{formatDuration(session.duration_seconds)}</p>
          <div className="flex items-center gap-1 text-sport-gray justify-end">
            <Clock size={9} />
            <span className="text-[10px]">{t('session.duration')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-sport-dark rounded-xl px-3 py-2 flex items-center gap-2">
          <Flame size={12} className="text-sport-orange shrink-0" />
          <div>
            <p className="text-xs font-black text-sport-fg">{session.calories_burned}</p>
            <p className="text-[9px] text-sport-gray">kcal</p>
          </div>
        </div>
        <div className="bg-sport-dark rounded-xl px-3 py-2 flex items-center gap-2">
          <Heart size={12} className="text-red-400 shrink-0" />
          <div>
            <p className="text-xs font-black text-sport-fg">{session.avg_heart_rate ?? '—'}</p>
            <p className="text-[9px] text-sport-gray">{t('session.bpmAvg')}</p>
          </div>
        </div>
        <div className="bg-sport-dark rounded-xl px-3 py-2 flex items-center gap-2">
          <MapPin size={12} className="text-sport-blue shrink-0" />
          <div>
            <p className="text-xs font-black text-sport-fg">
              {session.distance_meters > 0 ? formatDistance(session.distance_meters) : formatPace(session.avg_pace_per_km)}
            </p>
            <p className="text-[9px] text-sport-gray">
              {session.distance_meters > 0 ? t('session.distance') : t('session.pace')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
