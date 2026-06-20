import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPushToUser } from '@/lib/push'
import { sendWebPushToUser } from '@/lib/web-push'
import { getDevicePushRecipients } from '@/lib/push-recipients'
import { getEveningPushContent } from '@/lib/daily-motivation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// 2ᵉ créneau quotidien : rappel du soir, PUSH uniquement (pas de 2ᵉ email),
// envoyé à TOUS les appareils enregistrés (natif Expo + Web Push PWA), quel que
// soit l'abonnement. Contenu localisé qui change chaque jour.
export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const recipients = await getDevicePushRecipients(supabase)

  if (recipients.length === 0) {
    return NextResponse.json({ pushed: 0, devices: 0 })
  }

  let pushed = 0
  const errors: string[] = []

  for (const { userId, locale } of recipients) {
    const { title, body } = getEveningPushContent(locale)
    try {
      pushed += await sendPushToUser(userId, {
        title,
        body,
        data: { type: 'evening_reminder' },
      })
    } catch (e) {
      errors.push(`push ${userId}: ${e}`)
    }
    try {
      pushed += await sendWebPushToUser(userId, {
        title,
        body,
        url: '/dashboard/notifications',
        tag: 'evening_reminder',
      })
    } catch (e) {
      errors.push(`webpush ${userId}: ${e}`)
    }
  }

  console.log(`[evening-reminder] push=${pushed} devices=${recipients.length} errors=${errors.length}`)
  return NextResponse.json({ pushed, devices: recipients.length, errors })
}
