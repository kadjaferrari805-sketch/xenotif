'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useInView } from 'react-intersection-observer'
import { Link } from '@/i18n/navigation'
import {
  Play, Film, Images, FileText, ListOrdered, Wind, Lightbulb, AlertTriangle, Activity,
  Dumbbell, Shuffle, Repeat2, BarChart3, StickyNote, Volume2, Square, Timer as TimerIcon,
  ScanLine, Heart, ArrowRight, Flame, Clock, RotateCcw,
} from 'lucide-react'
import { BodyDiagram } from './BodyDiagram'
import type { ExerciceDetail as Detail } from '@/lib/exercices/details'

const SPEECH_LANG: Record<string, string> = { fr: 'fr-FR', en: 'en-US', de: 'de-DE' }
const DIFF_STYLE: Record<string, string> = {
  debutant: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  intermediaire: 'text-sport-blue border-sport-blue/30 bg-sport-blue/10',
  avance: 'text-sport-orange border-sport-orange/30 bg-sport-orange/10',
}

// ─── Wrapper de section (révélation au scroll) ──────────────────────────────
function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.12 })
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-sport-card border border-sport-border rounded-2xl p-6 md:p-7 shadow-lg shadow-black/20"
    >
      <h2 className="flex items-center gap-2.5 text-lg font-black text-sport-fg mb-5">
        <span className="w-9 h-9 rounded-xl bg-sport-orange/10 border border-sport-orange/25 flex items-center justify-center">
          <Icon size={17} aria-hidden="true" className="text-sport-orange" />
        </span>
        {title}
      </h2>
      {children}
    </motion.section>
  )
}

