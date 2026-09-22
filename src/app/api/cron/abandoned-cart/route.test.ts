/**
 * @jest-environment node
 */
// Phase K8.1 — finding K8-06 : la route renvoyait `error.message` de Postgres.
// Phase K8.4 — finding K8-03 : depuis le jeton de panier, une meme adresse peut
// porter PLUSIEURS lignes. Sans deduplication, la meme personne recevrait
// plusieurs rappels dans le meme cycle.
// Phase K8.5 — bascule PK(email) -> PK(id). Trois changements testes ici :
//   1. le marquage porte sur LA LIGNE relancee (`id`), plus sur l'adresse ;
//   2. le departage est un ORDRE TOTAL (updated_at desc, id desc) ;
//   3. le budget de 50 porte sur des DESTINATAIRES DISTINCTS, pas des lignes.
//
// Le double Supabase distingue explicitement SELECT et UPDATE : confondre les
// deux rendrait toute assertion sur la deduplication sans valeur.
//
// AUCUN e-mail reel : @/lib/emails et les deux modules de push sont doubles.

type FakeError = { message: string; code?: string } | null

interface FakeQuery extends PromiseLike<unknown> {
  eq(...args: unknown[]): FakeQuery
  lt(...args: unknown[]): FakeQuery
  order(...args: unknown[]): FakeQuery
  limit(...args: unknown[]): FakeQuery
}

/** Journal des operations, pour prouver qui fait quoi et avec quels filtres. */
type Operation = { op: 'select' | 'update'; payload?: unknown; filtres: unknown[][] }

const operations: Operation[] = []

const mockState = {
  cartsResult: { data: [] as unknown[] | null, error: null as FakeError },
  updateError: null as FakeError,
  // Ajouté en K8.10 : sans compte auth correspondant, `userId` reste indéfini et
  // TOUT le bloc push est sauté — le journal d'échec du push (K8.10-02) serait
  // alors inatteignable. Vide par défaut : les tests antérieurs sont inchangés.
  users: [] as { id: string; email: string }[],
}

const mockSendEmail = jest.fn()
const mockSendPush = jest.fn()
const mockSendWebPush = jest.fn()

