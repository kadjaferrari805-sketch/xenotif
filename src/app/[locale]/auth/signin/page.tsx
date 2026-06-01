'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Logo } from '@/components/ui/Logo'
import { Link, useRouter } from '@/i18n/navigation'
import { ArrowRight, Eye, EyeOff, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SignInPage() {
  const t = useTranslations('auth.signin')
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError(t('errorInvalid'))
      setLoading(false)
    } else {
      router.replace('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-sport-dark flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Logo href="/" size="md" />
        </div>

        <div className="bg-sport-card border border-sport-border rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-white mb-2">{t('title')}</h1>
            <p className="text-sport-gray text-sm">{t('subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">{t('emailLabel')}</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ton@email.com"
                className="w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-3 text-white text-sm placeholder:text-sport-gray focus:outline-none focus:border-sport-orange transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">{t('passwordLabel')}</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-3 pr-12 text-white text-sm placeholder:text-sport-gray focus:outline-none focus:border-sport-orange transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sport-gray hover:text-white transition-colors p-1"
                  aria-label={showPwd ? t('hide') : t('show')}
                >
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
              {loading ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{t('submitting')}</> : <>{t('submit')} <ArrowRight size={14} /></>}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link href="/auth/forgot-password" className="text-xs text-sport-gray hover:text-sport-orange transition-colors">
              {t('forgot')}
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-sport-border text-center">
            <p className="text-xs text-sport-gray">
              {t('noAccount')}{' '}
              <Link href="/auth/signup" className="text-sport-orange font-bold hover:underline">
                {t('createAccount')}
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
