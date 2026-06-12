import { redirect } from 'next/navigation'
import { getCurrentUser, getProfileName } from '@/lib/supabase/session'
import { ProfilClient } from './ProfilClient'

// Email + nom récupérés côté serveur (mémoïsés, partagés avec le layout) →
// la page s'ouvre immédiatement, sans spinner ni fetch au montage.
export default async function ProfilPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/signin')
  const fullName = await getProfileName()
  return <ProfilClient initialName={fullName ?? ''} email={user.email ?? ''} userId={user.id} />
}
