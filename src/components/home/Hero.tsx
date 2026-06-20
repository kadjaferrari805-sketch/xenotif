'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { Users, Trophy, Zap, ArrowRight, Star } from 'lucide-react'

// Couleur d'accent par diapositive. Le fond est désormais une vidéo cinématique
// constante ; seuls les textes (tag, headline, accent) tournent → home.hero.slides.
const SLIDE_STYLE = [
  { accentColor: 'text-sport-lime' },
  { accentColor: 'text-sport-orange' },
  { accentColor: 'text-sport-blue' },
]

const BADGE_ICONS = [Users, Trophy, Star, Zap]

const SLIDE_DURATION = 5000

// Titre du Hero : cascade mot par mot (entrée cinématique premium).
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]
const HEADLINE_CONTAINER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}
const HEADLINE_WORD = {
  hidden: { opacity: 0, y: '0.6em' },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

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

  // Vidéo de fond : poster optimisé peint immédiatement (LCP), la vidéo se fond
  // par-dessus une fois lue. Respecte prefers-reduced-motion (poster figé).
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    try {
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return
      const p = v.play()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    } catch {
      /* autoplay bloqué / jsdom → le poster reste affiché */
    }
  }, [])

  // Fonctions simples : le React Compiler les mémoïse automatiquement.
  const next = () => {
    setCurrent((c) => (c + 1) % slides.length)
    setProgress(0)
  }
  const prev = () => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length)
    setProgress(0)
  }

  useEffect(() => {
    if (paused) return
    const start = performance.now()
    let frame: number

    function tick(now: number) {
      const elapsed = now - start
      const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100)
      setProgress(pct)
      if (elapsed < SLIDE_DURATION) {
        frame = requestAnimationFrame(tick)
      } else {
        // Avance automatique en ligne → évite une dépendance fonction dans l'effet.
        setCurrent((c) => (c + 1) % slides.length)
        setProgress(0)
      }
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [current, paused, slides.length])

  function handleCarouselKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowLeft') { prev(); e.preventDefault() }
    if (e.key === 'ArrowRight') { next(); e.preventDefault() }
  }

  // Parallaxe 3D : l'image de fond suit légèrement la souris → profondeur premium.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(mx, { stiffness: 120, damping: 30 })
  const py = useSpring(my, { stiffness: 120, damping: 30 })
  // Parallaxe au scroll : le fond se décale un peu plus lentement que le contenu
  // → profondeur cinématique. 100 % GPU (transform), désactivée en reduced-motion.
  const reduce = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const scrollParallax = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90])
  const bgY = useTransform([py, scrollParallax], (v: number[]) => (v[0] ?? 0) + (v[1] ?? 0))
  function handleParallax(e: React.MouseEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 28)
    my.set(((e.clientY - r.top) / r.height - 0.5) * 28)
  }

  return (
    <section
      ref={heroRef}
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

      {/* Fond vidéo cinématique (boucle muette) avec parallaxe légère.
          Le poster optimisé est peint immédiatement (LCP) ; la vidéo se fond
          par-dessus dès qu'elle joue. Si l'autoplay est bloqué ou que
          prefers-reduced-motion est actif, le poster reste affiché. */}
      <motion.div className="absolute -inset-10 z-0" style={{ x: px, y: bgY }}>
        <Image
          src="/video/hero-poster.jpg"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          // Mobile : focal un peu plus haut (sujet visible) ; desktop : centré.
          className="object-cover object-[center_40%] md:object-center"
          priority
        />
        <video
          ref={videoRef}
          poster="/video/hero-poster.jpg"
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onPlaying={() => setVideoReady(true)}
          className={`absolute inset-0 h-full w-full object-cover object-[center_40%] md:object-center transition-opacity duration-700 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Dégradés — assombrissement réduit pour laisser voir l'image, renforcé
          uniquement à gauche/bas (zone du texte). */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent z-[1]" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-[1]" />
      <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-sport-dark to-transparent z-[1]" />

      {/* Main content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-6">
        <div className="max-w-6xl mx-auto w-full">
          {/* Ombre de texte : lisibilité préservée malgré l'image plus claire. */}
          <div className="max-w-xl [text-shadow:0_1px_12px_rgba(0,0,0,0.55)]">

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
                data-no-reveal
                variants={HEADLINE_CONTAINER}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -16, transition: { duration: 0.3 } }}
                className="text-3d text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] mb-2 tracking-tight break-words"
              >
                {slides[current].headline.split(' ').map((word, i) => (
                  <motion.span key={i} variants={HEADLINE_WORD} className="inline-block mr-[0.22em] last:mr-0">
                    {word}
                  </motion.span>
                ))}
              </motion.h1>
            </AnimatePresence>

            {/* Accent line */}
            <AnimatePresence mode="wait">
              <motion.p
                key={current + 'accent'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className={`text-3d text-3xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight break-words ${SLIDE_STYLE[current].accentColor}`}
              >
                {slides[current].accent}
              </motion.p>
            </AnimatePresence>

            {/* Preuve sociale (note + nombre d'athlètes) — au-dessus des CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex items-center gap-2.5 mb-5"
            >
              <span className="flex gap-0.5" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={15} className="text-sport-orange" fill="currentColor" />
                ))}
              </span>
              <span className="text-xs text-white/80">
                {t.rich('socialProof', { b: (c) => <strong className="font-bold text-white">{c}</strong> })}
              </span>
            </motion.div>

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
            // Bouton avec zone tactile ≥24px (px-2 py-3) ; la barre visuelle reste
            // fine via un <span> interne (accessibilité : taille des cibles tactiles).
            <button
              key={i}
              role="tab"
              onClick={() => { setCurrent(i); setProgress(0) }}
              aria-label={t('aria.slide', { n: i + 1, total: slides.length })}
              aria-selected={i === current}
              className="group flex items-center px-2 py-3"
            >
              <span
                className={`block h-1.5 rounded-full overflow-hidden transition-all duration-300 ${
                  i === current ? 'w-10 bg-white/20' : 'w-2 bg-white/25 group-hover:bg-white/45'
                }`}
              >
                {i === current && (
                  <span
                    className="block h-full bg-sport-orange rounded-full"
                    style={{ width: `${progress}%`, transition: 'none' }}
                  />
                )}
              </span>
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
