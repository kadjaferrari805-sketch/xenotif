'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Logo } from '@/components/ui/Logo'
import { Link } from '@/i18n/navigation'
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const t = useTranslations('auth.forgot')
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
        <div className="flex justify-center mb-10"><Logo href="/" size="md" /></div>

        <div className="bg-sport-card border border-sport-border rounded-2xl p-8">
          {done ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={28} className="text-[#1E7F5A]" />
              </div>
              <h2 className="text-xl font-black text-sport-fg mb-3">{t('doneTitle')}</h2>
              <p className="text-sport-gray text-sm leading-relaxed mb-6">
                {t.rich('doneText', { email, b: (c) => <strong className="text-sport-fg">{c}</strong> })}<br />
                {t('doneHint')}
              </p>
              <Link href="/auth/signin" className="text-sport-orange text-sm font-bold hover:underline">
                {t('backToSignin')}
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <Link href="/auth/signin" className="inline-flex items-center gap-1.5 text-sport-gray text-xs hover:text-sport-fg transition-colors mb-6">
                  <ArrowLeft size={12} /> {t('back')}
                </Link>
                <h1 className="text-2xl font-black text-sport-fg mb-2">{t('title')}</h1>
                <p className="text-sport-gray text-sm">{t('subtitle')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-sport-fg mb-2 uppercase tracking-wider">{t('emailLabel')}</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ton@email.com"
                    className="input-base"
                  />
                </div>

                {error && (
                  <p role="alert" className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <AlertCircle size={14} className="shrink-0" aria-hidden="true" /> {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-60"
                >
                  {loading ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{t('submitting')}</> : t('submit')}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
