'use client'

import type { ReactNode } from 'react'

// Carrousel à défilement horizontal CONTINU (boucle sans fin).
// Le contenu est dupliqué et la piste translate de -50 % → boucle homogène.
// - durationSec : durée d'un cycle complet (plus grand = plus lent).
// - pause au survol (via .marquee-track:hover dans globals.css).
// - fondu sur les bords (.marquee-mask).
// Astuce d'espacement : donne une marge droite (ex. mr-5) à chaque carte enfant
// — la boucle reste sans couture (pas de flex gap entre les deux moitiés).
export function Marquee({
  children,
  durationSec = 40,
  className = '',
}: {
  children: ReactNode
  durationSec?: number
  className?: string
}) {
  return (
    <div className={`marquee-mask group w-full overflow-hidden ${className}`}>
      <div className="flex w-max marquee-track" style={{ animationDuration: `${durationSec}s` }}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">{children}</div>
      </div>
    </div>
  )
}
