/**
 * @jest-environment node
 */
// Phase K8.11 — finding K8.11-04.
//
// La route faisait `await resend.emails.send(...)` puis `sent++`, avec un
// `catch {}` muet. Or le SDK NE LÈVE PAS sur refus d'API : il retourne
// `{ data: null, error }`. Un quota dépassé était donc compté comme un envoi
// réussi, et le rapport rendu à l'administrateur était mensonger.
//
// Cette route n'avait AUCUN test.
//
// AUCUN envoi réel : le SDK est doublé. Aucune base réelle.

import { NextRequest } from 'next/server'

const mockSend = jest.fn()

const mockState = {
  user: { id: 'user-admin' } as { id: string } | null,
  isAdmin: { id: 'user-admin' } as { id: string } | null,
  subs: [{ user_id: 'u1' }] as { user_id: string }[] | null,
  users: [{ id: 'u1', email: 'membre@exemple.fr' }] as { id: string; email: string }[],
}

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({ emails: { send: (...a: unknown[]) => mockSend(...a) } })),
}))

jest.mock('../../../../lib/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: async () => ({ data: { user: mockState.user } }) },
  }),
  createServiceClient: async () => ({
    from: (table: string) => {
      if (table === 'admin_users') {
        return {
          select: () => ({
            eq: () => ({ single: async () => ({ data: mockState.isAdmin }) }),
          }),
        }
      }
      // `subscriptions` : la route peut enchaîner `.eq('status', …)` ou non,
      // puis attendre la requête elle-même.
      const q: Record<string, unknown> = {}
      q.select = () => q
      q.eq = () => q
      q.then = (ok: (v: unknown) => unknown) => Promise.resolve({ data: mockState.subs }).then(ok)
      return q
    },
    auth: { admin: { listUsers: async () => ({ data: { users: mockState.users } }) } },
  }),
}))

import { POST } from './route'

const REFUS_API = {
  data: null,
  error: { message: 'simulated resend failure', statusCode: 429, name: 'rate_limit_exceeded' },
}
const SUCCES = { data: { id: 'test-id' }, error: null }

const request = (body: Record<string, unknown> = { subject: 'Sujet', message: 'Message', target: 'all' }) =>
  new NextRequest('http://localhost/api/admin/send-email', {
    method: 'POST',
    body: JSON.stringify(body),
  })

const ORIGINAL_ENV = { ...process.env }

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(console, 'error').mockImplementation(() => {})
  process.env = { ...ORIGINAL_ENV, RESEND_API_KEY: 'cle-de-test' }
  mockSend.mockResolvedValue(SUCCES)
  mockState.user = { id: 'user-admin' }
  mockState.isAdmin = { id: 'user-admin' }
  mockState.subs = [{ user_id: 'u1' }]
  mockState.users = [{ id: 'u1', email: 'membre@exemple.fr' }]
})

afterAll(() => { process.env = ORIGINAL_ENV })

describe('POST /api/admin/send-email — garde d’accès inchangée', () => {
  test('non authentifié : 401, aucun envoi', async () => {
    mockState.user = null
    const res = await POST(request())

    expect(res.status).toBe(401)
    expect(mockSend).not.toHaveBeenCalled()
  })

  test('authentifié mais non administrateur : 403, aucun envoi', async () => {
    mockState.isAdmin = null
    const res = await POST(request())

    expect(res.status).toBe(403)
    expect(mockSend).not.toHaveBeenCalled()
  })

  test('sujet ou message vide : 400, aucun envoi', async () => {
    const res = await POST(request({ subject: '  ', message: 'Message', target: 'all' }))

    expect(res.status).toBe(400)
    expect(mockSend).not.toHaveBeenCalled()
  })
})

