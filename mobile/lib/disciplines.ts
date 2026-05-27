export interface Discipline {
  slug: string
  name: string
  emoji: string
  color: string
  description: string
  level: string
  duration: string
  sessions: number
}

export const DISCIPLINES: Discipline[] = [
  {
    slug: 'running-cardio',
    name: 'Running & Cardio',
    emoji: '🏃',
    color: '#FF4500',
    description: 'Programme cardio complet pour brûler des calories et améliorer ton endurance.',
    level: 'Tous niveaux',
    duration: '12 semaines',
    sessions: 36,
  },
  {
    slug: 'musculation',
    name: 'Musculation',
    emoji: '💪',
    color: '#2563EB',
    description: 'Développe ta masse musculaire avec un programme structuré et progressif.',
    level: 'Débutant → Avancé',
    duration: '12 semaines',
    sessions: 36,
  },
  {
    slug: 'hiit',
    name: 'HIIT',
    emoji: '⚡',
    color: '#A3FF00',
    description: 'Séances haute intensité pour maximiser la combustion calorique en minimum de temps.',
    level: 'Intermédiaire',
    duration: '8 semaines',
    sessions: 24,
  },
  {
    slug: 'cyclisme',
    name: 'Cyclisme',
    emoji: '🚴',
    color: '#38bdf8',
    description: 'Programme cyclisme indoor/outdoor pour améliorer endurance et puissance.',
    level: 'Tous niveaux',
    duration: '10 semaines',
    sessions: 30,
  },
  {
    slug: 'natation',
    name: 'Natation',
    emoji: '🏊',
    color: '#06b6d4',
    description: 'Améliore ta technique et ton endurance aquatique avec ce programme complet.',
    level: 'Tous niveaux',
    duration: '10 semaines',
    sessions: 30,
  },
  {
    slug: 'crossfit',
    name: 'CrossFit',
    emoji: '🔥',
    color: '#f97316',
    description: 'Entraînements fonctionnels variés pour développer force, endurance et agilité.',
    level: 'Intermédiaire',
    duration: '12 semaines',
    sessions: 36,
  },
  {
    slug: 'yoga',
    name: 'Yoga',
    emoji: '🧘',
    color: '#a78bfa',
    description: 'Flexibilité, équilibre et bien-être mental avec ce programme yoga progressif.',
    level: 'Tous niveaux',
    duration: '8 semaines',
    sessions: 24,
  },
  {
    slug: 'boxing',
    name: 'Boxe',
    emoji: '🥊',
    color: '#ef4444',
    description: 'Technique de boxe, cardio et self-défense pour un corps sculptés.',
    level: 'Débutant → Intermédiaire',
    duration: '10 semaines',
    sessions: 30,
  },
  {
    slug: 'stretching',
    name: 'Stretching',
    emoji: '🤸',
    color: '#34d399',
    description: 'Mobilité, souplesse et récupération active pour optimiser tes performances.',
    level: 'Tous niveaux',
    duration: '6 semaines',
    sessions: 18,
  },
  {
    slug: 'nutrition',
    name: 'Nutrition',
    emoji: '🥗',
    color: '#fbbf24',
    description: 'Plans nutritionnels adaptés à tes objectifs fitness pour des résultats optimaux.',
    level: 'Tous niveaux',
    duration: '12 semaines',
    sessions: 12,
  },
]
