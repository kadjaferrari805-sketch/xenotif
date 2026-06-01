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
    >
      <defs>
        <linearGradient id="xeno-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF8C3A" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
        <linearGradient id="xeno-shine" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Background rounded square */}
      <rect width="48" height="48" rx="12" fill="url(#xeno-grad)" />

      {/* Shine overlay */}
      <rect width="48" height="24" rx="12" fill="url(#xeno-shine)" />
      <rect x="0" y="12" width="48" height="12" fill="url(#xeno-shine)" />

      {/* Bold X — two crossing bars with cut angles for a sharp athletic look */}
      {/* Top-left to bottom-right bar */}
      <path
        d="M10 10 L22 24 L10 38 L16 38 L24 27 L32 38 L38 38 L26 24 L38 10 L32 10 L24 21 L16 10 Z"
        fill="white"
      />
    </svg>
  )
}

export function XenotifWordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-black tracking-widest uppercase text-white ${className}`}>
      XENOTIF<span className="text-sport-orange">®</span>
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
