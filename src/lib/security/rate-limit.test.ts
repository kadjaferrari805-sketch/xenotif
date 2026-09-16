/**
 * @jest-environment node
 */
// Environnement Node : ce module n'a pas besoin du DOM, et les tests de route
// qui le réutilisent tournent eux aussi en Node (cf. src/app/api/checkout/route.test.ts).
import {
  clientIp,
  enforceRateLimit,
  EMAIL_MAX_LENGTH,
  isHoneypotFilled,
  normalizeEmail,
  RateLimitStoreUnavailable,
  retryAfterHeaders,
  TOO_MANY_REQUESTS_MESSAGE,
  tooManyRequestsBody,
  type RateLimitStore,
} from './rate-limit'
import { InMemoryRateLimitStore } from './rate-limit-store'

const headers = (map: Record<string, string>) => ({
  headers: { get: (name: string) => map[name.toLowerCase()] ?? null },
})

const RULE = { limit: 3, windowSeconds: 60 }

describe('clientIp — un client ne doit pas pouvoir se choisir une identité', () => {
  test('lit le PREMIER segment de x-forwarded-for (celui réécrit par Vercel)', () => {
    expect(clientIp(headers({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1, 10.0.0.2' }))).toBe('203.0.113.7')
  })

  test('ignore x-real-ip et tout autre en-tête fourni par le client', () => {
    expect(clientIp(headers({ 'x-real-ip': '198.51.100.9' }))).toBeNull()
    expect(clientIp(headers({ 'true-client-ip': '198.51.100.9' }))).toBeNull()
  })

  test('normalise : espaces, casse, port IPv4, crochets IPv6', () => {
    expect(clientIp(headers({ 'x-forwarded-for': '  203.0.113.7  ' }))).toBe('203.0.113.7')
    expect(clientIp(headers({ 'x-forwarded-for': '203.0.113.7:56789' }))).toBe('203.0.113.7')
    expect(clientIp(headers({ 'x-forwarded-for': '[2001:DB8::1]:443' }))).toBe('2001:db8::1')
    expect(clientIp(headers({ 'x-forwarded-for': '2001:DB8::1' }))).toBe('2001:db8::1')
  })

  test('en-tête absent ou vide → null (pas d’identifiant fiable)', () => {
    expect(clientIp(headers({}))).toBeNull()
    expect(clientIp(headers({ 'x-forwarded-for': '   ' }))).toBeNull()
  })
})

describe('normalizeEmail', () => {
  test('met en minuscules et retire les espaces', () => {
    expect(normalizeEmail('  Moi@Exemple.FR ')).toBe('moi@exemple.fr')
  })

  test('ne fusionne PAS les variantes « +tag » ni les points', () => {
    expect(normalizeEmail('a+promo@exemple.fr')).toBe('a+promo@exemple.fr')
    expect(normalizeEmail('a.b@exemple.fr')).toBe('a.b@exemple.fr')
  })

  test('refuse une adresse invalide, non-string ou trop longue', () => {
    expect(normalizeEmail('pas-une-adresse')).toBeNull()
    expect(normalizeEmail('')).toBeNull()
    expect(normalizeEmail(null)).toBeNull()
    expect(normalizeEmail(42)).toBeNull()
    expect(normalizeEmail(`${'a'.repeat(EMAIL_MAX_LENGTH)}@exemple.fr`)).toBeNull()
  })
})

describe('isHoneypotFilled', () => {
  test('rempli → piégé', () => {
    expect(isHoneypotFilled('robot')).toBe(true)
  })

  test('absent ou vide → légitime (rétrocompatible avec les clients déployés)', () => {
    expect(isHoneypotFilled(undefined)).toBe(false)
    expect(isHoneypotFilled('')).toBe(false)
    expect(isHoneypotFilled('   ')).toBe(false)
  })
})

describe('enforceRateLimit', () => {
  let store: InMemoryRateLimitStore

  beforeEach(() => {
    store = new InMemoryRateLimitStore()
  })

  const ipDimension = (ip: string | null) => ({ scope: 'test:ip', value: ip, rule: RULE })

  test('sous la limite → autorisé', async () => {
    for (let i = 0; i < RULE.limit; i++) {
      const verdict = await enforceRateLimit({
        store, failClosed: true, dimensions: [ipDimension('203.0.113.7')],
      })
      expect(verdict.allowed).toBe(true)
    }
  })

  test('à la limite exacte → encore autorisé (la limite est inclusive)', async () => {
    for (let i = 0; i < RULE.limit - 1; i++) {
      await enforceRateLimit({ store, failClosed: true, dimensions: [ipDimension('203.0.113.7')] })
    }
    const verdict = await enforceRateLimit({
      store, failClosed: true, dimensions: [ipDimension('203.0.113.7')],
    })
    expect(verdict.allowed).toBe(true)
  })

  test('au-delà de la limite → refusé avec un Retry-After exploitable', async () => {
    for (let i = 0; i < RULE.limit; i++) {
      await enforceRateLimit({ store, failClosed: true, dimensions: [ipDimension('203.0.113.7')] })
    }
    const verdict = await enforceRateLimit({
      store, failClosed: true, dimensions: [ipDimension('203.0.113.7')],
    })
    expect(verdict.allowed).toBe(false)
    if (verdict.allowed) throw new Error('inatteignable')
    expect(verdict.retryAfterSeconds).toBeGreaterThan(0)
    expect(verdict.retryAfterSeconds).toBeLessThanOrEqual(RULE.windowSeconds)
  })

  test('deux adresses différentes depuis la même IP : la limite IP s’applique quand même', async () => {
    const dims = (email: string) => [
      { scope: 'test:ip', value: '203.0.113.7', rule: RULE },
      { scope: 'test:email', value: email, rule: { limit: 10, windowSeconds: 60 } },
    ]
    for (let i = 0; i < RULE.limit; i++) {
      expect((await enforceRateLimit({ store, failClosed: true, dimensions: dims(`a${i}@exemple.fr`) })).allowed).toBe(true)
    }
    const verdict = await enforceRateLimit({ store, failClosed: true, dimensions: dims('autre@exemple.fr') })
    expect(verdict.allowed).toBe(false)
  })

  test('une même adresse depuis plusieurs IP : la limite e-mail s’applique quand même', async () => {
    const dims = (ip: string) => [
      { scope: 'test:ip', value: ip, rule: { limit: 100, windowSeconds: 60 } },
      { scope: 'test:email', value: 'cible@exemple.fr', rule: RULE },
    ]
    for (let i = 0; i < RULE.limit; i++) {
      expect((await enforceRateLimit({ store, failClosed: true, dimensions: dims(`203.0.113.${i}`) })).allowed).toBe(true)
    }
    const verdict = await enforceRateLimit({ store, failClosed: true, dimensions: dims('203.0.113.200') })
    expect(verdict.allowed).toBe(false)
  })

  test('toutes les dimensions sont comptées même après un refus', async () => {
    const dims = [
      { scope: 'test:ip', value: '203.0.113.7', rule: { limit: 1, windowSeconds: 60 } },
      { scope: 'test:email', value: 'cible@exemple.fr', rule: { limit: 50, windowSeconds: 60 } },
    ]
    await enforceRateLimit({ store, failClosed: true, dimensions: dims })
    await enforceRateLimit({ store, failClosed: true, dimensions: dims })
    // La dimension e-mail a bien été incrémentée deux fois malgré le refus IP.
    const state = await store.hit('test:email:cible@exemple.fr', 60)
    expect(state.count).toBe(3)
  })

  describe('dimension requise absente', () => {
    test('failClosed : refusé même si une AUTRE dimension reste exploitable', async () => {
      const verdict = await enforceRateLimit({
        store,
        failClosed: true,
        dimensions: [
          { scope: 'test:ip', value: null, rule: RULE, required: true },
          { scope: 'test:email', value: 'a@exemple.fr', rule: RULE },
        ],
      })
      expect(verdict.allowed).toBe(false)
    })

    test('failOpen : la dimension requise est sans effet, la route reste servie', async () => {
      const verdict = await enforceRateLimit({
        store,
        failClosed: false,
        dimensions: [{ scope: 'test:ip', value: null, rule: RULE, required: true }],
      })
      expect(verdict.allowed).toBe(true)
    })

    test('failClosed : dimension requise présente → évaluation normale', async () => {
      const verdict = await enforceRateLimit({
        store,
        failClosed: true,
        dimensions: [{ scope: 'test:ip', value: '203.0.113.7', rule: RULE, required: true }],
      })
      expect(verdict.allowed).toBe(true)
    })
  })

  describe('aucun identifiant fiable (pas d’IP exploitable)', () => {
    test('failClosed → refusé', async () => {
      const verdict = await enforceRateLimit({
        store, failClosed: true, dimensions: [ipDimension(null)],
      })
      expect(verdict.allowed).toBe(false)
    })

    test('failOpen → autorisé', async () => {
      const verdict = await enforceRateLimit({
        store, failClosed: false, dimensions: [ipDimension(null)],
      })
      expect(verdict.allowed).toBe(true)
    })
  })

  describe('stockage indisponible', () => {
    const brokenStore: RateLimitStore = {
      hit: async () => { throw new RateLimitStoreUnavailable() },
    }

    test('failClosed → refusé (on ne laisse pas passer une action coûteuse à l’aveugle)', async () => {
      const verdict = await enforceRateLimit({
        store: brokenStore, failClosed: true, dimensions: [ipDimension('203.0.113.7')],
      })
      expect(verdict.allowed).toBe(false)
    })

    test('failOpen → autorisé (une panne de compteur ne casse pas une ressource publique)', async () => {
      const verdict = await enforceRateLimit({
        store: brokenStore, failClosed: false, dimensions: [ipDimension('203.0.113.7')],
      })
      expect(verdict.allowed).toBe(true)
    })
  })
})

describe('réponse 429 — aucune fuite d’information interne', () => {
  test('le corps ne révèle ni limite, ni dimension, ni stockage', () => {
    const body = JSON.stringify(tooManyRequestsBody())
    expect(body).toContain(TOO_MANY_REQUESTS_MESSAGE)
    for (const leak of ['rate_limit', 'rate_limits', 'bucket', 'postgres', 'supabase', 'ip', 'limit', 'window', 'sql']) {
      expect(body.toLowerCase()).not.toContain(leak)
    }
  })

  test('Retry-After est un entier de secondes, au minimum 1', () => {
    expect(retryAfterHeaders(42.3)['Retry-After']).toBe('43')
    expect(retryAfterHeaders(0)['Retry-After']).toBe('1')
    expect(retryAfterHeaders(-5)['Retry-After']).toBe('1')
  })
})
