import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { claimEvent } from '@/lib/supabase/claim'
import { sendReactivationEmail } from '@/lib/emails'
import { sendPushToUser } from '@/lib/push'
import { sendWebPushToUser } from '@/lib/web-push'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Push court de réactivation, par langue.
const WINBACK_PUSH: Record<string, { title: string; body: string }> = {
  fr: { title: '💪 Ta place t\'attend', body: 'Ta progression est sauvegardée. Réactive ton accès Xenotif® en 1 clic.' },
  en: { title: '💪 Your spot is waiting', body: 'Your progress is saved. Reactivate your Xenotif® access in 1 click.' },
}

/**
 * Cron de réactivation (win-back). Cible les abonnés RÉSILIÉS (status 'canceled' -
 * leur accès payant est donc terminé), pas encore relancés. Envoie un email
 * (+ push best-effort) une seule fois grâce à la colonne reactivation_sent_at.
 *
 * ⚠️ SETUP MANUEL REQUIS : exécuter supabase-reactivation.sql (ajoute la colonne
 * subscriptions.reactivation_sent_at). Sans elle, la requête renvoie une erreur 500.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization')
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Abonnés résiliés jamais relancés (accès terminé).
  const { data: subs, error } = await supabase
    .from('subscriptions')
    .select('user_id, status, reactivation_sent_at')
    .eq('status', 'canceled')
    .is('reactivation_sent_at', null)
    .limit(50)

  if (error) {
    console.error('[reactivation] query error:', error)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }

  if (!subs || subs.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  const userIds = subs.map((s: { user_id: string }) => s.user_id)

  // Prénom + langue depuis profiles.
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, locale')
    .in('id', userIds)
  const nameById = new Map<string, string | null>(
    (profiles ?? []).map((p: { id: string; full_name: string | null }) => [p.id, p.full_name]),
  )
  const localeById = new Map<string, string>(
    (profiles ?? []).map((p: { id: string; locale: string | null }) => [p.id, p.locale ?? 'fr']),
  )

  // Email depuis auth.users (source de vérité, contrairement à profiles.email).
  const wanted = new Set(userIds)
  const emailById = new Map<string, string>()
  for (let page = 1; page <= 25; page++) {
    const { data: list, error: listErr } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
    if (listErr) {
      console.error('[reactivation] listUsers error:', listErr)
      break
    }
    for (const u of list.users) {
      if (u.email && wanted.has(u.id)) emailById.set(u.id, u.email)
    }
    if (list.users.length < 200) break
  }

  // K8.9-02 / K8.9-03 — ni l'adresse ni l'identifiant ne quittent le serveur :
  // le détail part en journal, la réponse ne porte qu'un compte.
  let sent = 0
  let pushed = 0
  let failed = 0

  for (const userId of userIds) {
    const locale = localeById.get(userId) ?? 'fr'
    const email = emailById.get(userId)

    if (email) {
      // ── K8.12.6 — APPROPRIATION AVANT ENVOI.
      //
      // L'UPDATE conditionnel est atomique : PostgreSQL n'accorde la ligne qu'à
      // UN seul exécutant. La garde `reactivation_sent_at IS NULL` rejoue la
      // condition de sélection AU MOMENT de l'écriture, ce que le SELECT initial
      // ne peut pas garantir. `user_id` est UNIQUE : la clé désigne exactement
      // l'événement de réactivation de cet abonné, qui est one-shot.
      //
      // LE CLAIM EST À L'INTÉRIEUR DE `if (email)` À DESSEIN : approprier un
      // abonné dont l'adresse est introuvable consommerait son unique
      // réactivation sans qu'aucun envoi ne soit possible — une perte
      // SYSTÉMATIQUE, et non la perte rare acceptée.
      //
      // ⚠️ COMPROMIS ASSUMÉ (K8.12.3 §G) : l'appropriation est DÉFINITIVE. Un
      // échec d'envoi ou un crash après ce point laisse l'abonné marqué sans
      // relance partie. Aucune compensation : remettre `reactivation_sent_at` à
      // NULL rouvrirait exactement la fenêtre de doublon que cette phase ferme.
      const claim = await claimEvent(
        supabase
          .from('subscriptions')
          .update({ reactivation_sent_at: new Date().toISOString() })
          .eq('user_id', userId)
          .is('reactivation_sent_at', null)
          .select('user_id'),
      )

      // Un autre exécutant a gagné : ni succès ni échec pour celui-ci. Aucun
      // compteur, aucun envoi, et pas de push — il revient au gagnant.
      if (claim.outcome === 'CLAIM_LOST') continue

      if (claim.outcome === 'DB_ERROR') {
        // JAMAIS confondu avec CLAIM_LOST : une écriture refusée doit rester
        // visible. Seul le message est journalisé — jamais l'adresse.
        failed++
        console.error('[reactivation] claim echoue :', userId, claim.error.message)
      } else {
        try {
          await sendReactivationEmail({ email, name: nameById.get(userId) ?? '', locale })
          sent++
        } catch (e) {
          failed++
          console.error('[reactivation] envoi echoue :', userId, e)
          continue
        }
      }
    }

    // Push (web + natif) en plus de l'email, best-effort.
    const p = WINBACK_PUSH[locale] ?? WINBACK_PUSH.fr
    try {
      pushed += await sendWebPushToUser(userId, {
        title: p.title,
        body: p.body,
        url: '/dashboard/abonnement',
        tag: 'reactivation',
      })
      pushed += await sendPushToUser(userId, {
        title: p.title,
        body: p.body,
        data: { type: 'reactivation', url: '/dashboard/abonnement' },
      })
    } catch (e) {
      failed++
      console.error('[reactivation] push echoue :', userId, e)
    }
  }

  console.log(`[reactivation] emails=${sent} push=${pushed} errors=${failed}`)
  return NextResponse.json({ sent, pushed, processed: subs.length, failed })
}
