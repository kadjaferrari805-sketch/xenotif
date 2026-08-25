/**
 * Exporte le contenu éditorial du site vers @xenotif/content, consommé par
 * l'application mobile.
 *
 * POURQUOI CE SCRIPT EXISTE
 * L'objectif produit est que l'app mobile SOIT le site. Or le site ne stocke
 * presque aucun contenu éditorial dans Supabase : articles, programmes,
 * disciplines, exercices, outils et produits sont des modules TypeScript
 * locaux, déjà rédigés en fr/en/de. Sans génération automatique, la copie
 * embarquée par l'app se fige au jour où quelqu'un l'a copiée — c'est
 * exactement ce qui s'est produit : packages/content contenait un instantané
 * français figé au 19 juillet.
 *
 * USAGE
 *   npx tsx scripts/export-content.ts [--out=<dossier>] [--check]
 *
 * Doit être lancé depuis la racine du site : les modules de contenu importent
 * via l'alias `@/`, que tsx ne résout qu'avec le tsconfig du site.
 *
 *   --out    dossier de destination
 *            (défaut : ../XenotifFitness/packages/content/src/generated)
 *   --check  n'écrit rien, sort en code 1 si la sortie diverge des fichiers
 *            existants. À utiliser en CI pour détecter un contenu périmé.
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { execSync } from 'node:child_process'

// Les accesseurs localisés vivent dans les modules `.en.ts` : malgré leur nom,
// ce sont eux qui aiguillent entre fr/en/de, pas le module de base.
import { getAllPostsLocalized } from '@/lib/blog/posts.en'
import { getProductsLocalized } from '@/lib/boutique/products.en'
import { getDisciplineContent, getDisciplineMeta } from '@/lib/disciplines'
import { programsForLocale } from '@/lib/programs/registry'
import { exercicesForLocale } from '@/lib/exercices/registry'
import { OUTILS } from '@/lib/outils/registry'
import { CHALLENGES } from '@/lib/challenges'
import { BRAND, STATS, FEATURES, STEPS, REVIEWS, TRUST_ITEMS } from '@/lib/constants'

const LOCALES = ['fr', 'en', 'de'] as const
type Locale = (typeof LOCALES)[number]

const args = process.argv.slice(2)
const checkOnly = args.includes('--check')
const outArg = args.find((a) => a.startsWith('--out='))?.slice('--out='.length)
const OUT_DIR = resolve(
  process.cwd(),
  outArg ?? '../XenotifFitness/packages/content/src/generated',
)

/** Construit `{ fr: T, en: T, de: T }` à partir d'un accesseur par langue. */
function byLocale<T>(fn: (locale: Locale) => T): Record<Locale, T> {
  return Object.fromEntries(LOCALES.map((l) => [l, fn(l)])) as Record<Locale, T>
}

/**
 * Les disciplines n'ont pas d'accesseur qui renvoie la liste complète : il faut
 * croiser le contenu (indexé par slug) et les métadonnées (une par slug).
 */
function disciplinesFor(locale: Locale) {
  const content = getDisciplineContent(locale)
  return Object.entries(content).map(([slug, c]) => ({
    slug,
    meta: getDisciplineMeta(slug, locale) ?? null,
    content: c,
  }))
}

const bundles: Record<string, unknown> = {
  'blog.json': byLocale((l) => getAllPostsLocalized(l)),
  'products.json': byLocale((l) => getProductsLocalized(l)),
  'disciplines.json': byLocale(disciplinesFor),
  'programs.json': byLocale((l) => programsForLocale(l)),
  'exercises.json': byLocale((l) => exercicesForLocale(l)),
  // Non traduits : ce sont des structures, leurs libellés vivent dans messages/.
  'outils.json': OUTILS,
  'challenges.json': CHALLENGES,
  'brand.json': { BRAND, STATS, FEATURES, STEPS, REVIEWS, TRUST_ITEMS },
}

/**
 * Contrôle d'intégrité : une langue qui perd des entrées est un bug silencieux
 * — l'app afficherait une page vide en allemand sans que rien n'échoue. Le
 * site protège déjà ses clés i18n par un test Jest ; on applique la même règle
 * au contenu.
 */
