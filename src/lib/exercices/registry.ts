import type { Guide, GuideBlock } from '@/lib/boutique/guides'
import { getLocalizedProgram, programSlugs, type ProgramLocale } from '@/lib/programs/registry'

// Fiche exercice localisée, moissonnée depuis les blocs `exercise` des guides
// programmes (fr/en/de). Un exercice = une page /exercices/[slug] indexable.
export type ExerciceContent = { name: string; muscles: string; level: string; technique: string; mistakes: string }
type LocalizedExercice = { slug: string; fr: ExerciceContent; en?: ExerciceContent; de?: ExerciceContent }

type ExerciseBlock = Extract<GuideBlock, { type: 'exercise' }>
const isExercise = (b: GuideBlock): b is ExerciseBlock => b.type === 'exercise'
const pick = (b: ExerciseBlock): ExerciceContent => ({
  name: b.name, muscles: b.muscles, level: b.level, technique: b.technique, mistakes: b.mistakes,
})

// Slug stable et indépendant de la langue, dérivé du nom FR : sans accents,
// sans parenthèses, minuscules, mots reliés par des tirets.
function slugify(name: string): string {
  return name
    .replace(/\(.*?\)/g, ' ')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Ordre de priorité : les programmes les plus détaillés d'abord → à slug égal,
// c'est leur fiche (la plus riche) qui est retenue.
const PRIORITY = [
  'musculation-avance', 'musculation-intermediaire', 'musculation-debutant',
  'prise-de-masse-12s', 'fitness-maison', 'hiit-6s', 'running-guide', 'perte-de-poids-30j',
]

const REGISTRY: Map<string, LocalizedExercice> = (() => {
  const map = new Map<string, LocalizedExercice>()
  const ordered = [...PRIORITY, ...programSlugs().filter((s) => !PRIORITY.includes(s))]
  for (const pslug of ordered) {
    const fr: Guide | undefined = getLocalizedProgram(pslug, 'fr')
    if (!fr) continue
    const frEx = fr.blocks.filter(isExercise)
    const enEx = getLocalizedProgram(pslug, 'en')?.blocks.filter(isExercise)
    const deEx = getLocalizedProgram(pslug, 'de')?.blocks.filter(isExercise)
    frEx.forEach((f, i) => {
      const slug = slugify(f.name)
      if (!slug || map.has(slug)) return // dédup : on garde la 1re (la plus riche)
      map.set(slug, {
        slug,
        fr: pick(f),
        en: enEx && enEx[i] ? pick(enEx[i]) : undefined,
        de: deEx && deEx[i] ? pick(deEx[i]) : undefined,
      })
    })
  }
  return map
})()

function localeKey(locale: string): ProgramLocale {
  return locale === 'en' ? 'en' : locale === 'de' ? 'de' : 'fr'
}

export function getExercice(slug: string, locale: string): ExerciceContent | undefined {
  return REGISTRY.get(slug)?.[localeKey(locale)]
}

export function exerciceSlugs(): string[] {
  return [...REGISTRY.keys()]
}

export function exercicesForLocale(locale: string): { slug: string; ex: ExerciceContent }[] {
  const key = localeKey(locale)
  const out: { slug: string; ex: ExerciceContent }[] = []
  for (const [slug, e] of REGISTRY) {
    const ex = e[key]
    if (ex) out.push({ slug, ex })
  }
  return out.sort((a, b) => a.ex.name.localeCompare(b.ex.name))
}

export function localesForExercice(slug: string): ProgramLocale[] {
  const e = REGISTRY.get(slug)
  if (!e) return []
  return (['fr', 'en', 'de'] as const).filter((l) => !!e[l])
}
