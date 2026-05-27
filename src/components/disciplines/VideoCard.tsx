'use client'

import { useState, useEffect, useId } from 'react'
import { Play, Clock, BarChart2, VideoOff } from 'lucide-react'

interface VideoCardProps {
  youtubeIds: string[]
  title: string
  description: string
  duration: string
  level: string
  accentColor: string
}

export function VideoCard({ youtubeIds, title, description, duration, level, accentColor }: VideoCardProps) {
  const [playing, setPlaying] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [allFailed, setAllFailed] = useState(false)

  const uid = useId()
  const playerId = `yt${uid.replace(/[^a-z0-9]/gi, '')}`
  const currentId = youtubeIds[currentIdx] ?? youtubeIds[0]
  const mainThumb = `https://img.youtube.com/vi/${currentId}/maxresdefault.jpg`
  const fallbackThumb = `https://img.youtube.com/vi/${currentId}/hqdefault.jpg`

  // Reset img error when the active video ID changes
  useEffect(() => { setImgError(false) }, [currentIdx])

  // Listen for YouTube IFrame API errors — auto-switch to next backup ID
  useEffect(() => {
    if (!playing) return

    function onYTMessage(event: MessageEvent) {
      if (event.origin !== 'https://www.youtube.com') return
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
        if (String(data?.id) !== playerId) return  // ignore events from other players
        // 100 = video not found/private, 101/150 = embedding disabled
        if (data?.event === 'onError' && [100, 101, 150].includes(data?.info)) {
          if (currentIdx < youtubeIds.length - 1) {
            setCurrentIdx(prev => prev + 1)   // try next backup automatically
          } else {
            setAllFailed(true)                 // all IDs exhausted
          }
        }
      } catch { /* non-YouTube postMessage — ignore */ }
    }

    window.addEventListener('message', onYTMessage)
    return () => window.removeEventListener('message', onYTMessage)
  }, [playing, currentIdx, youtubeIds, playerId])

  const metaFooter = (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${accentColor}`}>
          <BarChart2 size={9} />
          {level}
        </span>
      </div>
      <h3 className="text-sm font-bold text-white mb-1.5 leading-snug">{title}</h3>
      <p className="text-xs text-sport-gray leading-relaxed line-clamp-2">{description}</p>
    </div>
  )

  if (allFailed) {
    return (
      <div className="rounded-2xl overflow-hidden bg-sport-card border border-sport-border">
        <div className="relative w-full bg-sport-dark" style={{ paddingBottom: '56.25%' }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-sport-gray">
            <VideoOff size={36} strokeWidth={1.5} />
            <p className="text-sm font-semibold">Vidéo non disponible</p>
          </div>
        </div>
        {metaFooter}
      </div>
    )
  }

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-sport-card border border-sport-border hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40">
      {playing ? (
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          {/* key forces iframe re-mount when backup ID changes */}
          <iframe
            key={currentId}
            id={playerId}
            src={`https://www.youtube.com/embed/${currentId}?autoplay=1&rel=0&modestbranding=1&color=white&enablejsapi=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full rounded-t-2xl"
            loading="lazy"
          />
        </div>
      ) : (
        <button
          onClick={() => setPlaying(true)}
          aria-label={`Lancer la vidéo : ${title}`}
          className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sport-orange"
        >
          <div className="relative w-full overflow-hidden bg-sport-dark" style={{ paddingBottom: '56.25%' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgError ? fallbackThumb : mainThumb}
              alt=""
              aria-hidden="true"
              onError={() => setImgError(true)}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-sport-orange flex items-center justify-center shadow-2xl shadow-sport-orange/50 group-hover:scale-110 group-hover:bg-orange-500 transition-all duration-300 ring-4 ring-white/20">
                <Play size={24} className="text-white ml-1" fill="white" />
              </div>
            </div>
            <div aria-hidden="true" className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/80 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
              <Clock size={10} />
              {duration}
            </div>
            <div aria-hidden="true" className="absolute top-3 right-3">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path fill="#FF0000" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1C4.5 20.4 12 20.4 12 20.4s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8z"/>
                <polygon fill="white" points="9.6,15.6 15.8,12 9.6,8.4"/>
              </svg>
            </div>
          </div>
        </button>
      )}
      {metaFooter}
    </div>
  )
}