// ─── Média : vidéo (placeholder si absent) ──────────────────────────────────
function VideoBlock({ url, poster, t }: { url?: string; poster?: string; t: ReturnType<typeof useTranslations> }) {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '200px' })
  const videoRef = useRef<HTMLVideoElement>(null)
  const [rate, setRate] = useState(1)
  const setSpeed = (r: number) => { setRate(r); if (videoRef.current) videoRef.current.playbackRate = r }

  return (
    <div ref={ref}>
      {url ? (
        <>
          <div className="relative rounded-2xl overflow-hidden bg-sport-dark aspect-video">
            {inView && (
              <video ref={videoRef} controls autoPlay muted loop playsInline preload="metadata" poster={poster} className="w-full h-full object-contain">
                <source src={url} type="video/mp4" />
              </video>
            )}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[11px] text-sport-gray">Vitesse :</span>
            {[0.5, 1, 1.5, 2].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSpeed(r)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors ${rate === r ? 'bg-sport-orange text-sport-fg border-sport-orange' : 'border-sport-border text-sport-gray hover:text-sport-fg'}`}
              >
                {r}×
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="relative rounded-2xl overflow-hidden aspect-video bg-gradient-to-br from-sport-dark to-sport-card border border-sport-border flex flex-col items-center justify-center gap-3">
          <div className="absolute inset-0 animate-pulse bg-white/[0.02]" />
          <span className="w-14 h-14 rounded-full bg-sport-orange/15 border border-sport-orange/30 flex items-center justify-center">
            <Play size={22} aria-hidden="true" className="text-sport-orange ml-0.5" />
          </span>
          <p className="text-sm text-sport-gray relative">{t('videoSoon')}</p>
        </div>
      )}
    </div>
  )
}

// ─── Coach vocal (Web Speech API) ───────────────────────────────────────────
function VoiceCoach({ text, locale, t }: { text: string; locale: string; t: ReturnType<typeof useTranslations> }) {
  const [supported, setSupported] = useState(true)
  const [speaking, setSpeaking] = useState(false)

  function toggle() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) { setSupported(false); return }
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return }
    const u = new SpeechSynthesisUtterance(text)
    u.lang = SPEECH_LANG[locale] ?? 'fr-FR'
    u.rate = 0.95
    u.onend = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
    setSpeaking(true)
  }

  if (!supported) return <p className="text-sm text-sport-gray">{t('coach_unsupported')}</p>
  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2.5 bg-sport-orange text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-sport-orange/25"
    >
      {speaking ? <Square size={16} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}
      {speaking ? t('coach_stop') : t('coach_play')}
    </button>
  )
}

// ─── Minuteur (compte à rebours / chrono / repos) ───────────────────────────
function Timer({ t }: { t: ReturnType<typeof useTranslations> }) {
  const [mode, setMode] = useState<'countdown' | 'stopwatch'>('countdown')
  const [ms, setMs] = useState(60000)
  const [running, setRunning] = useState(false)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!running) { if (ref.current) clearInterval(ref.current); return }
    ref.current = setInterval(() => {
      setMs((v) => {
        if (mode === 'stopwatch') return v + 100
        const nv = v - 100
        if (nv <= 0) { setRunning(false); return 0 }
        return nv
      })
    }, 100)
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [running, mode])

  const total = Math.max(0, Math.round(ms / 1000))
  const mm = String(Math.floor(total / 60)).padStart(2, '0')
  const ss = String(total % 60).padStart(2, '0')
  const reset = (preset?: number) => { setRunning(false); setMs(mode === 'stopwatch' ? 0 : (preset ?? 60) * 1000) }
  const switchMode = (m: 'countdown' | 'stopwatch') => { setMode(m); setRunning(false); setMs(m === 'stopwatch' ? 0 : 60000) }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {(['countdown', 'stopwatch'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${mode === m ? 'bg-sport-orange text-sport-fg border-sport-orange' : 'border-sport-border text-sport-gray hover:text-sport-fg'}`}
          >
            {m === 'countdown' ? t('timer_countdown') : t('timer_stopwatch')}
          </button>
        ))}
      </div>
      <div className="text-center py-6 rounded-2xl bg-sport-dark border border-sport-border">
        <p className="text-5xl md:text-6xl font-black text-sport-fg tabular-nums tracking-tight">{mm}:{ss}</p>
      </div>
      {mode === 'countdown' && (
        <div className="flex justify-center gap-2 mt-4">
          {[30, 60, 90].map((s) => (
            <button key={s} type="button" onClick={() => reset(s)} className="text-xs font-bold px-3 py-1.5 rounded-full border border-sport-border text-sport-gray hover:text-sport-fg transition-colors">{s}s</button>
          ))}
        </div>
      )}
      <div className="flex justify-center gap-3 mt-4">
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="inline-flex items-center gap-2 bg-sport-orange text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-orange-600 active:scale-95 transition-all"
        >
          {running ? t('timer_pause') : t('timer_start')}
        </button>
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 border border-sport-border text-sport-gray px-5 py-3 rounded-full font-bold text-sm hover:text-sport-fg transition-colors"
        >
          <RotateCcw size={15} aria-hidden="true" /> {t('timer_reset')}
        </button>
      </div>
    </div>
  )
}

