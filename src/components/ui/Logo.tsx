import { Link } from '@/i18n/navigation'

interface LogoProps {
  href?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showText?: boolean
}

const sizes = {
  sm: { mark: 28, text: 'text-base',  gap: 'gap-2' },
  md: { mark: 36, text: 'text-xl',    gap: 'gap-2.5' },
  lg: { mark: 48, text: 'text-2xl',   gap: 'gap-3' },
}

export function XenotifMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="drop-shadow-[0_2px_12px_rgba(249,115,22,0.40)]"
    >
      <defs>
        {/* Dégradé riche à 3 teintes pour la profondeur */}
        <linearGradient id="xeno-grad" x1="2" y1="0" x2="46" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFB266" />
          <stop offset="52%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
        {/* Brillance haute, douce */}
        <linearGradient id="xeno-shine" x1="0" y1="0" x2="0" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Carré arrondi */}
      <rect width="48" height="48" rx="13" fill="url(#xeno-grad)" />
      {/* Reflet supérieur */}
      <rect width="48" height="26" rx="13" fill="url(#xeno-shine)" />
      {/* Liseré interne subtil pour la définition */}
      <rect x="1" y="1" width="46" height="46" rx="12" fill="none" stroke="#ffffff" strokeOpacity="0.20" strokeWidth="1" />

      {/* X géométrique : deux barres diagonales nettes, croisées au centre */}
      <g>
        <rect x="20.4" y="9" width="7.2" height="30" rx="1.6" transform="rotate(45 24 24)" fill="#ffffff" />
        <rect x="20.4" y="9" width="7.2" height="30" rx="1.6" transform="rotate(-45 24 24)" fill="#ffffff" />
      </g>
    </svg>
  )
}

export function XenotifWordmark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`font-black tracking-[0.16em] uppercase bg-gradient-to-b from-white via-white to-orange-100/90 bg-clip-text text-transparent ${className}`}
    >
      XENOTIF<sup className="align-super text-[0.5em] text-sport-orange ml-[0.08em]">®</sup>
    </span>
  )
}

export function Logo({ href = '/', size = 'md', className = '', showText = true }: LogoProps) {
  const { mark, text, gap } = sizes[size]

  const inner = (
    <span className={`flex items-center ${gap} ${className}`}>
      <XenotifMark size={mark} />
      {showText && (
        <XenotifWordmark className={text} />
      )}
    </span>
  )

  return href ? (
    <Link href={href} className="inline-flex items-center">
      {inner}
    </Link>
  ) : inner
}
