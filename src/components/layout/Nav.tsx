'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { LanguageSwitcher } from './LanguageSwitcher'
import { AppDownload } from './AppDownload'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const NAV_LINKS = [
  { href: '/#disciplines', key: 'disciplines' },
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
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState<string | null>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

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
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        hamburgerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen])

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
      // Barre d'en-tête : solide en haut, frosted (blur + transparence + ombre)
      // une fois scrollée → profondeur premium.
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
        <div className="hidden md:flex flex-1 justify-center gap-7 text-sm font-medium text-sport-gray whitespace-nowrap">
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
          {/* Télécharger l'app (desktop, après « Rejoindre ») : bouton compact icône
              pour garder la barre aérée et bien centrée. Le libellé est dans l'aria + la modale. */}
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
