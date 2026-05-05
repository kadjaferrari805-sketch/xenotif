const FOOTER_COLS = [
  {
    title: 'Produit',
    links: ['neckZen Massage Pro', 'Fonctionnalités', 'Comparaison', 'Accessoires'],
  },
  {
    title: 'Support',
    links: ['FAQ', "Guide d'utilisation", 'Contact', 'Retours & remboursements'],
  },
  {
    title: 'Entreprise',
    links: ['Notre histoire', 'Blog bien-être', 'Programme fidélité', 'Mentions légales'],
  },
]

export function Footer() {
  return (
    <footer>
      <div className="bg-primary-darker text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <p className="text-white font-extrabold text-lg tracking-wide mb-3">✦ <span>XENOTIF</span></p>
            <p className="text-sm leading-relaxed">
              Le bien-être cervical accessible à tous. Xenotif conçoit des solutions de massages innovantes pour les professionnels, les seniors et le grand public.
            </p>
          </div>
          {FOOTER_COLS.map(col => (
            <div key={col.title}>
              <h4 className="text-gray-200 text-xs font-bold uppercase tracking-widest mb-4">{col.title}</h4>
              <ul className="flex flex-col gap-2">
                {col.links.map(link => (
                  <li key={link} className="text-xs hover:text-teal-300 cursor-pointer transition-colors">{link}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#0a2927] px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500">
        <span>© 2025 Xenotif — Tous droits réservés</span>
        <span>🔒 Paiement sécurisé · SSL · Stripe</span>
      </div>
    </footer>
  )
}
