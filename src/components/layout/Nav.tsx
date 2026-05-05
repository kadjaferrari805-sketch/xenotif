import Link from 'next/link'

const NAV_LINKS = [
  { href: '#features', label: 'Fonctionnalités' },
  { href: '#how-it-works', label: 'Comment ça marche' },
  { href: '#reviews', label: 'Avis clients' },
  { href: '/blog', label: 'Blog' },
]

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-lg text-primary tracking-wide">
          <span className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white text-sm">✦</span>
          XENOTIF
        </Link>
        <div className="hidden md:flex gap-7 text-sm font-medium text-gray-500">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} className="hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Link href="/mon-compte" className="text-sm text-gray-500 hover:text-primary transition-colors">
            👤 Mon compte
          </Link>
          <button className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-primary-dark transition-colors">
            🛒 Panier (0)
          </button>
        </div>
      </div>
    </nav>
  )
}
