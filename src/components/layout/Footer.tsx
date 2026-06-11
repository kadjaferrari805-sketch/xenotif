import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Mail, Globe, PlayCircle, MessageCircle } from 'lucide-react'
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
  { key: 'debutant',      href: '/#programmes' },
  { key: 'intermediaire', href: '/#programmes' },
  { key: 'avance',        href: '/#programmes' },
  { key: 'coachingIA',    href: '/dashboard/coach' },
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

export function Footer() {
  const t = useTranslations('common.footer')

  return (
    <footer aria-label="Pied de page">
      {/* ── Main grid ───────────────────────────────────────── */}
      <div className="bg-sport-card border-t border-sport-border py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="mb-5">
              <Logo href="/" size="sm" />
            </div>
            <p className="text-xs text-sport-gray leading-relaxed mb-6">
              {t('tagline')}
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
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-5">{t('disciplines')}</h3>
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
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-5">{t('programmes')}</h3>
            <ul className="flex flex-col gap-2.5">
              {PROG_LINKS.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="text-xs text-sport-gray hover:text-sport-orange transition-colors">
                    {t(`links.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-5">{t('informations')}</h3>
            <ul className="flex flex-col gap-2.5">
              {INFO_LINKS.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="text-xs text-sport-gray hover:text-sport-orange transition-colors">
                    {t(`links.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-4 bg-sport-dark border border-sport-border rounded-xl">
              <p className="text-[10px] text-sport-gray leading-relaxed">
                <strong className="text-white block mb-1">Xenotif LTD</strong>
                Company no. 17013934<br />
                contact@xenotif.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Copyright bar ────────────────────────────────────── */}
      <div className="bg-[#06070A] border-t border-sport-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-sport-gray">
          <span>{t('copyright')}</span>
          <span>{t('baseline')}</span>
        </div>
      </div>
    </footer>
  )
}
