'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Smartphone, Download, Check, Share } from 'lucide-react'

// Événement non standard `beforeinstallprompt` (Chrome / Android / desktop).
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type Platform = 'ios' | 'android' | 'desktop'

// Carte d'enrobage déclarée au niveau module (pas de composant créé pendant le rendu).
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-sport-dark flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-3xl border border-sport-border bg-sport-card p-8 text-center shadow-2xl">
        {children}
      </div>
    </div>
  )
}

// Page d'installation atterrie depuis le QR code. Sur Android/Chrome : install
// en 1 tap (invite native). Sur iPhone : guide « Ajouter à l'écran d'accueil ».
// Sur desktop : QR à scanner. Si déjà installée : raccourci vers l'espace.
export function AppInstall() {
  const t = useTranslations('common.appDownload')
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)
  const [done, setDone] = useState(false)
  const [platform, setPlatform] = useState<Platform>('desktop')

  /* eslint-disable react-hooks/set-state-in-effect --
     Détection PWA/plateforme via des APIs navigateur disponibles uniquement après le montage. */
  useEffect(() => {
    const nav = window.navigator as Navigator & { standalone?: boolean }
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true
    if (standalone) { setInstalled(true); return }

    const ua = nav.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(ua)) setPlatform('ios')
    else if (/android/.test(ua)) setPlatform('android')
    else setPlatform('desktop')

    const onPrompt = (e: Event) => { e.preventDefault(); setDeferred(e as BeforeInstallPromptEvent) }
    const onInstalled = () => setDone(true)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  async function handleInstall() {
    if (!deferred) return
    await deferred.prompt()
    const res = await deferred.userChoice
    if (res.outcome === 'accepted') setDone(true)
    setDeferred(null)
  }

  // ── Déjà installée / installation lancée ──
  if (installed || done) {
    return (
      <Card>
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30">
          <Check size={28} className="text-emerald-400" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">
          {installed ? t('installedTitle') : t('successTitle')}
        </h1>
        <p className="text-sport-gray text-sm leading-relaxed mb-6">{t('subtitle')}</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 bg-sport-orange text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-sport-orange/25"
        >
          {t('openApp')}
        </Link>
      </Card>
    )
  }

  return (
    <Card>
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-sport-orange/15 border border-sport-orange/30">
        <Smartphone size={26} className="text-sport-orange" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-black text-white mb-2">{t('title')}</h1>
      <p className="text-sport-gray text-sm leading-relaxed mb-7">{t('subtitle')}</p>

      {/* Android / Chrome : invite native disponible → install en 1 tap */}
      {deferred ? (
        <>
          <button
            type="button"
            onClick={handleInstall}
            className="w-full inline-flex items-center justify-center gap-2 bg-sport-orange text-white px-6 py-4 rounded-2xl font-black text-base hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-sport-orange/30"
          >
            <Download size={18} aria-hidden="true" />
            {t('installNow')}
          </button>
          <p className="text-[11px] text-sport-gray mt-3">{t('androidStep')}</p>
        </>
      ) : platform === 'ios' ? (
        /* iPhone : pas d'API d'installation → guide Partager → écran d'accueil */
        <div className="rounded-2xl border border-sport-border bg-sport-dark/50 p-5 text-left">
          <p className="flex items-center gap-2 text-sm font-bold text-white mb-2">
            <Share size={16} className="text-sport-orange" aria-hidden="true" /> {t('iosTitle')}
          </p>
          <p className="text-sm text-sport-gray leading-relaxed">{t('iosStep')}</p>
        </div>
      ) : platform === 'android' ? (
        /* Android sans invite (selon le navigateur) → instructions menu */
        <div className="rounded-2xl border border-sport-border bg-sport-dark/50 p-5 text-left">
          <p className="text-sm font-bold text-white mb-2">{t('androidTitle')}</p>
          <p className="text-sm text-sport-gray leading-relaxed">{t('androidStep')}</p>
        </div>
      ) : (
        /* Desktop : montrer le QR à scanner */
        <>
          <div className="mx-auto mb-3 w-44 h-44 rounded-2xl bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/app-qr.svg" alt={t('qrAlt')} width={176} height={176} className="h-full w-full" />
          </div>
          <p className="text-xs text-sport-gray leading-relaxed">{t('desktopHint')}</p>
        </>
      )}
    </Card>
  )
}
