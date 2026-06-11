import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Image OG générée à la compilation (aucune API request-time → statiquement optimisée).
export const alt = 'XENOTIF® — Coaching fitness premium'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Orbitron ExtraBold — TTF statique (les polices variables font planter le parseur de @vercel/og).
const orbitron = readFileSync(join(process.cwd(), 'src/app/_assets/Orbitron-ExtraBold.ttf'))

// Marque embarquée en data-URI (formes + dégradé, sans texte → rendu fiable).
const MARK =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="180" height="180">' +
  '<defs><linearGradient id="t" x1="6" y1="3" x2="42" y2="45" gradientUnits="userSpaceOnUse">' +
  '<stop offset="0%" stop-color="#ffffff"/><stop offset="50%" stop-color="#9ca3af"/>' +
  '<stop offset="100%" stop-color="#e5e7eb"/></linearGradient></defs>' +
  '<polygon points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5" fill="none" stroke="url(#t)" stroke-width="2.4" stroke-linejoin="round"/>' +
  '<g stroke="#FF4500" stroke-width="4.6" stroke-linecap="round">' +
  '<line x1="17.5" y1="17.5" x2="30.5" y2="30.5"/><line x1="30.5" y1="17.5" x2="17.5" y2="30.5"/></g></svg>'
const markSrc = `data:image/svg+xml;base64,${Buffer.from(MARK).toString('base64')}`

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A0B0F',
        }}
      >
        <img width={180} height={180} src={markSrc} alt="" />
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            marginTop: 28,
            fontFamily: 'Orbitron',
            fontWeight: 800,
            fontSize: 96,
            color: '#ffffff',
            letterSpacing: 2,
          }}
        >
          XENOTIF
          <span style={{ fontSize: 36, color: '#FF4500', marginLeft: 6 }}>®</span>
        </div>
        <div
          style={{
            marginTop: 12,
            fontFamily: 'Orbitron',
            fontWeight: 800,
            fontSize: 26,
            color: '#9ca3af',
            letterSpacing: 8,
          }}
        >
          COACHING FITNESS PREMIUM
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Orbitron', data: orbitron, weight: 800, style: 'normal' }],
    },
  )
}
