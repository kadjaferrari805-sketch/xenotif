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
      className="w-full overflow-hidden bg-sport-orange py-3 border-y border-sport-orange/50"
    >
      <div className="flex gap-0 whitespace-nowrap marquee-track">
        {all.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 text-sport-fg font-black text-[11px] tracking-widest uppercase px-7"
          >
            <span>{item.emoji}</span>
            <span>{item.text}</span>
            <span className="text-sport-fg/40 mx-1">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
