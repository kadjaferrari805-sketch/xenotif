'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Menu, X, Zap, LayoutDashboard } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { LanguageSwitcher } from './LanguageSwitcher'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const NAV_LINKS = [
  { href: '/#disciplines', key: 'disciplines' },
  { href: '/#programmes', key: 'programmes' },
  { href: '/boutique', key: 'boutique' },
  { href: '/blog', key: 'blog' },
  { href: '/#tarifs', key: 'tarifs' },
  { href: '/#faq', key: 'faq' },
] as const

export function Nav() {
  const t = useTranslations('common.nav')
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
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

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <motion.nav
      aria-label="Navigation principale"
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      // Barre d'en-tête toujours transparente (logo + liens flottent au-dessus
      // de la page), y compris au scroll.
      className="sticky top-0 z-50 transition-all duration-300 bg-transparent border-b border-transparent"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Logo href="/" size="sm" />

        {/* Desktop links */}
        <div className="hidden md:flex gap-7 text-sm font-medium text-sport-gray">
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
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-sport-orange text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-orange-600 transition-all shadow-lg shadow-sport-orange/20 hover:shadow-sport-orange/40 active:scale-95"
            >
              <LayoutDashboard size={13} aria-hidden="true" />
              {t('monEspace')}
            </Link>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="text-sm text-sport-gray hover:text-white transition-colors hidden sm:block"
              >
                {t('connexion')}
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-1.5 bg-sport-orange text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-orange-600 transition-all shadow-lg shadow-sport-orange/20 hover:shadow-sport-orange/40 active:scale-95"
              >
                <Zap size={13} aria-hidden="true" />
                {t('rejoindre')}
              </Link>
            </>
          )}
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
            role="dialog"
            aria-modal="true"
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
