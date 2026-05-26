'use client'

import { useState, useEffect } from 'react'
import { Flame, Clock, Award, TrendingUp, Plus, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DISCIPLINE_CONTENT } from '@/lib/disciplines'

const DISCIPLINES = ['running-cardio', 'musculation', 'hiit', 'cyclisme', 'natation', 'crossfit', 'yoga', 'boxing', 'stretching', 'nutrition']
const DISC_NAMES: Record<string, string> = {
  'running-cardio': 'Running', musculation: 'Musculation', hiit: 'HIIT',
  cyclisme: 'Cyclisme', natation: 'Natation', crossfit: 'CrossFit',
  yoga: 'Yoga', boxing: 'Boxing', stretching: 'Stretching', nutrition: 'Nutrition',
}

const BADGES = [
  { id: 'first', label: 'Premier pas', desc: '1ère séance enregistrée', icon: '🏃', req: (w: number) => w >= 1 },
  { id: 'week',  label: 'Semaine complète', desc: '7 séances enregistrées', icon: '📅', req: (w: number) => w >= 7 },
  { id: 'month', label: 'Athlète du mois',  desc: '30 séances enregistrées', icon: '🏆', req: (w: number) => w >= 30 },
  { id: 'elite', label: 'Élite',            desc: '100 séances enregistrées', icon: '⚡', req: (w: number) => w >= 100 },
]

export default function ProgressionPage() {
  const [workouts, setWorkouts] = useState<{ discipline: string; duration_minutes: number; completed_at: string }[]>([])
  const [progress, setProgress] = useState<{ discipline: string; completed: boolean }[]>([])
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ discipline: 'running-cardio', duration: '45', notes: '' })
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const [{ data: w }, { data: p }] = await Promise.all([
        supabase.from('workouts').select('*').eq('user_id', user.id).order('completed_at', { ascending: false }),
        supabase.from('progress').select('discipline, completed').eq('user_id', user.id),
      ])
      setWorkouts(w ?? [])
      setProgress(p ?? [])
    }
    load()
  }, [])

  async function addWorkout() {
    if (!userId) return
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

  const disciplineProgress = DISCIPLINES.map(slug => {
    const content = DISCIPLINE_CONTENT[slug]
    const total = (content?.program ?? []).reduce((a, b) => a + b.sessions.length, 0)
    const done = progress.filter(p => p.discipline === slug && p.completed).length
    const pct = total > 0 ? Math.round((done / total) * 100) : 0
    return { slug, name: DISC_NAMES[slug], pct, done, total }
  })

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-white">Ma Progression</h1>
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 bg-sport-orange text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-sport-orange/20"
        >
          <Plus size={13} /> Ajouter séance
        </button>
      </div>

      {/* Add workout modal */}
      {adding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-sport-card border border-sport-border rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-black text-white mb-5">Nouvelle séance</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Discipline</label>
                <select value={form.discipline} onChange={e => setForm(f => ({ ...f, discipline: e.target.value }))}
                  className="w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-sport-orange">
                  {DISCIPLINES.map(s => <option key={s} value={s}>{DISC_NAMES[s]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Durée (minutes)</label>
                <input type="number" min="5" max="300" value={form.duration}
                  onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                  className="w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-sport-orange" />
              </div>
              <div>
                <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Notes (optionnel)</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Ressenti, exercices, PR…" rows={2}
                  className="w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-sport-orange placeholder:text-sport-gray" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setAdding(false)}
                className="flex-1 border border-sport-border text-sport-gray py-2.5 rounded-full text-sm font-bold hover:text-white hover:border-sport-gray transition-all">
                Annuler
              </button>
              <button onClick={addWorkout} disabled={saving}
                className="flex-1 bg-sport-orange text-white py-2.5 rounded-full text-sm font-bold hover:bg-orange-600 disabled:opacity-60 transition-all inline-flex items-center justify-center gap-2">
                {saving ? <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Enregistrement…</> : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { Icon: Flame, label: 'Séances totales', value: workouts.length.toString(), color: 'text-sport-orange' },
          { Icon: Clock, label: 'Heures d\'entraînement', value: `${totalHours}h`, color: 'text-sport-blue' },
          { Icon: TrendingUp, label: 'Modules complétés', value: progress.filter(p => p.completed).length.toString(), color: 'text-emerald-400' },
          { Icon: Award, label: 'Badges obtenus', value: BADGES.filter(b => b.req(workouts.length)).length.toString(), color: 'text-yellow-400' },
        ].map(({ Icon, label, value, color }) => (
          <div key={label} className="bg-sport-card border border-sport-border rounded-xl p-4">
            <Icon size={18} className={`${color} mb-2`} />
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-[11px] text-sport-gray mt-0.5 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* Discipline progress */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-6 mb-8">
        <h2 className="text-base font-black text-white mb-5">Progression par discipline</h2>
        <div className="space-y-5">
          {disciplineProgress.map(({ slug, name, pct, done, total }) => (
            <div key={slug}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-white">{name}</span>
                <span className="text-xs text-sport-gray">{done}/{total} · <strong className="text-sport-orange">{pct}%</strong></span>
              </div>
              <div className="w-full bg-sport-dark rounded-full h-2">
                <div className="bg-sport-orange h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-6 mb-8">
        <h2 className="text-base font-black text-white mb-5">Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BADGES.map(badge => {
            const earned = badge.req(workouts.length)
            return (
              <div key={badge.id} className={`rounded-xl p-4 text-center border transition-all ${earned ? 'bg-yellow-400/10 border-yellow-400/30' : 'bg-sport-dark border-sport-border opacity-50'}`}>
                <span className="text-3xl block mb-2">{badge.icon}</span>
                <p className={`text-xs font-black ${earned ? 'text-yellow-400' : 'text-sport-gray'}`}>{badge.label}</p>
                <p className="text-[10px] text-sport-gray mt-1 leading-tight">{badge.desc}</p>
                {earned && <CheckCircle size={12} className="text-emerald-400 mx-auto mt-2" />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Weekly chart */}
      {workouts.length > 0 && (() => {
        const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
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
            <h2 className="text-base font-black text-white mb-5">Activité cette semaine</h2>
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
        <h2 className="text-base font-black text-white mb-4">Historique des séances</h2>
        {workouts.length === 0 ? (
          <div className="text-center py-10 text-sport-gray text-sm">
            Aucune séance enregistrée. Clique sur &quot;Ajouter séance&quot; pour commencer !
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
                    <p className="text-sm font-bold text-white">{DISC_NAMES[w.discipline] ?? w.discipline}</p>
                    <p className="text-[11px] text-sport-gray">{new Date(w.completed_at).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{w.duration_minutes} min</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
