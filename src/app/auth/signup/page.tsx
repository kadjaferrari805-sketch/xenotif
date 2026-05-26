'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, CheckCircle, Zap, Eye, EyeOff } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { createClient } from '@/lib/supabase/client'

type PlanId = 'gratuit' | 'pro' | 'elite'

const PLANS = [
  {
    id: 'gratuit' as PlanId,
    name: 'Gratuit',
    price: '0 €',
    period: 'pour toujours',
    badge: null,
    features: ['3 programmes', 'Suivi basique', 'Communauté'],
    highlight: false,
  },
  {
    id: 'pro' as PlanId,
    name: 'Pro',
    price: '9,99 €',
    period: '/mois',
    badge: '7j gratuits',
    features: ['Tous les programmes', 'Coaching IA', 'Stats avancées'],
    highlight: true,
  },
  {
    id: 'elite' as PlanId,
    name: 'Élite',
    price: '24,99 €',
    period: '/mois',
    badge: '7j gratuits',
    features: ['Plan Pro inclus', 'Coach dédié', 'Bilan mensuel'],
    highlight: false,
  },
]

const INPUT = 'w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-3 text-white text-sm placeholder:text-sport-gray focus:outline-none focus:border-sport-orange transition-colors'

function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('pro')
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace('/dashboard')
    })
    const plan = searchParams.get('plan') as PlanId
    if (plan && ['gratuit', 'pro', 'elite'].includes(plan)) setSelectedPlan(plan)
    const email = searchParams.get('email')
    if (email) setForm(prev => ({ ...prev, email }))
  }, [searchParams, router])

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password.length < 8) { setError('Le mot de passe doit faire au moins 8 caractères.'); return }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: signUpError } = await supabase.auth.signUp({
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
          ? 'Cet email est déjà utilisé. Connecte-toi.'
          : signUpError.message
      )
      setLoading(false)
      return
    }

    if (selectedPlan !== 'gratuit') {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan, period: 'monthly' }),
      })
      const data = await res.json()
      if (data.url) { window.location.href = data.url; return }
      setError(data.error ?? 'Erreur lors de la redirection vers le paiement.')
      setLoading(false)
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={28} className="text-emerald-400" />
        </div>
        <h2 className="text-xl font-black text-white mb-3">Vérifie ton email !</h2>
        <p className="text-sport-gray text-sm leading-relaxed mb-6">
          Un lien de confirmation a été envoyé à <strong className="text-white">{form.email}</strong>.<br />
          Clique dessus pour activer ton compte.
        </p>
        <Link href="/auth/signin" className="text-sport-orange text-sm font-bold hover:underline">
          Retour à la connexion →
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
          <h1 className="text-3xl font-black text-white mb-2">Crée ton compte</h1>
          <p className="text-sport-gray text-sm">Choisis ton plan, puis complète ton inscription</p>
        </div>

        {/* Plan selector */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {PLANS.map(plan => (
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
              {plan.badge && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                  {plan.badge}
                </span>
              )}
              <p className={`text-sm font-black mb-0.5 ${selectedPlan === plan.id ? 'text-sport-orange' : 'text-white'}`}>
                {plan.name}
              </p>
              <p className="text-sm font-black text-white leading-none">{plan.price}</p>
              <p className="text-[10px] text-sport-gray mb-2.5">{plan.period}</p>
              <ul className="space-y-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-1 text-[9px] text-sport-gray leading-tight">
                    <CheckCircle size={8} className={`shrink-0 ${selectedPlan === plan.id ? 'text-sport-orange' : 'text-emerald-500'}`} />
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
              <label htmlFor="fullName" className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Prénom & Nom</label>
              <input id="fullName" type="text" required value={form.fullName} onChange={set('fullName')} placeholder="Jean Dupont" className={INPUT} />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Email</label>
              <input id="email" type="email" required value={form.email} onChange={set('email')} placeholder="ton@email.com" className={INPUT} />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Mot de passe</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="8 caractères minimum"
                  className={`${INPUT} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sport-gray hover:text-white transition-colors p-1"
                  aria-label={showPwd ? 'Masquer' : 'Afficher'}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sport-orange text-white py-3.5 rounded-full font-bold text-sm hover:bg-orange-600 active:scale-95 transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-sport-orange/25"
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Création du compte…</>
                : selectedPlan === 'gratuit'
                  ? <>Créer mon compte gratuit <ArrowRight size={14} /></>
                  : <>Continuer vers le paiement <ArrowRight size={14} /></>
              }
            </button>

            <p className="text-[10px] text-sport-gray text-center leading-relaxed">
              En créant un compte, tu acceptes nos{' '}
              <Link href="/mentions-legales" className="underline hover:text-white">mentions légales</Link>
              {' '}et notre{' '}
              <Link href="/confidentialite" className="underline hover:text-white">politique de confidentialité</Link>.
            </p>
          </form>

          <div className="mt-5 pt-5 border-t border-sport-border text-center">
            <p className="text-xs text-sport-gray">
              Déjà un compte ?{' '}
              <Link href="/auth/signin" className="text-sport-orange font-bold hover:underline">
                Se connecter →
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-sport-gray">
          <Zap size={12} className="text-sport-orange" />
          Inscription sécurisée SSL · Sans engagement · Annulation libre
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
