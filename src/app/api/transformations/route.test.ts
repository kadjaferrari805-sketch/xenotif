/**
 * @jest-environment node
 */
// Environnement Node : le Route Handler importe `next/server` et manipule
// FormData/File, qui exigent les globals Fetch API natifs a Node.
//
// MOCK STORAGE LOCAL. src/test/fake-supabase.ts ne simule aucun Storage (ni
// upload, ni remove, ni getPublicUrl) et sa chaine `select` ignore `order` et
// `limit`. Plutot que d'elargir un utilitaire partage par une dizaine de tests
// pour le seul besoin des transformations, le double vit ici, au contact des
// assertions qu'il sert.
import { NextRequest } from 'next/server'

type FakeError = { message: string } | null

interface FakeQuery extends PromiseLike<unknown> {
  eq(...args: unknown[]): FakeQuery
  order(...args: unknown[]): FakeQuery
  limit(...args: unknown[]): FakeQuery
}

/**
 * Journal ordonne des operations reellement executees. Il sert a prouver une
 * SEQUENCE — « la limitation precede le televersement » — et pas seulement un
 * resultat final : un test qui verifie l'absence d'upload ne dirait pas si la
 * limitation est passee avant ou apres la lecture du corps multipart.
 */
let journal: string[] = []

const mockState = {
  user: null as { id: string } | null,
  selectResult: { data: null as unknown[] | null, error: null as FakeError },
  insertResult: { error: null as FakeError },
  uploadFailAt: null as 'before' | 'after' | null,
  removeResult: { error: null as FakeError },
  removeThrows: false,
  serviceThrows: false,
  uploaded: [] as string[],
  removed: [] as string[][],
  inserted: [] as Record<string, unknown>[],
}

function chain(result: unknown): FakeQuery {
  const query: FakeQuery = {
    eq: () => query,
    order: () => query,
    limit: () => query,
    then: (onFulfilled, onRejected) => Promise.resolve(result).then(onFulfilled, onRejected),
  }
  return query
}

const mockService = {
  from: () => ({
    select: () => chain(mockState.selectResult),
    insert: (payload: Record<string, unknown>) => {
      journal.push('insert')
      mockState.inserted.push(payload)
      return chain(mockState.insertResult)
    },
  }),
  storage: {
    from: () => ({
      upload: async (path: string) => {
        const which = path.includes('-before.') ? 'before' : 'after'
        journal.push(`upload:${which}`)
        mockState.uploaded.push(path)
        return mockState.uploadFailAt === which
          ? { error: { message: 'storage indisponible' } }
          : { error: null }
      },
      remove: async (paths: string[]) => {
        journal.push('remove')
        if (mockState.removeThrows) throw new Error('storage injoignable')
        mockState.removed.push(paths)
        return mockState.removeResult
      },
      getPublicUrl: (path: string) => ({ data: { publicUrl: `https://cdn.test/transformations/${path}` } }),
    }),
  },
}

jest.mock('../../../lib/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: async () => ({ data: { user: mockState.user } }) },
  }),
  createServiceClient: async () => {
    if (mockState.serviceThrows) throw new Error('configuration Supabase absente')
    return mockService
  },
}))

import { InMemoryRateLimitStore, setRateLimitStore } from '../../../lib/security/rate-limit-store'
import { RateLimitStoreUnavailable, type RateLimitStore } from '../../../lib/security/rate-limit'
import { GET, POST } from './route'

/** Store reel, instrumente pour dater le passage de la limitation. */
function journalStore(inner: RateLimitStore): RateLimitStore {
  return {
    hit: async (key, windowSeconds) => {
      journal.push('ratelimit')
      return inner.hit(key, windowSeconds)
    },
  }
}

const imageFile = (name: string, type = 'image/jpeg', bytes = 1024) =>
  new File([new Uint8Array(bytes)], name, { type })

function postRequest(
  fields: Record<string, string | File | null> = {},
  ip: string | null = '203.0.113.7',
): NextRequest {
  const merged: Record<string, string | File | null> = {
    before: imageFile('avant.jpg'),
    after: imageFile('apres.jpg'),
    consent: 'true',
    caption: 'Six mois de travail',
    weeks: '24',
    displayName: 'Alex',
    ...fields,
  }
  const body = new FormData()
  for (const [key, value] of Object.entries(merged)) {
    if (value !== null) body.set(key, value as string | Blob)
  }
  const headers: Record<string, string> = {}
  if (ip) headers['x-forwarded-for'] = ip
  return new NextRequest('http://localhost/api/transformations', { method: 'POST', body, headers })
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(console, 'error').mockImplementation(() => {})
  journal = []
  mockState.user = { id: 'user-1' }
  mockState.selectResult = { data: null, error: null }
  mockState.insertResult = { error: null }
  mockState.uploadFailAt = null
  mockState.removeResult = { error: null }
  mockState.removeThrows = false
  mockState.serviceThrows = false
  mockState.uploaded = []
  mockState.removed = []
  mockState.inserted = []
  setRateLimitStore(journalStore(new InMemoryRateLimitStore()))
})

