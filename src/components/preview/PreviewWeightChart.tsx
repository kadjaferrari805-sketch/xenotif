// Sparkline présentationnel de l'évolution du poids (données démo).
export function PreviewWeightChart({ points, unit, goal }: { points: number[]; unit: string; goal: number }) {
  const w = 280, h = 80, pad = 6
  const min = Math.min(...points, goal) - 0.5
  const max = Math.max(...points) + 0.5
  const x = (i: number) => pad + (i * (w - 2 * pad)) / (points.length - 1)
  const y = (v: number) => pad + (1 - (v - min) / (max - min)) * (h - 2 * pad)
  const d = points.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
  const last = points[points.length - 1]
  const delta = (last - points[0]).toFixed(1)
  return (
    <div className="bg-sport-card border border-sport-border rounded-2xl p-5">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-sm font-black text-sport-fg">Suivi du poids</h3>
        <span className="text-xs font-bold text-[#1E7F5A]">{delta} {unit}</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Évolution du poids">
        <path d={d} fill="none" stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={x(points.length - 1)} cy={y(last)} r="3.5" fill="#FF6B00" />
      </svg>
      <div className="flex items-center justify-between mt-2 text-[11px] text-sport-gray">
        <span>{last} {unit}</span>
        <span>Objectif {goal} {unit}</span>
      </div>
    </div>
  )
}
