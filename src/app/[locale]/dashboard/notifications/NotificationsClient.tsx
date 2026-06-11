'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Bell, Flame, Lightbulb, Activity, Check, ChevronRight } from 'lucide-react'
import { PushToggle } from '@/components/dashboard/PushToggle'

const READ_KEY = 'xeno_notif_read'
const todayStr = () => new Date().toISOString().split('T')[0]

export function NotificationsClient() {
  const t = useTranslations('dashboard.notifications')
  const [day, setDay] = useState(0)
  const [read, setRead] = useState(false)

  /* eslint-disable react-hooks/set-state-in-effect --
     Date du jour + état « lu » (localStorage) : lecture client uniquement, une fois au montage. */
  useEffect(() => {
    setDay(Math.floor(Date.now() / 86400000))
    try { setRead(localStorage.getItem(READ_KEY) === todayStr()) } catch { /* ignore */ }
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  const motivations = t.raw('motivation') as string[]
  const tips = t.raw('tip') as string[]
  const items = [
    { Icon: Flame, color: '#FF4500', text: motivations[day % motivations.length], href: '/dashboard/programme' },
    { Icon: Lightbulb, color: '#A3FF00', text: tips[day % tips.length], href: '/dashboard/programme' },
    { Icon: Activity, color: '#38bdf8', text: t('activity'), href: '/dashboard' },
  ]

  function markAllRead() {
    try { localStorage.setItem(READ_KEY, todayStr()) } catch { /* ignore */ }
    setRead(true)
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto pb-24 md:pb-8">
      <div className="flex items-center justify-between gap-4 mb-2">
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
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
        {items.map((n, i) => (
          <Link
            key={i}
            href={n.href}
            className="flex items-center gap-4 rounded-2xl border border-sport-border bg-sport-card p-4 hover:border-sport-orange/40 transition-all group"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: `${n.color}1f`, border: `1px solid ${n.color}40` }}>
              <n.Icon size={18} style={{ color: n.color }} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-white leading-relaxed">{n.text}</p>
              <p className="text-[10px] text-sport-gray mt-1">{t('today')}</p>
            </div>
            <ChevronRight size={16} className="shrink-0 text-sport-gray group-hover:text-sport-orange transition-colors" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </div>
  )
}
