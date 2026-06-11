import { Link } from '@/i18n/navigation'

interface LogoProps {
  href?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showText?: boolean
  animated?: boolean
}

const sizes = {
  sm: { mark: 28, text: 'text-base', gap: 'gap-2' },
  md: { mark: 36, text: 'text-xl', gap: 'gap-2.5' },
  lg: { mark: 48, text: 'text-2xl', gap: 'gap-3' },
}

type MarkVariant = 'biton' | 'mono-white' | 'mono-titane'

// Marque « Hexa-Tech » : hexagone (contour titane) + X orange.
// SVG pur + CSS → reste rendable côté serveur (pas de 'use client').
export function XenotifMark({
  size = 36,
  variant = 'biton',
  animated = false,
}: {
  size?: number
  variant?: MarkVariant
  animated?: boolean
}) {
  const hexStroke = variant === 'mono-white' ? '#ffffff' : 'url(#xeno-titane)'
  const xStroke =
    variant === 'biton' ? '#FF4500' : variant === 'mono-white' ? '#ffffff' : 'url(#xeno-titane)'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`xeno-mark${animated ? ' xeno-mark--animated' : ''}`}
    >
      <defs>
        {/* Dégradé titane/argent. Id stable : plusieurs instances partagent la même def. */}
        <linearGradient id="xeno-titane" x1="6" y1="3" x2="42" y2="45" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#9ca3af" />
          <stop offset="100%" stopColor="#e5e7eb" />
        </linearGradient>
      </defs>

      {/* Hexagone */}
      <polygon
        points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5"
        fill="none"
        stroke={hexStroke}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* X (deux segments) — la classe .xeno-x sert de cible à l'animation de tracé */}
      <g className="xeno-x" stroke={xStroke} strokeWidth="4.6" strokeLinecap="round">
        <line x1="17.5" y1="17.5" x2="30.5" y2="30.5" />
        <line x1="30.5" y1="17.5" x2="17.5" y2="30.5" />
      </g>
    </svg>
  )
}

// Wordmark : XENOTIF en Orbitron, ® orange. « XENOTIF » reste un nœud texte distinct.
export function XenotifWordmark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`font-[family-name:var(--font-orbitron)] font-extrabold tracking-[0.02em] uppercase text-white ${className}`}
    >
      XENOTIF
      <sup className="align-super text-[0.5em] text-sport-orange ml-[0.06em]">®</sup>
    </span>
  )
}

// Lockup horizontal (header, footer, dashboard, auth).
export function Logo({
  href = '/',
  size = 'md',
  className = '',
  showText = true,
  animated = false,
}: LogoProps) {
  const { mark, text, gap } = sizes[size]

  const inner = (
    <span className={`flex items-center ${gap} ${className}`}>
      <XenotifMark size={mark} animated={animated} />
      {showText && <XenotifWordmark className={text} />}
    </span>
  )

  return href ? (
    <Link href={href} className="inline-flex items-center">
      {inner}
    </Link>
  ) : (
    inner
  )
}

// Lockup vertical (splash / checkout) : marque au-dessus, wordmark dessous.
export function LogoVertical({
  href = '/',
  size = 'md',
  className = '',
}: Omit<LogoProps, 'showText' | 'animated'>) {
  const { mark, text } = sizes[size]

  const inner = (
    <span className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <XenotifMark size={mark} />
      <XenotifWordmark className={text} />
    </span>
  )

  return href ? (
    <Link href={href} className="inline-flex">
      {inner}
    </Link>
  ) : (
    inner
  )
}
