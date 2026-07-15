'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { CheckCircle, Circle, Play, ArrowRight, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DISCIPLINE_CONTENT, type DisciplineContent } from '@/lib/disciplines'
import { Link } from '@/i18n/navigation'
import { Progress } from '@/components/ui/Progress'
import { Skeleton } from '@/components/ui/Skeleton'

const DISCIPLINES = [
  { slug: 'running-cardio', color: 'orange' },
  { slug: 'musculation',    color: 'blue' },
  { slug: 'hiit',           color: 'lime' },
  { slug: 'cyclisme',       color: 'orange' },
  { slug: 'natation',       color: 'blue' },
  { slug: 'crossfit',       color: 'lime' },
  { slug: 'yoga',           color: 'orange' },
  { slug: 'boxing',         color: 'blue' },
  { slug: 'stretching',     color: 'lime' },
  { slug: 'nutrition',      color: 'orange' },
]

const COLOR: Record<string, string> = {
  orange: 'bg-sport-orange text-white border-sport-orange',
  blue: 'bg-sport-blue text-white border-sport-blue',
  lime: 'bg-sport-lime text-white border-sport-lime',
}

function ProgrammeContent({ isPro, freeSlugs, userId, initialProgress }: { isPro: boolean; freeSlugs: string[]; userId: string; initialProgress: Record<string, boolean> }) {
  const t = useTranslations('dashboard.programme')
  const locale = useLocale()
  const searchParams = useSearchParams()
  const initialSlug = searchParams.get('discipline') ?? 'running-cardio'

  const [selected, setSelected] = useState(initialSlug)
  const [progress, setProgress] = useState<Record<string, boolean>>(initialProgress)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState<DisciplineContent>(DISCIPLINE_CONTENT[initialSlug])
  const [videoMinPlans, setVideoMinPlans] = useState<string[]>([])
  const skipInitialProgressFetch = useRef(true)

  const unlocked = (slug: string) => isPro || freeSlugs.includes(slug)
  const selectedUnlocked = unlocked(selected)

  // Progression de l'utilisateur pour la discipline sélectionnée. La discipline
  // initiale est déjà pré-chargée côté serveur → on ne refetch qu'au changement d'onglet.
  useEffect(() => {
    if (skipInitialProgressFetch.current) { skipInitialProgressFetch.current = false; return }
    if (!userId) return
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from('progress').select('*').eq('user_id', userId).eq('discipline', selected)
      const map: Record<string, boolean> = {}
      ;(data ?? []).forEach(p => { map[`${p.week}-${p.session_name}`] = p.completed })
      setProgress(map)
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- état de chargement avant fetch au changement d'onglet
    setLoading(true)
    load()
  }, [selected, userId])

  // Contenu : repli statique immédiat, puis base via l'API (repli si null/échec).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- repli statique immédiat au changement d'onglet
    setContent(DISCIPLINE_CONTENT[selected])
    setVideoMinPlans([])
    let alive = true
    fetch(`/api/disciplines/${selected}?locale=${locale}`)
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (alive && d?.content) { setContent(d.content as DisciplineContent); setVideoMinPlans((d.videoMinPlans ?? []) as string[]) } })
      .catch(() => { /* repli statique déjà en place */ })
    return () => { alive = false }
  }, [selected, locale])

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
  // Nombre de vidéos visibles pour un non-PRO (depuis la base ; repli 1 pour une discipline gratuite).
  const freeVideoCount = videoMinPlans.length > 0 ? videoMinPlans.filter(p => p === 'free').length : 1

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto pb-24 md:pb-8">
      <h1 className="text-2xl font-black text-sport-fg mb-6">{t('title')}</h1>

      {/* Discipline tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {DISCIPLINES.map(d => {
          const locked = !unlocked(d.slug)
          return (
            <button
              key={d.slug}
              onClick={() => setSelected(d.slug)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border inline-flex items-center gap-1.5 ${
                selected === d.slug
                  ? COLOR[d.color]
                  : 'border-sport-border text-sport-gray hover:text-sport-fg hover:border-sport-gray bg-transparent'
              }`}
            >
              {locked && <Lock size={11} aria-hidden="true" />}
              {t(`disciplines.${d.slug}`)}
            </button>
          )
        })}
      </div>

      {!selectedUnlocked && (
        <div className="card-base p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sport-orange/15 border border-sport-orange/30">
            <Lock size={20} className="text-sport-orange" aria-hidden="true" />
          </div>
          <p className="text-lg font-black text-sport-fg mb-1">{t('lockedTitle')}</p>
          <p className="text-sport-gray text-sm mb-5">{t('lockedSubtitle', { name: t(`disciplines.${selected}`) })}</p>
          <Link href="/dashboard/abonnement" className="inline-flex items-center gap-2 rounded-full bg-sport-orange px-5 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-all">
            {t('lockedCta')} <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      )}

      {selectedUnlocked && (<>
      {/* Progress bar */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-black text-sport-fg">{t('weeks', { name: t(`disciplines.${selected}`) })}</p>
            <p className="text-[11px] text-sport-gray">{t('sessionsCompleted', { completed: completedCount, total: totalSessions })}</p>
          </div>
          <span className="text-2xl font-black text-sport-orange">{pct}%</span>
        </div>
        <Progress value={pct} />
        {pct === 100 && (
          <p className="text-[#1E7F5A] text-xs font-bold mt-3 flex items-center gap-1.5">
            <CheckCircle size={13} /> {t('done')}
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
              <p className="text-sm font-bold text-sport-fg">{t('videosAvailable', { count: isPro ? content.videos.length : freeVideoCount })}</p>
              <p className="text-[11px] text-sport-gray">{isPro ? t('videosSubtitle') : t('videosFreeHint')}</p>
            </div>
          </div>
          <ArrowRight size={14} className="text-sport-gray group-hover:text-sport-orange transition-colors" />
        </Link>
      )}

      {/* Program weeks */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-xl border border-sport-border" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {(content?.program ?? []).map((block, bi) => (
            <div key={block.week} className="bg-sport-card border border-sport-border rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-sport-border flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-sport-orange">{block.week}</p>
                  <p className="text-sm font-bold text-sport-fg">{block.theme}</p>
                </div>
                <span className="text-xs font-bold text-sport-gray">{t('phase', { n: bi + 1 })}</span>
              </div>
              <ul className="divide-y divide-sport-border">
                {block.sessions.map((session) => {
                  const key = `${bi + 1}-${session.name}`
                  const done = progress[key] ?? false
                  return (
                    <li key={session.name} className="px-5 py-4 flex gap-4 items-start">
                      <button
                        onClick={() => toggleSession(bi + 1, session.name, done)}
                        aria-label={done ? t('markUndone', { name: session.name }) : t('markDone', { name: session.name })}
                        className="mt-0.5 shrink-0 transition-all hover:scale-110"
                      >
                        {done
                          ? <CheckCircle size={20} className="text-[#1E7F5A]" />
                          : <Circle size={20} className="text-sport-border hover:text-sport-orange transition-colors" />
                        }
                      </button>
                      <div className={done ? 'opacity-50' : ''}>
                        <p className={`text-sm font-bold ${done ? 'line-through text-sport-gray' : 'text-sport-fg'}`}>{session.name}</p>
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
      </>)}
    </div>
  )
}

export function ProgrammeClient({ isPro, freeSlugs, userId, initialProgress }: { isPro: boolean; freeSlugs: string[]; userId: string; initialProgress: Record<string, boolean> }) {
  return <Suspense fallback={<div className="p-8 text-sport-gray text-sm" />}><ProgrammeContent isPro={isPro} freeSlugs={freeSlugs} userId={userId} initialProgress={initialProgress} /></Suspense>
}
