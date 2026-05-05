export const PRODUCT = {
  name: 'neckZen Massage Pro',
  tagline: 'Masseur cervical 4 têtes — Chaleur + Impulsions + 16 niveaux',
  price: 79.90,
  oldPrice: 119.90,
  discount: 33,
  rating: 4.9,
  reviewCount: 248,
  sku: 'NECKZEN-PRO-001',
  features: [
    '4 têtes électrodes',
    "Chaleur jusqu'à 42°C",
    "16 niveaux d'intensité",
    'Sans fil + USB-C',
    'Commande vocale',
    'Arrêt auto 15 min',
  ],
}

export const FEATURES = [
  {
    icon: '⚡',
    color: 'teal',
    title: 'Impulsions basse fréquence',
    description: "Stimulation neuromusculaire douce qui soulage les tensions en profondeur dès la 1ère séance",
    tag: 'EMS / TENS',
  },
  {
    icon: '🔥',
    color: 'amber',
    title: 'Chaleur thérapeutique',
    description: "Chaleur intégrée jusqu'à 42°C qui pénètre 20mm sous la peau pour détendre les muscles",
    tag: 'Hot Compress',
  },
  {
    icon: '🎯',
    color: 'violet',
    title: '4 têtes de massage',
    description: 'Quatre électrodes positionnées scientifiquement pour couvrir toute la zone cervicale',
    tag: '360° Coverage',
  },
  {
    icon: '🎚️',
    color: 'sky',
    title: "16 niveaux d'intensité",
    description: "Du soin quotidien léger (1-5) aux tensions chroniques sévères (11-16) — adapté à chacun",
    tag: 'Personnalisable',
  },
  {
    icon: '📡',
    color: 'rose',
    title: 'Portable & sans fil',
    description: "Batterie longue durée, recharge USB-C — utilisez-le au bureau, en déplacement, à la maison",
    tag: 'Wireless',
  },
  {
    icon: '🎙️',
    color: 'emerald',
    title: 'Commande vocale',
    description: "Contrôlez intensité et modes mains libres grâce à l'assistant vocal intelligent intégré",
    tag: 'Smart Voice',
  },
]

export const REVIEWS = [
  {
    name: 'Marie L.',
    initial: 'M',
    color: 'teal',
    date: 'Il y a 3 jours',
    rating: 5,
    text: "\"Incroyable ! Après 8h de télétravail, mes cervicales étaient à bout. Dès la première utilisation au niveau 6, j'ai ressenti un vrai soulagement. Je l'utilise maintenant chaque soir.\"",
  },
  {
    name: 'Jacques M., 68 ans',
    initial: 'J',
    color: 'amber',
    date: 'Il y a 1 semaine',
    rating: 5,
    text: "\"J'avais des douleurs cervicales chroniques depuis des années. Le neckZen au niveau 12 avec la chaleur m'a soulagé comme jamais. Très facile à utiliser même pour moi.\"",
  },
  {
    name: 'Sarah K.',
    initial: 'S',
    color: 'violet',
    date: 'Il y a 2 semaines',
    rating: 5,
    text: "\"Je l'emmène partout — au bureau, en réunion, dans les transports. Sans fil, discret, et vraiment efficace. La commande vocale est un vrai plus ! Je recommande à 100%.\"",
  },
]

export const TRUST_ITEMS = [
  { icon: '⭐', label: '4.9/5', sublabel: '248 avis vérifiés' },
  { icon: '🚚', label: 'Livraison gratuite', sublabel: 'dès 50€' },
  { icon: '🔄', label: '30 jours', sublabel: 'satisfait ou remboursé' },
  { icon: '🔋', label: 'Recharge', sublabel: 'USB-C incluse' },
]
