// Contenu réel des guides PDF livrés après achat.
// Chaque guide est généré dynamiquement en PDF (voir guide-pdf.ts) à partir de ces blocs.
// Objectif : au moins 10 pages structurées par guide.

import { priseDeMasse12s } from '@/lib/programs/prise-de-masse-12s'
import { nutritionSeche } from '@/lib/programs/nutrition-seche'
import { hiit6s } from '@/lib/programs/hiit-6s'
import { runningGuide } from '@/lib/programs/running-guide'

export type GuideBlock =
  | { type: 'h1'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'note'; text: string }
  // Composants premium (programmes) :
  | { type: 'meta'; items: { label: string; value: string }[] }                 // cartes info (Niveau, Durée, Matériel…)
  | { type: 'table'; headers: string[]; rows: string[][] }                       // planning semaine / jour
  | { type: 'exercise'; name: string; muscles: string; level: string; technique: string; mistakes: string; video?: string } // fiche exercice (+ QR vidéo)
  | { type: 'checklist'; items: string[] }                                       // checklist hebdo (cases à cocher)
  | { type: 'tracker'; columns: string[]; rows: number }                         // grille de suivi vide (poids, mensurations, perfs)
  | { type: 'photo'; src: string; caption?: string }                             // bandeau photo d'ambiance (fichier dans public/program-assets)
  | { type: 'chapter'; title: string; src?: string; intro?: string }             // ouverture de chapitre (nouvelle page A4) : image + titre intégrés

export interface Guide {
  id: string
  title: string
  subtitle: string
  author: string
  level?: string         // affiché en badge sur la couverture
  duration?: string      // affiché en badge sur la couverture
  coverImage?: string    // photo pleine page de couverture (fichier dans public/program-assets)
  blocks: GuideBlock[]
}

// ──────────────────────────────────────────────────────────────────────
// d1 - Programme Prise de Masse 12 semaines
// ──────────────────────────────────────────────────────────────────────
const masse: Guide = priseDeMasse12s

// ──────────────────────────────────────────────────────────────────────
// d2 - Plan Nutrition Sèche 8 semaines
// ──────────────────────────────────────────────────────────────────────
const seche: Guide = nutritionSeche

// ──────────────────────────────────────────────────────────────────────
// d3 - Programme HIIT 6 semaines
// ──────────────────────────────────────────────────────────────────────
const hiit: Guide = hiit6s

// ──────────────────────────────────────────────────────────────────────
// d4 - Guide Running : du 5K au Marathon (contenu boutique, voir programs/)
// ──────────────────────────────────────────────────────────────────────
const running: Guide = runningGuide

export const GUIDES: Record<string, Guide> = {
  d1: masse,
  d2: seche,
  d3: hiit,
  d4: running,
}

export function getGuide(productId: string): Guide | undefined {
  return GUIDES[productId]
}
