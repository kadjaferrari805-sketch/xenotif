'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Bell, Flame, ShoppingBag, BookOpen, Moon, Rocket, Check, ChevronRight } from 'lucide-react'
import { PushToggle } from '@/components/dashboard/PushToggle'
import { getSentNotifications, type DashNotifIcon } from '@/lib/dashboard-notifications'

const READ_KEY = 'xeno_notif_read'
const todayStr = () => new Date().toISOString().split('T')[0]

const ICONS: Record<DashNotifIcon, typeof Flame> = {
  flame: Flame, shop: ShoppingBag, book: BookOpen, moon: Moon, rocket: Rocket,
}

export function NotificationsClient() {
  const t = useTranslations('dashboard.notifications')
  const locale = useLocale()
  const [now, setNow] = useState<Date | null>(null)
  const [read, setRead] = useState(false)

  /* eslint-disable react-hooks/set-state-in-effect --
     Date du jour + état « lu » (localStorage) : lecture client uniquement, au montage.
     Le contenu dépend de la date → rendu de la liste après montage (pas de mismatch). */
  useEffect(() => {
    setNow(new Date())
    try { setRead(localStorage.getItem(READ_KEY) === todayStr()) } catch { /* ignore */ }
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  function markAllRead() {
    try { localStorage.setItem(READ_KEY, todayStr()) } catch { /* ignore */ }
    setRead(true)
  }

  const items = now ? getSentNotifications(locale, now) : []

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto pb-24 md:pb-8">
      <div className="flex items-center justify-between gap-4 mb-2">
        <h1 className="text-2xl font-black text-sport-fg flex items-center gap-2.5">
          <Bell size={22} className="text-sport-orange" aria-hidden="true" /> {t('title')}
        </h1>
        <button
          onClick={markAllRead}
          disabled={read}
          className="text-xs font-bold text-sport-orange hover:underline disabled:text-sport-gray disabled:no-underline disabled:cursor-default inline-flex items-center gap-1.5"
        >
          {read ? <><Check size={13} aria-hidden="true" /> {t('allRead')}</> : t('markAllRead')}
        </button>
      </div>
      <p className="text-sport-gray text-sm mb-6">{t('pageSubtitle')}</p>

      <PushToggle />

      <div className="space-y-3">
        {items.map((n, i) => {
          const Icon = ICONS[n.icon]
          return (
            <Link
              key={i}
              href={n.href}
              className="flex items-center gap-4 rounded-2xl border border-sport-border bg-sport-card p-4 hover:border-sport-orange/40 transition-all group"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: `${n.color}1f`, border: `1px solid ${n.color}40` }}>
                <Icon size={18} style={{ color: n.color }} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-sport-fg leading-snug">{n.title}</p>
                <p className="text-xs text-sport-gray leading-relaxed mt-0.5">{n.body}</p>
                <p className="text-[10px] text-sport-gray mt-1.5">{`${String(n.hour).padStart(2, '0')}:00 · ${t('today')}`}</p>
              </div>
              <ChevronRight size={16} className="shrink-0 text-sport-gray group-hover:text-sport-orange transition-colors" aria-hidden="true" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
