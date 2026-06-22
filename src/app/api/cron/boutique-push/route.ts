import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPushToUser } from '@/lib/push'
import { sendWebPushToUser } from '@/lib/web-push'
import { getDevicePushRecipients } from '@/lib/push-recipients'
import { getCampaignPush } from '@/lib/campaigns'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Créneau midi : « découvre la boutique ». PUSH localisé (fr/en/de) à tous les
// appareils enregistrés (natif Expo + Web Push PWA).
export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const recipients = await getDevicePushRecipients(supabase)
  if (recipients.length === 0) return NextResponse.json({ pushed: 0, devices: 0 })

  let pushed = 0
  const errors: string[] = []
  for (const { userId, locale } of recipients) {
    const { title, body, url, tag } = getCampaignPush('boutique', locale)
    try { pushed += await sendPushToUser(userId, { title, body, data: { type: 'boutique_daily', url } }) }
    catch (e) { errors.push(`push ${userId}: ${e}`) }
    try { pushed += await sendWebPushToUser(userId, { title, body, url, tag }) }
    catch (e) { errors.push(`webpush ${userId}: ${e}`) }
  }
  console.log(`[boutique-push] push=${pushed} devices=${recipients.length} errors=${errors.length}`)
  return NextResponse.json({ pushed, devices: recipients.length, errors })
}
