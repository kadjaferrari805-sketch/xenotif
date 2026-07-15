'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Mail, MessageSquare, CheckCircle, Zap, Clock, MapPin } from 'lucide-react'

export default function ContactPage() {
  const t = useTranslations('contact')
  const subjects = t.raw('subjects') as string[]
  const [form, setForm] = useState({ name: '', email: '', subject: subjects[0], message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (data.ok) {
      setSuccess(true)
    } else {
      setError(data.error ?? t('error'))
    }
    setLoading(false)
  }

  const INPUT = 'w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-3 text-sport-fg text-sm placeholder:text-sport-gray focus:outline-none focus:border-sport-orange transition-colors'

  return (
    <div className="min-h-screen bg-sport-dark">

      {/* Hero */}
      <div className="relative overflow-hidden py-20 px-6 border-b border-sport-border">
        <div className="absolute inset-0 bg-gradient-to-br from-sport-orange/5 via-transparent to-sport-blue/5 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-sport-orange/10 border border-sport-orange/20 text-sport-orange text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <MessageSquare size={12} />
            {t('badge')}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-sport-fg mb-4">
            {t('heroTitle')}
          </h1>
          <p className="text-sport-gray text-lg max-w-xl mx-auto">
            {t('heroSubtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-5 gap-12">

        {/* Info column */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-black text-sport-fg mb-4">{t('infoTitle')}</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-sport-orange/10 border border-sport-orange/20 flex items-center justify-center shrink-0">
                  <Mail size={15} className="text-sport-orange" />
                </div>
                <div>
                  <p className="text-xs font-bold text-sport-fg mb-0.5">{t('emailLabel')}</p>
                  <a href="mailto:contact@xenotif.com" className="text-sm text-sport-gray hover:text-sport-orange transition-colors">
                    contact@xenotif.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-sport-blue/10 border border-sport-blue/20 flex items-center justify-center shrink-0">
                  <Clock size={15} className="text-sport-blue" />
                </div>
                <div>
                  <p className="text-xs font-bold text-sport-fg mb-0.5">{t('responseLabel')}</p>
                  <p className="text-sm text-sport-gray">{t('responseValue')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                  <MapPin size={15} className="text-[#1E7F5A]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-sport-fg mb-0.5">Xenotif®</p>
                  <p className="text-sm text-sport-gray">xenotif.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-sport-card border border-sport-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-sport-orange" />
              <p className="text-xs font-black text-sport-fg uppercase tracking-wider">{t('subscriberTitle')}</p>
            </div>
            <p className="text-xs text-sport-gray mb-4 leading-relaxed">
              {t('subscriberDesc')}
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sport-orange text-xs font-bold hover:underline"
            >
              {t('mySpace')} <ArrowRight size={11} />
            </Link>
          </div>
        </div>

        {/* Form column */}
        <div className="md:col-span-3">
          {success ? (
            <div className="bg-sport-card border border-emerald-200 rounded-2xl p-10 text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={28} className="text-[#1E7F5A]" />
              </div>
              <h2 className="text-xl font-black text-sport-fg mb-2">{t('successTitle')}</h2>
              <p className="text-sport-gray text-sm mb-6">
                {t('successDesc')}
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-sport-orange text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-orange-600 transition-colors"
              >
                {t('backHome')} <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="bg-sport-card border border-sport-border rounded-2xl p-8">
              <h2 className="text-lg font-black text-sport-fg mb-6">{t('formTitle')}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-sport-fg mb-2 uppercase tracking-wider">{t('nameLabel')}</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={set('name')}
                      placeholder={t('namePlaceholder')}
                      className={INPUT}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-sport-fg mb-2 uppercase tracking-wider">{t('emailLabel')}</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={set('email')}
                      placeholder={t('emailPlaceholder')}
                      className={INPUT}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-sport-fg mb-2 uppercase tracking-wider">{t('subjectLabel')}</label>
                  <select
                    value={form.subject}
                    onChange={set('subject')}
                    className={INPUT}
                  >
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-sport-fg mb-2 uppercase tracking-wider">{t('messageLabel')}</label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={set('message')}
                    placeholder={t('messagePlaceholder')}
                    className={`${INPUT} resize-none`}
                  />
                </div>

                {error && (
                  <p role="alert" className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sport-orange text-white py-3.5 rounded-full font-bold text-sm hover:bg-orange-600 active:scale-95 transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-sport-orange/25"
                >
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{t('sending')}</>
                    : <>{t('send')} <ArrowRight size={14} /></>
                  }
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
