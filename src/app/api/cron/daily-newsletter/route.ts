import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendDailyMotivationEmail, sendThemedDailyEmail } from '@/lib/emails'
import { getDailyEmailTheme } from '@/lib/campaigns'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

type Recipient = { email: string; name: string; locale: string; isSubscriber: boolean }

// Newsletter quotidienne - 1 email/jour à thème tournant (motivation / boutique /
// guide / abonnement), localisé fr/en/de selon profiles.locale.
// Audience : TOUS les inscrits du site (comptes auth) + la liste newsletter
// (emails capturés sans compte). Les abonnés actifs/essai ne reçoivent pas le
// thème « abonnement ».
export async function GET(request: Request) {
  // K8.9-04 — garde fail-closed. Sans le test sur `cronSecret`, une variable
  // absente faisait comparer à la chaîne « Bearer undefined », devinable.
  const cronSecret = process.env.CRON_SECRET
  const authHeader = request.headers.get('authorization')

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Abonnés actifs / en essai → pour distinguer rotation + sauter « subscribe ».
  const { data: subs } = await supabase
    .from('subscriptions')
    .select('user_id, status')
    .in('status', ['active', 'trialing'])
  const subscriberIds = new Set((subs ?? []).map((s: { user_id: string }) => s.user_id))

  // Profils (prénom + locale) de tout le monde.
  const { data: profiles } = await supabase.from('profiles').select('id, full_name, locale')
  const nameById = new Map<string, string>()
  const localeById = new Map<string, string>()
  for (const p of (profiles ?? []) as { id: string; full_name: string | null; locale: string | null }[]) {
    nameById.set(p.id, p.full_name ?? '')
    localeById.set(p.id, p.locale ?? 'fr')
  }

  const byEmail = new Map<string, Recipient>()

  // 1) Tous les comptes enregistrés (source de vérité auth.users).
  for (let page = 1; page <= 50; page++) {
    const { data: list, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
    if (error) { console.error('[daily-newsletter] listUsers error:', error); break }
    for (const u of list.users) {
      if (!u.email) continue
      const key = u.email.toLowerCase()
      byEmail.set(key, {
        email: u.email,
        name: nameById.get(u.id) ?? '',
        locale: localeById.get(u.id) ?? 'fr',
        isSubscriber: subscriberIds.has(u.id),
      })
    }
    if (list.users.length < 200) break
  }

  // 2) Liste newsletter (emails sans compte) - locale si la colonne existe.
  const { data: leads } = await supabase.from('newsletter_subscribers').select('*')
  for (const row of (leads ?? []) as { email?: string; locale?: string }[]) {
    if (!row.email) continue
    const key = row.email.toLowerCase()
    if (byEmail.has(key)) continue // déjà couvert par un compte
    byEmail.set(key, { email: row.email, name: '', locale: row.locale ?? 'fr', isSubscriber: false })
  }

  const recipients = [...byEmail.values()]
  if (recipients.length === 0) return NextResponse.json({ sent: 0 })

  // K8.9-02 — l'adresse ne quitte plus le serveur. Les destinataires « prospects »
  // n'ayant pas de compte, il n'existe pas d'identifiant à journaliser à sa
  // place : l'adresse est donc MASQUÉE dans le log (ab***@domaine), ce qui suffit
  // au diagnostic sans écrire de donnée personnelle en clair.
  let sent = 0
  let failed = 0
  for (const r of recipients) {
    const theme = getDailyEmailTheme(r.isSubscriber)
    try {
      if (theme === 'motivation' || theme === 'reminder') {
        await sendDailyMotivationEmail({ email: r.email, name: r.name, locale: r.locale })
      } else {
        await sendThemedDailyEmail({ email: r.email, name: r.name, locale: r.locale, theme })
      }
      sent++
    } catch (e) {
      failed++
      console.error('[daily-newsletter] envoi echoue :', r.email.replace(/^(.{2}).*@/, '$1***@'), theme, e)
    }
  }

  console.log(`[daily-newsletter] sent=${sent}/${recipients.length} errors=${failed}`)
  return NextResponse.json({ sent, recipients: recipients.length, failed })
}
