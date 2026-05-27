import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { provider } = await req.json() as { provider: string }

  await supabase
    .from('smartwatch_connections')
    .update({ is_active: false })
    .eq('user_id', user.id)
    .eq('provider', provider)

  return NextResponse.json({ success: true })
}
