/**
 * @jest-environment node
 */
// Phase K8.1 — finding K8-06 : la route renvoyait `error.message` de Postgres.
// Phase K8.4 — finding K8-03 : depuis le jeton de panier, une meme adresse peut
// porter PLUSIEURS lignes. Sans deduplication, la meme personne recevrait
// plusieurs rappels dans le meme cycle.
//
// Le double Supabase distingue explicitement SELECT et UPDATE : confondre les
// deux rendrait toute assertion sur la deduplication sans valeur.
//
// AUCUN e-mail reel : @/lib/emails et les deux modules de push sont doubles.

type FakeError = { message: string; code?: string } | null

interface FakeQuery extends PromiseLike<unknown> {
  eq(...args: unknown[]): FakeQuery
  lt(...args: unknown[]): FakeQuery
  limit(...args: unknown[]): FakeQuery
}

/** Journal des operations, pour prouver qui fait quoi et avec quels filtres. */
type Operation = { op: 'select' | 'update'; payload?: unknown; filtres: unknown[][] }

const operations: Operation[] = []

const mockState = {
  cartsResult: { data: [] as unknown[] | null, error: null as FakeError },
  updateError: null as FakeError,
}

const mockSendEmail = jest.fn()
const mockSendPush = jest.fn()
const mockSendWebPush = jest.fn()

function chain(result: unknown, operation: Operation): FakeQuery {
  const query: FakeQuery = {
    eq: (...args: unknown[]) => { operation.filtres.push(['eq', ...args]); return query },
    lt: (...args: unknown[]) => { operation.filtres.push(['lt', ...args]); return query },
    limit: (...args: unknown[]) => { operation.filtres.push(['limit', ...args]); return query },
    then: (onFulfilled, onRejected) => Promise.resolve(result).then(onFulfilled, onRejected),
  }
  return query
}

jest.mock('../../../../lib/supabase/admin', () => ({
  createAdminClient: () => ({
    from: () => ({
      select: () => {
        const op: Operation = { op: 'select', filtres: [] }
        operations.push(op)
        return chain(mockState.cartsResult, op)
      },
      update: (payload: unknown) => {
        const op: Operation = { op: 'update', payload, filtres: [] }
        operations.push(op)
        return chain({ error: mockState.updateError }, op)
      },
    }),
    auth: { admin: { listUsers: async () => ({ data: { users: [] } }) } },
  }),
}))
jest.mock('../../../../lib/emails', () => ({
  sendAbandonedCartEmail: (...a: unknown[]) => mockSendEmail(...a),
}))
jest.mock('../../../../lib/push', () => ({ sendPushToUser: (...a: unknown[]) => mockSendPush(...a) }))
jest.mock('../../../../lib/web-push', () => ({ sendWebPushToUser: (...a: unknown[]) => mockSendWebPush(...a) }))
jest.mock('../../../../lib/env/deployment', () => ({ getPublicBaseUrl: () => 'https://xenotif.com' }))
jest.mock('../../../../lib/boutique/products', () => ({
  PRODUCTS: [{ id: 'd1', name: 'Guide', price_cents: 1900, images: ['/i.jpg'] }],
  formatPrice: (c: number) => `${(c / 100).toFixed(2)} €`,
}))

import { GET } from './route'

const PG_ERROR = { code: '42P01', message: 'relation "public.abandoned_carts" does not exist' }

const panier = (email: string, updatedAt: string, token: string) => ({
  cart_token: token,
  email,
  items: [{ product_id: 'd1', quantity: 1 }],
  locale: 'fr',
  updated_at: updatedAt,
  reminder_sent: false,
  recovered: false,
})

const request = (auth?: string) =>
  new Request('http://localhost/api/cron/abandoned-cart', {
    headers: auth ? { Authorization: auth } : {},
  })

const AUTH = 'Bearer secret-de-test'
const ORIGINAL_ENV = { ...process.env }

/** Adresses réellement destinataires d'un e-mail, dans l'ordre d'envoi. */
const adressesRelancees = () => mockSendEmail.mock.calls.map(c => (c[0] as { email: string }).email)

