export type ProductType = 'physical' | 'digital'

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  description: string
  type: ProductType
  price_cents: number
  original_price_cents?: number
  stripe_price_id: string
  images: string[]
  badge?: string
  category: string
  rating: number
  reviews: number
  inStock: boolean
  download_url?: string
  features: string[]
  affiliate_url?: string
}

export const PRODUCTS: Product[] = [

  // ─── ÉQUIPEMENTS ──────────────────────────────────────────────────
  {
    id: 'e1', slug: 'kettlebell-20kg-pro',
    name: 'Kettlebell Fonte Pro 20 kg', brand: 'CORENGTH',
    description: 'Kettlebell en fonte avec base caoutchouc antidérapante. Poignée sablée pour une prise optimale. Idéale pour CrossFit, HIIT, swings et musculation fonctionnelle. Composée à 80% de fonte recyclée.',
    type: 'physical', price_cents: 6499, stripe_price_id: 'price_kettlebell_20kg',
    images: ['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80'],
    badge: '⭐ Bestseller', category: 'Équipements', rating: 4.8, reviews: 2847, inStock: true,
    features: ['20 kg — idéal CrossFit & HIIT', 'Fonte 80% recyclée', 'Base caoutchouc antidérapant', 'Poignée sablée grip optimal', 'Livraison offerte dès 50€'],
    affiliate_url: 'https://www.decathlon.fr/p/kettlebell-crosstraining-et-musculation-20-kg-gamme-pro/_/R-p-361165',
  },
  {
    id: 'e2', slug: 'bandes-elastiques-pro-5',
    name: 'Kit Bandes Élastiques Pro × 5', brand: 'GJELEMENTS',
    description: 'Set de 5 bandes de résistance progressive en latex 100% naturel, conçu en France. Résistances de 8 à 60 kg. Idéal pour la musculation, la réhabilitation, l\'échauffement et les étirements. Sac de transport inclus.',
    type: 'physical', price_cents: 3499, original_price_cents: 4999, stripe_price_id: 'price_bandes_elastiques',
    images: ['https://images.unsplash.com/photo-1598289431512-b97b0917afbe?auto=format&fit=crop&w=800&q=80'],
    badge: '🔥 -30%', category: 'Équipements', rating: 4.7, reviews: 1523, inStock: true,
    features: ['5 niveaux de résistance : 8 — 60 kg', 'Latex 100% naturel certifié', 'Fabriqué en France', 'Sac de transport inclus', 'Garantie 2 ans'],
  },
  {
    id: 'e3', slug: 'corde-a-sauter-pro',
    name: 'Corde à Sauter Speed Pro', brand: 'XENOTIF',
    description: 'Corde à sauter à câble acier revêtu, roulements à billes ultra-fluides. Poignées ergonomiques en aluminium. Idéale pour le HIIT, la boxe et le cardio-training. Réglable de 2,5 à 3,5m.',
    type: 'physical', price_cents: 2499, stripe_price_id: 'price_corde_sauter',
    images: ['https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=800&q=80'],
    category: 'Équipements', rating: 4.6, reviews: 892, inStock: true,
    features: ['Câble acier revêtu', 'Roulements à billes premium', 'Poignées aluminium', 'Longueur réglable 2,5 — 3,5m', 'Sac de rangement inclus'],
  },
  {
    id: 'e4', slug: 'tapis-yoga-premium',
    name: 'Tapis de Yoga Premium 10mm', brand: 'DECATHLON',
    description: 'Tapis de yoga double-face antidérapant, épaisseur 10mm pour un confort maximal. Matière TPE écologique, sans PVC ni latex. Idéal pour le yoga, le pilates et les étirements.',
    type: 'physical', price_cents: 2999, stripe_price_id: 'price_tapis_yoga',
    images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'],
    category: 'Équipements', rating: 4.5, reviews: 1204, inStock: true,
    features: ['Épaisseur 10mm confort premium', 'Double face antidérapant', 'TPE écologique (sans PVC)', '183 × 61 cm', 'Sangle de transport incluse'],
  },

  // ─── NUTRITION ────────────────────────────────────────────────────
  {
    id: 'n1', slug: 'whey-proteine-chocolat-1kg',
    name: 'Impact Whey Protéine Chocolat 1 kg', brand: 'MYPROTEIN',
    description: 'La whey protéine n°1 en Europe. 22g de protéines par portion, seulement 103 kcal. Fabriquée à partir de lait de vaches élevées en pâturage. Saveur chocolat intense, sans sucres ajoutés.',
    type: 'physical', price_cents: 2999, original_price_cents: 4499, stripe_price_id: 'price_whey_chocolat',
    images: ['https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=800&q=80'],
    badge: '💊 -33%', category: 'Nutrition', rating: 4.8, reviews: 89432, inStock: true,
    features: ['22g de protéines / portion', '103 kcal par serving', '5g de BCAAs naturels', 'Fabriquée en Europe', 'Sans sucres ajoutés'],
    affiliate_url: 'https://www.myprotein.com',
  },
  {
    id: 'n2', slug: 'creatine-monohydrate-300g',
    name: 'Créatine Monohydrate Pure 300g', brand: 'MYPROTEIN',
    description: 'Créatine monohydrate micronisée, pureté 99,9%. Améliore la force, la puissance et la récupération musculaire. 60 portions de 5g. Certifiée Informed Sport — testée antidopage.',
    type: 'physical', price_cents: 1999, stripe_price_id: 'price_creatine',
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'],
    category: 'Nutrition', rating: 4.9, reviews: 45123, inStock: true,
    features: ['Pureté 99,9% micronisée', '60 portions de 5g', 'Certifiée Informed Sport', 'Sans goût — mixable partout', 'Résultats en 4 semaines'],
    affiliate_url: 'https://www.myprotein.com',
  },
  {
    id: 'n3', slug: 'bcaa-fruit-punch-500g',
    name: 'BCAA 2:1:1 Fruit Punch 500g', brand: 'MYPROTEIN',
    description: 'BCAAs ratio optimal 2:1:1. Réduit la fatigue musculaire, améliore la récupération. Saveur Fruit Punch. 83 portions. Certifié vegan. Idéal pendant et après l\'entraînement.',
    type: 'physical', price_cents: 2499, stripe_price_id: 'price_bcaa',
    images: ['https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?auto=format&fit=crop&w=800&q=80'],
    badge: '🆕 Nouveau', category: 'Nutrition', rating: 4.6, reviews: 12847, inStock: true,
    features: ['Ratio optimal 2:1:1 (L/I/V)', '7g de BCAAs par serving', '83 portions par pot', 'Certifié vegan', 'Informed Sport certifié'],
  },
  {
    id: 'n4', slug: 'barres-proteinees-x12',
    name: 'Barres Protéinées Variétés × 12', brand: 'MYPROTEIN',
    description: 'Boîte de 12 barres protéinées haute qualité. 20g de protéines par barre, moins de 200 kcal. Saveurs variées : chocolat, caramel, fruits rouges. Parfait en snack post-entraînement.',
    type: 'physical', price_cents: 2999, stripe_price_id: 'price_barres_proteinees',
    images: ['https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80'],
    category: 'Nutrition', rating: 4.5, reviews: 8234, inStock: true,
    features: ['20g de protéines / barre', 'Moins de 200 kcal', '12 barres — saveurs variées', 'Sans sucres ajoutés', 'Idéal en déplacement'],
  },

  // ─── VÊTEMENTS ────────────────────────────────────────────────────
  {
    id: 'v1', slug: 'short-training-homme',
    name: 'Short Training Performance Homme', brand: 'XENOTIF',
    description: 'Short technique en tissu 4-way stretch ultra-léger. Technologie Dry-Fit moisture-wicking. Poche zippée latérale. Longueur mi-cuisse. Disponible en S, M, L, XL, XXL.',
    type: 'physical', price_cents: 3499, stripe_price_id: 'price_short_homme',
    images: ['https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80'],
    category: 'Vêtements', rating: 4.7, reviews: 1892, inStock: true,
    features: ['Tissu 4-way stretch', 'Technologie Dry-Fit', 'Poche zippée latérale', 'Tailles S au XXL', 'Noir, Gris, Marine'],
  },
  {
    id: 'v2', slug: 'legging-compression-femme',
    name: 'Legging Compression Haute Performance Femme', brand: 'XENOTIF',
    description: 'Legging de compression taille haute, tissu respirant et opaque. Compression graduée améliore la circulation. Poche latérale pour smartphone. Taille XS à XL.',
    type: 'physical', price_cents: 4499, original_price_cents: 5499, stripe_price_id: 'price_legging_femme',
    images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80'],
    badge: '❤️ Top vente', category: 'Vêtements', rating: 4.8, reviews: 3421, inStock: true,
    features: ['Compression graduée', 'Taille haute maintien', 'Tissu opaque anti-UV', 'Poche téléphone', 'XS au XL · 5 coloris'],
  },

  // ─── PROGRAMMES DIGITAUX ──────────────────────────────────────────
  {
    id: 'd1', slug: 'programme-prise-masse-12-semaines',
    name: 'Programme Prise de Masse — 12 Semaines', brand: 'XENOTIF',
    description: 'Programme complet de 84 séances structurées sur 12 semaines. Split musculaire, progression en charge, calcul des macros personnalisé, plans repas et guide récupération. Niveau intermédiaire à avancé.',
    type: 'digital', price_cents: 2900, stripe_price_id: 'price_programme_masse',
    images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'],
    badge: '📥 PDF Instant', category: 'Programmes', rating: 4.9, reviews: 4127, inStock: true,
    features: ['84 séances sur 12 semaines', 'Split 4j/semaine', 'Progression de charge guidée', 'Plan nutrition + macros', 'Mises à jour gratuites à vie'],
    download_url: '/downloads/programme-prise-masse.pdf',
  },
  {
    id: 'd2', slug: 'plan-nutrition-seche-8-semaines',
    name: 'Plan Nutrition Sèche — 8 Semaines', brand: 'XENOTIF',
    description: '56 jours de menus détaillés pour perdre du gras en préservant le muscle. 40+ recettes fitness, liste de courses hebdomadaire, calcul des déficits caloriques et tracking des macros.',
    type: 'digital', price_cents: 1900, stripe_price_id: 'price_plan_nutrition',
    images: ['https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80'],
    badge: '📥 PDF Instant', category: 'Programmes', rating: 4.8, reviews: 2891, inStock: true,
    features: ['56 jours de menus', '40+ recettes fitness', 'Liste de courses hebdo', 'Calcul macros personnalisé', 'Compatible vegan'],
    download_url: '/downloads/plan-nutrition-seche.pdf',
  },
  {
    id: 'd3', slug: 'programme-hiit-6-semaines',
    name: 'Programme HIIT Brûle-Graisses — 6 Semaines', brand: 'XENOTIF',
    description: '6 semaines, 4 séances de 20-30 min par semaine. 100% au poids du corps, aucun matériel requis. Conçu pour maximiser la combustion calorique et booster le métabolisme durablement.',
    type: 'digital', price_cents: 1490, stripe_price_id: 'price_hiit_programme',
    images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80'],
    badge: '🔥 Populaire', category: 'Programmes', rating: 4.7, reviews: 3654, inStock: true,
    features: ['24 séances de 20-30 min', 'Sans matériel', 'Débutant → avancé', 'Timer intégré PDF', 'Suivi progression'],
    download_url: '/downloads/programme-hiit.pdf',
  },
  {
    id: 'd4', slug: 'guide-running-marathon',
    name: 'Guide Running Complet — Du 5K au Marathon', brand: 'XENOTIF',
    description: 'E-book de 120 pages : plans d\'entraînement 5K / 10K / semi / marathon, nutrition course, prévention des blessures, mental et stratégie de course. Tous niveaux.',
    type: 'digital', price_cents: 1490, stripe_price_id: 'price_guide_running',
    images: ['https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=800&q=80'],
    badge: '📥 E-book 120p', category: 'Programmes', rating: 4.8, reviews: 1987, inStock: true,
    features: ['120 pages de contenu expert', 'Plans 5K, 10K, semi, marathon', 'Nutrition avant/pendant/après', 'Prévention blessures', 'Stratégie de course'],
    download_url: '/downloads/guide-running-marathon.pdf',
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug)
}

export function getCategories(): string[] {
  return [...new Set(PRODUCTS.map(p => p.category))]
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}

export const CATEGORY_ICONS: Record<string, string> = {
  'Équipements': '🏋️',
  'Nutrition':   '🥗',
  'Vêtements':   '👕',
  'Programmes':  '📋',
}
