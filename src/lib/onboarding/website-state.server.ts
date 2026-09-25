import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { lireEtat, type LectureEtat } from './website-state'

/**
 * Lecture serveur de l'état d'onboarding Website, MÉMOÏSÉE PAR REQUÊTE.
 *
 * Le `cache()` de React est ce qui permet au layout ET à la page du dashboard
 * d'appeler cette fonction sans produire deux requêtes : c'est le même patron
 * que `getCurrentUser` et `getProfileName` dans `lib/supabase/session.ts`.
 *
 * Fichier SÉPARÉ du cœur `website-state.ts` parce qu'il importe le client
 * Supabase serveur, lequel tire `next/headers` : un composant client qui
 * atteindrait ce module casserait le bundle. Le cœur, lui, reste importable des
 * deux côtés.
 *
 * Le client utilisé est celui LIÉ AUX COOKIES : il agit en tant qu'utilisateur
 * authentifié, seul rôle disposant de droits sur la table (`service_role` n'en
 * a aucun, phase 09.7.14).
 */
export const lireEtatOnboardingServeur = cache(async (userId: string): Promise<LectureEtat> => {
  const supabase = await createClient()
  return lireEtat(supabase, userId)
})
