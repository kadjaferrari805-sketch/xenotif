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

type MarkVariant = 'biton' | 'mono-white'

// Marque « X » : 4 segments épais et angulaires (bouts coupés nets), espace négatif au
// centre. Bi-ton : segments gauche blancs, segments droite orange (#FF6A00).
// SVG pur → reste rendable côté serveur (pas de 'use client').
export function XenotifMark({
  size = 36,
  variant = 'biton',
  animated = false,
}: {
  size?: number
  variant?: MarkVariant
  animated?: boolean
}) {
  const left = '#ffffff'
  const right = variant === 'mono-white' ? '#ffffff' : '#FF6A00'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`xeno-mark${animated ? ' xeno-mark--animated' : ''}`}
    >
      {/* 2 segments gauche */}
      <polygon points="48.73,38.54 14.43,4.25 4.25,14.43 38.54,48.73" fill={left} />
      <polygon points="38.54,51.27 4.25,85.57 14.43,95.75 48.73,61.46" fill={left} />
      {/* 2 segments droite */}
      <polygon points="61.46,48.73 95.75,14.43 85.57,4.25 51.27,38.54" fill={right} />
      <polygon points="51.27,61.46 85.57,95.75 95.75,85.57 61.46,51.27" fill={right} />
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
