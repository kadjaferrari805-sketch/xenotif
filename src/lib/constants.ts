export const BRAND = {
  name: 'Xenotif®',
  tagline: 'Forge ton corps. Dépasse tes limites.',
  members: 12400,
  programs: 50,
  disciplines: 10,
  rating: 4.9,
  reviewCount: 3200,
}

export const STATS = [
  { value: '12K+', label: 'Athlètes actifs' },
  { value: '50+', label: 'Programmes' },
  { value: '10', label: 'Disciplines' },
  { value: '4.9/5', label: 'Satisfaction' },
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
    stats: ['+4 200 coureurs', '120+ plans', '12 semaines moy.'],
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
    stats: ['+3 800 membres', '90+ programmes', '8 semaines moy.'],
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
    stats: ['+2 100 membres', '60+ circuits', '20-30 min / séance'],
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
    stats: ['+1 500 cyclistes', '45+ plans', '16 semaines moy.'],
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
    stats: ['+900 nageurs', '30+ programmes', '10 semaines moy.'],
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
    stats: ['+1 800 athlètes', '365 WODs/an', '5× / semaine'],
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
    stats: ['+2 000 pratiquants', '40+ séquences', '20-60 min / séance'],
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
    stats: ['+1 200 boxeurs', '35+ programmes', '8 semaines moy.'],
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
    stats: ['+1 600 membres', '30+ routines', '10-30 min / séance'],
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
    stats: ['+3 000 membres', '50+ plans', 'Suivi quotidien'],
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

export const REVIEWS = [
  {
    name: 'Thomas D.',
    initial: 'T',
    color: 'orange',
    sport: 'Running · Marathon',
    date: 'Il y a 2 jours',
    rating: 5,
    text: '"En 3 mois de programme Xenotif®, j\'ai battu mon record sur marathon de 18 minutes. Le coaching IA est bluffant - chaque séance est parfaitement calibrée à mon niveau."',
  },
  {
    name: 'Leila M.',
    initial: 'L',
    color: 'blue',
    sport: 'HIIT · Musculation',
    date: 'Il y a 5 jours',
    rating: 5,
    text: '"J\'ai perdu 12 kg en 4 mois tout en gagnant en force. Les séances HIIT + muscu sont parfaitement équilibrées. La communauté Xenotif® me motive chaque matin."',
  },
  {
    name: 'Nicolas R.',
    initial: 'N',
    color: 'lime',
    sport: 'CrossFit · Natation',
    date: 'Il y a 1 semaine',
    rating: 5,
    text: '"Préparation triathlon avec Xenotif® - résultat incroyable. J\'ai terminé mon premier Ironman grâce à cette plateforme. Merci Xenotif® !"',
  },
]

export const TRUST_ITEMS = [
  { label: '12K+ athlètes', sublabel: 'communauté active' },
  { label: 'Coaching IA', sublabel: 'personnalisé' },
  { label: 'Accès illimité', sublabel: 'tous programmes' },
  { label: '30 jours', sublabel: 'satisfait ou remboursé' },
]
