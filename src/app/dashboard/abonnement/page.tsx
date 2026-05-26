'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, AlertTriangle, CreditCard, Calendar, ArrowRight, ShieldCheck, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Sub = {
  plan: string; status: string; trial_end: string | null;
  current_period_end: string | null; cancel_at_period_end: boolean;
  stripe_subscription_id: string | null;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    trialing: { label: 'Essai gratuit en cours', cls: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
    active:   { label: 'Actif',                  cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
    canceled: { label: 'Annulé',                 cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
    past_due: { label: 'Paiement en attente',    cls: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  }
  const { label, cls } = map[status] ?? map.active
  return <span className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border ${cls}`}>{label}</span>
}

export default function AbonnementPage() {
  const [sub, setSub] = useState<Sub | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [showCancel, setShowCancel] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).single()
      setSub(data)
      setLoading(false)
    }
    load()
  }, [])

  const now = new Date()
  const trialEnd = sub?.trial_end ? new Date(sub.trial_end) : null
  const periodEnd = sub?.current_period_end ? new Date(sub.current_period_end) : null
  const daysLeft = trialEnd ? Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / 86400000)) : null
  const isTrialing = sub?.status === 'trialing'
  const isActive = sub?.status === 'active'
  const isCanceled = sub?.status === 'canceled' || sub?.cancel_at_period_end

  async function openPortal() {
    setPortalLoading(true)
    const res = await fetch('/api/stripe-portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else setPortalLoading(false)
  }

  async function cancelSubscription() {
    setCancelLoading(true)
    const res = await fetch('/api/cancel-subscription', { method: 'POST' })
    const data = await res.json()
    if (data.ok) {
      setCancelled(true)
      setShowCancel(false)
      setSub(prev => prev ? { ...prev, cancel_at_period_end: true } : null)
    }
    setCancelLoading(false)
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="w-6 h-6 border-2 border-sport-orange/40 border-t-sport-orange rounded-full animate-spin" />
      </div>
    )
  }

  if (!sub) {
    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-black text-white mb-8">Mon Abonnement</h1>
        <div className="bg-sport-card border border-sport-border rounded-2xl p-8 text-center">
          <CreditCard size={32} className="text-sport-gray mx-auto mb-4" />
          <p className="text-white font-bold mb-2">Aucun abonnement actif</p>
          <p className="text-sport-gray text-sm mb-6">Choisis un plan pour accéder à tous les programmes.</p>
          <a href="/auth/signup?plan=pro" className="inline-flex items-center gap-2 bg-sport-orange text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-orange-600 transition-all">
            Choisir un plan <ArrowRight size={14} />
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto pb-24 md:pb-8">
      <h1 className="text-2xl font-black text-white mb-8">Mon Abonnement</h1>

      {/* Cancel confirm modal */}
      {showCancel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-sport-card border border-red-500/30 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={20} className="text-red-400 shrink-0" />
              <h3 className="text-lg font-black text-white">Confirmer la résiliation</h3>
            </div>
            <p className="text-sport-gray text-sm leading-relaxed mb-2">
              Tu vas résilier ton abonnement <strong className="text-white">Plan {sub.plan === 'elite' ? 'Élite' : 'Pro'}</strong>.
            </p>
            {periodEnd && (
              <p className="text-sport-gray text-sm mb-6">
                Ton accès reste actif jusqu&apos;au <strong className="text-white">{periodEnd.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>.
              </p>
            )}
            <div className="flex gap-3">
              <button onClick={() => setShowCancel(false)}
                className="flex-1 border border-sport-border text-sport-gray py-2.5 rounded-full text-sm font-bold hover:text-white transition-all">
                Annuler
              </button>
              <button onClick={cancelSubscription} disabled={cancelLoading}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-full text-sm font-bold hover:bg-red-600 disabled:opacity-60 transition-all inline-flex items-center justify-center gap-2">
                {cancelLoading ? <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Résiliation…</> : 'Confirmer la résiliation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plan card */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
          <div>
            <h2 className="text-lg font-black text-white mb-1">Plan {sub.plan === 'elite' ? 'Élite' : 'Pro'}</h2>
            <StatusBadge status={isCanceled ? 'canceled' : sub.status} />
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-white">{sub.plan === 'elite' ? '24,99 €' : '9,99 €'}</p>
            <p className="text-[11px] text-sport-gray">par mois</p>
          </div>
        </div>

        <div className="space-y-3 border-t border-sport-border pt-5">
          {isTrialing && daysLeft !== null && (
            <div className="flex items-center gap-3 text-sm">
              <Calendar size={15} className="text-blue-400 shrink-0" />
              <span className="text-sport-gray">Fin de l&apos;essai gratuit dans <strong className="text-white">{daysLeft} jour{daysLeft > 1 ? 's' : ''}</strong></span>
            </div>
          )}
          {periodEnd && (
            <div className="flex items-center gap-3 text-sm">
              <Calendar size={15} className="text-sport-orange shrink-0" />
              <span className="text-sport-gray">
                {isCanceled ? 'Accès jusqu\'au' : 'Prochain renouvellement'} :{' '}
                <strong className="text-white">{periodEnd.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
              </span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
            <span className="text-sport-gray">Paiement sécurisé via Stripe</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-6 mb-6">
        <h3 className="text-sm font-black text-white mb-4">Inclus dans ton plan</h3>
        <ul className="space-y-2.5">
          {(sub.plan === 'elite' ? [
            'Tout le plan Pro inclus',
            'Coach personnel dédié',
            'Bilan mensuel visio 1-1',
            'Plan nutritionnel sur mesure',
            'Analyse biomécanique vidéo',
            'Accès anticipé aux nouveautés',
          ] : [
            'Tous les programmes illimités',
            'Coaching IA personnalisé',
            'Statistiques & suivi avancé',
            'Vidéos HD haute qualité',
            'Support prioritaire 7j/7',
            'Challenges communautaires',
          ]).map(item => (
            <li key={item} className="flex items-center gap-2.5 text-sm text-sport-gray">
              <CheckCircle size={13} className="text-emerald-400 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={openPortal}
          disabled={portalLoading}
          className="w-full border border-sport-border text-white py-3.5 rounded-full font-bold text-sm hover:border-sport-orange hover:text-sport-orange transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {portalLoading ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Chargement…</> : <><CreditCard size={14} /> Gérer le paiement & les factures</>}
        </button>

        {(isTrialing || isActive) && !isCanceled && (
          <button
            onClick={() => setShowCancel(true)}
            className="w-full border border-red-500/30 text-red-400 py-3.5 rounded-full font-bold text-sm hover:bg-red-500/5 hover:border-red-500/50 transition-all inline-flex items-center justify-center gap-2"
          >
            <X size={14} /> Se désabonner
          </button>
        )}

        {isCanceled && (
          <div className="text-center p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <p className="text-emerald-400 text-sm font-semibold">✓ Résiliation confirmée</p>
            <p className="text-sport-gray text-xs mt-1">Ton accès reste actif jusqu&apos;à la fin de la période.</p>
          </div>
        )}
      </div>

      <p className="text-center text-[11px] text-sport-gray mt-6">
        Des questions ? Contacte-nous à <a href="mailto:contact@xenotif.com" className="text-sport-orange hover:underline">contact@xenotif.com</a>
      </p>
    </div>
  )
}
