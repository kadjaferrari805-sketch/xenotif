import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { setGoal } from '@/lib/streak/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const goal = Number(body?.goal)
  if (!Number.isFinite(goal) || goal < 2 || goal > 7) {
    return NextResponse.json({ error: 'goal doit être entre 2 et 7' }, { status: 400 })
  }
  const view = await setGoal(supabase, user.id, goal)
  return NextResponse.json(view)
}
