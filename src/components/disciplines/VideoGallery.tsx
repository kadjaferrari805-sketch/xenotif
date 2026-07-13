'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Lock } from 'lucide-react'
import { VideoCard } from './VideoCard'

type Video = { youtubeIds: string[]; title: string; description: string; duration: string; level: string }

// Gating DUR par vidéo : on n'embed (lecteur YouTube) que les vidéos autorisées —
// PRO/essai, ou vidéo `min_plan === 'free'`. Les autres → carte cadenassée SANS lecteur
// (le contenu vidéo n'est pas dans le DOM → réellement non lisible).
export function VideoGallery({ videos, videoMinPlans, accentColor }: { videos: Video[]; videoMinPlans: string[]; accentColor: string }) {
  const t = useTranslations('disciplines')
  const [isPro, setIsPro] = useState(false)

  useEffect(() => {
    let alive = true
    fetch('/api/subscription')
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (alive) setIsPro(!!d && (d.status === 'active' || d.status === 'trialing')) })
      .catch(() => { /* non-abonné par défaut */ })
    return () => { alive = false }
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {videos.map((video, i) => {
        const unlocked = isPro || videoMinPlans[i] === 'free'
        if (unlocked) {
          return (
            <VideoCard
              key={video.youtubeIds[0] ?? i}
              youtubeIds={video.youtubeIds}
              title={video.title}
              description={video.description}
              duration={video.duration}
              level={video.level}
              accentColor={accentColor}
            />
          )
        }
        return (
          <div key={video.youtubeIds[0] ?? i} className="rounded-2xl overflow-hidden bg-sport-card border border-sport-border">
            <div className="relative w-full bg-sport-dark" style={{ paddingBottom: '56.25%' }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-4">
                <div className="w-12 h-12 rounded-2xl bg-sport-orange/15 border border-sport-orange/30 flex items-center justify-center">
                  <Lock size={20} className="text-sport-orange" aria-hidden="true" />
                </div>
                <p className="text-xs font-bold text-sport-fg">{t('videos.locked')}</p>
                <Link href="/#tarifs" className="text-[11px] font-bold text-sport-orange hover:underline">{t('gate.cta')}</Link>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-bold text-sport-fg mb-1.5 leading-snug">{video.title}</h3>
              <p className="text-xs text-sport-gray leading-relaxed line-clamp-2">{video.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
