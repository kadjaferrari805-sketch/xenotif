'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Flame, Clock, Award, TrendingUp, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DISCIPLINE_CONTENT } from '@/lib/disciplines'
import { computeGamification } from '@/lib/gamification'
import { XpLevelBar } from '@/components/gamification/XpLevelBar'
import { ChallengesCard } from '@/components/gamification/ChallengesCard'
import { BadgesGrid } from '@/components/gamification/BadgesGrid'
import { TransformationForm } from '@/components/transformations/TransformationForm'
import { Input, Select, Textarea, Label } from '@/components/ui/Input'
import { Loader } from '@/components/ui/Loader'
import { Progress } from '@/components/ui/Progress'

type Workout = { discipline: string; duration_minutes: number; completed_at: string }
type ProgressRow = { discipline: string; completed: boolean }

const DISCIPLINES = ['running-cardio', 'musculation', 'hiit', 'cyclisme', 'natation', 'crossfit', 'yoga', 'boxing', 'stretching', 'nutrition']

export function ProgressionClient({ userId, initialWorkouts, initialProgress }: { userId: string; initialWorkouts: Workout[]; initialProgress: ProgressRow[] }) {
  const t = useTranslations('dashboard.progression')
  const locale = useLocale()
  const dateLocale = locale === 'en' ? 'en-US' : 'fr-FR'
  const discName = (slug: string) => (t.has(`disciplines.${slug}`) ? t(`disciplines.${slug}`) : slug)
  const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts)
  const progress = initialProgress
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ discipline: 'running-cardio', duration: '45', notes: '' })
  const [saving, setSaving] = useState(false)

  async function addWorkout() {
    setSaving(true)
    const supabase = createClient()
    const { data } = await supabase.from('workouts').insert({
      user_id: userId,
      discipline: form.discipline,
      duration_minutes: parseInt(form.duration) || 0,
      notes: form.notes,
    }).select().single()
    if (data) setWorkouts(prev => [data, ...prev])
    setSaving(false)
    setAdding(false)
    setForm({ discipline: 'running-cardio', duration: '45', notes: '' })
  }

  const totalMinutes = workouts.reduce((a, w) => a + (w.duration_minutes ?? 0), 0)
  const totalHours = Math.floor(totalMinutes / 60)

  const gam = computeGamification({
    workouts,
    programSessionsCompleted: progress.filter(p => p.completed).length,
  })

  const disciplineProgress = DISCIPLINES.map(slug => {
    const content = DISCIPLINE_CONTENT[slug]
    const total = (content?.program ?? []).reduce((a, b) => a + b.sessions.length, 0)
    const done = progress.filter(p => p.discipline === slug && p.completed).length
    const pct = total > 0 ? Math.round((done / total) * 100) : 0
    return { slug, name: discName(slug), pct, done, total }
  })

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-sport-fg">{t('title')}</h1>
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 bg-sport-orange text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-sport-orange/20"
        >
          <Plus size={13} /> {t('addSession')}
        </button>
      </div>

      <div className="mb-8">
        <XpLevelBar xp={gam.xp} levelKey={gam.levelKey} xpInLevel={gam.xpInLevel} xpForNext={gam.xpForNext} />
      </div>

      {/* Add workout modal */}
      {adding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-sport-card border border-sport-border rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-black text-sport-fg mb-5">{t('newSession')}</h3>
            <div className="space-y-4">
              <div>
                <Label className="uppercase tracking-wider">{t('discipline')}</Label>
                <Select value={form.discipline} onChange={e => setForm(f => ({ ...f, discipline: e.target.value }))}>
                  {DISCIPLINES.map(s => <option key={s} value={s}>{discName(s)}</option>)}
                </Select>
              </div>
              <div>
                <Label className="uppercase tracking-wider">{t('durationMin')}</Label>
                <Input type="number" min="5" max="300" value={form.duration}
                  onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
              </div>
              <div>
                <Label className="uppercase tracking-wider">{t('notesOptional')}</Label>
                <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder={t('notesPlaceholder')} rows={2} className="resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setAdding(false)}
                className="flex-1 border border-sport-border text-sport-gray py-2.5 rounded-full text-sm font-bold hover:text-sport-fg hover:border-sport-gray transition-all">
                {t('cancel')}
              </button>
              <button onClick={addWorkout} disabled={saving}
                className="flex-1 bg-sport-orange text-white py-2.5 rounded-full text-sm font-bold hover:bg-orange-600 disabled:opacity-60 transition-all inline-flex items-center justify-center gap-2">
                {saving ? <><Loader size={14} className="text-white" iconClassName="text-white" />{t('saving')}</> : t('save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { Icon: Flame, label: t('statTotalSessions'), value: workouts.length.toString(), color: 'text-sport-orange' },
          { Icon: Clock, label: t('statHours'), value: `${totalHours}h`, color: 'text-sport-blue' },
          { Icon: TrendingUp, label: t('statModules'), value: progress.filter(p => p.completed).length.toString(), color: 'text-[#1E7F5A]' },
          { Icon: Award, label: t('statBadges'), value: gam.badges.filter(b => b.earned).length.toString(), color: 'text-yellow-600' },
        ].map(({ Icon, label, value, color }) => (
          <div key={label} className="bg-sport-card border border-sport-border rounded-xl p-4">
            <Icon size={18} className={`${color} mb-2`} />
            <p className="text-2xl font-black text-sport-fg">{value}</p>
            <p className="text-[11px] text-sport-gray mt-0.5 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* Discipline progress */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-6 mb-8">
        <h2 className="text-base font-black text-sport-fg mb-5">{t('byDiscipline')}</h2>
        <div className="space-y-5">
          {disciplineProgress.map(({ slug, name, pct, done, total }) => (
            <div key={slug}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-sport-fg">{name}</span>
                <span className="text-xs text-sport-gray">{done}/{total} · <strong className="text-sport-orange">{pct}%</strong></span>
              </div>
              <Progress value={pct} barClassName="transition-transform duration-700" />
            </div>
          ))}
        </div>
      </div>

      {/* Défis + badges (gamification) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <ChallengesCard titleKey="weeklyTitle" challenges={gam.weekly} />
        <ChallengesCard titleKey="monthlyTitle" challenges={gam.monthly} />
      </div>
      <div className="mb-8">
        <BadgesGrid badges={gam.badges} />
      </div>

      {/* Weekly chart */}
      {workouts.length > 0 && (() => {
        const days = t.raw('days') as string[]
        const now = new Date()
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay() + 1)
        weekStart.setHours(0, 0, 0, 0)
        const counts = days.map((_, i) => {
          const d = new Date(weekStart)
          d.setDate(weekStart.getDate() + i)
          const next = new Date(d); next.setDate(d.getDate() + 1)
          return workouts.filter(w => {
            const t = new Date(w.completed_at).getTime()
            return t >= d.getTime() && t < next.getTime()
          }).length
        })
        const maxCount = Math.max(...counts, 1)
        return (
          <div className="bg-sport-card border border-sport-border rounded-2xl p-6 mb-8">
            <h2 className="text-base font-black text-sport-fg mb-5">{t('weekActivity')}</h2>
            <div className="flex items-end gap-2 h-24">
              {days.map((day, i) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full rounded-t-md transition-all duration-700 bg-sport-orange/20 relative overflow-hidden" style={{ height: '80px' }}>
                    <div
                      className="absolute bottom-0 w-full bg-sport-orange rounded-t-md transition-all duration-700"
                      style={{ height: `${(counts[i] / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-sport-gray font-semibold">{day}</span>
                  {counts[i] > 0 && <span className="text-[9px] text-sport-orange font-black">{counts[i]}</span>}
                </div>
              ))}
            </div>
          </div>
        )
      })()}

      {/* Recent workouts */}
      <div>
        <h2 className="text-base font-black text-sport-fg mb-4">{t('history')}</h2>
        {workouts.length === 0 ? (
          <div className="text-center py-10 text-sport-gray text-sm">
            {t('noHistory')}
          </div>
        ) : (
          <div className="space-y-3">
            {workouts.map((w, i) => (
              <div key={i} className="bg-sport-card border border-sport-border rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-sport-orange/10 rounded-lg flex items-center justify-center">
                    <Flame size={14} className="text-sport-orange" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-sport-fg">{discName(w.discipline)}</p>
                    <p className="text-[11px] text-sport-gray">{new Date(w.completed_at).toLocaleDateString(dateLocale, { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-sport-fg">{w.duration_minutes} min</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <TransformationForm />
      </div>
    </div>
  )
}
