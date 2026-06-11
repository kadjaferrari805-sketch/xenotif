import { getAccess } from '@/lib/access'
import { ProgrammeClient } from './ProgrammeClient'

export default async function Page() {
  const access = await getAccess()
  return <ProgrammeClient isPro={access.isPro} />
}
