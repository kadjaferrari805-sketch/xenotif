// Schéma corporel stylisé (front + dos) : met en évidence les zones musculaires
// primaires (orange plein) et secondaires (orange atténué). Reçoit les régions
// dérivées des muscles de l'exercice (voir lib/exercices/details.ts).

type Zone = { id: string; cx: number; cy: number; rx: number; ry: number }

const FRONT: Zone[] = [
  { id: 'shoulders', cx: 66, cy: 92, rx: 12, ry: 10 },
  { id: 'shoulders', cx: 134, cy: 92, rx: 12, ry: 10 },
  { id: 'chest', cx: 84, cy: 108, rx: 15, ry: 12 },
  { id: 'chest', cx: 116, cy: 108, rx: 15, ry: 12 },
  { id: 'biceps', cx: 58, cy: 128, rx: 9, ry: 16 },
  { id: 'biceps', cx: 142, cy: 128, rx: 9, ry: 16 },
  { id: 'forearms', cx: 52, cy: 165, rx: 8, ry: 18 },
  { id: 'forearms', cx: 148, cy: 165, rx: 8, ry: 18 },
  { id: 'abs', cx: 100, cy: 140, rx: 16, ry: 26 },
  { id: 'obliques', cx: 78, cy: 145, rx: 7, ry: 20 },
  { id: 'obliques', cx: 122, cy: 145, rx: 7, ry: 20 },
  { id: 'quads', cx: 84, cy: 235, rx: 13, ry: 34 },
  { id: 'quads', cx: 116, cy: 235, rx: 13, ry: 34 },
  { id: 'fullbody', cx: 100, cy: 108, rx: 0.1, ry: 0.1 },
]

const BACK: Zone[] = [
  { id: 'traps', cx: 100, cy: 84, rx: 20, ry: 12 },
  { id: 'shoulders', cx: 66, cy: 94, rx: 12, ry: 10 },
  { id: 'shoulders', cx: 134, cy: 94, rx: 12, ry: 10 },
  { id: 'lats', cx: 80, cy: 118, rx: 13, ry: 20 },
  { id: 'lats', cx: 120, cy: 118, rx: 13, ry: 20 },
  { id: 'triceps', cx: 58, cy: 128, rx: 9, ry: 16 },
  { id: 'triceps', cx: 142, cy: 128, rx: 9, ry: 16 },
  { id: 'forearms', cx: 52, cy: 165, rx: 8, ry: 18 },
  { id: 'forearms', cx: 148, cy: 165, rx: 8, ry: 18 },
  { id: 'lowerback', cx: 100, cy: 152, rx: 15, ry: 14 },
  { id: 'glutes', cx: 85, cy: 182, rx: 14, ry: 14 },
  { id: 'glutes', cx: 115, cy: 182, rx: 14, ry: 14 },
  { id: 'hamstrings', cx: 84, cy: 240, rx: 13, ry: 30 },
  { id: 'hamstrings', cx: 116, cy: 240, rx: 13, ry: 30 },
  { id: 'calves', cx: 85, cy: 305, rx: 11, ry: 24 },
  { id: 'calves', cx: 115, cy: 305, rx: 11, ry: 24 },
]

// Silhouette de base (gris) : tête, torse, bras, jambes.
function Silhouette() {
  const fill = '#242427'
  return (
    <g fill={fill}>
      <circle cx="100" cy="38" r="18" />
      <rect x="74" y="60" width="52" height="110" rx="20" />
      <rect x="46" y="78" width="18" height="100" rx="9" />
      <rect x="136" y="78" width="18" height="100" rx="9" />
      <rect x="76" y="168" width="20" height="120" rx="10" />
      <rect x="104" y="168" width="20" height="120" rx="10" />
      <rect x="78" y="286" width="16" height="60" rx="8" />
      <rect x="106" y="286" width="16" height="60" rx="8" />
    </g>
  )
}

function Zones({ zones, primary, secondary }: { zones: Zone[]; primary: Set<string>; secondary: Set<string> }) {
  return (
    <g>
      {zones.map((z, i) => {
        const isP = primary.has(z.id)
        const isS = !isP && secondary.has(z.id)
        if (z.rx < 1) return null
        const fill = isP ? '#FF6B00' : isS ? 'rgba(255,107,0,0.38)' : 'rgba(255,255,255,0.06)'
        return (
          <ellipse
            key={i}
            cx={z.cx}
            cy={z.cy}
            rx={z.rx}
            ry={z.ry}
            fill={fill}
            className={isP || isS ? 'transition-opacity duration-300 hover:opacity-80' : ''}
          >
            {(isP || isS) && <title>{z.id}</title>}
          </ellipse>
        )
      })}
    </g>
  )
}

export function BodyDiagram({ regions }: { regions: { id: string; primary: boolean }[] }) {
  const primary = new Set(regions.filter((r) => r.primary).map((r) => r.id))
  const secondary = new Set(regions.filter((r) => !r.primary).map((r) => r.id))
  const isCardio = primary.has('fullbody') || secondary.has('fullbody')

  return (
    <div className="grid grid-cols-2 gap-4">
      {[FRONT, BACK].map((zones, idx) => (
        <div key={idx} className="rounded-2xl bg-sport-dark border border-sport-border p-3">
          <svg viewBox="0 0 200 360" className="w-full h-auto" role="img" aria-label="Schéma musculaire">
            {/* cardio : tout le corps légèrement mis en avant */}
            {isCardio && <rect x="0" y="0" width="200" height="360" fill="rgba(255,69,0,0.05)" />}
            <Silhouette />
            <Zones zones={zones} primary={primary} secondary={secondary} />
          </svg>
        </div>
      ))}
    </div>
  )
}
