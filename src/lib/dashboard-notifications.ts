// Notifications in-app du dashboard = miroir des push réellement envoyées.
// Reconstruit les 5 notifications du jour à partir des mêmes sources que l'envoi
// (daily-motivation.ts + campaigns.ts), localisées. Aucune donnée à stocker :
// le contenu est déterministe (langue + jour de la semaine).

import { getDailyPushContent, getEveningPushContent } from '@/lib/daily-motivation'
import { getCampaignPush } from '@/lib/campaigns'

export type DashNotifIcon = 'flame' | 'shop' | 'book' | 'moon' | 'rocket'

export type DashNotif = {
  hour: number
  icon: DashNotifIcon
  color: string
  title: string
  body: string
  href: string
}

// Les 5 créneaux push/jour, dans l'ordre d'envoi : motivation 8h · boutique 12h
// · guide 15h · rappel 18h · abonnement 20h.
export function getDailyNotifications(locale: string | null | undefined, date: Date = new Date()): DashNotif[] {
  const mot = getDailyPushContent(locale, date)
  const eve = getEveningPushContent(locale, date)
  const boutique = getCampaignPush('boutique', locale)
  const guide = getCampaignPush('guide', locale)
  const sub = getCampaignPush('subscribe', locale)
  return [
    { hour: 8, icon: 'flame', color: '#FF4500', title: mot.title, body: mot.body, href: '/dashboard/programme' },
    { hour: 12, icon: 'shop', color: '#38bdf8', title: boutique.title, body: boutique.body, href: boutique.url },
    { hour: 15, icon: 'book', color: '#A3FF00', title: guide.title, body: guide.body, href: guide.url },
    { hour: 18, icon: 'moon', color: '#818cf8', title: eve.title, body: eve.body, href: '/dashboard' },
    { hour: 20, icon: 'rocket', color: '#FF4500', title: sub.title, body: sub.body, href: sub.url },
  ]
}

// Notifications déjà envoyées à l'heure courante (antéchronologique). Avant 8h,
// on renvoie tout le programme du jour pour ne pas laisser la liste vide.
export function getSentNotifications(locale: string | null | undefined, date: Date = new Date()): DashNotif[] {
  const all = getDailyNotifications(locale, date)
  const sent = all.filter((n) => n.hour <= date.getHours())
  return (sent.length ? sent : all).slice().reverse()
}
