import { getAccess } from '@/lib/access'
import { Paywall } from '@/components/dashboard/Paywall'
import { NotificationsClient } from './NotificationsClient'

export default async function Page() {
  const access = await getAccess()
  if (!access.isPro) return <Paywall />
  return <NotificationsClient />
}
