import { Button } from '@/components/ui/Button'
import { TRUST_ITEMS } from '@/lib/constants'

const FLOAT_BADGES = [
  { icon: '🔥', label: 'Chaleur 42°C', colorClass: 'bg-orange-50 text-orange-600', pos: 'top-0 -right-4 md:-right-12' },
  { icon: '⚡', label: '16 niveaux', colorClass: 'bg-amber-50 text-amber-600', pos: 'bottom-8 -right-4 md:-right-16' },
  { icon: '📡', label: 'Sans fil', colorClass: 'bg-violet-50 text-violet-600', pos: 'bottom-0 -left-4 md:-left-12' },
]

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary-light via-primary-lighter to-orange-50 py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block bg-primary/10 text-primary text-[11px] font-bold tracking-widest uppercase px-4 py-1 rounded-full mb-5">
            🌿 Santé &amp; Bien-être Cervical
          </span>
          <h1 className="text-4xl font-extrabold text-primary-darker leading-tight mb-4">
            Dites adieu aux{' '}
            <em className="not-italic text-primary">douleurs cervicales</em>
          </h1>
          <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-md">
            Le neckZen est le masseur cervical intelligent à 4 têtes qui combine impulsions basse fréquence, chaleur thérapeutique et 16 niveaux d&apos;intensité — conçu pour votre quotidien.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Button variant="primary">Commander maintenant — 79,90€</Button>
            <Button variant="secondary">Voir comment ça marche ↓</Button>
          </div>
          <div className="flex flex-wrap gap-5">
            {TRUST_ITEMS.map(item => (
              <div key={item.label} className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-2 h-2 bg-primary rounded-full" />
                <strong>{item.label}</strong>&nbsp;{item.sublabel}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative w-64 h-64 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center shadow-2xl shadow-primary/20">
            <div className="relative w-44 h-40">
              <div className="absolute top-4 left-2 w-40 h-20 border-[14px] border-gray-300 border-b-0 rounded-t-full bg-gradient-to-b from-gray-50 to-gray-200">
                <div className="absolute top-2 left-2 w-8 h-6 rounded-lg border-2 border-primary bg-teal-50 shadow-[0_0_10px_rgba(15,118,110,0.5)]" />
                <div className="absolute top-2 right-2 w-8 h-6 rounded-lg border-2 border-primary bg-teal-50 shadow-[0_0_10px_rgba(15,118,110,0.5)]" />
                <div className="absolute top-10 left-2 w-8 h-6 rounded-lg border-2 border-gray-300 bg-gray-100" />
                <div className="absolute top-10 right-2 w-8 h-6 rounded-lg border-2 border-gray-300 bg-gray-100" />
              </div>
              <div className="absolute bottom-0 left-14 w-16 h-16 border-[10px] border-gray-300 border-t-0 rounded-b-3xl bg-gradient-to-b from-gray-100 to-gray-300" />
            </div>
            {FLOAT_BADGES.map(badge => (
              <div
                key={badge.label}
                className={`absolute ${badge.pos} flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-lg text-xs font-bold whitespace-nowrap ${badge.colorClass}`}
              >
                <span>{badge.icon}</span>
                {badge.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
