import type { SupabaseClient } from '@supabase/supabase-js'

export type PushRecipient = { userId: string; locale: string }

// Tous les utilisateurs ayant AU MOINS un appareil enregistré (push natif Expo
// OU Web Push PWA), avec leur locale (profiles, défaut 'fr'). Quel que soit
// l'abonnement → inclut les essais gratuits app-level. Sert aux crons de
// notification quotidienne (matin + soir). Seuls les opt-in ont un token, donc
// la liste ne contient que des destinataires légitimes.
export async function getDevicePushRecipients(supabase: SupabaseClient): Promise<PushRecipient[]> {
  const [nativeRes, webRes] = await Promise.all([
    supabase.from('push_tokens').select('user_id'),
    supabase.from('web_push_subscriptions').select('user_id'),
  ])
  if (nativeRes.error) console.error('[push-recipients] push_tokens query error:', nativeRes.error)
  if (webRes.error) console.error('[push-recipients] web_push_subscriptions query error:', webRes.error)

  const ids = Array.from(new Set<string>([
    ...(nativeRes.data ?? []).map((r: { user_id: string }) => r.user_id),
    ...(webRes.data ?? []).map((r: { user_id: string }) => r.user_id),
  ]))
  if (ids.length === 0) return []

  const { data: profiles } = await supabase.from('profiles').select('id, locale').in('id', ids)
  const localeById = new Map<string, string>(
    (profiles ?? []).map((p: { id: string; locale: string | null }) => [p.id, p.locale ?? 'fr'])
  )
  return ids.map((userId) => ({ userId, locale: localeById.get(userId) ?? 'fr' }))
}
