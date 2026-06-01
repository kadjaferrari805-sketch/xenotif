'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ArrowRight, Zap, CheckCircle, Shield, Bell } from 'lucide-react'

const PERK_ICONS = [Bell, Zap, Shield]

export function Newsletter() {
  const t = useTranslations('home.newsletter')
  const perks = t.raw('perks') as string[]
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t('errorInvalid'))
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? t('errorGeneric'))
      } else {
        setSubmitted(true)
      }
    } catch {
      setError(t('errorNetwork'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="newsletter" aria-labelledby="newsletter-title" className="py-24 px-6 bg-sport-dark relative overflow-hidden">
      {/* Background glows */}
      <div aria-hidden="true" className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-sport-orange/6 rounded-full blur-3xl pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-0 right-0 w-96 h-96 bg-sport-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-2xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 border border-sport-orange/30 bg-sport-orange/10 text-sport-orange text-[11px] font-bold tracking-[2px] uppercase px-4 py-2 rounded-full mb-6">
          <Zap size={11} aria-hidden="true" />
          {t('eyebrow')}
        </span>

        <h2 id="newsletter-title" className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
          {t('titleTop')}
          <br />
          <span className="text-sport-orange">{t('titleBottom')}</span>
        </h2>

        <p className="text-sport-gray mb-8 text-sm leading-relaxed max-w-md mx-auto">
          {t.rich('desc', { b: (c) => <strong className="text-white">{c}</strong> })}
        </p>

        {/* Perks list */}
        <ul className="flex flex-col sm:flex-row gap-4 justify-center mb-10" aria-label={t('perksAria')}>
          {PERK_ICONS.map((Icon, i) => (
            <li key={perks[i]} className="flex items-center gap-2 text-xs text-sport-gray">
              <Icon size={13} aria-hidden="true" className="text-sport-orange shrink-0" />
              {perks[i]}
            </li>
          ))}
        </ul>

        {/* Form / Success */}
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-4 py-6"
            >
              <div className="w-16 h-16 rounded-full bg-sport-orange/15 border border-sport-orange/30 flex items-center justify-center">
                <CheckCircle size={32} className="text-sport-orange" aria-hidden="true" />
              </div>
              <div>
                <p className="text-white font-black text-xl mb-1">{t('successTitle')}</p>
                <p className="text-sport-gray text-sm">{t('successText')}</p>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              noValidate
              aria-label={t('formAria')}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <div className="flex-1">
                <label htmlFor="newsletter-email" className="sr-only">
                  {t('emailLabel')}
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (error) setError('') }}
                  placeholder={t('placeholder')}
                  autoComplete="email"
                  aria-required="true"
                  aria-describedby={error ? 'newsletter-error' : undefined}
                  aria-invalid={!!error}
                  className={`w-full bg-sport-card border text-white placeholder:text-sport-gray rounded-full px-5 py-3.5 text-sm outline-none transition-colors ${
                    error ? 'border-red-500' : 'border-sport-border focus:border-sport-orange'
                  }`}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-sport-orange text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-orange-600 active:scale-95 transition-all flex items-center gap-2 justify-center whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? t('sending') : <> {t('submit')} <ArrowRight size={14} aria-hidden="true" /></>}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {error && (
          <motion.p
            id="newsletter-error"
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-xs mt-3"
          >
            {error}
          </motion.p>
        )}

        {!submitted && (
          <p className="text-[11px] text-sport-gray mt-4">
            {t('privacyNote')}
          </p>
        )}
      </div>
    </section>
  )
}
