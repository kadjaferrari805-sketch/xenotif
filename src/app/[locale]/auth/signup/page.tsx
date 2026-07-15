'use client'

import { Suspense, useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { Link, useRouter } from '@/i18n/navigation'
import { ArrowRight, CheckCircle, Zap, Eye, EyeOff, Lock, ShieldCheck, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { trackMeta } from '@/lib/meta-pixel'
import { trackSignUp } from '@/lib/analytics'
import { Logo } from '@/components/ui/Logo'
import { ProOfferPill, PRO_OFFER_TXT } from '@/components/promo/ProOfferPill'

type PlanId = 'gratuit' | 'pro'
type Period = 'monthly' | 'annual'

// Données structurelles (id, prix, mise en avant). Les textes (nom, période,
// badge, fonctionnalités) viennent de messages → auth.signup.plans.
const PLANS: { id: PlanId; priceMonthly: string; priceAnnual: string; totalAnnual?: string; highlight: boolean }[] = [
  { id: 'gratuit', priceMonthly: '0 €',     priceAnnual: '0 €',     highlight: false },
  { id: 'pro',     priceMonthly: '9,99 €',  priceAnnual: '7,99 €',  totalAnnual: '95,88 €',  highlight: true },
]

// Valeur (€) envoyée à l'événement Meta InitiateCheckout selon la période.
const PRO_VALUE: Record<Period, number> = { monthly: 9.99, annual: 95.88 }

type PlanText = { name: string; period: string; badge: string; features: string[] }

const INPUT = 'input-base'

function SignUpForm() {
  const t = useTranslations('auth.signup')
  const tt = useTranslations('trust')
  const locale = useLocale()
  const plans = t.raw('plans') as PlanText[]
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('pro')
  const [period, setPeriod] = useState<Period>('annual')
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  /* eslint-disable react-hooks/set-state-in-effect --
     Pré-remplit le formulaire depuis les paramètres d'URL (plan/période/email) au montage. */
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace('/dashboard')
    })
    const plan = searchParams.get('plan') as PlanId
    if (plan && ['gratuit', 'pro'].includes(plan)) setSelectedPlan(plan)
    const per = searchParams.get('period')
    if (per === 'annual' || per === 'monthly') setPeriod(per)
    const email = searchParams.get('email')
    if (email) setForm(prev => ({ ...prev, email }))
  }, [searchParams, router])
  /* eslint-enable react-hooks/set-state-in-effect */

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password.length < 8) { setError(t('errorShortPassword')); return }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.fullName.trim() },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (signUpError) {
      const msg = signUpError.message.toLowerCase()
      setError(
        msg.includes('already registered') || msg.includes('already in use')
          ? t('errorAlreadyUsed')
          : signUpError.message
      )
      setLoading(false)
      return
    }

    // Conversion : inscription réussie (Meta Pixel + GA4 sign_up)
    trackMeta('CompleteRegistration', { content_name: selectedPlan })
    trackSignUp(selectedPlan)

    if (selectedPlan !== 'gratuit') {
      // Conversion Meta Pixel : passage au paiement
      trackMeta('InitiateCheckout', { content_name: `${selectedPlan}-${period}`, value: PRO_VALUE[period], currency: 'EUR' })
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan, period, locale, email: form.email, userId: signUpData.user?.id }),
      })
      const data = await res.json()
      if (data.url) { window.location.href = data.url; return }
      setError(data.error ?? t('errorCheckout'))
      setLoading(false)
      return
    }

    // Plan gratuit : la confirmation email étant désactivée, l'utilisateur est connecté
    // immédiatement (session présente). On envoie l'email de bienvenue puis on l'emmène
    // sur son espace. Si la confirmation est encore active (pas de session), on garde
    // l'écran « vérifie ta boîte mail ».
    if (signUpData.session) {
      await fetch('/api/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale }),
      }).catch(() => {})
      router.replace('/dashboard')
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={28} className="text-[#1E7F5A]" />
        </div>
        <h2 className="text-xl font-black text-sport-fg mb-3">{t('doneTitle')}</h2>
        <p className="text-sport-gray text-sm leading-relaxed mb-6">
          {t.rich('doneText', { email: form.email, b: (c) => <strong className="text-sport-fg">{c}</strong> })}<br />
          {t('doneCta')}
        </p>
        <Link href="/auth/signin" className="text-sport-orange text-sm font-bold hover:underline">
          {t('backToSignin')}
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sport-dark px-4 py-12">
      <div className="max-w-xl mx-auto">

        {/* Logo */}
        <div className="flex justify-center mb-10"><Logo href="/" size="md" /></div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-sport-fg mb-2">{t('title')}</h1>
          <p className="text-sport-gray text-sm">{t('subtitle')}</p>
        </div>

        {/* Upsell « 7 jours Pro offerts » + compteur clignotant, au-dessus du toggle */}
        <div className="mb-6">
          <ProOfferPill {...(PRO_OFFER_TXT[locale] ?? PRO_OFFER_TXT.fr)} />
        </div>

        {/* Billing toggle (mensuel / annuel) */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => setPeriod('monthly')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${period === 'monthly' ? 'bg-sport-orange text-white' : 'text-sport-gray hover:text-sport-fg'}`}
          >
            {t('monthly')}
          </button>
          <button
            type="button"
            onClick={() => setPeriod('annual')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${period === 'annual' ? 'bg-sport-orange text-white' : 'text-sport-gray hover:text-sport-fg'}`}
          >
            {t('annual')}
            <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full">{t('save')}</span>
          </button>
        </div>

        {/* Plan selector */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {PLANS.map((plan, i) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative pt-5 pb-4 px-3 rounded-2xl border text-left transition-all ${
                selectedPlan === plan.id
                  ? 'border-sport-orange bg-sport-orange/10 ring-1 ring-sport-orange/40'
                  : 'border-sport-border bg-sport-card hover:border-sport-gray/60'
              }`}
            >
              {plans[i].badge && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black bg-emerald-500 text-white/90 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {plans[i].badge}
                </span>
              )}
              <p className={`text-sm font-black mb-0.5 ${selectedPlan === plan.id ? 'text-sport-orange' : 'text-sport-fg'}`}>
                {plans[i].name}
              </p>
              <p className="text-sm font-black text-sport-fg leading-none">{period === 'annual' ? plan.priceAnnual : plan.priceMonthly}</p>
              <p className="text-[10px] text-sport-gray mb-1">{plans[i].period}</p>
              {period === 'annual' && plan.totalAnnual && (
                <p className="text-[9px] text-[#1E7F5A] mb-2 leading-tight">
                  {t.rich('billed', { total: plan.totalAnnual, b: (c) => <strong>{c}</strong> })}
                </p>
              )}
              <ul className="space-y-1">
                {plans[i].features.map(f => (
                  <li key={f} className="flex items-center gap-1 text-[9px] text-sport-gray leading-tight">
                    <CheckCircle size={8} className={`shrink-0 ${selectedPlan === plan.id ? 'text-sport-orange' : 'text-[#1E7F5A]'}`} />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {/* Registration form */}
        <div className="bg-sport-card border border-sport-border rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label htmlFor="fullName" className="block text-xs font-bold text-sport-fg mb-2 uppercase tracking-wider">{t('fullNameLabel')}</label>
              <input id="fullName" type="text" required value={form.fullName} onChange={set('fullName')} placeholder={t('fullNamePlaceholder')} className={INPUT} />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-sport-fg mb-2 uppercase tracking-wider">{t('emailLabel')}</label>
              <input id="email" type="email" required value={form.email} onChange={set('email')} placeholder="ton@email.com" className={INPUT} />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-sport-fg mb-2 uppercase tracking-wider">{t('passwordLabel')}</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={form.password}
                  onChange={set('password')}
                  placeholder={t('passwordPlaceholder')}
                  className={`${INPUT} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sport-gray hover:text-sport-fg transition-colors p-1"
                  aria-label={showPwd ? t('hide') : t('show')}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle size={14} className="shrink-0" aria-hidden="true" /> {error}
              </p>
            )}

            {/* Réassurance au point de décision : essai gratuit + aucun débit + résiliation. */}
            {selectedPlan !== 'gratuit' && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-500/25 px-4 py-3">
                <p className="text-xs font-bold text-[#1E7F5A] text-center mb-2">{t('trialReassure')}</p>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] text-sport-gray">
                  <span className="inline-flex items-center gap-1"><Lock size={10} aria-hidden="true" className="text-[#1E7F5A]" /> {tt('securePayment')}</span>
                  <span className="inline-flex items-center gap-1"><ShieldCheck size={10} aria-hidden="true" className="text-[#1E7F5A]" /> {tt('guarantee')}</span>
                  <span className="inline-flex items-center gap-1"><CheckCircle size={10} aria-hidden="true" className="text-[#1E7F5A]" /> {tt('cancel')}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60"
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{t('creating')}</>
                : selectedPlan === 'gratuit'
                  ? <>{t('submitFree')} <ArrowRight size={14} /></>
                  : <>{t('submitPaid')} <ArrowRight size={14} /></>
              }
            </button>

            <p className="text-[10px] text-sport-gray text-center leading-relaxed">
              {t('legalPrefix')}{' '}
              <Link href="/mentions-legales" className="underline hover:text-sport-fg">{t('legalNotice')}</Link>
              {' '}{t('legalAnd')}{' '}
              <Link href="/confidentialite" className="underline hover:text-sport-fg">{t('privacyPolicy')}</Link>.
            </p>
          </form>

          <div className="mt-5 pt-5 border-t border-sport-border text-center">
            <p className="text-xs text-sport-gray">
              {t('haveAccount')}{' '}
              <Link href="/auth/signin" className="text-sport-orange font-bold hover:underline">
                {t('signinLink')}
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-sport-gray">
          <Zap size={12} className="text-sport-orange" />
          {t('secure')}
        </div>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  )
}
