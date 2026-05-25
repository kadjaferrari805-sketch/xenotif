'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Activity, Dumbbell, Zap, Bike, Waves, Flame, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FEATURES } from '@/lib/constants'

const ICON_MAP: Record<string, React.ReactNode> = {
  running: <Activity size={18} aria-hidden="true" />,
  dumbbell: <Dumbbell size={18} aria-hidden="true" />,
  zap: <Zap size={18} aria-hidden="true" />,
  bike: <Bike size={18} aria-hidden="true" />,
  waves: <Waves size={18} aria-hidden="true" />,
  flame: <Flame size={18} aria-hidden="true" />,
}

const COLOR_ICON: Record<string, string> = {
  orange: 'text-sport-orange bg-sport-orange/15 border-sport-orange/25',
  blue: 'text-sport-blue bg-sport-blue/15 border-sport-blue/25',
  lime: 'text-sport-lime bg-sport-lime/15 border-sport-lime/25',
}

const COLOR_TAG: Record<string, string> = {
  orange: 'bg-sport-orange text-white',
  blue: 'bg-sport-blue text-white',
  lime: 'bg-sport-lime text-[#0A0B0F]',
}

const DISC_PHOTOS: Record<string, string> = {
  'Running & Cardio': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
  Musculation: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
  HIIT: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80',
  Cyclisme: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
  Natation: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=600&q=80',
  CrossFit: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=600&q=80',
}

export function Features() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section id="disciplines" aria-labelledby="disciplines-title" className="py-24 px-6 bg-sport-dark">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          id="disciplines-title"
          label="Disciplines"
          title="6 disciplines. 1 plateforme."
          subtitle="Du cardio à la force — chaque sport, chaque niveau, chaque objectif"
        />
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-14">
          {FEATURES.map((feat, i) => (
            <motion.article
              key={feat.title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="card-base overflow-hidden group hover:border-sport-orange/50 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Sport image */}
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={DISC_PHOTOS[feat.title] ?? ''}
                  alt={`Discipline ${feat.title}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-sport-dark via-sport-dark/20 to-transparent" />
                {/* Icon + tag */}
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${COLOR_ICON[feat.color]}`}>
                    {ICON_MAP[feat.icon]}
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${COLOR_TAG[feat.color]}`}>
                    {feat.tag}
                  </span>
                </div>
              </div>

              {/* Text content */}
              <div className="p-5">
                <h3 className="text-sm font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-sport-gray leading-relaxed mb-4">{feat.description}</p>

                {/* Stats */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {feat.stats.map((s) => (
                    <span key={s} className="text-[10px] text-sport-gray bg-sport-dark border border-sport-border px-2 py-1 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/disciplines/${feat.slug}`}
                  aria-label={`Découvrir la discipline ${feat.title}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-sport-orange hover:gap-3 transition-all"
                >
                  Découvrir <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
