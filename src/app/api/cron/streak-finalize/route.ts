import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStreak } from '@/lib/streak/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Finalise chaque semaine terminée (série, gels, reset) pour tous les users
// ayant une ligne user_streaks - même sans ouverture de l'app. getStreak est
// idempotent (gardé par last_finalized_week).
export async function GET(request: Request) {
  // K8.9-04 — garde fail-closed. Sans le test sur `cronSecret`, une variable
  // absente faisait comparer à la chaîne « Bearer undefined », devinable.
  const cronSecret = process.env.CRON_SECRET
  const authHeader = request.headers.get('authorization')

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const { data: rows } = await supabase.from('user_streaks').select('user_id')
  const users = (rows ?? []).map((r: { user_id: string }) => r.user_id)

  // K8.9-03 — le détail des échecs (identifiant + exception) reste côté serveur ;
  // la réponse ne porte plus qu'un compte.
  let finalized = 0
  let failed = 0
  for (const userId of users) {
    try { await getStreak(supabase, userId); finalized++ }
    catch (e) { failed++; console.error('[streak-finalize] finalisation echouee :', userId, e) }
  }

  console.log(`[streak-finalize] finalized=${finalized}/${users.length} errors=${failed}`)
  return NextResponse.json({ finalized, users: users.length, failed })
}
