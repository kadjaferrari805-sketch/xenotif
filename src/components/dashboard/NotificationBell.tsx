'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Bell, Flame, ShoppingBag, BookOpen, Moon, Rocket, X, ArrowRight } from 'lucide-react'
import { getSentNotifications, type DashNotifIcon } from '@/lib/dashboard-notifications'

const READ_KEY = 'xeno_notif_read'
const todayStr = () => new Date().toISOString().split('T')[0]

const ICONS: Record<DashNotifIcon, typeof Flame> = {
  flame: Flame, shop: ShoppingBag, book: BookOpen, moon: Moon, rocket: Rocket,
}

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

// Cloche de notifications de l'espace membre : miroir des push du jour réellement
// envoyées (motivation · boutique · guide · rappel · abonnement), localisées.
// État « lu » mémorisé en localStorage (point rouge tant que le jour n'est pas ouvert).
export function NotificationBell({ align = 'right' }: { align?: 'left' | 'right' }) {
  const t = useTranslations('dashboard.notifications')
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(false)
  const [now, setNow] = useState<Date | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  const items = now ? getSentNotifications(locale, now) : []
  const unreadCount = unread ? items.length : 0

  /* eslint-disable react-hooks/set-state-in-effect --
     Date du jour + état « lu » (localStorage) : lecture client uniquement, une fois au montage. */
  useEffect(() => {
    setNow(new Date())
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
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-sport-border text-sport-gray hover:text-sport-fg hover:border-sport-fg/20 transition-all"
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
            <p className="text-sm font-black text-sport-fg">{t('title')}</p>
            <button onClick={() => setOpen(false)} aria-label={t('close')} className="text-sport-gray hover:text-sport-fg transition-colors">
              <X size={15} aria-hidden="true" />
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {items.map((n, i) => {
              const Icon = ICONS[n.icon]
              return (
                <Link
                  key={i}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 rounded-xl px-3 py-3 hover:bg-sport-fg/5 transition-colors"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: `${n.color}1f`, border: `1px solid ${n.color}40` }}>
                    <Icon size={15} style={{ color: n.color }} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-sport-fg leading-snug">{n.title}</p>
                    <p className="text-[11px] text-sport-gray leading-snug mt-0.5 line-clamp-2">{n.body}</p>
                    <p className="text-[10px] text-sport-gray mt-1">{`${String(n.hour).padStart(2, '0')}:00 · ${t('today')}`}</p>
                  </div>
                </Link>
              )
            })}
          </div>
          <Link
            href="/dashboard/notifications"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1.5 border-t border-sport-border px-4 py-3 text-xs font-bold text-sport-orange hover:bg-sport-fg/5 transition-colors"
          >
            {t('viewAll')} <ArrowRight size={12} aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  )
}
