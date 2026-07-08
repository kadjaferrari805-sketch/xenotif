// Structure des défis (constante) : icône, couleurs et destination. Les textes
// (titre, objectif, durée, niveau, description) viennent de messages →
// home.challenges.items, indexés dans le même ordre que ce tableau.
export type ChallengeStyle = {
  id: string
  emoji: string
  tint: string
  ring: string
  href: string
}

export const CHALLENGES: ChallengeStyle[] = [
  { id: '30-jours', emoji: '🔥', tint: 'text-sport-orange', ring: 'border-sport-orange/25 bg-sport-orange/10', href: '/auth/signup?plan=pro' },
  { id: 'cardio',   emoji: '🏃', tint: 'text-sport-blue',   ring: 'border-sport-blue/25 bg-sport-blue/10',     href: '/programmes/hiit-6s' },
  { id: 'force',    emoji: '💪', tint: 'text-sport-lime',   ring: 'border-sport-lime/25 bg-sport-lime/10',     href: '/programmes/musculation-intermediaire' },
  { id: 'seche',    emoji: '⚡', tint: 'text-rose-400',     ring: 'border-rose-400/25 bg-rose-400/10',          href: '/programmes/nutrition-seche' },
]
