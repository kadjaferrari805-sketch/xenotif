'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Heart } from 'lucide-react'

interface HeartRateDisplayProps {
  avg: number
  max: number
  resting: number
  animated?: boolean
}

function getZone(bpm: number): { key: string; color: string } {
  if (bpm < 100) return { key: 'zoneRest', color: '#60a5fa' }
  if (bpm < 130) return { key: 'zoneLight', color: '#34d399' }
  if (bpm < 155) return { key: 'zoneModerate', color: '#fbbf24' }
  if (bpm < 175) return { key: 'zoneIntense', color: '#f97316' }
  return { key: 'zoneMax', color: '#ef4444' }
}

export function HeartRateDisplay({ avg, max, resting, animated = true }: HeartRateDisplayProps) {
  const t = useTranslations('dashboard.smartwatch.heart')
  const [beat, setBeat] = useState(false)
  const zone = getZone(avg)

  useEffect(() => {
    if (!animated) return
    const bpm = avg || 72
    const interval = setInterval(() => {
      setBeat(true)
      setTimeout(() => setBeat(false), 150)
    }, Math.round(60000 / bpm))
    return () => clearInterval(interval)
  }, [avg, animated])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-150"
          style={{
            background: `${zone.color}20`,
            border: `1px solid ${zone.color}40`,
            transform: beat ? 'scale(1.2)' : 'scale(1)',
          }}
        >
          <Heart
            size={18}
            style={{ color: zone.color, fill: zone.color }}
          />
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">{avg}</span>
            <span className="text-xs text-sport-gray">{t('bpmAvg')}</span>
          </div>
          <span className="text-[10px] font-bold" style={{ color: zone.color }}>{t(zone.key)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-sport-dark rounded-lg px-3 py-2">
          <p className="text-[10px] text-sport-gray">{t('max')}</p>
          <p className="text-sm font-black text-white">{max} <span className="text-[10px] text-sport-gray font-normal">bpm</span></p>
        </div>
        <div className="bg-sport-dark rounded-lg px-3 py-2">
          <p className="text-[10px] text-sport-gray">{t('resting')}</p>
          <p className="text-sm font-black text-white">{resting} <span className="text-[10px] text-sport-gray font-normal">bpm</span></p>
        </div>
      </div>
    </div>
  )
}
