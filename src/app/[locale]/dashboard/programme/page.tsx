import { getAccess } from '@/lib/access'
import { getFreeDisciplineSlugs } from '@/lib/content-db'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/session'
import { ProgrammeClient } from './ProgrammeClient'

// Pré-charge (en parallèle) l'accès, les disciplines gratuites et la progression
// de la discipline initiale → la page s'ouvre directement remplie, sans skeleton.
export default async function Page({ searchParams }: { searchParams: Promise<{ discipline?: string }> }) {
  const [access, freeSlugs, user, sp] = await Promise.all([
    getAccess(),
    getFreeDisciplineSlugs(),
    getCurrentUser(),
    searchParams,
  ])
  const slug = sp.discipline ?? 'running-cardio'

  const initialProgress: Record<string, boolean> = {}
  if (user) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('progress')
      .select('week, session_name, completed')
      .eq('user_id', user.id)
      .eq('discipline', slug)
    for (const p of data ?? []) initialProgress[`${p.week}-${p.session_name}`] = p.completed
  }

  return (
    <ProgrammeClient
      isPro={access.isPro}
      freeSlugs={freeSlugs}
      userId={user?.id ?? ''}
      initialProgress={initialProgress}
    />
  )
}
