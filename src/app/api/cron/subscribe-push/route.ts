import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPushToUser } from '@/lib/push'
import { sendWebPushToUser } from '@/lib/web-push'
import { getDevicePushRecipients } from '@/lib/push-recipients'
import { getCampaignPush } from '@/lib/campaigns'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Créneau soirée : « passe à l'abonnement Pro ». PUSH localisé (fr/en/de),
// envoyé UNIQUEMENT aux non-abonnés (on ne sollicite pas ceux déjà actifs/essai).
export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const recipients = await getDevicePushRecipients(supabase)
  if (recipients.length === 0) return NextResponse.json({ pushed: 0, devices: 0 })

  // Exclure les abonnés actifs / en essai Stripe.
  const { data: subs } = await supabase
    .from('subscriptions')
    .select('user_id, status')
    .in('status', ['active', 'trialing'])
  const subscriberIds = new Set((subs ?? []).map((s: { user_id: string }) => s.user_id))
  const targets = recipients.filter((r) => !subscriberIds.has(r.userId))
  if (targets.length === 0) return NextResponse.json({ pushed: 0, devices: 0, skipped: recipients.length })

  let pushed = 0
  const errors: string[] = []
  for (const { userId, locale } of targets) {
    const { title, body, url, tag } = getCampaignPush('subscribe', locale)
    try { pushed += await sendPushToUser(userId, { title, body, data: { type: 'subscribe_daily', url } }) }
    catch (e) { errors.push(`push ${userId}: ${e}`) }
    try { pushed += await sendWebPushToUser(userId, { title, body, url, tag }) }
    catch (e) { errors.push(`webpush ${userId}: ${e}`) }
  }
  console.log(`[subscribe-push] push=${pushed} targets=${targets.length}/${recipients.length} errors=${errors.length}`)
  return NextResponse.json({ pushed, targets: targets.length, devices: recipients.length, errors })
}
