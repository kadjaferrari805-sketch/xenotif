'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '/#disciplines', label: 'Disciplines' },
  { href: '/#programmes', label: 'Programmes' },
  { href: '/#newsletter', label: 'Coaching' },
]

export function Nav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-sport-dark/95 backdrop-blur-md border-b border-sport-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-black text-lg text-white tracking-wider shrink-0"
        >
          <span className="w-8 h-8 bg-sport-orange rounded-lg flex items-center justify-center font-black text-base">
            X
          </span>
          XENOTIF®
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-7 text-sm font-medium text-sport-gray">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/#newsletter"
            className="text-sm text-sport-gray hover:text-white transition-colors hidden sm:block"
          >
            Connexion
          </Link>
          <Link href="/#newsletter">
            <button className="bg-sport-orange text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-orange-600 transition-colors">
              Rejoindre
            </button>
          </Link>
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="md:hidden text-white p-1"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu — only rendered when open */}
      {isOpen && (
        <div className="md:hidden bg-sport-card border-t border-sport-border px-6 py-5 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-sport-gray hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/#newsletter" onClick={() => setIsOpen(false)}>
            <button className="w-full bg-sport-orange text-white py-2.5 rounded-full text-sm font-bold hover:bg-orange-600 transition-colors mt-2">
              Rejoindre maintenant
            </button>
          </Link>
        </div>
      )}
    </nav>
  )
}
