/**
 * @jest-environment node
 */
// Script administratif du portail Stripe : lecture seule par défaut, une seule
// écriture avec --apply, erreurs jamais avalées, aucun secret dans les logs.
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import {
  assertKeyAllowed,
  buildTargetConfiguration,
  buildUpdatePayload,
  computeDiff,
  runPortal,
  stripeKeyMode,
} from './stripe-portal.lib.mjs'

const CLI = path.join(__dirname, 'stripe-portal.mjs')

// Configuration Live actuelle (champs gérés), telle que lue en READ-ONLY.
const configurationActuelle = {
  id: 'bpc_test_1',
  livemode: false,
  default_return_url: 'https://xenotif.vercel.app/dashboard/abonnement',
  business_profile: { headline: 'Gérez votre abonnement Xenotif®' },
  features: {
    invoice_history: { enabled: true },
    payment_method_update: { enabled: true },
    subscription_cancel: { enabled: true, mode: 'at_period_end', proration_behavior: 'none' },
    subscription_pause: { enabled: false },
    // Champs jamais gérés par le script : ils ne doivent jamais être envoyés.
    customer_update: { enabled: true, allowed_updates: ['name', 'email', 'phone'] },
    subscription_update: { enabled: true, default_allowed_updates: ['price'] },
  },
}

function fakeStripe(configurations: unknown[], { listError = false, updateError = false } = {}) {
  const update = jest.fn(async () => {
    if (updateError) throw new Error('échec update')
    return { id: 'bpc_test_1' }
  })
  const list = jest.fn(async () => {
    if (listError) throw new Error('échec list')
    return { data: configurations }
  })
  return { stripe: { billingPortal: { configurations: { list, update } } }, list, update }
}

describe('garde de mode de clé', () => {
  test.each([
    ['sk_test_x', 'test'],
    ['rk_live_x', 'live'],
    [undefined, 'missing'],
    ['autre', 'unknown'],
  ])('stripeKeyMode(%s) = %s', (key, attendu) => {
    expect(stripeKeyMode(key as string | undefined)).toBe(attendu)
  })

  test('clé de TEST avec cible LIVE → refusé', () => {
    expect(() => assertKeyAllowed('test', 'live')).toThrow(/clé de TEST/)
  })

  test('clé LIVE sans cible LIVE explicite → refusé', () => {
    expect(() => assertKeyAllowed('live', 'test')).toThrow(/sans cible LIVE explicite/)
  })

  test('correspondances valides', () => {
    expect(() => assertKeyAllowed('test', 'test')).not.toThrow()
    expect(() => assertKeyAllowed('live', 'live')).not.toThrow()
  })

  test('clé absente ou préfixe inconnu → refusé', () => {
    expect(() => assertKeyAllowed('missing', 'test')).toThrow(/absente/)
    expect(() => assertKeyAllowed('unknown', 'test')).toThrow(/inconnu/)
  })
})

describe('différences et charge utile', () => {
  test('configuration identique à la cible → aucune différence', () => {
    expect(computeDiff(configurationActuelle, buildTargetConfiguration())).toEqual([])
  })

  test('seuls les champs gérés sont comparés et envoyés', () => {
    const cible = buildTargetConfiguration({ returnUrl: 'https://preview.example.test/dashboard/abonnement' })
    const diff = computeDiff(configurationActuelle, cible)
    expect(diff).toHaveLength(1)
    expect(diff[0].champ).toBe('default_return_url')

    const payload = buildUpdatePayload(diff, cible)
    expect(payload).toEqual({ default_return_url: 'https://preview.example.test/dashboard/abonnement' })
    expect(JSON.stringify(payload)).not.toContain('customer_update')
    expect(JSON.stringify(payload)).not.toContain('subscription_update')
  })

  test('une différence dans un sous-objet features envoie ce sous-objet entier', () => {
    const courant = {
      ...configurationActuelle,
      features: { ...configurationActuelle.features, subscription_cancel: { enabled: true, mode: 'immediately', proration_behavior: 'none' } },
    }
    const cible = buildTargetConfiguration()
    const payload = buildUpdatePayload(computeDiff(courant, cible), cible)
    expect(payload).toEqual({
      features: { subscription_cancel: { enabled: true, mode: 'at_period_end', proration_behavior: 'none' } },
    })
  })
})

