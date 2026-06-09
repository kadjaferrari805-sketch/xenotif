import { Expo, type ExpoPushMessage, type ExpoPushTicket } from 'expo-server-sdk'
import { createAdminClient } from './supabase/admin'

const expo = new Expo()

type PushPayload = { title: string; body: string; data?: Record<string, unknown> }

/**
 * Envoie une notification push à tous les appareils d'un utilisateur.
 * Lit les tokens en base (service-role), envoie via l'API Expo (qui route vers
 * FCM/APNs), puis supprime les tokens invalides (DeviceNotRegistered).
 * À appeler depuis du code serveur (cron, route admin, rappel d'entraînement…).
 */
export async function sendPushToUser(userId: string, payload: PushPayload): Promise<void> {
  const supabase = createAdminClient()
  const { data: rows, error } = await supabase
    .from('push_tokens')
    .select('token')
    .eq('user_id', userId)
  if (error) throw error

  const tokens = (rows ?? [])
    .map((r) => r.token as string)
    .filter((t) => Expo.isExpoPushToken(t))
  if (!tokens.length) return

  const messages: ExpoPushMessage[] = tokens.map((to) => ({
    to,
    sound: 'default',
    title: payload.title,
    body: payload.body,
    data: payload.data ?? {},
  }))

  // Nettoyage des tokens morts ; le curseur garde l'alignement token ↔ ticket
  const dead: string[] = []
  let cursor = 0
  for (const chunk of expo.chunkPushNotifications(messages)) {
    let tickets: ExpoPushTicket[] = []
    try {
      tickets = await expo.sendPushNotificationsAsync(chunk)
    } catch (err) {
      console.error('[push] échec envoi chunk', err)
      cursor += chunk.length
      continue
    }
    tickets.forEach((ticket, j) => {
      const token = tokens[cursor + j]
      if (token && ticket.status === 'error' && ticket.details?.error === 'DeviceNotRegistered') {
        dead.push(token)
      }
    })
    cursor += chunk.length
  }

  if (dead.length) {
    await supabase.from('push_tokens').delete().in('token', dead)
  }
}
