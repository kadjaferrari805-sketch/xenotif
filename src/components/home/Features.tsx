'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useInView } from 'react-intersection-observer'
import { Activity, Dumbbell, Zap, Bike, Waves, Flame, ArrowRight, Leaf, Target, Layers, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Tilt3D } from '@/components/premium/Tilt3D'
import { FEATURES } from '@/lib/constants'

type FeatureText = { title: string; description: string; tag: string; stats: string[] }

const ICON_MAP: Record<string, React.ReactNode> = {
  running:  <Activity size={18} aria-hidden="true" />,
  dumbbell: <Dumbbell size={18} aria-hidden="true" />,
  zap:      <Zap size={18} aria-hidden="true" />,
  bike:     <Bike size={18} aria-hidden="true" />,
  waves:    <Waves size={18} aria-hidden="true" />,
  flame:    <Flame size={18} aria-hidden="true" />,
  leaf:     <Leaf size={18} aria-hidden="true" />,
  target:   <Target size={18} aria-hidden="true" />,
  layers:   <Layers size={18} aria-hidden="true" />,
}

const ACCENT: Record<string, { icon: string; tag: string; glow: string; border: string }> = {
  orange: { icon: 'text-sport-orange bg-sport-orange/15 border-sport-orange/25', tag: 'bg-sport-orange text-white',         glow: 'hover:shadow-sport-orange/20', border: 'hover:border-sport-orange/50' },
  blue:   { icon: 'text-sport-blue bg-sport-blue/15 border-sport-blue/25',       tag: 'bg-sport-blue text-white',           glow: 'hover:shadow-sport-blue/20',   border: 'hover:border-sport-blue/50' },
  lime:   { icon: 'text-sport-lime bg-sport-lime/15 border-sport-lime/25',        tag: 'bg-sport-lime text-[#0A0B0F]',       glow: 'hover:shadow-sport-lime/15',   border: 'hover:border-sport-lime/50' },
}

const DISC_PHOTOS: Record<string, string> = {
  'Running & Cardio': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
  Musculation:        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
  HIIT:               'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80',
  Cyclisme:           'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
  Natation:           'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=600&q=80',
  CrossFit:           'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=600&q=80',
  Yoga:               'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
  Boxe:               'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=600&q=80',
  Stretching:         'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
  Nutrition:          'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80',
}

export function Features() {
  const t = useTranslations('home.features')
  const items = t.raw('items') as FeatureText[]
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  // Carrousel horizontal : flèches desktop (swipe natif sur mobile).
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollByDir = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  return (
    <section id="disciplines" aria-labelledby="disciplines-title" className="py-24 px-6 bg-sport-dark">
      <div ref={ref} className="max-w-6xl mx-auto">
        <SectionHeader
          id="disciplines-title"
          label={t('label')}
          title={t('title')}
          subtitle={t('subtitle')}
        />

        <div className="relative mt-14">
          {/* Flèches de navigation (desktop) */}
          <button
            type="button"
            onClick={() => scrollByDir(-1)}
            aria-label={t('prevAria')}
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-sport-card border border-sport-border text-white shadow-lg transition-all hover:border-sport-orange/60 hover:text-sport-orange active:scale-95"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollByDir(1)}
            aria-label={t('nextAria')}
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-sport-card border border-sport-border text-white shadow-lg transition-all hover:border-sport-orange/60 hover:text-sport-orange active:scale-95"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>

          {/* Piste défilante horizontale (swipe mobile · flèches desktop) */}
          <div ref={scrollRef} className="disc-scroll flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4">
          {FEATURES.map((feat, i) => {
            const accent = ACCENT[feat.color]
            const tr = items[i]
            return (
              <motion.article
                key={feat.title}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className="snap-start shrink-0 w-[280px] sm:w-[300px]"
              >
                <Tilt3D
                  max={14}
                  className={`card-base overflow-hidden group relative block transition-shadow duration-300 hover:shadow-2xl ${accent.glow} ${accent.border}`}
                >
                {/* Sport image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={DISC_PHOTOS[feat.title] ?? ''}
                    alt={`Discipline ${tr.title}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  {/* Dark gradient */}
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-sport-dark via-sport-dark/30 to-transparent" />
                  {/* Top label */}
                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${accent.tag}`}>
                      {tr.tag}
                    </span>
                  </div>
                  {/* Bottom icon */}
                  <div className="absolute bottom-3 left-4">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${accent.icon}`}>
                      {ICON_MAP[feat.icon]}
                    </div>
                  </div>
                </div>

                {/* Text content */}
                <div className="p-5">
                  <h3 className="text-sm font-bold text-white mb-2 group-hover:text-white transition-colors">{tr.title}</h3>
                  <p className="text-xs text-sport-gray leading-relaxed mb-4">{tr.description}</p>

                  {/* Stats chips */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tr.stats.map((s) => (
                      <span key={s} className="text-[10px] text-sport-gray bg-sport-dark border border-sport-border px-2.5 py-1 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/disciplines/${feat.slug}`}
                    aria-label={t('discoverAria', { name: tr.title })}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sport-orange group-hover:gap-2.5 transition-all duration-200"
                  >
                    {t('discover')} <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                </div>
                </Tilt3D>
              </motion.article>
            )
          })}
          </div>
        </div>
      </div>
    </section>
  )
}
