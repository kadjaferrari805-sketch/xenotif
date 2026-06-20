'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Bell, BellOff, Smartphone } from 'lucide-react'
import {
  webPushSupported,
  getWebPushSubscription,
  subscribeWebPush,
  unsubscribeWebPush,
} from '@/lib/web-push-client'

type State = 'loading' | 'unsupported' | 'on' | 'off' | 'denied'

// Carte d'activation des notifications Web Push (PWA) — sur cet appareil/navigateur.
export function PushToggle() {
  const t = useTranslations('dashboard.notifications.push')
  const [state, setState] = useState<State>('loading')
  const [busy, setBusy] = useState(false)

  /* eslint-disable react-hooks/set-state-in-effect --
     Détection des capacités navigateur (Notification/PushManager) et de l'état d'abonnement au montage. */
  useEffect(() => {
    if (!webPushSupported()) { setState('unsupported'); return }
    if (Notification.permission === 'denied') { setState('denied'); return }
    getWebPushSubscription().then((sub) => setState(sub ? 'on' : 'off'))
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  async function enable() {
    setBusy(true)
    const r = await subscribeWebPush()
    setState(r === 'subscribed' ? 'on' : r === 'denied' ? 'denied' : r === 'unsupported' ? 'unsupported' : 'off')
    setBusy(false)
  }

  async function disable() {
    setBusy(true)
    await unsubscribeWebPush()
    setState('off')
    setBusy(false)
  }

  // Rien à afficher tant qu'on charge ou si le navigateur ne supporte pas le Web Push.
  if (state === 'loading' || state === 'unsupported') return null

  return (
    <div className="rounded-2xl border border-sport-border bg-sport-card p-4 mb-6 flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sport-orange/15 border border-sport-orange/30 text-sport-orange">
        <Smartphone size={18} aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-white">{t('title')}</p>
        <p className="text-[11px] text-sport-gray leading-relaxed">
          {state === 'denied' ? t('denied') : state === 'on' ? t('onHint') : t('offHint')}
        </p>
      </div>
      {state === 'on' ? (
        <button
          onClick={disable}
          disabled={busy}
          aria-label={t('disable')}
          className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-sport-border text-white hover:border-sport-orange/50 disabled:opacity-60 transition-colors"
        >
          <BellOff size={14} aria-hidden="true" />
        </button>
      ) : state === 'off' ? (
        <button
          onClick={enable}
          disabled={busy}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-sport-orange px-3.5 py-2 text-xs font-bold text-white hover:bg-orange-600 disabled:opacity-60 transition-colors"
        >
          <Bell size={13} aria-hidden="true" /> {busy ? t('enabling') : t('enable')}
        </button>
      ) : null}
    </div>
  )
}
