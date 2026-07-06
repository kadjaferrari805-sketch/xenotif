import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/session'
import { ProgressionClient } from './ProgressionClient'

// Séances + progression pré-chargées côté serveur (en parallèle) → la page
// s'ouvre directement remplie, sans flash de stats à zéro ni fetch au montage.
export default async function ProgressionPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/signin')

  const supabase = await createClient()
  const [{ data: workouts }, { data: progress }] = await Promise.all([
    supabase.from('workouts').select('discipline, duration_minutes, completed_at').eq('user_id', user.id).order('completed_at', { ascending: false }),
    supabase.from('progress').select('discipline, completed').eq('user_id', user.id),
  ])

  return (
    <ProgressionClient
      userId={user.id}
      initialWorkouts={workouts ?? []}
      initialProgress={progress ?? []}
    />
  )
}
