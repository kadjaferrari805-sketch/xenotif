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
}

const GAP = 8

export function ActivityRing({ rings, size = 160, strokeWidth = 12, className }: ActivityRingProps) {
  const center = size / 2
  return (
    <div className={`relative inline-flex items-center justify-center ${className ?? ''}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {rings.map((ring, i) => {
          const r = center - strokeWidth / 2 - i * (strokeWidth + GAP)
          const circumference = 2 * Math.PI * r
          const progress = Math.min(ring.value / ring.max, 1)
          const dashOffset = circumference * (1 - progress)
          return (
            <g key={ring.label}>
              <circle cx={center} cy={center} r={r} fill="none" stroke={ring.color} strokeWidth={strokeWidth} opacity={0.15} />
              <circle
                cx={center} cy={center} r={r} fill="none"
                stroke={ring.color} strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
