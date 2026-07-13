'use client'

import { useTranslations } from 'next-intl'
import { useInView } from 'react-intersection-observer'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'

// Bande vidéo pleine largeur (créative de marque « coureur »). La vidéo n'est
// montée qu'à l'approche du viewport (perf) ; poster en repli avant.
export function VideoBand() {
  const t = useTranslations('home.videoBand')
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '300px' })

  return (
    <section
      ref={ref}
      aria-label={t('title')}
      className="relative h-[75vh] min-h-[440px] overflow-hidden flex items-center justify-center bg-sport-dark"
    >
      {inView ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/home/runner-poster.jpg"
        >
          <source src="/home/runner.mp4" type="video/mp4" />
        </video>
      ) : (
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/home/runner-poster.jpg)' }} />
      )}

      {/* Overlay pour lisibilité + fondu avec les sections sombres */}
      <div className="absolute inset-0 bg-gradient-to-t from-sport-dark via-sport-dark/45 to-sport-dark/75" />

      <div className="relative z-10 text-center px-6 max-w-3xl">
        <p className="text-[11px] font-black tracking-[3px] uppercase text-sport-orange mb-4">{t('eyebrow')}</p>
        <h2 className="text-3xl md:text-6xl font-black text-sport-fg leading-tight mb-5 drop-shadow-lg">{t('title')}</h2>
        <p className="text-lg text-sport-fg/85 mb-8 max-w-xl mx-auto drop-shadow">{t('subtitle')}</p>
        <Link
          href="/auth/signup?plan=pro"
          className="inline-flex items-center gap-2 bg-sport-orange text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-orange-600 active:scale-95 transition-all shadow-xl shadow-sport-orange/30"
        >
          {t('cta')} <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
