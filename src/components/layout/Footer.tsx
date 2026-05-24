import Link from 'next/link'

const FOOTER_COLS = [
  {
    title: 'Disciplines',
    links: ['Running & Cardio', 'Musculation', 'HIIT', 'Cyclisme', 'Natation', 'CrossFit'],
  },
  {
    title: 'Programmes',
    links: ['Débutant', 'Intermédiaire', 'Avancé', 'Élite', 'Triathlon', 'Marathon'],
  },
  {
    title: 'Communauté',
    links: [
      'Blog sport',
      'Coaching IA',
      'Challenges',
      'Partenaires',
      'Mentions légales',
      'Confidentialité',
    ],
  },
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
              <span className="font-black text-white text-lg tracking-wider">XENOTIF</span>
            </div>
            <p className="text-sm text-sport-gray leading-relaxed">
              La plateforme sport ultime pour athlètes de tous niveaux. Performance, coaching IA
              et communauté au service de tes objectifs.
            </p>
          </div>

          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-xs text-sport-gray hover:text-sport-orange transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#06070A] border-t border-sport-border px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-sport-gray">
        <span>© 2025 Xenotif — Tous droits réservés</span>
        <span>Conçu pour les athlètes · Propulsé par l&apos;IA</span>
      </div>
    </footer>
  )
}