/** Filtres des UPDATE — prouve sur quelles lignes `reminder_sent` est posé. */
const updates = () => operations.filter(o => o.op === 'update')

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(console, 'error').mockImplementation(() => {})
  operations.length = 0
  process.env = { ...ORIGINAL_ENV, CRON_SECRET: 'secret-de-test' }
  mockState.cartsResult = { data: [], error: null }
  mockState.updateError = null
})

afterAll(() => { process.env = ORIGINAL_ENV })

describe('cron/abandoned-cart — garde CRON_SECRET inchangée', () => {
  test('sans en-tête : 401, aucune requête métier', async () => {
    const res = await GET(request())
    expect(res.status).toBe(401)
    expect(mockSendEmail).not.toHaveBeenCalled()
    expect(operations).toHaveLength(0)
  })

  test('secret erroné : 401', async () => {
    expect((await GET(request('Bearer mauvais'))).status).toBe(401)
    expect(mockSendEmail).not.toHaveBeenCalled()
  })

  test('CRON_SECRET absent de l’environnement : fail-closed, 401', async () => {
    delete process.env.CRON_SECRET
    expect((await GET(request(AUTH))).status).toBe(401)
    expect(mockSendEmail).not.toHaveBeenCalled()
  })
})

describe('cron/abandoned-cart — déduplication par adresse (K8-03)', () => {
  test('deux paniers pour la même adresse : UN SEUL rappel, sur le plus récent', async () => {
    mockState.cartsResult = {
      data: [
        panier('client@exemple.fr', '2026-09-10T08:00:00.000Z', 'tok-ancien'),
        panier('client@exemple.fr', '2026-09-17T08:00:00.000Z', 'tok-recent'),
      ],
      error: null,
    }

    const res = await GET(request(AUTH))

    expect(res.status).toBe(200)
    expect(mockSendEmail).toHaveBeenCalledTimes(1)
    expect(adressesRelancees()).toEqual(['client@exemple.fr'])
    // Le panier retenu est le plus récent : son total provient de ses items.
    expect(await res.json()).toMatchObject({ sent: 1, processed: 1, read: 2 })
  })

  test('l’ordre de lecture n’influence pas le choix : le plus récent gagne', async () => {
    mockState.cartsResult = {
      data: [
        panier('client@exemple.fr', '2026-09-17T08:00:00.000Z', 'tok-recent'),
        panier('client@exemple.fr', '2026-09-10T08:00:00.000Z', 'tok-ancien'),
      ],
      error: null,
    }

    await GET(request(AUTH))
    expect(mockSendEmail).toHaveBeenCalledTimes(1)
  })

  test('les autres adresses éligibles sont bien traitées', async () => {
    mockState.cartsResult = {
      data: [
        panier('a@exemple.fr', '2026-09-10T08:00:00.000Z', 'tok-a1'),
        panier('a@exemple.fr', '2026-09-17T08:00:00.000Z', 'tok-a2'),
        panier('b@exemple.fr', '2026-09-12T08:00:00.000Z', 'tok-b'),
        panier('c@exemple.fr', '2026-09-13T08:00:00.000Z', 'tok-c'),
      ],
      error: null,
    }

    const res = await GET(request(AUTH))

    expect(mockSendEmail).toHaveBeenCalledTimes(3)
    expect(adressesRelancees().sort()).toEqual(['a@exemple.fr', 'b@exemple.fr', 'c@exemple.fr'])
    expect(await res.json()).toMatchObject({ sent: 3, processed: 3, read: 4 })
  })

  test('la casse de l’adresse ne crée pas de doublon', async () => {
    mockState.cartsResult = {
      data: [
        panier('Client@Exemple.FR', '2026-09-10T08:00:00.000Z', 'tok-1'),
        panier('client@exemple.fr', '2026-09-17T08:00:00.000Z', 'tok-2'),
      ],
      error: null,
    }

    await GET(request(AUTH))
    expect(mockSendEmail).toHaveBeenCalledTimes(1)
  })

  test('les UPDATE portent uniquement sur les adresses réellement relancées', async () => {
    mockState.cartsResult = {
      data: [
        panier('a@exemple.fr', '2026-09-10T08:00:00.000Z', 'tok-a1'),
        panier('a@exemple.fr', '2026-09-17T08:00:00.000Z', 'tok-a2'),
        panier('b@exemple.fr', '2026-09-12T08:00:00.000Z', 'tok-b'),
      ],
      error: null,
    }

    await GET(request(AUTH))

    // Deux UPDATE seulement — un par adresse, pas un par ligne lue.
    expect(updates()).toHaveLength(2)
    for (const u of updates()) {
      expect(u.payload).toMatchObject({ reminder_sent: true })
      expect(u.payload).toHaveProperty('reminded_at')
      // Le filtre porte sur l'adresse : toutes les lignes de cette adresse
      // sortent de l'éligibilité, y compris celles non retenues.
      expect(u.filtres[0][0]).toBe('eq')
      expect(u.filtres[0][1]).toBe('email')
    }
    expect(updates().map(u => u.filtres[0][2]).sort()).toEqual(['a@exemple.fr', 'b@exemple.fr'])
  })

  test('le double ne confond jamais SELECT et UPDATE', async () => {
    mockState.cartsResult = { data: [panier('a@exemple.fr', '2026-09-12T08:00:00.000Z', 'tok-a')], error: null }

    await GET(request(AUTH))

    const selects = operations.filter(o => o.op === 'select')
    expect(selects).toHaveLength(1)
    expect(selects[0].payload).toBeUndefined()
    // Le SELECT porte les filtres d'éligibilité, jamais un payload.
    expect(selects[0].filtres.some(f => f[0] === 'lt' && f[1] === 'updated_at')).toBe(true)
    expect(updates()).toHaveLength(1)
    expect(updates()[0].payload).toBeDefined()
  })
})

