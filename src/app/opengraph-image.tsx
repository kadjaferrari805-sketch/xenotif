import { ImageResponse } from 'next/og'

// Image de prévisualisation (carte affichée quand on partage un lien sur
// WhatsApp, iMessage, Facebook, LinkedIn, Discord, X…). Générée à la volée :
// pas besoin d'un fichier og-image.jpg statique. S'applique à la page d'accueil
// et sert de défaut aux pages qui ne définissent pas leur propre image OG.
export const alt = 'Xenotif® — Plateforme fitness premium : 10 disciplines, coaching IA, 300+ séances'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0b0d10 0%, #070809 55%, #160c06 100%)',
          padding: '90px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '30px' }}>
          <div style={{ width: '56px', height: '6px', background: '#FF4500', borderRadius: '99px' }} />
          <div style={{ color: '#FF6a33', fontSize: '26px', fontWeight: 700, letterSpacing: '6px' }}>
            PLATEFORME FITNESS PREMIUM
          </div>
        </div>

        {/* Marque */}
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <div style={{ color: '#ffffff', fontSize: '150px', fontWeight: 900, letterSpacing: '-2px' }}>XENOTIF</div>
          <div style={{ color: '#FF4500', fontSize: '92px', fontWeight: 900 }}>®</div>
        </div>

        {/* Slogan */}
        <div style={{ color: '#e6e8ec', fontSize: '56px', fontWeight: 800, marginTop: '6px' }}>
          Forge ton corps. Dépasse tes limites.
        </div>

        {/* Preuves */}
        <div style={{ color: '#8a93a0', fontSize: '30px', fontWeight: 500, marginTop: '42px' }}>
          Coaching IA · 10 disciplines · 300+ séances · 12 000+ athlètes
        </div>
      </div>
    ),
    { ...size },
  )
}
