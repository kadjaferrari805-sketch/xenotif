'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, Quote } from 'lucide-react'
import Image from 'next/image'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { REVIEWS } from '@/lib/constants'

const AVATAR_PHOTOS: Record<string, string> = {
  'Thomas D.':
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&crop=faces&w=120&h=120&q=80',
  'Leila M.':
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&crop=faces&w=120&h=120&q=80',
  'Nicolas R.':
    'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&crop=faces&w=120&h=120&q=80',
}

const AVATAR_BG: Record<string, string> = {
  orange: 'bg-sport-orange text-white',
  blue: 'bg-sport-blue text-white',
  lime: 'bg-sport-lime text-[#0A0B0F]',
}

function Avatar({ name, initial, color }: { name: string; initial: string; color: string }) {
  const [error, setError] = useState(false)
  const photo = AVATAR_PHOTOS[name]

  if (!photo || error) {
    return (
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${AVATAR_BG[color] ?? 'bg-sport-orange text-white'}`}
      >
        {initial}
      </div>
    )
  }

  return (
    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-sport-border">
      <Image
        src={photo}
        alt={name}
        fill
        sizes="48px"
        className="object-cover"
        onError={() => setError(true)}
      />
    </div>
  )
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
              className="bg-sport-dark border border-sport-border rounded-2xl p-6 flex flex-col"
            >
              {/* Quote icon */}
              <Quote size={28} className="text-sport-orange/30 mb-4 shrink-0" />

              {/* Review text */}
              <p className="text-sm text-sport-gray leading-relaxed flex-1 mb-5">{review.text}</p>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} size={13} className="fill-sport-orange text-sport-orange" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-sport-border">
                <Avatar name={review.name} initial={review.initial} color={review.color} />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white">{review.name}</p>
                  <p className="text-[10px] text-sport-gray truncate">{review.sport}</p>
                </div>
                <span className="ml-auto text-[10px] text-sport-gray bg-sport-card border border-sport-border px-2 py-1 rounded-full whitespace-nowrap shrink-0">
                  Membre vérifié
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