describe('cron/abandoned-cart — éligibilité', () => {
  test('aucun panier éligible : 200 { sent: 0 }, aucun e-mail, aucun UPDATE', async () => {
    mockState.cartsResult = { data: [], error: null }
    const res = await GET(request(AUTH))

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ sent: 0 })
    expect(mockSendEmail).not.toHaveBeenCalled()
    expect(updates()).toHaveLength(0)
  })

  test('un panier dont les produits n’existent plus n’est pas relancé', async () => {
    mockState.cartsResult = {
      data: [{ ...panier('a@exemple.fr', '2026-09-12T08:00:00.000Z', 'tok-a'), items: [{ product_id: 'inconnu', quantity: 1 }] }],
      error: null,
    }

    await GET(request(AUTH))

    expect(mockSendEmail).not.toHaveBeenCalled()
    expect(updates()).toHaveLength(0)
  })

  test('la sélection filtre reminder_sent, recovered et l’ancienneté', async () => {
    mockState.cartsResult = { data: [panier('a@exemple.fr', '2026-09-12T08:00:00.000Z', 'tok-a')], error: null }

    await GET(request(AUTH))

    const filtres = operations.filter(o => o.op === 'select')[0].filtres
    expect(filtres).toContainEqual(['eq', 'reminder_sent', false])
    expect(filtres).toContainEqual(['eq', 'recovered', false])
    expect(filtres.some(f => f[0] === 'limit' && f[1] === 50)).toBe(true)
  })
})

describe('cron/abandoned-cart — K8-06 : aucun détail Postgres exposé', () => {
  test('erreur base : 500 générique, aucun envoi', async () => {
    mockState.cartsResult = { data: null, error: PG_ERROR }
    const res = await GET(request(AUTH))

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'server_error' })
    expect(mockSendEmail).not.toHaveBeenCalled()
  })

  test('le corps ne contient ni message, ni code, ni nom de table', async () => {
    mockState.cartsResult = { data: null, error: PG_ERROR }
    const body = JSON.stringify(await (await GET(request(AUTH))).json()).toLowerCase()

    for (const fuite of ['relation', 'abandoned_carts', 'does not exist', '42p01']) {
      expect(body).not.toContain(fuite)
    }
  })

  test('le détail complet reste dans les logs serveur', async () => {
    mockState.cartsResult = { data: null, error: PG_ERROR }
    await GET(request(AUTH))

    expect(console.error).toHaveBeenCalledWith('[abandoned-cart] query error:', PG_ERROR)
  })
})
