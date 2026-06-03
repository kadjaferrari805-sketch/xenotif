'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { CheckCircle, AlertTriangle, CreditCard, Calendar, ArrowRight, ShieldCheck, X } from 'lucide-react'

type Sub = {
  plan: string; status: string; trial_end: string | null;
  current_period_end: string | null; cancel_at_period_end: boolean;
  stripe_subscription_id: string | null;
}

const STATUS_CLS: Record<string, string> = {
  trialing: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  active:   'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  canceled: 'bg-red-500/15 text-red-400 border-red-500/30',
  past_due: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  const cls = STATUS_CLS[status] ?? STATUS_CLS.active
  return <span className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border ${cls}`}>{label}</span>
}

export default function AbonnementPage() {
  const t = useTranslations('dashboard.abonnement')
  const locale = useLocale()
  const dateLocale = locale === 'en' ? 'en-US' : 'fr-FR'
  const statusLabel = (s: string) => {
    const k = s === 'past_due' ? 'pastDue' : s
    return t.has(`status.${k}`) ? t(`status.${k}`) : t('status.active')
  }
  const [sub, setSub] = useState<Sub | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [showCancel, setShowCancel] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [portalError, setPortalError] = useState('')

  useEffect(() => {
    fetch('/api/subscription')
      .then(r => r.json())
      .then(data => { setSub(data); setLoading(false) })
      .catch(() => setLoading(false))
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
    setPortalError('')
    const res = await fetch('/api/stripe-portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      setPortalError(
        data.error === 'portal_not_configured'
          ? t('portalNotConfigured')
          : (data.error ?? t('portalError'))
      )
      setPortalLoading(false)
    }
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
        <h1 className="text-2xl font-black text-white mb-8">{t('title')}</h1>
        <div className="bg-sport-card border border-sport-border rounded-2xl p-8 text-center">
          <CreditCard size={32} className="text-sport-gray mx-auto mb-4" />
          <p className="text-white font-bold mb-2">{t('noneTitle')}</p>
          <p className="text-sport-gray text-sm mb-6">{t('noneDesc')}</p>
          <Link href="/auth/signup?plan=pro" className="inline-flex items-center gap-2 bg-sport-orange text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-orange-600 transition-all">
            {t('choosePlan')} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    )
  }

  const planName = sub.plan === 'elite' ? (locale === 'en' ? 'Elite' : 'Élite') : 'Pro'

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto pb-24 md:pb-8">
      <h1 className="text-2xl font-black text-white mb-8">{t('title')}</h1>

      {/* Cancel confirm modal */}
      {showCancel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-sport-card border border-red-500/30 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={20} className="text-red-400 shrink-0" />
              <h3 className="text-lg font-black text-white">{t('confirmCancelTitle')}</h3>
            </div>
            <p className="text-sport-gray text-sm leading-relaxed mb-2">
              {t.rich('cancelIntro', { plan: planName, o: (c) => <strong className="text-white">{c}</strong> })}
            </p>
            {periodEnd && (
              <p className="text-sport-gray text-sm mb-6">
                {t.rich('accessUntilDate', { date: periodEnd.toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' }), o: (c) => <strong className="text-white">{c}</strong> })}
              </p>
            )}
            <div className="flex gap-3">
              <button onClick={() => setShowCancel(false)}
                className="flex-1 border border-sport-border text-sport-gray py-2.5 rounded-full text-sm font-bold hover:text-white transition-all">
                {t('cancel')}
              </button>
              <button onClick={cancelSubscription} disabled={cancelLoading}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-full text-sm font-bold hover:bg-red-600 disabled:opacity-60 transition-all inline-flex items-center justify-center gap-2">
                {cancelLoading ? <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />{t('cancelling')}</> : t('confirmCancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plan card */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
          <div>
            <h2 className="text-lg font-black text-white mb-1">{t('plan', { plan: planName })}</h2>
            <StatusBadge status={isCanceled ? 'canceled' : sub.status} label={statusLabel(isCanceled ? 'canceled' : sub.status)} />
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-white">{sub.plan === 'elite' ? '24,99 €' : '9,99 €'}</p>
            <p className="text-[11px] text-sport-gray">{t('perMonth')}</p>
          </div>
        </div>

        <div className="space-y-3 border-t border-sport-border pt-5">
          {isTrialing && daysLeft !== null && (
            <div className="flex items-center gap-3 text-sm">
              <Calendar size={15} className="text-blue-400 shrink-0" />
              <span className="text-sport-gray">{t.rich('trialEndsIn', { days: daysLeft, o: (c) => <strong className="text-white">{c}</strong> })}</span>
            </div>
          )}
          {periodEnd && (
            <div className="flex items-center gap-3 text-sm">
              <Calendar size={15} className="text-sport-orange shrink-0" />
              <span className="text-sport-gray">
                {isCanceled ? t('accessUntilLabel') : t('nextRenewal')} :{' '}
                <strong className="text-white">{periodEnd.toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
              </span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
            <span className="text-sport-gray">{t('securePayment')}</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-6 mb-6">
        <h3 className="text-sm font-black text-white mb-4">{t('includedTitle')}</h3>
        <ul className="space-y-2.5">
          {((sub.plan === 'elite' ? t.raw('featuresElite') : t.raw('featuresPro')) as string[]).map(item => (
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
          {portalLoading ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{t('loading')}</> : <><CreditCard size={14} /> {t('managePayment')}</>}
        </button>
        {portalError && (
          <p className="text-xs text-orange-400 bg-orange-400/10 border border-orange-400/20 rounded-xl px-4 py-3 leading-relaxed">{portalError}</p>
        )}

        {(isTrialing || isActive) && !isCanceled && (
          <button
            onClick={() => setShowCancel(true)}
            className="w-full border border-red-500/30 text-red-400 py-3.5 rounded-full font-bold text-sm hover:bg-red-500/5 hover:border-red-500/50 transition-all inline-flex items-center justify-center gap-2"
          >
            <X size={14} /> {t('unsubscribe')}
          </button>
        )}

        {isCanceled && (
          <div className="text-center p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <p className="text-emerald-400 text-sm font-semibold">{t('cancelConfirmed')}</p>
            <p className="text-sport-gray text-xs mt-1">{t('cancelConfirmedDesc')}</p>
          </div>
        )}
      </div>

      <p className="text-center text-[11px] text-sport-gray mt-6">
        {t('questions')} <a href="mailto:contact@xenotif.com" className="text-sport-orange hover:underline">contact@xenotif.com</a>
      </p>
    </div>
  )
}
