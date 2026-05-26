'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, Eye, EyeOff, CheckCircle, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Suspense } from 'react'

function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailFromCheckout = searchParams.get('email') ?? ''

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState(emailFromCheckout)
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError('Le mot de passe doit faire au moins 8 caractères.'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      setDone(true)
    }
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={28} className="text-emerald-400" />
        </div>
        <h2 className="text-xl font-black text-white mb-3">Vérifie ton email !</h2>
        <p className="text-sport-gray text-sm leading-relaxed mb-6">
          Un lien de confirmation a été envoyé à <strong className="text-white">{email}</strong>.<br />
          Clique dessus pour activer ton compte et accéder à ton espace membre.
        </p>
        <Link href="/auth/signin" className="text-sport-orange text-sm font-bold hover:underline">
          Retour à la connexion →
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-white mb-2">Créer ton compte</h1>
        <p className="text-sport-gray text-sm">Accède à ton espace membre Xenotif®</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Prénom & Nom</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="Jean Dupont"
            className="w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-3 text-white text-sm placeholder:text-sport-gray focus:outline-none focus:border-sport-orange transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="ton@email.com"
            className="w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-3 text-white text-sm placeholder:text-sport-gray focus:outline-none focus:border-sport-orange transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Mot de passe</label>
          <div className="relative">
            <input
              type={showPwd ? 'text' : 'password'}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="8 caractères minimum"
              className="w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-3 pr-12 text-white text-sm placeholder:text-sport-gray focus:outline-none focus:border-sport-orange transition-colors"
            />
            <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sport-gray hover:text-white transition-colors p-1">
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && <p role="alert" className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sport-orange text-white py-3.5 rounded-full font-bold text-sm hover:bg-orange-600 active:scale-95 transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-sport-orange/25"
        >
          {loading ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Création…</> : <>Créer mon compte <ArrowRight size={14} /></>}
        </button>

        <p className="text-[10px] text-sport-gray text-center leading-relaxed">
          En créant un compte, tu acceptes nos{' '}
          <Link href="/mentions-legales" className="underline hover:text-white">mentions légales</Link>
          {' '}et notre{' '}
          <Link href="/confidentialite" className="underline hover:text-white">politique de confidentialité</Link>.
        </p>
      </form>
    </>
  )
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-sport-dark flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-10">
          <span className="w-9 h-9 bg-sport-orange rounded-lg flex items-center justify-center font-black text-white text-sm">X</span>
          <span className="font-black text-white text-xl tracking-wider">XENOTIF®</span>
        </Link>

        <div className="bg-sport-card border border-sport-border rounded-2xl p-8">
          <Suspense fallback={null}><SignUpForm /></Suspense>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-sport-gray">
            Déjà un compte ?{' '}
            <Link href="/auth/signin" className="text-sport-orange font-bold hover:underline">Se connecter →</Link>
          </p>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-sport-gray">
          <Zap size={12} className="text-sport-orange" />
          Connexion sécurisée SSL — Tes données sont protégées
        </div>
      </div>
    </div>
  )
}
