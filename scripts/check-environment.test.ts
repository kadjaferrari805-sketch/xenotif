/**
 * @jest-environment node
 */
// Garde de build (prebuild) — 05-K.3.7-bis.
//
// On exécute le VRAI script, avec le VRAI client supabase-js, contre un serveur
// HTTP local qui simule l'endpoint REST de Supabase. Aucun module n'est mocké :
// seule la réponse de la RPC est contrôlée, et aucune base n'est touchée.
//
// `execFile` est asynchrone à dessein : `spawnSync` bloquerait la boucle
// d'événements et le serveur de test ne pourrait jamais répondre.
//
// PORTÉE DE CES TESTS. Ils couvrent la LOGIQUE du guard. Le filtrage SQL lui-même
// (créateur postgres, schéma public, exclusion de supabase_admin, lecture de
// pg_default_acl et non de pg_class.relacl) est garanti par la fonction
// `public.security_default_acl_report()` et a été vérifié séparément sur le
// projet Preview, où 24 ACL dangereuses sont réellement présentes.
import { execFile } from 'node:child_process'
import { createServer, type Server } from 'node:http'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { promisify } from 'node:util'

const run = promisify(execFile)
const SCRIPT = path.join(__dirname, 'check-environment.mjs')
const SOURCE = readFileSync(SCRIPT, 'utf8')

// Les assertions statiques portent sur le CODE EXÉCUTABLE, jamais sur les
// commentaires : ceux-ci citent volontairement `pg_class.relacl` et le
// `grant all` de schema.sql:2 pour expliquer ce que le guard ne fait PAS.
// Les y chercher ferait échouer le test sur sa propre documentation.
const CODE = SOURCE.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

type Row = {
  owner_role: string
  schema_name: string
  object_type: string
  grantee: string
  privilege: string
}

const row = (grantee: string, object_type = 'TABLE', privilege = 'SELECT'): Row => ({
  owner_role: 'postgres',
  schema_name: 'public',
  object_type,
  grantee,
  privilege,
})

/** Serveur simulant POST /rest/v1/rpc/security_default_acl_report. */
async function withRpc(
  reply: { status?: number; body: unknown },
  fn: (url: string) => Promise<void>,
): Promise<void> {
  let server: Server | undefined
  try {
    server = createServer((req, res) => {
      res.setHeader('content-type', 'application/json')
      res.statusCode = reply.status ?? 200
      res.end(JSON.stringify(reply.body))
    })
    await new Promise<void>((resolve) => server!.listen(0, '127.0.0.1', resolve))
    const { port } = server!.address() as { port: number }
    await fn(`http://127.0.0.1:${port}`)
  } finally {
    if (server) await new Promise<void>((resolve) => server!.close(() => resolve()))
  }
}

async function exec(env: Record<string, string | undefined>) {
  try {
    const { stdout, stderr } = await run(process.execPath, [SCRIPT], {
      env: { PATH: process.env.PATH, ...env } as unknown as NodeJS.ProcessEnv,
      timeout: 25_000,
    })
    return { code: 0, stdout, stderr }
  } catch (err) {
    const e = err as { code?: number; stdout?: string; stderr?: string }
    return { code: e.code ?? 1, stdout: e.stdout ?? '', stderr: e.stderr ?? '' }
  }
}

const KEY = { SUPABASE_SERVICE_ROLE_KEY: 'cle-de-test-non-valide' }

