import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Image OG/Twitter servie sous /api/og : hors du proxy next-intl (matcher exclut /api),
// donc URL stable, 200 direct, sans préfixe de locale ni redirection (partage 100 % propre).
export const runtime = 'nodejs'
export const dynamic = 'force-static'

// Orbitron ExtraBold - TTF statique (les polices variables font planter le parseur de @vercel/og).
const orbitron = readFileSync(join(process.cwd(), 'src/app/_assets/Orbitron-ExtraBold.ttf'))

// Marque embarquée en data-URI (symbole X, 4 segments, sans texte → rendu fiable).
const MARK =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="180" height="180">' +
  '<polygon points="49.65,37.63 15.35,3.33 3.33,15.35 37.63,49.65" fill="#0F0F0F"/>' +
  '<polygon points="37.63,50.35 3.33,84.65 15.35,96.67 49.65,62.37" fill="#0F0F0F"/>' +
  '<polygon points="62.37,49.65 96.67,15.35 84.65,3.33 50.35,37.63" fill="#FF6A00"/>' +
  '<polygon points="50.35,62.37 84.65,96.67 96.67,84.65 62.37,50.35" fill="#FF6A00"/></svg>'
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
          background: '#FFFFFF',
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
            color: '#0F0F0F',
            letterSpacing: 2,
          }}
        >
          XENOTIF
          <span style={{ fontSize: 36, color: '#FF6A00', marginLeft: 6 }}>®</span>
        </div>
        <div
          style={{
            marginTop: 12,
            fontFamily: 'Orbitron',
            fontWeight: 800,
            fontSize: 26,
            color: '#2A2A2A',
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
