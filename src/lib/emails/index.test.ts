/**
 * @jest-environment node
 */
// Phase K8.11 — finding K8.11-01.
//
// Le SDK Resend NE LÈVE PAS sur refus d'API : `emails.send` retourne
// `{ data: null, error: ErrorResponse }`. Les dix fonctions faisaient un `await`
// nu, donc un quota dépassé ou une adresse refusée se présentait comme un
// succès — et les crons marquaient ensuite la ligne « envoyée », supprimant
// définitivement toute relance (K8.11-02).
//
// Ce fichier est le PREMIER test du module : il n'en existait aucun.
//
// AUCUN envoi réel : le SDK est doublé. Aucun appel réseau.

const mockSend = jest.fn()

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({ emails: { send: (...a: unknown[]) => mockSend(...a) } })),
}))
// Évalué au CHARGEMENT du module : sans cette doublure, l'import échouerait.
jest.mock('../env/deployment', () => ({ getPublicBaseUrl: () => 'https://xenotif.test' }))
jest.mock('../boutique/products', () => ({ getProductById: () => undefined }))
// `sendThemedDailyEmail` fait `c.ctaUrl.startsWith('http')` : omettre `ctaUrl`
// lèverait un TypeError et ferait passer les tests d'erreur pour une mauvaise
// raison. La doublure rend donc la forme COMPLÈTE réellement consommée.
jest.mock('../campaigns', () => ({
  getCampaignEmail: () => ({
    subject: 'Sujet',
    headline: 'Titre',
    body: 'Corps',
    cta: 'Action',
    ctaUrl: '/boutique',
  }),
}))

import {
  EmailSendError,
  sendWelcomeEmail,
  sendTrialReminderEmail,
  sendDailyMotivationEmail,
  sendThemedDailyEmail,
  sendCancellationEmail,
  sendReactivationEmail,
  sendOnboardingEmail,
  sendAbandonedCartEmail,
  sendDigitalDeliveryEmail,
  sendAccountCreatedEmail,
} from './index'

const ADRESSE = 'destinataire@exemple.fr'

/** Refus d'API tel que Resend le retourne — SANS lever. */
const REFUS_API = {
  data: null,
  error: { message: 'simulated resend failure', statusCode: 429, name: 'rate_limit_exceeded' },
}

const SUCCES = { data: { id: 'test-id' }, error: null }

/**
 * Les DIX fonctions exportées, avec des arguments réellement typés.
 * `sendDigitalDeliveryEmail` exige un `items` NON VIDE : il retourne avant
 * l'envoi quand la liste est vide (garde ligne 841).
 */
const FONCTIONS: [string, () => Promise<void>][] = [
  ['sendWelcomeEmail', () => sendWelcomeEmail({ email: ADRESSE, name: 'Dave', setupLink: 'https://xenotif.test/d' })],
  ['sendTrialReminderEmail', () => sendTrialReminderEmail({ email: ADRESSE, name: 'Dave', daysLeft: 3 })],
  ['sendDailyMotivationEmail', () => sendDailyMotivationEmail({ email: ADRESSE, name: 'Dave' })],
  ['sendThemedDailyEmail', () => sendThemedDailyEmail({ email: ADRESSE, name: 'Dave', theme: 'boutique' })],
  ['sendCancellationEmail', () => sendCancellationEmail({ email: ADRESSE, name: 'Dave' })],
  ['sendReactivationEmail', () => sendReactivationEmail({ email: ADRESSE, name: 'Dave' })],
  ['sendOnboardingEmail', () => sendOnboardingEmail({ email: ADRESSE, name: 'Dave', step: 1 })],
  ['sendAbandonedCartEmail', () => sendAbandonedCartEmail({
    email: ADRESSE,
    items: [{ name: 'Guide', price: '19,00 €', image: '/i.jpg' }],
    total: '19,00 €',
    recoverUrl: 'https://xenotif.test/boutique/panier',
  })],
  ['sendDigitalDeliveryEmail', () => sendDigitalDeliveryEmail({
    email: ADRESSE,
    name: 'Dave',
    sessionId: 'cs_test_123',
    items: [{ id: 'd1', name: 'Guide' }],
  })],
  ['sendAccountCreatedEmail', () => sendAccountCreatedEmail({ email: ADRESSE, name: 'Dave' })],
]

/**
 * Capture l'erreur d'un appel qui DOIT rejeter.
 *
 * Écrit ainsi plutôt qu'en `.catch(e => e)` : les fonctions renvoyant
 * `Promise<void>`, le résultat serait typé `void | Error` et les assertions
 * anti-fuite ne compileraient pas. Surtout, un appel qui se RÉSOUDRAIT — le
 * défaut même que cette phase corrige — échoue ici explicitement au lieu de
 * rendre la suite d'assertions sans objet.
 */
