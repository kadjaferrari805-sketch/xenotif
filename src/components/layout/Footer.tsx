import Link from 'next/link'
import { Mail, Globe, PlayCircle, MessageCircle } from 'lucide-react'

const DISC_LINKS = [
  { label: 'Running & Cardio', href: '/disciplines/running-cardio' },
  { label: 'Musculation', href: '/disciplines/musculation' },
  { label: 'HIIT', href: '/disciplines/hiit' },
  { label: 'Cyclisme', href: '/disciplines/cyclisme' },
  { label: 'Natation', href: '/disciplines/natation' },
  { label: 'CrossFit', href: '/disciplines/crossfit' },
]

const PROG_LINKS = [
  { label: 'Débutant', href: '/#programmes' },
  { label: 'Intermédiaire', href: '/#programmes' },
  { label: 'Avancé', href: '/#programmes' },
  { label: 'Élite', href: '/#programmes' },
  { label: 'Coaching IA', href: '/#newsletter' },
  { label: 'Tarifs', href: '/#tarifs' },
]

const INFO_LINKS = [
  { label: 'Mentions légales', href: '/mentions-legales' },
  { label: 'Confidentialité', href: '/confidentialite' },
  { label: 'Contact', href: 'mailto:contact@xenotif.com' },
  { label: 'FAQ', href: '/#faq' },
]

const SOCIAL = [
  { Icon: Globe, label: 'Instagram Xenotif', href: 'https://instagram.com/xenotif' },
  { Icon: PlayCircle, label: 'YouTube Xenotif', href: 'https://youtube.com/@xenotif' },
  { Icon: MessageCircle, label: 'Twitter / X Xenotif', href: 'https://twitter.com/xenotif' },
]

export function Footer() {
  return (
    <footer aria-label="Pied de page">
      <div className="bg-sport-card border-t border-sport-border py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link
              href="/"
              aria-label="Xenotif — Retour à l'accueil"
              className="flex items-center gap-2 mb-5"
            >
              <span aria-hidden="true" className="w-8 h-8 bg-sport-orange rounded-lg flex items-center justify-center font-black text-white text-sm">
                X
              </span>
              <span className="font-black text-white text-lg tracking-wider">XENOTIF®</span>
            </Link>
            <p className="text-xs text-sport-gray leading-relaxed mb-6">
              La plateforme sport ultime pour athlètes de tous niveaux. Performance, coaching IA
              et communauté au service de tes objectifs.
            </p>
            <div className="flex gap-3" aria-label="Réseaux sociaux">
              {SOCIAL.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-sport-dark border border-sport-border flex items-center justify-center text-sport-gray hover:text-sport-orange hover:border-sport-orange/50 transition-colors"
                >
                  <Icon size={15} aria-hidden="true" />
                </a>
              ))}
              <a
                href="mailto:contact@xenotif.com"
                aria-label="Contacter Xenotif par email"
                className="w-9 h-9 rounded-lg bg-sport-dark border border-sport-border flex items-center justify-center text-sport-gray hover:text-sport-orange hover:border-sport-orange/50 transition-colors"
              >
                <Mail size={15} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Disciplines */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-5">Disciplines</h3>
            <ul className="flex flex-col gap-2.5">
              {DISC_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-sport-gray hover:text-sport-orange transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programmes */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-5">Programmes</h3>
            <ul className="flex flex-col gap-2.5">
              {PROG_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-sport-gray hover:text-sport-orange transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-5">Informations</h3>
            <ul className="flex flex-col gap-2.5">
              {INFO_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-sport-gray hover:text-sport-orange transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-4 bg-sport-dark border border-sport-border rounded-xl">
              <p className="text-[10px] text-sport-gray leading-relaxed">
                <strong className="text-white block mb-1">Xenotif®</strong>
                contact@xenotif.com<br />
                xenotif.com
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#06070A] border-t border-sport-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-sport-gray">
          <span>© 2025 Xenotif® — Tous droits réservés</span>
          <span>Conçu pour les athlètes · Propulsé par l&apos;IA</span>
        </div>
      </div>
    </footer>
  )
}
