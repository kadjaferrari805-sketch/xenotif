export type ProductType = 'physical' | 'digital'

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  type: ProductType
  price_cents: number
  stripe_price_id: string
  images: string[]
  badge?: string
  category: string
  download_url?: string
}

export const PRODUCTS: Product[] = [
  {
    id: 'p1', slug: 'kettlebell-20kg',
    name: 'Kettlebell 20 kg Premium',
    description: 'Kettlebell en fonte revêtue caoutchouc. Idéale pour CrossFit, HIIT et musculation fonctionnelle. Poignée ergonomique anti-dérapante.',
    type: 'physical', price_cents: 8900,
    stripe_price_id: 'price_kettlebell_20',
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80'],
    badge: 'Bestseller', category: 'Équipements',
  },
  {
    id: 'p2', slug: 'resistance-bands-set',
    name: 'Set Bandes Élastiques Pro',
    description: 'Lot de 5 bandes de résistance progressive (5 à 50 kg). Idéal pour échauffement, réhabilitation et renforcement musculaire.',
    type: 'physical', price_cents: 3900,
    stripe_price_id: 'price_resistance_bands',
    images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80'],
    category: 'Équipements',
  },
  {
    id: 'p3', slug: 'whey-protein-chocolate',
    name: 'Whey Protéine Chocolat 1kg',
    description: 'Protéine de lactosérum premium, 25g de protéines par dose. Saveur chocolat intense. Idéal post-entraînement pour la récupération.',
    type: 'physical', price_cents: 4500,
    stripe_price_id: 'price_whey_chocolate',
    images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'],
    badge: 'Nouveau', category: 'Nutrition',
  },
  {
    id: 'p4', slug: 'creatine-monohydrate',
    name: 'Créatine Monohydrate 300g',
    description: 'Créatine monohydrate micronisée, pureté 99.9%. Améliore la force, l\'endurance et la récupération musculaire.',
    type: 'physical', price_cents: 2500,
    stripe_price_id: 'price_creatine',
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80'],
    category: 'Nutrition',
  },
  {
    id: 'p5', slug: 'programme-prise-masse-pdf',
    name: 'Programme Prise de Masse 12 semaines',
    description: 'Programme complet 84 séances, nutrition incluse. Exercices avec variantes, tableaux de progression, calcul des macros.',
    type: 'digital', price_cents: 2900,
    stripe_price_id: 'price_programme_masse',
    images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'],
    badge: 'PDF', category: 'Programmes',
    download_url: '/downloads/programme-prise-masse.pdf',
  },
  {
    id: 'p6', slug: 'plan-nutrition-seche',
    name: 'Plan Nutrition Sèche 8 semaines',
    description: 'Plan alimentaire détaillé pour perdre du gras en gardant le muscle. Menus semaine par semaine, listes de courses, recettes fitness.',
    type: 'digital', price_cents: 1900,
    stripe_price_id: 'price_plan_nutrition',
    images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80'],
    badge: 'PDF', category: 'Nutrition',
    download_url: '/downloads/plan-nutrition-seche.pdf',
  },
  {
    id: 'p7', slug: 'short-training-homme',
    name: 'Short Training Performance',
    description: 'Short technique 4-way stretch, tissu respirant moisture-wicking. Poche zippée. Disponible en noir et gris.',
    type: 'physical', price_cents: 4900,
    stripe_price_id: 'price_short_homme',
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80'],
    category: 'Vêtements',
  },
  {
    id: 'p8', slug: 'guide-running-marathon',
    name: 'Guide Running : Du 5K au Marathon',
    description: 'E-book complet 120 pages. Plans d\'entraînement 5K/10K/semi/marathon, conseils nutrition course, prévention blessures.',
    type: 'digital', price_cents: 1500,
    stripe_price_id: 'price_guide_running',
    images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'],
    badge: 'E-book', category: 'Programmes',
    download_url: '/downloads/guide-running-marathon.pdf',
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug)
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}
