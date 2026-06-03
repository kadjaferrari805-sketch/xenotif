'use client'

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="fr">
      <body style={{ background: '#0A0B0F', color: '#fff', fontFamily: 'system-ui', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', margin: 0, textAlign: 'center', padding: '0 16px' }}>
        <div>
          <div style={{ fontSize: 64, marginBottom: 24 }}>⚠️</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Erreur critique</h1>
          <p style={{ color: '#9CA3AF', marginBottom: 32, maxWidth: 400 }}>
            Une erreur inattendue s&apos;est produite. Merci de réessayer.
          </p>
          <button
            onClick={reset}
            style={{ background: '#FF4500', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            🔄 Réessayer
          </button>
        </div>
      </body>
    </html>
  )
}
