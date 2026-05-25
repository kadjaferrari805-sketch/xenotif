'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/reset-password`,
    })
    if (err) { setError(err.message); setLoading(false) }
    else setDone(true)
  }

  return (
    <div className="min-h-screen bg-sport-dark flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-10">
          <span className="w-9 h-9 bg-sport-orange rounded-lg flex items-center justify-center font-black text-white text-sm">X</span>
          <span className="font-black text-white text-xl tracking-wider">XENOTIF®</span>
        </Link>

        <div className="bg-sport-card border border-sport-border rounded-2xl p-8">
          {done ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={28} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-black text-white mb-3">Email envoyé !</h2>
              <p className="text-sport-gray text-sm leading-relaxed mb-6">
                Un lien de réinitialisation a été envoyé à <strong className="text-white">{email}</strong>.<br />
                Vérifie tes spams si tu ne vois rien dans 2 minutes.
              </p>
              <Link href="/auth/signin" className="text-sport-orange text-sm font-bold hover:underline">
                Retour à la connexion →
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <Link href="/auth/signin" className="inline-flex items-center gap-1.5 text-sport-gray text-xs hover:text-white transition-colors mb-6">
                  <ArrowLeft size={12} /> Retour
                </Link>
                <h1 className="text-2xl font-black text-white mb-2">Mot de passe oublié</h1>
                <p className="text-sport-gray text-sm">Entre ton email pour recevoir un lien de réinitialisation.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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

                {error && <p role="alert" className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sport-orange text-white py-3.5 rounded-full font-bold text-sm hover:bg-orange-600 active:scale-95 transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Envoi…</> : 'Envoyer le lien'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
