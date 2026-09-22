/**
 * @jest-environment node
 */
// Phase K8.12 — helper extrait de webhook/stripe/route.ts, où il couvrait déjà
// 8 écritures en Production. Ces tests verrouillent son comportement EXACT,
// afin que l'extraction ne puisse pas régresser le webhook.

import { assertNoError } from './errors'

describe('assertNoError — succès', () => {
  test('error === null : ne lève pas', () => {
    expect(() => assertNoError('libellé', null)).not.toThrow()
  })

  test('ne retourne rien (void)', () => {
    expect(assertNoError('libellé', null)).toBeUndefined()
  })
})

describe('assertNoError — erreur', () => {
  test('error non nul : lève', () => {
    expect(() => assertNoError('marquage du panier relancé', { message: 'permission denied' })).toThrow()
  })

  test('le message conserve le format historique `${label} : ${error.message}`', () => {
    // Format repris À L'IDENTIQUE de l'implémentation d'origine — séparateur
    // espace-deux-points-espace. Toute divergence changerait les journaux des
    // 8 appels du webhook Stripe.
    expect(() => assertNoError('lecture abonnement', { message: 'relation does not exist' }))
      .toThrow('lecture abonnement : relation does not exist')
  })

  test('lève bien une Error, pas une valeur nue', () => {
    let capturee: unknown
    try {
      assertNoError('libellé', { message: 'boom' })
    } catch (e) {
      capturee = e
    }
    expect(capturee).toBeInstanceOf(Error)
  })
})

describe('assertNoError — aucune fuite dans le message', () => {
  test('le message ne contient que le libellé et le message fournisseur', () => {
    const erreur = (() => {
      try {
        assertNoError('marquage de la relance', { message: 'new row violates row-level security policy' })
        return null
      } catch (e) {
        return e as Error
      }
    })()

    expect(erreur).not.toBeNull()
    for (const fuite of ['SUPABASE_SERVICE_ROLE_KEY', 'CRON_SECRET', 'Authorization', 'Bearer', 'eyJ', 'sk_live', 'sk_test', '@']) {
      expect(erreur!.message).not.toContain(fuite)
    }
  })

  test('le helper ne journalise rien de lui-même', () => {
    const espion = jest.spyOn(console, 'error').mockImplementation(() => {})
    try {
      assertNoError('libellé', { message: 'boom' })
    } catch {
      // attendu
    }
    expect(espion).not.toHaveBeenCalled()
    espion.mockRestore()
  })
})
