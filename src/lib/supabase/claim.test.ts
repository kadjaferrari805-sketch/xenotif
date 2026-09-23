/**
 * @jest-environment node
 */
// Phase K8.12.4 — fondation du claim atomique.
//
// Ces tests verrouillent une propriété critique : une erreur DB ne doit JAMAIS
// être confondue avec un claim perdu. La confusion supprimerait l'envoi en
// silence, sans compteur ni journal — exactement le type de défaut que K8.11 et
// K8.12.2 ont eu à corriger.
//
// AUCUNE base réelle, AUCUN envoi : le helper n'interprète qu'un résultat.

import { claimEvent, type ClaimResponse } from './claim'

/** Simule une requête postgrest déjà construite, et compte les exécutions. */
function requete(reponse: ClaimResponse) {
  const etat = { executions: 0 }
  const thenable: PromiseLike<ClaimResponse> = {
    then: (ok, ko) => {
      etat.executions++
      return Promise.resolve(reponse).then(ok, ko)
    },
  }
  return { thenable, etat }
}

describe('claimEvent — 1. l’UPDATE renvoie une ligne', () => {
  test('→ CLAIM_WON', async () => {
    const { thenable } = requete({ data: [{ id: 'evt-1' }], error: null })

    await expect(claimEvent(thenable)).resolves.toEqual({ outcome: 'CLAIM_WON' })
  })

  test('plusieurs lignes : l’appropriation reste acquise', async () => {
    const { thenable } = requete({ data: [{ id: 'a' }, { id: 'b' }], error: null })

    expect((await claimEvent(thenable)).outcome).toBe('CLAIM_WON')
  })
})

describe('claimEvent — 2. l’UPDATE renvoie 0 ligne', () => {
  test('→ CLAIM_LOST', async () => {
    const { thenable } = requete({ data: [], error: null })

    await expect(claimEvent(thenable)).resolves.toEqual({ outcome: 'CLAIM_LOST' })
  })

  test('CLAIM_LOST n’est PAS une erreur : aucune exception, aucun champ `error`', async () => {
    const { thenable } = requete({ data: [], error: null })

    const resultat = await claimEvent(thenable)

    expect(resultat).not.toHaveProperty('error')
    expect(resultat.outcome).toBe('CLAIM_LOST')
  })
})

describe('claimEvent — 3. l’UPDATE renvoie une erreur', () => {
  test('→ DB_ERROR, erreur transmise pour le diagnostic', async () => {
    const erreur = { message: 'permission denied for table abandoned_carts' }
    const { thenable } = requete({ data: null, error: erreur })

    await expect(claimEvent(thenable)).resolves.toEqual({ outcome: 'DB_ERROR', error: erreur })
  })

  test('une erreur accompagnée de données vides reste DB_ERROR', async () => {
    const { thenable } = requete({ data: [], error: { message: 'deadlock detected' } })

    expect((await claimEvent(thenable)).outcome).toBe('DB_ERROR')
  })
})

describe('claimEvent — 4. aucune erreur DB confondue avec CLAIM_LOST', () => {
  const erreurs = [
    { message: 'permission denied' },
    { message: 'deadlock detected' },
    { message: 'relation "public.abandoned_carts" does not exist' },
    { message: 'canceling statement due to statement timeout' },
    { message: '' },
  ]

  test.each(erreurs)('erreur « $message » → DB_ERROR, jamais CLAIM_LOST', async erreur => {
    const { thenable } = requete({ data: null, error: erreur })

    const resultat = await claimEvent(thenable)

    // LE point de ce fichier : confondre les deux supprimerait l'envoi en
    // silence, définitivement et sans trace.
    expect(resultat.outcome).not.toBe('CLAIM_LOST')
    expect(resultat.outcome).toBe('DB_ERROR')
  })

  test('`.select()` oublié (data null sans erreur) → DB_ERROR, pas CLAIM_LOST', async () => {
    const { thenable } = requete({ data: null, error: null })

    const resultat = await claimEvent(thenable)

    // Sans `.select()`, gagné et perdu sont indiscernables. Choix fail-safe :
    // on signale au lieu de supprimer l'envoi pour toujours.
    expect(resultat.outcome).toBe('DB_ERROR')
    expect(resultat).toHaveProperty('error')
  })
})

describe('claimEvent — 5. aucun SELECT préalable', () => {
  test('la requête d’appropriation est exécutée UNE seule fois', async () => {
    const { thenable, etat } = requete({ data: [{ id: 'evt-1' }], error: null })

    await claimEvent(thenable)

    // Décider sur une lecture antérieure rouvrirait la fenêtre de concurrence
    // que cette fonction ferme : le helper ne consomme qu'un seul énoncé.
    expect(etat.executions).toBe(1)
  })

  test('le helper n’accepte qu’une requête et n’en construit aucune autre', async () => {
    const { thenable, etat } = requete({ data: [], error: null })

    await claimEvent(thenable)

    expect(etat.executions).toBe(1)
    expect(claimEvent.length).toBe(1)
  })
})

describe('claimEvent — 6. aucune journalisation', () => {
  test('ni console.error, ni console.log, ni console.warn', async () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {})
    const log = jest.spyOn(console, 'log').mockImplementation(() => {})
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})

    const { thenable } = requete({ data: null, error: { message: 'boom user@exemple.fr' } })
    await claimEvent(thenable)

    // Le helper RESTITUE l'erreur à l'appelant, qui décide quoi journaliser.
    // Il n'écrit rien lui-même : aucune donnée ne peut fuir par ici.
    expect(err).not.toHaveBeenCalled()
    expect(log).not.toHaveBeenCalled()
    expect(warn).not.toHaveBeenCalled()

    err.mockRestore(); log.mockRestore(); warn.mockRestore()
  })
})

describe('claimEvent — CLAIM_WON n’est PAS EMAIL_SUCCESS', () => {
  test('le helper n’envoie rien et ne connaît aucun transport', async () => {
    const { thenable } = requete({ data: [{ id: 'evt-1' }], error: null })

    const resultat = await claimEvent(thenable)

    // Le résultat ne porte QUE l'issue de l'appropriation : aucun identifiant
    // de message, aucun statut d'envoi. Un crash après CLAIM_WON laisse
    // l'événement approprié SANS e-mail — compromis assumé (K8.12.3 §G).
    expect(Object.keys(resultat)).toEqual(['outcome'])
    expect(resultat).not.toHaveProperty('sent')
    expect(resultat).not.toHaveProperty('messageId')
  })
})
