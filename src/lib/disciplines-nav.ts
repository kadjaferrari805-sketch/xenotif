// Liste des 10 disciplines (slug + icône) partagée par la Nav (méga-menu) et la
// page /disciplines. Libellés localisés via common.nav.disc.<slug> ; slugs =
// routes /disciplines/[slug].
export const DISCIPLINE_SLUGS = [
  { slug: 'musculation', emoji: '🏋️' },
  { slug: 'running-cardio', emoji: '🏃' },
  { slug: 'hiit', emoji: '⚡' },
  { slug: 'crossfit', emoji: '🤸' },
  { slug: 'boxing', emoji: '🥊' },
  { slug: 'natation', emoji: '🏊' },
  { slug: 'cyclisme', emoji: '🚴' },
  { slug: 'yoga', emoji: '🧘' },
  { slug: 'stretching', emoji: '🙆' },
  { slug: 'nutrition', emoji: '🥗' },
] as const
