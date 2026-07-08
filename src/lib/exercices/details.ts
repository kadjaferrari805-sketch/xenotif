import { getExercice, exercicesForLocale } from './registry'

// Fiche exercice complète (façon Nike Training Club / Freeletics), dérivée
// automatiquement des données existantes (nom, muscles, niveau, technique,
// erreurs) + valeurs par défaut. Les médias sont optionnels : placeholder si
// absent. Des overrides par slug peuvent enrichir un exercice précis plus tard.

export type Difficulty = 'debutant' | 'intermediaire' | 'avance'

export type ExerciceStats = {
  sets: number
  reps: string
  rest: string
  duration: string
  calories: string
}

export type ExerciceMedia = {
  videoUrl?: string
  gifUrl?: string
  images?: string[]
}

export type ExerciceDetail = {
  slug: string
  name: string
  muscles: string
  level: string
  technique: string
  mistakes: string
  difficulty: Difficulty
  primaryMuscles: string[]
  secondaryMuscles: string[]
  instructions: string[]
  mistakesList: string[]
  equipment: string[]
  regions: { id: string; primary: boolean }[]
  similar: { slug: string; name: string; muscles: string }[]
  stats: ExerciceStats
  media: ExerciceMedia
}

// Overrides médias par slug (à remplir quand de vrais fichiers existent dans
// public/videos/exercises, public/gifs, etc.). Fallback = placeholder.
const MEDIA_OVERRIDES: Record<string, ExerciceMedia> = {}

const norm = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function difficultyFromLevel(level: string): Difficulty {
  const l = norm(level)
  if (/avanc|advanced|fortgeschritt|elite|expert/.test(l)) return 'avance'
  if (/interm|mittel|moderate/.test(l)) return 'intermediaire'
  return 'debutant'
}

// Découpe une liste de muscles ("Quads, fessiers & ischios") en tokens propres.
function splitMuscles(muscles: string): string[] {
  return muscles
    .split(/[,&/]|\bet\b|\band\b|\bund\b/i)
    .map((m) => m.trim())
    .filter((m) => m.length > 1)
}

// Découpe la technique en étapes numérotées (phrases).
function toSteps(technique: string): string[] {
  return technique
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim().replace(/\s+/g, ' '))
    .filter((s) => s.length > 4)
}

// Découpe les erreurs fréquentes en items.
function toMistakes(mistakes: string): string[] {
  return mistakes
    .split(/,\s+|(?<=[.!?])\s+/)
    .map((s) => s.trim().replace(/[.;]+$/, ''))
    .filter((s) => s.length > 3)
}

// Régions du body diagram, par mots-clés (multilingue, sans accents).
const REGION_KEYWORDS: Record<string, RegExp> = {
  chest: /pectoraux|pecs|poitrine|chest|brust/,
  shoulders: /epaule|deltoide|delt|shoulder|schulter/,
  biceps: /biceps/,
  triceps: /triceps/,
  forearms: /avant-?bras|avant bras|forearm|unterarm|grip/,
  abs: /abdo|abdominaux|gainage|core|sangle|bauch|plank|crunch/,
  obliques: /oblique|lateraux|schrag/,
  lats: /dos|grand dorsal|lats|latissimus|rucken|ruck/,
  traps: /trapeze|traps|nuque|trapez/,
  lowerback: /lombaire|bas du dos|lower back|unterer rucken|erector/,
  glutes: /fessier|glute|gesass|gesa/,
  quads: /quadriceps|quads|cuisse|oberschenkel|jambe/,
  hamstrings: /ischio|hamstring|beinbeuger|femoraux/,
  calves: /mollet|calve|calf|waden/,
  fullbody: /cardio|full body|corps entier|ganzkorper|explosif|conditioning/,
}

function musclesToRegions(primary: string[], secondary: string[]): { id: string; primary: boolean }[] {
  const out = new Map<string, boolean>()
  const scan = (list: string[], isPrimary: boolean) => {
    const joined = norm(list.join(' '))
    for (const [id, re] of Object.entries(REGION_KEYWORDS)) {
      if (re.test(joined) && !(out.get(id) === true)) out.set(id, isPrimary)
    }
  }
  scan(secondary, false)
  scan(primary, true)
  return [...out.entries()].map(([id, primaryFlag]) => ({ id, primary: primaryFlag }))
}

