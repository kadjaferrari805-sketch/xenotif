import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendWebPushToUser } from '@/lib/web-push'
import { sendPushToUser } from '@/lib/push'

export const runtime = 'nodejs'

const TEXT: Record<string, { title: string; body: string }> = {
  fr: { title: '🔔 Notification de test', body: 'Tout fonctionne ! Tu recevras tes rappels ici.' },
  en: { title: '🔔 Test notification', body: 'It works! You will get your reminders here.' },
  de: { title: '🔔 Test-Benachrichtigung', body: 'Es funktioniert! Du erhältst deine Erinnerungen hier.' },
}

// Envoie une notification de test Web Push à l'utilisateur connecté (vérification).
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  let locale = 'fr'
  try {
    const body = await req.json()
    if (typeof body?.locale === 'string' && TEXT[body.locale]) locale = body.locale
  } catch { /* corps optionnel */ }

  const t = TEXT[locale]
  // Envoie sur les deux canaux : Web Push (PWA) + push natif (app mobile Expo).
  const [webSent, nativeSent] = await Promise.all([
    sendWebPushToUser(user.id, {
      title: t.title,
      body: t.body,
      url: '/dashboard/notifications',
      tag: 'test',
    }),
    sendPushToUser(user.id, { title: t.title, body: t.body, data: { type: 'test' } }).catch(() => 0),
  ])
  return NextResponse.json({ ok: true, sent: webSent + nativeSent, web: webSent, native: nativeSent })
}
