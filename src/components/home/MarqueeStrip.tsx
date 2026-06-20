'use client'

import { useTranslations } from 'next-intl'

const EMOJIS = ['🏋️', '🏃', '⚡', '🚴', '🏊', '🔥', '🤖', '🏆', '📈', '💪']

export function MarqueeStrip() {
  const t = useTranslations('home.marquee')
  const texts = t.raw('items') as string[]
  const items = EMOJIS.map((emoji, i) => ({ emoji, text: texts[i] }))

  /* Duplicate items for seamless loop */
  const all = [...items, ...items]

  return (
    <div
      aria-hidden="true"
      className="w-full overflow-hidden bg-sport-orange-deep py-3 border-y border-sport-orange/40"
    >
      <div className="flex gap-0 whitespace-nowrap marquee-track">
        {all.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 text-white font-black text-[11px] tracking-widest uppercase px-7"
          >
            <span>{item.emoji}</span>
            <span>{item.text}</span>
            <span className="text-white/70 mx-1">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
