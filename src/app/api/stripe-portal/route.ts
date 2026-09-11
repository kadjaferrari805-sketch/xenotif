import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { createStripeClient } from '@/lib/stripe/server'
import { getPublicBaseUrl } from '@/lib/env/deployment'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    // Lecture en service-role (table protégée par RLS), filtré par user.id.
    const service = await createServiceClient()
    const { data: sub } = await service
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!sub?.stripe_customer_id) {
      return NextResponse.json({ error: 'Aucun abonnement Stripe trouvé.' }, { status: 404 })
    }

    // Garde d'environnement : clé TEST obligatoire hors production, et retour
    // vers l'URL de l'environnement courant.
    const stripe = createStripeClient()
    const baseUrl = getPublicBaseUrl()

    const portal = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${baseUrl}/dashboard/abonnement`,
    })

    return NextResponse.json({ url: portal.url })
  } catch (err: unknown) {
    console.error('Stripe portal error:', err)
    const msg = err instanceof Error ? err.message : ''
    if (msg.includes('No configuration was found')) {
      return NextResponse.json({
        error: 'portal_not_configured',
      }, { status: 500 })
    }
    return NextResponse.json({ error: 'Impossible d\'ouvrir le portail.' }, { status: 500 })
  }
}
