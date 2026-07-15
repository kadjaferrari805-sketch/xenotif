import { redirect } from 'next/navigation'
import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAccess } from '@/lib/access'
import { getCurrentUser, getProfileName } from '@/lib/supabase/session'
import { CheckCircle, Flame, TrendingUp, ArrowRight, Clock, Award } from 'lucide-react'
import { DISCIPLINE_CONTENT } from '@/lib/disciplines'
import { getDisciplineFromDb } from '@/lib/content-db'
import { computeXp, xpToLevel } from '@/lib/gamification'
import { XpLevelBar } from '@/components/gamification/XpLevelBar'
import { TodayActivity, type TrendDay } from '@/components/dashboard/TodayActivity'
import { ReviewInvite } from '@/components/reviews/ReviewInvite'
import { OfferBanner } from '@/components/promo/OfferBanner'

// Textes de la bannière « Pro offert » (vrai décompte d'essai) sur le dashboard.
const TRIAL_TXT: Record<string, { title: string; sub: string; cta: string }> = {
  fr: { title: '⚡ Ton accès Pro est OFFERT', sub: 'Profites-en à fond - il disparaît dans :', cta: 'Je garde le Pro' },
  en: { title: '⚡ Your Pro access is FREE', sub: 'Make the most of it - it’s gone in:', cta: 'Keep my Pro' },
  de: { title: '⚡ Dein Pro-Zugang ist GRATIS', sub: 'Nutze es voll - es endet in:', cta: 'Pro behalten' },
}

// Utilisateur gratuit (essai terminé) : upsell Pro avec urgence du jour.
const FREE_TXT: Record<string, { title: string; sub: string; cta: string }> = {
  fr: { title: '🔥 Débloque TOUT le Pro', sub: 'Coach IA + toutes les disciplines. Offre du jour, plus que :', cta: 'Passer en Pro' },
  en: { title: '🔥 Unlock ALL of Pro', sub: 'AI coach + every discipline. Today’s deal, ends in:', cta: 'Go Pro' },
  de: { title: '🔥 Schalte ALLES in Pro frei', sub: 'KI-Coach + alle Sportarten. Angebot heute, nur noch:', cta: 'Pro holen' },
}