const integrityErrors: string[] = []
for (const [file, data] of Object.entries(bundles)) {
  if (!data || typeof data !== 'object') continue
  const keys = Object.keys(data as object)
  const isLocalized = LOCALES.every((l) => keys.includes(l))
  if (!isLocalized) continue
  const counts = LOCALES.map((l) => {
    const v = (data as Record<Locale, unknown>)[l]
    return Array.isArray(v) ? v.length : Object.keys(v as object).length
  })
  if (new Set(counts).size !== 1) {
    integrityErrors.push(
      `${file} : nombre d'entrées différent selon la langue — ` +
        LOCALES.map((l, i) => `${l}=${counts[i]}`).join(', '),
    )
  }
  if (counts[0] === 0) integrityErrors.push(`${file} : aucune entrée`)
}

if (integrityErrors.length) {
  console.error('Contrôle d’intégrité échoué :')
  for (const e of integrityErrors) console.error(`  - ${e}`)
  process.exit(1)
}

let sourceCommit = 'inconnu'
try {
  sourceCommit = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
} catch {
  // Dépôt non disponible : on garde "inconnu" plutôt que d'échouer.
}

/**
 * `meta.json` rend la dérive DÉTECTABLE : il enregistre le commit du site
 * ayant produit ces fichiers. Sans lui, on ne peut pas savoir si le contenu
 * embarqué par l'app correspond encore au site.
 */
bundles['meta.json'] = {
  sourceCommit,
  locales: LOCALES,
  counts: Object.fromEntries(
    Object.entries(bundles).map(([file, data]) => {
      if (Array.isArray(data)) return [file, data.length]
      const keys = Object.keys(data as object)
      if (LOCALES.every((l) => keys.includes(l))) {
        const v = (data as Record<Locale, unknown>).fr
        return [file, Array.isArray(v) ? v.length : Object.keys(v as object).length]
      }
      return [file, keys.length]
    }),
  ),
}

const serialize = (v: unknown) => JSON.stringify(v, null, 2) + '\n'

if (checkOnly) {
  const stale: string[] = []
  for (const [file, data] of Object.entries(bundles)) {
    // Le commit source change à chaque commit du site : le comparer ferait
    // échouer --check en permanence. Seul le contenu compte ici.
    if (file === 'meta.json') continue
    const path = join(OUT_DIR, file)
    if (!existsSync(path)) {
      stale.push(`${file} (absent)`)
      continue
    }
    if (readFileSync(path, 'utf8') !== serialize(data)) stale.push(file)
  }
  for (const locale of LOCALES) {
    const path = join(OUT_DIR, 'messages', `${locale}.json`)
    const source = readFileSync(join(process.cwd(), 'messages', `${locale}.json`), 'utf8')
    if (!existsSync(path)) stale.push(`messages/${locale}.json (absent)`)
    else if (readFileSync(path, 'utf8') !== source) stale.push(`messages/${locale}.json`)
  }
  if (stale.length) {
    console.error('Contenu périmé dans ' + OUT_DIR + ' :')
    for (const f of stale) console.error(`  - ${f}`)
    console.error('\nRelancer : npx tsx scripts/export-content.ts')
    process.exit(1)
  }
  console.log('Contenu à jour.')
  process.exit(0)
}

mkdirSync(OUT_DIR, { recursive: true })
let total = 0
for (const [file, data] of Object.entries(bundles)) {
  const body = serialize(data)
  writeFileSync(join(OUT_DIR, file), body)
  total += Buffer.byteLength(body)
  console.log(`  ${file.padEnd(20)} ${(Buffer.byteLength(body) / 1024).toFixed(0)} Ko`)
}

/**
 * Les libellés d'interface (messages/) suivent le même chemin que le contenu :
 * une seule voie de génération, sinon l'app et le site se remettent à diverger.
 * Copiés tels quels — c'est déjà du JSON, il n'y a rien à sérialiser.
 */
const MSG_DIR = join(OUT_DIR, 'messages')
mkdirSync(MSG_DIR, { recursive: true })
for (const locale of LOCALES) {
  const body = readFileSync(join(process.cwd(), 'messages', `${locale}.json`), 'utf8')
  writeFileSync(join(MSG_DIR, `${locale}.json`), body)
  total += Buffer.byteLength(body)
  console.log(`  messages/${locale}.json`.padEnd(22) + `${(Buffer.byteLength(body) / 1024).toFixed(0)} Ko`)
}
console.log(`\nÉcrit dans ${OUT_DIR}`)
console.log(`Total ${(total / 1024).toFixed(0)} Ko — site au commit ${sourceCommit}`)