afterAll(() => setRateLimitStore(null))

// ---------------------------------------------------------------------- GET

describe('GET /api/transformations — une panne n’est pas une liste vide', () => {
  test('A. table vide : 200 et une liste vide (etat legitime)', async () => {
    mockState.selectResult = { data: [], error: null }
    const res = await GET()

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ items: [] })
  })

  test('B. avec donnees : les lignes sont exposees avec leurs URL publiques', async () => {
    mockState.selectResult = {
      data: [{ id: 't1', display_name: 'Alex', before_path: 'user-1/a-before.jpg', after_path: 'user-1/a-after.jpg', caption: 'Top', weeks: 12 }],
      error: null,
    }
    const res = await GET()

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      items: [{
        id: 't1', displayName: 'Alex', caption: 'Top', weeks: 12,
        beforeUrl: 'https://cdn.test/transformations/user-1/a-before.jpg',
        afterUrl: 'https://cdn.test/transformations/user-1/a-after.jpg',
      }],
    })
  })

  test('C. erreur base : 503 explicite, JAMAIS 200 avec une liste vide', async () => {
    mockState.selectResult = { data: null, error: { message: 'relation "transformations" does not exist' } }
    const res = await GET()

    expect(res.status).toBe(503)
    const body = await res.json()
    expect(body.items).toBeUndefined()
    expect(console.error).toHaveBeenCalled()
  })

  test('C bis. client Supabase indisponible : 503, pas de liste vide', async () => {
    mockState.serviceThrows = true
    const res = await GET()

    expect(res.status).toBe(503)
    expect((await res.json()).items).toBeUndefined()
  })

  test('le corps d’erreur ne divulgue ni message Postgres ni nom de table', async () => {
    mockState.selectResult = { data: null, error: { message: 'relation "transformations" does not exist' } }
    const body = JSON.stringify(await (await GET()).json())

    expect(body).not.toContain('relation')
    expect(body).not.toContain('transformations')
  })
})

// --------------------------------------------------------------------- POST

describe('POST /api/transformations — authentification', () => {
  test('D. visiteur non authentifie : 401, aucun televersement', async () => {
    mockState.user = null
    const res = await POST(postRequest())

    expect(res.status).toBe(401)
    expect(mockState.uploaded).toEqual([])
    expect(mockState.inserted).toEqual([])
  })
})

describe('POST /api/transformations — envoi nominal', () => {
  test('E. envoi valide : 200, un couple de fichiers et une ligne en attente', async () => {
    const res = await POST(postRequest())

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(mockState.uploaded).toHaveLength(2)
    expect(mockState.inserted).toHaveLength(1)
  })

  test('la ligne inseree est en attente de moderation et rattachee a la session', async () => {
    await POST(postRequest())
    const row = mockState.inserted[0]

    expect(row.status).toBe('pending')
    expect(row.consent).toBe(true)
    expect(row.user_id).toBe('user-1')
    expect(row.caption).toBe('Six mois de travail')
    expect(row.weeks).toBe(24)
    expect(row.display_name).toBe('Alex')
  })

  test('les fichiers sont cloisonnes sous l’ID du compte de la session', async () => {
    mockState.user = { id: 'user-42' }
    await POST(postRequest({ displayName: '../../autre-compte' }))

    for (const path of mockState.uploaded) {
      expect(path.startsWith('user-42/')).toBe(true)
      expect(path).not.toContain('..')
    }
  })
})

describe('POST /api/transformations — validation', () => {
  test('consentement absent : 400, aucun televersement', async () => {
    const res = await POST(postRequest({ consent: 'false' }))

    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'consent' })
    expect(mockState.uploaded).toEqual([])
  })

  test('fichier manquant ou type non-image : 400, aucun televersement', async () => {
    expect((await POST(postRequest({ before: null }))).status).toBe(400)
    expect((await POST(postRequest({ after: new File(['x'], 'doc.pdf', { type: 'application/pdf' }) }))).status).toBe(400)
    expect(mockState.uploaded).toEqual([])
  })

  test('image au-dela de 5 Mo : 400, aucun televersement', async () => {
    const res = await POST(postRequest({ before: imageFile('enorme.jpg', 'image/jpeg', 5 * 1024 * 1024 + 1) }))

    expect(res.status).toBe(400)
    expect(mockState.uploaded).toEqual([])
  })
})

