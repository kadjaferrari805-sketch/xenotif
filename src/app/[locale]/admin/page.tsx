import { redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { Users, TrendingUp, Euro, CheckCircle, Clock, XCircle } from 'lucide-react'
import { AdminEmailForm } from '@/components/admin/EmailForm'
import { AdminPushForm } from '@/components/admin/PushForm'
import { RevenueChart } from '@/components/admin/RevenueChart'
import { AdminReviews } from '@/components/reviews/AdminReviews'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')

  // Check admin
  const service = await createServiceClient()
  const { data: isAdmin } = await service.from('admin_users').select('id').eq('id', user.id).single()
  if (!isAdmin) redirect('/dashboard')

  const [{ data: profiles }, { data: subscriptions }] = await Promise.all([
    service.from('profiles').select('id, full_name, created_at'),
    service.from('subscriptions').select('*, profiles(full_name)'),
  ])

  const subs = subscriptions ?? []
  const totalRevenue = subs.filter(s => s.status === 'active').reduce((acc) => acc + 9.99, 0)
  const activeCount  = subs.filter(s => s.status === 'active').length
  const trialCount   = subs.filter(s => s.status === 'trialing').length
  const cancelCount  = subs.filter(s => s.status === 'canceled').length

  const STATUS_MAP: Record<string, { label: string; Icon: typeof CheckCircle; cls: string }> = {
    trialing: { label: 'Essai',  Icon: Clock,       cls: 'text-blue-400' },
    active:   { label: 'Actif',  Icon: CheckCircle, cls: 'text-emerald-400' },
    canceled: { label: 'Annulé', Icon: XCircle,     cls: 'text-red-400' },
    past_due: { label: 'Impayé', Icon: XCircle,     cls: 'text-orange-400' },
  }

  return (
    <div className="min-h-screen bg-sport-dark text-white p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-white">Admin Panel</h1>
          <p className="text-sport-gray text-sm mt-1">Vue d&apos;ensemble de la plateforme Xenotif®</p>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest bg-red-500/15 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-full">
          Accès restreint
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
        {[
          { Icon: Users,       label: 'Utilisateurs total', value: (profiles ?? []).length.toString(), color: 'text-sport-blue',   bg: 'bg-sport-blue/10' },
          { Icon: TrendingUp,  label: 'Abonnements actifs',  value: activeCount.toString(),            color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { Icon: Clock,       label: 'Essais en cours',     value: trialCount.toString(),             color: 'text-blue-400',    bg: 'bg-blue-400/10' },
          { Icon: Euro,        label: 'Revenu MRR (€)',      value: `${totalRevenue.toFixed(2)} €`,    color: 'text-sport-orange', bg: 'bg-sport-orange/10' },
        ].map(({ Icon, label, value, color, bg }) => (
          <div key={label} className="bg-sport-card border border-sport-border rounded-2xl p-5">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-4`}>
              <Icon size={18} className={color} aria-hidden="true" />
            </div>
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-[11px] text-sport-gray mt-1 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-6 mb-8">
        <h2 className="text-sm font-black text-white mb-4">Revenus mensuels (7 derniers mois)</h2>
        <RevenueChart />
      </div>

      {/* Status breakdown */}
      <div className="grid md:grid-cols-3 gap-5 mb-10">
        {[
          { label: 'Plan Pro', count: subs.filter(s => s.plan === 'pro').length, revenue: subs.filter(s => s.plan === 'pro' && s.status === 'active').length * 9.99 },
          { label: 'Résiliations', count: cancelCount, revenue: 0 },
        ].map(({ label, count, revenue }) => (
          <div key={label} className="bg-sport-card border border-sport-border rounded-2xl p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-sport-gray mb-2">{label}</p>
            <p className="text-3xl font-black text-white">{count}</p>
            {revenue > 0 && <p className="text-sm text-sport-orange font-semibold mt-1">{revenue.toFixed(2)} €/mois</p>}
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="bg-sport-card border border-sport-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-sport-border flex items-center gap-3">
          <Users size={16} className="text-sport-orange" />
          <h2 className="text-sm font-black text-white">Tous les utilisateurs ({(profiles ?? []).length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-sport-border">
                {['Utilisateur', 'Plan', 'Statut', 'Fin période', 'Inscrit le'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-sport-gray">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-sport-border">
              {(profiles ?? []).map((profile) => {
                const sub = subs.find(s => s.user_id === profile.id)
                const statusInfo = STATUS_MAP[sub?.status ?? '']
                const StatusIcon = statusInfo?.Icon
                return (
                  <tr key={profile.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-sport-orange/15 rounded-full flex items-center justify-center font-black text-sport-orange text-xs">
                          {(profile.full_name ?? 'U').slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-white">{profile.full_name ?? '—'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {sub ? (
                        <span className="text-xs font-bold uppercase text-sport-orange">{sub.plan}</span>
                      ) : <span className="text-sport-gray text-xs">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      {statusInfo ? (
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${statusInfo.cls}`}>
                          <StatusIcon size={12} aria-hidden="true" /> {statusInfo.label}
                        </span>
                      ) : <span className="text-sport-gray text-xs">—</span>}
                    </td>
                    <td className="px-5 py-4 text-xs text-sport-gray">
                      {sub?.current_period_end
                        ? new Date(sub.current_period_end).toLocaleDateString('fr-FR')
                        : '—'}
                    </td>
                    <td className="px-5 py-4 text-xs text-sport-gray">
                      {new Date(profile.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {(profiles ?? []).length === 0 && (
            <div className="text-center py-12 text-sport-gray text-sm">Aucun utilisateur pour l&apos;instant.</div>
          )}
        </div>
      </div>

      {/* Édition du contenu (CMS) */}
      <Link href="/admin/content" className="mt-10 flex items-center justify-between rounded-2xl border border-sport-border bg-sport-card px-6 py-5 hover:border-sport-orange/40 transition-all">
        <span className="text-sm font-black text-white">Éditer le contenu des disciplines</span>
        <span className="text-xs text-sport-orange font-bold">Ouvrir →</span>
      </Link>

      {/* Email broadcast */}
      <AdminEmailForm />

      {/* Push broadcast */}
      <AdminPushForm />

      {/* Avis clients — modération */}
      <AdminReviews />
    </div>
  )
}
