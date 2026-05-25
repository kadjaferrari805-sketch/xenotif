'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Circle, Play, ArrowRight, Dumbbell } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DISCIPLINE_CONTENT } from '@/lib/disciplines'
import Link from 'next/link'
import { Suspense } from 'react'

const DISCIPLINES = [
  { slug: 'running-cardio', label: 'Running', color: 'orange' },
  { slug: 'musculation',    label: 'Muscu',   color: 'blue' },
  { slug: 'hiit',           label: 'HIIT',    color: 'lime' },
  { slug: 'cyclisme',       label: 'Cyclisme', color: 'orange' },
  { slug: 'natation',       label: 'Natation', color: 'blue' },
  { slug: 'crossfit',       label: 'CrossFit', color: 'lime' },
]

const COLOR: Record<string, string> = {
  orange: 'bg-sport-orange text-white border-sport-orange',
  blue: 'bg-sport-blue text-white border-sport-blue',
  lime: 'bg-sport-lime text-[#0A0B0F] border-sport-lime',
}

function ProgrammeContent() {
  const searchParams = useSearchParams()
  const initialSlug = searchParams.get('discipline') ?? 'running-cardio'

  const [selected, setSelected] = useState(initialSlug)
  const [progress, setProgress] = useState<Record<string, boolean>>({})
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const content = DISCIPLINE_CONTENT[selected]
  const disc = DISCIPLINES.find(d => d.slug === selected)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const { data } = await supabase.from('progress').select('*').eq('user_id', user.id).eq('discipline', selected)
      const map: Record<string, boolean> = {}
      ;(data ?? []).forEach(p => { map[`${p.week}-${p.session_name}`] = p.completed })
      setProgress(map)
      setLoading(false)
    }
    setLoading(true)
    load()
  }, [selected])

  async function toggleSession(week: number, sessionName: string, completed: boolean) {
    if (!userId) return
    const key = `${week}-${sessionName}`
    setProgress(prev => ({ ...prev, [key]: !completed }))
    const supabase = createClient()
    await supabase.from('progress').upsert({
      user_id: userId, discipline: selected, week, session_name: sessionName,
      completed: !completed, completed_at: !completed ? new Date().toISOString() : null,
    }, { onConflict: 'user_id,discipline,week,session_name' })
  }

  const totalSessions = (content?.program ?? []).reduce((a, w) => a + w.sessions.length, 0)
  const completedCount = Object.values(progress).filter(Boolean).length
  const pct = totalSessions > 0 ? Math.round((completedCount / totalSessions) * 100) : 0

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto pb-24 md:pb-8">
      <h1 className="text-2xl font-black text-white mb-6">Mon Programme</h1>

      {/* Discipline tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {DISCIPLINES.map(d => (
          <button
            key={d.slug}
            onClick={() => setSelected(d.slug)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              selected === d.slug
                ? COLOR[d.color]
                : 'border-sport-border text-sport-gray hover:text-white hover:border-sport-gray bg-transparent'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-black text-white">{disc?.label} — 8 semaines</p>
            <p className="text-[11px] text-sport-gray">{completedCount}/{totalSessions} séances complétées</p>
          </div>
          <span className="text-2xl font-black text-sport-orange">{pct}%</span>
        </div>
        <div className="w-full bg-sport-dark rounded-full h-2">
          <div className="bg-sport-orange h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        {pct === 100 && (
          <p className="text-emerald-400 text-xs font-bold mt-3 flex items-center gap-1.5">
            <CheckCircle size={13} /> Programme terminé — Félicitations ! 🎉
          </p>
        )}
      </div>

      {/* Videos quick link */}
      {content?.videos && content.videos.length > 0 && (
        <Link
          href={`/disciplines/${selected}`}
          className="flex items-center justify-between bg-sport-card border border-sport-border rounded-xl px-5 py-4 mb-6 hover:border-sport-orange/50 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sport-orange/15 rounded-lg flex items-center justify-center">
              <Play size={14} className="text-sport-orange ml-0.5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{content.videos.length} vidéos disponibles</p>
              <p className="text-[11px] text-sport-gray">Tutoriels techniques & séances guidées</p>
            </div>
          </div>
          <ArrowRight size={14} className="text-sport-gray group-hover:text-sport-orange transition-colors" />
        </Link>
      )}

      {/* Program weeks */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="bg-sport-card border border-sport-border rounded-xl h-32 animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {(content?.program ?? []).map((block, bi) => (
            <div key={block.week} className="bg-sport-card border border-sport-border rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-sport-border flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-sport-orange">{block.week}</p>
                  <p className="text-sm font-bold text-white">{block.theme}</p>
                </div>
                <span className="text-xs font-bold text-sport-gray">Phase {bi + 1}</span>
              </div>
              <ul className="divide-y divide-sport-border">
                {block.sessions.map((session, si) => {
                  const key = `${bi + 1}-${session.name}`
                  const done = progress[key] ?? false
                  return (
                    <li key={session.name} className="px-5 py-4 flex gap-4 items-start">
                      <button
                        onClick={() => toggleSession(bi + 1, session.name, done)}
                        aria-label={done ? `Marquer comme non complété : ${session.name}` : `Marquer comme complété : ${session.name}`}
                        className="mt-0.5 shrink-0 transition-all hover:scale-110"
                      >
                        {done
                          ? <CheckCircle size={20} className="text-emerald-400" />
                          : <Circle size={20} className="text-sport-border hover:text-sport-orange transition-colors" />
                        }
                      </button>
                      <div className={done ? 'opacity-50' : ''}>
                        <p className={`text-sm font-bold ${done ? 'line-through text-sport-gray' : 'text-white'}`}>{session.name}</p>
                        <p className="text-xs text-sport-gray mt-0.5 leading-relaxed">{session.detail}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProgrammePage() {
  return <Suspense fallback={<div className="p-8 text-sport-gray text-sm">Chargement…</div>}><ProgrammeContent /></Suspense>
}
