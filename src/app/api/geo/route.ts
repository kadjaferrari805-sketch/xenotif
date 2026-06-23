import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { EU_COUNTRIES } from '@/lib/consent'

// Détection pays via l'en-tête géo de Vercel (pas de service tiers). Sert au
// bandeau de consentement pour ne l'afficher qu'en UE/EEE/UK/CH.
export const dynamic = 'force-dynamic'

export async function GET() {
  const h = await headers()
  const country = (h.get('x-vercel-ip-country') ?? '').toUpperCase()
  const eu = (EU_COUNTRIES as readonly string[]).includes(country)
  return NextResponse.json(
    { country, eu },
    { headers: { 'cache-control': 'no-store' } },
  )
}
