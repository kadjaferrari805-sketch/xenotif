export type ProductType = 'physical' | 'digital'
export type ProductCategory = 'Équipements' | 'Nutrition' | 'Vêtements' | 'Programmes' | 'Cardio' | 'Recovery' | 'Tech'

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
  imageFit?: 'cover' | 'contain'
  imagePosition?: string // ex: '50% 65%' pour recadrer sur une zone précise
}

// Tags affiliés Amazon (programme Associates EU) — un tag par marketplace.
export const AMAZON_TAG = 'xenotif-21'        // amazon.fr
export const AMAZON_TAG_DE = 'xenotif21-21'   // amazon.de

// Lien de recherche Amazon affilié — ne tombe jamais en 404 et conserve la commission.
export function amazonSearchUrl(domain: string, keywords: string, tag: string = AMAZON_TAG): string {
  return `https://${domain}/s?k=${encodeURIComponent(keywords)}&tag=${tag}`
}

// Version FR par défaut (catalogue products.ts) → amazon.fr, mots-clés français.
const amazonUrl = (keywords: string) => amazonSearchUrl('www.amazon.fr', keywords)

export const AMAZON_ASSOCIATE_TAG = AMAZON_TAG

export const PRODUCTS: Product[] = [
  // ─── ÉQUIPEMENTS ──────────────────────────────────────────────────
  {
    id: 'e1', slug: 'kettlebell-20kg-fonte-pro',
    name: 'Kettlebell Fonte Pro 20 kg — CORENGTH',
    brand: 'CORENGTH / Decathlon',
    description: 'Kettlebell fonte 20 kg avec base caoutchouc antidérapante et poignée sablée pour CrossFit, HIIT et musculation fonctionnelle.',
    longDescription: 'Conçue pour les athlètes exigeants, cette kettlebell en fonte à 80% recyclée offre une prise sablée pour un grip parfait même en sueur. La base caoutchouc protège le sol et assure une stabilité parfaite. Idéale pour swings, Turkish get-up, clean & press et snatch.',
    type: 'physical', price_cents: 6499, stripe_price_id: 'price_kettlebell_20kg',
    images: ['https://images.pexels.com/photos/221247/pexels-photo-221247.jpeg?auto=compress&cs=tinysrgb&w=800'],
    badge: '⭐ Bestseller', category: 'Équipements', rating: 4.8, reviews: 2847, inStock: true,
    tags: ['kettlebell', 'crossfit', 'musculation', 'force'],
    disciplines: ['crossfit', 'musculation', 'hiit'],
    features: ['20 kg — idéal CrossFit & HIIT', 'Fonte 80% recyclée', 'Base caoutchouc antidérapant', 'Poignée sablée grip optimal', 'Garantie 2 ans'],
    amazon: { asin: 'B07CWRS8BD', affiliateUrl: amazonUrl('kettlebell 20kg fonte') },
    isAffiliate: true,
  },
  {
    id: 'e2', slug: 'bandes-elastiques-portentum-5',
    name: 'Kit Bandes Élastiques Résistance × 5 — PORTENTUM',
    brand: 'PORTENTUM',
    description: 'Set de 5 bandes de résistance pour musculation et fitness. Résistances progressives de 25 à 125 lbs. Idéal entraînement complet à la maison.',
    longDescription: 'Le kit PORTENTUM comprend 5 bandes de résistance de couleurs différentes (de 25-65 lbs à 50-125 lbs) pour un entraînement progressif et complet. Parfaites pour la musculation, le crossfit, le yoga, la rééducation et le renforcement musculaire à la maison ou en déplacement. Durables, anti-glisse et faciles à transporter.',
    type: 'physical', price_cents: 3499, original_price_cents: 4999, stripe_price_id: 'price_bandes_elastiques',
    images: ['https://images.unsplash.com/photo-1584827386916-b5351d3ba34b?auto=format&fit=crop&w=1200&q=80'],
    badge: '🔥 Promo', category: 'Équipements', rating: 4.7, reviews: 1523, inStock: true,
    tags: ['bandes élastiques', 'résistance', 'fitness', 'musculation'],
    disciplines: ['musculation', 'yoga', 'stretching', 'running-cardio'],
    features: ['5 niveaux : 25 à 125 lbs', 'Musculation & fitness complet', 'Anti-glisse durable', 'Idéal à la maison', 'Faciles à transporter'],
    amazon: { asin: 'B0FP5BCCRL', affiliateUrl: amazonUrl('bandes élastiques musculation set') },
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
    amazon: { asin: 'B003JIW3EC', affiliateUrl: amazonUrl('tapis yoga antidérapant 10mm') },
    isAffiliate: true,
  },
  {
    id: 'e4', slug: 'corde-sauter-crossfit-reebok',
    name: 'Corde à Sauter Speed CrossFit — Reebok',
    brand: 'Reebok',
    description: 'Corde à sauter câble acier revêtu, roulements à billes aluminium. Réglable 2,5—3,5m. Parfaite pour HIIT et boxe.',
    longDescription: 'La corde à sauter Reebok Speed est conçue pour les athlètes CrossFit et boxeurs. Câble acier ultra-léger, roulements à billes de précision pour une rotation fluide à haute vitesse. Poignées ergonomiques en aluminium brossé. Idéale pour double-unders et HIIT intensif.',
    type: 'physical', price_cents: 2999, stripe_price_id: 'price_corde_sauter',
    images: ['https://images.pexels.com/photos/6339679/pexels-photo-6339679.jpeg?auto=compress&cs=tinysrgb&w=800'],
    badge: '⚡ Pro', category: 'Équipements', rating: 4.5, reviews: 892, inStock: true,
    tags: ['corde à sauter', 'cardio', 'crossfit', 'boxe'],
    disciplines: ['crossfit', 'hiit', 'boxing', 'running-cardio'],
    features: ['Câble acier revêtu', 'Roulements alu précision', 'Réglable 2,5—3,5m', 'Poignées ergonomiques', 'Bag de transport'],
    amazon: { asin: 'B07D7XR895', affiliateUrl: amazonUrl('corde à sauter speed rope crossfit') },
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
    amazon: { asin: 'B001ARYU58', affiliateUrl: amazonUrl('haltères réglables set') },
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
    amazon: { asin: 'B086C2L1B7', affiliateUrl: amazonUrl('vélo appartement ergomètre') },
    isAffiliate: true,
  },
  {
    id: 'e7', slug: 'roue-abdominale-pro-double',
    name: 'Roue Abdominale Pro — Double Roue + Tapis Genoux',
    brand: 'PROIRON',
    description: 'Roue abdominale à double roulement avec tapis genoux. Renforce abdos, gainage et dos. Antidérapante, montage en 1 minute.',
    longDescription: 'La roue abdominale PROIRON sollicite en profondeur toute la sangle abdominale, le dos et les épaules en un seul mouvement. Sa double roue large assure une stabilité parfaite pour un travail contrôlé, sans déséquilibre. Poignées ergonomiques antidérapantes pour un grip sûr même en sueur. Livrée avec un tapis de genoux pour protéger les articulations. Compacte, elle se range partout et se monte en moins d\'une minute — idéale pour renforcer le tronc à la maison.',
    type: 'physical', price_cents: 1999, original_price_cents: 2999, stripe_price_id: 'price_roue_abdominale',
    images: ['https://images.pexels.com/photos/13896557/pexels-photo-13896557.jpeg?auto=compress&cs=tinysrgb&w=800'],
    badge: '🔥 Promo', category: 'Équipements', rating: 4.7, reviews: 1340, inStock: true,
    tags: ['roue abdominale', 'abdominaux', 'gainage', 'core'],
    disciplines: ['musculation', 'crossfit', 'hiit'],
    features: ['Double roue ultra-stable', 'Tapis de genoux inclus', 'Renforce abdos, dos & gainage', 'Poignées antidérapantes', 'Compacte — montage 1 min'],
    amazon: { asin: 'B08PF38B9F', affiliateUrl: amazonUrl('roue abdominale ab wheel') },
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
    images: ['https://images.pexels.com/photos/5236668/pexels-photo-5236668.jpeg?auto=compress&cs=tinysrgb&w=800'],
    badge: '🏆 N°1 Europe', category: 'Nutrition', rating: 4.8, reviews: 89432, inStock: true,
    tags: ['whey', 'protéine', 'musculation', 'récupération'],
    disciplines: ['musculation', 'crossfit', 'running-cardio'],
    features: ['22g protéines / portion', '103 kcal seulement', '5g BCAAs naturels', 'Fabriquée en Europe', 'Sans sucres ajoutés'],
    amazon: { asin: 'B000GIQT2Q', affiliateUrl: amazonUrl('whey protéine chocolat 1kg') },
    isAffiliate: true,
    imagePosition: '50% 72%',
  },
  {
    id: 'n2', slug: 'creatine-monohydrate-myprotein-300g',
    name: 'Créatine Monohydrate Pure 300g — MyProtein',
    brand: 'MyProtein',
    description: 'Créatine micronisée 99,9% pure. 60 doses. Certifiée Informed Sport. Force et puissance en 4 semaines.',
    longDescription: 'La créatine monohydrate est le supplément le plus étudié en science du sport avec des centaines d\'études confirmant son efficacité. La version micronisée de MyProtein se dissout instantanément et est absorbée plus rapidement. Certifiée Informed Sport — testée antidopage. Sans goût pour se mélanger à n\'importe quelle boisson.',
    type: 'physical', price_cents: 1999, stripe_price_id: 'price_creatine',
    images: ['https://images.pexels.com/photos/33921585/pexels-photo-33921585.jpeg?auto=compress&cs=tinysrgb&w=800'],
    badge: null, category: 'Nutrition', rating: 4.9, reviews: 45123, inStock: true,
    tags: ['créatine', 'force', 'puissance', 'musculation'],
    disciplines: ['musculation', 'crossfit', 'hiit'],
    features: ['Pureté 99,9%', '60 portions de 5g', 'Informed Sport certifiée', 'Sans goût', 'Résultats en 4 semaines'],
    amazon: { asin: 'B000GIQT3A', affiliateUrl: amazonUrl('créatine monohydrate poudre') },
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
    amazon: { asin: 'B00BXZ5Y8A', affiliateUrl: amazonUrl('bcaa poudre') },
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
    images: ['https://images.pexels.com/photos/20890283/pexels-photo-20890283.jpeg?auto=compress&cs=tinysrgb&w=800'],
    badge: '🔵 Pro', category: 'Recovery', rating: 4.7, reviews: 8921, inStock: true,
    tags: ['foam roller', 'récupération', 'massage', 'mobilité'],
    disciplines: ['running-cardio', 'musculation', 'yoga', 'stretching'],
    features: ['Surface GRID 3 zones', 'Simule massage pro', 'Support 160kg', 'Corps creux durable', 'Vidéos incluses'],
    amazon: { asin: 'B0093VBBZA', affiliateUrl: amazonUrl('rouleau massage foam roller') },
    isAffiliate: true,
  },
  {
    id: 'r2', slug: 'pistolet-massage-theragun',
    name: 'Pistolet de Massage Percussion — Theragun Mini',
    brand: 'Therabody',
    description: 'Mini pistolet percussion 2400 RPM, 3 vitesses, silencieux. Batterie 150min. Compact et puissant pour récupération rapide.',
    longDescription: 'Le Theragun Mini est la version compacte du pistolet de massage professionnel plébiscité par les athlètes NBA, NFL et olympiques. 2400 percussions/minute pénétrant 16mm en profondeur pour activer la circulation et libérer les tensions musculaires. 3 vitesses adaptées. Fonctionnement ultra-silencieux. Autonomie de 150 minutes.',
    type: 'physical', price_cents: 17900, original_price_cents: 21900, stripe_price_id: 'price_theragun_mini',
    images: ['https://images.pexels.com/photos/11372618/pexels-photo-11372618.jpeg?auto=compress&cs=tinysrgb&w=800'],
    badge: '🏅 Pro Athlete', category: 'Recovery', rating: 4.8, reviews: 15234, inStock: true,
    tags: ['pistolet massage', 'percussion', 'récupération', 'theragun'],
    disciplines: ['musculation', 'running-cardio', 'crossfit', 'yoga'],
    features: ['2400 RPM puissants', '3 vitesses adaptées', '150min autonomie', 'Ultra-silencieux 60dB', 'Compact & voyager'],
    amazon: { asin: 'B08F9P2BYD', affiliateUrl: amazonUrl('pistolet massage musculaire') },
    isAffiliate: true,
  },

  // ─── MONTRES CONNECTÉES (TECH) ────────────────────────────────────
  {
    id: 't1', slug: 'montre-connectee-sport-gps',
    name: 'Montre Connectée Sport GPS Multisport',
    brand: 'Garmin / Polar / Coros',
    description: 'Montre GPS multisport avec cardio au poignet, suivi du sommeil, VO2 max et 100+ modes sport. Autonomie longue durée.',
    longDescription: 'La montre connectée idéale pour les athlètes : GPS intégré ultra-précis, capteur de fréquence cardiaque au poignet, suivi du sommeil et du stress, estimation de la VO2 max et plus de 100 profils sportifs (course, vélo, natation, musculation, HIIT). Compatible avec Strava, Apple Santé et Google Fit. Étanche et autonomie de plusieurs jours.',
    type: 'physical', price_cents: 19900, original_price_cents: 24900, stripe_price_id: 'price_montre_gps',
    images: ['https://images.pexels.com/photos/5081914/pexels-photo-5081914.jpeg?auto=compress&cs=tinysrgb&w=800'],
    badge: '⌚ GPS', category: 'Tech', rating: 4.7, reviews: 6842, inStock: true,
    tags: ['montre connectée', 'gps', 'cardio', 'running', 'multisport'],
    disciplines: ['running-cardio', 'cyclisme', 'natation', 'crossfit', 'hiit'],
    features: ['GPS multisport précis', 'Cardio au poignet', 'Suivi sommeil & VO2 max', '100+ modes sport', 'Compatible Strava & Apple Santé'],
    amazon: { asin: '', affiliateUrl: amazonUrl('montre sport gps cardio multisport') },
    isAffiliate: true,
  },
  {
    id: 't2', slug: 'bracelet-fitness-tracker',
    name: 'Bracelet Fitness Tracker d\'Activité',
    brand: 'Fitbit / Xiaomi / Huawei',
    description: 'Bracelet connecté léger : podomètre, calories, fréquence cardiaque, sommeil et notifications. Écran AMOLED. 14 jours d\'autonomie.',
    longDescription: 'Le compagnon fitness parfait au quotidien. Ce bracelet d\'activité suit automatiquement tes pas, calories brûlées, fréquence cardiaque et qualité de sommeil. Écran AMOLED couleur lumineux, étanche pour la natation, et jusqu\'à 14 jours d\'autonomie. Reçois tes notifications (appels, SMS, apps) directement au poignet. Synchronisation avec l\'app Xenotif via Apple Santé / Google Fit.',
    type: 'physical', price_cents: 4900, original_price_cents: 6900, stripe_price_id: 'price_bracelet_tracker',
    images: ['https://images.pexels.com/photos/18662969/pexels-photo-18662969.jpeg?auto=compress&cs=tinysrgb&w=800'],
    badge: '🔥 Promo', category: 'Tech', rating: 4.5, reviews: 23184, inStock: true,
    tags: ['bracelet connecté', 'fitness tracker', 'podomètre', 'sommeil'],
    disciplines: ['running-cardio', 'hiit', 'musculation', 'yoga'],
    features: ['Podomètre & calories', 'Cardio 24/7', 'Suivi sommeil', 'Écran AMOLED couleur', '14 jours d\'autonomie'],
    amazon: { asin: '', affiliateUrl: amazonUrl('bracelet connecté fitness cardio') },
    isAffiliate: true,
  },
  {
    id: 't3', slug: 'montre-connectee-tactile-running',
    name: 'Smartwatch Tactile Running & Cardio',
    brand: 'Apple Watch / Samsung / Amazfit',
    description: 'Smartwatch écran tactile AMOLED, GPS, ECG, SpO2 et coach running intégré. Appels Bluetooth, paiement sans contact, 100+ cadrans.',
    longDescription: 'Une smartwatch premium pour transformer ton entraînement. Grand écran tactile AMOLED, GPS intégré pour tracer tes parcours, capteurs avancés (ECG, oxygène sanguin SpO2, fréquence cardiaque). Coach running intégré avec plans personnalisés, alertes de zones cardiaques et récupération. Passe tes appels en Bluetooth, paie sans contact, et personnalise parmi 100+ cadrans. Compatible iOS & Android.',
    type: 'physical', price_cents: 12900, stripe_price_id: 'price_smartwatch_tactile',
    images: ['https://images.pexels.com/photos/7671474/pexels-photo-7671474.jpeg?auto=compress&cs=tinysrgb&w=800'],
    badge: '⌚ AMOLED', category: 'Tech', rating: 4.6, reviews: 11237, inStock: true,
    tags: ['smartwatch', 'apple watch', 'ecg', 'running', 'cardio'],
    disciplines: ['running-cardio', 'crossfit', 'hiit', 'musculation', 'yoga'],
    features: ['Écran tactile AMOLED', 'GPS + ECG + SpO2', 'Coach running intégré', 'Appels Bluetooth', 'Compatible iOS & Android'],
    amazon: { asin: '', affiliateUrl: amazonUrl('montre connectée fitness gps cardio') },
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
      'https://images.pexels.com/photos/4803921/pexels-photo-4803921.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    badge: null, category: 'Vêtements', rating: 4.7, reviews: 1892, inStock: true,
    tags: ['short', 'training', 'running', 'homme'],
    disciplines: ['running-cardio', 'hiit', 'crossfit', 'boxing'],
    features: ['Tissu 4-way stretch', 'Dry-Fit moisture-wicking', 'Poche zippée', 'S à XXL', '3 coloris disponibles'],
    amazon: { asin: '', affiliateUrl: amazonUrl('short sport homme training fitness') },
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
      'https://images.pexels.com/photos/3931227/pexels-photo-3931227.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    badge: '❤️ Best Seller', category: 'Vêtements', rating: 4.8, reviews: 3421, inStock: true,
    tags: ['legging', 'compression', 'femme', 'yoga'],
    disciplines: ['yoga', 'running-cardio', 'crossfit', 'hiit'],
    features: ['Compression graduée', 'Taille haute plate', 'Opaque anti-UV', 'Poche téléphone', 'XS à XL · 5 coloris'],
    amazon: { asin: '', affiliateUrl: amazonUrl('legging sport femme taille haute') },
    isAffiliate: true,
  },
  {
    id: 'v3', slug: 'legging-compression-homme-premium',
    name: 'Legging Compression Performance Homme',
    brand: 'XENOTIF',
    description: 'Legging de compression homme, tissu technique respirant. Maintien musculaire, séchage rapide. Idéal running, muscu, crossfit. S-XXL.',
    longDescription: 'Le legging de compression XENOTIF pour homme offre un maintien musculaire optimal qui réduit les vibrations et la fatigue. Le tissu technique 4-way stretch évacue la transpiration et sèche rapidement. Coutures plates anti-frottement, taille élastiquée confortable et poche latérale. Parfait porté seul ou sous un short pour le running, la musculation, le CrossFit ou comme couche de base.',
    type: 'physical', price_cents: 3999, original_price_cents: 4999, stripe_price_id: 'price_legging_homme',
    images: ['https://images.pexels.com/photos/5327453/pexels-photo-5327453.jpeg?auto=compress&cs=tinysrgb&w=800'],
    badge: '🆕 Nouveau', category: 'Vêtements', rating: 4.7, reviews: 2156, inStock: true,
    tags: ['legging', 'compression', 'homme', 'running'],
    disciplines: ['running-cardio', 'musculation', 'crossfit', 'hiit'],
    features: ['Compression musculaire', 'Tissu 4-way stretch', 'Séchage rapide', 'Coutures anti-frottement', 'S à XXL'],
    amazon: { asin: '', affiliateUrl: amazonUrl('legging compression homme sport') },
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

  // ─── CYCLISME (affiliation Amazon) ────────────────────────────────
  {
    id: 'c1', slug: 'casque-velo-route',
    name: 'Casque Vélo Route Aérodynamique',
    brand: 'ROCKBROS',
    description: 'Casque vélo léger et ventilé, coque renforcée et molette d\'ajustement. Sécurité et confort pour la route comme le VTT.',
    longDescription: 'Un bon casque est le premier équipement non négociable du cycliste. Ce modèle aérodynamique allie une coque in-mold renforcée à une structure ultra-légère (~250 g) pour une protection optimale sans gêne. Ses larges aérations maintiennent la tête au frais sur les longues sorties, et la molette d\'ajustement micrométrique assure un maintien parfait quelle que soit la morphologie. Sangles déperlantes et visière amovible incluses.',
    type: 'physical', price_cents: 4990, original_price_cents: 6990, stripe_price_id: 'price_aff_casque_velo',
    images: ['https://images.pexels.com/photos/12956080/pexels-photo-12956080.jpeg?auto=compress&cs=tinysrgb&w=800'],
    badge: '🚴 Sécurité', category: 'Équipements', rating: 4.6, reviews: 2143, inStock: true,
    tags: ['casque vélo', 'sécurité', 'cyclisme', 'route'],
    disciplines: ['cyclisme'],
    features: ['Coque in-mold renforcée', 'Ultra-léger (~250 g)', 'Aérations multiples', 'Molette d\'ajustement', 'Visière amovible'],
    amazon: { asin: 'B07VND8R9P', affiliateUrl: amazonUrl('casque vélo route adulte') },
    isAffiliate: true,
  },
  {
    id: 'c2', slug: 'compteur-gps-velo',
    name: 'Compteur GPS Vélo sans Fil',
    brand: 'iGPSPORT',
    description: 'Compteur GPS étanche : vitesse, distance, dénivelé, parcours. Grand écran lisible au soleil, autonomie 25 h, montage rapide.',
    longDescription: 'Mesure chaque sortie avec précision grâce à ce compteur GPS sans fil. Il enregistre vitesse, distance, temps, altitude, dénivelé et tracé GPS, et se synchronise avec Strava et Komoot. Écran transflectif parfaitement lisible en plein soleil, autonomie de 25 heures et étanchéité IPX7. Le support guidon fourni s\'installe sans outil en quelques secondes. Compatible capteurs ANT+ (cardio, cadence, vitesse).',
    type: 'physical', price_cents: 3990, stripe_price_id: 'price_aff_gps_velo',
    images: ['https://images.pexels.com/photos/7340701/pexels-photo-7340701.jpeg?auto=compress&cs=tinysrgb&w=800'],
    badge: '📡 GPS', category: 'Tech', rating: 4.5, reviews: 1689, inStock: true,
    tags: ['compteur gps', 'cyclisme', 'strava', 'vélo'],
    disciplines: ['cyclisme'],
    features: ['GPS vitesse/distance/dénivelé', 'Sync Strava & Komoot', 'Écran lisible au soleil', 'Autonomie 25 h · IPX7', 'Compatible ANT+'],
    amazon: { asin: 'B08T1Y2QRX', affiliateUrl: amazonUrl('compteur gps vélo sans fil') },
    isAffiliate: true,
  },
  {
    id: 'c4', slug: 'maillot-cuissard-velo',
    name: 'Cuissard Vélo Rembourré 4D',
    brand: 'Van Rysel',
    description: 'Cuissard cycliste avec peau de chamois 4D respirante. Tissu compressif, bandes anti-glisse. Confort sur les longues distances.',
    longDescription: 'Le confort sur le vélo se joue d\'abord sur la selle : ce cuissard intègre une peau de chamois 4D haute densité qui amortit les chocs et évite les irritations, même après plusieurs heures. Le tissu compressif et respirant évacue la transpiration et soutient les muscles, tandis que les bandes silicone en bas de cuisse maintiennent le cuissard en place. Coutures plates anti-frottement. La base de toute tenue de cycliste sérieux.',
    type: 'physical', price_cents: 3490, stripe_price_id: 'price_aff_cuissard_velo',
    images: ['https://images.pexels.com/photos/5789228/pexels-photo-5789228.jpeg?auto=compress&cs=tinysrgb&w=800'],
    badge: '🩳 Confort', category: 'Vêtements', rating: 4.5, reviews: 1254, inStock: true,
    tags: ['cuissard vélo', 'cyclisme', 'vêtement', 'route'],
    disciplines: ['cyclisme'],
    features: ['Peau de chamois 4D', 'Tissu compressif respirant', 'Bandes anti-glisse', 'Coutures plates', 'Longues distances'],
    amazon: { asin: 'B08YDH7J5K', affiliateUrl: amazonUrl('cuissard vélo homme rembourré') },
    isAffiliate: true,
  },
  {
    id: 'c5', slug: 'gants-velo-demi-doigts',
    name: 'Gants de Vélo Demi-Doigts Anti-Choc',
    brand: 'GripGrab',
    description: 'Gants cyclistes demi-doigts avec gel anti-choc, paume respirante et tirette de retrait. Meilleur grip, moins de fatigue.',
    longDescription: 'Les gants protègent les mains des vibrations et des chutes, tout en améliorant le grip sur le guidon. Ce modèle demi-doigts intègre des coussinets gel aux points de pression pour absorber les chocs et réduire l\'engourdissement sur les longues sorties. Dos en mesh respirant, paume en suédine antidérapante, et languettes de retrait pratiques. Zone éponge sur le pouce pour s\'essuyer le front.',
    type: 'physical', price_cents: 1690, stripe_price_id: 'price_aff_gants_velo',
    images: ['https://images.pexels.com/photos/12266473/pexels-photo-12266473.jpeg?auto=compress&cs=tinysrgb&w=800'],
    badge: '🧤 Grip', category: 'Vêtements', rating: 4.6, reviews: 2071, inStock: true,
    tags: ['gants vélo', 'cyclisme', 'anti-choc', 'grip'],
    disciplines: ['cyclisme'],
    features: ['Gel anti-choc', 'Paume antidérapante', 'Dos respirant', 'Languettes de retrait', 'Demi-doigts'],
    amazon: { asin: 'B07QF9V6T2', affiliateUrl: amazonUrl('gants vélo demi doigts') },
    isAffiliate: true,
  },
  {
    id: 'c7', slug: 'bidon-velo-porte-bidon',
    name: 'Bidon Vélo 750 ml + Porte-Bidon',
    brand: 'Zéfal',
    description: 'Bidon 750 ml sans BPA + porte-bidon léger en aluminium. Hydratation facile d\'une main, montage sur le cadre.',
    longDescription: 'S\'hydrater régulièrement est clé sur le vélo. Cet ensemble réunit un bidon souple de 750 ml sans BPA, au bec anti-fuite et au débit généreux pour boire d\'une seule main, et un porte-bidon léger en aluminium qui se fixe sur les inserts du cadre. Le bidon est compressible, facile à presser et passe au lave-vaisselle. Le porte-bidon maintient fermement le bidon même sur terrain accidenté.',
    type: 'physical', price_cents: 1290, stripe_price_id: 'price_aff_bidon_velo',
    images: ['https://images.pexels.com/photos/17755959/pexels-photo-17755959.jpeg?auto=compress&cs=tinysrgb&w=800'],
    badge: '💧 Hydratation', category: 'Équipements', rating: 4.5, reviews: 968, inStock: true,
    tags: ['bidon vélo', 'porte-bidon', 'hydratation', 'cyclisme'],
    disciplines: ['cyclisme'],
    features: ['Bidon 750 ml sans BPA', 'Bec anti-fuite', 'Porte-bidon aluminium', 'Boire d\'une main', 'Passe au lave-vaisselle'],
    amazon: { asin: 'B0026ROS8Q', affiliateUrl: amazonUrl('bidon vélo porte-bidon') },
    isAffiliate: true,
  },

  // ─── NATATION (affiliation Amazon) ────────────────────────────────
  {
    id: 's1', slug: 'lunettes-natation-anti-buee',
    name: 'Lunettes de Natation Anti-Buée',
    brand: 'Arena',
    description: 'Lunettes de natation étanches, verres anti-buée et anti-UV, joints en silicone souple. Vision claire et confort, sans fuite.',
    longDescription: 'Des lunettes qui ne s\'embuent pas et ne fuient pas changent une séance de natation. Ce modèle combine un traitement anti-buée durable et une protection anti-UV pour une vision nette en piscine comme en eau libre. Les joints en silicone souple épousent le contour des yeux sans marquer, et le pont de nez interchangeable (3 tailles fournies) s\'adapte à toutes les morphologies. Sangle double réglable d\'une seule main.',
    type: 'physical', price_cents: 1490, original_price_cents: 1990, stripe_price_id: 'price_aff_lunettes_natation',
    images: ['https://images.pexels.com/photos/5915306/pexels-photo-5915306.jpeg?auto=compress&cs=tinysrgb&w=800'],
    badge: '🥽 Anti-buée', category: 'Équipements', rating: 4.6, reviews: 3120, inStock: true,
    tags: ['lunettes natation', 'anti-buée', 'natation', 'piscine'],
    disciplines: ['natation'],
    features: ['Verres anti-buée durables', 'Protection anti-UV', 'Joints silicone souple', '3 ponts de nez fournis', 'Sangle réglable d\'une main'],
    amazon: { asin: 'B00KMU3R8A', affiliateUrl: amazonUrl('lunettes natation anti buée') },
    isAffiliate: true,
  },
  {
    id: 's2', slug: 'bonnet-bain-silicone',
    name: 'Bonnet de Bain Silicone',
    brand: 'Speedo',
    description: 'Bonnet de bain 100 % silicone, étanche et confortable. Réduit la traînée, protège les cheveux du chlore. Mixte, taille unique.',
    longDescription: 'Le bonnet en silicone est l\'accessoire de base de tout nageur : il protège les cheveux du chlore, réduit la traînée dans l\'eau et garde la tête au chaud. Ce modèle 100 % silicone est doux, durable et facile à enfiler sans tirer les cheveux. Il reste parfaitement en place pendant les longueurs et n\'irrite pas le front. Taille unique adaptée aux hommes, femmes et adolescents.',
    type: 'physical', price_cents: 990, stripe_price_id: 'price_aff_bonnet_bain',
    images: ['https://images.pexels.com/photos/18090671/pexels-photo-18090671.jpeg?auto=compress&cs=tinysrgb&w=800'],
    badge: '🏊 Essentiel', category: 'Équipements', rating: 4.5, reviews: 2480, inStock: true,
    tags: ['bonnet de bain', 'silicone', 'natation', 'piscine'],
    disciplines: ['natation'],
    features: ['100 % silicone souple', 'Étanche & confortable', 'Réduit la traînée', 'Protège les cheveux', 'Taille unique mixte'],
    amazon: { asin: 'B001HBHNH0', affiliateUrl: amazonUrl('bonnet de bain silicone') },
    isAffiliate: true,
  },
  {
    id: 's3', slug: 'planche-natation-kickboard',
    name: 'Planche de Natation (Kickboard)',
    brand: 'Arena',
    description: 'Planche en mousse EVA pour renforcer le battement de jambes. Légère, ergonomique, haute flottabilité. Idéale à l\'entraînement.',
    longDescription: 'La planche est l\'outil indispensable pour travailler le battement de jambes et la position du corps. En mousse EVA haute densité, elle offre une flottabilité élevée tout en restant légère et résistante au chlore. Sa forme ergonomique avec découpes pour les mains assure une prise confortable quel que soit l\'exercice. Elle convient aux nageurs débutants comme confirmés pour les éducatifs et le renforcement.',
    type: 'physical', price_cents: 1290, stripe_price_id: 'price_aff_planche_natation',
    images: ['https://images.pexels.com/photos/8028663/pexels-photo-8028663.jpeg?auto=compress&cs=tinysrgb&w=800'],
    badge: '🏊 Entraînement', category: 'Équipements', rating: 4.7, reviews: 1654, inStock: true,
    tags: ['planche natation', 'kickboard', 'entraînement', 'natation'],
    disciplines: ['natation'],
    features: ['Mousse EVA haute densité', 'Flottabilité élevée', 'Découpes ergonomiques', 'Résistante au chlore', 'Débutant à confirmé'],
    amazon: { asin: 'B0788KZJV2', affiliateUrl: amazonUrl('planche natation kickboard') },
    isAffiliate: true,
  },
  {
    id: 's4', slug: 'maillot-bain-natation-chlororesistant',
    name: 'Maillot de Bain Natation Chlororésistant',
    brand: 'Arena',
    description: 'Maillot d\'entraînement chlororésistant, séchage rapide, coupe ajustée anti-traînée. Tient des centaines de séances en piscine.',
    longDescription: 'Conçu pour l\'entraînement intensif, ce maillot en tissu chlororésistant garde sa forme et ses couleurs séance après séance, là où un maillot classique se détend en quelques semaines. La coupe ajustée réduit la traînée dans l\'eau, le séchage est rapide et les coutures plates évitent les irritations. Le choix durable pour qui enchaîne les longueurs.',
    type: 'physical', price_cents: 2490, stripe_price_id: 'price_aff_maillot_natation',
    images: ['https://images.pexels.com/photos/8688609/pexels-photo-8688609.jpeg?auto=compress&cs=tinysrgb&w=800'],
    badge: '🩱 Endurance', category: 'Vêtements', rating: 4.6, reviews: 1290, inStock: true,
    tags: ['maillot de bain', 'natation', 'chlororésistant', 'piscine'],
    disciplines: ['natation'],
    features: ['Tissu chlororésistant', 'Séchage rapide', 'Coupe ajustée anti-traînée', 'Coutures plates', 'Tenue longue durée'],
    amazon: { asin: 'B07PGSC9LR', affiliateUrl: amazonUrl('maillot de bain natation chlore résistant') },
    isAffiliate: true,
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id)
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
  'Tech':        '⌚',
}

