/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'

const mockGeneratePdf = jest.fn()

jest.mock('../../../lib/lead-magnet', () => ({ getFreeProgram: () => ({ titre: 'guide' }) }))
jest.mock('../../../lib/boutique/guide-pdf', () => ({
  generateGuidePdf: (...a: unknown[]) => mockGeneratePdf(...a),
}))

import { InMemoryRateLimitStore, setRateLimitStore } from '../../../lib/security/rate-limit-store'
import { RateLimitStoreUnavailable } from '../../../lib/security/rate-limit'
import { GET } from './route'

const request = (ip: string | null = '203.0.113.7', locale = 'fr') =>
  new NextRequest(`http://localhost/api/free-program?locale=${locale}`, {
    headers: ip ? { 'x-forwarded-for': ip } : {},
  })

beforeEach(() => {
  jest.clearAllMocks()
  mockGeneratePdf.mockResolvedValue(new Uint8Array([1, 2, 3]))
  setRateLimitStore(new InMemoryRateLimitStore())
})

afterAll(() => setRateLimitStore(null))

describe('GET /api/free-program — limitation de débit (F-10)', () => {
  test('sous la limite : le PDF est servi et reste cacheable', async () => {
    const res = await GET(request())
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('application/pdf')
    expect(res.headers.get('Cache-Control')).toContain('s-maxage=86400')
  })

  test('au-delà de la limite : 429 et aucune génération de PDF', async () => {
    for (let i = 0; i < 30; i++) await GET(request())
    mockGeneratePdf.mockClear()

    const res = await GET(request())
    expect(res.status).toBe(429)
    expect(Number(res.headers.get('Retry-After'))).toBeGreaterThan(0)
    expect(mockGeneratePdf).not.toHaveBeenCalled()
  })

  test('deux IP distinctes ne se partagent pas le compteur', async () => {
    for (let i = 0; i < 30; i++) await GET(request('203.0.113.7'))
    expect((await GET(request('203.0.113.8'))).status).toBe(200)
  })

  test('stockage indisponible : fail-OPEN — la ressource publique reste servie', async () => {
    setRateLimitStore({ hit: async () => { throw new RateLimitStoreUnavailable() } })
    const res = await GET(request())
    expect(res.status).toBe(200)
    expect(mockGeneratePdf).toHaveBeenCalled()
  })

  test('aucune IP exploitable : fail-OPEN', async () => {
    const res = await GET(request(null))
    expect(res.status).toBe(200)
  })

  test('la locale reste validée par liste blanche', async () => {
    await GET(request('203.0.113.7', 'xx'))
    expect(mockGeneratePdf).toHaveBeenCalledWith(expect.anything(), 'fr')
  })
})
