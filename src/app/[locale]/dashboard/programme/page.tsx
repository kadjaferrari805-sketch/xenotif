import { getAccess } from '@/lib/access'
import { getFreeDisciplineSlugs } from '@/lib/content-db'
import { ProgrammeClient } from './ProgrammeClient'

export default async function Page() {
  const access = await getAccess()
  const freeSlugs = await getFreeDisciplineSlugs()
  return <ProgrammeClient isPro={access.isPro} freeSlugs={freeSlugs} />
}