const STATUS_CLS: Record<string, string> = {
  trialing: 'bg-blue-50 text-blue-700 border-blue-200',
  active:   'bg-emerald-50 text-[#1E7F5A] border-emerald-200',
  canceled: 'bg-red-50 text-red-700 border-red-200',
  past_due: 'bg-orange-50 text-orange-700 border-orange-200',
  free:     'bg-sport-fg/10 text-sport-gray border-sport-border',
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  const cls = STATUS_CLS[status] ?? STATUS_CLS.active
  return <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${cls}`}>{label}</span>
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/signin')

  const t = await getTranslations('dashboard')
  const locale = await getLocale()
  const dateLocale = locale === 'en' ? 'en-US' : 'fr-FR'

  const now = new Date()
  const weekAgoStr = new Date(now.getTime() - 6 * 86400000).toISOString().split('T')[0]
  const supabase = await createClient()
  const overviewSlugs = ['running-cardio', 'musculation', 'hiit'] as const

  // Une seule vague parallèle : accès, profil, activité (RLS user) et contenu des 3 programmes.
  const [access, fullName, { data: allWorkouts }, { count: workoutCount }, { data: progress }, { data: healthMetrics }, overviewPairs] = await Promise.all([
    getAccess(),
    getProfileName(),
    supabase.from('workouts').select('*').eq('user_id', user.id).order('completed_at', { ascending: false }).limit(60),
    supabase.from('workouts').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('progress').select('*').eq('user_id', user.id),
    supabase.from('health_metrics').select('date, steps, active_minutes').eq('user_id', user.id).gte('date', weekAgoStr),
    Promise.all(overviewSlugs.map(async (s) => [s, (await getDisciplineFromDb(s, locale))?.content ?? DISCIPLINE_CONTENT[s]] as const)),
  ])
  const overviewContents = Object.fromEntries(overviewPairs)

  const firstName = (fullName ?? '').split(' ')[0] || t('athlete')
  const totalSessions = (progress ?? []).filter(p => p.completed).length
  const gamXp = computeXp(workoutCount ?? 0, totalSessions)
  const gamLevel = xpToLevel(gamXp)

  // ── Activité de la semaine : séances loggées + modules de programme ──
  const workouts = allWorkouts ?? []
  const recentWorkouts = workouts.slice(0, 5)
  const progressRows = progress ?? []
  const weekAgoMs = now.getTime() - 7 * 86400000
  const dayOf = (d: string | null) => (d ? d.split('T')[0] : '')
  const withinWeek = (d: string | null) => !!d && new Date(d).getTime() >= weekAgoMs

  const weekWorkouts = workouts.filter(w => withinWeek(w.completed_at))
  const progWeek = progressRows.filter(p => p.completed && withinWeek(p.completed_at))
  const sessionsThisWeek = weekWorkouts.length + progWeek.length
  const activeDays = new Set([
    ...weekWorkouts.map(w => dayOf(w.completed_at)),
    ...progWeek.map(p => dayOf(p.completed_at)),
  ]).size

  const renewDate = access.renewDate
    ? access.renewDate.toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  // ── Activité du jour + tendance 7 jours (depuis health_metrics) ──
  // Plusieurs sources possibles par jour (live, demo, fitbit…) → on garde le max par date.
  const todayStr = now.toISOString().split('T')[0]
  const metricsByDate = new Map<string, { steps: number; active: number }>()
  for (const m of healthMetrics ?? []) {
    const prev = metricsByDate.get(m.date) ?? { steps: 0, active: 0 }
    metricsByDate.set(m.date, {
      steps: Math.max(prev.steps, m.steps ?? 0),
      active: Math.max(prev.active, m.active_minutes ?? 0),
    })
  }
  const weekly: TrendDay[] = Array.from({ length: 7 }, (_, idx) => {
    const d = new Date(now.getTime() - (6 - idx) * 86400000)
    const key = d.toISOString().split('T')[0]
    const entry = metricsByDate.get(key)
    const lbl = d.toLocaleDateString(dateLocale, { weekday: 'short' }).replace('.', '')
    return {
      label: lbl.charAt(0).toUpperCase() + lbl.slice(1),
      steps: entry?.steps ?? 0,
      isToday: key === todayStr,
    }
  })
  const todayMetric = metricsByDate.get(todayStr)
  const todaySteps = todayMetric?.steps ?? 0
  const todayActiveSec = (todayMetric?.active ?? 0) * 60
  const dateLabel = now.toLocaleDateString(dateLocale, { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-24 md:pb-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-sport-fg">
          {t.rich('overview.greeting', { name: firstName, o: (c) => <span className="text-sport-orange">{c}</span> })}
        </h1>
        <p className="text-sport-gray text-sm mt-1">{t('overview.subtitle')}</p>
      </div>

      {/* Pub Pro clignotante : en essai → vrai décompte ; gratuit (essai fini) → upsell.
          Rien pour les abonnés Pro payants (status 'active'). */}
      {access.status === 'trialing' && access.trialEnd ? (
        <div className="mb-6">
          <OfferBanner
            title={(TRIAL_TXT[locale] ?? TRIAL_TXT.fr).title}
            subtitle={(TRIAL_TXT[locale] ?? TRIAL_TXT.fr).sub}
            targetMs={access.trialEnd.getTime()}
            withDays
            cta={{ href: '/dashboard/abonnement', label: (TRIAL_TXT[locale] ?? TRIAL_TXT.fr).cta }}
          />
        </div>
      ) : !access.isPro ? (
        <div className="mb-6">
          <OfferBanner
            title={(FREE_TXT[locale] ?? FREE_TXT.fr).title}
            subtitle={(FREE_TXT[locale] ?? FREE_TXT.fr).sub}
            daily
            cta={{ href: '/dashboard/abonnement', label: (FREE_TXT[locale] ?? FREE_TXT.fr).cta }}
          />
        </div>
      ) : null}

      {/* Niveau / XP (gamification) */}
      <div className="mb-6">
        <XpLevelBar xp={gamXp} levelKey={gamLevel.levelKey} xpInLevel={gamLevel.xpInLevel} xpForNext={gamLevel.xpForNext} compact />
      </div>

      {/* Activité du jour - anneaux temps réel façon Apple Fitness (capteur) - PRO */}
      {access.isPro && (
        <TodayActivity
          initialSteps={todaySteps}
          initialActiveSec={todayActiveSec}
          weekly={weekly}
          dateLabel={dateLabel}
        />
      )}

      {/* Subscription card */}
      <div className="bg-gradient-to-br from-sport-orange/20 via-sport-card to-sport-card border border-sport-orange/30 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <StatusBadge status={access.isPro ? 'active' : 'free'} label={access.isPro ? t('statusShort.active') : t('overview.freeBadge')} />
              <span className="text-[11px] text-sport-gray font-semibold uppercase tracking-wider">
                {t('overview.plan', { plan: access.isPro ? 'Pro' : t('overview.freePlan') })}
              </span>
            </div>
            {access.isPro && renewDate && (
              <p className="text-sm text-sport-gray">
                {t.rich('overview.renewOn', { date: renewDate, o: (c) => <strong className="text-sport-fg">{c}</strong> })}
              </p>
            )}
            {!access.isPro && (
              <p className="text-sm text-sport-fg font-semibold">{t('overview.freeUpsell')}</p>
            )}
          </div>
          <Link href="/dashboard/abonnement" className="inline-flex items-center gap-2 text-sport-orange text-xs font-bold hover:underline">
            {t('overview.manage')} <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Flame,      label: t('overview.statSessionsWeek'), value: sessionsThisWeek.toString(), color: 'text-sport-orange' },
          { icon: CheckCircle,label: t('overview.statModules'),      value: totalSessions.toString(), color: 'text-[#1E7F5A]' },
          { icon: TrendingUp, label: t('overview.statActiveDays'),   value: activeDays.toString(),    color: 'text-sport-blue' },
          { icon: Award,      label: t('overview.statBadges'),       value: totalSessions >= 5 ? '1' : '0', color: 'text-yellow-600' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-sport-card border border-sport-border rounded-xl p-4">
            <Icon size={18} className={`${color} mb-2`} aria-hidden="true" />
            <p className="text-2xl font-black text-sport-fg">{value}</p>
            <p className="text-[11px] text-sport-gray mt-0.5 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick access programmes */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-sport-fg">{t('overview.yourPrograms')}</h2>
          <Link href="/dashboard/programme" className="text-xs text-sport-orange font-bold hover:underline flex items-center gap-1">
            {t('overview.seeAll')} <ArrowRight size={11} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {overviewSlugs.map((slug) => {
            const content = overviewContents[slug]
            const completed = (progress ?? []).filter(p => p.discipline === slug && p.completed).length
            const total = (content?.program ?? []).reduce((acc, w) => acc + w.sessions.length, 0)
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0
            return (
              <Link key={slug} href={`/dashboard/programme?discipline=${slug}`} className="group bg-sport-card border border-sport-border rounded-xl p-4 hover:border-sport-orange/50 transition-all hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-sport-fg">{t(`overview.disciplines.${slug}`)}</p>
                  <span className="text-xs text-sport-orange font-bold">{pct}%</span>
                </div>
                <div className="w-full bg-sport-dark rounded-full h-1.5 mb-2">
                  <div className="bg-sport-orange h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[11px] text-sport-gray">{t('overview.sessions', { completed, total })}</p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="text-lg font-black text-sport-fg mb-4">{t('overview.recentActivity')}</h2>
        {recentWorkouts.length === 0 ? (
          <div className="bg-sport-card border border-sport-border rounded-xl p-8 text-center">
            <Clock size={28} className="text-sport-gray mx-auto mb-3" />
            <p className="text-sport-gray text-sm">{t('overview.noActivity')}</p>
            <Link href="/dashboard/programme" className="inline-flex items-center gap-1.5 mt-4 text-sport-orange text-sm font-bold hover:underline">
              {t('overview.startProgram')} <ArrowRight size={12} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentWorkouts.map((w) => (
              <div key={w.id} className="bg-sport-card border border-sport-border rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-sport-orange/15 rounded-lg flex items-center justify-center">
                    <Flame size={14} className="text-sport-orange" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-sport-fg capitalize">{w.discipline}</p>
                    <p className="text-[11px] text-sport-gray">{new Date(w.completed_at).toLocaleDateString(dateLocale)}</p>
                  </div>
                </div>
                <span className="text-xs text-sport-gray">{t('overview.min', { minutes: w.duration_minutes })}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invitation à laisser un avis (abonnés vérifiés uniquement) */}
      <div className="mt-8">
        <ReviewInvite />
      </div>
    </div>
  )
}
