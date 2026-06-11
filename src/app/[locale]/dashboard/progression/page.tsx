import { getAccess } from '@/lib/access'
import { Paywall } from '@/components/dashboard/Paywall'
import { ProgressionClient } from './ProgressionClient'

export default async function Page() {
  const access = await getAccess()
  if (!access.isPro) return <Paywall />
  return <ProgressionClient />
}
