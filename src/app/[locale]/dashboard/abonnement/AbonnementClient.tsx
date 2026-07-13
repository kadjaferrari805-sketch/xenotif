'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { CheckCircle, AlertTriangle, CreditCard, Calendar, ArrowRight, ShieldCheck, X, RotateCcw } from 'lucide-react'

export type Sub = {
  plan: string; status: string; trial_end: string | null;
  current_period_end: string | null; cancel_at_period_end: boolean;
  stripe_subscription_id: string | null;
}

type Card = { brand: string; last4: string; exp_month: number; exp_year: number }
type Invoice = { id: string; date: string; amount: number; currency: string; pdf: string | null }
type Billing = { card: Card | null; invoices: Invoice[] }

const STATUS_CLS: Record<string, string> = {
  trialing: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  active:   'bg-emerald-500/15 text-[#1E7F5A] border-emerald-500/30',
  canceled: 'bg-red-500/15 text-red-400 border-red-500/30',
  past_due: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  const cls = STATUS_CLS[status] ?? STATUS_CLS.active
  return <span className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border ${cls}`}>{label}</span>
}

// `initialSub` est récupéré côté serveur → ouverture immédiate, sans spinner ni
// aller-retour /api/subscription au montage. La facturation (Stripe, lente) reste
// chargée en arrière-plan avec son propre skeleton.
export function AbonnementClient({ initialSub }: { initialSub: Sub | null }) {
  const t = useTranslations('dashboard.abonnement')
  const locale = useLocale()
  const dateLocale = locale === 'en' ? 'en-US' : 'fr-FR'
  const statusLabel = (s: string) => {
    const k = s === 'past_due' ? 'pastDue' : s
    return t.has(`status.${k}`) ? t(`status.${k}`) : t('status.active')
  }
  const [sub, setSub] = useState<Sub | null>(initialSub)
  const [loading, setLoading] = useState(initialSub === null)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [showCancel, setShowCancel] = useState(false)
  const [, setCancelled] = useState(false)
  const [cancelError, setCancelError] = useState('')
  const [reactivateLoading, setReactivateLoading] = useState(false)
  const [reactivateError, setReactivateError] = useState('')
  const [portalLoading, setPortalLoading] = useState(false)
  const [portalError, setPortalError] = useState('')
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState('')
  const [syncEmail, setSyncEmail] = useState('')
  const [billing, setBilling] = useState<Billing | null>(null)
  const [billingLoaded, setBillingLoaded] = useState(false)

  useEffect(() => {
    const loadBilling = () =>
      fetch('/api/subscription/billing')
        .then(r => r.json())
        .then(setBilling)
        .catch(() => {})
        .finally(() => setBillingLoaded(true))

    // Abonnement déjà fourni par le serveur → on ne charge que la facturation.
    if (initialSub) {
      if (initialSub.status) loadBilling()
      return
    }
    // Pas de ligne en base → fallback API (peut synchroniser depuis Stripe).
    fetch('/api/subscription')
      .then(r => r.json())
      .then(data => {
        setSub(data)
        setLoading(false)
        if (data?.status) loadBilling()
      })
      .catch(() => setLoading(false))
  }, [initialSub])

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
    setCancelError('')
    try {
      const res = await fetch('/api/cancel-subscription', { method: 'POST' })
      const data = await res.json()
      if (data.ok) {
        setCancelled(true)
        setShowCancel(false)
        setSub(prev => prev ? { ...prev, cancel_at_period_end: true } : null)
      } else {
        setCancelError(t('cancelError'))
      }
    } catch {
      setCancelError(t('cancelError'))
    }
    setCancelLoading(false)
  }

  async function reactivateSubscription() {
    setReactivateLoading(true)
    setReactivateError('')
    try {
      const res = await fetch('/api/reactivate-subscription', { method: 'POST' })
      const data = await res.json()
      if (data.ok) {
        setSub(prev => prev ? { ...prev, cancel_at_period_end: false, status: 'active' } : null)
      } else if (data.resubscribe) {
        setReactivateError(t('reactivateEnded'))
      } else {
        setReactivateError(t('reactivateError'))
      }
    } catch {
      setReactivateError(t('reactivateError'))
    }
    setReactivateLoading(false)
  }

  async function syncSubscription() {
    setSyncing(true)
    setSyncMsg('')
    try {
      const res = await fetch('/api/subscription/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: syncEmail.trim() || undefined }),
      })
      const data = await res.json()
      if (data.synced) { window.location.reload(); return }
      setSyncMsg(data.reason === 'already_linked' ? t('syncAlreadyLinked') : t('syncNone'))
    } catch {
      setSyncMsg(t('syncNone'))
    }
    setSyncing(false)
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
        <h1 className="text-2xl font-black text-sport-fg mb-8">{t('title')}</h1>
        <div className="bg-sport-card border border-sport-border rounded-2xl p-8 text-center">
          <CreditCard size={32} className="text-sport-gray mx-auto mb-4" />
          <p className="text-sport-fg font-bold mb-2">{t('noneTitle')}</p>
          <p className="text-sport-gray text-sm mb-6">{t('noneDesc')}</p>
          <Link href="/auth/signup?plan=pro" className="inline-flex items-center gap-2 bg-sport-orange text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-orange-600 transition-all">
            {t('choosePlan')} <ArrowRight size={14} />
          </Link>

          {/* Récupération d'un abonnement déjà payé mais non rattaché */}
          <div className="mt-6 pt-6 border-t border-sport-border">
            <p className="text-xs text-sport-gray mb-3">{t('syncHint')}</p>
            <input
              type="email"
              value={syncEmail}
              onChange={e => setSyncEmail(e.target.value)}
              placeholder={t('syncEmailPlaceholder')}
              className="w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-2.5 text-sport-fg text-sm mb-3 focus:outline-none focus:border-sport-orange placeholder:text-sport-gray"
            />
            <button
              onClick={syncSubscription}
              disabled={syncing}
              className="inline-flex items-center gap-2 border border-sport-border text-sport-fg px-5 py-2.5 rounded-full text-sm font-bold hover:border-sport-gray disabled:opacity-60 transition-all"
            >
              {syncing ? t('syncing') : t('syncCta')}
            </button>
            {syncMsg && <p className="text-xs text-sport-gray mt-3">{syncMsg}</p>}
          </div>
        </div>
      </div>
    )
  }

  const planName = 'Pro'

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto pb-24 md:pb-8">
      <h1 className="text-2xl font-black text-sport-fg mb-8">{t('title')}</h1>

      {/* Cancel confirm modal */}
      {showCancel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-sport-card border border-red-500/30 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={20} className="text-red-400 shrink-0" />
              <h3 className="text-lg font-black text-sport-fg">{t('confirmCancelTitle')}</h3>
            </div>
            <p className="text-sport-gray text-sm leading-relaxed mb-2">
              {t.rich('cancelIntro', { plan: planName, o: (c) => <strong className="text-sport-fg">{c}</strong> })}
            </p>
            {periodEnd && (
              <p className="text-sport-gray text-sm mb-6">
                {t.rich('accessUntilDate', { date: periodEnd.toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' }), o: (c) => <strong className="text-sport-fg">{c}</strong> })}
              </p>
            )}
            {cancelError && (
              <p role="alert" className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 mb-4">{cancelError}</p>
            )}
            <div className="flex gap-3">
              <button onClick={() => setShowCancel(false)}
                className="flex-1 border border-sport-border text-sport-gray py-2.5 rounded-full text-sm font-bold hover:text-sport-fg transition-all">
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
            <h2 className="text-lg font-black text-sport-fg mb-1">{t('plan', { plan: planName })}</h2>
            <StatusBadge status={isCanceled ? 'canceled' : sub.status} label={statusLabel(isCanceled ? 'canceled' : sub.status)} />
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-sport-fg">{'9,99 €'}</p>
            <p className="text-[11px] text-sport-gray">{t('perMonth')}</p>
          </div>
        </div>

        <div className="space-y-3 border-t border-sport-border pt-5">
          {isTrialing && daysLeft !== null && (
            <div className="flex items-center gap-3 text-sm">
              <Calendar size={15} className="text-blue-400 shrink-0" />
              <span className="text-sport-gray">{t.rich('trialEndsIn', { days: daysLeft, o: (c) => <strong className="text-sport-fg">{c}</strong> })}</span>
            </div>
          )}
          {periodEnd && (
            <div className="flex items-center gap-3 text-sm">
              <Calendar size={15} className="text-sport-orange shrink-0" />
              <span className="text-sport-gray">
                {isCanceled ? t('accessUntilLabel') : t('nextRenewal')} :{' '}
                <strong className="text-sport-fg">{periodEnd.toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
              </span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <ShieldCheck size={15} className="text-[#1E7F5A] shrink-0" />
            <span className="text-sport-gray">{t('securePayment')}</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-6 mb-6">
        <h3 className="text-sm font-black text-sport-fg mb-4">{t('includedTitle')}</h3>
        <ul className="space-y-2.5">
          {(t.raw('featuresPro') as string[]).map(item => (
            <li key={item} className="flex items-center gap-2.5 text-sm text-sport-gray">
              <CheckCircle size={13} className="text-[#1E7F5A] shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Paiement & factures — affichés directement sur le site */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-6 mb-6">
        <h3 className="text-sm font-black text-sport-fg mb-4">{t('billingTitle')}</h3>

        {sub.status && !billingLoaded ? (
          <div className="animate-pulse space-y-3" aria-hidden="true">
            <div className="h-5 w-52 max-w-full rounded bg-sport-dark" />
            <div className="h-4 w-28 rounded bg-sport-dark" />
            <div className="h-4 w-40 rounded bg-sport-dark" />
          </div>
        ) : (
          <>
            {billing?.card ? (
              <div className="flex items-center gap-3 text-sm mb-5">
                <CreditCard size={16} className="text-sport-gray shrink-0" />
                <span className="text-sport-fg capitalize">{billing.card.brand} •••• {billing.card.last4}</span>
                <span className="text-sport-gray text-xs">{t('expires')} {String(billing.card.exp_month).padStart(2, '0')}/{billing.card.exp_year}</span>
              </div>
            ) : (
              <p className="text-sport-gray text-sm mb-5">{t('noCard')}</p>
            )}

            <p className="text-[11px] font-bold text-sport-fg uppercase tracking-wider mb-3">{t('invoicesTitle')}</p>
            {billing && billing.invoices.length > 0 ? (
              <div className="space-y-2.5">
                {billing.invoices.map(inv => (
                  <div key={inv.id} className="flex items-center justify-between gap-3 text-sm border-b border-sport-border pb-2.5 last:border-0">
                    <span className="text-sport-gray">{new Date(inv.date).toLocaleDateString(dateLocale, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="flex-1 text-right text-sport-fg font-semibold">{inv.amount.toFixed(2)} {inv.currency === 'EUR' ? '€' : inv.currency}</span>
                    {inv.pdf
                      ? <a href={inv.pdf} target="_blank" rel="noopener noreferrer" className="shrink-0 text-sport-orange text-xs font-bold hover:underline">{t('download')}</a>
                      : <span className="shrink-0 text-sport-gray text-xs">—</span>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sport-gray text-sm">{t('noInvoices')}</p>
            )}
          </>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={openPortal}
          disabled={portalLoading}
          className="w-full border border-sport-border text-sport-fg py-3.5 rounded-full font-bold text-sm hover:border-sport-orange hover:text-sport-orange transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {portalLoading ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{t('loading')}</> : <><CreditCard size={14} /> {t('updateCard')}</>}
        </button>
        <p className="text-[11px] text-sport-gray text-center">{t('updateCardHint')}</p>
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
            <p className="text-[#1E7F5A] text-sm font-semibold">{t('cancelConfirmed')}</p>
            <p className="text-sport-gray text-xs mt-1">{t('cancelConfirmedDesc')}</p>
            {sub.cancel_at_period_end && sub.status !== 'canceled' ? (
              <>
                <button
                  onClick={reactivateSubscription}
                  disabled={reactivateLoading}
                  className="mt-4 w-full bg-sport-orange text-white py-3 rounded-full font-bold text-sm hover:bg-orange-600 disabled:opacity-60 transition-all inline-flex items-center justify-center gap-2"
                >
                  {reactivateLoading
                    ? <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />{t('reactivating')}</>
                    : <><RotateCcw size={14} /> {t('reactivate')}</>}
                </button>
                <p className="text-[11px] text-sport-gray mt-2">{t('reactivateHint')}</p>
              </>
            ) : (
              <Link href="/auth/signup?plan=pro" className="mt-4 inline-flex items-center justify-center gap-2 bg-sport-orange text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-orange-600 transition-all">
                {t('resubscribe')} <ArrowRight size={14} />
              </Link>
            )}
            {reactivateError && (
              <p role="alert" className="text-red-400 text-xs mt-3">{reactivateError}</p>
            )}
          </div>
        )}
      </div>

      <p className="text-center text-[11px] text-sport-gray mt-6">
        {t('questions')} <a href="mailto:contact@xenotif.com" className="text-sport-orange hover:underline">contact@xenotif.com</a>
      </p>
    </div>
  )
}
