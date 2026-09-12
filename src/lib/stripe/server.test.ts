/**
 * @jest-environment node
 */
const stripeConstructor = jest.fn()

jest.mock('stripe', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((key: string) => {
    stripeConstructor(key)
    return { key }
  }),
}))

import { createStripeClient, createStripeClientOrNull } from './server'

const ORIGINAL = { ...process.env }

beforeEach(() => {
  jest.clearAllMocks()
  process.env = { ...ORIGINAL }
  delete process.env.VERCEL_ENV
  delete process.env.STRIPE_SECRET_KEY
})

afterAll(() => {
  process.env = ORIGINAL
})

describe('client Stripe serveur', () => {
  test('preview + clé de test → client construit avec cette clé', () => {
    process.env.VERCEL_ENV = 'preview'
    process.env.STRIPE_SECRET_KEY = 'sk_test_x'
    expect(createStripeClient()).toBeTruthy()
    expect(stripeConstructor).toHaveBeenCalledWith('sk_test_x')
  })

  test('preview + clé LIVE → refus, aucun client Stripe construit', () => {
    process.env.VERCEL_ENV = 'preview'
    process.env.STRIPE_SECRET_KEY = 'sk_live_x'
    expect(() => createStripeClient()).toThrow(/LIVE refusée/)
    expect(stripeConstructor).not.toHaveBeenCalled()
  })

  test('production + clé LIVE → autorisé', () => {
    process.env.VERCEL_ENV = 'production'
    process.env.STRIPE_SECRET_KEY = 'sk_live_x'
    expect(createStripeClient()).toBeTruthy()
    expect(stripeConstructor).toHaveBeenCalledWith('sk_live_x')
  })

  test('clé absente : null pour la variante tolérante, erreur pour la stricte', () => {
    expect(createStripeClientOrNull()).toBeNull()
    expect(() => createStripeClient()).toThrow(/STRIPE_SECRET_KEY absente/)
    expect(stripeConstructor).not.toHaveBeenCalled()
  })
})
