'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Smartphone, X, Download } from 'lucide-react'

// Événement non standard `beforeinstallprompt` (Chrome/Android/desktop).
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface AppDownloadProps {
  triggerClassName?: string
  /** Si fourni, remplace le libellé par défaut du bouton. */
  label?: string
  /** Classes appliquées au libellé (ex. `hidden xl:inline` pour un bouton compact). */
  labelClassName?: string
  /** Taille de l'icône du bouton. */
  iconSize?: number
}

export function AppDownload({ triggerClassName, label, labelClassName, iconSize = 14 }: AppDownloadProps) {
  const t = useTranslations('common.appDownload')
  const [open, setOpen] = useState(false)
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)

  // Capte l'invite d'installation native (Android/Chrome desktop) si disponible.
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  // Échap pour fermer + verrou du scroll quand la modale est ouverte.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  async function handleInstall() {
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={label ?? t('trigger')}
        className={triggerClassName ?? 'inline-flex items-center gap-1.5 text-sm text-sport-gray hover:text-sport-fg transition-colors'}
      >
        <Smartphone size={iconSize} aria-hidden="true" />
        <span className={labelClassName}>{label ?? t('trigger')}</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t('title')}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-sm rounded-3xl border border-sport-border bg-sport-card p-6 sm:p-8 text-center shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t('close')}
              className="absolute right-4 top-4 text-sport-gray hover:text-sport-fg transition-colors p-1"
            >
              <X size={18} aria-hidden="true" />
            </button>

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sport-orange/15 border border-sport-orange/30">
              <Smartphone size={22} className="text-sport-orange" aria-hidden="true" />
            </div>

            <h2 className="text-xl font-black text-sport-fg mb-2">{t('title')}</h2>
            <p className="text-sport-gray text-sm leading-relaxed mb-6">{t('subtitle')}</p>

            {/* QR code (statique) — à scanner avec le téléphone */}
            <div className="mx-auto mb-3 w-44 h-44 rounded-2xl bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/app-qr.svg" alt={t('qrAlt')} width={176} height={176} className="h-full w-full" />
            </div>
            <p className="text-xs font-semibold text-sport-fg mb-6">{t('scan')}</p>

            {/* Invite d'installation native si dispo (Android / Chrome desktop) */}
            {deferred && (
              <button
                type="button"
                onClick={handleInstall}
                className="w-full mb-5 inline-flex items-center justify-center gap-2 bg-sport-orange text-white px-5 py-3 rounded-full font-bold text-sm hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-sport-orange/25"
              >
                <Download size={15} aria-hidden="true" />
                {t('installNow')}
              </button>
            )}

            {/* Instructions par plateforme */}
            <div className="space-y-2 text-left rounded-2xl border border-sport-border bg-sport-dark/50 p-4">
              <p className="text-xs text-sport-gray leading-relaxed">
                <span className="font-bold text-sport-fg">{t('iosTitle')}</span> — {t('iosStep')}
              </p>
              <p className="text-xs text-sport-gray leading-relaxed">
                <span className="font-bold text-sport-fg">{t('androidTitle')}</span> — {t('androidStep')}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
