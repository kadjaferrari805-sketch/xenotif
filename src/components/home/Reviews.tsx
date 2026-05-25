'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, Quote, CheckCircle } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { REVIEWS } from '@/lib/constants'

const AVATAR_BG: Record<string, string> = {
  orange: 'bg-sport-orange',
  blue: 'bg-sport-blue',
  lime: 'bg-sport-lime text-[#0A0B0F]',
}

export function Reviews() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section aria-labelledby="avis-title" className="py-24 px-6 bg-sport-dark">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          id="avis-title"
          label="Témoignages"
          title="Ils ont transformé leur corps"
          subtitle="Des milliers d'athlètes font confiance à Xenotif® pour atteindre leurs objectifs"
        />

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14">
          {REVIEWS.map((review, i) => (
            <motion.article
              key={review.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="card-base p-6 flex flex-col hover:border-sport-border/60 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4" aria-label={`Note : ${review.rating} étoiles sur 5`}>
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} size={13} aria-hidden="true" className="fill-sport-orange text-sport-orange" />
                ))}
              </div>

              {/* Quote icon */}
              <Quote size={24} aria-hidden="true" className="text-sport-orange/25 mb-3 shrink-0" />

              {/* Review text */}
              <blockquote className="text-sm text-sport-gray leading-relaxed flex-1 mb-6">
                {review.text}
              </blockquote>

              {/* Author */}
              <footer className="flex items-center gap-3 pt-5 border-t border-sport-border">
                {/* Avatar with initials */}
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-sm shrink-0 text-white ${AVATAR_BG[review.color] ?? 'bg-sport-orange'}`}
                  aria-hidden="true"
                >
                  {review.initial}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white leading-tight">{review.name}</p>
                  <p className="text-[10px] text-sport-gray mt-0.5">{review.sport}</p>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold shrink-0">
                  <CheckCircle size={11} aria-hidden="true" />
                  Vérifié
                </div>
              </footer>
            </motion.article>
          ))}
        </div>

        {/* Global rating */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10"
        >
          <div className="flex gap-0.5" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} className="fill-sport-orange text-sport-orange" />
            ))}
          </div>
          <p className="text-sm text-sport-gray">
            <strong className="text-white">4.9 / 5</strong> basé sur{' '}
            <strong className="text-white">3 200+</strong> avis vérifiés
          </p>
        </motion.div>
      </div>
    </section>
  )
}
