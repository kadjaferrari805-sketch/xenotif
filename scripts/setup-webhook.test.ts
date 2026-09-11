/**
 * @jest-environment node
 */
// Le script de build ne doit rien faire hors production : ni portail client
// Stripe, ni webhook, ni variable Vercel. On l'exécute réellement : s'il
// dépassait la garde avec une clé factice, il tenterait un appel réseau.
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const SCRIPT = path.join(__dirname, 'setup-webhook.mjs')
const FAKE = { STRIPE_SECRET_KEY: 'sk_test_factice_non_valide', VERCEL_TOKEN: 'jeton_factice' }

function run(vars: Record<string, string>) {
  const env: Record<string, string | undefined> = { PATH: process.env.PATH, ...vars }
  return spawnSync(process.execPath, [SCRIPT], { env: env as NodeJS.ProcessEnv, encoding: 'utf8', timeout: 20_000 })
}

describe('scripts/setup-webhook.mjs', () => {
  test.each([['preview'], ['development'], [undefined]])('VERCEL_ENV=%s : sortie immédiate sans action', (vercelEnv) => {
    const result = run(vercelEnv === undefined ? FAKE : { ...FAKE, VERCEL_ENV: vercelEnv })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('aucune action hors production')
    expect(result.stdout).not.toContain('setup-portal')
    expect(result.stdout).not.toContain('Webhook created')
  })

  test('VERCEL_ENV=production sans STRIPE_SECRET_KEY : la garde laisse passer, puis arrêt sûr sans appel Stripe', () => {
    const result = run({ VERCEL_ENV: 'production', VERCEL_TOKEN: 'jeton_factice' })
    expect(result.status).toBe(0)
    expect(result.stdout).not.toContain('aucune action hors production')
    expect(result.stdout).toContain('STRIPE_SECRET_KEY not set — skipping')
    expect(result.stdout).not.toContain('setup-portal')
  })

  test('aucun secret n’est écrit dans les logs', () => {
    const logLines = readFileSync(SCRIPT, 'utf8')
      .split('\n')
      .filter(line => /console\.(log|error|warn|info)/.test(line))
    expect(logLines.length).toBeGreaterThan(0)
    for (const line of logLines) {
      expect(line).not.toMatch(/\$\{\s*(secret|stripeKey|vercelToken)\s*\}/)
      expect(line).not.toMatch(/STRIPE_WEBHOOK_SECRET=\$\{/)
    }
  })
})
