import { redirect } from 'next/navigation'
import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getAccess } from '@/lib/access'
import { Paywall } from '@/components/dashboard/Paywall'
import { CheckCircle, Flame, TrendingUp, ArrowRight, Zap, Clock, Award } from 'lucide-react'
import { DISCIPLINE_CONTENT } from '@/lib/disciplines'
import { TodayActivity, type TrendDay } from '@/components/dashboard/TodayActivity'
import { ReviewInvite } from '@/components/reviews/ReviewInvite'

const STATUS_CLS: Record<string, string> = {
  trialing: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  active:   'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  canceled: 'bg-red-500/15 text-red-400 border-red-500/30',
  past_due: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  const cls = STATUS_CLS[status] ?? STATUS_CLS.active
  return <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${cls}`}>{label}</span>
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')

  // Contenu réservé aux abonnés (essai/actif) ; les non-abonnés voient le paywall.
  const access = await getAccess()
  if (!access.isPro) return <Paywall />

  const t = await getTranslations('dashboard')
  const locale = await getLocale()
  const dateLocale = locale === 'en' ? 'en-US' : 'fr-FR'

  // `subscriptions` est protégée par RLS (service-role) → lecture via service, filtrée par user.id.
  const now = new Date()
  const weekAgoStr = new Date(now.getTime() - 6 * 86400000).toISOString().split('T')[0]
  const service = await createServiceClient()
  const [{ data: profile }, { data: subscription }, { data: allWorkouts }, { data: progress }, { data: healthMetrics }] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle(),
    service.from('subscriptions').select('*').eq('user_id', user.id).maybeSingle(),
    supabase.from('workouts').select('*').eq('user_id', user.id).order('completed_at', { ascending: false }).limit(60),
    supabase.from('progress').select('*').eq('user_id', user.id),
    supabase.from('health_metrics').select('date, steps, active_minutes').eq('user_id', user.id).gte('date', weekAgoStr),
  ])

  const firstName = (profile?.full_name ?? '').split(' ')[0] || t('athlete')
  const totalSessions = (progress ?? []).filter(p => p.completed).length

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

  const trialEnd = subscription?.trial_end ? new Date(subscription.trial_end) : null
  const daysLeft = trialEnd ? Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / 86400000)) : null
  const renewDate = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })
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

  const disciplineSlugs = ['running-cardio', 'musculation', 'hiit', 'cyclisme', 'natation', 'crossfit']
  const plan = subscription?.plan ?? 'pro'
  const planLabel = plan === 'elite' ? (locale === 'en' ? 'Elite' : 'Élite') : 'Pro'
  const status = subscription?.status ?? 'trialing'

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-24 md:pb-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-white">
          {t.rich('overview.greeting', { name: firstName, o: (c) => <span className="text-sport-orange">{c}</span> })}
        </h1>
        <p className="text-sport-gray text-sm mt-1">{t('overview.subtitle')}</p>
      </div>

      {/* Activité du jour — anneaux temps réel façon Apple Fitness (capteur du téléphone) */}
      <TodayActivity
        initialSteps={todaySteps}
        initialActiveSec={todayActiveSec}
        weekly={weekly}
        dateLabel={dateLabel}
      />

      {/* Subscription card */}
      <div className="bg-gradient-to-br from-sport-orange/20 via-sport-card to-sport-card border border-sport-orange/30 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <StatusBadge status={status} label={t(`statusShort.${status}`)} />
              <span className="text-[11px] text-sport-gray font-semibold uppercase tracking-wider">
                {t('overview.plan', { plan: planLabel })}
              </span>
            </div>
            {daysLeft !== null && status === 'trialing' && (
              <p className="text-sm text-white font-semibold">
                <Zap size={14} className="inline text-sport-orange mr-1" />
                {t('overview.trialDaysLeft', { days: daysLeft })}
              </p>
            )}
            {renewDate && status === 'active' && (
              <p className="text-sm text-sport-gray">
                {t.rich('overview.renewOn', { date: renewDate, o: (c) => <strong className="text-white">{c}</strong> })}
              </p>
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
          { icon: CheckCircle,label: t('overview.statModules'),      value: totalSessions.toString(), color: 'text-emerald-400' },
          { icon: TrendingUp, label: t('overview.statActiveDays'),   value: activeDays.toString(),    color: 'text-sport-blue' },
          { icon: Award,      label: t('overview.statBadges'),       value: totalSessions >= 5 ? '1' : '0', color: 'text-yellow-400' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-sport-card border border-sport-border rounded-xl p-4">
            <Icon size={18} className={`${color} mb-2`} aria-hidden="true" />
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-[11px] text-sport-gray mt-0.5 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick access programmes */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-white">{t('overview.yourPrograms')}</h2>
          <Link href="/dashboard/programme" className="text-xs text-sport-orange font-bold hover:underline flex items-center gap-1">
            {t('overview.seeAll')} <ArrowRight size={11} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {disciplineSlugs.slice(0, 3).map((slug) => {
            const content = DISCIPLINE_CONTENT[slug]
            const completed = (progress ?? []).filter(p => p.discipline === slug && p.completed).length
            const total = (content?.program ?? []).reduce((acc, w) => acc + w.sessions.length, 0)
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0
            return (
              <Link key={slug} href={`/dashboard/programme?discipline=${slug}`} className="group bg-sport-card border border-sport-border rounded-xl p-4 hover:border-sport-orange/50 transition-all hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-white">{t(`overview.disciplines.${slug}`)}</p>
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
        <h2 className="text-lg font-black text-white mb-4">{t('overview.recentActivity')}</h2>
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
                    <p className="text-sm font-bold text-white capitalize">{w.discipline}</p>
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
