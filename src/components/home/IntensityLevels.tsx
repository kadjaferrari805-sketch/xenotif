import { SectionHeader } from '@/components/ui/SectionHeader'

const LEVELS = [
  { range: 'Niv. 1–5', width: '30%', desc: 'Soin quotidien léger' },
  { range: 'Niv. 6–10', width: '60%', desc: 'Raideurs cervicales' },
  { range: 'Niv. 11–16', width: '100%', desc: 'Tensions chroniques sévères' },
]

const PROFILES = [
  { icon: '💼', title: 'Pour les professionnels', desc: "Niveaux 1–8 recommandés après une longue journée de bureau ou de télétravail. Utilisable discrètement." },
  { icon: '👴', title: 'Pour les seniors', desc: "Niveaux 1–6 idéaux — chaleur douce et stimulation légère pour améliorer la mobilité cervicale." },
  { icon: '⚕️', title: 'Pour les douleurs chroniques', desc: "Niveaux 11–16 avec arrêt automatique 15 min. Résultats progressifs en 2–3 semaines." },
]

export function IntensityLevels() {
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-primary-light to-primary-lighter">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Intensité"
          title="Trouvez votre niveau idéal"
          subtitle="16 niveaux pour s'adapter à chaque type de douleur"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col gap-4">
            {LEVELS.map(l => (
              <div key={l.range} className="flex items-center gap-4">
                <span className="text-xs font-bold text-primary w-20 shrink-0">{l.range}</span>
                <div className="flex-1 h-2.5 bg-teal-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-teal-400 rounded-full" style={{ width: l.width }} />
                </div>
                <span className="text-xs text-gray-500 w-36 shrink-0">{l.desc}</span>
              </div>
            ))}
            <div className="bg-white rounded-xl p-4 shadow-sm mt-4">
              <div className="flex justify-between mb-3 text-xs font-bold">
                <span className="text-primary-darker">Avant utilisation</span>
                <span className="text-primary">Après utilisation</span>
              </div>
              <div className="flex rounded-lg overflow-hidden h-12">
                <div className="flex-1 bg-gradient-to-r from-red-100 to-red-200 flex items-center justify-center text-xs font-bold text-red-600">😣 Tension</div>
                <div className="w-0.5 bg-white" />
                <div className="flex-1 bg-gradient-to-r from-emerald-100 to-emerald-200 flex items-center justify-center text-xs font-bold text-emerald-600">😌 Soulagé</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {PROFILES.map(p => (
              <div key={p.title} className="bg-white rounded-xl p-4 shadow-sm flex gap-4">
                <div className="w-11 h-11 bg-primary-light rounded-xl flex items-center justify-center text-xl shrink-0">{p.icon}</div>
                <div>
                  <h4 className="text-sm font-bold text-primary-darker mb-1">{p.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
