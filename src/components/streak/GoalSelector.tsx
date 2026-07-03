'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

const OPTIONS = [2, 3, 4, 5, 6, 7]

export function GoalSelector({ initialGoal }: { initialGoal: number }) {
  const t = useTranslations('streak')
  const router = useRouter()
  const [goal, setGoal] = useState(initialGoal)
  const [saving, setSaving] = useState(false)

  async function update(next: number) {
    const prev = goal
    setGoal(next); setSaving(true)
    try {
      const res = await fetch('/api/streak/goal', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: next }),
      })
      if (!res.ok) setGoal(prev)
      else router.refresh()
    } catch {
      setGoal(prev)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] uppercase tracking-wider text-sport-gray">{t('goalLabel')}</span>
      <div className="flex gap-1">
        {OPTIONS.map(n => (
          <button
            key={n}
            disabled={saving}
            onClick={() => update(n)}
            className={`w-8 h-8 rounded-lg text-sm font-bold transition-all disabled:opacity-50 ${
              n === goal
                ? 'bg-sport-orange text-white'
                : 'bg-sport-dark border border-sport-border text-sport-gray hover:text-white'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