describe('POST /api/transformations — limitation de debit (K.5 reutilise)', () => {
  test('F. au-dela de la limite par compte : 429, aucun televersement', async () => {
    for (let i = 0; i < 5; i++) await POST(postRequest())
    mockState.uploaded = []

    const res = await POST(postRequest())

    expect(res.status).toBe(429)
    expect(mockState.uploaded).toEqual([])
    expect(mockState.inserted).toHaveLength(5)
    expect(Number(res.headers.get('Retry-After'))).toBeGreaterThan(0)
  })

  test('changer d’IP ne contourne pas la borne par compte', async () => {
    for (let i = 0; i < 5; i++) await POST(postRequest({}, `203.0.113.${i}`))

    const res = await POST(postRequest({}, '198.51.100.1'))
    expect(res.status).toBe(429)
  })

  test('un autre compte depuis la meme IP reste servi', async () => {
    for (let i = 0; i < 5; i++) await POST(postRequest())

    mockState.user = { id: 'user-2' }
    expect((await POST(postRequest())).status).toBe(200)
  })

  test('G. la limitation precede le televersement, pas l’inverse', async () => {
    await POST(postRequest())
    expect(journal[0]).toBe('ratelimit')
    expect(journal.indexOf('ratelimit')).toBeLessThan(journal.indexOf('upload:before'))

    // Et lorsqu’elle refuse, aucun octet n’atteint le Storage : la requete
    // s’arrete sur la limitation, sans televersement ni insertion. On n’assiste
    // pas sur le NOMBRE d’appels au compteur — K.5 en emet un par dimension,
    // compte et IP — mais sur la nature des operations effectuees.
    for (let i = 0; i < 5; i++) await POST(postRequest())
    journal = []
    await POST(postRequest())

    expect(journal.length).toBeGreaterThan(0)
    expect(journal.every(operation => operation === 'ratelimit')).toBe(true)
  })

  test('compteur injoignable : fail-closed, aucun televersement', async () => {
    setRateLimitStore({ hit: async () => { throw new RateLimitStoreUnavailable() } })
    const res = await POST(postRequest())

    expect(res.status).toBe(429)
    expect(mockState.uploaded).toEqual([])
  })

  test('la reponse 429 ne divulgue ni limite ni dimension', async () => {
    for (let i = 0; i < 5; i++) await POST(postRequest())
    const body = JSON.stringify(await (await POST(postRequest())).json())

    for (const fuite of ['rate_limit', 'bucket', 'user_id', 'postgres', 'supabase']) {
      expect(body.toLowerCase()).not.toContain(fuite)
    }
  })
})

describe('POST /api/transformations — nettoyage des fichiers orphelins', () => {
  test('H. echec du televersement « avant » : ni second fichier, ni insertion, ni menage', async () => {
    mockState.uploadFailAt = 'before'
    const res = await POST(postRequest())

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'upload_failed' })
    expect(mockState.uploaded).toEqual([expect.stringContaining('-before.')])
    expect(mockState.inserted).toEqual([])
    expect(mockState.removed).toEqual([]) // rien n’a ete ecrit : rien a reprendre
  })

  test('I. echec du televersement « apres » : le fichier « avant » est repris', async () => {
    mockState.uploadFailAt = 'after'
    const res = await POST(postRequest())

    expect(res.status).toBe(500)
    expect(mockState.inserted).toEqual([])
    expect(mockState.removed).toHaveLength(1)
    expect(mockState.removed[0]).toHaveLength(1)
    expect(mockState.removed[0][0]).toContain('-before.')
  })

  test('J. echec de l’insertion : les DEUX fichiers sont repris', async () => {
    mockState.insertResult = { error: { message: 'insert refuse' } }
    const res = await POST(postRequest())

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'insert_failed' })
    expect(mockState.removed).toHaveLength(1)
    expect(mockState.removed[0]).toHaveLength(2)
    expect(mockState.removed[0][0]).toContain('-before.')
    expect(mockState.removed[0][1]).toContain('-after.')
  })

  test('le menage ne vise QUE les fichiers de la requete en cours', async () => {
    mockState.user = { id: 'user-7' }
    mockState.insertResult = { error: { message: 'insert refuse' } }
    await POST(postRequest())

    expect(mockState.removed[0]).toEqual(mockState.uploaded)
    for (const path of mockState.removed[0]) {
      expect(path.startsWith('user-7/')).toBe(true)
    }
  })

  test('K. menage en erreur : l’erreur d’origine est conservee, pas remplacee', async () => {
    mockState.insertResult = { error: { message: 'insert refuse' } }
    mockState.removeResult = { error: { message: 'remove refuse' } }
    const res = await POST(postRequest())

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'insert_failed' })
  })

  test('K bis. menage qui leve : l’erreur d’origine est toujours conservee', async () => {
    mockState.insertResult = { error: { message: 'insert refuse' } }
    mockState.removeThrows = true
    const res = await POST(postRequest())

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'insert_failed' })
  })
})

/*
 * L. et M. — « authenticated » et « anon » ne peuvent pas ecrire directement
 * dans public.transformations.
 *
 * Ces deux cas ne sont PAS couvrables ici : ils ne dependent pas du code de la
 * route mais des GRANT et de RLS cote Postgres, que Jest ne peut pas observer.
 * Les simuler avec un double serait une preuve nulle. Ils sont etablis par une
 * sonde en transaction annulee executee sur la base (phase K.7, etape 7), dont
 * le resultat attendu est 42501 « permission denied » pour les deux roles et un
 * INSERT accepte pour service_role.
 */
