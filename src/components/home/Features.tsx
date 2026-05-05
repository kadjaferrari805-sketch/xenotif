import { SectionHeader } from '@/components/ui/SectionHeader'
import { FEATURES } from '@/lib/constants'

const COLOR_MAP: Record<string, string> = {
  teal: 'bg-primary-light',
  amber: 'bg-amber-50',
  violet: 'bg-violet-100',
  sky: 'bg-sky-100',
  rose: 'bg-rose-100',
  emerald: 'bg-emerald-100',
}

export function Features() {
  return (
    <section id="features" className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Technologie"
          title="6 technologies pour votre cou"
          subtitle="Le neckZen combine les meilleures innovations du massage cervical en un seul appareil compact"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {FEATURES.map(feat => (
            <div key={feat.title} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all">
              <div className={`w-14 h-14 ${COLOR_MAP[feat.color]} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4`}>
                {feat.icon}
              </div>
              <h3 className="text-sm font-bold text-primary-darker mb-2">{feat.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">{feat.description}</p>
              <span className="inline-block bg-primary-light text-primary text-[10px] font-bold px-3 py-1 rounded-full">
                {feat.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
