import type { Guide } from '@/lib/boutique/guides'
import { PROGRAMS } from './library'
import { nutritionSeche } from './nutrition-seche'
import { hiit6s } from './hiit-6s'
import { runningGuide } from './running-guide'
import { priseDeMasse12sEn } from './en/prise-de-masse-12s.en'
import { nutritionSecheEn } from './en/nutrition-seche.en'
import { hiit6sEn } from './en/hiit-6s.en'
import { runningGuideEn } from './en/running-guide.en'
import { priseDeMasse12sDe } from './de/prise-de-masse-12s.de'
import { nutritionSecheDe } from './de/nutrition-seche.de'
import { hiit6sDe } from './de/hiit-6s.de'
import { runningGuideDe } from './de/running-guide.de'

// Registre unifié des programmes publics par locale. FR pour tous ; EN/DE pour
// les programmes dont le contenu localisé existe (4). Sert aux pages /programmes.
export type ProgramLocale = 'fr' | 'en' | 'de'
type LocalizedProgram = { fr: Guide; en?: Guide; de?: Guide }

const REGISTRY: Record<string, LocalizedProgram> = {
  'prise-de-masse-12s': { fr: PROGRAMS['prise-de-masse-12s'], en: priseDeMasse12sEn, de: priseDeMasse12sDe },
  'nutrition-seche':    { fr: nutritionSeche, en: nutritionSecheEn, de: nutritionSecheDe },
  'hiit-6s':            { fr: hiit6s, en: hiit6sEn, de: hiit6sDe },
  'running-guide':      { fr: runningGuide, en: runningGuideEn, de: runningGuideDe },
  'perte-de-poids-30j':        { fr: PROGRAMS['perte-de-poids-30j'] },
  'musculation-debutant':      { fr: PROGRAMS['musculation-debutant'] },
  'musculation-intermediaire': { fr: PROGRAMS['musculation-intermediaire'] },
  'musculation-avance':        { fr: PROGRAMS['musculation-avance'] },
  'fitness-maison':            { fr: PROGRAMS['fitness-maison'] },
}

function localeKey(locale: string): ProgramLocale {
  return locale === 'en' ? 'en' : locale === 'de' ? 'de' : 'fr'
}

export function getLocalizedProgram(slug: string, locale: string): Guide | undefined {
  return REGISTRY[slug]?.[localeKey(locale)]
}

export function programSlugs(): string[] {
  return Object.keys(REGISTRY)
}

export function programsForLocale(locale: string): { slug: string; guide: Guide }[] {
  const key = localeKey(locale)
  const out: { slug: string; guide: Guide }[] = []
  for (const [slug, p] of Object.entries(REGISTRY)) {
    const g = p[key]
    if (g) out.push({ slug, guide: g })
  }
  return out
}

export function localesForProgram(slug: string): ProgramLocale[] {
  const p = REGISTRY[slug]
  if (!p) return []
  return (['fr', 'en', 'de'] as const).filter((l) => !!p[l])
}
