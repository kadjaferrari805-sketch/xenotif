/**
 * @jest-environment node
 */
// Environnement Node : les Route Handlers importent `next/server`, qui requiert
// les globals Fetch API natifs à Node (cf. src/app/api/streak/route.test.ts).
import { NextRequest } from 'next/server'
import { createFakeSupabase } from '../../../test/fake-supabase'

const mockCreate = jest.fn()
const mockRpc = jest.fn()
let mockGate: { isAdmin: boolean; isPro: boolean } = { isAdmin: false, isPro: true }
let mockProfileLocale: string | null = null

jest.mock('@anthropic-ai/sdk', () => {
  class APIError extends Error { status = 500 }
  class RateLimitError extends APIError {}
  const Anthropic = jest.fn().mockImplementation(() => ({
    messages: { create: (...args: unknown[]) => mockCreate(...args) },
  }))
  return { __esModule: true, default: Object.assign(Anthropic, { APIError, RateLimitError }) }
})
jest.mock('../../../lib/supabase/session', () => ({
  getCurrentUser: async () => ({ id: 'user-1', email: 'moi@exemple.fr' }),
}))
jest.mock('../../../lib/access', () => ({ requirePro: async () => mockGate }))
jest.mock('../../../lib/supabase/server', () => ({
  createServiceClient: async () =>
    createFakeSupabase({ profiles: { select: { data: { locale: mockProfileLocale } } } }, { rpc: mockRpc }).client,
}))

import { POST } from './route'

const request = (body: string) => new NextRequest('http://localhost/api/coach', { method: 'POST', body })
const ask = (payload: Record<string, unknown>) => POST(request(JSON.stringify(payload)))

async function* textStream(text: string) {
  yield { type: 'content_block_delta', delta: { type: 'text_delta', text } }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockGate = { isAdmin: false, isPro: true }
  mockProfileLocale = null
  mockRpc.mockResolvedValue({ data: true, error: null })
  mockCreate.mockImplementation(async () => textStream('Salut'))
})

describe('POST /api/coach', () => {
  test('corps illisible → 400', async () => {
    const res = await POST(request('pas du json'))
    expect(res.status).toBe(400)
  })

  test('historique invalide → 400, sans consommer de quota ni appeler le modèle', async () => {
    const res = await ask({ messages: [{ role: 'user', content: 'Salut' }, { role: 'assistant', content: 'Bonjour' }] })
    expect(res.status).toBe(400)
    expect(mockRpc).not.toHaveBeenCalled()
    expect(mockCreate).not.toHaveBeenCalled()
  })

  test('quota atteint → 429 dans la langue du membre, sans appel au modèle', async () => {
    mockRpc.mockResolvedValue({ data: false, error: null })
    const res = await ask({ locale: 'en', messages: [{ role: 'user', content: 'Hi' }] })
    expect(res.status).toBe(429)
    await expect(res.text()).resolves.toBe('Daily coach limit reached, come back tomorrow.')
    expect(mockCreate).not.toHaveBeenCalled()
  })

  test('compteur de quota indisponible → 503 (fermé par défaut)', async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: 'function does not exist' } })
    const res = await ask({ messages: [{ role: 'user', content: 'Salut' }] })
    expect(res.status).toBe(503)
    expect(mockCreate).not.toHaveBeenCalled()
  })

  test('répond dans la langue envoyée par le site', async () => {
    const res = await ask({ locale: 'en', messages: [{ role: 'user', content: 'Hi' }] })
    expect(res.status).toBe(200)
    await expect(res.text()).resolves.toBe('Salut')
    expect(mockRpc).toHaveBeenCalledWith('coach_consume_quota', { p_user_id: 'user-1', p_limit: 30 })
    expect(mockCreate.mock.calls[0][0].system).toContain('anglais')
  })

  test('sans langue envoyée (app mobile) : langue du profil', async () => {
    mockProfileLocale = 'de'
    await ask({ messages: [{ role: 'user', content: 'Hallo' }] })
    expect(mockCreate.mock.calls[0][0].system).toContain('allemand')
  })

  test('admin : pas de quota', async () => {
    mockGate = { isAdmin: true, isPro: true }
    await ask({ messages: [{ role: 'user', content: 'Salut' }] })
    expect(mockRpc).not.toHaveBeenCalled()
    expect(mockCreate).toHaveBeenCalled()
  })
})