// Matériel déduit du nom + muscles.
const EQUIP_KEYWORDS: { key: string; re: RegExp }[] = [
  { key: 'barbell', re: /rowing barre|developpe (couche|militaire|incline)|soulev|barre|barbell|langhantel/ },
  { key: 'dumbbells', re: /haltere|dumbbell|hantel|curl|elevation|goblet/ },
  { key: 'kettlebell', re: /kettlebell|swing/ },
  { key: 'cable', re: /poulie|cable|kabel|tirage|face pull|pull-over/ },
  { key: 'machine', re: /presse|machine|leg (press|curl|extension)|pec deck/ },
  { key: 'pullupBar', re: /traction|pull-?up|klimmzug|barre fixe/ },
  { key: 'bench', re: /banc|bench|incline|decline|dips sur banc|hip thrust/ },
  { key: 'mat', re: /gainage|plank|crunch|superman|pont|abdo|stretch|etirement|yoga/ },
]

function equipmentFrom(name: string, muscles: string): string[] {
  const hay = norm(name + ' ' + muscles)
  const found = EQUIP_KEYWORDS.filter((e) => e.re.test(hay)).map((e) => e.key)
  // Poids du corps si rien de "chargé" trouvé, ou exercice clairement au poids du corps.
  const bodyweight = /pompes|push-?up|gainage|plank|squat au poids|burpee|mountain|jumping|superman|dips sur chaise|chaise|fentes|sprint|montees|talons|skater|high knee|corde/.test(hay)
  const loaded = found.some((k) => ['barbell', 'dumbbells', 'kettlebell', 'cable', 'machine'].includes(k))
  if ((bodyweight && !loaded) || found.length === 0) {
    return found.length ? [...new Set([...found.filter((k) => k === 'mat' || k === 'pullupBar' || k === 'bench'), 'none'])] : ['none']
  }
  return [...new Set(found)]
}

const STATS: Record<Difficulty, ExerciceStats> = {
  debutant: { sets: 3, reps: '12–15', rest: '60 s', duration: '~8 min', calories: '40–60 kcal' },
  intermediaire: { sets: 4, reps: '8–12', rest: '75 s', duration: '~10 min', calories: '60–90 kcal' },
  avance: { sets: 5, reps: '5–8', rest: '90–120 s', duration: '~12 min', calories: '90–130 kcal' },
}

// Exercices similaires : partagent au moins un muscle primaire.
function similarFor(slug: string, primary: string[], locale: string) {
  const keys = primary.map(norm)
  const all = exercicesForLocale(locale).filter((e) => e.slug !== slug)
  const scored = all
    .map((e) => {
      const hay = norm(e.ex.muscles)
      const score = keys.filter((k) => k.length > 2 && hay.includes(k.split(' ')[0])).length
      return { e, score }
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
  const picked = scored.slice(0, 4).map((s) => ({ slug: s.e.slug, name: s.e.ex.name, muscles: s.e.ex.muscles }))
  // Complète à 4 avec d'autres exercices si besoin.
  if (picked.length < 4) {
    for (const e of all) {
      if (picked.length >= 4) break
      if (!picked.some((p) => p.slug === e.slug)) picked.push({ slug: e.slug, name: e.ex.name, muscles: e.ex.muscles })
    }
  }
  return picked
}

export function getExerciceDetail(slug: string, locale: string): ExerciceDetail | undefined {
  const ex = getExercice(slug, locale)
  if (!ex) return undefined

  const allMuscles = splitMuscles(ex.muscles)
  const primaryMuscles = allMuscles.slice(0, Math.max(1, Math.ceil(allMuscles.length / 2)))
  const secondaryMuscles = allMuscles.slice(primaryMuscles.length)
  const difficulty = difficultyFromLevel(ex.level)

  return {
    slug,
    name: ex.name,
    muscles: ex.muscles,
    level: ex.level,
    technique: ex.technique,
    mistakes: ex.mistakes,
    difficulty,
    primaryMuscles,
    secondaryMuscles,
    instructions: toSteps(ex.technique),
    mistakesList: toMistakes(ex.mistakes),
    equipment: equipmentFrom(ex.name, ex.muscles),
    regions: musclesToRegions(primaryMuscles, secondaryMuscles),
    similar: similarFor(slug, primaryMuscles, locale),
    stats: STATS[difficulty],
    media: MEDIA_OVERRIDES[slug] ?? {},
  }
}
