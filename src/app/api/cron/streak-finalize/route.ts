import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStreak } from '@/lib/streak/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Finalise chaque semaine terminée (série, gels, reset) pour tous les users
// ayant une ligne user_streaks — même sans ouverture de l'app. getStreak est
// idempotent (gardé par last_finalized_week).
export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const { data: rows } = await supabase.from('user_streaks').select('user_id')
  const users = (rows ?? []).map((r: { user_id: string }) => r.user_id)

  let finalized = 0
  const errors: string[] = []
  for (const userId of users) {
    try { await getStreak(supabase, userId); finalized++ }
    catch (e) { errors.push(`streak ${userId}: ${e}`) }
  }

  console.log(`[streak-finalize] finalized=${finalized}/${users.length} errors=${errors.length}`)
  return NextResponse.json({ finalized, users: users.length, errors })
}
