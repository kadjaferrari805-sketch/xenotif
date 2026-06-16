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
        text: "C'est l'erreur la plus commune : acheter trop léger. Un débutant homme démarrera typiquement avec des curls à 8–10 kg, mais atteindra facilement 16–20 kg en 6 mois d'entraînement régulier. Pour une femme, la progression va de 4–6 kg à 10–14 kg sur la même période. Optez toujours pour une plage couvrant au moins le double de votre poids de départ. Les haltères réglables type Bowflex (2–24 kg) sont ici imbattables : ils évoluent avec vous.",
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
        text: "Une poignée de 28–29 mm de diamètre convient à la majorité des mains. Le knurling (rainurage) doit être suffisant pour assurer le grip sans écorcher. Trop lisse et vous échapperez l'haltère en fin de série ; trop agressif et vous vous blesserez les paumes. Les meilleurs modèles proposent un knurling medium au centre et plus doux sur les extrémités.",
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
        text: "Les kettlebells ne remplacent pas les haltères mais les complètent parfaitement. Leur centre de gravité déporté les rend idéaux pour les mouvements balistiques (swings, snatches, cleans) qui travaillent la chaîne postérieure — fessiers, ischio-jambiers, dos — d'une manière impossible avec des haltères classiques. Un kettlebell 16 kg (pour femme) ou 20–24 kg (pour homme) est la porte d'entrée idéale.",
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
        text: "Repos entre les séries : 60–90 secondes pour les supersets A et B, 45 secondes pour C et D. Augmentez le poids dès que vous réalisez toutes les répétitions avec 2 répétitions en réserve (RIR 2). C'est la surcharge progressive — le principe fondamental de toute progression musculaire.",
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
          'Whey Concentrate (WPC) : 70–80% de protéines, contient lactose et graisses. La plus abordable, idéale pour débuter.',
          'Whey Isolate (WPI) : 90–95% de protéines, quasi sans lactose ni graisses. Plus pure, digestion plus rapide.',
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
          'Niveau débutant (0–6 mois) : 1,6 g/kg — synthèse protéique élevée, progression rapide',
          'Niveau intermédiaire (6–24 mois) : 1,8 g/kg — progression plus lente, besoins stables',
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
          'Post-entraînement (30–60 min) : digestion rapide, idéal si plus de 4h depuis le dernier repas protéiné',
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
        text: "Si vous deviez ne prendre qu'un seul complément en plus de la whey, ce serait la créatine monohydrate. C'est le supplément le plus étudié de l'histoire sportive, avec des centaines d'études confirmant son efficacité pour augmenter la force (+5–15% sur les mouvements de base) et accélérer la récupération. Dose : 3–5g par jour, peu importe le timing.",
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
          '300–350 ml de lait écrémé ou lait végétal pour une texture crémeuse',
          '30g de poudre de whey (environ 1 mesurette)',
          'Optionnel : 1 banane pour les glucides post-entraînement',
          'Optionnel : 1 cuillère à soupe de beurre de cacahuète pour les lipides',
          'Mixer 20–30 secondes ou shaker vigoureusement 30 secondes',
        ],
      },
      {
        type: 'paragraph',
        text: "Ce shake apporte environ 35–40g de protéines, 50–60g de glucides (avec banane), 10–15g de lipides — un repas post-entraînement complet pour moins de 5 minutes de préparation et moins de 2 € par dose.",
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
        text: "Le HIIT — High Intensity Interval Training — a révolutionné la façon dont nous abordons la perte de masse grasse. Là où le cardio traditionnel vous demande 45–60 minutes de jogging modéré, le HIIT obtient des résultats supérieurs en 20–25 minutes. Ce n'est pas une promesse marketing : c'est ce que montrent des dizaines d'études scientifiques randomisées.",
      },
      {
        type: 'heading',
        text: 'Pourquoi le HIIT Brûle Plus de Graisses que le Cardio Classique',
      },
      {
        type: 'paragraph',
        text: "Le secret du HIIT se nomme EPOC — Excess Post-exercise Oxygen Consumption, ou «effet afterburn». Après une séance de cardio modéré, votre métabolisme revient à la normale en 30 à 60 minutes. Après un HIIT intense, votre corps continue de brûler des calories supplémentaires pendant 24 à 48 heures pour compenser la dette en oxygène accumulée. Cet effet peut représenter jusqu'à 10–15% de dépense calorique supplémentaire sur 24h.",
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
          'EPOC de 24–48h versus 30–60 min pour le cardio classique',
        ],
      },
      {
        type: 'heading',
        text: 'Structure d\'une Séance HIIT Efficace',
      },
      {
        type: 'paragraph',
        text: "Un protocole HIIT efficace alterne phases d'effort maximal (85–95% de la FCmax) et phases de récupération active (50–60% de la FCmax). Les deux protocols les plus étudiés : le Tabata (20s effort / 10s repos × 8 rounds = 4 minutes) et le protocole 30/30 (30 secondes d'effort / 30 secondes de récupération × 10–12 rounds). Pour les débutants, commencez avec du 20/40 (20 secondes d'effort, 40 secondes de récupération).",
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
          'La corde à sauter est l\'outil HIIT par excellence : 10 minutes de corde intense brûlent 130–150 calories. La corde Reebok Speed CrossFit avec roulements à billes permet d\'atteindre une cadence maximale.',
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
        text: "Pour maximiser la combustion des graisses, certains pratiquants font leur HIIT à jeun (le matin). Cette approche peut fonctionner mais augmente le risque de fonte musculaire si elle n'est pas gérée correctement. Si vous optez pour le HIIT à jeun : consommez des BCAA avant la séance (5g) pour protéger vos muscles. Post-HIIT, un repas riche en protéines (30–40g) et glucides à index glycémique moyen dans les 60 minutes maximise la récupération.",
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
        text: "Le foam roller (rouleau de massage) exerce une pression directe sur le tissu myofascial. Le mécanisme exact reste débattu, mais les études confirment : 10–15 minutes de foam rolling post-entraînement réduisent les DOMS de 40% à 72 heures, et améliorent la mobilité articulaire sans perte de force. Protocole : travaillez chaque groupe musculaire 60–90 secondes en pression continue, en insistant sur les points douloureux (trigger points).",
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
        text: "Dans les 30 à 60 minutes suivant l'effort, vos muscles sont particulièrement réceptifs aux nutriments. La priorité : protéines + glucides. Les protéines (30–40g) fournissent les acides aminés pour reconstruire les fibres endommagées. Les glucides (60–80g) rechargent le glycogène musculaire et stimulent l'insuline, hormone anabolisante. Un ratio de 3:1 glucides/protéines est optimal en endurance, 2:1 en musculation.",
      },
      {
        type: 'subheading',
        text: 'Le Rôle des BCAA dans la Récupération',
      },
      {
        type: 'paragraph',
        text: "Les acides aminés branchés — Leucine, Isoleucine, Valine — sont catabolisés directement dans le muscle, contrairement aux autres acides aminés traités par le foie. La Leucine, en particulier, active directement le complexe mTOR, déclencheur principal de la synthèse protéique. 5–10g de BCAA autour de l'entraînement réduit les marqueurs de dommages musculaires (créatine kinase) de 15 à 25%.",
      },
      {
        type: 'heading',
        text: 'Technique #5 : L\'Hydrothérapie — Chaud/Froid',
      },
      {
        type: 'list',
        items: [
          'Bain froid (10-15°C pendant 10–15 min) : vasoconstiction, réduction de l\'inflammation aiguë',
          'Douche alternée (30s froid / 30s chaud × 5–10 répétitions) : pompage vasculaire, drainage des déchets métaboliques',
          'Sauna post-entraînement (20–30 min à 80°C) : GH × 200–300%, détente neuromusculaire',
          'Bain contrasté (plongées alternées 2 min froid / 2 min chaud × 5) : préféré des athlètes pro',
        ],
      },
      {
        type: 'heading',
        text: 'Technique #6 : Les Étirements — Passifs vs Actifs',
      },
      {
        type: 'paragraph',
        text: "Contrairement à une idée reçue tenace, les étirements statiques juste après l'entraînement ne réduisent pas les courbatures (les études le confirment). Leur intérêt est ailleurs : maintien de la mobilité articulaire, prévention des déséquilibres posturaux, détente psychologique. La méthode la plus efficace pour la souplesse : le PNF (Proprioceptive Neuromuscular Facilitation) — contraction 6 secondes + relâchement + étirement 30 secondes. À pratiquer 3–4 heures après la séance, jamais immédiatement après.",
      },
      {
        type: 'heading',
        text: 'Technique #7 : La Récupération Active',
      },
      {
        type: 'paragraph',
        text: "Une marche légère, du vélo à très faible résistance ou 20–30 minutes de natation douce le lendemain d'une séance intense accélèrent la récupération de 15–20% par rapport au repos total. La circulation sanguine légèrement élevée favorise l'acheminement des nutriments vers les muscles endommagés et l'évacuation des déchets métaboliques (lactate, H+). À intensité faible (50–60% FCmax max), cela n'ajoute pas de stress supplémentaire.",
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
          'Lendemain matin : foam roller 15 min, récupération active 20–30 min',
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
        text: "Quand vous débutez la course à pied, votre cardio-respiratoire n'est pas encore adapté à l'effort soutenu. Votre cœur (un muscle !) n'est pas entraîné à maintenir un débit élevé, vos poumons n'ont pas optimisé leur capacité de diffusion de l'oxygène, et vos muscles ne savent pas encore utiliser l'oxygène efficacement (VO2max faible). Bonne nouvelle : ces trois systèmes s'adaptent remarquablement vite avec un entraînement régulier. Les premières améliorations cardiovasculaires apparaissent dès 2–3 semaines.",
      },
      {
        type: 'heading',
        text: 'La Règle d\'Or : Courir Lentement pour Courir Plus Longtemps',
      },
      {
        type: 'paragraph',
        text: "L'erreur n°1 du débutant : partir trop vite. Si vous pouvez tenir une conversation en courant («test de la parole»), votre allure est correcte. Si vous haletez et ne pouvez pas former de phrases complètes, vous courez trop vite et vous allez devoir vous arrêter. La majorité de vos sorties running (80%) doit se faire en zone 2 (50–70% de la FCmax), une allure qui semble presque trop facile. C'est là que se construisent les fondations aérobies.",
      },
      {
        type: 'subheading',
        text: 'Comment Calculer Votre Fréquence Cardiaque Maximale',
      },
      {
        type: 'list',
        items: [
          'Formule classique : FCmax = 220 - âge (approximative mais suffisante pour débuter)',
          'Zone 1 (récupération) : 50–60% FCmax — marche rapide',
          'Zone 2 (endurance fondamentale) : 60–70% FCmax — running débutant idéal',
          'Zone 3 (tempo) : 70–80% FCmax — effort perçu modéré à élevé',
          'Zone 4 (seuil lactique) : 80–90% FCmax — inconfortable, difficile de parler',
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
          'Séance 2 : 28–30 min course continue',
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
        text: "Les chaussures sont votre investissement numéro un. Une bonne paire de running (100-150 €) dure 500–800 km selon votre gabarit et le terrain. Faites-vous analyser la foulée en boutique spécialisée pour choisir entre pronateur, supinateur et neutre. Pour le reste : un short léger anti-frottement, un t-shirt respirant, des chaussettes running (sans couture au bout). La montre cardio est un plus, mais pas une priorité en début.",
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
        text: "Les coureurs qui intègrent 2 séances de renforcement musculaire par semaine améliorent leur économie de course de 2 à 8% et réduisent leur risque de blessure de 30–50%. Focus sur les points faibles des coureurs : mollets (raises unilatéraux), quadriceps et ischio (squats bulgares), fessiers (hip thrust), gainage. Ces exercices créent la stabilité qui vous permet de courir longtemps sans compensation posturale douloureuse.",
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
        text: "Pour des sorties de moins de 45–60 minutes, vous n'avez pas besoin de vous soucier de nutrition spécifique pendant la course. Assurez-vous simplement d'être correctement hydraté avant (500 ml dans les 2 heures précédentes) et de ne pas courir le ventre vide depuis plus de 3–4 heures. Après la sortie : une collation mixte protéines+glucides dans les 30–60 minutes accélère la récupération. À partir de 60–90 minutes de course, les gels ou boissons d'effort deviennent utiles.",
      },
      {
        type: 'list',
        items: [
          'Avant (1–2h) : flocons d\'avoine + banane, ou riz au lait',
          'Pendant (si +60 min) : gels glucidiques ou dattes, 30–45g de glucides/heure',
          'Après : protéines 20–30g + glucides 40–60g dans les 60 minutes',
          'Hydratation : 400–600 ml/heure selon température, urine claire = bonne hydratation',
        ],
      },
    ],
  },

  // ─── ARTICLE 6 ──────────────────────────────────────────────────────────────
  {
    slug: 'programme-musculation-debutant-full-body',
    title: 'Programme Musculation Débutant : le Full Body 3×/Semaine pour Bien Démarrer',
    excerpt:
      "Tu débutes la musculation ? Voici le programme full body 3 fois par semaine le plus efficace pour construire du muscle : exercices, séries, repos et conseils de progression.",
    metaTitle: 'Programme Musculation Débutant — Full Body 3×/Semaine (Guide Complet)',
    metaDescription:
      "Le programme musculation débutant idéal : full body 3 fois par semaine, exercices détaillés, séries, repos, surcharge progressive et erreurs à éviter pour progresser vite.",
    keywords: [
      'programme musculation débutant',
      'full body débutant',
      'musculation débutant maison',
      'programme prise de masse débutant',
      'full body 3 fois par semaine',
      'débuter la musculation',
    ],
    category: 'Musculation',
    coverImage:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    coverPosition: '50% 35%',
    author: 'Thomas Mercier',
    publishedAt: '2026-06-04T08:00:00Z',
    readingMinutes: 10,
    productSlugs: [
      'programme-prise-masse-12-semaines',
      'halteres-reglables-bowflex',
      'bandes-elastiques-portentum-5',
    ],
    content: [
      {
        type: 'paragraph',
        text: "Tu veux te muscler mais tu ne sais pas par où commencer ? Bonne nouvelle : en tant que débutant, tu es dans la meilleure phase de ta vie d'athlète. Tes muscles répondent vite, tes gains sont rapides, et tu n'as besoin ni d'un programme compliqué ni de suppléments coûteux. Ce dont tu as besoin, c'est d'un plan simple, régulier et progressif. Le full body 3 fois par semaine est, sans débat, la meilleure structure pour débuter.",
      },
      { type: 'heading', text: 'Pourquoi le Full Body est Idéal pour Débuter' },
      {
        type: 'paragraph',
        text: "Le full body consiste à travailler l'ensemble du corps à chaque séance, 3 fois par semaine. Pour un débutant, c'est supérieur aux programmes « split » (un muscle par jour) pour une raison simple : la fréquence. Chaque muscle est stimulé 3 fois par semaine au lieu d'une seule. Or, la synthèse des protéines musculaires d'un débutant ne reste élevée que 48 h après une séance. En t'entraînant tous les 2 jours, tu relances la construction musculaire au moment idéal, encore et encore.",
      },
      {
        type: 'list',
        items: [
          'Fréquence optimale : chaque muscle travaillé 3×/semaine',
          'Apprentissage technique accéléré (tu répètes les mouvements de base souvent)',
          'Idéal si tu manques de temps : 3 séances suffisent',
          'Excellent pour la perte de gras comme pour la prise de muscle',
          'Récupération facile à gérer : 1 jour de repos entre chaque séance',
        ],
      },
      { type: 'heading', text: 'Le Matériel Minimum pour Démarrer' },
      {
        type: 'paragraph',
        text: "Pas besoin d'une salle complète. Une paire d'haltères réglables couvre 90 % des besoins d'un débutant : développés, squats, soulevés de terre, rowing, curls. Les haltères réglables évitent d'acheter 10 paires fixes et évoluent avec ta progression — un point crucial, car tu vas vite prendre en force.",
      },
      {
        type: 'productCta',
        productSlug: 'halteres-reglables-bowflex',
        reason:
          "Les Bowflex SelectTech (2 à 24 kg en tournant un sélecteur) sont parfaits pour débuter à la maison : elles couvrent toute ta première année de progression sans encombrer ton appartement.",
      },
      { type: 'heading', text: 'Le Programme Full Body 3 Jours / Semaine' },
      {
        type: 'paragraph',
        text: "Entraîne-toi 3 fois par semaine, en laissant au moins un jour de repos entre chaque séance (par exemple lundi, mercredi, vendredi). Commence chaque séance par 5 minutes d'échauffement articulaire et une série légère sur le premier exercice. Voici 3 séances à alterner (A, B, C) pour varier les stimulations.",
      },
      { type: 'subheading', text: 'Séance A — Force de Base' },
      {
        type: 'list',
        items: [
          'Goblet Squat : 3 × 10 répétitions',
          'Développé couché haltères (au sol ou sur banc) : 3 × 10',
          'Rowing buste penché : 3 × 10',
          'Soulevé de terre roumain : 3 × 12',
          'Curl biceps : 2 × 12 · Extension triceps : 2 × 12',
          'Gainage planche : 3 × 30 à 45 secondes',
        ],
      },
      { type: 'subheading', text: 'Séance B — Volume' },
      {
        type: 'list',
        items: [
          'Fentes marchées : 3 × 10 par jambe',
          'Développé militaire haltères (épaules) : 3 × 10',
          'Tirage unilatéral (rowing 1 bras) : 3 × 10 par bras',
          'Hip thrust (fessiers) : 3 × 12',
          'Élévations latérales : 3 × 15',
          'Relevés de jambes (abdos) : 3 × 15',
        ],
      },
      { type: 'subheading', text: 'Séance C — Mixte' },
      {
        type: 'list',
        items: [
          'Squat haltères : 4 × 8',
          'Pompes (ou développé incliné) : 3 × max',
          'Rowing menton ou tirage bande : 3 × 12',
          'Soulevé de terre roumain : 3 × 10',
          'Curl marteau : 2 × 12 · Dips sur chaise : 2 × 12',
          'Gainage latéral : 3 × 30 s par côté',
        ],
      },
      { type: 'heading', text: 'La Surcharge Progressive : la Clé n°1' },
      {
        type: 'paragraph',
        text: "C'est LE principe qui fait toute la différence. Pour que tes muscles grossissent, tu dois leur demander un peu plus à chaque fois. Concrètement : termine chaque série en gardant 1 à 2 répétitions « en réserve » (tu aurais pu faire 1–2 reps de plus). Dès que tu réalises facilement le haut de la fourchette de répétitions sur toutes les séries, augmente le poids de 1 à 2,5 kg à la séance suivante. Note tes performances : ce qui se mesure progresse.",
      },
      {
        type: 'quote',
        text: "Un débutant qui applique la surcharge progressive pendant 6 mois obtient de meilleurs résultats qu'un confirmé qui change de programme toutes les 3 semaines. La régularité bat l'intensité.",
      },
      { type: 'heading', text: 'Nutrition : 1,6 à 2,2 g de Protéines par kg' },
      {
        type: 'paragraph',
        text: "Sans apport suffisant en protéines, pas de construction musculaire — même avec le meilleur programme. Vise 1,6 à 2,2 g de protéines par kilo de poids de corps et par jour (soit 112 à 154 g pour une personne de 70 kg), réparties sur la journée. Pour la prise de muscle, mange en léger surplus calorique (+ 200 à 400 kcal/jour). Pour sécher tout en te musclant (« recomposition »), reste autour de ta maintenance.",
      },
      {
        type: 'productCta',
        productSlug: 'programme-prise-masse-12-semaines',
        reason:
          "Si tu veux un plan clé en main (séances détaillées + nutrition semaine par semaine), notre Programme Prise de Masse 12 semaines structure toute ta progression de débutant à intermédiaire.",
      },
      { type: 'heading', text: 'Les 5 Erreurs de Débutant à Éviter' },
      {
        type: 'list',
        items: [
          'Changer de programme trop souvent : garde le même 8 à 12 semaines minimum',
          'Négliger la technique au profit du poids : une mauvaise forme = blessure + muscle mal stimulé',
          'Sauter l\'échauffement et les jambes (les plus gros muscles, donc les plus rentables)',
          'Sous-manger les protéines : c\'est l\'erreur n°1 qui bloque les résultats',
          'Manquer de sommeil : le muscle se construit au repos, vise 7 à 9 h par nuit',
        ],
      },
      {
        type: 'productCta',
        productSlug: 'bandes-elastiques-portentum-5',
        reason:
          "Pour compléter tes séances (échauffement des épaules, assistance aux tractions, travail du dos), un kit de bandes élastiques est l'accessoire le plus rentable qui soit.",
      },
      {
        type: 'paragraph',
        text: "Retiens l'essentiel : 3 séances full body par semaine, la surcharge progressive, assez de protéines et du sommeil. Tiens ce cap 3 mois et tu ne reconnaîtras plus ton reflet. La musculation n'est pas une question de motivation ponctuelle, mais de répétition patiente. Commence aujourd'hui.",
      },
    ],
  },

  // ─── ARTICLE 7 ──────────────────────────────────────────────────────────────
  {
    slug: 'roue-abdominale-exercices-programme-abdos',
    title: 'Roue Abdominale : le Guide Complet + 6 Exercices pour des Abdos Solides',
    excerpt:
      "La roue abdominale (ab wheel) est l'un des outils les plus efficaces pour renforcer la sangle abdominale. Technique, erreurs, progression et programme : tout est ici.",
    metaTitle: 'Roue Abdominale : 6 Exercices + Programme pour des Abdos en Béton',
    metaDescription:
      "Comment utiliser la roue abdominale sans se blesser : technique, muscles travaillés, 6 exercices du débutant à l'avancé et programme abdos complet. Le guide expert Xenotif®.",
    keywords: [
      'roue abdominale',
      'roue abdominale exercices',
      'ab wheel',
      'comment utiliser roue abdominale',
      'exercices abdos gainage',
      'programme abdos maison',
    ],
    category: 'Musculation',
    coverImage:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
    coverPosition: '50% 50%',
    author: 'Thomas Mercier',
    publishedAt: '2026-06-04T09:00:00Z',
    readingMinutes: 8,
    productSlugs: ['roue-abdominale-pro-double', 'programme-hiit-6-semaines'],
    content: [
      {
        type: 'paragraph',
        text: "Petite, peu chère, redoutablement efficace : la roue abdominale (ou « ab wheel ») est l'un des meilleurs outils pour construire un tronc solide. Mais c'est aussi l'un des plus mal utilisés — et un dos cambré sur un roll-out, c'est la blessure assurée. Ce guide t'explique comment l'utiliser correctement, quels muscles elle travaille, et te donne un programme progressif en 6 exercices.",
      },
      { type: 'heading', text: 'Pourquoi la Roue Abdominale est si Efficace' },
      {
        type: 'paragraph',
        text: "La roue abdominale entraîne le « gainage anti-extension » : tes abdominaux doivent empêcher ton bas du dos de s'arquer pendant que tu t'étires vers l'avant. C'est exactement le rôle de la sangle abdominale dans la vie réelle et dans tous les gros mouvements (squat, soulevé de terre). Résultat : un seul exercice recrute intensément les grands droits, les obliques, le transverse, mais aussi les dorsaux, les épaules et les fessiers en stabilisateurs.",
      },
      {
        type: 'list',
        items: [
          'Grand droit de l\'abdomen (les fameuses « tablettes »)',
          'Obliques internes et externes',
          'Transverse (le muscle profond qui gaine la taille)',
          'Grand dorsal et épaules (stabilisation)',
          'Fléchisseurs de hanche et fessiers (anti-bascule du bassin)',
        ],
      },
      { type: 'heading', text: 'La Technique Correcte (et Sécuritaire)' },
      {
        type: 'paragraph',
        text: "La règle d'or : ton bas du dos ne doit JAMAIS se creuser. Tout le mouvement consiste à garder le dos « neutre », légèrement enroulé, en gainant fort. Si tu sens une tension dans les lombaires, c'est que tu vas trop loin ou que tu cambres — réduis l'amplitude.",
      },
      {
        type: 'list',
        items: [
          'À genoux, mains sur la roue, bras tendus sous les épaules',
          'Rentre le ventre et bascule légèrement le bassin (rétroversion), comme pour « cacher » le nombril',
          'Déroule lentement vers l\'avant en gardant le dos rond/neutre, jamais creusé',
          'Va aussi loin que tu peux contrôler, puis reviens en tirant avec les abdos (pas les bras)',
          'Souffle à l\'effort, garde le gainage du début à la fin',
        ],
      },
      {
        type: 'quote',
        text: "Mieux vaut un roll-out de 40 cm parfaitement gainé qu'un roll-out complet dos cambré. L'amplitude se gagne avec le temps, jamais au prix de tes lombaires.",
      },
      {
        type: 'productCta',
        productSlug: 'roue-abdominale-pro-double',
        reason:
          "Privilégie une roue à double roue (plus stable, plus sûre pour les débutants) avec un tapis pour les genoux. Ce modèle Pro coche les deux cases et amortit le retour pour protéger ton dos.",
      },
      { type: 'heading', text: '6 Exercices, du Débutant à l\'Avancé' },
      {
        type: 'list',
        items: [
          '1. Roll-out à genoux à amplitude réduite (débutant) — déroule de 30–40 cm seulement',
          '2. Roll-out à genoux complet (intermédiaire) — amplitude maximale contrôlée',
          '3. Roll-out oblique à genoux — déroule en diagonale vers la gauche puis la droite (obliques)',
          '4. Roll-out avec pause — 2 secondes d\'arrêt en position basse',
          '5. Roll-out debout contre un mur (avancé) — debout, la roue s\'arrête au mur',
          '6. Roll-out debout complet (expert) — sans assistance, le Graal du gainage',
        ],
      },
      {
        type: 'paragraph',
        text: "Reste à chaque niveau jusqu'à réussir 3 séries de 10 à 12 répétitions propres avant de passer au suivant. Ne saute aucune étape : passer trop vite au roll-out debout est la première cause de blessure lombaire.",
      },
      { type: 'heading', text: 'Programme Abdos : la Routine 3×/Semaine' },
      {
        type: 'list',
        items: [
          'Roll-out (ton niveau actuel) : 3 à 4 séries × 8 à 12 reps',
          'Roll-out oblique : 2 séries × 8 par côté',
          'Gainage planche classique : 3 × 45 secondes',
          'Repos : 60 à 90 secondes entre les séries, 48 h entre 2 séances abdos',
        ],
      },
      {
        type: 'paragraph',
        text: "Les abdominaux récupèrent comme les autres muscles : inutile d'en faire tous les jours. Trois séances par semaine suffisent largement pour construire une sangle puissante et visible.",
      },
      { type: 'heading', text: 'Mais des Abdos Visibles se Font à la Cuisine' },
      {
        type: 'paragraph',
        text: "Vérité importante : tu peux avoir les abdos les plus forts du monde, ils resteront invisibles sous une couche de gras. La définition abdominale dépend à 80 % de ton taux de masse grasse — donc de ton alimentation et de ta dépense calorique. Pour faire ressortir tes abdos : crée un léger déficit calorique, mange suffisamment de protéines, et ajoute du cardio à haute intensité (HIIT) qui brûle un maximum de calories en peu de temps.",
      },
      {
        type: 'productCta',
        productSlug: 'programme-hiit-6-semaines',
        reason:
          "Pour faire fondre la couche qui cache tes abdos, notre Programme HIIT 6 semaines combine séances brûle-graisses courtes et progression structurée — le complément parfait du travail de gainage.",
      },
      { type: 'heading', text: 'Les Erreurs Fréquentes à Éviter' },
      {
        type: 'list',
        items: [
          'Cambrer le bas du dos : la cause n°1 de douleur lombaire — gaine et réduis l\'amplitude',
          'Tirer avec les bras au retour au lieu des abdominaux',
          'Aller trop vite : le tempo lent et contrôlé est ce qui rend l\'exercice efficace',
          'Vouloir le roll-out debout trop tôt : respecte la progression',
          'Croire que la roue seule donne des tablettes : sans nutrition, pas de définition',
        ],
      },
      {
        type: 'paragraph',
        text: "La roue abdominale est un investissement minuscule pour un retour énorme : un tronc solide qui améliore toutes tes performances et protège ton dos au quotidien. Maîtrise la technique, sois patient sur la progression, soigne ton alimentation — et les résultats suivront.",
      },
    ],
  },
  // ─── ARTICLE — Protéines / jour ──────────────────────────────────────────────
  {
    slug: 'combien-proteines-par-jour-prise-de-muscle',
    title: 'Combien de protéines par jour pour prendre du muscle ? (Guide 2026)',
    excerpt:
      "Combien de grammes de protéines faut-il vraiment chaque jour pour gagner du muscle ? Doses précises selon ton poids, meilleures sources et erreurs à éviter.",
    metaTitle: 'Combien de Protéines par Jour pour Prendre du Muscle ? Guide 2026',
    metaDescription:
      "Guide complet 2026 : combien de protéines par jour pour la prise de muscle (g/kg), timing, meilleures sources et erreurs courantes. Conseils d'experts Xenotif®.",
    keywords: [
      'combien de protéines par jour',
      'apport protéines musculation',
      'protéines prise de masse',
      'grammes de protéines par kilo',
      'besoin en protéines sportif',
      'protéines prise de muscle',
    ],
    category: 'Nutrition',
    coverImage:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
    author: 'Camille Laurent',
    publishedAt: '2026-06-09T08:00:00Z',
    readingMinutes: 8,
    productSlugs: ['whey-myprotein-chocolat-1kg', 'creatine-monohydrate-myprotein-300g', 'bcaa-myprotein-500g-fruit'],
    content: [
      { type: 'paragraph', text: "« Mange tes protéines ! » Tu l'entends partout, mais combien exactement ? Trop peu, et tes muscles ne récupèrent pas. Trop, et tu gaspilles ton argent pour rien. Voici, chiffres à l'appui, la quantité de protéines dont tu as réellement besoin chaque jour pour prendre du muscle en 2026." },
      { type: 'heading', text: 'De combien de protéines as-tu réellement besoin ?' },
      { type: 'paragraph', text: "La recherche est aujourd'hui très claire. Pour une personne sédentaire, 0,8 g de protéines par kilo de poids de corps suffisent. Mais dès que tu t'entraînes pour prendre du muscle, ce besoin grimpe nettement. Les méta-analyses récentes convergent vers une fourchette de 1,6 à 2,2 g par kilo et par jour pour maximiser la construction musculaire." },
      { type: 'list', items: [
        'Prise de muscle (objectif principal) : 1,6 à 2,2 g/kg/jour',
        'Sèche (perte de gras en préservant le muscle) : 2,0 à 2,4 g/kg/jour',
        'Entretien / sportif occasionnel : 1,2 à 1,6 g/kg/jour',
        "Au-delà de ~2,4 g/kg, aucun bénéfice supplémentaire démontré sur la prise de muscle",
      ] },
      { type: 'subheading', text: 'Exemple concret pour 75 kg' },
      { type: 'paragraph', text: "Une personne de 75 kg qui cherche à prendre du muscle vise environ 120 à 165 g de protéines par jour (75 × 1,6 à 2,2). Le plus simple : répartir cette quantité sur 3 à 4 repas de 30 à 40 g, plutôt que tout avaler en une fois — la synthèse protéique est mieux stimulée par des apports réguliers." },
      { type: 'heading', text: 'Les meilleures sources de protéines' },
      { type: 'list', items: [
        'Animales (profil complet) : poulet, dinde, œufs, poisson, bœuf maigre, produits laitiers',
        'Végétales : lentilles, pois chiches, tofu, tempeh, seitan, edamame',
        'Compléments pratiques : whey (rapide, post-entraînement), caséine (lente, le soir), protéine végétale',
        "Astuce : combine plusieurs sources végétales pour obtenir tous les acides aminés essentiels",
      ] },
      { type: 'heading', text: 'Timing : quand consommer ses protéines ?' },
      { type: 'paragraph', text: "La fameuse « fenêtre anabolique » de 30 minutes après l'entraînement a été largement exagérée. Ce qui compte avant tout, c'est ton total quotidien. Cela dit, un apport de 30 à 40 g dans les deux heures autour de ta séance et un repas riche en protéines le soir optimisent la récupération. La régularité bat le timing parfait." },
      { type: 'heading', text: 'Les erreurs qui sabotent tes résultats' },
      { type: 'list', items: [
        'Sous-estimer ses portions : 100 g de poulet cuit apportent environ 30 g de protéines seulement',
        'Tout miser sur les shakers en négligeant les vrais repas',
        "Oublier les calories totales : sans surplus, pas de prise de muscle, même avec assez de protéines",
        "Se focaliser uniquement sur les protéines en négligeant fibres et micronutriments",
      ] },
      { type: 'quote', text: "Les protéines construisent le muscle, mais c'est l'entraînement qui en donne l'ordre. Sans surcharge progressive, aucun gramme ne servira à grand-chose." },
      { type: 'paragraph', text: "En résumé : vise 1,6 à 2,2 g/kg/jour, répartis sur la journée, à partir de sources variées, le tout couplé à un entraînement progressif et un sommeil suffisant. C'est la combinaison — et pas un seul facteur — qui construit le muscle." },
    ],
  },
  // ─── ARTICLE — Sommeil & performance ─────────────────────────────────────────
  {
    slug: 'sommeil-performance-sportive-recuperation',
    title: 'Sommeil et performance sportive : pourquoi bien dormir te fait progresser',
    excerpt:
      "Le sommeil est le levier de progression le plus sous-estimé du sport. Voici pourquoi bien dormir te fait progresser plus vite — et 7 habitudes pour mieux dormir.",
    metaTitle: 'Sommeil et Performance Sportive : Pourquoi Bien Dormir Fait Progresser',
    metaDescription:
      "Sommeil et sport : pourquoi bien dormir construit du muscle, accélère la récupération et booste la performance. Combien d'heures viser et 7 habitudes concrètes.",
    keywords: [
      'sommeil et sport',
      'sommeil performance sportive',
      'récupération musculaire sommeil',
      'combien d\'heures de sommeil sportif',
      'bien dormir musculation',
      'sommeil et récupération',
    ],
    category: 'Récupération',
    coverImage:
      'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: 'Julie Moreau',
    publishedAt: '2026-06-07T08:00:00Z',
    readingMinutes: 7,
    productSlugs: ['pistolet-massage-theragun', 'foam-roller-trigger-point', 'montre-connectee-sport-gps'],
    content: [
      { type: 'paragraph', text: "Tu t'entraînes dur, tu surveilles ton alimentation… mais tu dors 5 h par nuit ? Tu sabotes tes propres résultats. Le sommeil est le levier de progression le plus sous-estimé du sport — et le seul qui soit totalement gratuit. Voici pourquoi bien dormir te fait littéralement progresser plus vite." },
      { type: 'heading', text: 'Ce qui se passe quand tu dors (et que tes muscles grandissent)' },
      { type: 'paragraph', text: "C'est pendant le sommeil profond que ton corps libère l'essentiel de son hormone de croissance, répare les fibres musculaires endommagées à l'entraînement et reconstitue tes réserves d'énergie. En clair : tu ne construis pas du muscle à la salle, tu le construis dans ton lit. La séance ne fait que déclencher le signal." },
      { type: 'heading', text: 'Manquer de sommeil : les dégâts concrets' },
      { type: 'list', items: [
        "Moins de force et d'endurance dès la première nuit écourtée",
        'Récupération ralentie et risque de blessure accru',
        'Cortisol (hormone du stress) en hausse, ce qui favorise le stockage de graisse',
        'Faim dérégulée : plus d\'envies de sucre et de gras le lendemain',
        'Perte musculaire accélérée pendant une sèche',
      ] },
      { type: 'subheading', text: "Combien d'heures viser ?" },
      { type: 'paragraph', text: "Pour un sportif, la fourchette idéale se situe entre 7 et 9 heures par nuit, les athlètes qui s'entraînent intensément se rapprochant souvent du haut de cette fourchette. La qualité compte autant que la quantité : un sommeil fragmenté de 8 h vaut moins qu'un sommeil profond et continu de 7 h." },
      { type: 'heading', text: '7 habitudes pour mieux dormir (et mieux progresser)' },
      { type: 'list', items: [
        "Couche-toi et lève-toi à des horaires réguliers, même le week-end",
        'Coupe les écrans 30 à 60 minutes avant le coucher (lumière bleue)',
        'Garde une chambre fraîche (18-19 °C), sombre et silencieuse',
        'Évite la caféine après 14 h et les gros repas tardifs',
        "Limite l'alcool : il fragmente le sommeil profond",
        'Expose-toi à la lumière du jour le matin pour caler ton horloge interne',
        'Place tes séances intenses en journée plutôt qu\'en toute fin de soirée',
      ] },
      { type: 'quote', text: "Aucun complément, aucun programme ne compensera un manque chronique de sommeil. C'est la base sur laquelle tout le reste se construit." },
      { type: 'paragraph', text: "Avant d'acheter un énième complément, pose-toi simplement la question : est-ce que je dors assez ? Améliore d'abord tes nuits — c'est souvent le « secret » qui débloque des semaines de stagnation." },
    ],
  },
  // ─── ARTICLE — Sèche ─────────────────────────────────────────────────────────
  {
    slug: 'seche-perdre-graisse-sans-perdre-muscle',
    title: 'Sèche : comment perdre de la graisse sans perdre de muscle',
    excerpt:
      "Perdre du gras en gardant tes muscles : le Graal de la sèche. Déficit, protéines, cardio, cheat meal — la méthode complète pour sécher intelligemment.",
    metaTitle: 'Sèche : Perdre de la Graisse sans Perdre de Muscle (Méthode 2026)',
    metaDescription:
      "Comment réussir sa sèche : déficit calorique modéré, protéines élevées, musculation maintenue et cardio dosé pour perdre du gras sans fondre. Guide Xenotif®.",
    keywords: [
      'sèche musculation',
      'perdre du gras sans perdre de muscle',
      'programme sèche',
      'déficit calorique sèche',
      'sécher sans perdre de muscle',
      'définition musculaire',
    ],
    category: 'Musculation',
    coverImage:
      'https://images.pexels.com/photos/4720236/pexels-photo-4720236.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: 'Thomas Mercier',
    publishedAt: '2026-06-05T08:00:00Z',
    readingMinutes: 9,
    productSlugs: ['whey-myprotein-chocolat-1kg', 'bracelet-fitness-tracker', 'bcaa-myprotein-500g-fruit'],
    content: [
      { type: 'paragraph', text: "Perdre du gras tout en gardant — voire en construisant — du muscle : c'est le Graal de la sèche. Exigeant, mais loin d'être impossible si tu respectes quelques principes non négociables. Voici comment sécher intelligemment, sans fondre comme neige au soleil." },
      { type: 'heading', text: 'Sécher : de quoi parle-t-on vraiment ?' },
      { type: 'paragraph', text: "Sécher, c'est perdre de la masse grasse tout en préservant un maximum de masse musculaire, pour révéler la définition de tes muscles. La différence avec un simple régime ? L'objectif n'est pas de peser moins, mais de changer ta composition corporelle. La balance ment souvent ; le miroir et le mètre ruban sont de bien meilleurs juges." },
      { type: 'heading', text: 'La règle n°1 : un déficit calorique modéré' },
      { type: 'paragraph', text: "Pas de perte de gras sans déficit calorique : tu dois consommer moins d'énergie que tu n'en dépenses. Mais un déficit trop agressif fait fondre le muscle. Vise un déficit modéré d'environ 300 à 500 kcal par jour, pour perdre 0,5 à 1 % de ton poids de corps par semaine. Lent mais durable bat rapide avec reprise." },
      { type: 'heading', text: 'Préserver le muscle : les 3 piliers' },
      { type: 'list', items: [
        'Protéines élevées : 2,0 à 2,4 g/kg/jour pour protéger ta masse musculaire',
        "Musculation lourde maintenue : continue de soulever lourd, ne passe pas tout en « léger + cardio »",
        'Déficit progressif : ajuste les calories au fil des semaines plutôt que de tout couper d\'un coup',
      ] },
      { type: 'heading', text: 'Le rôle du cardio (sans en abuser)' },
      { type: 'paragraph', text: "Le cardio aide à creuser le déficit, mais il n'est pas magique — et en excès, il peut grignoter ton muscle et ton énergie. Privilégie la marche quotidienne (autour de 10 000 pas) et 2 à 3 séances de HIIT courtes par semaine, plutôt que des heures de course à jeun. Le gros du déficit doit venir de l'assiette." },
      { type: 'subheading', text: "Et le fameux « cheat meal » ?" },
      { type: 'paragraph', text: "Un repas plaisir occasionnel n'annulera pas une semaine de discipline et peut même t'aider à tenir sur la durée. Le piège, c'est le « cheat day » qui se transforme en week-end entier et efface ton déficit. Reste flexible, pas anarchique." },
      { type: 'quote', text: "Une bonne sèche ne se voit pas seulement sur la balance : elle se voit dans le miroir, et se ressent par une énergie qui reste stable." },
      { type: 'paragraph', text: "Sois patient et constant : une sèche réussie prend des semaines, pas des jours. Protéines hautes, musculation maintenue, déficit modéré et sommeil de qualité — c'est ce quatuor qui te fera perdre du gras tout en gardant tes muscles durement gagnés." },
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
