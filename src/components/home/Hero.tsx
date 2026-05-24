'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Zap, Users, Trophy, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { TRUST_ITEMS } from '@/lib/constants'

const SLIDES = [
  {
    id: 0,
    image:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80',
    tag: '🏋️ Musculation & Force',
    headline: 'FORGE TON CORPS.',
    accent: 'DÉPASSE TES LIMITES.',
    accentColor: 'text-sport-lime',
  },
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1920&q=80',
    tag: '🏃 Running & Cardio',
    headline: 'COURS PLUS VITE.',
    accent: 'BRÛLE PLUS FORT.',
    accentColor: 'text-sport-orange',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1920&q=80',
    tag: '⚡ HIIT & CrossFit',
    headline: 'BRISE TES LIMITES.',
    accent: 'DEVIENS IMBATTABLE.',
    accentColor: 'text-sport-blue',
  },
]

const STATS = [
  { Icon: Users, label: '+12K membres' },
  { Icon: Trophy, label: 'Coaching IA' },
  { Icon: Zap, label: 'HIIT Pro' },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function Hero() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), [])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length), [])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [paused, next])

  return (
    <section
      className="relative h-screen overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
          className="absolute inset-0"
        >
          <Image
            src={SLIDES[current].image}
            alt={SLIDES[current].tag}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25 z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-[1]" />

      {/* Main content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-6">
        <div className="max-w-6xl mx-auto w-full">
          <div className="max-w-2xl">
            {/* Slide tag — changes per slide */}
            <AnimatePresence mode="wait">
              <motion.span
                key={current + 'tag'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="inline-flex items-center gap-2 border border-sport-orange/40 bg-sport-orange/10 text-sport-orange text-[11px] font-bold tracking-[2px] uppercase px-4 py-2 rounded-full mb-6"
              >
                {SLIDES[current].tag}
              </motion.span>
            </AnimatePresence>

            {/* Headline — changes per slide */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={current + 'h1'}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.45, delay: 0.05 }}
                className="text-5xl md:text-7xl font-black text-white leading-[1.0] mb-3 tracking-tight"
              >
                {SLIDES[current].headline}
              </motion.h1>
            </AnimatePresence>

            {/* Accent line — changes per slide */}
            <AnimatePresence mode="wait">
              <motion.p
                key={current + 'accent'}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: 0.12 }}
                className={`text-3xl md:text-4xl font-black mb-8 ${SLIDES[current].accentColor}`}
              >
                {SLIDES[current].accent}
              </motion.p>
            </AnimatePresence>

            {/* CTAs — always visible */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => scrollTo('newsletter')}
                className="px-7 py-3.5 bg-sport-orange text-white rounded-full font-bold text-sm hover:bg-orange-600 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-sport-orange/25"
              >
                Rejoindre maintenant <ArrowRight size={15} />
              </button>
              <button
                onClick={() => scrollTo('programmes')}
                className="px-7 py-3.5 bg-transparent text-white border-2 border-white/30 rounded-full font-bold text-sm hover:border-white hover:bg-white/10 active:scale-95 transition-all"
              >
                Voir les programmes
              </button>
            </div>

            {/* Trust items — always visible */}
            <div className="flex flex-wrap gap-5">
              {TRUST_ITEMS.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-xs text-white/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-sport-orange shrink-0" />
                  <strong className="text-white">{item.label}</strong>
                  <span>{item.sublabel}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side stat badges — always visible */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex-col gap-3 hidden md:flex">
        {STATS.map(({ Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-white whitespace-nowrap"
          >
            <Icon size={14} className="text-sport-orange" />
            {label}
          </div>
        ))}
      </div>

      {/* Slide navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        <button
          onClick={prev}
          aria-label="Slide précédent"
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-all"
        >
          <ChevronLeft size={17} />
        </button>

        <div className="flex gap-2 items-center">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-sport-orange' : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          aria-label="Slide suivant"
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-all"
        >
          <ChevronRight size={17} />
        </button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 right-8 z-20 hidden md:flex flex-col items-center gap-2 text-white/40"
      >
        <div className="w-px h-10 bg-white/20" />
        <span className="text-[9px] tracking-[3px] uppercase">Scroll</span>
      </motion.div>
    </section>
  )
}
