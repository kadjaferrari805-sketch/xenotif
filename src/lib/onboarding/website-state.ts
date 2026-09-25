import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * FRONTIÈRE D'ACCÈS — onboarding Website (public.website_onboarding).
 *
 * Cœur « client-safe » : ce fichier n'importe NI `next/headers`, NI le client
 * Supabase serveur. Il reçoit toujours un `SupabaseClient` en paramètre, ce qui
 * lui permet d'être importé aussi bien par un composant client (qui passe le
 * client navigateur) que par le serveur. La lecture serveur mémoïsée vit dans
 * `website-state.server.ts` — la séparation est imposée par Next : un import de
 * `next/headers` dans un module atteint par un composant client casse le bundle.
 *
 * RAPPEL DE CONTRAT (vérifié en production, phase 09.7.14) :
 *   - `service_role` n'a AUCUN grant sur cette table → toute lecture/écriture
 *     doit passer par un client authentifié (cookies côté serveur, session côté
 *     navigateur). Le client de service échouerait.
 *   - `authenticated` ne peut PAS mettre à jour `user_id` (grant de colonne).
 *   - Aucune policy DELETE : rien ne supprime une ligne d'ici.
 *
 * L'onboarding Website ne lit et n'écrit QUE cette table, plus
 * `profiles.full_name`. Jamais `onboarded`, `onboarded_at`, `main_goal`,
 * `fitness_level` ni `onboarding_step` — ces colonnes appartiennent au Mobile
 * ou au cron e-mail.
 */

export type EtatOnboarding = 'in_progress' | 'dismissed' | 'completed'

export type LigneOnboarding = {
  state: EtatOnboarding
  current_step: number
}

/**
 * Résultat d'une lecture. `indisponible` est distinct de `absent` :
 * une lecture EN ÉCHEC ne doit pas être confondue avec « pas encore commencé »,
 * sous peine d'envoyer vers l'onboarding un membre qui l'a déjà terminé.
 */
export type LectureEtat =
  | { statut: 'absent' }
  | { statut: 'present'; ligne: LigneOnboarding }
  | { statut: 'indisponible' }

export const ETAPE_MIN = 1
export const ETAPE_MAX = 4
export const TABLE = 'website_onboarding'

/** Borne une étape dans l'intervalle autorisé par la CHECK de la base. */
export function bornerEtape(etape: number): number {
  if (!Number.isInteger(etape)) return ETAPE_MIN
  return Math.min(ETAPE_MAX, Math.max(ETAPE_MIN, etape))
}

/** Le parcours doit-il être présenté ? Seuls `absent` et `in_progress` le déclenchent. */
export function doitAfficherOnboarding(lecture: LectureEtat): boolean {
  if (lecture.statut === 'absent') return true
  if (lecture.statut === 'present') return lecture.ligne.state === 'in_progress'
  // `indisponible` : on NE redirige PAS. Une panne de lecture ne doit jamais
  // détourner la navigation d'un membre dont l'état nous est inconnu.
  return false
}

/** L'utilisateur a-t-il explicitement reporté le parcours ? (affichage de la reprise) */
export function peutReprendre(lecture: LectureEtat): boolean {
  return lecture.statut === 'present' && lecture.ligne.state === 'dismissed'
}

/** Lecture brute, utilisable des deux côtés. Ne lève jamais. */
export async function lireEtat(
  supabase: SupabaseClient,
  userId: string,
): Promise<LectureEtat> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('state, current_step')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) return { statut: 'indisponible' }
    if (!data) return { statut: 'absent' }
    return {
      statut: 'present',
      ligne: { state: data.state as EtatOnboarding, current_step: data.current_step as number },
    }
  } catch {
    return { statut: 'indisponible' }
  }
}

/**
 * Crée la ligne initiale si elle n'existe pas.
 *
 * `ignoreDuplicates` est une EXIGENCE DE CORRECTION, pas une optimisation : un
 * upsert ordinaire exécute un UPDATE en cas de conflit et réinitialiserait en
 * `in_progress` un membre déjà `completed` — deux onglets ouvrant le parcours
 * en même temps suffiraient à effacer un état terminal.
 */
export async function creerSiAbsent(
  supabase: SupabaseClient,
  userId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from(TABLE)
    .upsert(
      { user_id: userId, state: 'in_progress', current_step: ETAPE_MIN },
      { onConflict: 'user_id', ignoreDuplicates: true },
    )
  return !error
}

/**
 * Fait avancer l'étape courante. NE RÉGRESSE JAMAIS.
 *
 * Les deux filtres portent la garantie, et ils la portent CÔTÉ BASE, dans une
 * unique instruction UPDATE — donc atomiquement, sans trigger :
 *   - `.eq('state','in_progress')` : une ligne `dismissed` ou `completed` est
 *     intouchable ;
 *   - `.lt('current_step', etape)` : seule une étape STRICTEMENT supérieure est
 *     écrite. Un onglet en retard qui rejouerait l'étape 2 sur une ligne déjà
 *     en étape 3 ne modifie rien.
 */
export async function avancerEtape(
  supabase: SupabaseClient,
  userId: string,
  etape: number,
): Promise<boolean> {
  const cible = bornerEtape(etape)
  const { error } = await supabase
    .from(TABLE)
    .update({ current_step: cible })
    .eq('user_id', userId)
    .eq('state', 'in_progress')
    .lt('current_step', cible)
  return !error
}

/** Report explicite. Ne s'applique qu'à un parcours en cours. */
export async function reporter(
  supabase: SupabaseClient,
  userId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from(TABLE)
    .update({ state: 'dismissed' })
    .eq('user_id', userId)
    .eq('state', 'in_progress')
  return !error
}

/** Reprise après report. Ne s'applique qu'à un parcours reporté. */
export async function reprendre(
  supabase: SupabaseClient,
  userId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from(TABLE)
    .update({ state: 'in_progress' })
    .eq('user_id', userId)
    .eq('state', 'dismissed')
  return !error
}

/**
 * Marque le parcours terminé. Idempotent et TERMINAL.
 *
 * `.neq('state','completed')` évite toute réécriture d'un état déjà terminal :
 * un second appel (double-clic, onglet concurrent) ne touche aucune ligne.
 *
 * N'est appelé QU'APRÈS une insertion de séance confirmée — jamais avant.
 */
export async function marquerTermine(
  supabase: SupabaseClient,
  userId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from(TABLE)
    .update({ state: 'completed', current_step: ETAPE_MAX })
    .eq('user_id', userId)
    .neq('state', 'completed')
  return !error
}
