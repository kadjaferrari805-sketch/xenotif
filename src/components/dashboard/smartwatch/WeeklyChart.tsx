'use client'

import type { WeeklyData } from '@/lib/smartwatch/types'

type Metric = 'steps' | 'calories' | 'activeMinutes'

interface WeeklyChartProps {
  data: WeeklyData[]
  metric: Metric
  color: string
}

const MAX: Record<Metric, number> = {
  steps: 15000,
  calories: 800,
  activeMinutes: 90,
}

const LABELS: Record<Metric, string> = {
  steps: 'Pas',
  calories: 'Cal',
  activeMinutes: 'Min actives',
}

export function WeeklyChart({ data, metric, color }: WeeklyChartProps) {
  const max = MAX[metric]
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

  return (
    <div className="w-full">
      <p className="text-[11px] text-sport-gray font-semibold mb-3 uppercase tracking-wider">{LABELS[metric]} cette semaine</p>
      <div className="flex items-end gap-2 h-20">
        {data.map((d, i) => {
          const val = d[metric] as number
          const pct = Math.min((val / max) * 100, 100)
          const isToday = i === todayIdx

          return (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="relative w-full" style={{ height: 60 }}>
                <div className="absolute bottom-0 w-full rounded-t-sm opacity-20" style={{ height: '100%', background: color }} />
                <div
                  className="absolute bottom-0 w-full rounded-t-sm transition-all duration-1000"
                  style={{
                    height: `${pct}%`,
                    background: color,
                    boxShadow: isToday ? `0 0 8px ${color}80` : 'none',
                    opacity: isToday ? 1 : 0.65,
                  }}
                />
              </div>
              <span className={`text-[9px] font-bold ${isToday ? 'text-white' : 'text-sport-gray'}`}>
                {d.day}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
