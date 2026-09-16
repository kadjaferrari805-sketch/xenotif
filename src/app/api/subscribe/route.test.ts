/**
 * @jest-environment node
 */
// Environnement Node : les Route Handlers importent `next/server`.
import { NextRequest } from 'next/server'

const mockSend = jest.fn()
const mockUpsert = jest.fn()

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({ emails: { send: (...a: unknown[]) => mockSend(...a) } })),
}))
jest.mock('../../../lib/supabase/admin', () => ({
  createAdminClient: () => ({ from: () => ({ upsert: (...a: unknown[]) => mockUpsert(...a) }) }),
}))

import { InMemoryRateLimitStore, setRateLimitStore } from '../../../lib/security/rate-limit-store'
import { RateLimitStoreUnavailable } from '../../../lib/security/rate-limit'
import { POST } from './route'

const request = (body: Record<string, unknown>, ip = '203.0.113.7') =>
  new NextRequest('http://localhost/api/subscribe', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'x-forwarded-for': ip },
  })

const ORIGINAL_ENV = { ...process.env }
let store: InMemoryRateLimitStore

beforeEach(() => {
  jest.clearAllMocks()
  process.env = { ...ORIGINAL_ENV, RESEND_API_KEY: 'cle-de-test' }
  mockSend.mockResolvedValue({ error: null })
  mockUpsert.mockResolvedValue({ error: null })
  store = new InMemoryRateLimitStore()
  setRateLimitStore(store)
})

afterAll(() => {
  process.env = ORIGINAL_ENV
  setRateLimitStore(null)
})

describe('POST /api/subscribe — limitation de débit (F-01)', () => {
  test('sous la limite : l’e-mail part normalement', async () => {
    const res = await POST(request({ email: 'a@exemple.fr', locale: 'fr' }))
    expect(res.status).toBe(200)
    expect(mockSend).toHaveBeenCalledTimes(1)
  })

  test('au-delà de la limite IP : 429, aucun e-mail, aucune écriture', async () => {
    for (let i = 0; i < 5; i++) {
      await POST(request({ email: `a${i}@exemple.fr`, locale: 'fr' }))
    }
    mockSend.mockClear()
    mockUpsert.mockClear()

    const res = await POST(request({ email: 'depasse@exemple.fr', locale: 'fr' }))

    expect(res.status).toBe(429)
    expect(mockSend).not.toHaveBeenCalled()
    expect(mockUpsert).not.toHaveBeenCalled()
  })

  test('la même adresse depuis plusieurs IP est bornée aussi', async () => {
    for (let i = 0; i < 3; i++) {
      const res = await POST(request({ email: 'cible@exemple.fr' }, `203.0.113.${i}`))
      expect(res.status).toBe(200)
    }
    mockSend.mockClear()
    const res = await POST(request({ email: 'cible@exemple.fr' }, '203.0.113.99'))
    expect(res.status).toBe(429)
    expect(mockSend).not.toHaveBeenCalled()
  })

  test('la réponse 429 porte Retry-After et ne divulgue rien', async () => {
    for (let i = 0; i < 6; i++) await POST(request({ email: `a${i}@exemple.fr` }))
    const res = await POST(request({ email: 'encore@exemple.fr' }))

    expect(res.status).toBe(429)
    expect(Number(res.headers.get('Retry-After'))).toBeGreaterThan(0)
    const body = JSON.stringify(await res.json()).toLowerCase()
    for (const leak of ['rate_limit', 'bucket', 'supabase', 'postgres', 'sql', 'stack']) {
      expect(body).not.toContain(leak)
    }
  })

  test('stockage indisponible : fail-closed, aucun e-mail émis', async () => {
    setRateLimitStore({ hit: async () => { throw new RateLimitStoreUnavailable() } })
    const res = await POST(request({ email: 'a@exemple.fr' }))
    expect(res.status).toBe(429)
    expect(mockSend).not.toHaveBeenCalled()
  })

  test('aucune IP exploitable : fail-closed', async () => {
    const res = await POST(
      new NextRequest('http://localhost/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email: 'a@exemple.fr' }),
      }),
    )
    expect(res.status).toBe(429)
    expect(mockSend).not.toHaveBeenCalled()
  })
})

describe('POST /api/subscribe — champ-piège', () => {
  test('rempli : aucune écriture, aucun e-mail, réponse indiscernable d’un succès', async () => {
    const res = await POST(request({ email: 'a@exemple.fr', website: 'http://robot' }))
    expect(res.status).toBe(200)
    expect(mockSend).not.toHaveBeenCalled()
    expect(mockUpsert).not.toHaveBeenCalled()
  })

  test('absent ou vide : comportement normal (rétrocompatible)', async () => {
    expect((await POST(request({ email: 'a@exemple.fr' }))).status).toBe(200)
    expect((await POST(request({ email: 'b@exemple.fr', website: '  ' }))).status).toBe(200)
    expect(mockSend).toHaveBeenCalledTimes(2)
  })
})

describe('POST /api/subscribe — non-régression des validations existantes', () => {
  test('adresse invalide : toujours 400, et aucun e-mail', async () => {
    const res = await POST(request({ email: 'pas-une-adresse' }))
    expect(res.status).toBe(400)
    expect(mockSend).not.toHaveBeenCalled()
  })

  test('RESEND_API_KEY absente : toujours 500', async () => {
    delete process.env.RESEND_API_KEY
    const res = await POST(request({ email: 'a@exemple.fr' }))
    expect(res.status).toBe(500)
  })
})
