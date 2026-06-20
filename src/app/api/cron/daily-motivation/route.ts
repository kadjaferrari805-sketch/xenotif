import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendDailyMotivationEmail } from '@/lib/emails'
import { sendPushToUser } from '@/lib/push'
import { sendWebPushToUser } from '@/lib/web-push'
import { getDailyPushContent } from '@/lib/daily-motivation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // ── PUSH quotidien : TOUS les appareils enregistrés (push natif Expo + Web Push
  //    PWA), quel que soit l'abonnement. Inclut donc les essais gratuits 7 j
  //    (app-level, sans ligne `subscriptions`) et les comptes non abonnés.
  //    Seuls les utilisateurs ayant activé les notifications ont un token ici, donc
  //    élargir la cible n'envoie rien à ceux qui n'ont pas opté. ──
  const [nativeRes, webRes] = await Promise.all([
    supabase.from('push_tokens').select('user_id'),
    supabase.from('web_push_subscriptions').select('user_id'),
  ])
  if (nativeRes.error) console.error('[daily-motivation] push_tokens query error:', nativeRes.error)
  if (webRes.error) console.error('[daily-motivation] web_push_subscriptions query error:', webRes.error)
  const deviceUserIds = Array.from(new Set<string>([
    ...(nativeRes.data ?? []).map((r: { user_id: string }) => r.user_id),
    ...(webRes.data ?? []).map((r: { user_id: string }) => r.user_id),
  ]))

  // ── EMAIL quotidien : abonnés actifs / en essai Stripe. ──
  const { data: subscribers, error: subErr } = await supabase
    .from('subscriptions')
    .select('user_id, status')
    .in('status', ['active', 'trialing'])
  if (subErr) {
    // On n'interrompt pas : le push doit partir même si la table abonnements échoue.
    console.error('[daily-motivation] subscriptions query error:', subErr)
  }
  const subIds = (subscribers ?? []).map((s: { user_id: string }) => s.user_id)

  if (deviceUserIds.length === 0 && subIds.length === 0) {
    return NextResponse.json({ sent: 0, pushed: 0, devices: 0 })
  }

  // Profils (prénom + locale) pour l'union des destinataires (push ∪ email).
  const allIds = Array.from(new Set<string>([...deviceUserIds, ...subIds]))
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, locale')
    .in('id', allIds)
  const nameById = new Map<string, string | null>(
    (profiles ?? []).map((p: { id: string; full_name: string | null }) => [p.id, p.full_name])
  )
  const localeById = new Map<string, string>(
    (profiles ?? []).map((p: { id: string; locale: string | null }) => [p.id, p.locale ?? 'fr'])
  )

  // Email depuis auth.users (source de vérité) — uniquement pour les abonnés à emailer.
  const wanted = new Set(subIds)
  const emailById = new Map<string, string>()
  if (wanted.size > 0) {
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
  }

  let sent = 0
  let pushed = 0
  const errors: string[] = []

  // Email → abonnés actifs / en essai.
  for (const userId of subIds) {
    const email = emailById.get(userId)
    if (!email) continue
    const locale = localeById.get(userId) ?? 'fr'
    try {
      await sendDailyMotivationEmail({ email, name: nameById.get(userId) ?? '', locale })
      sent++
    } catch (e) {
      errors.push(`email ${email}: ${e}`)
    }
  }

  // Push → TOUS les appareils enregistrés (natif Expo + Web Push PWA).
  // Contenu qui change chaque jour (comme l'email et les cartes in-app).
  for (const userId of deviceUserIds) {
    const locale = localeById.get(userId) ?? 'fr'
    const { title, body } = getDailyPushContent(locale)
    try {
      pushed += await sendPushToUser(userId, {
        title,
        body,
        data: { type: 'daily_motivation' },
      })
    } catch (e) {
      errors.push(`push ${userId}: ${e}`)
    }
    try {
      pushed += await sendWebPushToUser(userId, {
        title,
        body,
        url: '/dashboard/notifications',
        tag: 'daily_motivation',
      })
    } catch (e) {
      errors.push(`webpush ${userId}: ${e}`)
    }
  }

  console.log(`[daily-motivation] emails=${sent} push=${pushed} devices=${deviceUserIds.length} errors=${errors.length}`)
  return NextResponse.json({ sent, pushed, devices: deviceUserIds.length, errors })
}
