'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, Zap } from 'lucide-react'

export function Newsletter() {
  const { ref, inView } = useInView({ triggerOnce: true })

  return (
    <section className="py-24 px-6 bg-sport-dark relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sport-orange/6 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-2xl mx-auto text-center"
      >
        <span className="inline-flex items-center gap-2 border border-sport-orange/30 bg-sport-orange/10 text-sport-orange text-[11px] font-bold tracking-[2px] uppercase px-4 py-2 rounded-full mb-6">
          <Zap size={11} />
          Rejoins la communauté
        </span>

        <h2 className="text-4xl font-black text-white mb-4">
          PRÊT À DÉPASSER
          <br />
          <span className="text-sport-orange">TES LIMITES ?</span>
        </h2>

        <p className="text-sport-gray mb-8 text-sm leading-relaxed">
          Reçois chaque semaine : programmes gratuits, conseils nutrition, tips d&apos;entraînement
          et les WODs de la communauté Xenotif.
        </p>

        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <label htmlFor="newsletter-email" className="sr-only">
            Email
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="ton@email.com"
            aria-label="email"
            className="flex-1 bg-sport-card border border-sport-border text-white placeholder:text-sport-gray rounded-full px-5 py-3 text-sm outline-none focus:border-sport-orange transition-colors"
          />
          <button
            type="submit"
            aria-label="S'abonner"
            className="bg-sport-orange text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-orange-600 transition-colors flex items-center gap-2 justify-center whitespace-nowrap"
          >
            S&apos;abonner <ArrowRight size={14} />
          </button>
        </form>

        <p className="text-[11px] text-sport-gray mt-4">Sans spam. Désabonnement en 1 clic.</p>
      </motion.div>
    </section>
  )
}
