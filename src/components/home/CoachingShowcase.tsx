'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { Bot, Flame, TrendingUp, ArrowRight, Sparkles, Brain } from 'lucide-react'

const AI_MESSAGES = [
  { role: 'user', text: 'Je veux perdre 10 kg et gagner en endurance.', delay: 0 },
  {
    role: 'ai',
    text: 'Parfait ! Basé sur ton profil, je te recommande 4 séances/sem. — 2 HIIT + 2 cardio. Programme 12 semaines généré ✓',
    delay: 0.35,
  },
  {
    role: 'ai',
    text: '🔥 Cette semaine : 2 400 kcal brûlées prévues. Déficit optimal : 420 kcal/j. C\'est parti !',
    delay: 0.75,
  },
]

const FEATURES = [
  {
    Icon: Brain,
    label: 'IA adaptative',
    desc: "S'ajuste chaque semaine selon tes performances réelles",
    color: 'text-sport-orange bg-sport-orange/10 border-sport-orange/20',
  },
  {
    Icon: Flame,
    label: 'Résultats dès 30 jours',
    desc: 'Visibles sur ton corps, confirmés par tes stats',
    color: 'text-sport-lime bg-sport-lime/10 border-sport-lime/20',
  },
  {
    Icon: TrendingUp,
    label: 'Suivi en temps réel',
    desc: 'Tableaux de bord, analytics et rapports hebdo',
    color: 'text-sport-blue bg-sport-blue/10 border-sport-blue/20',
  },
]

export function CoachingShowcase() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section
      aria-labelledby="coaching-title"
      className="py-24 px-6 bg-sport-card border-y border-sport-border relative overflow-hidden"
    >
      <div aria-hidden="true" className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-sport-orange/5 rounded-full blur-[120px] pointer-events-none" />
      <div aria-hidden="true" className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-sport-blue/5 rounded-full blur-[100px] pointer-events-none" />

      <div ref={ref} className="max-w-6xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <span className="inline-flex items-center gap-2 border border-sport-orange/30 bg-sport-orange/10 text-sport-orange text-[11px] font-bold tracking-[2px] uppercase px-4 py-2 rounded-full mb-6">
              <Sparkles size={11} aria-hidden="true" />
              Coaching IA
            </span>

            <h2
              id="coaching-title"
              className="text-4xl md:text-5xl font-black text-white leading-[1.05] mb-6"
            >
              TON COACH PERSO.
              <br />
              <span className="text-sport-orange">24H/24, 7J/7.</span>
            </h2>

            <p className="text-sport-gray text-sm leading-relaxed mb-8 max-w-md">
              Notre IA analyse ton profil, adapte chaque séance à tes performances et génère en temps réel
              le programme idéal pour tes objectifs. Comme un coach personnel — sans le prix.
            </p>

            <div className="flex flex-col gap-4 mb-10">
              {FEATURES.map(({ Icon, label, desc, color }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${color}`}>
                    <Icon size={17} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{label}</p>
                    <p className="text-[11px] text-sport-gray">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/auth/signup"
              className="btn-primary shadow-xl shadow-sport-orange/25 hover:shadow-sport-orange/40 hover:scale-[1.02] active:scale-95"
            >
              Essayer le coaching IA <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <p className="text-[11px] text-sport-gray mt-3">Gratuit 7 jours · Sans carte bancaire</p>
          </motion.div>

          {/* Right: AI chat mockup */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="relative"
          >
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-sport-orange/15 via-transparent to-sport-blue/15 blur-2xl pointer-events-none"
            />

            <div className="relative bg-sport-dark border border-sport-border rounded-3xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-sport-border bg-sport-card">
                <div className="w-9 h-9 rounded-xl bg-sport-orange flex items-center justify-center">
                  <Bot size={17} className="text-white" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-black text-white">Coach IA Xenotif®</p>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1.5">
                    <span
                      aria-hidden="true"
                      className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"
                    />
                    En ligne · Répond en {'<'}1 sec
                  </p>
                </div>
                <div className="ml-auto flex gap-1.5" aria-hidden="true">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                </div>
              </div>

              {/* Messages */}
              <div className="p-5 flex flex-col gap-4">
                {AI_MESSAGES.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5 + msg.delay, duration: 0.4 }}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {msg.role === 'ai' && (
                      <div className="w-7 h-7 rounded-full bg-sport-orange/15 border border-sport-orange/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot size={12} className="text-sport-orange" aria-hidden="true" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 max-w-[80%] text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-sport-orange text-white rounded-tr-sm'
                          : 'bg-sport-card border border-sport-border text-sport-gray rounded-tl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 1.5, duration: 0.4 }}
                  className="flex gap-2.5"
                  aria-hidden="true"
                >
                  <div className="w-7 h-7 rounded-full bg-sport-orange/15 border border-sport-orange/30 flex items-center justify-center shrink-0">
                    <Bot size={12} className="text-sport-orange" />
                  </div>
                  <div className="bg-sport-card border border-sport-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sport-gray animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-sport-gray animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-sport-gray animate-bounce [animation-delay:300ms]" />
                  </div>
                </motion.div>
              </div>

              {/* Stats bar */}
              <div className="border-t border-sport-border px-5 py-4 grid grid-cols-3 gap-4 bg-sport-card/50">
                {[
                  { label: 'Kcal / sem.', value: '2 400', icon: '🔥' },
                  { label: 'Séances', value: '4×', icon: '💪' },
                  { label: 'Durée', value: '12 sem.', icon: '🎯' },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="text-center">
                    <p className="text-base" aria-hidden="true">{icon}</p>
                    <p className="text-sm font-black text-white">{value}</p>
                    <p className="text-[9px] text-sport-gray uppercase tracking-wider">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