async function erreurDe(appel: () => Promise<void>): Promise<Error> {
  try {
    await appel()
  } catch (e) {
    return e as Error
  }
  throw new Error('l’appel s’est résolu alors qu’un rejet était attendu')
}

beforeEach(() => {
  jest.clearAllMocks()
  mockSend.mockResolvedValue(SUCCES)
})

describe('A — succès : { data, error: null } résout', () => {
  test.each(FONCTIONS)('%s résout et appelle Resend une fois', async (_nom, appel) => {
    await expect(appel()).resolves.toBeUndefined()
    expect(mockSend).toHaveBeenCalledTimes(1)
  })
})

describe('B — refus d’API : { data: null, error } REJETTE (K8.11-01)', () => {
  test.each(FONCTIONS)('%s rejette au lieu de faire croire au succès', async (_nom, appel) => {
    mockSend.mockResolvedValue(REFUS_API)

    // Sans la correction, cet appel se RÉSOLVAIT : c'est tout le défaut.
    await expect(appel()).rejects.toThrow(EmailSendError)
  })

  test('l’erreur porte le code et le statut du fournisseur', async () => {
    mockSend.mockResolvedValue(REFUS_API)

    await expect(sendAccountCreatedEmail({ email: ADRESSE, name: 'Dave' })).rejects.toMatchObject({
      name: 'EmailSendError',
      code: 'rate_limit_exceeded',
      statusCode: 429,
    })
  })

  test('le détail brut du fournisseur reste disponible pour le diagnostic', async () => {
    mockSend.mockResolvedValue(REFUS_API)

    const erreur = await erreurDe(() => sendAccountCreatedEmail({ email: ADRESSE, name: 'Dave' }))
    expect((erreur as EmailSendError).providerError).toEqual(REFUS_API.error)
  })
})

describe('C — exception de transport : le rejet est propagé', () => {
  test.each(FONCTIONS)('%s propage une panne réseau', async (_nom, appel) => {
    mockSend.mockRejectedValue(new Error('network failure'))

    await expect(appel()).rejects.toThrow('network failure')
  })
})

describe('D — aucune fuite dans les messages d’erreur produits par notre code', () => {
  test.each(FONCTIONS)('%s : le message ne contient ni adresse ni secret', async (_nom, appel) => {
    mockSend.mockResolvedValue(REFUS_API)

    const erreur = await erreurDe(appel)

    // Le message est bâti à partir du seul couple (name, statusCode) : il ne
    // peut PAS porter de donnée personnelle, par construction.
    for (const fuite of [ADRESSE, 'exemple.fr', 'destinataire', '@', 'cle-de-test', 'RESEND_API_KEY', 'Authorization', 'Bearer']) {
      expect(erreur.message).not.toContain(fuite)
    }
    expect(erreur.message).toContain('rate_limit_exceeded')
    expect(erreur.message).toContain('429')
  })

  test('le message du fournisseur n’est PAS recopié dans le message de notre erreur', async () => {
    // Un message fournisseur peut réécho l'adresse (« invalid `to` field »).
    mockSend.mockResolvedValue({
      data: null,
      error: { message: `invalid to field: ${ADRESSE}`, statusCode: 422, name: 'validation_error' },
    })

    const erreur = await erreurDe(() => sendAccountCreatedEmail({ email: ADRESSE, name: 'Dave' }))

    expect(erreur.message).not.toContain(ADRESSE)
    expect(erreur.message).not.toContain('invalid to field')
  })
})

describe('le contenu des e-mails est inchangé', () => {
  test('destinataire, expéditeur et sujet sont transmis tels quels', async () => {
    await sendAccountCreatedEmail({ email: ADRESSE, name: 'Dave' })

    const charge = mockSend.mock.calls[0][0] as { from: string; to: string; subject: string; html: string }
    expect(charge.to).toBe(ADRESSE)
    expect(charge.from).toBe('Xenotif® <noreply@xenotif.com>')
    expect(typeof charge.subject).toBe('string')
    expect(charge.html).toContain('<!DOCTYPE html')
  })

  test('la garde « aucun article » de sendDigitalDeliveryEmail est préservée', async () => {
    await expect(sendDigitalDeliveryEmail({
      email: ADRESSE, name: 'Dave', sessionId: 'cs_test_123', items: [],
    })).resolves.toBeUndefined()

    expect(mockSend).not.toHaveBeenCalled()
  })
})
