import { redirect } from 'next/navigation'
import { getCurrentUser, getProfileName } from '@/lib/supabase/session'
import { lireEtatOnboardingServeur } from '@/lib/onboarding/website-state.server'
import { BienvenueClient } from './BienvenueClient'

/**
 * Parcours de démarrage Website. Reste DANS le segment protégé `/dashboard`,
 * donc couvert par le matcher de `src/proxy.ts` sans modification de celui-ci.
 *
 * `getCurrentUser()` est mémoïsé par requête : cet appel est partagé avec le
 * layout et n'ajoute aucun aller-retour d'authentification.
 *
 * Un membre ayant déjà TERMINÉ son parcours n'a rien à faire ici : on le renvoie
 * au tableau de bord. En revanche un membre `dismissed` peut revenir — c'est
 * exactement le chemin de reprise ouvert par la CTA du dashboard.
 */
export default async function BienvenuePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/signin')

  const [lecture, fullName] = await Promise.all([
    lireEtatOnboardingServeur(user.id),
    getProfileName(),
  ])

  if (lecture.statut === 'present' && lecture.ligne.state === 'completed') {
    redirect('/dashboard')
  }

  const etapeInitiale =
    lecture.statut === 'present' ? lecture.ligne.current_step : 1

  return (
    <BienvenueClient
      userId={user.id}
      nomInitial={fullName ?? (user.user_metadata?.full_name as string | undefined) ?? ''}
      etapeInitiale={etapeInitiale}
      reprise={lecture.statut === 'present' && lecture.ligne.state === 'dismissed'}
    />
  )
}
