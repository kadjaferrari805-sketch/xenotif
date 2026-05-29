export type ProductType = 'physical' | 'digital'
export type ProductCategory = 'Équipements' | 'Nutrition' | 'Vêtements' | 'Programmes' | 'Cardio' | 'Recovery'

export interface AmazonProduct {
  asin: string
  affiliateUrl: string
}

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  description: string
  longDescription: string
  type: ProductType
  price_cents: number
  original_price_cents?: number
  stripe_price_id: string
  images: string[]
  badge?: string | null
  category: ProductCategory
  tags: string[]
  rating: number
  reviews: number
  inStock: boolean
  download_url?: string
  features: string[]
  amazon?: AmazonProduct
  disciplines?: string[]
  isAffiliate: boolean
}

const AMAZON_TAG = 'xenotif21-21'
const AMAZON_DOMAIN = 'www.amazon.de'

// Lien de recherche Amazon affilié — ne tombe jamais en 404 et conserve la commission
function amazonUrl(keywords: string): string {
  return `https://${AMAZON_DOMAIN}/s?k=${encodeURIComponent(keywords)}&tag=${AMAZON_TAG}`
}

export const AMAZON_ASSOCIATE_TAG = AMAZON_TAG
export const AMAZON_ASSOCIATE_DOMAIN = AMAZON_DOMAIN

