import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendDailyMotivationEmail } from '@/lib/emails'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const { data: subscribers, error } = await supabase
    .from('subscriptions')
    .select('user_id, status')
    .in('status', ['active', 'trialing'])

  if (error) {
    console.error('[daily-motivation] subscriptions query error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  const userIds = subscribers.map((s: { user_id: string }) => s.user_id)

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .in('id', userIds)

  if (profilesError) {
    console.error('[daily-motivation] profiles query error:', profilesError)
    return NextResponse.json({ error: profilesError.message }, { status: 500 })
  }

  let sent = 0
  const errors: string[] = []

  for (const profile of profiles ?? []) {
    if (!profile.email) continue
    try {
      await sendDailyMotivationEmail({ email: profile.email, name: profile.full_name ?? '' })
      sent++
    } catch (e) {
      errors.push(`${profile.email}: ${e}`)
    }
  }

  console.log(`[daily-motivation] sent=${sent} errors=${errors.length}`)
  return NextResponse.json({ sent, errors })
}
