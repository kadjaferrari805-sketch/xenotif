export const BRAND = {
  name: 'Xenotif®',
  tagline: 'Forge ton corps. Dépasse tes limites.',
  programs: 9,
  disciplines: 10,
}

export const STATS = [
  { value: '10', label: 'Disciplines' },
  { value: '9', label: 'Programmes' },
  { value: '3', label: 'Langues' },
  { value: '7 j', label: 'Essai Pro offert' },
]

export const FEATURES = [
  {
    icon: 'running',
    color: 'orange',
    title: 'Running & Cardio',
    slug: 'running-cardio',
    description:
      'Programmes de course adaptés à tous les niveaux - du 5K au marathon. Plans personnalisés avec coaching GPS et suivi de fréquence cardiaque.',
    tag: 'Cardio',
    levels: ['Débutant', 'Intermédiaire', 'Avancé', 'Élite'],
    stats: ['Guide complet', 'Tous niveaux', 'FR · EN · DE'],
  },
  {
    icon: 'dumbbell',
    color: 'blue',
    title: 'Musculation',
    slug: 'musculation',
    description:
      'Prise de masse, sèche ou tonification - nos coaches certifiés construisent ton programme sur mesure selon ta morphologie.',
    tag: 'Strength',
    levels: ['Débutant', 'Intermédiaire', 'Avancé', 'Élite'],
    stats: ['Guide complet', 'Tous niveaux', 'FR · EN · DE'],
  },
  {
    icon: 'zap',
    color: 'orange',
    title: 'HIIT',
    slug: 'hiit',
    description:
      'Séances courtes et intenses pour brûler un maximum de calories et booster ton métabolisme durablement en 20 à 30 min.',
    tag: 'Fat Burn',
    levels: ['Débutant', 'Intermédiaire', 'Avancé'],
    stats: ['Guide complet', 'Tous niveaux', 'FR · EN · DE'],
  },
  {
    icon: 'bike',
    color: 'blue',
    title: 'Cyclisme',
    slug: 'cyclisme',
    description:
      'Entraînements indoor et outdoor avec puissance-mètre. De la sportive au grimpeur de cols, un plan adapté à chaque profil.',
    tag: 'Endurance',
    levels: ['Débutant', 'Intermédiaire', 'Avancé', 'Compétition'],
    stats: ['Guide complet', 'Tous niveaux', 'FR · EN · DE'],
  },
  {
    icon: 'waves',
    color: 'lime',
    title: 'Natation',
    slug: 'natation',
    description:
      'Techniques de nage, préparation triathlon, open water - progressez dans tous les styles avec des drills vidéo HD.',
    tag: 'Aquatique',
    levels: ['Débutant', 'Intermédiaire', 'Avancé', 'Triathlon'],
    stats: ['Guide complet', 'Tous niveaux', 'FR · EN · DE'],
  },
  {
    icon: 'flame',
    color: 'orange',
    title: 'CrossFit',
    slug: 'crossfit',
    description:
      'WODs quotidiens, mouvements fonctionnels et challenges communautaires pour repousser tes limites chaque semaine.',
    tag: 'Functional',
    levels: ['Débutant', 'Intermédiaire', 'RX', 'Compétition'],
    stats: ['Guide complet', 'Tous niveaux', 'FR · EN · DE'],
  },
  {
    icon: 'leaf',
    color: 'lime',
    title: 'Yoga',
    slug: 'yoga',
    description:
      'Flexibilité, force intérieure et pleine conscience - des flows débutants au yoga avancé pour un corps et un esprit équilibrés.',
    tag: 'Bien-être',
    levels: ['Débutant', 'Intermédiaire', 'Avancé', 'Tous niveaux'],
    stats: ['Guide complet', 'Tous niveaux', 'FR · EN · DE'],
  },
  {
    icon: 'target',
    color: 'orange',
    title: 'Boxe',
    slug: 'boxing',
    description:
      'Technique, cardio et puissance - des bases aux combinaisons avancées pour te transformer physiquement et mentalement.',
    tag: 'Combat',
    levels: ['Débutant', 'Intermédiaire', 'Avancé', 'Compétition'],
    stats: ['Guide complet', 'Tous niveaux', 'FR · EN · DE'],
  },
  {
    icon: 'layers',
    color: 'blue',
    title: 'Stretching',
    slug: 'stretching',
    description:
      'Mobilité, souplesse et récupération optimale - des routines d\'étirements guidées pour prévenir les blessures et performer.',
    tag: 'Mobilité',
    levels: ['Débutant', 'Intermédiaire', 'Avancé', 'Tous niveaux'],
    stats: ['Guide complet', 'Tous niveaux', 'FR · EN · DE'],
  },
  {
    icon: 'zap',
    color: 'lime',
    title: 'Nutrition',
    slug: 'nutrition',
    description:
      'Plans alimentaires personnalisés, calcul des macros et stratégies nutritionnelles pour atteindre tes objectifs sportifs.',
    tag: 'Alimentation',
    levels: ['Débutant', 'Intermédiaire', 'Avancé', 'Athlète'],
    stats: ['Guide complet', 'Tous niveaux', 'FR · EN · DE'],
  },
]

export const STEPS = [
  {
    num: '1',
    title: 'Crée ton compte',
    description:
      'Inscription en 2 minutes. Remplis ton profil sportif pour un suivi personnalisé dès le premier jour.',
  },
  {
    num: '2',
    title: 'Choisis ton programme',
    description:
      "Notre IA analyse ton niveau, tes objectifs et ton temps disponible pour recommander le programme idéal.",
  },
  {
    num: '3',
    title: 'Entraîne-toi',
    description:
      'Suis tes séances guidées avec coaching audio, vidéos HD et feedback en temps réel sur ta technique.',
  },
  {
    num: '4',
    title: 'Suis tes progrès',
    description:
      'Tableau de bord complet, statistiques avancées et célébration de chaque objectif atteint.',
  },
]

// Vide tant qu'aucun avis reel n'est disponible : les 3 temoignages precedents
// etaient fabriques. Reviews.tsx masque la section quand ce tableau est vide.
export const REVIEWS: {
  name: string
  initial: string
  color: string
  sport: string
  date: string
  rating: number
  text: string
}[] = []

export const TRUST_ITEMS = [
  { label: 'Essai Pro 7 jours', sublabel: 'sans carte bancaire' },
  { label: 'Coaching IA', sublabel: 'personnalisé' },
  { label: 'Accès illimité', sublabel: 'tous programmes' },
  { label: '30 jours', sublabel: 'satisfait ou remboursé' },
]
