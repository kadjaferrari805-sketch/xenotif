/**
 * @jest-environment node
 */
// Le script exécuté après chaque build ne doit plus RIEN faire : aucune écriture
// Stripe, aucun webhook, aucune variable Vercel, dans aucun environnement.
// On l'exécute réellement : s'il tentait un appel, le test échouerait.
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const SCRIPT = path.join(__dirname, 'setup-webhook.mjs')
const SOURCE = readFileSync(SCRIPT, 'utf8')
const FAKE = { STRIPE_SECRET_KEY: 'sk_live_factice_non_valide', VERCEL_TOKEN: 'jeton_factice' }

function run(vars: Record<string, string>) {
  const env: Record<string, string | undefined> = { PATH: process.env.PATH, ...vars }
  return spawnSync(process.execPath, [SCRIPT], { env: env as NodeJS.ProcessEnv, encoding: 'utf8', timeout: 20_000 })
}

describe('scripts/setup-webhook.mjs (no-op)', () => {
  test.each([['production'], ['preview'], ['development'], [undefined]])(
    'VERCEL_ENV=%s : aucune action, même avec une clé LIVE et un jeton Vercel',
    (vercelEnv) => {
      const result = run(vercelEnv === undefined ? FAKE : { ...FAKE, VERCEL_ENV: vercelEnv })

      expect(result.status).toBe(0)
      expect(result.stdout).toContain('aucune action')
      expect(result.stdout).toContain('npm run stripe:portal')
      expect(result.stdout).not.toContain('setup-portal')
      expect(result.stdout).not.toContain('Webhook created')
      expect(result.stdout).not.toContain('STRIPE_WEBHOOK_SECRET')
      expect(result.stderr).toBe('')
    },
  )

  test('le bloc webhook et l’écriture de variables Vercel n’existent plus dans le fichier', () => {
    const code = SOURCE.split('\n')
      .filter((line) => !line.trimStart().startsWith('*') && !line.trimStart().startsWith('/*'))
      .join('\n')

    expect(code).not.toMatch(/webhookEndpoints/)
    expect(code).not.toMatch(/billingPortal/)
    expect(code).not.toMatch(/api\.vercel\.com/)
    expect(code).not.toMatch(/VERCEL_TOKEN/)
    expect(code).not.toMatch(/\bfetch\s*\(/)
    expect(code).not.toMatch(/import\s*\(\s*['"]stripe['"]\s*\)/)
    expect(code).not.toMatch(/\bnew Stripe\b/)
  })

  test('aucun secret n’est écrit dans les logs', () => {
    const logLines = SOURCE.split('\n').filter((line) => /console\.(log|error|warn|info)/.test(line))
    expect(logLines.length).toBeGreaterThan(0)
    for (const line of logLines) {
      expect(line).not.toMatch(/\$\{\s*(secret|stripeKey|vercelToken|key)\s*\}/)
      expect(line).not.toMatch(/STRIPE_(SECRET|WEBHOOK)_[A-Z]+\s*[:=]\s*\$\{/)
    }
  })
})
