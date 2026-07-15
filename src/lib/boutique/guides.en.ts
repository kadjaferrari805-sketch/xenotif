// Contenu des guides PDF - version anglaise (mirror EN de guides.ts).
// Structure identique ; seuls les textes sont traduits.

import { GUIDES, type Guide } from './guides'
import { GUIDES_DE } from './guides.de'
import { priseDeMasse12sEn } from '@/lib/programs/en/prise-de-masse-12s.en'
import { nutritionSecheEn } from '@/lib/programs/en/nutrition-seche.en'
import { hiit6sEn } from '@/lib/programs/en/hiit-6s.en'
import { runningGuideEn } from '@/lib/programs/en/running-guide.en'

// ──────────────────────────────────────────────────────────────────────
// d1-d4 : contenu boutique traduit (mirror EN des programmes FR, voir programs/en/).
// ──────────────────────────────────────────────────────────────────────
const masse: Guide = priseDeMasse12sEn
const seche: Guide = nutritionSecheEn
const hiit: Guide = hiit6sEn
const running: Guide = runningGuideEn

export const GUIDES_EN: Record<string, Guide> = {
  d1: masse,
  d2: seche,
  d3: hiit,
  d4: running,
}

// Guide localisé : repli FR si la langue n'a pas (encore) de variante.
export function getGuideLocalized(productId: string, locale: string): Guide | undefined {
  if (locale === 'en') return GUIDES_EN[productId] ?? GUIDES[productId]
  if (locale === 'de') return GUIDES_DE[productId] ?? GUIDES[productId]
  return GUIDES[productId]
}
