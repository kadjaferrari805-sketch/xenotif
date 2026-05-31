'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Users, Trophy, Zap, ArrowRight, Star } from 'lucide-react'
import { TRUST_ITEMS } from '@/lib/constants'

const SLIDES = [
  {
    id: 0,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80',
    tag: '🏋️ Musculation & Force',
    headline: 'FORGE TON CORPS.',
    accent: 'DÉPASSE TES LIMITES.',
    accentColor: 'text-sport-lime',
    accentGlow: 'shadow-sport-lime/20',
  },
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1920&q=80',
    tag: '🏃 Running & Cardio',
    headline: 'COURS PLUS VITE.',
    accent: 'BRÛLE PLUS FORT.',
    accentColor: 'text-sport-orange',
    accentGlow: 'shadow-sport-orange/20',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1920&q=80',
    tag: '⚡ HIIT & CrossFit',
    headline: 'BRISE TES LIMITES.',
    accent: 'DEVIENS IMBATTABLE.',
    accentColor: 'text-sport-blue',
    accentGlow: 'shadow-sport-blue/20',
  },
]

const BADGES = [
  { Icon: Users, label: '+12 000 membres', sub: 'actifs' },
  { Icon: Trophy, label: 'Coaching IA', sub: 'inclus' },
  { Icon: Star, label: '4.9 / 5', sub: '3 200 avis' },
  { Icon: Zap, label: 'Résultats', sub: 'dès 30 jours' },
]

const SLIDE_DURATION = 5000

export function Hero() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length)
    setProgress(0)
  }, [])
  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length)
    setProgress(0)
  }, [])

  useEffect(() => {
    if (paused) return
    setProgress(0)
    const start = performance.now()
    let frame: number

    function tick(now: number) {
      const elapsed = now - start
      const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100)
      setProgress(pct)
      if (elapsed < SLIDE_DURATION) {
        frame = requestAnimationFrame(tick)
      } else {
        next()
      }
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [current, paused, next])

  function handleCarouselKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowLeft') { prev(); e.preventDefault() }
    if (e.key === 'ArrowRight') { next(); e.preventDefault() }
  }

  return (
    <section
      aria-label="Bienvenue sur Xenotif"
      className="relative h-screen min-h-[600px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Screen reader announcement */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {SLIDES[current].tag} — {SLIDES[current].headline} {SLIDES[current].accent}
      </div>

      {/* Background slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={SLIDES[current].image}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays — layered for depth */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/65 to-black/20 z-[1]" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent z-[1]" />
      <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-sport-dark to-transparent z-[1]" />

      {/* Main content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-6">
        <div className="max-w-6xl mx-auto w-full">
          <div className="max-w-xl">

            {/* Brand label */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center mb-5"
            >
              <span className="text-[10px] font-black tracking-[3px] uppercase text-sport-orange">
                La Plateforme Sport Premium
              </span>
            </motion.div>

            {/* Slide tag */}
            <AnimatePresence mode="wait">
              <motion.span
                key={current + 'tag'}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center gap-2 border border-white/15 bg-white/8 backdrop-blur-sm text-white/80 text-[11px] font-semibold tracking-wide px-3.5 py-1.5 rounded-full mb-5"
              >
                {SLIDES[current].tag}
              </motion.span>
            </AnimatePresence>

            {/* Headline */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={current + 'h1'}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] mb-2 tracking-tight"
              >
                {SLIDES[current].headline}
              </motion.h1>
            </AnimatePresence>

            {/* Accent line */}
            <AnimatePresence mode="wait">
              <motion.p
                key={current + 'accent'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className={`text-3xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight ${SLIDES[current].accentColor}`}
              >
                {SLIDES[current].accent}
              </motion.p>
            </AnimatePresence>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <Link
                href="/auth/signup"
                className="btn-primary shadow-xl shadow-sport-orange/30 hover:shadow-sport-orange/50 hover:scale-[1.02] active:scale-95"
              >
                Rejoindre gratuitement <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link href="/#disciplines" className="btn-secondary">
                Voir les disciplines
              </Link>
            </motion.div>

            {/* Trust items */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="flex flex-wrap gap-x-5 gap-y-2"
              aria-label="Nos garanties"
            >
              {TRUST_ITEMS.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-xs text-white/65">
                  <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-sport-orange shrink-0" />
                  <strong className="text-white/90">{item.label}</strong>
                  <span>{item.sublabel}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right stat badges */}
      <div
        aria-hidden="true"
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex-col gap-2.5 hidden lg:flex"
      >
        {BADGES.map(({ Icon, label, sub }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
            className="flex items-center gap-2.5 bg-black/55 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-white whitespace-nowrap hover:border-white/20 transition-colors group"
          >
            <div className="w-7 h-7 rounded-lg bg-sport-orange/15 flex items-center justify-center group-hover:bg-sport-orange/25 transition-colors">
              <Icon size={13} className="text-sport-orange" />
            </div>
            <div>
              <div className="font-black text-white text-xs">{label}</div>
              <div className="text-[10px] text-white/50 font-normal">{sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom carousel controls */}
      <div
        role="group"
        aria-label="Navigation du carrousel"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4"
        onKeyDown={handleCarouselKey}
      >
        {/* Slide dots with progress */}
        <div className="flex gap-2 items-center" role="tablist" aria-label="Diapositives">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              role="tab"
              onClick={() => { setCurrent(i); setProgress(0) }}
              aria-label={`Diapositive ${i + 1} sur ${SLIDES.length}`}
              aria-selected={i === current}
              className={`h-1.5 rounded-full transition-all duration-300 overflow-hidden ${
                i === current ? 'w-10 bg-white/20' : 'w-2 bg-white/25 hover:bg-white/45'
              }`}
            >
              {i === current && (
                <div
                  className="h-full bg-sport-orange rounded-full"
                  style={{ width: `${progress}%`, transition: 'none' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
        className="absolute bottom-9 right-8 z-20 hidden md:flex flex-col items-center gap-2 text-white/35"
      >
        <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/30" />
        <span className="text-[9px] tracking-[3px] uppercase">Scroll</span>
      </motion.div>
    </section>
  )
}
