'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { Users, Trophy, Zap, ArrowRight, Star } from 'lucide-react'

// Style structurel par diapositive (image + couleurs d'accent). Les textes
// (tag, headline, accent) viennent de messages → home.hero.slides.
const SLIDE_STYLE = [
  { image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80', accentColor: 'text-sport-lime',   accentGlow: 'shadow-sport-lime/20' },
  { image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1920&q=80', accentColor: 'text-sport-orange', accentGlow: 'shadow-sport-orange/20' },
  { image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1920&q=80', accentColor: 'text-sport-blue',   accentGlow: 'shadow-sport-blue/20' },
]

const BADGE_ICONS = [Users, Trophy, Star, Zap]

const SLIDE_DURATION = 5000

type Slide = { tag: string; headline: string; accent: string }
type Badge = { label: string; sub: string }
type Trust = { label: string; sublabel: string }

export function Hero() {
  const t = useTranslations('home.hero')
  const slides = t.raw('slides') as Slide[]
  const badges = t.raw('badges') as Badge[]
  const trust = t.raw('trust') as Trust[]

  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length)
    setProgress(0)
  }, [slides.length])
  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length)
    setProgress(0)
  }, [slides.length])

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

  // Parallaxe 3D : l'image de fond suit légèrement la souris → profondeur premium.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(mx, { stiffness: 120, damping: 30 })
  const py = useSpring(my, { stiffness: 120, damping: 30 })
  function handleParallax(e: React.MouseEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 28)
    my.set(((e.clientY - r.top) / r.height - 0.5) * 28)
  }

  return (
    <section
      aria-label={t('aria.welcome')}
      className="relative h-screen min-h-[600px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onMouseMove={handleParallax}
    >
      {/* Screen reader announcement */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {slides[current].tag} — {slides[current].headline} {slides[current].accent}
      </div>

      {/* Background slides.
          `initial={false}` : la 1re diapo s'affiche immédiatement (pas de fondu
          opacity 0→1 dépendant de l'hydratation JS) → l'image LCP est peinte dès
          son chargement. Les transitions entre diapos suivantes restent animées. */}
      <motion.div className="absolute -inset-10 z-0" style={{ x: px, y: py }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={SLIDE_STYLE[current].image}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>
      </motion.div>

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
                {t('eyebrow')}
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
                {slides[current].tag}
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
                {slides[current].headline}
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
                className={`text-3xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight ${SLIDE_STYLE[current].accentColor}`}
              >
                {slides[current].accent}
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
                {t('ctaPrimary')} <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link href="/#disciplines" className="btn-secondary">
                {t('ctaSecondary')}
              </Link>
            </motion.div>

            {/* Réassurance essai gratuit (sous les CTA) */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex items-center gap-2 -mt-4 mb-8 text-xs text-white/70"
            >
              <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-sport-lime shrink-0" />
              {t('ctaNote')}
            </motion.p>

            {/* Trust items */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="flex flex-wrap gap-x-5 gap-y-2"
              aria-label={t('aria.guarantees')}
            >
              {trust.map((item) => (
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
        {badges.map((badge, i) => {
          const Icon = BADGE_ICONS[i]
          return (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
              className="flex items-center gap-2.5 bg-black/55 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-white whitespace-nowrap hover:border-white/20 transition-colors group"
            >
              <div className="w-7 h-7 rounded-lg bg-sport-orange/15 flex items-center justify-center group-hover:bg-sport-orange/25 transition-colors">
                <Icon size={13} className="text-sport-orange" />
              </div>
              <div>
                <div className="font-black text-white text-xs">{badge.label}</div>
                <div className="text-[10px] text-white/50 font-normal">{badge.sub}</div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Bottom carousel controls */}
      <div
        role="group"
        aria-label={t('aria.carousel')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4"
        onKeyDown={handleCarouselKey}
      >
        {/* Slide dots with progress */}
        <div className="flex gap-2 items-center" role="tablist" aria-label={t('aria.slides')}>
          {slides.map((_, i) => (
            <button
              key={i}
              role="tab"
              onClick={() => { setCurrent(i); setProgress(0) }}
              aria-label={t('aria.slide', { n: i + 1, total: slides.length })}
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
        <span className="text-[9px] tracking-[3px] uppercase">{t('scroll')}</span>
      </motion.div>
    </section>
  )
}
