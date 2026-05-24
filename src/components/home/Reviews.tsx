'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { REVIEWS } from '@/lib/constants'

const AVATAR_MAP: Record<string, string> = {
  orange: 'bg-sport-orange text-white',
  blue: 'bg-sport-blue text-white',
  lime: 'bg-sport-lime text-[#0A0B0F]',
}

export function Reviews() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="py-20 px-6 bg-sport-card border-y border-sport-border">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Témoignages"
          title="Ils ont transformé leur corps"
          subtitle="Des milliers d'athlètes font confiance à Xenotif pour atteindre leurs objectifs"
        />
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="bg-sport-dark border border-sport-border rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${AVATAR_MAP[review.color] ?? 'bg-sport-orange text-white'}`}
                >
                  {review.initial}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{review.name}</p>
                  <p className="text-[10px] text-sport-gray">{review.sport}</p>
                </div>
                <span className="ml-auto text-[10px] text-sport-gray bg-sport-card border border-sport-border px-2 py-1 rounded-full whitespace-nowrap">
                  Membre vérifié
                </span>
              </div>

              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} size={12} className="fill-sport-orange text-sport-orange" />
                ))}
              </div>

              <p className="text-xs text-sport-gray leading-relaxed">{review.text}</p>
              <p className="text-[10px] text-sport-border mt-3">{review.date}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