function chain(result: unknown, operation: Operation): FakeQuery {
  const query: FakeQuery = {
    eq: (...args: unknown[]) => { operation.filtres.push(['eq', ...args]); return query },
    lt: (...args: unknown[]) => { operation.filtres.push(['lt', ...args]); return query },
    order: (...args: unknown[]) => { operation.filtres.push(['order', ...args]); return query },
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
    auth: { admin: { listUsers: async () => ({ data: { users: mockState.users } }) } },
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

/** Panier eligible. `id` est desormais la cle : il pilote le marquage. */
const panier = (id: string, email: string, updatedAt: string) => ({
  id,
  cart_token: `tok-${id}`,
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

/** Les `id` effectivement marqués. */
const idsMarques = () => updates().map(u => u.filtres[0][2])

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(console, 'error').mockImplementation(() => {})
  operations.length = 0
  process.env = { ...ORIGINAL_ENV, CRON_SECRET: 'secret-de-test' }
  mockState.cartsResult = { data: [], error: null }
  mockState.updateError = null
  mockState.users = []
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

describe('cron/abandoned-cart — un seul rappel par adresse et par cycle', () => {
  test('DEUX paniers pour la même adresse : un seul rappel, sur le plus récent', async () => {
    mockState.cartsResult = {
      data: [
        panier('id-ancien', 'client@exemple.fr', '2026-09-10T08:00:00.000Z'),
        panier('id-recent', 'client@exemple.fr', '2026-09-17T08:00:00.000Z'),
      ],
      error: null,
    }

    const res = await GET(request(AUTH))

    expect(res.status).toBe(200)
    expect(mockSendEmail).toHaveBeenCalledTimes(1)
    expect(adressesRelancees()).toEqual(['client@exemple.fr'])
    expect(await res.json()).toMatchObject({ sent: 1, processed: 1, read: 2 })
  })

  test('TROIS paniers pour la même adresse : un seul rappel, sur le plus récent', async () => {
    mockState.cartsResult = {
      data: [
        panier('id-1', 'client@exemple.fr', '2026-09-10T08:00:00.000Z'),
        panier('id-3', 'client@exemple.fr', '2026-09-16T08:00:00.000Z'),
        panier('id-2', 'client@exemple.fr', '2026-09-12T08:00:00.000Z'),
      ],
      error: null,
    }

    const res = await GET(request(AUTH))

    expect(mockSendEmail).toHaveBeenCalledTimes(1)
    expect(idsMarques()).toEqual(['id-3'])
    expect(await res.json()).toMatchObject({ sent: 1, processed: 1, read: 3 })
  })

  test('l’ordre de lecture n’influence pas le choix : le plus récent gagne', async () => {
    const lignes = [
      panier('id-recent', 'client@exemple.fr', '2026-09-17T08:00:00.000Z'),
      panier('id-ancien', 'client@exemple.fr', '2026-09-10T08:00:00.000Z'),
    ]
    for (const ordre of [lignes, [...lignes].reverse()]) {
      jest.clearAllMocks()
      operations.length = 0
      mockState.cartsResult = { data: ordre, error: null }

      await GET(request(AUTH))

      expect(mockSendEmail).toHaveBeenCalledTimes(1)
      expect(idsMarques()).toEqual(['id-recent'])
    }
  })

  test('la casse de l’adresse ne crée pas de doublon', async () => {
    mockState.cartsResult = {
      data: [
        panier('id-1', 'Client@Exemple.FR', '2026-09-10T08:00:00.000Z'),
        panier('id-2', 'client@exemple.fr', '2026-09-17T08:00:00.000Z'),
      ],
      error: null,
    }

    await GET(request(AUTH))
    expect(mockSendEmail).toHaveBeenCalledTimes(1)
  })

  test('plusieurs adresses distinctes : chacune reçoit son rappel', async () => {
    mockState.cartsResult = {
      data: [
        panier('id-a1', 'a@exemple.fr', '2026-09-10T08:00:00.000Z'),
        panier('id-a2', 'a@exemple.fr', '2026-09-17T08:00:00.000Z'),
        panier('id-b', 'b@exemple.fr', '2026-09-12T08:00:00.000Z'),
        panier('id-c', 'c@exemple.fr', '2026-09-13T08:00:00.000Z'),
      ],
      error: null,
    }

    const res = await GET(request(AUTH))

    expect(mockSendEmail).toHaveBeenCalledTimes(3)
    expect(adressesRelancees().sort()).toEqual(['a@exemple.fr', 'b@exemple.fr', 'c@exemple.fr'])
    expect(idsMarques().sort()).toEqual(['id-a2', 'id-b', 'id-c'])
    expect(await res.json()).toMatchObject({ sent: 3, processed: 3, read: 4 })
  })
})

describe('cron/abandoned-cart — départage déterministe (K8.5)', () => {
  test('horodatages IDENTIQUES : le plus grand `id` gagne, quel que soit l’ordre de lecture', async () => {
    const MEME_INSTANT = '2026-09-15T08:00:00.000Z'
    const lignes = [
      panier('id-aaa', 'client@exemple.fr', MEME_INSTANT),
      panier('id-zzz', 'client@exemple.fr', MEME_INSTANT),
    ]

    for (const ordre of [lignes, [...lignes].reverse()]) {
      jest.clearAllMocks()
      operations.length = 0
      mockState.cartsResult = { data: ordre, error: null }

      await GET(request(AUTH))

      expect(mockSendEmail).toHaveBeenCalledTimes(1)
      // Sans départage, ce choix dépendrait de l'ordre rendu par Postgres.
      expect(idsMarques()).toEqual(['id-zzz'])
    }
  })

  test('la requête exprime un ordre total et une borne de lecture', async () => {
    mockState.cartsResult = { data: [panier('id-a', 'a@exemple.fr', '2026-09-12T08:00:00.000Z')], error: null }

    await GET(request(AUTH))

    const filtres = operations.filter(o => o.op === 'select')[0].filtres
    expect(filtres).toContainEqual(['order', 'updated_at', { ascending: false }])
    expect(filtres).toContainEqual(['order', 'id', { ascending: false }])
    expect(filtres.some(f => f[0] === 'limit')).toBe(true)
  })
})

describe('cron/abandoned-cart — budget de 50 DESTINATAIRES, pas 50 lignes (K8.5)', () => {
  test('90 lignes concentrées sur 3 adresses : 3 rappels, pas 50', async () => {
    const data = []
    for (const email of ['a@exemple.fr', 'b@exemple.fr', 'c@exemple.fr']) {
      for (let i = 0; i < 30; i++) {
        data.push(panier(`id-${email}-${String(i).padStart(2, '0')}`, email, `2026-09-${String(i + 1).padStart(2, '0')}T08:00:00.000Z`))
      }
    }
    mockState.cartsResult = { data, error: null }

    const res = await GET(request(AUTH))

    expect(mockSendEmail).toHaveBeenCalledTimes(3)
    expect(await res.json()).toMatchObject({ sent: 3, processed: 3, read: 90 })
    // Une seule ligne marquée par adresse : la plus récente (i = 29).
    expect(idsMarques().sort()).toEqual([
      'id-a@exemple.fr-29', 'id-b@exemple.fr-29', 'id-c@exemple.fr-29',
    ])
  })

  test('60 adresses distinctes : exactement 50 destinataires servis', async () => {
    const data = Array.from({ length: 60 }, (_, i) =>
      panier(`id-${String(i).padStart(2, '0')}`, `client${String(i).padStart(2, '0')}@exemple.fr`, '2026-09-12T08:00:00.000Z'))
    mockState.cartsResult = { data, error: null }

    const res = await GET(request(AUTH))

    expect(mockSendEmail).toHaveBeenCalledTimes(50)
    expect(new Set(adressesRelancees()).size).toBe(50)
    expect(await res.json()).toMatchObject({ sent: 50, processed: 50, read: 60 })
  })

  test('une adresse bavarde ne prive pas les autres du budget', async () => {
    const data = [
      ...Array.from({ length: 55 }, (_, i) =>
        panier(`id-bav-${String(i).padStart(2, '0')}`, 'bavarde@exemple.fr', `2026-09-${String((i % 28) + 1).padStart(2, '0')}T08:00:00.000Z`)),
      panier('id-autre-1', 'autre1@exemple.fr', '2026-09-11T08:00:00.000Z'),
      panier('id-autre-2', 'autre2@exemple.fr', '2026-09-11T08:00:00.000Z'),
    ]
    mockState.cartsResult = { data, error: null }

    await GET(request(AUTH))

    // 3 destinataires : la bavarde compte pour UN, les deux autres sont servis.
    expect(adressesRelancees().sort()).toEqual(['autre1@exemple.fr', 'autre2@exemple.fr', 'bavarde@exemple.fr'])
  })
})

describe('cron/abandoned-cart — marquage de la SEULE ligne relancée (K8.5)', () => {
  test('les UPDATE filtrent sur `id`, jamais sur `email`', async () => {
    mockState.cartsResult = {
      data: [
        panier('id-a1', 'a@exemple.fr', '2026-09-10T08:00:00.000Z'),
        panier('id-a2', 'a@exemple.fr', '2026-09-17T08:00:00.000Z'),
        panier('id-b', 'b@exemple.fr', '2026-09-12T08:00:00.000Z'),
      ],
      error: null,
    }

    await GET(request(AUTH))

    expect(updates()).toHaveLength(2)
    for (const u of updates()) {
      expect(u.payload).toMatchObject({ reminder_sent: true })
      expect(u.payload).toHaveProperty('reminded_at')
      expect(u.filtres[0][0]).toBe('eq')
      expect(u.filtres[0][1]).toBe('id')
    }
    expect(JSON.stringify(updates().map(u => u.filtres))).not.toContain('email')
  })

  test('un panier NON retenu n’est pas marqué : il reste éligible pour un cycle futur', async () => {
    mockState.cartsResult = {
      data: [
        panier('id-ecarte', 'client@exemple.fr', '2026-09-10T08:00:00.000Z'),
        panier('id-retenu', 'client@exemple.fr', '2026-09-17T08:00:00.000Z'),
      ],
      error: null,
    }

    await GET(request(AUTH))

    expect(idsMarques()).toEqual(['id-retenu'])
    // C'est tout l'objet du changement K8.5 : `id-ecarte` n'a jamais fait
    // l'objet d'un envoi, il ne doit donc pas porter un `reminded_at` mensonger.
    expect(idsMarques()).not.toContain('id-ecarte')
  })

  test('deux paniers du même email ne produisent JAMAIS deux rappels dans le même cycle', async () => {
    mockState.cartsResult = {
      data: [
        panier('id-1', 'client@exemple.fr', '2026-09-10T08:00:00.000Z'),
        panier('id-2', 'client@exemple.fr', '2026-09-17T08:00:00.000Z'),
      ],
      error: null,
    }

    await GET(request(AUTH))

    expect(mockSendEmail).toHaveBeenCalledTimes(1)
    expect(updates()).toHaveLength(1)
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
      data: [{ ...panier('id-a', 'a@exemple.fr', '2026-09-12T08:00:00.000Z'), items: [{ product_id: 'inconnu', quantity: 1 }] }],
      error: null,
    }

    await GET(request(AUTH))

    expect(mockSendEmail).not.toHaveBeenCalled()
    expect(updates()).toHaveLength(0)
  })

  test('la sélection filtre reminder_sent, recovered et l’ancienneté', async () => {
    mockState.cartsResult = { data: [panier('id-a', 'a@exemple.fr', '2026-09-12T08:00:00.000Z')], error: null }

    await GET(request(AUTH))

    const filtres = operations.filter(o => o.op === 'select')[0].filtres
    expect(filtres).toContainEqual(['eq', 'reminder_sent', false])
    expect(filtres).toContainEqual(['eq', 'recovered', false])
    expect(filtres.some(f => f[0] === 'lt' && f[1] === 'updated_at')).toBe(true)
  })

  test('le double ne confond jamais SELECT et UPDATE', async () => {
    mockState.cartsResult = { data: [panier('id-a', 'a@exemple.fr', '2026-09-12T08:00:00.000Z')], error: null }

    await GET(request(AUTH))

    const selects = operations.filter(o => o.op === 'select')
    expect(selects).toHaveLength(1)
    expect(selects[0].payload).toBeUndefined()
    expect(updates()).toHaveLength(1)
    expect(updates()[0].payload).toBeDefined()
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

// ── Phase K8.10 — findings K8.10-01 (envoi) et K8.10-02 (push).
//
// Les deux journaux d'échec interpolaient `${cart.email}` : une adresse en clair
// écrite dans les logs serveur. Ils portent désormais `cart.id`, clé primaire
// depuis K8.5 — la corrélation reste entière via la base, sans donnée
// personnelle. L'exception, elle, continue d'être transmise.
//
// Ces deux chemins n'étaient couverts par AUCUN test : la suite K8.1/K8.4/K8.5
// n'assertait qu'un seul message, celui de l'erreur de requête (ligne 66).

const ADRESSE = 'client@exemple.fr'

/**
 * Tous les arguments passés à console.error, aplatis.
 *
 * Les objets sont sérialisés en JSON, JAMAIS via String() : `String(objet)`
 * rendrait « [object Object] » et masquerait précisément la fuite que ces tests
 * doivent détecter — l'assertion passerait alors à tort.
 */
const journal = () =>
  (console.error as jest.Mock).mock.calls
    .map((args: unknown[]) =>
      args
        .map(a => {
          if (a instanceof Error) return `${a.name}: ${a.message}`
          if (typeof a === 'object' && a !== null) return JSON.stringify(a)
          return String(a)
        })
        .join(' '),
    )
    .join(' | ')

describe('cron/abandoned-cart — K8.10 : aucune adresse dans les journaux', () => {
  beforeEach(() => {
    // `clearAllMocks` n'efface que les appels, pas les implémentations : on les
    // repose explicitement pour qu'un `mockRejectedValue` ne fuite pas d'un test
    // à l'autre.
    mockSendEmail.mockResolvedValue(undefined)
    mockSendWebPush.mockResolvedValue(0)
    mockSendPush.mockResolvedValue(0)

    mockState.cartsResult = {
      data: [panier('id-a', ADRESSE, '2026-09-12T08:00:00.000Z')],
      error: null,
    }
    mockState.users = [{ id: 'user-1', email: ADRESSE }]
  })

  test('K8.10-01 — un envoi qui échoue journalise `cart.id`, jamais l’adresse', async () => {
    const erreur = new Error('SMTP 550 mailbox unavailable')
    mockSendEmail.mockRejectedValue(erreur)

    await GET(request(AUTH))

    expect(console.error).toHaveBeenCalledWith('[abandoned-cart] envoi echoue :', 'id-a', erreur)
    expect(journal()).not.toContain(ADRESSE)
    expect(journal()).not.toContain('exemple.fr')
  })

  test('K8.10-02 — un push qui échoue journalise `cart.id`, jamais l’adresse', async () => {
    const erreur = new Error('VAPID 403 unauthorized registration')
    mockSendWebPush.mockRejectedValue(erreur)

    await GET(request(AUTH))

    expect(console.error).toHaveBeenCalledWith('[abandoned-cart] push echoue :', 'id-a', erreur)
    expect(journal()).not.toContain(ADRESSE)
    expect(journal()).not.toContain('exemple.fr')
  })

  test('le jeton de capacité `cart_token` n’est JAMAIS journalisé', async () => {
    mockSendEmail.mockRejectedValue(new Error('boom'))
    mockSendWebPush.mockRejectedValue(new Error('boom'))

    await GET(request(AUTH))

    // `panier()` pose `cart_token: 'tok-id-a'`. Le journaliser serait PIRE que
    // l'adresse : c'est la preuve de propriété d'un panier (UNIQUE, NOT NULL).
    expect(journal()).not.toContain('tok-id-a')
    expect(journal()).not.toContain('cart_token')
  })

  test('l’objet `err` reste transmis au journal : le diagnostic n’est pas réduit', async () => {
    const erreur = new Error('detail technique a conserver')
    mockSendEmail.mockRejectedValue(erreur)

    await GET(request(AUTH))

    const appel = (console.error as jest.Mock).mock.calls.find(
      (a: unknown[]) => a[0] === '[abandoned-cart] envoi echoue :',
    )
    expect(appel?.[2]).toBe(erreur)
  })

  test('aucun secret ni en-tête d’autorisation ne figure dans les journaux', async () => {
    mockSendEmail.mockRejectedValue(new Error('boom'))
    mockSendWebPush.mockRejectedValue(new Error('boom'))

    await GET(request(AUTH))

    for (const fuite of ['secret-de-test', 'CRON_SECRET', 'Authorization', 'Bearer']) {
      expect(journal()).not.toContain(fuite)
    }
  })

  test('la réponse HTTP reste inchangée malgré les deux échecs', async () => {
    mockSendEmail.mockRejectedValue(new Error('boom'))
    mockSendWebPush.mockRejectedValue(new Error('boom'))

    const res = await GET(request(AUTH))

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ sent: 0, pushed: 0, processed: 1, read: 1 })
  })

  test('nominal : aucun échec, donc aucun journal d’erreur', async () => {
    const res = await GET(request(AUTH))

    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ sent: 1, processed: 1, read: 1 })
    expect(console.error).not.toHaveBeenCalled()
  })
})
