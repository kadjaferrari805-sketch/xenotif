// Snapshot nutrition présentationnel (macros démo).
const MACROS = [
  { key: 'protein' as const, label: 'Protéines', color: 'bg-sport-orange', max: 180 },
  { key: 'carbs' as const, label: 'Glucides', color: 'bg-sport-blue', max: 280 },
  { key: 'fat' as const, label: 'Lipides', color: 'bg-sport-lime', max: 90 },
]

export function PreviewNutrition({ calories, target, protein, carbs, fat }: { calories: number; target: number; protein: number; carbs: number; fat: number }) {
  const vals = { protein, carbs, fat }
  return (
    <div className="bg-sport-card border border-sport-border rounded-2xl p-5">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-sm font-black text-white">Nutrition du jour</h3>
        <span className="text-xs text-sport-gray"><strong className="text-white">{calories}</strong> / {target} kcal</span>
      </div>
      <div className="space-y-3">
        {MACROS.map(m => (
          <div key={m.key}>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-sport-gray">{m.label}</span>
              <span className="text-white font-bold">{vals[m.key]} g</span>
            </div>
            <div className="w-full bg-sport-dark rounded-full h-1.5">
              <div className={`${m.color} h-1.5 rounded-full`} style={{ width: `${Math.min(100, (vals[m.key] / m.max) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
