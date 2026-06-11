import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { sendPushToUser } from '@/lib/push'
import { sendWebPushToUser } from '@/lib/web-push'

export const runtime = 'nodejs'

// Envoi d'une notification push ponctuelle (web + natif) à un segment d'abonnés.
// Réservé aux admins. Calque la logique de /api/admin/send-email.
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const service = await createServiceClient()
  const { data: isAdmin } = await service.from('admin_users').select('id').eq('id', user.id).single()
  if (!isAdmin) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })

  const { title, body, url, target } = await req.json() as {
    title: string; body: string; url?: string; target: 'all' | 'active' | 'trialing'
  }

  if (!title?.trim() || !body?.trim()) {
    return NextResponse.json({ error: 'Titre et message requis.' }, { status: 400 })
  }

  let query = service.from('subscriptions').select('user_id')
  if (target === 'active') query = query.eq('status', 'active')
  else if (target === 'trialing') query = query.eq('status', 'trialing')

  const { data: subs } = await query
  if (!subs?.length) return NextResponse.json({ sent: 0, recipients: 0 })

  // Dédoublonne les user_id (un même compte peut avoir plusieurs lignes d'abonnement).
  const userIds = [...new Set(subs.map(s => s.user_id as string))]
  const target_url = url?.trim() || '/dashboard/notifications'

  // `sent` = nombre total d'appareils touchés (un user peut avoir 0…N appareils).
  let sent = 0
  for (const userId of userIds) {
    try {
      sent += await sendWebPushToUser(userId, { title, body, url: target_url, tag: 'admin_broadcast' })
      sent += await sendPushToUser(userId, { title, body, data: { type: 'admin_broadcast', url: target_url } })
    } catch {
      // continue : un échec isolé ne doit pas bloquer le reste du broadcast
    }
  }

  return NextResponse.json({ sent, recipients: userIds.length })
}
