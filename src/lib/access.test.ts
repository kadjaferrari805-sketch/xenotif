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
})
