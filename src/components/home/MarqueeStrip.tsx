'use client'

const ITEMS = [
  { emoji: '🏋️', text: 'Musculation' },
  { emoji: '🏃', text: 'Running' },
  { emoji: '⚡', text: 'HIIT' },
  { emoji: '🚴', text: 'Cyclisme' },
  { emoji: '🏊', text: 'Natation' },
  { emoji: '🔥', text: 'CrossFit' },
  { emoji: '🤖', text: 'Coaching IA' },
  { emoji: '🏆', text: '12K+ Athlètes' },
  { emoji: '📈', text: 'Résultats garantis' },
  { emoji: '💪', text: 'Programmes sur mesure' },
]

/* Duplicate items for seamless loop */
const ALL = [...ITEMS, ...ITEMS]

export function MarqueeStrip() {
  return (
    <div
      aria-hidden="true"
      className="w-full overflow-hidden bg-sport-orange py-3 border-y border-sport-orange/50"
    >
      <div className="flex gap-0 whitespace-nowrap marquee-track">
        {ALL.map((item, i) => (
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
    </div>
  )
}
