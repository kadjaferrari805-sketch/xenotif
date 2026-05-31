import type { ReactNode } from 'react'

interface RingData {
  value: number
  max: number
  color: string
  label: string
}

interface ActivityRingProps {
  rings: RingData[]
  size?: number
  strokeWidth?: number
  className?: string
  children?: ReactNode
}

const GAP = 7

// Anneaux d'activité inspirés d'Apple Fitness : dégradés + halo lumineux + bouts arrondis.
export function ActivityRing({ rings, size = 168, strokeWidth = 15, className, children }: ActivityRingProps) {
  const center = size / 2
  return (
    <div className={`relative inline-flex items-center justify-center ${className ?? ''}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <defs>
          {rings.map((ring, i) => (
            <linearGradient key={i} id={`ring-grad-${i}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={ring.color} stopOpacity="0.75" />
              <stop offset="100%" stopColor={ring.color} />
            </linearGradient>
          ))}
          <filter id="ring-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {rings.map((ring, i) => {
          const r = center - strokeWidth / 2 - i * (strokeWidth + GAP)
          const circumference = 2 * Math.PI * r
          const progress = Math.min(ring.value / Math.max(ring.max, 1), 1)
          const dashOffset = circumference * (1 - progress)
          return (
            <g key={ring.label}>
              {/* track */}
              <circle cx={center} cy={center} r={r} fill="none" stroke={ring.color} strokeWidth={strokeWidth} opacity={0.12} />
              {/* progress */}
              <circle
                cx={center}
                cy={center}
                r={r}
                fill="none"
                stroke={`url(#ring-grad-${i})`}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                filter="url(#ring-glow)"
                style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(0.34, 1.1, 0.5, 1)' }}
              />
            </g>
          )
        })}
      </svg>
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">
          {children}
        </div>
      )}
    </div>
  )
}
