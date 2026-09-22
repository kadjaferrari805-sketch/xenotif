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

// ── Phase K8.11 — finding K8.11-03.
//
// Les deux `await resend.emails.send(...)` étaient nus. Or le SDK NE LÈVE PAS
// sur refus d'API : il retourne `{ data: null, error }`. La route répondait donc
// `{ ok: true }` alors qu'aucun message n'était parti — ni vers l'équipe, ni
// vers le visiteur — et sans la moindre trace serveur.

describe('POST /api/contact — K8.11-03 : un refus de Resend n’est plus un succès', () => {
  const REFUS_API = {
    data: null,
    error: { message: 'simulated resend failure', statusCode: 429, name: 'rate_limit_exceeded' },
  }

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  test('refus d’API sur le 1er envoi : 500, et le 2e n’est pas tenté', async () => {
    mockSend.mockResolvedValue(REFUS_API)

    const res = await POST(request(VALID))

    // Avant la correction : 200 { ok: true }.
    expect(res.status).toBe(500)
    expect(mockSend).toHaveBeenCalledTimes(1)
  })

  test('refus d’API sur le 2e envoi seulement : 500 également', async () => {
    mockSend
      .mockResolvedValueOnce({ data: { id: 'ok' }, error: null })
      .mockResolvedValueOnce(REFUS_API)

    const res = await POST(request(VALID))

    expect(res.status).toBe(500)
    expect(mockSend).toHaveBeenCalledTimes(2)
  })

  test('exception de transport : 500, même contrat', async () => {
    mockSend.mockRejectedValue(new Error('network failure'))

    expect((await POST(request(VALID))).status).toBe(500)
  })

  test('le corps reste générique : ni adresse, ni code fournisseur, ni trace', async () => {
    mockSend.mockResolvedValue(REFUS_API)

    const corps = JSON.stringify(await (await POST(request(VALID))).json())

    expect(corps).toEqual('{"error":"Erreur lors de l\'envoi. Réessaie."}')
    for (const fuite of ['dave@exemple.fr', 'exemple.fr', 'rate_limit_exceeded', '429', 'simulated', 'RESEND', 'Bearer']) {
      expect(corps).not.toContain(fuite)
    }
  })

  test('le diagnostic est journalisé côté serveur, sans l’adresse', async () => {
    mockSend.mockResolvedValue(REFUS_API)

    await POST(request(VALID))

    expect(console.error).toHaveBeenCalled()
    const journal = (console.error as jest.Mock).mock.calls
      .flat()
      .map(a => (a instanceof Error ? a.message : typeof a === 'object' && a !== null ? JSON.stringify(a) : String(a)))
      .join(' ')
    expect(journal).toContain('rate_limit_exceeded')
    expect(journal).not.toContain('dave@exemple.fr')
  })

  test('succès inchangé : 200 { ok: true } et deux envois', async () => {
    const res = await POST(request(VALID))

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(mockSend).toHaveBeenCalledTimes(2)
    expect(console.error).not.toHaveBeenCalled()
  })
})
