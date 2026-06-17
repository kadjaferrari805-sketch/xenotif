import { deriveAccess } from './access'

const sub = (over: Partial<{ plan: string; status: string; cancel_at_period_end: boolean }>) => ({
  plan: 'pro', status: 'active', trial_end: null, current_period_end: null,
  cancel_at_period_end: false, ...over,
})

describe('deriveAccess', () => {
  it('guest si non authentifié', () => {
    const a = deriveAccess({ isAuthenticated: false, isAdmin: false, sub: null })
    expect(a.role).toBe('guest'); expect(a.isPro).toBe(false)
  })
  it('free si connecté sans abonnement', () => {
    const a = deriveAccess({ isAuthenticated: true, isAdmin: false, sub: null })
    expect(a.role).toBe('free'); expect(a.isPro).toBe(false)
  })
  it("pro pendant l'essai (trialing)", () => {
    const a = deriveAccess({ isAuthenticated: true, isAdmin: false, sub: sub({ status: 'trialing' }) })
    expect(a.role).toBe('pro'); expect(a.isPro).toBe(true)
  })
  it('pro si actif', () => {
    const a = deriveAccess({ isAuthenticated: true, isAdmin: false, sub: sub({ status: 'active' }) })
    expect(a.isPro).toBe(true)
  })
  it('free si canceled', () => {
    const a = deriveAccess({ isAuthenticated: true, isAdmin: false, sub: sub({ status: 'canceled' }) })
    expect(a.role).toBe('free'); expect(a.isPro).toBe(false)
  })
  it('non-pro si past_due', () => {
    const a = deriveAccess({ isAuthenticated: true, isAdmin: false, sub: sub({ status: 'past_due' }) })
    expect(a.isPro).toBe(false)
  })
  it('non-pro si incomplete', () => {
    const a = deriveAccess({ isAuthenticated: true, isAdmin: false, sub: sub({ status: 'incomplete' }) })
    expect(a.role).toBe('free'); expect(a.isPro).toBe(false)
  })
  it('non-pro si unpaid', () => {
    const a = deriveAccess({ isAuthenticated: true, isAdmin: false, sub: sub({ status: 'unpaid' }) })
    expect(a.isPro).toBe(false)
  })
  it('admin → accès total même sans abonnement', () => {
    const a = deriveAccess({ isAuthenticated: true, isAdmin: true, sub: null })
    expect(a.role).toBe('admin'); expect(a.isPro).toBe(true)
  })
  it('normalise un plan elite hérité en pro', () => {
    const a = deriveAccess({ isAuthenticated: true, isAdmin: false, sub: sub({ plan: 'elite', status: 'active' }) })
    expect(a.plan).toBe('pro'); expect(a.isPro).toBe(true)
  })
  it("garde l'accès si résiliation en fin de période (encore active)", () => {
    const a = deriveAccess({ isAuthenticated: true, isAdmin: false, sub: sub({ status: 'active', cancel_at_period_end: true }) })
    expect(a.isPro).toBe(true); expect(a.cancelAtPeriodEnd).toBe(true)
  })

  it('essai gratuit : compte récent sans abonnement → pro (trialing)', () => {
    const created = new Date('2026-06-15T00:00:00Z')
    const now = new Date('2026-06-18T00:00:00Z') // J+3
    const a = deriveAccess({ isAuthenticated: true, isAdmin: false, sub: null, accountCreatedAt: created, now })
    expect(a.role).toBe('pro'); expect(a.isPro).toBe(true)
    expect(a.status).toBe('trialing'); expect(a.plan).toBe('pro')
    expect(a.trialEnd?.toISOString()).toBe('2026-06-22T00:00:00.000Z')
  })
  it('essai expiré : compte de plus de 7 jours sans abonnement → free', () => {
    const created = new Date('2026-06-01T00:00:00Z')
    const now = new Date('2026-06-18T00:00:00Z') // J+17
    const a = deriveAccess({ isAuthenticated: true, isAdmin: false, sub: null, accountCreatedAt: created, now })
    expect(a.role).toBe('free'); expect(a.isPro).toBe(false); expect(a.trialEnd).toBeNull()
  })
  it("pas d'essai si déjà un abonnement (même résilié)", () => {
    const created = new Date('2026-06-17T00:00:00Z')
    const now = new Date('2026-06-18T00:00:00Z')
    const a = deriveAccess({ isAuthenticated: true, isAdmin: false, sub: sub({ status: 'canceled' }), accountCreatedAt: created, now })
    expect(a.isPro).toBe(false); expect(a.role).toBe('free')
  })
})
