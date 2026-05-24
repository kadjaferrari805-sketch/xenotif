import Link from 'next/link'

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
  { label: 'Triathlon', href: '/#disciplines' },
  { label: 'Marathon', href: '/#disciplines' },
]

const COMMUNITY_LINKS = [
  { label: 'Coaching IA', href: '/#disciplines' },
  { label: 'Challenges', href: '/#newsletter' },
  { label: 'Partenaires', href: '/#newsletter' },
  { label: 'Mentions légales', href: '/mentions-legales' },
  { label: 'Confidentialité', href: '/confidentialite' },
]

export function Footer() {
  return (
    <footer>
      <div className="bg-sport-card border-t border-sport-border py-14 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-sport-orange rounded-lg flex items-center justify-center font-black text-white text-sm">
                X
              </span>
              <span className="font-black text-white text-lg tracking-wider">XENOTIF®</span>
            </div>
            <p className="text-sm text-sport-gray leading-relaxed">
              La plateforme sport ultime pour athlètes de tous niveaux. Performance, coaching IA
              et communauté au service de tes objectifs.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Disciplines</h4>
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

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Programmes</h4>
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

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Communauté</h4>
            <ul className="flex flex-col gap-2.5">
              {COMMUNITY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-sport-gray hover:text-sport-orange transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#06070A] border-t border-sport-border px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-sport-gray">
        <span>© 2025 Xenotif® — Tous droits réservés</span>
        <span>Conçu pour les athlètes · Propulsé par l&apos;IA</span>
      </div>
    </footer>
  )
}
