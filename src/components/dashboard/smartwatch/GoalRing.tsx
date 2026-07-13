'use client'

import { useTranslations } from 'next-intl'

interface GoalRingProps {
  label: string
  value: number
  goal: number
  unit: string
  color: string
  icon: string
}

export function GoalRing({ label, value, goal, unit, color, icon }: GoalRingProps) {
  const t = useTranslations('dashboard.smartwatch')
  const pct = Math.min((value / goal) * 100, 100)
  const done = value >= goal

  return (
    <div className="bg-sport-card border border-sport-border rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-xs font-bold text-sport-gray">{label}</span>
        </div>
        {done && (
          <span className="text-[10px] font-black text-[#1E7F5A] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            {t('goalReached')}
          </span>
        )}
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xl font-black text-sport-fg">
            {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
          </span>
          <span className="text-xs text-sport-gray">
            / {goal >= 1000 ? `${(goal / 1000).toFixed(0)}k` : goal} {unit}
          </span>
        </div>
        <div className="w-full h-2 bg-sport-dark rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${pct}%`,
              background: done ? '#34d399' : color,
              boxShadow: `0 0 8px ${done ? '#34d39960' : color + '60'}`,
            }}
          />
        </div>
        <p className="text-[10px] text-sport-gray mt-1.5 text-right">{Math.round(pct)}%</p>
      </div>
    </div>
  )
}
