'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, Zap, CheckCircle, Shield, Bell, Flame } from 'lucide-react'

const PERKS = [
  { Icon: Bell, text: 'Programmes gratuits chaque semaine' },
  { Icon: Zap, text: 'WODs & défis communautaires' },
  { Icon: Shield, text: 'Conseils nutrition & récupération' },
  { Icon: Flame, text: 'Tips d\'entraînement exclusifs' },
]

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

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
    <section
      id="newsletter"
      aria-labelledby="newsletter-title"
      className="relative overflow-hidden"
      ref={ref}
    >
      {/* Full-bleed gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sport-orange via-[#cc3600] to-[#8B1A00]" />
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      {/* Top diagonal clip */}
      <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-16 bg-sport-dark" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 0)' }} />
      {/* Bottom diagonal clip */}
      <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-16 bg-sport-dark" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0 100%)' }} />

      <div className="relative py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left: copy */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            >
              <span className="inline-flex items-center gap-2 bg-white/20 text-white text-[11px] font-bold tracking-[2px] uppercase px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
                <Zap size={11} aria-hidden="true" />
                Rejoins la communauté
              </span>

              <h2
                id="newsletter-title"
                className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.0] mb-6"
              >
                PRÊT À
                <br />
                DÉPASSER
                <br />
                <span className="text-white/75">TES LIMITES ?</span>
              </h2>

              <p className="text-white/80 mb-8 text-sm leading-relaxed max-w-sm">
                Rejoins <strong className="text-white">12 000+ athlètes</strong> qui reçoivent chaque semaine
                des programmes exclusifs, des défis communautaires et des conseils d&apos;experts.
              </p>

              <ul className="flex flex-col gap-3" aria-label="Avantages de l'inscription">
                {PERKS.map(({ Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm text-white/80">
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                      <Icon size={13} aria-hidden="true" className="text-white" />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right: form */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      role="status"
                      aria-live="polite"
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center gap-4 py-8 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
                        <CheckCircle size={32} className="text-white" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-white font-black text-xl mb-1">Bienvenue dans la communauté !</p>
                        <p className="text-white/70 text-sm">Vérifie ta boîte mail — un email de confirmation t&apos;a été envoyé.</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h3 className="text-white font-black text-xl mb-2">Inscription gratuite</h3>
                      <p className="text-white/60 text-xs mb-6">Sans spam · RGPD · Désabonnement en 1 clic</p>

                      <form
                        onSubmit={handleSubmit}
                        noValidate
                        aria-label="Formulaire d'inscription à la newsletter"
                        className="flex flex-col gap-3"
                      >
                        <label htmlFor="newsletter-email" className="sr-only">Adresse email</label>
                        <input
                          id="newsletter-email"
                          type="email"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); if (error) setError('') }}
                          placeholder="ton@email.com"
                          autoComplete="email"
                          aria-required="true"
                          aria-describedby={error ? 'newsletter-error' : undefined}
                          aria-invalid={!!error}
                          className={`w-full bg-white/15 border text-white placeholder:text-white/40 rounded-xl px-5 py-3.5 text-sm outline-none transition-colors backdrop-blur-sm ${
                            error ? 'border-red-300' : 'border-white/30 focus:border-white/70'
                          }`}
                        />
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-white text-[#FF4500] px-6 py-3.5 rounded-xl font-black text-sm hover:bg-white/90 active:scale-95 transition-all flex items-center gap-2 justify-center whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                        >
                          {loading ? 'Envoi…' : <> S&apos;abonner gratuitement <ArrowRight size={14} aria-hidden="true" /></>}
                        </button>
                      </form>

                      {error && (
                        <motion.p
                          id="newsletter-error"
                          role="alert"
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-200 text-xs mt-3"
                        >
                          {error}
                        </motion.p>
                      )}

                      {/* Mini social proof */}
                      <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/20">
                        <div className="flex -space-x-2">
                          {['M', 'S', 'A', 'L'].map((initial, i) => (
                            <div
                              key={i}
                              aria-hidden="true"
                              className="w-7 h-7 rounded-full bg-white/30 border-2 border-white/20 flex items-center justify-center text-[10px] font-black text-white"
                            >
                              {initial}
                            </div>
                          ))}
                        </div>
                        <p className="text-white/70 text-[11px]">
                          <strong className="text-white">+2 400</strong> inscrits ce mois
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
