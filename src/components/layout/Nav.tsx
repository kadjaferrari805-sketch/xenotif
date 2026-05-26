'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Menu, X, Zap, LayoutDashboard } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const NAV_LINKS = [
  { href: '/#disciplines', label: 'Disciplines' },
  { href: '/#programmes', label: 'Programmes' },
  { href: '/#tarifs', label: 'Tarifs' },
  { href: '/#faq', label: 'FAQ' },
]

export function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 40) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-sport-dark/90 backdrop-blur-xl border-b border-sport-border shadow-xl shadow-black/30'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Xenotif — Retour à l'accueil"
          className="flex items-center gap-2.5 font-black text-lg text-white tracking-wider shrink-0 group"
        >
          <span
            aria-hidden="true"
            className="w-8 h-8 bg-sport-orange rounded-lg flex items-center justify-center font-black text-base shadow-lg shadow-sport-orange/30 group-hover:shadow-sport-orange/50 transition-shadow"
          >
            X
          </span>
          <span className="hidden sm:block">XENOTIF®</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-7 text-sm font-medium text-sport-gray">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors relative group py-1"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-px bg-sport-orange transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-sport-orange text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-orange-600 transition-all shadow-lg shadow-sport-orange/20 hover:shadow-sport-orange/40 active:scale-95"
            >
              <LayoutDashboard size={13} aria-hidden="true" />
              Mon espace
            </Link>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="text-sm text-sport-gray hover:text-white transition-colors hidden sm:block"
              >
                Connexion
              </Link>
              <Link
                href="/#tarifs"
                className="inline-flex items-center gap-1.5 bg-sport-orange text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-orange-600 transition-all shadow-lg shadow-sport-orange/20 hover:shadow-sport-orange/40 active:scale-95"
              >
                <Zap size={13} aria-hidden="true" />
                Rejoindre
              </Link>
            </>
          )}
          <button
            ref={hamburgerRef}
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu de navigation'}
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
            className="md:hidden bg-sport-card border-t border-sport-border overflow-hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-sport-gray hover:text-white transition-colors py-3 border-b border-sport-border last:border-0"
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 w-full text-center bg-sport-orange text-white py-3 rounded-full text-sm font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  <LayoutDashboard size={14} aria-hidden="true" />
                  Mon espace
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-medium text-sport-gray hover:text-white transition-colors py-3 border-b border-sport-border"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/#tarifs"
                    onClick={() => setIsOpen(false)}
                    className="mt-4 w-full text-center bg-sport-orange text-white py-3 rounded-full text-sm font-bold hover:bg-orange-600 transition-colors"
                  >
                    Rejoindre maintenant
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