// ─── Favori + notes (localStorage) ──────────────────────────────────────────
type Note = { text: string; ts: number }
function NotesCard({ slug, t, locale }: { slug: string; t: ReturnType<typeof useTranslations>; locale: string }) {
  const [fav, setFav] = useState(false)
  const [draft, setDraft] = useState('')
  const [notes, setNotes] = useState<Note[]>([])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Différé (microtask) : lecture localStorage au montage sans setState
    // synchrone dans l'effet (client-only, indispo en SSR).
    Promise.resolve().then(() => {
      try {
        const favs: string[] = JSON.parse(localStorage.getItem('xeno_fav_ex') || '[]')
        setFav(favs.includes(slug))
        setNotes(JSON.parse(localStorage.getItem(`xeno_ex_notes_${slug}`) || '[]'))
      } catch {}
    })
  }, [slug])

  function toggleFav() {
    try {
      const favs: string[] = JSON.parse(localStorage.getItem('xeno_fav_ex') || '[]')
      const next = favs.includes(slug) ? favs.filter((s) => s !== slug) : [...favs, slug]
      localStorage.setItem('xeno_fav_ex', JSON.stringify(next))
      setFav(next.includes(slug))
    } catch {}
  }
  function save() {
    if (!draft.trim()) return
    const next = [{ text: draft.trim(), ts: Date.now() }, ...notes].slice(0, 20)
    setNotes(next)
    try { localStorage.setItem(`xeno_ex_notes_${slug}`, JSON.stringify(next)) } catch {}
    setDraft(''); setSaved(true); setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={toggleFav}
        aria-pressed={fav}
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm border transition-colors ${fav ? 'bg-sport-orange/15 border-sport-orange/40 text-sport-orange' : 'border-sport-border text-sport-gray hover:text-sport-fg'}`}
      >
        <Heart size={16} aria-hidden="true" className={fav ? 'fill-sport-orange text-sport-orange' : ''} />
        {fav ? t('fav_added') : t('fav_add')}
      </button>

      <div>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t('notes_placeholder')}
          rows={3}
          className="w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-3 text-sport-fg text-sm placeholder:text-sport-gray focus:outline-none focus:border-sport-orange transition-colors resize-none"
        />
        <div className="flex items-center gap-3 mt-2">
          <button type="button" onClick={save} className="text-xs font-bold bg-sport-orange text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors">{t('notes_save')}</button>
          {saved && <span className="text-xs text-emerald-400">{t('notes_saved')}</span>}
        </div>
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-wider text-sport-gray mb-2">{t('history_label')}</p>
        {notes.length === 0 ? (
          <p className="text-sm text-sport-gray">{t('history_empty')}</p>
        ) : (
          <ul className="space-y-2">
            {notes.map((n, i) => (
              <li key={i} className="text-sm text-sport-gray bg-sport-dark border border-sport-border rounded-xl px-4 py-2.5">
                <span className="block text-[11px] text-sport-gray/70 mb-0.5">{new Date(n.ts).toLocaleDateString(locale)}</span>
                {n.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// ─── Fiche complète ─────────────────────────────────────────────────────────
export function ExerciceDetail({ detail, locale }: { detail: Detail; locale: string }) {
  const t = useTranslations('exercicesDetail')
  const d = detail
  const equipLabel = (k: string) => t(`eq_${k}` as 'eq_none')
  const stepLabels = [t('step1'), t('step2'), t('step3'), t('step4'), t('step5')]
  const tips = [
    { label: t('tipLabel_technique'), text: t('tip_technique') },
    { label: t('tipLabel_safety'), text: t('tip_safety') },
    { label: t('tipLabel_range'), text: t('tip_range') },
    { label: t('tipLabel_posture'), text: t('tip_posture') },
  ]
  const variations = [t('var_beginner'), t('var_intermediate'), t('var_advanced'), t('var_home'), t('var_gym')]
  const coachText = `${t('coach_intro', { name: d.name })} ${d.instructions.join('. ')}. ${t('breathe_inhale')} ${t('breathe_exhale')}`

  return (
    <div className="space-y-6">
      {/* Header — badges cliquables, filtrent la bibliothèque d'exercices */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={{ pathname: '/exercices', query: { level: d.difficulty } }}
          className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border hover:opacity-80 transition-opacity ${DIFF_STYLE[d.difficulty]}`}
        >
          <Activity size={12} aria-hidden="true" /> {t(`diff_${d.difficulty}` as 'diff_debutant')}
        </Link>
        {[...new Set([...d.primaryMuscles, ...d.secondaryMuscles])].map((m) => (
          <Link
            key={m}
            href={{ pathname: '/exercices', query: { muscle: m } }}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-sport-card border border-sport-border text-sport-gray hover:text-sport-fg hover:border-sport-orange/50 transition-colors"
          >
            {m}
          </Link>
        ))}
        {d.equipment.map((k) => (
          <Link
            key={k}
            href={{ pathname: '/exercices', query: { equipment: k } }}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-sport-card border border-sport-border text-sport-gray hover:text-sport-fg hover:border-sport-orange/50 transition-colors"
          >
            <Dumbbell size={12} aria-hidden="true" className="text-sport-orange" /> {equipLabel(k)}
          </Link>
        ))}
      </div>

      {/* Vidéo de démonstration */}
      <Section icon={Film} title={t('sec_video')}>
        <VideoBlock url={d.media.videoUrl} poster={d.media.videoPoster} t={t} />
      </Section>

      {/* 3. Étapes */}
      <Section icon={Images} title={t('sec_steps')}>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {stepLabels.map((label, i) => (
            <div key={i} className="rounded-xl overflow-hidden">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-b from-white to-[#e8e8ee] border border-sport-border">
                {d.media.images?.[i] ? (
                  <Image src={d.media.images[i]} alt={`${label} — ${d.name}`} fill sizes="(max-width:768px) 45vw, 18vw" className="object-contain" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center"><span className="text-2xl font-black text-sport-orange/40">{i + 1}</span></div>
                )}
                <span className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-sport-orange text-white text-[10px] font-black flex items-center justify-center">{i + 1}</span>
              </div>
              <p className="text-[11px] text-sport-gray mt-1.5 text-center">{label}</p>
            </div>
          ))}
        </div>
        {!d.media.images?.length && <p className="text-[11px] text-sport-gray mt-3">{t('stepsSoon')}</p>}
      </Section>

      {/* 4. Description */}
      <Section icon={FileText} title={t('sec_description')}>
        <p className="text-sm text-sport-gray leading-relaxed mb-4">{t('desc_objective', { primary: d.primaryMuscles.join(', ') })} {t('desc_interest')}</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl bg-sport-dark border border-sport-border p-4">
            <p className="text-[11px] font-black uppercase tracking-wider text-sport-orange mb-2">{t('desc_primary')}</p>
            <div className="flex flex-wrap gap-1.5">
              {d.primaryMuscles.map((m) => <span key={m} className="text-xs px-2.5 py-1 rounded-full bg-sport-orange/10 text-sport-orange">{m}</span>)}
            </div>
          </div>
          <div className="rounded-xl bg-sport-dark border border-sport-border p-4">
            <p className="text-[11px] font-black uppercase tracking-wider text-sport-gray mb-2">{t('desc_secondary')}</p>
            <div className="flex flex-wrap gap-1.5">
              {d.secondaryMuscles.length ? d.secondaryMuscles.map((m) => <span key={m} className="text-xs px-2.5 py-1 rounded-full bg-sport-card border border-sport-border text-sport-gray">{m}</span>) : <span className="text-xs text-sport-gray">{t('desc_secondaryNone')}</span>}
            </div>
          </div>
        </div>
      </Section>

      {/* 5. Technique */}
      <Section icon={ListOrdered} title={t('sec_technique')}>
        <ol className="space-y-3">
          {d.instructions.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-sport-gray leading-relaxed">
              <span className="shrink-0 w-6 h-6 rounded-full bg-sport-orange/15 border border-sport-orange/30 text-sport-orange text-xs font-black flex items-center justify-center">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </Section>

      {/* 6. Respiration + 7. Conseils */}
      <div className="grid md:grid-cols-2 gap-6">
        <Section icon={Wind} title={t('sec_breathing')}>
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm text-sport-gray"><span className="shrink-0 text-xs font-black text-sport-blue px-2 py-0.5 rounded-full bg-sport-blue/10 border border-sport-blue/25">IN</span>{t('breathe_inhale')}</div>
            <div className="flex items-start gap-3 text-sm text-sport-gray"><span className="shrink-0 text-xs font-black text-sport-orange px-2 py-0.5 rounded-full bg-sport-orange/10 border border-sport-orange/25">OUT</span>{t('breathe_exhale')}</div>
          </div>
        </Section>
        <Section icon={Lightbulb} title={t('sec_tips')}>
          <ul className="space-y-2.5">
            {tips.map((tip, i) => (
              <li key={i} className="text-sm text-sport-gray"><strong className="text-sport-fg">{tip.label} — </strong>{tip.text}</li>
            ))}
          </ul>
        </Section>
      </div>

      {/* 8. Erreurs à éviter */}
      <Section icon={AlertTriangle} title={t('sec_mistakes')}>
        <ul className="space-y-2.5">
          {d.mistakesList.map((m, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-sport-gray">
              <AlertTriangle size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-sport-orange" /> {m}
            </li>
          ))}
        </ul>
      </Section>

      {/* 9. Muscles sollicités */}
      <Section icon={Activity} title={t('sec_muscles')}>
        <BodyDiagram regions={d.regions} />
        <div className="flex flex-wrap gap-2 mt-4">
          {d.primaryMuscles.map((m) => <span key={m} className="text-xs px-2.5 py-1 rounded-full bg-sport-orange/15 text-sport-orange border border-sport-orange/25">{m}</span>)}
          {d.secondaryMuscles.map((m) => <span key={m} className="text-xs px-2.5 py-1 rounded-full bg-sport-card border border-sport-border text-sport-gray">{m}</span>)}
        </div>
      </Section>

      {/* 12. Variantes */}
      <Section icon={Shuffle} title={t('sec_variations')}>
        <ul className="space-y-2.5">
          {variations.map((v, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-sport-gray">
              <Shuffle size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-sport-orange" /> {v}
            </li>
          ))}
        </ul>
      </Section>

      {/* 14. Statistiques */}
      <Section icon={BarChart3} title={t('sec_stats')}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { icon: Flame, label: t('stat_calories'), value: d.stats.calories },
            { icon: Repeat2, label: t('stat_sets'), value: String(d.stats.sets) },
            { icon: Repeat2, label: t('stat_reps'), value: d.stats.reps },
            { icon: Clock, label: t('stat_rest'), value: d.stats.rest },
            { icon: TimerIcon, label: t('stat_duration'), value: d.stats.duration },
            { icon: Activity, label: t('stat_muscles'), value: String(d.primaryMuscles.length + d.secondaryMuscles.length) },
          ].map((s, i) => (
            <div key={i} className="rounded-xl bg-sport-dark border border-sport-border p-4">
              <s.icon size={16} aria-hidden="true" className="text-sport-orange mb-2" />
              <p className="text-[10px] uppercase tracking-wider text-sport-gray">{s.label}</p>
              <p className="text-base font-black text-sport-fg mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-sport-gray mt-3">{t('statEstimated')}</p>
      </Section>

      {/* 16. Coach vocal + 17. Minuteur */}
      <div className="grid md:grid-cols-2 gap-6">
        <Section icon={Volume2} title={t('sec_coach')}>
          <VoiceCoach text={coachText} locale={locale} t={t} />
        </Section>
        <Section icon={TimerIcon} title={t('sec_timer')}>
          <Timer t={t} />
        </Section>
      </div>

      {/* 15. Notes utilisateur */}
      <Section icon={StickyNote} title={t('sec_notes')}>
        <NotesCard slug={d.slug} t={t} locale={locale} />
      </Section>

      {/* 18. Comptage automatique (à venir) */}
      <Section icon={ScanLine} title={t('sec_rep')}>
        <div className="rounded-2xl border border-dashed border-sport-border bg-sport-dark p-6 flex items-center gap-4">
          <ScanLine size={26} aria-hidden="true" className="text-sport-orange shrink-0" />
          <p className="text-sm text-sport-gray">{t('rep_soon')}</p>
        </div>
      </Section>

      {/* 13. Exercices similaires */}
      <Section icon={Dumbbell} title={t('sec_similar')}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {d.similar.map((e) => (
            <Link key={e.slug} href={`/exercices/${e.slug}`} className="group bg-sport-dark border border-sport-border rounded-xl p-4 hover:border-sport-orange/50 transition-all hover:-translate-y-0.5">
              <p className="text-sm font-black text-sport-fg group-hover:text-sport-orange transition-colors line-clamp-2">{e.name}</p>
              <p className="text-[11px] text-sport-gray mt-1 line-clamp-1">{e.muscles}</p>
              <span className="inline-flex items-center gap-1 text-sport-orange text-[11px] font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">{t('sec_similar')} <ArrowRight size={11} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  )
}
