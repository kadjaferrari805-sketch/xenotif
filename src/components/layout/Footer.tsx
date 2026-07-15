'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Mail, Globe, PlayCircle, MessageCircle, ArrowRight, CheckCircle } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

// Noms de disciplines = noms propres/marque → laissés en FR en P1 (cohérent
// avec les pages disciplines, dont le contenu est traduit en P2).
const DISC_LINKS = [
  { label: 'Running & Cardio', href: '/disciplines/running-cardio' },
  { label: 'Musculation',      href: '/disciplines/musculation' },
  { label: 'HIIT',             href: '/disciplines/hiit' },
  { label: 'Cyclisme',         href: '/disciplines/cyclisme' },
  { label: 'Natation',         href: '/disciplines/natation' },
  { label: 'CrossFit',         href: '/disciplines/crossfit' },
]

const PROG_LINKS = [
  { key: 'debutant',      href: '/programmes/musculation-debutant' },
  { key: 'intermediaire', href: '/programmes/musculation-intermediaire' },
  { key: 'avance',        href: '/programmes/musculation-avance' },
  { key: 'elite',         href: '/programmes/prise-de-masse-12s' },
  { key: 'exercices',     href: '/exercices' },
  { key: 'outils',        href: '/outils' },
  { key: 'defis',         href: '/defis' },
  { key: 'coachingIA',    href: '/dashboard/coach' },
  { key: 'preview',       href: '/dashboard-preview' },
  { key: 'tarifs',        href: '/#tarifs' },
] as const

const INFO_LINKS = [
  { key: 'about',           href: '/a-propos' },
  { key: 'mentionsLegales', href: '/mentions-legales' },
  { key: 'confidentialite', href: '/confidentialite' },
  { key: 'cgv',             href: '/conditions-generales-vente' },
  { key: 'contact',         href: '/contact' },
  { key: 'faq',             href: '/#faq' },
] as const

const SOCIAL = [
  { Icon: Globe,         label: 'Instagram Xenotif', href: 'https://instagram.com/xenotif' },
  { Icon: PlayCircle,    label: 'YouTube Xenotif',   href: 'https://youtube.com/@xenotif' },
  { Icon: MessageCircle, label: 'Twitter / X Xenotif', href: 'https://twitter.com/xenotif' },
]

// Formulaire newsletter compact (5e colonne) - réutilise l'endpoint /api/subscribe
// déjà utilisé par la section complète home/Newsletter.tsx, sans en reprendre la
// mise en page pleine largeur (trop imposante pour la grille du footer).
function FooterNewsletter() {
  const t = useTranslations('common.footer')
  const tn = useTranslations('home.newsletter')
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(tn('errorInvalid'))
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? tn('errorGeneric'))
      } else {
        setSubmitted(true)
      }
    } catch {
      setError(tn('errorNetwork'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div data-reveal>
      <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-5">{t('newsletterTitle')}</h3>
      {submitted ? (
        <p role="status" aria-live="polite" className="flex items-start gap-2 text-xs text-white/70 leading-relaxed">
          <CheckCircle size={14} className="text-sport-orange shrink-0 mt-0.5" aria-hidden="true" />
          {tn('successTitle')}
        </p>
      ) : (
        <form onSubmit={handleSubmit} noValidate aria-label={tn('formAria')} className="flex flex-col gap-2">
          <label htmlFor="footer-newsletter-email" className="sr-only">{tn('emailLabel')}</label>
          <div className="flex gap-2">
            <input
              id="footer-newsletter-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (error) setError('') }}
              placeholder={tn('placeholder')}
              autoComplete="email"
              aria-required="true"
              aria-invalid={!!error}
              className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/40 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-sport-orange transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              aria-label={tn('submit')}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sport-orange text-white hover:bg-[#E65F00] active:scale-95 transition-all disabled:opacity-60"
            >
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
          {error && <p role="alert" className="text-red-400 text-[11px]">{error}</p>}
        </form>
      )}
    </div>
  )
}

export function Footer() {
  const t = useTranslations('common.footer')

  return (
    <footer aria-label={t('ariaFooter')}>
      {/* ── Main grid ─── fond noir fixe, indépendant du thème clair du site ── */}
      <div className="bg-footer-bg border-t border-white/10 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-12">
          {/* Brand */}
          <div data-reveal className="md:col-span-2">
            <div className="mb-5">
              <Logo href="/" size="sm" />
            </div>
            <p className="text-xs text-white/60 leading-relaxed mb-6">
              {t('tagline')}
            </p>
            <div className="flex gap-3" aria-label={t('ariaSocial')}>
              {SOCIAL.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-sport-orange hover:border-sport-orange/50 transition-colors"
                >
                  <Icon size={15} aria-hidden="true" />
                </a>
              ))}
              <a
                href="mailto:contact@xenotif.com"
                aria-label={t('ariaEmail')}
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-sport-orange hover:border-sport-orange/50 transition-colors"
              >
                <Mail size={15} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Disciplines */}
          <div data-reveal>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-5">{t('disciplines')}</h3>
            <ul className="flex flex-col gap-2.5">
              {DISC_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-white/60 hover:text-sport-orange transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programmes */}
          <div data-reveal>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-5">{t('programmes')}</h3>
            <ul className="flex flex-col gap-2.5">
              {PROG_LINKS.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="text-xs text-white/60 hover:text-sport-orange transition-colors">
                    {t(`links.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations */}
          <div data-reveal>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-5">{t('informations')}</h3>
            <ul className="flex flex-col gap-2.5">
              {INFO_LINKS.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="text-xs text-white/60 hover:text-sport-orange transition-colors">
                    {t(`links.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-[10px] text-white/60 leading-relaxed">
                <strong className="text-white block mb-1">Xenotif LTD</strong>
                Company no. 17013934<br />
                contact@xenotif.com
              </p>
            </div>
          </div>

          {/* Newsletter */}
          <FooterNewsletter />
        </div>
      </div>

      {/* ── Copyright bar ────────────────────────────────────── */}
      <div className="bg-footer-bg border-t border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/60">
          <span>{t('copyright')}</span>
          <span>{t('baseline')}</span>
        </div>
      </div>
    </footer>
  )
}
