'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Zap, CheckCircle } from 'lucide-react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Adresse email invalide')
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
        setError(data.error ?? 'Une erreur est survenue.')
      } else {
        setSubmitted(true)
      }
    } catch {
      setError('Connexion impossible. Réessaie dans quelques instants.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="newsletter" className="py-24 px-6 bg-sport-dark relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-sport-orange/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sport-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-2xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 border border-sport-orange/30 bg-sport-orange/10 text-sport-orange text-[11px] font-bold tracking-[2px] uppercase px-4 py-2 rounded-full mb-6">
          <Zap size={11} />
          Rejoins la communauté
        </span>

        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
          PRÊT À DÉPASSER
          <br />
          <span className="text-sport-orange">TES LIMITES ?</span>
        </h2>

        <p className="text-sport-gray mb-10 text-sm leading-relaxed max-w-md mx-auto">
          Reçois chaque semaine : programmes gratuits, conseils nutrition, tips
          d&apos;entraînement et les WODs de la communauté Xenotif®.
        </p>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-4 py-6"
            >
              <div className="w-16 h-16 rounded-full bg-sport-orange/15 border border-sport-orange/30 flex items-center justify-center">
                <CheckCircle size={32} className="text-sport-orange" />
              </div>
              <div>
                <p className="text-white font-black text-xl mb-1">Bienvenue dans la communauté !</p>
                <p className="text-sport-gray text-sm">
                  Vérifie ta boîte mail pour confirmer ton inscription.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError('')
                }}
                placeholder="ton@email.com"
                aria-label="email"
                className={`flex-1 bg-sport-card border text-white placeholder:text-sport-gray rounded-full px-5 py-3.5 text-sm outline-none transition-colors ${
                  error ? 'border-red-500' : 'border-sport-border focus:border-sport-orange'
                }`}
              />
              <button
                type="submit"
                aria-label="S'abonner"
                disabled={loading}
                className="bg-sport-orange text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-orange-600 active:scale-95 transition-all flex items-center gap-2 justify-center whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Envoi…' : <> S&apos;abonner <ArrowRight size={14} /></>}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-xs mt-3"
          >
            {error}
          </motion.p>
        )}

        {!submitted && (
          <p className="text-[11px] text-sport-gray mt-4">
            Sans spam · Désabonnement en 1 clic · Données protégées
          </p>
        )}
      </div>
    </section>
  )
}
