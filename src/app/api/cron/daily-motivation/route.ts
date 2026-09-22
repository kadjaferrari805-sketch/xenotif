import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPushToUser } from '@/lib/push'
import { sendWebPushToUser } from '@/lib/web-push'
import { getDevicePushRecipients } from '@/lib/push-recipients'
import { getDailyPushContent } from '@/lib/daily-motivation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// 1er créneau quotidien (matin) : motivation. PUSH localisé (fr/en/de) à TOUS
// les appareils enregistrés (natif Expo + Web Push PWA), quel que soit
// l'abonnement. L'email quotidien (newsletter à thème tournant) part désormais
// du cron `daily-newsletter`.
export async function GET(request: Request) {
  // K8.9-04 — garde fail-closed. Sans le test sur `cronSecret`, une variable
  // absente faisait comparer à la chaîne « Bearer undefined », devinable.
  const cronSecret = process.env.CRON_SECRET
  const authHeader = request.headers.get('authorization')

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const recipients = await getDevicePushRecipients(supabase)
  if (recipients.length === 0) return NextResponse.json({ pushed: 0, devices: 0 })

  // K8.9-03 — le détail des échecs (identifiant + exception) reste côté serveur ;
  // la réponse ne porte plus qu'un compte.
  let pushed = 0
  let failed = 0
  for (const { userId, locale } of recipients) {
    const { title, body } = getDailyPushContent(locale)
    try {
      pushed += await sendPushToUser(userId, { title, body, data: { type: 'daily_motivation' } })
    } catch (e) {
      failed++
      console.error('[daily-motivation] push natif echoue :', userId, e)
    }
    try {
      pushed += await sendWebPushToUser(userId, { title, body, url: '/dashboard/notifications', tag: 'daily_motivation' })
    } catch (e) {
      failed++
      console.error('[daily-motivation] web push echoue :', userId, e)
    }
  }

  console.log(`[daily-motivation] push=${pushed} devices=${recipients.length} errors=${failed}`)
  return NextResponse.json({ pushed, devices: recipients.length, failed })
}
