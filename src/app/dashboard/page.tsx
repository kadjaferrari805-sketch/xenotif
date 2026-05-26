import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CheckCircle, Flame, TrendingUp, Calendar, ArrowRight, Zap, Clock, Award } from 'lucide-react'
import { DISCIPLINE_CONTENT } from '@/lib/disciplines'

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    trialing: { label: 'Essai gratuit', cls: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
    active:   { label: 'Actif',         cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
    canceled: { label: 'Annulé',        cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
    past_due: { label: 'Paiement dû',   cls: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  }
  const { label, cls } = map[status] ?? map.active
  return <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${cls}`}>{label}</span>
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')

  const [{ data: profile }, { data: subscription }, { data: workouts }, { data: progress }] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
    supabase.from('subscriptions').select('*').eq('user_id', user.id).single(),
    supabase.from('workouts').select('*').eq('user_id', user.id).order('completed_at', { ascending: false }).limit(5),
    supabase.from('progress').select('*').eq('user_id', user.id),
  ])

  const firstName = (profile?.full_name ?? '').split(' ')[0] || 'Athlète'
  const totalSessions = (progress ?? []).filter(p => p.completed).length
  const totalWorkouts = (workouts ?? []).length

  const now = new Date()
  const trialEnd = subscription?.trial_end ? new Date(subscription.trial_end) : null
  const daysLeft = trialEnd ? Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / 86400000)) : null
  const renewDate = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const disciplineSlugs = ['running-cardio', 'musculation', 'hiit', 'cyclisme', 'natation', 'crossfit']
  const plan = subscription?.plan ?? 'pro'

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-24 md:pb-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-white">
          Bonjour, <span className="text-sport-orange">{firstName}</span> 👋
        </h1>
        <p className="text-sport-gray text-sm mt-1">Prêt à t&apos;entraîner ? Voici ton tableau de bord.</p>
      </div>

      {/* Subscription card */}
      <div className="bg-gradient-to-br from-sport-orange/20 via-sport-card to-sport-card border border-sport-orange/30 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <StatusBadge status={subscription?.status ?? 'trialing'} />
              <span className="text-[11px] text-sport-gray font-semibold uppercase tracking-wider">
                Plan {plan === 'elite' ? 'Élite' : 'Pro'}
              </span>
            </div>
            {daysLeft !== null && subscription?.status === 'trialing' && (
              <p className="text-sm text-white font-semibold">
                <Zap size={14} className="inline text-sport-orange mr-1" />
                {daysLeft} jour{daysLeft > 1 ? 's' : ''} d&apos;essai gratuit restant{daysLeft > 1 ? 's' : ''}
              </p>
            )}
            {renewDate && subscription?.status === 'active' && (
              <p className="text-sm text-sport-gray">
                Renouvellement le <strong className="text-white">{renewDate}</strong>
              </p>
            )}
          </div>
          <Link href="/dashboard/abonnement" className="inline-flex items-center gap-2 text-sport-orange text-xs font-bold hover:underline">
            Gérer <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Flame,      label: 'Séances cette semaine', value: totalWorkouts.toString(), color: 'text-sport-orange' },
          { icon: CheckCircle,label: 'Modules complétés',     value: totalSessions.toString(), color: 'text-emerald-400' },
          { icon: TrendingUp, label: 'Jours d\'activité',     value: '0',                      color: 'text-sport-blue' },
          { icon: Award,      label: 'Badges obtenus',        value: totalSessions >= 5 ? '1' : '0', color: 'text-yellow-400' },
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
          <h2 className="text-lg font-black text-white">Tes programmes</h2>
          <Link href="/dashboard/programme" className="text-xs text-sport-orange font-bold hover:underline flex items-center gap-1">
            Voir tout <ArrowRight size={11} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {disciplineSlugs.slice(0, 3).map((slug) => {
            const content = DISCIPLINE_CONTENT[slug]
            const completed = (progress ?? []).filter(p => p.discipline === slug && p.completed).length
            const total = (content?.program ?? []).reduce((acc, w) => acc + w.sessions.length, 0)
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0
            const names: Record<string, string> = {
              'running-cardio': 'Running & Cardio', musculation: 'Musculation',
              hiit: 'HIIT', cyclisme: 'Cyclisme', natation: 'Natation', crossfit: 'CrossFit'
            }
            return (
              <Link key={slug} href={`/dashboard/programme?discipline=${slug}`} className="group bg-sport-card border border-sport-border rounded-xl p-4 hover:border-sport-orange/50 transition-all hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-white">{names[slug]}</p>
                  <span className="text-xs text-sport-orange font-bold">{pct}%</span>
                </div>
                <div className="w-full bg-sport-dark rounded-full h-1.5 mb-2">
                  <div className="bg-sport-orange h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[11px] text-sport-gray">{completed}/{total} séances</p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="text-lg font-black text-white mb-4">Activité récente</h2>
        {(workouts ?? []).length === 0 ? (
          <div className="bg-sport-card border border-sport-border rounded-xl p-8 text-center">
            <Clock size={28} className="text-sport-gray mx-auto mb-3" />
            <p className="text-sport-gray text-sm">Aucune séance enregistrée pour l&apos;instant.</p>
            <Link href="/dashboard/programme" className="inline-flex items-center gap-1.5 mt-4 text-sport-orange text-sm font-bold hover:underline">
              Commencer un programme <ArrowRight size={12} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {(workouts ?? []).map((w) => (
              <div key={w.id} className="bg-sport-card border border-sport-border rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-sport-orange/15 rounded-lg flex items-center justify-center">
                    <Flame size={14} className="text-sport-orange" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white capitalize">{w.discipline}</p>
                    <p className="text-[11px] text-sport-gray">{new Date(w.completed_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <span className="text-xs text-sport-gray">{w.duration_minutes} min</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
