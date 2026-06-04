import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// ⚠️ OUTIL DIAGNOSTIC PONCTUEL — protégé par jeton, à RETIRER après usage. Lecture seule.
const TOKEN = 'xeno-repair-k7Q2mZ9p'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  if (p.get('token') !== TOKEN) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const account = (p.get('account') ?? '').trim().toLowerCase()
  const service = await createServiceClient()

  // Tous les comptes correspondant (au cas où il y aurait des doublons d'email)
  const { data: list } = await service.auth.admin.listUsers({ perPage: 200 })
  const matches = (list?.users ?? []).filter(u => u.email?.toLowerCase() === account)
    .map(u => ({ id: u.id, email: u.email, created: u.created_at }))

  // Toutes les lignes subscriptions de ces comptes
  const rows: unknown[] = []
  for (const m of matches) {
    const { data } = await service.from('subscriptions').select('*').eq('user_id', m.id)
    if (data) rows.push(...data)
  }

  // Aussi : toutes les subscriptions en base (vue d'ensemble, limitée)
  const { data: allSubs } = await service.from('subscriptions').select('user_id, stripe_customer_id, stripe_subscription_id, status, plan, cancel_at_period_end').limit(20)

  return NextResponse.json({ account, accountsMatching: matches, subscriptionRowsForAccount: rows, allSubscriptions: allSubs })
}
