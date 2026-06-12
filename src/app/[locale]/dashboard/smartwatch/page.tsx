import { getAccess } from '@/lib/access'
import { Paywall } from '@/components/dashboard/Paywall'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/session'
import { getSmartwatchDashboard } from '@/lib/smartwatch/data'
import { SmartwatchClient } from './SmartwatchClient'

export default async function Page() {
  const access = await getAccess()
  if (!access.isPro) return <Paywall />

  // Données pré-chargées côté serveur → la page s'ouvre directement remplie
  // (plus d'écran « chargement… » au montage).
  const user = await getCurrentUser()
  if (!user) return <Paywall />
  const supabase = await createClient()
  const initialData = await getSmartwatchDashboard(supabase, user.id)

  return <SmartwatchClient initialData={initialData} />
}
