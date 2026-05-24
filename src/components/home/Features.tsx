'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Activity, Dumbbell, Zap, Bike, Waves, Flame, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FEATURES } from '@/lib/constants'

const ICON_MAP: Record<string, React.ReactNode> = {
  running: <Activity size={18} />,
  dumbbell: <Dumbbell size={18} />,
  zap: <Zap size={18} />,
  bike: <Bike size={18} />,
  waves: <Waves size={18} />,
  flame: <Flame size={18} />,
}

const COLOR_MAP: Record<string, string> = {
  orange: 'text-sport-orange bg-sport-orange/20 border-sport-orange/30',
  blue: 'text-sport-blue bg-sport-blue/20 border-sport-blue/30',
  lime: 'text-sport-lime bg-sport-lime/20 border-sport-lime/30',
}

const TAG_MAP: Record<string, string> = {
  orange: 'bg-sport-orange text-white',
  blue: 'bg-sport-blue text-white',
  lime: 'bg-sport-lime text-[#0A0B0F]',
}

/* One Unsplash photo per discipline */
const DISC_PHOTOS: Record<string, string> = {
  'Running & Cardio':
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
  Musculation:
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
  HIIT: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80',
  Cyclisme:
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
  Natation:
    'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=600&q=80',
  CrossFit:
    'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=600&q=80',
}

export function Features() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section id="disciplines" className="py-20 px-6 bg-sport-dark">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Disciplines"
          title="6 disciplines. 1 plateforme."
          subtitle="Du cardio à la force — chaque sport, chaque niveau, chaque objectif"
        />
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-12">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
              className="bg-sport-card border border-sport-border rounded-2xl overflow-hidden group hover:border-sport-orange/50 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Sport image */}
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={DISC_PHOTOS[feat.title] ?? ''}
                  alt={feat.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sport-dark via-sport-dark/20 to-transparent" />
                {/* Icon + tag overlay */}
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${COLOR_MAP[feat.color]}`}
                  >
                    {ICON_MAP[feat.icon]}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${TAG_MAP[feat.color]}`}
                  >
                    {feat.tag}
                  </span>
                </div>
              </div>

              {/* Text content */}
              <div className="p-5">
                <h3 className="text-sm font-bold text-white mb-1.5">{feat.title}</h3>
                <p className="text-xs text-sport-gray leading-relaxed mb-4">{feat.description}</p>
                <Link
                  href={`/disciplines/${feat.slug}`}
                  className="flex items-center gap-1.5 text-xs font-bold text-sport-orange hover:gap-3 transition-all"
                >
                  Découvrir <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
