// Contenu des guides PDF - version allemande (mirror DE de guides.ts).
// Structure identique ; seuls les textes sont traduits.

import type { Guide } from './guides'
import { priseDeMasse12sDe } from '@/lib/programs/de/prise-de-masse-12s.de'
import { nutritionSecheDe } from '@/lib/programs/de/nutrition-seche.de'
import { hiit6sDe } from '@/lib/programs/de/hiit-6s.de'
import { runningGuideDe } from '@/lib/programs/de/running-guide.de'

// ──────────────────────────────────────────────────────────────────────
// d1-d4 : übersetzter Shop-Inhalt (DE-Mirror der FR-Programme, siehe programs/de/).
// ──────────────────────────────────────────────────────────────────────
const masse: Guide = priseDeMasse12sDe
const seche: Guide = nutritionSecheDe
const hiit: Guide = hiit6sDe
const running: Guide = runningGuideDe

export const GUIDES_DE: Record<string, Guide> = {
  d1: masse,
  d2: seche,
  d3: hiit,
  d4: running,
}
