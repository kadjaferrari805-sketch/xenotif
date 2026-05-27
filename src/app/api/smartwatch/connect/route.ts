import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { WatchProvider } from '@/lib/smartwatch/types'

const OAUTH_CONFIGS: Record<string, { authUrl: string; scopes: string }> = {
  fitbit: {
    authUrl: 'https://www.fitbit.com/oauth2/authorize',
    scopes:  'activity heartrate nutrition profile settings sleep weight',
  },
  garmin: {
    authUrl: 'https://connect.garmin.com/oauthConfirm',
    scopes:  '',
  },
  google_fit: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scopes:  'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.heart_rate.read https://www.googleapis.com/auth/fitness.sleep.read',
  },
  polar: {
    authUrl: 'https://flow.polar.com/oauth2/authorization',
    scopes:  'accesslink.read_all',
  },
}

const CLIENT_IDS: Record<string, string | undefined> = {
  fitbit:     process.env.FITBIT_CLIENT_ID,
  garmin:     process.env.GARMIN_CLIENT_ID,
  google_fit: process.env.GOOGLE_FIT_CLIENT_ID,
  polar:      process.env.POLAR_CLIENT_ID,
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { provider } = await req.json() as { provider: WatchProvider }

  if (provider === 'apple_health') {
    // Apple HealthKit works only via native app — return instructions
    return NextResponse.json({
      type: 'instructions',
      message: 'Télécharge l\'app Xenotif sur iOS et connecte ton Apple Watch depuis l\'onglet "Appareils".',
    })
  }

  if (provider === 'samsung_health' || provider === 'huawei_health' || provider === 'xiaomi_health' || provider === 'wear_os') {
    return NextResponse.json({ type: 'coming_soon', message: 'Bientôt disponible' })
  }

  const config = OAUTH_CONFIGS[provider]
  const clientId = CLIENT_IDS[provider]

  if (!config || !clientId) {
    // No credentials configured yet — demo mode connection
    await supabase.from('smartwatch_connections').upsert({
      user_id:      user.id,
      provider,
      device_name:  'Démo',
      device_model: 'Mode démonstration',
      is_active:    true,
      last_sync_at: new Date().toISOString(),
    }, { onConflict: 'user_id,provider' })

    return NextResponse.json({ type: 'demo', message: 'Connecté en mode démonstration' })
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/smartwatch/callback`
  const state = Buffer.from(JSON.stringify({ user_id: user.id, provider })).toString('base64')

  const params = new URLSearchParams({
    client_id:     clientId,
    redirect_uri:  redirectUri,
    response_type: 'code',
    scope:         config.scopes,
    state,
  })

  return NextResponse.json({ type: 'oauth', url: `${config.authUrl}?${params.toString()}` })
}
