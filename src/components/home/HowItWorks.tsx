import { SectionHeader } from '@/components/ui/SectionHeader'

const STEPS = [
  { title: 'Placez le neckZen sur votre cou', desc: "Les 4 têtes s'adaptent à toutes les morphologies. Le design ergonomique en U maintient l'appareil sans effort." },
  { title: 'Choisissez votre niveau (1–16)', desc: "Commencez doucement (1-5 pour l'entretien quotidien) et augmentez selon vos besoins jusqu'au niveau 16." },
  { title: '15 minutes de soulagement', desc: "La chaleur et les impulsions agissent simultanément. Arrêt automatique après 15 min pour votre sécurité." },
  { title: "Résultats dès la 1ère session", desc: "80% des utilisateurs ressentent un soulagement immédiat. Les bénéfices s'accumulent avec une utilisation régulière." },
]

const DIAGRAM = [
  { icon: '🌀', label: 'Traction circulaire', sub: 'Décompression cervicale', active: true },
  { icon: '⚡', label: 'Impulsion basse fréq.', sub: 'Stimulation musculaire', active: true },
  { icon: '🔥', label: 'Chaleur 42°C', sub: 'Pénètre 20mm', active: false },
  { icon: '🩸', label: 'Circulation sanguine', sub: 'Améliorée +40%', active: false },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Mécanisme"
          title="Comment ça marche ?"
          subtitle="Deux technologies combinées pour un soulagement optimal"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="bg-gradient-to-br from-primary-light to-blue-100 rounded-3xl p-8 grid grid-cols-2 gap-3">
            {DIAGRAM.map(d => (
              <div key={d.label} className={`bg-white rounded-xl p-4 text-center shadow-sm ${d.active ? 'border-2 border-primary' : ''}`}>
                <div className="text-2xl mb-2">{d.icon}</div>
                <div className="text-xs font-bold text-primary-darker">{d.label}</div>
                <div className="text-[10px] text-gray-400 mt-1">{d.sub}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-6">
            {STEPS.map((step, i) => (
              <div key={step.title} className="flex gap-4">
                <div className="w-9 h-9 min-w-[36px] bg-primary text-white rounded-full flex items-center justify-center font-extrabold text-sm">
                  {i + 1}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary-darker mb-1">{step.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
