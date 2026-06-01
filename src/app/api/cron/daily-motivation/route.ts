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

  // Prénom (optionnel) depuis profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, locale')
    .in('id', userIds)
  const nameById = new Map<string, string | null>(
    (profiles ?? []).map((p: { id: string; full_name: string | null }) => [p.id, p.full_name])
  )
  const localeById = new Map<string, string>(
    (profiles ?? []).map((p: { id: string; locale: string | null }) => [p.id, p.locale ?? 'fr'])
  )

  // Email depuis auth.users (source de vérité — toujours présent, contrairement à profiles.email)
  const wanted = new Set(userIds)
  const emailById = new Map<string, string>()
  for (let page = 1; page <= 25; page++) {
    const { data: list, error: listErr } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
    if (listErr) {
      console.error('[daily-motivation] listUsers error:', listErr)
      break
    }
    for (const u of list.users) {
      if (u.email && wanted.has(u.id)) emailById.set(u.id, u.email)
    }
    if (list.users.length < 200) break
  }

  let sent = 0
  const errors: string[] = []

  for (const userId of userIds) {
    const email = emailById.get(userId)
    if (!email) continue
    try {
      await sendDailyMotivationEmail({ email, name: nameById.get(userId) ?? '', locale: localeById.get(userId) ?? 'fr' })
      sent++
    } catch (e) {
      errors.push(`${email}: ${e}`)
    }
  }

  console.log(`[daily-motivation] sent=${sent} errors=${errors.length}`)
  return NextResponse.json({ sent, errors })
}
