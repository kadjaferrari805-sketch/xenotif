// Registre des calculateurs. `slug` = URL (/outils/<slug>) ; `key` = sous-clé
// i18n dans le namespace `outils` (JS-friendly) ; `emoji` pour les cartes du hub.
export type Outil = { slug: string; key: string; emoji: string }

export const OUTILS: Outil[] = [
  { slug: 'calories', key: 'calories', emoji: '🔥' },
  { slug: 'imc', key: 'imc', emoji: '⚖️' },
  { slug: 'macros', key: 'macros', emoji: '🍽️' },
  { slug: '1rm', key: 'oneRm', emoji: '🏋️' },
]

export const outilSlugs = (): string[] => OUTILS.map((o) => o.slug)
export const outilBySlug = (slug: string): Outil | undefined => OUTILS.find((o) => o.slug === slug)
