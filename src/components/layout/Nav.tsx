'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { LanguageSwitcher } from './LanguageSwitcher'
import { AppDownload } from './AppDownload'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

// Méga-menu « Disciplines » façon Strava : icône + slug ; libellés localisés via
// common.nav.disc.<slug>. Les slugs correspondent aux routes /disciplines/[slug].
const DISCIPLINES = [
  { slug: 'musculation', emoji: '🏋️' },
  { slug: 'running-cardio', emoji: '🏃' },
  { slug: 'hiit', emoji: '⚡' },
  { slug: 'crossfit', emoji: '🤸' },
  { slug: 'boxing', emoji: '🥊' },
  { slug: 'natation', emoji: '🏊' },
  { slug: 'cyclisme', emoji: '🚴' },
  { slug: 'yoga', emoji: '🧘' },
  { slug: 'stretching', emoji: '🙆' },
  { slug: 'nutrition', emoji: '🥗' },
] as const

const NAV_LINKS = [
  { href: '/programmes', key: 'programmes' },
  { href: '/defis', key: 'defis' },
  { href: '/boutique', key: 'boutique' },
  { href: '/blog', key: 'blog' },
  { href: '/a-propos', key: 'about' },
  { href: '/#tarifs', key: 'tarifs' },
  { href: '/#faq', key: 'faq' },
] as const

export function Nav() {
  const t = useTranslations('common.nav')
  const [isOpen, setIsOpen] = useState(false)
  const [discOpen, setDiscOpen] = useState(false)
  const [mobileDiscOpen, setMobileDiscOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState<string | null>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const discRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)
      if (data.user) {
        const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', data.user.id).maybeSingle()
        setName(profile?.full_name ?? null)
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) setName(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (discOpen) setDiscOpen(false)
        if (isOpen) {
          setIsOpen(false)
          hamburgerRef.current?.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, discOpen])

  // Ferme le méga-menu au clic extérieur.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (discOpen && discRef.current && !discRef.current.contains(e.target as Node)) setDiscOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [discOpen])

  // Nav premium : frosted (blur + transparence) + compactage une fois scrollé.
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Profil de l'abonné (remplace « Mon espace »).
  const initials = (name || user?.email || 'U').slice(0, 2).toUpperCase()

  return (
    <motion.nav
      aria-label="Navigation principale"
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-50 transition-all duration-300 pt-safe border-b ${
        scrolled
          ? 'bg-sport-dark/80 backdrop-blur-xl border-white/10 shadow-lg shadow-black/30'
          : 'bg-sport-dark border-white/10'
      }`}
    >
      {/* Logo (gauche) · liens centrés dans l'espace dispo (flex-1) · actions (droite) */}
      <div className={`max-w-6xl mx-auto px-6 flex items-center justify-between gap-4 transition-all duration-300 ${scrolled ? 'h-14' : 'h-16'}`}>
        {/* Logo */}
        <div className="shrink-0">
          <Logo href="/" size="sm" animated />
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-7 text-sm font-medium text-sport-gray whitespace-nowrap">
          {/* Méga-menu Disciplines (hover + clic) */}
          <div
            ref={discRef}
            className="relative"
            onMouseEnter={() => setDiscOpen(true)}
            onMouseLeave={() => setDiscOpen(false)}
          >
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={discOpen}
              onClick={() => setDiscOpen((v) => !v)}
              className="inline-flex items-center gap-1 hover:text-white transition-colors py-1"
            >
              {t('disciplines')}
              <ChevronDown size={14} aria-hidden="true" className={`transition-transform duration-200 ${discOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {discOpen && (
                <motion.div
                  role="menu"
                  aria-label={t('disciplines')}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[520px] max-w-[calc(100vw-2rem)] bg-sport-dark/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-4"
                >
                  <div className="grid grid-cols-2 gap-1">
                    {DISCIPLINES.map((d) => (
                      <Link
                        key={d.slug}
                        href={`/disciplines/${d.slug}`}
                        role="menuitem"
                        onClick={() => setDiscOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/5 transition-colors group/disc"
                      >
                        <span className="text-lg w-6 text-center" aria-hidden="true">{d.emoji}</span>
                        <span className="text-sm font-medium text-sport-gray group-hover/disc:text-white transition-colors">{t(`disc.${d.slug}`)}</span>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/#disciplines"
                    onClick={() => setDiscOpen(false)}
                    className="mt-2 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 py-2.5 text-xs font-bold text-sport-orange hover:bg-sport-orange/10 transition-colors"
                  >
                    {t('allDisciplines')} <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors relative group py-1"
            >
              {t(link.key)}
              <span className="absolute bottom-0 left-0 w-0 h-px bg-sport-orange transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="flex items-center justify-end gap-3 shrink-0">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          {user ? (
            <Link
              href="/dashboard"
              aria-label={t('monEspace')}
              className="inline-flex items-center justify-center rounded-full border border-sport-border bg-sport-card/70 p-1 hover:border-sport-orange/50 transition-all active:scale-95"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sport-orange/20 border border-sport-orange/40 text-sport-orange font-black text-xs">
                {initials}
              </span>
            </Link>
          ) : (
            <Link
              href="/auth/signin"
              className="text-sm text-sport-gray hover:text-white transition-colors"
            >
              {t('connexion')}
            </Link>
          )}
          {/* Télécharger l'app (desktop) : bouton compact icône pour garder la barre aérée. */}
          <AppDownload
            triggerClassName="hidden md:inline-flex items-center justify-center h-9 w-9 rounded-full border border-sport-border text-white/90 hover:text-white hover:border-white/30 transition-all"
            labelClassName="hidden"
            iconSize={16}
          />
          <button
            ref={hamburgerRef}
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? t('fermerMenu') : t('ouvrirMenu')}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="md:hidden text-white p-1"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            aria-label="Menu de navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-sport-dark/80 backdrop-blur-xl border-t border-white/10 overflow-hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-1">
              {/* Disciplines (accordéon) */}
              <button
                type="button"
                onClick={() => setMobileDiscOpen((v) => !v)}
                aria-expanded={mobileDiscOpen}
                className="flex items-center justify-between text-sm font-medium text-sport-gray hover:text-white transition-colors py-3 border-b border-sport-border"
              >
                {t('disciplines')}
                <ChevronDown size={16} aria-hidden="true" className={`transition-transform duration-200 ${mobileDiscOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {mobileDiscOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-b border-sport-border"
                  >
                    <div className="grid grid-cols-2 gap-1 py-2">
                      {DISCIPLINES.map((d) => (
                        <Link
                          key={d.slug}
                          href={`/disciplines/${d.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-sport-gray hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <span aria-hidden="true">{d.emoji}</span> {t(`disc.${d.slug}`)}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-sport-gray hover:text-white transition-colors py-3 border-b border-sport-border last:border-0"
                >
                  {t(link.key)}
                </Link>
              ))}
              {!user && (
                <Link
                  href="/auth/signin"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-sport-gray hover:text-white transition-colors py-3"
                >
                  {t('connexion')}
                </Link>
              )}
              <div className="pt-4 mt-2 border-t border-sport-border">
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
