/**
 * Appropriation atomique d'un événement (« claim »).
 *
 * POURQUOI (K8.12.3) : les crons exécutent `SELECT … WHERE garde`, puis, bien
 * plus tard, `UPDATE`. Entre les deux : ni transaction, ni verrou, ni
 * appropriation. Deux exécutions concurrentes franchissent donc toutes deux le
 * filtre et envoient toutes deux l'e-mail.
 *
 * La garantie est ici déplacée dans l'atomicité d'un seul énoncé SQL :
 *
 *     UPDATE <table> SET <marquage>
 *     WHERE <clé> AND <garde encore vraie>
 *     RETURNING <clé>
 *
 * Un seul appelant obtient une ligne en retour ; tous les autres en obtiennent
 * zéro. C'est PostgreSQL qui arbitre, pas notre code.
 *
 * ⚠️ CLAIM_WON N'EST PAS EMAIL_SUCCESS.
 * Ce helper ne garantit QUE l'unicité de l'appropriation. Il n'envoie rien, ne
 * connaît pas Resend, et ne promet en aucun cas qu'un e-mail partira ensuite :
 * un crash survenant après l'appropriation laisse l'événement approprié SANS
 * envoi. C'est le compromis assumé de l'appropriation-avant-envoi (K8.12.3 §G) :
 * elle échange un doublon répété contre une perte rare.
 */

/** Issue d'une tentative d'appropriation. CLAIM_LOST n'est PAS une erreur. */
export type ClaimResult =
  | { outcome: 'CLAIM_WON' }
  | { outcome: 'CLAIM_LOST' }
  | { outcome: 'DB_ERROR'; error: { message: string } }

/**
 * Forme exacte renvoyée par un `UPDATE … .select()` de postgrest-js.
 *
 * L'appelant construit lui-même la requête : son typage fort est porté par le
 * builder postgrest, là où il est correct. Reproduire ici ses génériques
 * profonds serait fragile sans rien garantir de plus.
 */
export type ClaimResponse = {
  data: unknown[] | null
  error: { message: string } | null
}

/**
 * Interprète le résultat d'un UPDATE conditionnel en une issue déterministe.
 *
 * Aucun SELECT préalable : décider sur une lecture antérieure rouvrirait
 * précisément la fenêtre de concurrence que cette fonction ferme.
 *
 * @param requete un `UPDATE … WHERE … .select()` déjà construit
 */
export async function claimEvent(requete: PromiseLike<ClaimResponse>): Promise<ClaimResult> {
  const { data, error } = await requete

  // Une erreur DB n'est JAMAIS un claim perdu. Les confondre ferait sauter
  // l'envoi en silence, et le compteur d'échecs ne verrait rien.
  if (error) return { outcome: 'DB_ERROR', error }

  // `data === null` sans erreur signifie que `.select()` a été omis : postgrest
  // ne renvoie alors aucune ligne, et gagné devient INDISTINGUABLE de perdu.
  // Rendre CLAIM_LOST ici supprimerait l'envoi définitivement et sans trace.
  // Choix fail-safe : on signale l'anomalie plutôt que de la taire.
  if (data === null) {
    return {
      outcome: 'DB_ERROR',
      error: { message: 'claim : `.select()` absent de l’UPDATE — CLAIM_WON et CLAIM_LOST seraient indiscernables' },
    }
  }

  // Une clé bien formée ne peut désigner qu'une ligne ; on reste tolérant à
  // plusieurs, qui signifient de toute façon que l'appropriation est acquise.
  return data.length > 0 ? { outcome: 'CLAIM_WON' } : { outcome: 'CLAIM_LOST' }
}
