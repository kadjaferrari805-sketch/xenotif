'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot } from 'lucide-react'

const NOTIFICATIONS = [
  { name: 'Mathieu', city: 'Lyon', action: 'vient de commencer Running Pro', emoji: '🏃', time: 'il y a 2 min' },
  { name: 'Sarah', city: 'Paris', action: 'a terminé son 1er programme HIIT', emoji: '⚡', time: 'il y a 4 min' },
  { name: 'Thomas', city: 'Bordeaux', action: 'a perdu 8 kg en 2 mois', emoji: '🔥', time: 'il y a 6 min' },
  { name: 'Léa', city: 'Marseille', action: 'vient de rejoindre la communauté', emoji: '💪', time: 'il y a 9 min' },
  { name: 'Antoine', city: 'Lille', action: 'a battu son record personnel', emoji: '🏆', time: 'il y a 11 min' },
  { name: 'Emma', city: 'Nantes', action: "s'est abonnée au plan Élite", emoji: '⭐', time: 'il y a 14 min' },
  { name: 'Julien', city: 'Strasbourg', action: 'a rejoint le challenge CrossFit', emoji: '🔥', time: 'il y a 17 min' },
]

export function LiveNotification() {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 4000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!visible) return
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrent((c) => (c + 1) % NOTIFICATIONS.length)
        setVisible(true)
      }, 700)
    }, 9000)
    return () => clearInterval(interval)
  }, [visible])

  const notif = NOTIFICATIONS[current]

  return (
    <div className="fixed bottom-20 left-4 z-50 pointer-events-none" aria-hidden="true">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: -24, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="flex items-center gap-3 bg-sport-card/95 backdrop-blur-md border border-sport-border rounded-2xl px-4 py-3 shadow-2xl shadow-black/50 max-w-[260px]"
          >
            <div className="w-10 h-10 rounded-xl bg-sport-orange/10 border border-sport-orange/20 flex items-center justify-center text-lg shrink-0">
              {notif.emoji}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white leading-tight">
                {notif.name}{' '}
                <span className="text-sport-gray font-normal">· {notif.city}</span>
              </p>
              <p className="text-[10px] text-sport-gray mt-0.5 leading-tight">{notif.action}</p>
              <p className="text-[9px] text-emerald-400 mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                {notif.time}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
