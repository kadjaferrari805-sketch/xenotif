'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Bell, Flame, Lightbulb, Activity, X, ArrowRight } from 'lucide-react'

const READ_KEY = 'xeno_notif_read'
const todayStr = () => new Date().toISOString().split('T')[0]

// 3 notifications quotidiennes (motivation + astuce + rappel d'activité).
// Garder synchro avec le tableau `items` ci-dessous.
const DAILY_NOTIF_COUNT = 3

// Badge compteur sur l'icône de l'app installée (PWA Badging API) → visible sur
// l'écran d'accueil mobile. No-op silencieux si non supporté (best-effort iOS 16.4+/Android).
function syncAppBadge(count: number) {
  try {
    const nav = navigator as Navigator & {
      setAppBadge?: (n?: number) => Promise<void>
      clearAppBadge?: () => Promise<void>
    }
    if (count > 0) nav.setAppBadge?.(count)?.catch(() => {})
    else nav.clearAppBadge?.()?.catch(() => {})
  } catch { /* ignore */ }
}

// Cloche de notifications de l'espace membre : 3 notifications par jour
// (motivation + astuce qui tournent chaque jour + rappel d'activité).
// État « lu » mémorisé en localStorage (point rouge tant que le jour n'est pas ouvert).
export function NotificationBell({ align = 'right' }: { align?: 'left' | 'right' }) {
  const t = useTranslations('dashboard.notifications')
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(false)
  const [day, setDay] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  const motivations = t.raw('motivation') as string[]
  const tips = t.raw('tip') as string[]
  const items = [
    { Icon: Flame, color: '#FF4500', text: motivations[day % motivations.length], href: '/dashboard/programme' },
    { Icon: Lightbulb, color: '#A3FF00', text: tips[day % tips.length], href: '/dashboard/programme' },
    { Icon: Activity, color: '#38bdf8', text: t('activity'), href: '/dashboard' },
  ]
  const unreadCount = unread ? DAILY_NOTIF_COUNT : 0

  /* eslint-disable react-hooks/set-state-in-effect --
     Date du jour + état « lu » (localStorage) : lecture client uniquement, une fois au montage. */
  useEffect(() => {
    setDay(Math.floor(Date.now() / 86400000))
    try { setUnread(localStorage.getItem(READ_KEY) !== todayStr()) } catch { setUnread(true) }
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey) }
  }, [open])

  function toggle() {
    const next = !open
    setOpen(next)
    if (next) {
      try { localStorage.setItem(READ_KEY, todayStr()) } catch { /* ignore */ }
      setUnread(false)
      // Lu → efface le badge de l'icône (clear immédiat + reset du compteur tenu par le SW).
      syncAppBadge(0)
      try { navigator.serviceWorker?.controller?.postMessage('xeno-clear-badge') } catch { /* ignore */ }
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        aria-label={unreadCount > 0 ? `${t('aria')} (${unreadCount})` : t('aria')}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-sport-border text-sport-gray hover:text-white hover:border-white/20 transition-all"
      >
        <Bell size={16} aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-sport-orange px-1 text-[10px] font-black leading-none text-white ring-2 ring-sport-card"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={t('title')}
          className={`absolute ${align === 'left' ? 'left-0' : 'right-0'} mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-sport-border bg-sport-card shadow-2xl z-50 overflow-hidden`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-sport-border">
            <p className="text-sm font-black text-white">{t('title')}</p>
            <button onClick={() => setOpen(false)} aria-label={t('close')} className="text-sport-gray hover:text-white transition-colors">
              <X size={15} aria-hidden="true" />
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {items.map((n, i) => (
              <Link
                key={i}
                href={n.href}
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 rounded-xl px-3 py-3 hover:bg-white/5 transition-colors"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: `${n.color}1f`, border: `1px solid ${n.color}40` }}>
                  <n.Icon size={15} style={{ color: n.color }} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-white leading-relaxed">{n.text}</p>
                  <p className="text-[10px] text-sport-gray mt-1">{t('today')}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/dashboard/notifications"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1.5 border-t border-sport-border px-4 py-3 text-xs font-bold text-sport-orange hover:bg-white/5 transition-colors"
          >
            {t('viewAll')} <ArrowRight size={12} aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  )
}
