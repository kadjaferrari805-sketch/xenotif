import webpush from 'web-push'
import { createAdminClient } from './supabase/admin'

let configured: boolean | null = null

/** Configure les clés VAPID une seule fois. Renvoie false si elles manquent. */
function ensureConfigured(): boolean {
  if (configured !== null) return configured
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const priv = process.env.VAPID_PRIVATE_KEY
  const subject = process.env.VAPID_SUBJECT || 'mailto:contact@xenotif.com'
  if (!pub || !priv) { configured = false; return false }
  webpush.setVapidDetails(subject, pub, priv)
  configured = true
  return true
}

type WebPushPayload = {
  title: string
  body: string
  url?: string
  tag?: string
}

/**
 * Envoie une notification Web Push (PWA) à tous les navigateurs/appareils d'un
 * utilisateur. Lit les souscriptions en base (service-role), envoie via VAPID,
 * puis supprime les souscriptions mortes (404/410). Renvoie le nombre d'envois OK.
 * À appeler depuis du code serveur (cron, route admin…).
 */
export async function sendWebPushToUser(userId: string, payload: WebPushPayload): Promise<number> {
  if (!ensureConfigured()) return 0

  const supabase = createAdminClient()
  const { data: rows, error } = await supabase
    .from('web_push_subscriptions')
    .select('endpoint, p256dh, auth')
    .eq('user_id', userId)
  if (error || !rows || rows.length === 0) return 0

  const body = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url ?? '/dashboard',
    tag: payload.tag ?? 'xenotif',
  })

  let ok = 0
  const dead: string[] = []

  await Promise.all(
    rows.map(async (r) => {
      const sub = {
        endpoint: r.endpoint as string,
        keys: { p256dh: r.p256dh as string, auth: r.auth as string },
      }
      try {
        await webpush.sendNotification(sub, body)
        ok++
      } catch (e: unknown) {
        const code = (e as { statusCode?: number })?.statusCode
        if (code === 404 || code === 410) dead.push(sub.endpoint)
      }
    })
  )

  if (dead.length) {
    await supabase.from('web_push_subscriptions').delete().in('endpoint', dead)
  }

  return ok
}
