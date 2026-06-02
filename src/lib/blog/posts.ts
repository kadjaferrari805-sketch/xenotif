export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  category: 'Musculation' | 'Nutrition' | 'Running' | 'Récupération' | 'Matériel' | 'HIIT'
  coverImage: string
  // Cadrage de la couverture (CSS object-position). Défaut centré ('50% 50%').
  coverPosition?: string
  author: string
  publishedAt: string // ISO date
  readingMinutes: number
  productSlugs: string[]
  content: ContentBlock[]
}

export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'quote'; text: string }
  | { type: 'productCta'; productSlug: string; reason: string }

const BLOG_POSTS: BlogPost[] = [
  // ─── ARTICLE 1 ──────────────────────────────────────────────────────────────
  {
    slug: 'meilleurs-halteres-musculation-maison-2026',
    title: 'Les 5 Meilleurs Haltères pour la Musculation à la Maison en 2026',
    excerpt:
      'Home gym ou salle à domicile ? Découvrez notre sélection des meilleurs haltères pour muscler chez vous efficacement, avec comparatif complet et conseils d\'experts.',
    metaTitle: 'Meilleurs Haltères Musculation Maison 2026 — Comparatif & Guide d\'Achat',
    metaDescription:
      'Comparatif des 5 meilleurs haltères pour la musculation à la maison en 2026. Réglables, fixes, kettlebells : notre guide expert pour choisir selon votre budget et objectifs.',
    keywords: [
      'meilleurs haltères musculation',
      'haltères maison 2026',
      'haltères réglables',
      'home gym équipement',
      'kettlebell musculation',
      'haltères débutant',
    ],
    category: 'Matériel',
    coverImage:
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80',
    author: 'Thomas Mercier',
    publishedAt: '2026-01-15T08:00:00Z',
    readingMinutes: 9,
    productSlugs: [
      'halteres-reglables-bowflex',
      'kettlebell-20kg-fonte-pro',
      'bandes-elastiques-gjelements-5',
    ],
    content: [
      {
        type: 'paragraph',
        text: "Construire un home gym efficace n'a jamais été aussi accessible. Mais face à l'offre pléthorique du marché — haltères fixes, réglables, kettlebells, barres — difficile de savoir quoi acheter. Trop léger : vous stagnez en 3 mois. Trop lourd et inadapté : blessure assurée. Ce guide vous aide à faire le bon choix en 2026.",
      },
      {
        type: 'heading',
        text: 'Pourquoi Investir dans des Haltères pour la Maison ?',
      },
      {
        type: 'paragraph',
        text: "L'argument économique est implacable : un abonnement en salle coûte en moyenne 40 € par mois, soit 480 € par an. Un bon set d'haltères réglables, amorti sur 5 ans, revient à moins de 60 € annuels. Mais l'avantage va bien au-delà du portefeuille. À domicile, vous vous entraînez quand vous voulez, sans file d'attente pour les appareils, sans transport. Les études montrent que la régularité d'entraînement — facteur numéro un de progression — est significativement meilleure chez les personnes s'entraînant à domicile.",
      },
      {
        type: 'subheading',
        text: 'Quels Objectifs Peut-on Atteindre avec des Haltères ?',
      },
      {
        type: 'list',
        items: [
          'Hypertrophie musculaire (prise de masse) : séries de 8 à 12 répétitions en surcharge progressive',
          'Force maximale : séries de 3 à 5 répétitions avec charges lourdes',
          'Endurance musculaire et résistance : séries de 15 à 20 répétitions',
          'Perte de poids et cardio : circuits HIIT avec temps de repos court',
          'Rééducation et prévention des blessures : mouvements de correction posturale',
        ],
      },
      {
        type: 'heading',
        text: 'Les 5 Critères Essentiels pour Choisir ses Haltères',
      },
      {
        type: 'subheading',
        text: '1. La Plage de Poids : Anticipez Votre Progression',
      },
      {
        type: 'paragraph',
        text: "C'est l'erreur la plus commune : acheter trop léger. Un débutant homme démarrera typiquement avec des curls à 8-10 kg, mais atteindra facilement 16-20 kg en 6 mois d'entraînement régulier. Pour une femme, la progression va de 4-6 kg à 10-14 kg sur la même période. Optez toujours pour une plage couvrant au moins le double de votre poids de départ. Les haltères réglables type Bowflex (2-24 kg) sont ici imbattables : ils évoluent avec vous.",
      },
      {
        type: 'subheading',
        text: '2. Le Type de Construction : Durabilité et Sécurité',
      },
      {
        type: 'paragraph',
        text: "La fonte est le matériau roi pour les charges lourdes : indestructible, densité élevée, prix raisonnable. Le revêtement caoutchouc ou néoprène protège vos sols et réduit le bruit lors des déposes. Évitez les haltères chromés bon marché pour les charges supérieures à 15 kg : les bavures de métal peuvent blesser, et les soudures lâchent. Pour un usage intensif, exigez des hexagonaux — ils ne roulent pas.",
      },
      {
        type: 'subheading',
        text: '3. L\'Ergonomie : La Poignée qui Change Tout',
      },
      {
        type: 'paragraph',
        text: "Une poignée de 28-29 mm de diamètre convient à la majorité des mains. Le knurling (rainurage) doit être suffisant pour assurer le grip sans écorcher. Trop lisse et vous échapperez l'haltère en fin de série ; trop agressif et vous vous blesserez les paumes. Les meilleurs modèles proposent un knurling medium au centre et plus doux sur les extrémités.",
      },
      {
        type: 'productCta',
        productSlug: 'halteres-reglables-bowflex',
        reason:
          'Les Bowflex SelectTech sont notre choix numéro 1 : 2 à 24 kg en tournant un sélecteur, remplacent 15 paires, construction acier premium. L\'investissement idéal pour un home gym complet.',
      },
      {
        type: 'heading',
        text: 'Haltères Réglables vs Haltères Fixes : Quel Choix ?',
      },
      {
        type: 'paragraph',
        text: "Les haltères fixes ont un avantage : ils sont prêts à l'emploi instantanément, sans manipulation. Mais pour un home gym, ils occupent un espace considérable et nécessitent un investissement massif pour couvrir toute la plage utile (de 5 à 30 kg, comptez facilement 500-800 €). Les haltères réglables sont la solution rationnelle : même prix, bien plus de poids, rangement minimal.",
      },
      {
        type: 'subheading',
        text: 'Les Kettlebells : Un Complément Indispensable',
      },
      {
        type: 'paragraph',
        text: "Les kettlebells ne remplacent pas les haltères mais les complètent parfaitement. Leur centre de gravité déporté les rend idéaux pour les mouvements balistiques (swings, snatches, cleans) qui travaillent la chaîne postérieure — fessiers, ischio-jambiers, dos — d'une manière impossible avec des haltères classiques. Un kettlebell 16 kg (pour femme) ou 20-24 kg (pour homme) est la porte d'entrée idéale.",
      },
      {
        type: 'productCta',
        productSlug: 'kettlebell-20kg-fonte-pro',
        reason:
          'La Kettlebell Fonte Pro 20 kg CORENGTH offre un rapport qualité/prix imbattable. Fonte recyclée, base caoutchouc, poignée sablée : tout ce qu\'un athlète exigeant attend.',
      },
      {
        type: 'heading',
        text: 'Programme d\'Entraînement Type avec Haltères à la Maison',
      },
      {
        type: 'subheading',
        text: 'Séance Full Body 3 Fois par Semaine (Débutant à Intermédiaire)',
      },
      {
        type: 'list',
        items: [
          'A1 — Goblet Squat : 4 séries × 12 reps (kettlebell ou haltère unique)',
          'A2 — Développé Couché sur Sol : 4 séries × 10 reps (haltères)',
          'B1 — Romanian Deadlift : 3 séries × 12 reps (haltères)',
          'B2 — Rowing Unilatéral : 3 séries × 10 reps chaque côté',
          'C1 — Curl Biceps : 3 séries × 12 reps',
          'C2 — Extension Triceps : 3 séries × 12 reps',
          'D1 — Swing Kettlebell : 3 séries × 15 reps',
        ],
      },
      {
        type: 'paragraph',
        text: "Repos entre les séries : 60-90 secondes pour les supersets A et B, 45 secondes pour C et D. Augmentez le poids dès que vous réalisez toutes les répétitions avec 2 répétitions en réserve (RIR 2). C'est la surcharge progressive — le principe fondamental de toute progression musculaire.",
      },
      {
        type: 'quote',
        text: "La salle de sport la plus efficace est celle où vous allez réellement. Investir dans un bon home gym, c'est investir dans votre régularité.",
      },
      {
        type: 'heading',
        text: 'Les Bandes Élastiques : Le Complément Malin',
      },
      {
        type: 'paragraph',
        text: "Pour compléter votre arsenal sans exploser votre budget, les bandes élastiques sont un investissement remarquable. Elles permettent d'ajouter de la résistance variable — maximale en étirement, nulle au point de départ — ce qui est impossible avec des poids libres. Parfaites pour les exercices de dos (face pulls, pull-apart) et pour l'assistance aux mouvements comme les tractions. Un set de 5 résistances couvre tous vos besoins.",
      },
    ],
  },

  // ─── ARTICLE 2 ──────────────────────────────────────────────────────────────
  {
    slug: 'whey-proteine-guide-complet-debutant',
    title: 'Whey Protéine : Le Guide Complet pour Débutants (Quand, Combien, Comment)',
    excerpt:
      'Whey concentrate, isolate, hydrolysat... quelle protéine choisir ? Notre guide nutritionnel complet répond à toutes vos questions sur la supplémentation en protéines.',
    metaTitle: 'Whey Protéine Guide Complet Débutant — Dosage, Timing & Conseils',
    metaDescription:
      'Tout ce que vous devez savoir sur la whey protéine : quelle whey choisir, quand la prendre, combien de grammes par jour. Guide nutritionnel expert pour débutants et confirmés.',
    keywords: [
      'whey protéine débutant',
      'guide whey protéine',
      'quand prendre whey',
      'dosage protéine musculation',
      'whey concentrate vs isolate',
      'meilleure protéine prise de masse',
    ],
    category: 'Nutrition',
    coverImage:
      'https://images.pexels.com/photos/5236668/pexels-photo-5236668.jpeg?auto=compress&cs=tinysrgb&w=1200',
    coverPosition: '50% 62%',
    author: 'Dr. Sophie Laurent',
    publishedAt: '2026-01-22T08:00:00Z',
    readingMinutes: 10,
    productSlugs: [
      'whey-myprotein-chocolat-1kg',
      'creatine-monohydrate-myprotein-300g',
      'bcaa-myprotein-500g-fruit',
    ],
    content: [
      {
        type: 'paragraph',
        text: "La protéine de lactosérum — ou whey — est le complément alimentaire le plus étudié et le plus utilisé dans le monde du fitness. Mais derrière ce terme générique se cachent des produits très différents, des usages spécifiques et des malentendus persistants. Ce guide vous donnera toutes les clés pour l'utiliser intelligemment.",
      },
      {
        type: 'heading',
        text: 'Qu\'est-ce que la Whey Protéine Exactement ?',
      },
      {
        type: 'paragraph',
        text: "La whey est un sous-produit de la fabrication du fromage. Lorsque le lait est coagulé, il se sépare en deux phases : le caillé (fromage) et le lactosérum liquide (whey). Ce dernier est filtré, concentré et séché pour produire la poudre de protéine que vous connaissez. Sa composition en acides aminés essentiels est exceptionnelle : elle contient tous les acides aminés essentiels, avec une concentration particulièrement élevée en leucine — l'acide aminé qui déclenche la synthèse protéique musculaire.",
      },
      {
        type: 'subheading',
        text: 'Les 3 Types de Whey : Laquelle Choisir ?',
      },
      {
        type: 'list',
        items: [
          'Whey Concentrate (WPC) : 70-80% de protéines, contient lactose et graisses. La plus abordable, idéale pour débuter.',
          'Whey Isolate (WPI) : 90-95% de protéines, quasi sans lactose ni graisses. Plus pure, digestion plus rapide.',
          'Whey Hydrolysat : protéines pré-digérées, absorption ultra-rapide. Plus chère, avantage marginal sauf post-effort intense.',
        ],
      },
      {
        type: 'paragraph',
        text: "Notre recommandation : la whey concentrate est largement suffisante pour 90% des pratiquants. Si vous êtes intolérant au lactose ou cherchez à minimiser les glucides en phase de sèche, passez à l'isolate. L'hydrolysat ne présente pas d'avantage prouvé sur les performances pour un pratiquant lambda.",
      },
      {
        type: 'productCta',
        productSlug: 'whey-myprotein-chocolat-1kg',
        reason:
          'Notre whey chocolat MyProtein Impact est une concentrate de qualité premium : 21g de protéines par dose, 4,5g de BCAA naturels, prix imbattable. Le rapport qualité/prix de référence sur le marché.',
      },
      {
        type: 'heading',
        text: 'Combien de Protéines Par Jour ? Les Vraies Recommandations',
      },
      {
        type: 'paragraph',
        text: "Les recommandations officielles (0,8g/kg de poids corporel) sont calibrées pour la population sédentaire. Pour un pratiquant de musculation cherchant à développer sa masse musculaire, les études les plus récentes convergent vers une fourchette de 1,6 à 2,2 g/kg de poids corporel par jour. Pour un homme de 80 kg : entre 128 et 176 g de protéines quotidiennes.",
      },
      {
        type: 'subheading',
        text: 'Comment Calculer Votre Besoin Personnel',
      },
      {
        type: 'list',
        items: [
          'Niveau débutant (0-6 mois) : 1,6 g/kg — synthèse protéique élevée, progression rapide',
          'Niveau intermédiaire (6-24 mois) : 1,8 g/kg — progression plus lente, besoins stables',
          'Niveau avancé (2+ ans) : 2,0-2,2 g/kg — muscles difficiles à développer, besoins maximaux',
          'Phases de sèche (déficit calorique) : montez à 2,2-2,5 g/kg pour préserver la masse musculaire',
        ],
      },
      {
        type: 'paragraph',
        text: "Ces protéines doivent provenir en priorité de l'alimentation : viande, poisson, œufs, légumineuses, produits laitiers. La whey intervient en complément pour atteindre facilement vos objectifs journaliers, notamment autour de l'entraînement.",
      },
      {
        type: 'heading',
        text: 'Quand Prendre la Whey ? Le Timing Optimal',
      },
      {
        type: 'subheading',
        text: 'La Fenêtre Anabolique : Mythe ou Réalité ?',
      },
      {
        type: 'paragraph',
        text: "Pendant des années, la communauté fitness a prêché la règle des 30 minutes post-entraînement. Les méta-analyses récentes nuancent considérablement ce dogme. Si votre dernier repas date de moins de 3 heures avant la séance, l'urgence post-entraînement est bien moindre. Ce qui compte davantage : l'apport protéique total sur la journée, distribué en 3 à 4 repas de 30 à 40g.",
      },
      {
        type: 'subheading',
        text: 'Les 3 Meilleurs Moments pour Utiliser la Whey',
      },
      {
        type: 'list',
        items: [
          'Post-entraînement (30-60 min) : digestion rapide, idéal si plus de 4h depuis le dernier repas protéiné',
          'Au réveil : après le jeûne nocturne, une dose de 30g relance rapidement la synthèse protéique',
          'Entre les repas : shake protéiné pour atteindre vos objectifs journaliers sans excès de calories',
        ],
      },
      {
        type: 'quote',
        text: "La whey n'est pas magique. Elle ne fait que vous aider à atteindre votre apport protéique quotidien plus facilement. C'est l'alimentation globale qui fait la différence.",
      },
      {
        type: 'heading',
        text: 'La Créatine : Le Complément à Associer à la Whey',
      },
      {
        type: 'paragraph',
        text: "Si vous deviez ne prendre qu'un seul complément en plus de la whey, ce serait la créatine monohydrate. C'est le supplément le plus étudié de l'histoire sportive, avec des centaines d'études confirmant son efficacité pour augmenter la force (+5-15% sur les mouvements de base) et accélérer la récupération. Dose : 3-5g par jour, peu importe le timing.",
      },
      {
        type: 'productCta',
        productSlug: 'creatine-monohydrate-myprotein-300g',
        reason:
          'La créatine monohydrate MyProtein est la référence : micronisée pour une meilleure dissolution, sans additifs, dosage précis à 3g. L\'association whey + créatine est la base de toute supplémentation intelligente.',
      },
      {
        type: 'heading',
        text: 'BCAA : Nécessaires ou Superflus ?',
      },
      {
        type: 'paragraph',
        text: "Les acides aminés branchés (Leucine, Isoleucine, Valine) sont les acides aminés clés de la synthèse musculaire. Si vous consommez déjà suffisamment de protéines complètes (whey + alimentation), les BCAA en supplément apportent peu de bénéfice supplémentaire. Leur intérêt est réel dans un contexte spécifique : entraînement à jeun prolongé (cardio le matin sans manger), ou phase de sèche stricte pour protéger la masse musculaire.",
      },
      {
        type: 'heading',
        text: 'Comment Préparer un Shake Protéiné Parfait',
      },
      {
        type: 'list',
        items: [
          '300-350 ml de lait écrémé ou lait végétal pour une texture crémeuse',
          '30g de poudre de whey (environ 1 mesurette)',
          'Optionnel : 1 banane pour les glucides post-entraînement',
          'Optionnel : 1 cuillère à soupe de beurre de cacahuète pour les lipides',
          'Mixer 20-30 secondes ou shaker vigoureusement 30 secondes',
        ],
      },
      {
        type: 'paragraph',
        text: "Ce shake apporte environ 35-40g de protéines, 50-60g de glucides (avec banane), 10-15g de lipides — un repas post-entraînement complet pour moins de 5 minutes de préparation et moins de 2 € par dose.",
      },
    ],
  },

  // ─── ARTICLE 3 ──────────────────────────────────────────────────────────────
  {
    slug: 'programme-hiit-maison-perdre-graisse',
    title: 'Programme HIIT à la Maison : Brûle un Maximum de Graisse en 20 Minutes',
    excerpt:
      'Le HIIT (High Intensity Interval Training) est la méthode la plus efficace pour brûler des graisses en peu de temps. Découvrez notre programme complet à faire chez vous.',
    metaTitle: 'Programme HIIT Maison — Perdre la Graisse en 20 Minutes | Guide Complet',
    metaDescription:
      'Programme HIIT complet à la maison pour brûler un maximum de graisses en 20 minutes. Séances structurées, conseils d\'experts, récupération optimale. Résultats garantis en 6 semaines.',
    keywords: [
      'programme HIIT maison',
      'HIIT perdre graisse',
      'entraînement fractionné',
      'brûler calories maison',
      'interval training débutant',
      'HIIT 20 minutes',
    ],
    category: 'HIIT',
    coverImage:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
    author: 'Thomas Mercier',
    publishedAt: '2026-02-03T08:00:00Z',
    readingMinutes: 8,
    productSlugs: [
      'programme-hiit-6-semaines',
      'corde-sauter-crossfit-reebok',
      'tapis-yoga-premium-10mm',
    ],
    content: [
      {
        type: 'paragraph',
        text: "Le HIIT — High Intensity Interval Training — a révolutionné la façon dont nous abordons la perte de masse grasse. Là où le cardio traditionnel vous demande 45-60 minutes de jogging modéré, le HIIT obtient des résultats supérieurs en 20-25 minutes. Ce n'est pas une promesse marketing : c'est ce que montrent des dizaines d'études scientifiques randomisées.",
      },
      {
        type: 'heading',
        text: 'Pourquoi le HIIT Brûle Plus de Graisses que le Cardio Classique',
      },
      {
        type: 'paragraph',
        text: "Le secret du HIIT se nomme EPOC — Excess Post-exercise Oxygen Consumption, ou «effet afterburn». Après une séance de cardio modéré, votre métabolisme revient à la normale en 30 à 60 minutes. Après un HIIT intense, votre corps continue de brûler des calories supplémentaires pendant 24 à 48 heures pour compenser la dette en oxygène accumulée. Cet effet peut représenter jusqu'à 10-15% de dépense calorique supplémentaire sur 24h.",
      },
      {
        type: 'subheading',
        text: 'Les Mécanismes Physiologiques en Action',
      },
      {
        type: 'list',
        items: [
          'Activation maximale des fibres musculaires rapides (type II), plus consommatrices d\'énergie',
          'Augmentation de la sensibilité à l\'insuline — les cellules musculaires captent mieux le glucose',
          'Stimulation de l\'hormone de croissance (GH) jusqu\'à 450% au-dessus du niveau basal',
          'Préservation et développement de la masse musculaire contrairement au cardio longue durée',
          'EPOC de 24-48h versus 30-60 min pour le cardio classique',
        ],
      },
      {
        type: 'heading',
        text: 'Structure d\'une Séance HIIT Efficace',
      },
      {
        type: 'paragraph',
        text: "Un protocole HIIT efficace alterne phases d'effort maximal (85-95% de la FCmax) et phases de récupération active (50-60% de la FCmax). Les deux protocols les plus étudiés : le Tabata (20s effort / 10s repos × 8 rounds = 4 minutes) et le protocole 30/30 (30 secondes d'effort / 30 secondes de récupération × 10-12 rounds). Pour les débutants, commencez avec du 20/40 (20 secondes d'effort, 40 secondes de récupération).",
      },
      {
        type: 'subheading',
        text: 'Échauffement Obligatoire : 5 Minutes',
      },
      {
        type: 'list',
        items: [
          '1 min — Jumping jacks légers pour élever progressivement la fréquence cardiaque',
          '1 min — Hip circles et arm circles pour mobiliser les articulations',
          '1 min — High knees à intensité 40%',
          '1 min — Fentes alternées dynamiques',
          '1 min — Burpees légers à 50% d\'intensité',
        ],
      },
      {
        type: 'productCta',
        productSlug: 'tapis-yoga-premium-10mm',
        reason:
          'Un tapis premium est indispensable pour le HIIT à la maison : amorti les articulations lors des sauts, antidérapant même en sueur, et protège vos sols. Le tapis 10mm Gaiam est notre recommandation pour tout pratiquant sérieux.',
      },
      {
        type: 'heading',
        text: 'Programme HIIT 20 Minutes : 3 Niveaux',
      },
      {
        type: 'subheading',
        text: 'Niveau Débutant — Protocole 20/40',
      },
      {
        type: 'list',
        items: [
          'Round 1 : Jumping jacks 20s / repos 40s',
          'Round 2 : Squats sautés 20s / repos 40s',
          'Round 3 : Mountain climbers 20s / repos 40s',
          'Round 4 : Burpees modifiés (sans saut) 20s / repos 40s',
          'Répéter 3 fois = 12 minutes de HIIT + 5 min échauffement + 3 min récup',
        ],
      },
      {
        type: 'subheading',
        text: 'Niveau Intermédiaire — Protocole 30/30',
      },
      {
        type: 'list',
        items: [
          'Round 1 : Burpees complets 30s / marche 30s',
          'Round 2 : Corde à sauter vitesse 30s / repos 30s',
          'Round 3 : Box jumps ou squats sautés puissants 30s / repos 30s',
          'Round 4 : Sprint sur place (100%) 30s / marche 30s',
          'Round 5 : Mountain climbers rapides 30s / repos 30s',
          'Répéter 2 fois = 10 minutes + 5 min warm-up + 5 min cool-down',
        ],
      },
      {
        type: 'productCta',
        productSlug: 'corde-sauter-crossfit-reebok',
        reason:
          'La corde à sauter est l\'outil HIIT par excellence : 10 minutes de corde intense brûlent 130-150 calories. La corde Reebok Speed CrossFit avec roulements à billes permet d\'atteindre une cadence maximale.',
      },
      {
        type: 'subheading',
        text: 'Niveau Avancé — Tabata Complexe',
      },
      {
        type: 'list',
        items: [
          'Bloc 1 (4 min Tabata) : Burpees avec saut groupé — 20s/10s × 8',
          'Repos 1 minute',
          'Bloc 2 (4 min Tabata) : Double unders corde à sauter — 20s/10s × 8',
          'Repos 1 minute',
          'Bloc 3 (4 min Tabata) : Devil\'s press (burpee + haltères) — 20s/10s × 8',
          'Total : 15 minutes de travail pour 20 minutes de séance',
        ],
      },
      {
        type: 'heading',
        text: 'Fréquence et Récupération : Éviter le Surentraînement',
      },
      {
        type: 'paragraph',
        text: "Le HIIT est exigeant pour le système nerveux central (SNC). Contrairement au cardio modéré qu'on peut faire quotidiennement, le HIIT nécessite 48h de récupération entre deux séances. La fréquence optimale est de 3 séances par semaine pour un débutant/intermédiaire, 4 maximum pour un athlète confirmé. Les signes de surentraînement : performance qui stagne ou régresse, fatigue persistante, troubles du sommeil, irritabilité.",
      },
      {
        type: 'quote',
        text: "20 minutes de HIIT intense valent mieux que 60 minutes de cardio modéré. Mais seulement si vous récupérez correctement entre les séances.",
      },
      {
        type: 'heading',
        text: 'Nutrition Autour du HIIT',
      },
      {
        type: 'paragraph',
        text: "Pour maximiser la combustion des graisses, certains pratiquants font leur HIIT à jeun (le matin). Cette approche peut fonctionner mais augmente le risque de fonte musculaire si elle n'est pas gérée correctement. Si vous optez pour le HIIT à jeun : consommez des BCAA avant la séance (5g) pour protéger vos muscles. Post-HIIT, un repas riche en protéines (30-40g) et glucides à index glycémique moyen dans les 60 minutes maximise la récupération.",
      },
      {
        type: 'paragraph',
        text: "Pour des résultats optimaux et un programme progressif structuré sur 6 semaines avec montée en charge contrôlée, notre programme HIIT complet est la solution la plus efficace. Conçu par des entraîneurs certifiés, il inclut les séances vidéo, le plan nutritionnel associé et le suivi de progression.",
      },
    ],
  },

  // ─── ARTICLE 4 ──────────────────────────────────────────────────────────────
  {
    slug: 'recuperation-musculaire-techniques-optimales',
    title: 'Récupération Musculaire : 7 Techniques Prouvées pour Progresser Plus Vite',
    excerpt:
      'La récupération est aussi importante que l\'entraînement. Découvrez les 7 méthodes scientifiquement validées pour réduire les courbatures et progresser plus rapidement.',
    metaTitle: 'Récupération Musculaire : 7 Techniques Prouvées — Guide Expert 2026',
    metaDescription:
      'Diminuez les courbatures et progressez plus vite grâce à ces 7 techniques de récupération musculaire prouvées scientifiquement : sommeil, massage, cryothérapie, BCAA et plus.',
    keywords: [
      'récupération musculaire',
      'réduire courbatures',
      'foam roller musculaire',
      'pistolet massage récupération',
      'DOMS traitement',
      'optimiser récupération sport',
    ],
    category: 'Récupération',
    coverImage:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
    author: 'Dr. Sophie Laurent',
    publishedAt: '2026-02-14T08:00:00Z',
    readingMinutes: 9,
    productSlugs: [
      'pistolet-massage-theragun',
      'foam-roller-trigger-point',
      'bcaa-myprotein-500g-fruit',
    ],
    content: [
      {
        type: 'paragraph',
        text: "Dans le monde du fitness, on célèbre l'effort, la sueur, les records personnels. Mais la progression musculaire se produit pendant la récupération, pas pendant l'entraînement. L'entraînement est le stimulus ; la récupération est la réponse. Négliger l'une, c'est annuler les bénéfices de l'autre. Voici les 7 techniques les mieux documentées scientifiquement.",
      },
      {
        type: 'heading',
        text: 'Comprendre les Mécanismes de la Récupération Musculaire',
      },
      {
        type: 'paragraph',
        text: "Les DOMS (Delayed Onset Muscle Soreness) — les courbatures qui apparaissent 24 à 72 heures après l'effort — sont dues aux micro-lésions des fibres musculaires. C'est une réponse inflammatoire normale et nécessaire : c'est ce processus de réparation qui rend vos muscles plus forts. L'objectif n'est pas d'éliminer cette inflammation (ce serait contre-productif) mais d'optimiser et d'accélérer le processus de réparation.",
      },
      {
        type: 'heading',
        text: 'Technique #1 : Le Sommeil, Roi de la Récupération',
      },
      {
        type: 'paragraph',
        text: "C'est le levier le plus puissant et le moins onéreux. Pendant les phases de sommeil profond (phases 3 et 4), l'hypophyse libère 80% de la production quotidienne d'hormone de croissance (GH). Cette hormone est directement responsable de la synthèse protéique musculaire, de la réparation des tissus et du métabolisme des graisses. 7 à 9 heures de sommeil par nuit ne sont pas un luxe pour un sportif : c'est une nécessité physiologique. En dessous de 6h, les études montrent une chute de 20% des performances et une augmentation du cortisol (hormone catabolisante).",
      },
      {
        type: 'heading',
        text: 'Technique #2 : Le Foam Rolling — Libérer les Points de Tension',
      },
      {
        type: 'paragraph',
        text: "Le foam roller (rouleau de massage) exerce une pression directe sur le tissu myofascial. Le mécanisme exact reste débattu, mais les études confirment : 10-15 minutes de foam rolling post-entraînement réduisent les DOMS de 40% à 72 heures, et améliorent la mobilité articulaire sans perte de force. Protocole : travaillez chaque groupe musculaire 60-90 secondes en pression continue, en insistant sur les points douloureux (trigger points).",
      },
      {
        type: 'productCta',
        productSlug: 'foam-roller-trigger-point',
        reason:
          'Le foam roller Trigger Point Grid est la référence des professionnels. Sa surface texturée multi-densité simule les doigts d\'un masseur pour traiter efficacement les fascias. Indispensable dans tout programme de récupération sérieux.',
      },
      {
        type: 'heading',
        text: 'Technique #3 : La Thérapie par Percussion — Le Pistolet de Massage',
      },
      {
        type: 'paragraph',
        text: "Les pistolets de massage (percuteurs) représentent l'évolution technologique du foam rolling. Leurs vibrations à haute fréquence (1400-3200 percussions/minute) pénètrent plus profondément dans le tissu musculaire, stimulent la circulation sanguine locale et activent les récepteurs nerveux pour diminuer la douleur perçue. Une étude de 2021 dans le Journal of Clinical Medicine montre une réduction de 30% des marqueurs inflammatoires (CK, LDH) après 5 jours d'utilisation post-exercice.",
      },
      {
        type: 'productCta',
        productSlug: 'pistolet-massage-theragun',
        reason:
          'Le Theragun est l\'outil de récupération préféré des athlètes professionnels. Son moteur QuietForce DeepTissue traite jusqu\'à 16mm de profondeur. 2 minutes sur les quadriceps post-course suffisent à réduire considérablement les courbatures du lendemain.',
      },
      {
        type: 'heading',
        text: 'Technique #4 : La Nutrition de Récupération',
      },
      {
        type: 'subheading',
        text: 'La Fenêtre Anabolique Post-Effort',
      },
      {
        type: 'paragraph',
        text: "Dans les 30 à 60 minutes suivant l'effort, vos muscles sont particulièrement réceptifs aux nutriments. La priorité : protéines + glucides. Les protéines (30-40g) fournissent les acides aminés pour reconstruire les fibres endommagées. Les glucides (60-80g) rechargent le glycogène musculaire et stimulent l'insuline, hormone anabolisante. Un ratio de 3:1 glucides/protéines est optimal en endurance, 2:1 en musculation.",
      },
      {
        type: 'subheading',
        text: 'Le Rôle des BCAA dans la Récupération',
      },
      {
        type: 'paragraph',
        text: "Les acides aminés branchés — Leucine, Isoleucine, Valine — sont catabolisés directement dans le muscle, contrairement aux autres acides aminés traités par le foie. La Leucine, en particulier, active directement le complexe mTOR, déclencheur principal de la synthèse protéique. 5-10g de BCAA autour de l'entraînement réduit les marqueurs de dommages musculaires (créatine kinase) de 15 à 25%.",
      },
      {
        type: 'heading',
        text: 'Technique #5 : L\'Hydrothérapie — Chaud/Froid',
      },
      {
        type: 'list',
        items: [
          'Bain froid (10-15°C pendant 10-15 min) : vasoconstiction, réduction de l\'inflammation aiguë',
          'Douche alternée (30s froid / 30s chaud × 5-10 répétitions) : pompage vasculaire, drainage des déchets métaboliques',
          'Sauna post-entraînement (20-30 min à 80°C) : GH × 200-300%, détente neuromusculaire',
          'Bain contrasté (plongées alternées 2 min froid / 2 min chaud × 5) : préféré des athlètes pro',
        ],
      },
      {
        type: 'heading',
        text: 'Technique #6 : Les Étirements — Passifs vs Actifs',
      },
      {
        type: 'paragraph',
        text: "Contrairement à une idée reçue tenace, les étirements statiques juste après l'entraînement ne réduisent pas les courbatures (les études le confirment). Leur intérêt est ailleurs : maintien de la mobilité articulaire, prévention des déséquilibres posturaux, détente psychologique. La méthode la plus efficace pour la souplesse : le PNF (Proprioceptive Neuromuscular Facilitation) — contraction 6 secondes + relâchement + étirement 30 secondes. À pratiquer 3-4 heures après la séance, jamais immédiatement après.",
      },
      {
        type: 'heading',
        text: 'Technique #7 : La Récupération Active',
      },
      {
        type: 'paragraph',
        text: "Une marche légère, du vélo à très faible résistance ou 20-30 minutes de natation douce le lendemain d'une séance intense accélèrent la récupération de 15-20% par rapport au repos total. La circulation sanguine légèrement élevée favorise l'acheminement des nutriments vers les muscles endommagés et l'évacuation des déchets métaboliques (lactate, H+). À intensité faible (50-60% FCmax max), cela n'ajoute pas de stress supplémentaire.",
      },
      {
        type: 'quote',
        text: "S'entraîner dur sans récupérer intelligemment, c'est construire une maison sans laisser sécher le béton. La progression se décide entre les séances.",
      },
      {
        type: 'heading',
        text: 'Plan de Récupération Hebdomadaire Optimal',
      },
      {
        type: 'list',
        items: [
          'Immédiatement post-séance : shake protéiné + BCAA + pistolet de massage 5 min',
          'Soir : repas complet protéiné, étirements PNF 20 min, 8h de sommeil minimum',
          'Lendemain matin : foam roller 15 min, récupération active 20-30 min',
          '48h après : retour à l\'entraînement si les courbatures ont disparu ou sont très légères',
        ],
      },
    ],
  },

  // ─── ARTICLE 5 ──────────────────────────────────────────────────────────────
  {
    slug: 'debuter-running-plan-5km-debutant',
    title: 'Débuter le Running : Le Plan Complet pour Courir 5 km Sans S\'arrêter',
    excerpt:
      'De zéro à 5 km en course continue : notre plan d\'entraînement progressif sur 8 semaines, les erreurs à éviter et tous les conseils pour commencer le running dans les meilleures conditions.',
    metaTitle: 'Plan Running Débutant : Courir 5 km en 8 Semaines — Programme Complet',
    metaDescription:
      'Plan d\'entraînement running débutant pour courir 5 km sans s\'arrêter en 8 semaines. Programme semaine par semaine, conseils d\'équipement, prévention des blessures. Démarrez dès aujourd\'hui.',
    keywords: [
      'débuter running débutant',
      'plan 5km débutant',
      'programme course à pied débutant',
      'courir 5km sans s\'arrêter',
      'commencer running',
      'plan entraînement running 8 semaines',
    ],
    category: 'Running',
    coverImage:
      'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=1200&q=80',
    author: 'Marie Dubois',
    publishedAt: '2026-02-28T08:00:00Z',
    readingMinutes: 10,
    productSlugs: ['guide-running-marathon-complet', 'short-training-gymshark-homme'],
    content: [
      {
        type: 'paragraph',
        text: "«Je veux courir mais je suis à bout de souffle après 200 mètres.» Si cette phrase vous ressemble, sachez que vous n'êtes pas seul — et surtout, que c'est parfaitement normal et entièrement surmontable. En 8 semaines d'entraînement progressif et intelligent, n'importe quelle personne en bonne santé peut courir 5 km sans s'arrêter. Ce guide vous montre exactement comment.",
      },
      {
        type: 'heading',
        text: 'Pourquoi Vous Êtes Essoufflé Après 200m ? La Physiologie Expliquée',
      },
      {
        type: 'paragraph',
        text: "Quand vous débutez la course à pied, votre cardio-respiratoire n'est pas encore adapté à l'effort soutenu. Votre cœur (un muscle !) n'est pas entraîné à maintenir un débit élevé, vos poumons n'ont pas optimisé leur capacité de diffusion de l'oxygène, et vos muscles ne savent pas encore utiliser l'oxygène efficacement (VO2max faible). Bonne nouvelle : ces trois systèmes s'adaptent remarquablement vite avec un entraînement régulier. Les premières améliorations cardiovasculaires apparaissent dès 2-3 semaines.",
      },
      {
        type: 'heading',
        text: 'La Règle d\'Or : Courir Lentement pour Courir Plus Longtemps',
      },
      {
        type: 'paragraph',
        text: "L'erreur n°1 du débutant : partir trop vite. Si vous pouvez tenir une conversation en courant («test de la parole»), votre allure est correcte. Si vous haletez et ne pouvez pas former de phrases complètes, vous courez trop vite et vous allez devoir vous arrêter. La majorité de vos sorties running (80%) doit se faire en zone 2 (50-70% de la FCmax), une allure qui semble presque trop facile. C'est là que se construisent les fondations aérobies.",
      },
      {
        type: 'subheading',
        text: 'Comment Calculer Votre Fréquence Cardiaque Maximale',
      },
      {
        type: 'list',
        items: [
          'Formule classique : FCmax = 220 - âge (approximative mais suffisante pour débuter)',
          'Zone 1 (récupération) : 50-60% FCmax — marche rapide',
          'Zone 2 (endurance fondamentale) : 60-70% FCmax — running débutant idéal',
          'Zone 3 (tempo) : 70-80% FCmax — effort perçu modéré à élevé',
          'Zone 4 (seuil lactique) : 80-90% FCmax — inconfortable, difficile de parler',
        ],
      },
      {
        type: 'heading',
        text: 'Le Plan 8 Semaines : De Zéro à 5 km',
      },
      {
        type: 'subheading',
        text: 'Semaines 1-2 : Marche/Course (Alternance)',
      },
      {
        type: 'list',
        items: [
          'Séance 1 : 5 min marche + [1 min course / 2 min marche] × 6 + 5 min marche = 25 min',
          'Séance 2 : identique à S1',
          'Séance 3 : 5 min marche + [1,5 min course / 2 min marche] × 5 + 5 min marche',
          'Fréquence : 3 fois par semaine, jamais deux jours consécutifs',
        ],
      },
      {
        type: 'subheading',
        text: 'Semaines 3-4 : Blocs de Course Plus Longs',
      },
      {
        type: 'list',
        items: [
          'Séance 1 : [3 min course / 90s marche] × 6 = 27 min',
          'Séance 2 : [5 min course / 2 min marche] × 4 = 28 min',
          'Séance 3 : [8 min course / 2 min marche] × 3 = 30 min',
        ],
      },
      {
        type: 'subheading',
        text: 'Semaines 5-6 : Vers la Course Continue',
      },
      {
        type: 'list',
        items: [
          'Séance 1 : 10 min course + 2 min marche + 10 min course',
          'Séance 2 : 15 min course continue',
          'Séance 3 : 20 min course continue (OBJECTIF INTERMÉDIAIRE)',
        ],
      },
      {
        type: 'subheading',
        text: 'Semaines 7-8 : Atteindre les 5 km',
      },
      {
        type: 'list',
        items: [
          'Séance 1 : 25 min course continue',
          'Séance 2 : 28-30 min course continue',
          'Séance 3 de la semaine 8 : 5 km COMPLETS — votre premier 5 km !',
        ],
      },
      {
        type: 'quote',
        text: "Il n'existe pas de mauvaise allure en running, seulement une allure qui ne vous convient pas encore. Courez lentement pour courir longtemps.",
      },
      {
        type: 'heading',
        text: 'Les 5 Erreurs qui Blessent les Débutants',
      },
      {
        type: 'list',
        items: [
          '1. Trop de volume trop vite — la règle des 10% : n\'augmentez jamais la distance hebdomadaire de plus de 10%',
          '2. Mauvaise foulée — attaque talon sur route dure : favorise les chocs (3× le poids du corps par foulée)',
          '3. Sous-vêtements et chaussettes inadaptés — les ampoules et frottements gâchent les séances',
          '4. Courir sur les mêmes muscles raides — les étirements et renforcement préventif sont non-négociables',
          '5. Ignorer la douleur — une douleur aiguë est un signal d\'arrêt immédiat',
        ],
      },
      {
        type: 'heading',
        text: 'Équipement Running : Ce qui Compte Vraiment',
      },
      {
        type: 'paragraph',
        text: "Les chaussures sont votre investissement numéro un. Une bonne paire de running (100-150 €) dure 500-800 km selon votre gabarit et le terrain. Faites-vous analyser la foulée en boutique spécialisée pour choisir entre pronateur, supinateur et neutre. Pour le reste : un short léger anti-frottement, un t-shirt respirant, des chaussettes running (sans couture au bout). La montre cardio est un plus, mais pas une priorité en début.",
      },
      {
        type: 'productCta',
        productSlug: 'short-training-gymshark-homme',
        reason:
          'Le short Gymshark Training est conçu pour le running et le cardio : tissu Dry-Tech ultra-respirant, coupe aérodynamique, poches intégrées. Finies les irritations à la cuisse qui gâchent les longues sorties.',
      },
      {
        type: 'heading',
        text: 'Renforcement Musculaire : L\'Allié Méconnu du Coureur',
      },
      {
        type: 'paragraph',
        text: "Les coureurs qui intègrent 2 séances de renforcement musculaire par semaine améliorent leur économie de course de 2 à 8% et réduisent leur risque de blessure de 30-50%. Focus sur les points faibles des coureurs : mollets (raises unilatéraux), quadriceps et ischio (squats bulgares), fessiers (hip thrust), gainage. Ces exercices créent la stabilité qui vous permet de courir longtemps sans compensation posturale douloureuse.",
      },
      {
        type: 'productCta',
        productSlug: 'guide-running-marathon-complet',
        reason:
          'Une fois votre 5 km maîtrisé, notre guide running complet vous accompagne jusqu\'au marathon. Plans de 10km, semi-marathon et marathon, conseils nutritionnels de course et gestion des murs. La référence complète du coureur.',
      },
      {
        type: 'heading',
        text: 'Nutrition pour le Running Débutant',
      },
      {
        type: 'paragraph',
        text: "Pour des sorties de moins de 45-60 minutes, vous n'avez pas besoin de vous soucier de nutrition spécifique pendant la course. Assurez-vous simplement d'être correctement hydraté avant (500 ml dans les 2 heures précédentes) et de ne pas courir le ventre vide depuis plus de 3-4 heures. Après la sortie : une collation mixte protéines+glucides dans les 30-60 minutes accélère la récupération. À partir de 60-90 minutes de course, les gels ou boissons d'effort deviennent utiles.",
      },
      {
        type: 'list',
        items: [
          'Avant (1-2h) : flocons d\'avoine + banane, ou riz au lait',
          'Pendant (si +60 min) : gels glucidiques ou dattes, 30-45g de glucides/heure',
          'Après : protéines 20-30g + glucides 40-60g dans les 60 minutes',
          'Hydratation : 400-600 ml/heure selon température, urine claire = bonne hydratation',
        ],
      },
    ],
  },
]

// Source FR exposée pour la construction du catalogue localisé (posts.en.ts).
export const BLOG_POSTS_SOURCE = BLOG_POSTS

export function getAllPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug)
}

export function getPostsByCategory(
  category: BlogPost['category']
): BlogPost[] {
  return BLOG_POSTS.filter(p => p.category === category).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = getPostBySlug(slug)
  if (!current) return getAllPosts().slice(0, limit)
  return BLOG_POSTS.filter(
    p => p.slug !== slug && p.category === current.category
  )
    .concat(BLOG_POSTS.filter(p => p.slug !== slug && p.category !== current.category))
    .slice(0, limit)
}
