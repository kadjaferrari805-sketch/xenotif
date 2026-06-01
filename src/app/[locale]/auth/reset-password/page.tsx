'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Logo } from '@/components/ui/Logo'
import { useRouter } from '@/i18n/navigation'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const t = useTranslations('auth.reset')
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError(t('errorShort')); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({ password })
    if (err) { setError(err.message); setLoading(false) }
    else { setDone(true); setTimeout(() => router.push('/dashboard'), 2000) }
  }

  return (
    <div className="min-h-screen bg-sport-dark flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-10"><Logo href="/" size="md" /></div>

        <div className="bg-sport-card border border-sport-border rounded-2xl p-8">
          {done ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={28} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-black text-white mb-3">{t('doneTitle')}</h2>
              <p className="text-sport-gray text-sm">{t('doneText')}</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-black text-white mb-2">{t('title')}</h1>
                <p className="text-sport-gray text-sm">{t('subtitle')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">{t('passwordLabel')}</label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder={t('passwordPlaceholder')}
                      className="w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-3 pr-12 text-white text-sm placeholder:text-sport-gray focus:outline-none focus:border-sport-orange transition-colors"
                    />
                    <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sport-gray hover:text-white p-1">
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && <p role="alert" className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sport-orange text-white py-3.5 rounded-full font-bold text-sm hover:bg-orange-600 active:scale-95 transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60"
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
