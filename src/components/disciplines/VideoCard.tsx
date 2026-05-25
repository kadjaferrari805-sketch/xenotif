'use client'

import { useState } from 'react'
import { Play, Clock, BarChart2, Volume2 } from 'lucide-react'

interface VideoCardProps {
  youtubeId: string
  title: string
  description: string
  duration: string
  level: string
  thumbnail: string
  accentColor: string
}

export function VideoCard({ youtubeId, title, description, duration, level, thumbnail, accentColor }: VideoCardProps) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-sport-card border border-sport-border hover:border-sport-border/60 transition-all hover:-translate-y-1 hover:shadow-2xl">
      {playing ? (
        <div className="relative aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            loading="lazy"
          />
        </div>
      ) : (
        <button
          onClick={() => setPlaying(true)}
          aria-label={`Lancer la vidéo : ${title}`}
          className="block w-full text-left"
        >
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Play button */}
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className={`w-16 h-16 rounded-full bg-sport-orange/90 backdrop-blur-sm flex items-center justify-center shadow-2xl shadow-sport-orange/40 group-hover:scale-110 group-hover:bg-sport-orange transition-all duration-300`}>
                <Play size={26} className="text-white ml-1" fill="white" />
              </div>
            </div>

            {/* Duration badge */}
            <div
              aria-hidden="true"
              className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full"
            >
              <Clock size={10} />
              {duration}
            </div>

            {/* Volume icon top right */}
            <div aria-hidden="true" className="absolute top-3 right-3">
              <Volume2 size={14} className="text-white/50" />
            </div>
          </div>
        </button>
      )}

      {/* Metadata */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${accentColor}`}>
            <BarChart2 size={9} />
            {level}
          </span>
        </div>
        <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{title}</h3>
        <p className="text-xs text-sport-gray line-clamp-2">{description}</p>
      </div>
    </div>
  )
}