describe('exécution', () => {
  test('sans --apply : lecture seule, aucune écriture', async () => {
    const { stripe, list, update } = fakeStripe([
      { ...configurationActuelle, default_return_url: 'https://ancien.example.test/x' },
    ])
    const logs: string[] = []
    const result = await runPortal({ stripe, apply: false, log: (m: string) => logs.push(m) })

    expect(result.status).toBe('simulation')
    expect(result.diff).toHaveLength(1)
    expect(list).toHaveBeenCalledWith({ is_default: true, limit: 2 })
    expect(update).not.toHaveBeenCalled()
    expect(logs.join('\n')).toContain('aucune écriture')
  })

  test('avec --apply : exactement une écriture', async () => {
    const { stripe, update } = fakeStripe([
      { ...configurationActuelle, default_return_url: 'https://ancien.example.test/x' },
    ])
    const result = await runPortal({ stripe, apply: true, log: () => {} })

    expect(result.status).toBe('applique')
    expect(update).toHaveBeenCalledTimes(1)
    expect(update).toHaveBeenCalledWith('bpc_test_1', {
      default_return_url: 'https://xenotif.vercel.app/dashboard/abonnement',
    })
  })

  test('configuration déjà conforme : aucune écriture même avec --apply', async () => {
    const { stripe, update } = fakeStripe([configurationActuelle])
    const result = await runPortal({ stripe, apply: true, log: () => {} })

    expect(result.status).toBe('conforme')
    expect(update).not.toHaveBeenCalled()
  })

  test('aucune configuration par défaut : état explicite, aucune création', async () => {
    const { stripe, update } = fakeStripe([])
    const result = await runPortal({ stripe, apply: true, log: () => {} })

    expect(result.status).toBe('aucune-configuration-par-defaut')
    expect(update).not.toHaveBeenCalled()
  })

  test('erreur de lecture Stripe → propagée', async () => {
    const { stripe } = fakeStripe([], { listError: true })
    await expect(runPortal({ stripe, apply: false, log: () => {} })).rejects.toThrow('échec list')
  })

  test('erreur d’écriture Stripe → propagée', async () => {
    const { stripe } = fakeStripe([{ ...configurationActuelle, default_return_url: 'https://ancien.example.test/x' }], {
      updateError: true,
    })
    await expect(runPortal({ stripe, apply: true, log: () => {} })).rejects.toThrow('échec update')
  })

  test('aucun secret dans les journaux', async () => {
    const { stripe } = fakeStripe([configurationActuelle])
    const logs: string[] = []
    await runPortal({ stripe, apply: false, log: (m: string) => logs.push(m) })
    expect(logs.join('\n')).not.toMatch(/sk_(live|test)|rk_(live|test)|whsec_/)
  })
})

describe('interface en ligne de commande', () => {
  const run = (args: string[], vars: Record<string, string> = {}) => {
    const env: Record<string, string | undefined> = { PATH: process.env.PATH, ...vars }
    return spawnSync(process.execPath, [CLI, ...args], {
      env: env as NodeJS.ProcessEnv,
      encoding: 'utf8',
      timeout: 20_000,
    })
  }

  test('sans clé : sortie non nulle, aucun appel réseau', () => {
    const result = run([])
    expect(result.status).toBe(2)
    expect(result.stderr).toContain('STRIPE_SECRET_KEY absente')
  })

  test('clé LIVE sans --live : refusé avant tout appel Stripe', () => {
    const result = run([], { STRIPE_SECRET_KEY: 'sk_live_factice' })
    expect(result.status).toBe(2)
    expect(result.stderr).toContain('sans cible LIVE explicite')
    expect(result.stdout).not.toContain('sk_live_factice')
  })

  test('clé de TEST avec --live : refusé', () => {
    const result = run(['--live'], { STRIPE_SECRET_KEY: 'sk_test_factice' })
    expect(result.status).toBe(2)
    expect(result.stderr).toContain('clé de TEST')
  })
})
