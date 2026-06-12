import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/session'
import { AbonnementClient, type Sub } from './AbonnementClient'

// Récupère l'abonnement côté serveur (rapide) → la page s'ouvre immédiatement,
// sans spinner ni aller-retour /api/subscription au montage. La facturation
// (Stripe, lente) reste chargée en arrière-plan côté client.
export default async function AbonnementPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/signin')

  const service = await createServiceClient()
  const { data: sub } = await service
    .from('subscriptions')
    .select('plan, status, trial_end, current_period_end, cancel_at_period_end, stripe_subscription_id')
    .eq('user_id', user.id)
    .maybeSingle()

  return <AbonnementClient initialSub={(sub ?? null) as Sub | null} />
}
