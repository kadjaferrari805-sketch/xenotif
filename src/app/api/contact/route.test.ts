/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'

const mockSend = jest.fn()

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({ emails: { send: (...a: unknown[]) => mockSend(...a) } })),
}))

import { InMemoryRateLimitStore, setRateLimitStore } from '../../../lib/security/rate-limit-store'
import { RateLimitStoreUnavailable } from '../../../lib/security/rate-limit'
import { POST } from './route'

const VALID = { name: 'Dave', email: 'dave@exemple.fr', subject: 'Bonjour', message: 'Un message.' }

const request = (body: Record<string, unknown>, ip = '203.0.113.7') =>
  new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'x-forwarded-for': ip },
  })

const ORIGINAL_ENV = { ...process.env }

beforeEach(() => {
  jest.clearAllMocks()
  process.env = { ...ORIGINAL_ENV, RESEND_API_KEY: 'cle-de-test' }
  mockSend.mockResolvedValue({ error: null })
  setRateLimitStore(new InMemoryRateLimitStore())
})

afterAll(() => {
  process.env = ORIGINAL_ENV
  setRateLimitStore(null)
})

describe('POST /api/contact — limitation de débit (F-02)', () => {
  test('sous la limite : les deux e-mails partent', async () => {
    const res = await POST(request(VALID))
    expect(res.status).toBe(200)
    expect(mockSend).toHaveBeenCalledTimes(2)
  })

  test('au-delà de la limite IP : 429 et aucun e-mail', async () => {
    for (let i = 0; i < 5; i++) await POST(request({ ...VALID, email: `a${i}@exemple.fr` }))
    mockSend.mockClear()

    const res = await POST(request({ ...VALID, email: 'depasse@exemple.fr' }))
    expect(res.status).toBe(429)
    expect(Number(res.headers.get('Retry-After'))).toBeGreaterThan(0)
    expect(mockSend).not.toHaveBeenCalled()
  })

  test('stockage indisponible : fail-closed', async () => {
    setRateLimitStore({ hit: async () => { throw new RateLimitStoreUnavailable() } })
    const res = await POST(request(VALID))
    expect(res.status).toBe(429)
    expect(mockSend).not.toHaveBeenCalled()
  })

  test('la réponse 429 ne divulgue aucun détail interne', async () => {
    for (let i = 0; i < 6; i++) await POST(request({ ...VALID, email: `a${i}@exemple.fr` }))
    const res = await POST(request(VALID))
    const body = JSON.stringify(await res.json()).toLowerCase()
    for (const leak of ['rate_limit', 'bucket', 'supabase', 'postgres', 'sql']) {
      expect(body).not.toContain(leak)
    }
  })
})

describe('POST /api/contact — non-régression des validations existantes', () => {
  test('champ manquant : toujours 400', async () => {
    expect((await POST(request({ ...VALID, message: '  ' }))).status).toBe(400)
    expect(mockSend).not.toHaveBeenCalled()
  })

  test('contenu trop long : toujours 400', async () => {
    const res = await POST(request({ ...VALID, message: 'x'.repeat(5001) }))
    expect(res.status).toBe(400)
    expect(mockSend).not.toHaveBeenCalled()
  })

  test('le HTML injecté reste échappé', async () => {
    await POST(request({ ...VALID, name: '<script>alert(1)</script>' }))
    const html = String(mockSend.mock.calls[0][0].html)
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })
})
