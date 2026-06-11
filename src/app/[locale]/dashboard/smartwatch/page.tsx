import { getAccess } from '@/lib/access'
import { Paywall } from '@/components/dashboard/Paywall'
import { SmartwatchClient } from './SmartwatchClient'

export default async function Page() {
  const access = await getAccess()
  if (!access.isPro) return <Paywall />
  return <SmartwatchClient />
}
