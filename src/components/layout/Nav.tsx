import Link from 'next/link'

const NAV_LINKS = [
  { href: '#disciplines', label: 'Disciplines' },
  { href: '#programmes', label: 'Programmes' },
  { href: '#coaching', label: 'Coaching' },
  { href: '/blog', label: 'Blog' },
]

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-sport-dark border-b border-sport-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-black text-lg text-white tracking-wider"
        >
          <span className="w-8 h-8 bg-sport-orange rounded-lg flex items-center justify-center text-white font-black text-base">
            X
          </span>
          XENOTIF
        </Link>

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

        <div className="flex items-center gap-3">
          <Link
            href="/connexion"
            className="text-sm text-sport-gray hover:text-white transition-colors hidden sm:block"
          >
            Connexion
          </Link>
          <button className="bg-sport-orange text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-orange-600 transition-colors">
            Rejoindre
          </button>
        </div>
      </div>
    </nav>
  )
}
