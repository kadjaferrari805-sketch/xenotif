'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Menu, X, ChevronDown, ArrowRight, Dumbbell, ClipboardList, Trophy, Calculator } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { LanguageSwitcher } from './LanguageSwitcher'
import { AppDownload } from './AppDownload'
import { createClient } from '@/lib/supabase/client'
import { DISCIPLINE_SLUGS as DISCIPLINES } from '@/lib/disciplines-nav'
import type { User } from '@supabase/supabase-js'

// Méga-menu « Entraînement » façon Strava : colonne Disciplines (par sport,
// DISCIPLINE_SLUGS partagé avec /disciplines) + colonne Ressources.
const RESOURCES = [
  { href: '/programmes', key: 'programmes', Icon: ClipboardList },
  { href: '/exercices', key: 'exercices', Icon: Dumbbell },
  { href: '/defis', key: 'defis', Icon: Trophy },
  { href: '/outils', key: 'calculateurs', Icon: Calculator },
] as const

const NAV_LINKS = [
  { href: '/boutique', key: 'boutique' },
  { href: '/blog', key: 'blog' },
  { href: '/#tarifs', key: 'tarifs' },
  { href: '/contact', key: 'contact' },
] as const

export function Nav() {
  const t = useTranslations('common.nav')
  const [isOpen, setIsOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileTrainOpen, setMobileTrainOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState<string | null>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

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
        if (menuOpen) setMenuOpen(false)
        if (isOpen) { setIsOpen(false); hamburgerRef.current?.focus() }
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, menuOpen])

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [menuOpen])

  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const initials = (name || user?.email || 'U').slice(0, 2).toUpperCase()

  return (
    <motion.nav
      aria-label="Navigation principale"
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-50 transition-all duration-300 pt-safe border-b ${
        scrolled ? 'bg-sport-dark/85 backdrop-blur-xl border-sport-fg/10 shadow-md shadow-black/10' : 'bg-sport-dark border-sport-fg/10'
      }`}
    >
      <div className={`max-w-6xl mx-auto px-6 flex items-center justify-between gap-4 transition-all duration-300 ${scrolled ? 'h-14' : 'h-16'}`}>
        <div className="shrink-0">
          <Logo href="/" size="sm" animated />
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-7 text-sm font-medium text-sport-gray whitespace-nowrap">
          {/* Méga-menu Entraînement (Disciplines + Ressources) */}
          <div ref={menuRef} className="relative" onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex items-center gap-1 hover:text-sport-fg transition-colors py-1"
            >
              {t('training')}
              <ChevronDown size={14} aria-hidden="true" className={`transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  role="menu"
                  aria-label={t('training')}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[680px] max-w-[calc(100vw-2rem)] bg-sport-dark/95 backdrop-blur-xl border border-sport-fg/10 rounded-2xl shadow-2xl shadow-black/15 p-5"
                >
                  <div className="grid grid-cols-3 gap-5">
                    <div className="col-span-2">
                      <p className="text-[10px] font-black uppercase tracking-wider text-sport-gray mb-3 px-2">{t('disciplines')}</p>
                      <div className="grid grid-cols-2 gap-1">
                        {DISCIPLINES.map((d) => (
                          <Link
                            key={d.slug}
                            href={`/disciplines/${d.slug}`}
                            role="menuitem"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-sport-fg/5 transition-colors group/disc"
                          >
                            <span className="text-sm font-medium text-sport-gray group-hover/disc:text-sport-fg transition-colors">{t(`disc.${d.slug}`)}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="border-l border-sport-fg/10 pl-5">
                      <p className="text-[10px] font-black uppercase tracking-wider text-sport-gray mb-3 px-2">{t('resources')}</p>
                      <div className="flex flex-col gap-1">
                        {RESOURCES.map(({ href, key, Icon }) => (
                          <Link
                            key={href}
                            href={href}
                            role="menuitem"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-sport-fg/5 transition-colors group/res"
                          >
                            <Icon size={16} aria-hidden="true" className="text-sport-orange shrink-0" />
                            <span className="text-sm font-medium text-sport-gray group-hover/res:text-sport-fg transition-colors">{t(key)}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/disciplines"
                    onClick={() => setMenuOpen(false)}
                    className="mt-3 flex items-center justify-center gap-1.5 rounded-xl border border-sport-fg/10 py-2.5 text-xs font-bold text-sport-orange hover:bg-sport-orange/10 transition-colors"
                  >
                    {t('allDisciplines')} <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-sport-fg transition-colors relative group py-1">
              {t(link.key)}
              <span className="absolute bottom-0 left-0 w-0 h-px bg-sport-orange transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="flex items-center justify-end gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
          </div>
          {user ? (
            <Link href="/dashboard" aria-label={t('monEspace')} className="inline-flex items-center justify-center rounded-full border border-sport-border bg-sport-card/70 p-1 hover:border-sport-orange/50 transition-all active:scale-95">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sport-orange/20 border border-sport-orange/40 text-sport-orange font-black text-xs">{initials}</span>
            </Link>
          ) : (
            <>
              <Link href="/auth/signin" className="hidden sm:inline text-sm text-sport-gray hover:text-sport-fg transition-colors">{t('connexion')}</Link>
              <Link href="/auth/signup" className="btn-primary px-5 py-2 text-xs">{t('rejoindre')}</Link>
            </>
          )}
          <AppDownload
            triggerClassName="hidden md:inline-flex items-center justify-center h-9 w-9 rounded-full border border-sport-border text-sport-fg/90 hover:text-sport-fg hover:border-sport-fg/30 transition-all"
            labelClassName="hidden"
            iconSize={16}
          />
          <button
            ref={hamburgerRef}
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? t('fermerMenu') : t('ouvrirMenu')}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="md:hidden text-sport-fg p-1"
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
            className="md:hidden bg-sport-dark/80 backdrop-blur-xl border-t border-sport-fg/10 overflow-hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-1">
              {/* Entraînement (accordéon) */}
              <button
                type="button"
                onClick={() => setMobileTrainOpen((v) => !v)}
                aria-expanded={mobileTrainOpen}
                className="flex items-center justify-between text-sm font-medium text-sport-gray hover:text-sport-fg transition-colors py-3 border-b border-sport-border"
              >
                {t('training')}
                <ChevronDown size={16} aria-hidden="true" className={`transition-transform duration-200 ${mobileTrainOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {mobileTrainOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-b border-sport-border pb-2"
                  >
                    <div className="flex flex-col gap-1 py-2">
                      {RESOURCES.map(({ href, key, Icon }) => (
                        <Link key={href} href={href} onClick={() => setIsOpen(false)} className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm font-medium text-sport-fg hover:bg-sport-fg/5 transition-colors">
                          <Icon size={15} aria-hidden="true" className="text-sport-orange" /> {t(key)}
                        </Link>
                      ))}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-sport-gray px-2 pt-2 pb-1">{t('disciplines')}</p>
                    <div className="grid grid-cols-2 gap-1">
                      {DISCIPLINES.map((d) => (
                        <Link key={d.slug} href={`/disciplines/${d.slug}`} onClick={() => setIsOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-sport-gray hover:text-sport-fg hover:bg-sport-fg/5 transition-colors">
                          {t(`disc.${d.slug}`)}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="text-sm font-medium text-sport-gray hover:text-sport-fg transition-colors py-3 border-b border-sport-border last:border-0">
                  {t(link.key)}
                </Link>
              ))}
              {!user && (
                <>
                  <Link href="/auth/signin" onClick={() => setIsOpen(false)} className="text-sm font-medium text-sport-gray hover:text-sport-fg transition-colors py-3">
                    {t('connexion')}
                  </Link>
                  <Link href="/auth/signup" onClick={() => setIsOpen(false)} className="btn-primary w-full mt-1">
                    {t('rejoindre')}
                  </Link>
                </>
              )}
              <div className="pt-4 mt-2 border-t border-sport-border flex items-center justify-center gap-3">
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
