'use client'

interface Ring {
  value: number
  max: number
  color: string
  label: string
  unit: string
}

interface ActivityRingsProps {
  rings: Ring[]
  size?: number
}

export function ActivityRings({ rings, size = 180 }: ActivityRingsProps) {
  const center = size / 2
  const strokeWidth = 14
  const gap = 6

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        {rings.map((ring, i) => {
          const radius = center - strokeWidth / 2 - i * (strokeWidth + gap)
          const circumference = 2 * Math.PI * radius
          const pct = Math.min(ring.value / ring.max, 1)
          const dash = circumference * pct

          return (
            <g key={ring.label}>
              {/* Track */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={ring.color}
                strokeWidth={strokeWidth}
                opacity={0.12}
              />
              {/* Progress */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={ring.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference}`}
                style={{
                  transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)',
                  filter: `drop-shadow(0 0 6px ${ring.color}80)`,
                }}
              />
            </g>
          )
        })}
      </svg>

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-black text-white leading-none">
          {Math.round((rings[0].value / rings[0].max) * 100)}%
        </span>
        <span className="text-[10px] text-sport-gray mt-0.5">activité</span>
      </div>
    </div>
  )
}
