'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Logo } from '@/components/ui/Logo'
import { useRouter } from '@/i18n/navigation'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'
import { Input, Label } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Loader } from '@/components/ui/Loader'

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

        <Card className="p-8 hover:-translate-y-0 hover:shadow-sm">
          {done ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={28} className="text-[#1E7F5A]" />
              </div>
              <h2 className="text-xl font-black text-sport-fg mb-3">{t('doneTitle')}</h2>
              <p className="text-sport-gray text-sm">{t('doneText')}</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-black text-sport-fg mb-2">{t('title')}</h1>
                <p className="text-sport-gray text-sm">{t('subtitle')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label className="uppercase tracking-wider">{t('passwordLabel')}</Label>
                  <div className="relative">
                    <Input
                      type={showPwd ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder={t('passwordPlaceholder')}
                      className="pr-12"
                    />
                    <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sport-gray hover:text-sport-fg p-1">
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && <Alert variant="error">{error}</Alert>}

                <Button type="submit" disabled={loading} className="w-full disabled:opacity-60">
                  {loading ? <><Loader size={16} className="text-white" iconClassName="text-white" />{t('submitting')}</> : t('submit')}
                </Button>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