describe('POST /api/admin/send-email — K8.11-04 : le compteur ne ment plus', () => {
  test('refus d’API : `sent` reste à 0 et l’échec est compté', async () => {
    mockSend.mockResolvedValue(REFUS_API)

    const res = await POST(request())

    // Avant la correction : { sent: 1 } — un envoi jamais parti, compté réussi.
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ sent: 0, failed: 1 })
  })

  test('exception de transport : `sent` reste à 0 également', async () => {
    mockSend.mockRejectedValue(new Error('network failure'))

    expect(await (await POST(request())).json()).toEqual({ sent: 0, failed: 1 })
  })

  test('succès et refus mêlés : chaque destinataire est compté du bon côté', async () => {
    mockState.subs = [{ user_id: 'u1' }, { user_id: 'u2' }, { user_id: 'u3' }]
    mockState.users = [
      { id: 'u1', email: 'a@exemple.fr' },
      { id: 'u2', email: 'b@exemple.fr' },
      { id: 'u3', email: 'c@exemple.fr' },
    ]
    mockSend
      .mockResolvedValueOnce(SUCCES)
      .mockResolvedValueOnce(REFUS_API)
      .mockResolvedValueOnce(SUCCES)

    expect(await (await POST(request())).json()).toEqual({ sent: 2, failed: 1 })
  })

  test('un échec n’interrompt pas la boucle : tous les destinataires sont tentés', async () => {
    mockState.subs = [{ user_id: 'u1' }, { user_id: 'u2' }]
    mockState.users = [
      { id: 'u1', email: 'a@exemple.fr' },
      { id: 'u2', email: 'b@exemple.fr' },
    ]
    mockSend.mockResolvedValue(REFUS_API)

    await POST(request())

    expect(mockSend).toHaveBeenCalledTimes(2)
  })

  test('le diagnostic est journalisé, sans l’adresse du destinataire', async () => {
    mockSend.mockResolvedValue(REFUS_API)

    await POST(request())

    const journal = (console.error as jest.Mock).mock.calls
      .flat()
      .map(a => (a instanceof Error ? a.message : typeof a === 'object' && a !== null ? JSON.stringify(a) : String(a)))
      .join(' ')
    expect(journal).toContain('rate_limit_exceeded')
    expect(journal).not.toContain('membre@exemple.fr')
  })

  test('la réponse ne divulgue ni adresse, ni détail fournisseur', async () => {
    mockSend.mockResolvedValue(REFUS_API)

    const corps = JSON.stringify(await (await POST(request())).json())

    for (const fuite of ['membre@exemple.fr', 'exemple.fr', 'rate_limit_exceeded', 'simulated', 'RESEND', 'Bearer', '@']) {
      expect(corps).not.toContain(fuite)
    }
  })
})

describe('POST /api/admin/send-email — comportement nominal inchangé', () => {
  test('tous les envois réussissent : { sent: N, failed: 0 }', async () => {
    mockState.subs = [{ user_id: 'u1' }, { user_id: 'u2' }]
    mockState.users = [
      { id: 'u1', email: 'a@exemple.fr' },
      { id: 'u2', email: 'b@exemple.fr' },
    ]

    expect(await (await POST(request())).json()).toEqual({ sent: 2, failed: 0 })
    expect(console.error).not.toHaveBeenCalled()
  })

  test('aucun abonné ciblé : { sent: 0 }, aucun envoi', async () => {
    mockState.subs = []

    expect(await (await POST(request())).json()).toEqual({ sent: 0 })
    expect(mockSend).not.toHaveBeenCalled()
  })

  test('le contenu transmis à Resend est inchangé', async () => {
    await POST(request({ subject: 'Mon sujet', message: 'Ma ligne', target: 'all' }))

    const charge = mockSend.mock.calls[0][0] as { from: string; to: string; subject: string; html: string }
    expect(charge.from).toBe('Xenotif® <noreply@xenotif.com>')
    expect(charge.to).toBe('membre@exemple.fr')
    expect(charge.subject).toBe('Mon sujet')
    expect(charge.html).toContain('Ma ligne')
  })
})