describe('scripts/check-environment.mjs — garde des default privileges', () => {
  test('CASE 1 — aucun privilège dangereux : le build continue', async () => {
    await withRpc({ body: [] }, async (url) => {
      const r = await exec({ ...KEY, NEXT_PUBLIC_SUPABASE_URL: url })
      expect(r.code).toBe(0)
      expect(r.stdout).toContain('aucun privilège dangereux')
      expect(r.stderr).not.toContain('DANGEROUS DEFAULT PRIVILEGES')
    })
  })

  test('CASE 2 — ACL dangereuse : le build échoue et détaille la ligne', async () => {
    await withRpc({ body: [row('anon', 'TABLE', 'TRUNCATE')] }, async (url) => {
      const r = await exec({ ...KEY, NEXT_PUBLIC_SUPABASE_URL: url })
      expect(r.code).toBe(1)
      expect(r.stderr).toContain('[environment-guard] DANGEROUS DEFAULT PRIVILEGES DETECTED')
      expect(r.stderr).toContain('owner=postgres')
      expect(r.stderr).toContain('schema=public')
      expect(r.stderr).toContain('object_type=TABLE')
      expect(r.stderr).toContain('grantee=anon')
      expect(r.stderr).toContain('privilege=TRUNCATE')
    })
  })

  test.each([
    ['TABLE', 'SELECT'],
    ['SEQUENCE', 'USAGE'],
    ['FUNCTION', 'EXECUTE'],
  ])('CASE 2 bis — %s / %s dangereux sur authenticated : détecté', async (type, priv) => {
    await withRpc({ body: [row('authenticated', type, priv)] }, async (url) => {
      const r = await exec({ ...KEY, NEXT_PUBLIC_SUPABASE_URL: url })
      expect(r.code).toBe(1)
      expect(r.stderr).toContain(`object_type=${type}`)
      expect(r.stderr).toContain(`privilege=${priv}`)
    })
  })

  test('CASE 3 — postgres et service_role ne déclenchent jamais le guard', async () => {
    await withRpc({ body: [row('service_role'), row('postgres')] }, async (url) => {
      const r = await exec({ ...KEY, NEXT_PUBLIC_SUPABASE_URL: url })
      expect(r.code).toBe(0)
      expect(r.stderr).not.toContain('DANGEROUS DEFAULT PRIVILEGES')
    })
  })

  test('CASE 4 et 5 — supabase_admin et autres schémas sont exclus en amont par le SQL', async () => {
    // La RPC filtre `defaclrole = postgres` et `nspname = public` : ces lignes
    // ne lui parviennent jamais. Vérifié sur Preview, où supabase_admin porte
    // 24 privilèges anon/authenticated que le rapport ignore (0 ligne).
    await withRpc({ body: [] }, async (url) => {
      const r = await exec({ ...KEY, NEXT_PUBLIC_SUPABASE_URL: url })
      expect(r.code).toBe(0)
    })
    expect(SOURCE).toContain('security_default_acl_report')
  })

  test('CASE 6 — le guard lit pg_default_acl, jamais les ACL des tables existantes', () => {
    // Les default privileges ne sont pas rétroactifs : une régression ne se voit
    // que dans pg_default_acl. Le script ne doit consulter aucune autre source.
    expect(CODE).not.toMatch(/relacl/)
    expect(CODE).not.toMatch(/has_table_privilege/)
    expect(CODE).not.toMatch(/information_schema/)
    expect(CODE.match(/\.rpc\(/g) ?? []).toHaveLength(1)
    expect(CODE).toContain('security_default_acl_report')
  })

  test('CASE 7 et 8 — le guard utilise la clé service_role, jamais la clé anon', () => {
    expect(SOURCE).toContain('SUPABASE_SERVICE_ROLE_KEY')
    expect(SOURCE).not.toContain('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  })

  test('clé service_role absente du build : avertissement, pas d’échec', async () => {
    await withRpc({ body: [] }, async (url) => {
      const r = await exec({ NEXT_PUBLIC_SUPABASE_URL: url })
      expect(r.code).toBe(0)
      expect(r.stderr).toContain('default privileges non vérifiés')
    })
  })

  test('RPC en erreur : avertissement, pas d’échec — un build ne casse pas sur un incident réseau', async () => {
    await withRpc({ status: 400, body: { message: 'function does not exist' } }, async (url) => {
      const r = await exec({ ...KEY, NEXT_PUBLIC_SUPABASE_URL: url })
      expect(r.code).toBe(0)
      expect(r.stderr).toContain('default privileges non vérifiés')
    })
  })

  test('le guard ne corrige rien : aucune écriture, aucune instruction GRANT/REVOKE', () => {
    // On vise les INSTRUCTIONS SQL, pas les identifiants : `grantee` et
    // `DANGEROUS_GRANTEES` sont des noms de champ légitimes du rapport.
    expect(CODE).not.toMatch(/\bgrant\s+(all|execute|select|insert|update|delete)\b/i)
    expect(CODE).not.toMatch(/\brevoke\b/i)
    expect(CODE).not.toMatch(/\balter\s+default\s+privileges\b/i)
    expect(CODE).not.toMatch(/\.insert\(|\.update\(|\.delete\(|\.upsert\(/)
    // Seul appel à la base : la RPC de lecture.
    expect(CODE.match(/supabase\.\w+\(/g) ?? []).toEqual(['supabase.rpc('])
  })
})

describe('scripts/check-environment.mjs — gardes existantes préservées', () => {
  test('une clé Stripe LIVE en preview échoue toujours', async () => {
    const r = await exec({ VERCEL_ENV: 'preview', STRIPE_SECRET_KEY: 'sk_live_factice' })
    expect(r.code).toBe(1)
    expect(r.stderr).toContain('clé Stripe live refusée')
  })

  test('le projet Supabase de production en preview échoue toujours', async () => {
    const r = await exec({
      VERCEL_ENV: 'preview',
      NEXT_PUBLIC_SUPABASE_URL: 'https://pciadjwuxuevkqkdarut.supabase.co',
    })
    expect(r.code).toBe(1)
    expect(r.stderr).toContain('projet Supabase de production')
  })

  test('environnement sain sans Supabase configuré : le build continue', async () => {
    const r = await exec({ VERCEL_ENV: 'preview', STRIPE_SECRET_KEY: 'sk_test_factice' })
    expect(r.code).toBe(0)
    expect(r.stdout).toContain('[check-environment]')
  })
})
