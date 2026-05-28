'use client'

const ROW_ONE = [
  { emoji: '🏋️', text: 'Musculation' },
  { emoji: '🏃', text: 'Running' },
  { emoji: '⚡', text: 'HIIT' },
  { emoji: '🚴', text: 'Cyclisme' },
  { emoji: '🏊', text: 'Natation' },
  { emoji: '🔥', text: 'CrossFit' },
  { emoji: '🧘', text: 'Yoga' },
  { emoji: '🥊', text: 'Boxe' },
  { emoji: '🥗', text: 'Nutrition' },
  { emoji: '💪', text: 'Stretching' },
]

const ROW_TWO = [
  { emoji: '🤖', text: 'Coaching IA' },
  { emoji: '🏆', text: '12K+ Athlètes' },
  { emoji: '📈', text: 'Résultats garantis' },
  { emoji: '⭐', text: '4.9 / 5 avis' },
  { emoji: '🎯', text: 'Objectifs sur mesure' },
  { emoji: '⚡', text: '30j pour changer' },
  { emoji: '🔓', text: 'Accès illimité' },
  { emoji: '🛡️', text: 'Remboursement 30j' },
]

export function MarqueeStrip() {
  return (
    <div aria-hidden="true" className="w-full overflow-hidden bg-sport-orange border-y border-sport-orange/50">
      {/* Row 1 — left to right */}
      <div className="py-2.5 flex gap-0 whitespace-nowrap marquee-track">
        {[...ROW_ONE, ...ROW_ONE].map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 text-white font-black text-[11px] tracking-widest uppercase px-7"
          >
            <span>{item.emoji}</span>
            <span>{item.text}</span>
            <span className="text-white/40 mx-1">·</span>
          </span>
        ))}
      </div>

      {/* Row 2 — right to left */}
      <div className="border-t border-white/15 py-2.5 flex gap-0 whitespace-nowrap marquee-track-reverse">
        {[...ROW_TWO, ...ROW_TWO].map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 text-white/80 font-semibold text-[10px] tracking-widest uppercase px-7"
          >
            <span>{item.emoji}</span>
            <span>{item.text}</span>
            <span className="text-white/30 mx-1">—</span>
          </span>
        ))}
      </div>
    </div>
  )
}
