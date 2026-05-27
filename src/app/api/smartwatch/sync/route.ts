import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { provider } = await req.json() as { provider: string }

  // Update last_sync_at
  await supabase
    .from('smartwatch_connections')
    .update({ last_sync_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('provider', provider)

  // In production: fetch real data from the provider's API here.
  // For now, upsert demo metrics so the dashboard shows realistic data.
  const today = new Date().toISOString().split('T')[0]
  await supabase.from('health_metrics').upsert({
    user_id:          user.id,
    date:             today,
    steps:            8432,
    calories_burned:  487,
    heart_rate_avg:   72,
    heart_rate_max:   156,
    heart_rate_resting: 58,
    active_minutes:   47,
    distance_meters:  6200,
    sleep_minutes:    432,
    sleep_score:      78,
    hydration_ml:     1750,
    source:           provider,
  }, { onConflict: 'user_id,date,source' })

  return NextResponse.json({ success: true, synced_at: new Date().toISOString() })
}