export const PRODUCTS: Product[] = [
  // ─── ÉQUIPEMENTS ──────────────────────────────────────────────────
  {
    id: 'e1', slug: 'kettlebell-20kg-fonte-pro',
    name: 'Kettlebell Fonte Pro 20 kg — CORENGTH',
    brand: 'CORENGTH / Decathlon',
    description: 'Kettlebell fonte 20 kg avec base caoutchouc antidérapante et poignée sablée pour CrossFit, HIIT et musculation fonctionnelle.',
    longDescription: 'Conçue pour les athlètes exigeants, cette kettlebell en fonte à 80% recyclée offre une prise sablée pour un grip parfait même en sueur. La base caoutchouc protège le sol et assure une stabilité parfaite. Idéale pour swings, Turkish get-up, clean & press et snatch.',
    type: 'physical', price_cents: 6499, stripe_price_id: 'price_kettlebell_20kg',
    images: ['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80'],
    badge: '⭐ Bestseller', category: 'Équipements', rating: 4.8, reviews: 2847, inStock: true,
    tags: ['kettlebell', 'crossfit', 'musculation', 'force'],
    disciplines: ['crossfit', 'musculation', 'hiit'],
    features: ['20 kg — idéal CrossFit & HIIT', 'Fonte 80% recyclée', 'Base caoutchouc antidérapant', 'Poignée sablée grip optimal', 'Garantie 2 ans'],
    amazon: { asin: 'B07CWRS8BD', affiliateUrl: amazonUrl('kettlebell 20kg gusseisen') },
    isAffiliate: true,
  },
  {
    id: 'e2', slug: 'bandes-elastiques-gjelements-5',
    name: 'Kit Bandes Élastiques Résistance × 5 — GJELEMENTS',
    brand: 'GJELEMENTS',
    description: 'Set de 5 bandes de résistance progressive en latex 100% naturel, conçu en France. Résistances de 8 à 60 kg.',
    longDescription: 'Fabriquées en latex naturel 100% pur, ces bandes offrent une tension douce et progressive pour muscler en toute sécurité. Du débutant à l\'athlète confirmé : 5 niveaux de résistance adaptés à chaque exercice. Sac de transport et guide d\'exercices inclus.',
    type: 'physical', price_cents: 3499, original_price_cents: 4999, stripe_price_id: 'price_bandes_elastiques',
    images: ['https://images.unsplash.com/photo-1598289431512-b97b0917afbe?auto=format&fit=crop&w=800&q=80'],
    badge: '🔥 -30%', category: 'Équipements', rating: 4.7, reviews: 1523, inStock: true,
    tags: ['bandes élastiques', 'résistance', 'fitness', 'yoga'],
    disciplines: ['musculation', 'yoga', 'stretching', 'running-cardio'],
    features: ['5 niveaux : 8 à 60 kg', 'Latex naturel certifié', 'Fabriqué en France', 'Sac + guide inclus', 'Garantie 2 ans'],
    amazon: { asin: 'B08GWMXHVJ', affiliateUrl: amazonUrl('fitnessbänder set widerstandsbänder') },
    isAffiliate: true,
  },
  {
    id: 'e3', slug: 'tapis-yoga-premium-10mm',
    name: 'Tapis Yoga Premium Antidérapant 10mm',
    brand: 'Gaiam',
    description: 'Tapis yoga double-face 10mm en TPE écologique. Antidérapant parfait, 183×61cm. Sangle transport incluse.',
    longDescription: 'Le tapis Gaiam premium offre une épaisseur de 10mm pour un amorti parfait des articulations. Sa surface texturée double-face garantit une adhérence maximale sur tous sols. Le matériau TPE est exempt de PVC, latex et phtalates — idéal pour les pratiquants soucieux de l\'environnement.',
    type: 'physical', price_cents: 3999, stripe_price_id: 'price_tapis_yoga',
    images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'],
    badge: null, category: 'Équipements', rating: 4.6, reviews: 3241, inStock: true,
    tags: ['tapis yoga', 'pilates', 'méditation', 'stretching'],
    disciplines: ['yoga', 'stretching'],
    features: ['10mm confort premium', 'Double face antidérapant', 'TPE sans PVC ni latex', '183×61 cm', 'Sangle transport incluse'],
    amazon: { asin: 'B003JIW3EC', affiliateUrl: amazonUrl('yogamatte rutschfest 10mm') },
    isAffiliate: true,
  },
  {
    id: 'e4', slug: 'corde-sauter-crossfit-reebok',
    name: 'Corde à Sauter Speed CrossFit — Reebok',
    brand: 'Reebok',
    description: 'Corde à sauter câble acier revêtu, roulements à billes aluminium. Réglable 2,5—3,5m. Parfaite pour HIIT et boxe.',
    longDescription: 'La corde à sauter Reebok Speed est conçue pour les athlètes CrossFit et boxeurs. Câble acier ultra-léger, roulements à billes de précision pour une rotation fluide à haute vitesse. Poignées ergonomiques en aluminium brossé. Idéale pour double-unders et HIIT intensif.',
    type: 'physical', price_cents: 2999, stripe_price_id: 'price_corde_sauter',
    images: ['https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=800&q=80'],
    badge: '⚡ Pro', category: 'Équipements', rating: 4.5, reviews: 892, inStock: true,
    tags: ['corde à sauter', 'cardio', 'crossfit', 'boxe'],
    disciplines: ['crossfit', 'hiit', 'boxing', 'running-cardio'],
    features: ['Câble acier revêtu', 'Roulements alu précision', 'Réglable 2,5—3,5m', 'Poignées ergonomiques', 'Bag de transport'],
    amazon: { asin: 'B07D7XR895', affiliateUrl: amazonUrl('springseil speed rope crossfit') },
    isAffiliate: true,
  },
  {
    id: 'e5', slug: 'halteres-reglables-bowflex',
    name: 'Haltères Réglables 2—24 kg — Bowflex SelectTech',
    brand: 'Bowflex',
    description: 'Remplacement de 15 paires d\'haltères. Sélection du poids en 2 secondes de 2 à 24 kg. Design ergonomique.',
    longDescription: 'Les haltères Bowflex SelectTech 552i sont la référence mondiale en matière d\'haltères réglables. Un simple tournage du sélecteur remplace jusqu\'à 15 paires d\'haltères classiques. Gain de place et de budget considérable. Structure en acier chromé avec revêtement antidérapant.',
    type: 'physical', price_cents: 34900, original_price_cents: 42900, stripe_price_id: 'price_halteres_bowflex',
    images: ['https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80'],
    badge: '💪 Premium', category: 'Équipements', rating: 4.9, reviews: 5623, inStock: true,
    tags: ['haltères', 'musculation', 'home gym', 'force'],
    disciplines: ['musculation', 'hiit', 'crossfit'],
    features: ['2 à 24 kg en 2 secondes', 'Remplace 15 paires', 'Construction acier chromé', 'Revêtement antidérapant', 'Garantie 2 ans'],
    amazon: { asin: 'B001ARYU58', affiliateUrl: amazonUrl('verstellbare hanteln set') },
    isAffiliate: true,
  },
  {
    id: 'e6', slug: 'velo-appartement-domyos',
    name: 'Vélo d\'Appartement Connecté — DOMYOS VC500',
    brand: 'DOMYOS',
    description: 'Vélo cardio connecté avec 24 niveaux de résistance magnétique. Écran LCD. Selle et guidon réglables. Connecté apps fitness.',
    longDescription: 'Le vélo DOMYOS VC500 est idéal pour le cyclisme indoor. Résistance magnétique ultra-silencieuse, 24 niveaux progressifs. Compatible avec les applications Decathlon Coach, Zwift et Kinomap via Bluetooth. Selle confort large réglable en hauteur et profondeur. Console LCD affichant vitesse, distance, calories, fréquence cardiaque.',
    type: 'physical', price_cents: 44900, original_price_cents: 59900, stripe_price_id: 'price_velo_domyos',
    images: ['https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?auto=format&fit=crop&w=800&q=80'],
    badge: '🚴 Connecté', category: 'Cardio', rating: 4.4, reviews: 1876, inStock: true,
    tags: ['vélo', 'cardio', 'indoor cycling', 'connected'],
    disciplines: ['cyclisme', 'running-cardio', 'hiit'],
    features: ['24 niveaux magnétiques', 'Connecté Bluetooth', 'Compatible Zwift/Kinomap', 'Selle confort réglable', 'Console LCD complète'],
    amazon: { asin: 'B086C2L1B7', affiliateUrl: amazonUrl('heimtrainer fahrrad ergometer') },
    isAffiliate: true,
  },

  // ─── NUTRITION ────────────────────────────────────────────────────
  {
    id: 'n1', slug: 'whey-myprotein-chocolat-1kg',
    name: 'Impact Whey Protein Chocolat 1 kg — MyProtein',
    brand: 'MyProtein',
    description: 'N°1 en Europe. 22g protéines, 103 kcal, 5g BCAAs par portion. Lait de vaches en pâturage. Goût chocolat intense.',
    longDescription: 'La whey la plus vendue en Europe depuis 15 ans. Formulée à partir de lactosérum ultra-filtré provenant de vaches de pâturages irlandais. Profil aminé complet avec 5g de BCAAs par portion. Se mélange parfaitement dans l\'eau ou le lait. Idéale en post-workout pour maximiser la synthèse protéique.',
    type: 'physical', price_cents: 2999, original_price_cents: 4499, stripe_price_id: 'price_whey_chocolat',
    images: ['https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=800&q=80'],
    badge: '🏆 N°1 Europe', category: 'Nutrition', rating: 4.8, reviews: 89432, inStock: true,
    tags: ['whey', 'protéine', 'musculation', 'récupération'],
    disciplines: ['musculation', 'crossfit', 'running-cardio'],
    features: ['22g protéines / portion', '103 kcal seulement', '5g BCAAs naturels', 'Fabriquée en Europe', 'Sans sucres ajoutés'],
    amazon: { asin: 'B000GIQT2Q', affiliateUrl: amazonUrl('whey protein schokolade 1kg') },
    isAffiliate: true,
  },
  {
    id: 'n2', slug: 'creatine-monohydrate-myprotein-300g',
    name: 'Créatine Monohydrate Pure 300g — MyProtein',
    brand: 'MyProtein',
    description: 'Créatine micronisée 99,9% pure. 60 doses. Certifiée Informed Sport. Force et puissance en 4 semaines.',
    longDescription: 'La créatine monohydrate est le supplément le plus étudié en science du sport avec des centaines d\'études confirmant son efficacité. La version micronisée de MyProtein se dissout instantanément et est absorbée plus rapidement. Certifiée Informed Sport — testée antidopage. Sans goût pour se mélanger à n\'importe quelle boisson.',
    type: 'physical', price_cents: 1999, stripe_price_id: 'price_creatine',
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'],
    badge: null, category: 'Nutrition', rating: 4.9, reviews: 45123, inStock: true,
    tags: ['créatine', 'force', 'puissance', 'musculation'],
    disciplines: ['musculation', 'crossfit', 'hiit'],
    features: ['Pureté 99,9%', '60 portions de 5g', 'Informed Sport certifiée', 'Sans goût', 'Résultats en 4 semaines'],
    amazon: { asin: 'B000GIQT3A', affiliateUrl: amazonUrl('kreatin monohydrat pulver') },
    isAffiliate: true,
  },
  {
    id: 'n3', slug: 'bcaa-myprotein-500g-fruit',
    name: 'BCAA 2:1:1 Fruit Punch 500g — MyProtein',
    brand: 'MyProtein',
    description: 'BCAAs ratio 2:1:1. 7g par dose, 83 portions. Certifié vegan. Récupération, anti-catabolisme, endurance.',
    longDescription: 'Les BCAAs (acides aminés branchés) en ratio 2:1:1 optimisé : Leucine, Isoleucine, Valine. La Leucine stimule directement la synthèse protéique, l\'Isoleucine aide à l\'utilisation du glucose et la Valine réduit la fatigue centrale. Idéals pendant l\'entraînement pour préserver la masse musculaire.',
    type: 'physical', price_cents: 2499, stripe_price_id: 'price_bcaa',
    images: ['https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?auto=format&fit=crop&w=800&q=80'],
    badge: '💊 Vegan', category: 'Nutrition', rating: 4.6, reviews: 12847, inStock: true,
    tags: ['bcaa', 'récupération', 'endurance', 'vegan'],
    disciplines: ['musculation', 'running-cardio', 'crossfit'],
    features: ['Ratio 2:1:1 optimal', '7g BCAAs/dose', '83 portions', 'Certifié vegan', 'Anti-catabolisme'],
    amazon: { asin: 'B00BXZ5Y8A', affiliateUrl: amazonUrl('bcaa pulver') },
    isAffiliate: true,
  },

  // ─── RECOVERY ─────────────────────────────────────────────────────
  {
    id: 'r1', slug: 'foam-roller-trigger-point',
    name: 'Foam Roller Pro Massage — TriggerPoint GRID',
    brand: 'TriggerPoint',
    description: 'Rouleau de massage multizone avec surface GRID brevetée. Simule les mains d\'un masseur. Récupération optimale.',
    longDescription: 'Le GRID de TriggerPoint est le foam roller de référence des professionnels. Sa surface à 3 zones distinctes (creux, tubulaire, plat) simule les doigts, paumes et pouces d\'un masseur. Le corps creux au centre assure la durabilité et l\'absorption de poids jusqu\'à 160kg. Inclus : accès à la bibliothèque vidéo complète.',
    type: 'physical', price_cents: 4499, stripe_price_id: 'price_foam_roller',
    images: ['https://images.unsplash.com/photo-1559656914-a30970c1affd?auto=format&fit=crop&w=800&q=80'],
    badge: '🔵 Pro', category: 'Recovery', rating: 4.7, reviews: 8921, inStock: true,
    tags: ['foam roller', 'récupération', 'massage', 'mobilité'],
    disciplines: ['running-cardio', 'musculation', 'yoga', 'stretching'],
    features: ['Surface GRID 3 zones', 'Simule massage pro', 'Support 160kg', 'Corps creux durable', 'Vidéos incluses'],
    amazon: { asin: 'B0093VBBZA', affiliateUrl: amazonUrl('faszienrolle foam roller') },
    isAffiliate: true,
  },
  {
    id: 'r2', slug: 'pistolet-massage-theragun',
    name: 'Pistolet de Massage Percussion — Theragun Mini',
    brand: 'Therabody',
    description: 'Mini pistolet percussion 2400 RPM, 3 vitesses, silencieux. Batterie 150min. Compact et puissant pour récupération rapide.',
    longDescription: 'Le Theragun Mini est la version compacte du pistolet de massage professionnel plébiscité par les athlètes NBA, NFL et olympiques. 2400 percussions/minute pénétrant 16mm en profondeur pour activer la circulation et libérer les tensions musculaires. 3 vitesses adaptées. Fonctionnement ultra-silencieux. Autonomie de 150 minutes.',
    type: 'physical', price_cents: 17900, original_price_cents: 21900, stripe_price_id: 'price_theragun_mini',
    images: ['https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=80'],
    badge: '🏅 Pro Athlete', category: 'Recovery', rating: 4.8, reviews: 15234, inStock: true,
    tags: ['pistolet massage', 'percussion', 'récupération', 'theragun'],
    disciplines: ['musculation', 'running-cardio', 'crossfit', 'yoga'],
    features: ['2400 RPM puissants', '3 vitesses adaptées', '150min autonomie', 'Ultra-silencieux 60dB', 'Compact & voyager'],
    amazon: { asin: 'B08F9P2BYD', affiliateUrl: amazonUrl('massagepistole muskel') },
    isAffiliate: true,
  },

  // ─── VÊTEMENTS ────────────────────────────────────────────────────
  {
    id: 'v1', slug: 'short-training-gymshark-homme',
    name: 'Short Entraînement Sport Performance Homme',
    brand: 'XENOTIF',
    description: 'Short 4-way stretch, Dry-Fit moisture-wicking. Poche zippée. Tailles S-XXL. Noir, gris, marine.',
    longDescription: 'Conçu pour les athlètes qui ne font aucun compromis sur la performance. Le tissu 4-way stretch épouse parfaitement le corps sans contraindre les mouvements. La technologie Dry-Fit évacue la transpiration 3x plus vite que le coton. Poche zippée latérale sécurisée pour smartphone. Coutures renforcées résistantes aux lavages intensifs.',
    type: 'physical', price_cents: 3499, stripe_price_id: 'price_short_homme',
    images: [
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80',
    ],
    badge: null, category: 'Vêtements', rating: 4.7, reviews: 1892, inStock: true,
    tags: ['short', 'training', 'running', 'homme'],
    disciplines: ['running-cardio', 'hiit', 'crossfit', 'boxing'],
    features: ['Tissu 4-way stretch', 'Dry-Fit moisture-wicking', 'Poche zippée', 'S à XXL', '3 coloris disponibles'],
    amazon: { asin: '', affiliateUrl: amazonUrl('sport shorts herren training fitness') },
    isAffiliate: true,
  },
  {
    id: 'v2', slug: 'legging-compression-femme-premium',
    name: 'Legging Compression Taille Haute Femme',
    brand: 'XENOTIF',
    description: 'Compression graduée, taille haute, tissu opaque anti-UV. Poche téléphone. XS-XL. 5 coloris.',
    longDescription: 'Le legging de compression XENOTIF offre un maintien optimal pour toutes les disciplines. La taille haute plate-forme assure un maintien du ventre sans comprimer. Le tissu opaque (280 GSM) est certifié anti-UV et résiste aux transparences même lors des squats. La compression graduée améliore la circulation sanguine et réduit les courbatures.',
    type: 'physical', price_cents: 4499, original_price_cents: 5499, stripe_price_id: 'price_legging_femme',
    images: [
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80',
    ],
    badge: '❤️ Best Seller', category: 'Vêtements', rating: 4.8, reviews: 3421, inStock: true,
    tags: ['legging', 'compression', 'femme', 'yoga'],
    disciplines: ['yoga', 'running-cardio', 'crossfit', 'hiit'],
    features: ['Compression graduée', 'Taille haute plate', 'Opaque anti-UV', 'Poche téléphone', 'XS à XL · 5 coloris'],
    amazon: { asin: '', affiliateUrl: amazonUrl('sport leggings damen high waist fitness') },
    isAffiliate: true,
  },

  // ─── PROGRAMMES DIGITAUX ──────────────────────────────────────────
  {
    id: 'd1', slug: 'programme-prise-masse-12-semaines',
    name: 'Programme Prise de Masse — 12 Semaines Complet',
    brand: 'XENOTIF Coach',
    description: '84 séances structurées, split 4j/semaine, progression de charge guidée. Plan nutrition + macros. PDF + vidéos.',
    longDescription: 'Le programme prise de masse le plus complet du marché français. 84 séances réparties sur 12 semaines avec progression en charge semaine par semaine. Includes : split musculaire détaillé, calcul macros personnalisé par morphotype, guide récupération, 40+ exercices illustrés en vidéo HD. Suivi de progression intégré sous Excel.',
    type: 'digital', price_cents: 2900, stripe_price_id: 'price_programme_masse',
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    ],
    badge: '📥 Bestseller', category: 'Programmes', rating: 4.9, reviews: 4127, inStock: true,
    tags: ['prise de masse', 'musculation', 'programme', 'PDF'],
    disciplines: ['musculation'],
    features: ['84 séances sur 12 semaines', 'Split 4j/semaine', 'Progression charge guidée', 'Plan nutrition + macros', 'Vidéos HD incluses'],
    download_url: '/downloads/programme-prise-masse.pdf',
    isAffiliate: false,
  },
  {
    id: 'd2', slug: 'plan-nutrition-seche-8-semaines',
    name: 'Plan Nutrition Sèche — 8 Semaines',
    brand: 'XENOTIF Coach',
    description: '56 jours de menus détaillés, 40+ recettes fitness, liste de courses, macros. Compatible vegan.',
    longDescription: 'Le plan nutrition sèche le plus téléchargé de la plateforme. 56 jours de menus variés calculés par notre nutritionniste certifiée. Chaque repas est optimisé pour maintenir la satiété tout en créant le déficit calorique nécessaire. Recettes simples et rapides (moins de 15 min). Compatible avec le régime vegan sur simple sélection.',
    type: 'digital', price_cents: 1900, stripe_price_id: 'price_plan_nutrition',
    images: [
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
    ],
    badge: '📥 PDF Instant', category: 'Programmes', rating: 4.8, reviews: 2891, inStock: true,
    tags: ['nutrition', 'sèche', 'régime', 'PDF'],
    disciplines: ['musculation', 'running-cardio', 'hiit'],
    features: ['56 jours de menus', '40+ recettes fitness', 'Liste courses hebdo', 'Macros personnalisés', 'Compatible vegan'],
    download_url: '/downloads/plan-nutrition-seche.pdf',
    isAffiliate: false,
  },
  {
    id: 'd3', slug: 'programme-hiit-6-semaines',
    name: 'Programme HIIT Brûle-Graisses — 6 Semaines',
    brand: 'XENOTIF Coach',
    description: '24 séances 20-30 min, 100% au poids du corps. Aucun matériel. Débutant → avancé. Résultats garantis.',
    longDescription: 'Le programme HIIT XENOTIF est conçu par notre coach certifié CrossFit Level 2. 4 séances par semaine de 20 à 30 minutes maximum, 100% au poids du corps — aucun matériel requis. La progressivité garantit une adaptation optimale sans risque de blessure. Chaque séance inclut un timer intégré et des vidéos de démonstration.',
    type: 'digital', price_cents: 1490, stripe_price_id: 'price_hiit_programme',
    images: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
    ],
    badge: '🔥 Populaire', category: 'Programmes', rating: 4.7, reviews: 3654, inStock: true,
    tags: ['HIIT', 'brûle-graisses', 'poids du corps', 'cardio'],
    disciplines: ['hiit', 'running-cardio'],
    features: ['24 séances 20-30 min', 'Sans matériel', 'Débutant → avancé', 'Timer intégré', 'Vidéos démo HD'],
    download_url: '/downloads/programme-hiit.pdf',
    isAffiliate: false,
  },
  {
    id: 'd4', slug: 'guide-running-marathon-complet',
    name: 'Guide Running — Du 5K au Marathon',
    brand: 'XENOTIF Coach',
    description: 'E-book 120 pages. Plans 5K/10K/semi/marathon. Nutrition course, prévention blessures, mental de compétiteur.',
    longDescription: 'Le guide running XENOTIF couvre tout le spectre du coureur moderne. Rédigé par un coach athlétisme FFA, il inclut des plans personnalisés pour 4 distances, des conseils nutrition avant/pendant/après course, un protocole anti-blessures en 7 points et une préparation mentale éprouvée. 120 pages richement illustrées.',
    type: 'digital', price_cents: 1490, stripe_price_id: 'price_guide_running',
    images: [
      'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=800&q=80',
    ],
    badge: '📥 E-book 120p', category: 'Programmes', rating: 4.8, reviews: 1987, inStock: true,
    tags: ['running', 'marathon', 'course à pied', 'e-book'],
    disciplines: ['running-cardio'],
    features: ['120 pages expert', 'Plans 5K/10K/semi/marathon', 'Nutrition course', 'Anti-blessures', 'Mental compétiteur'],
    download_url: '/downloads/guide-running-marathon.pdf',
    isAffiliate: false,
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug)
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter(p => p.category === category)
}

export function getProductsByDiscipline(discipline: string): Product[] {
  return PRODUCTS.filter(p => p.disciplines?.includes(discipline))
}

export function getCategories(): ProductCategory[] {
  return [...new Set(PRODUCTS.map(p => p.category))] as ProductCategory[]
}

export function getAffiliateProducts(): Product[] {
  return PRODUCTS.filter(p => p.isAffiliate)
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}

export const CATEGORY_ICONS: Record<string, string> = {
  'Équipements': '🏋️',
  'Nutrition':   '🥗',
  'Vêtements':   '👕',
  'Programmes':  '📋',
  'Cardio':      '🚴',
  'Recovery':    '💆',
}

