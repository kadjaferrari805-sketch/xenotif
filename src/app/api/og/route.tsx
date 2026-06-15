import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Image OG/Twitter servie sous /api/og : hors du proxy next-intl (matcher exclut /api),
// donc URL stable, 200 direct, sans préfixe de locale ni redirection (partage 100 % propre).
export const runtime = 'nodejs'
export const dynamic = 'force-static'

// Orbitron ExtraBold — TTF statique (les polices variables font planter le parseur de @vercel/og).
const orbitron = readFileSync(join(process.cwd(), 'src/app/_assets/Orbitron-ExtraBold.ttf'))

// Marque embarquée en data-URI (symbole X, 4 segments, sans texte → rendu fiable).
const MARK =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="180" height="180">' +
  '<polygon points="48.73,38.54 14.43,4.25 4.25,14.43 38.54,48.73" fill="#ffffff"/>' +
  '<polygon points="38.54,51.27 4.25,85.57 14.43,95.75 48.73,61.46" fill="#ffffff"/>' +
  '<polygon points="61.46,48.73 95.75,14.43 85.57,4.25 51.27,38.54" fill="#FF6A00"/>' +
  '<polygon points="51.27,61.46 85.57,95.75 95.75,85.57 61.46,51.27" fill="#FF6A00"/></svg>'
const markSrc = `data:image/svg+xml;base64,${Buffer.from(MARK).toString('base64')}`

export function GET() {
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
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
      width: 1200,
      height: 630,
      fonts: [{ name: 'Orbitron', data: orbitron, weight: 800, style: 'normal' }],
    },
  )
}
