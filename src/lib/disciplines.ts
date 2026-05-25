/* ── Per-discipline rich content ─────────────────────────────── */

export interface DisciplineVideo {
  youtubeId: string
  title: string
  description: string
  duration: string
  level: string
  thumbnail: string
}

export interface GuideSection {
  emoji: string
  title: string
  items: string[]
}

export interface ExpertTip {
  icon: string
  title: string
  body: string
}

export interface DisciplineFAQ {
  q: string
  a: string
}

export interface ProgramWeek {
  week: string
  theme: string
  sessions: { name: string; detail: string }[]
}

export interface DisciplineContent {
  tagline: string
  heroStat: string
  guide: {
    technique: GuideSection
    equipment: GuideSection
    nutrition: GuideSection
    recovery: GuideSection
  }
  tips: ExpertTip[]
  videos: DisciplineVideo[]
  program: ProgramWeek[]
  faq: DisciplineFAQ[]
}

/* ── Running & Cardio ──────────────────────────────────────────── */
const runningContent: DisciplineContent = {
  tagline: 'Cours plus vite, plus longtemps, sans te blesser.',
  heroStat: '4 200+ coureurs actifs',
  guide: {
    technique: {
      emoji: '👟',
      title: 'Technique de course',
      items: [
        'Attaque médio-pied plutôt que talon — réduit le risque de blessure de 30 %',
        'Cadence cible : 170–180 pas/min pour maximiser l\'efficacité',
        'Bras à 90° et mains détendues — économise de l\'énergie sur longue distance',
        'Regard fixé à 10–15 m devant soi pour maintenir une posture droite',
        'Respiration en rythme 3:2 (3 pas inspiration / 2 pas expiration) aux allures lentes',
      ],
    },
    equipment: {
      emoji: '🛒',
      title: 'Équipement recommandé',
      items: [
        'Chaussures de running adaptées à ta foulée (test foulée en boutique spécialisée)',
        'Montre GPS pour suivre allure, distance et fréquence cardiaque',
        'Vêtements techniques respirants (éviter le coton)',
        'Ceinture cardiaque pour zones d\'entraînement précises',
        'Application de suivi : Xenotif® + intégration Garmin / Apple Watch',
      ],
    },
    nutrition: {
      emoji: '🥑',
      title: 'Nutrition & Hydratation',
      items: [
        'Repas riche en glucides complexes 3h avant la sortie longue (riz, pâtes, quinoa)',
        'Gel énergétique ou banane toutes les 40–45 min au-delà de 1h30 de course',
        'Hydratation : 500 ml d\'eau 2h avant, puis 150–200 ml toutes les 20 min',
        'Récupération : 20–30 g de protéines dans les 30 min post-effort',
        'Caféine (3–5 mg/kg) 60 min avant une compétition pour la performance',
      ],
    },
    recovery: {
      emoji: '💆',
      title: 'Récupération optimale',
      items: [
        'Stretching statique 10–15 min post-sortie (ischio-jambiers, mollets, quadriceps)',
        'Rouleau de massage (foam roller) sur les chaînes musculaires 3× /semaine',
        'Bain froid (12–15 °C, 10 min) après les séances intenses pour réduire l\'inflammation',
        'Minimum 8h de sommeil — la reconstruction musculaire se fait la nuit',
        '1 jour de repos complet par semaine obligatoire pour prévenir le surentraînement',
      ],
    },
  },
  tips: [
    { icon: '⚡', title: 'Règle des 10 %', body: 'N\'augmente jamais ton volume hebdomadaire de plus de 10 % — la règle d\'or pour éviter les blessures de surmenage.' },
    { icon: '🎯', title: 'Entraîne-toi en zones', body: '80 % de ton volume à basse intensité (Zone 2), 20 % en haute intensité — c\'est la formule des champions d\'endurance.' },
    { icon: '🧠', title: 'Visualisation pré-course', body: '5 min de visualisation mentale avant chaque sortie difficile améliore la performance de 15 % selon les études sportives.' },
    { icon: '🌡️', title: 'Bilan FTP mensuel', body: 'Teste ta vitesse au seuil lactique chaque mois (test Cooper 12 min) pour ajuster tes zones d\'entraînement précisément.' },
  ],
  videos: [
    {
      youtubeId: 'LU_-65SMVBU',
      title: 'Technique de course parfaite',
      description: 'Corrige ta foulée en 12 minutes — posture, attaque, cadence expliquées par un coach certifié.',
      duration: '12 min',
      level: 'Tous niveaux',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
    },
    {
      youtubeId: 'x7wGHEHLFoE',
      title: 'Séance intervalles VO2max',
      description: 'Protocole 5×3 min pour exploser ton plafond aérobie — la clé pour descendre sous 45 min au 10K.',
      duration: '24 min',
      level: 'Intermédiaire',
      thumbnail: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
    },
    {
      youtubeId: '1b5GOmE7_dI',
      title: 'Préparation semi-marathon',
      description: 'Plan d\'entraînement complet 10 semaines pour finir un semi en moins de 2h.',
      duration: '18 min',
      level: 'Avancé',
      thumbnail: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=800&q=80',
    },
  ],
  program: [
    {
      week: 'Semaine 1–2',
      theme: 'Fondation aérobie',
      sessions: [
        { name: 'Footing Z2 30 min', detail: 'Allure conversationnelle (fréquence cardiaque 65–75 % FCmax)' },
        { name: 'Côtes 8× 30 s', detail: 'Sprint en montée, récup descente — améliore la puissance et la foulée' },
        { name: 'Longue sortie 50 min', detail: 'Rythme très lent, objectif durée et endurance de base' },
      ],
    },
    {
      week: 'Semaine 3–4',
      theme: 'Développement seuil',
      sessions: [
        { name: 'Intervalles 5×5 min', detail: 'Allure 10K, récup 90 s entre chaque — travail au seuil lactique' },
        { name: 'Fartlek 35 min', detail: 'Alternance accélérations libres / footing lent selon ressenti' },
        { name: 'Sortie longue 65 min', detail: 'Avec 15 min en allure marathon sur la 2ème partie' },
      ],
    },
    {
      week: 'Semaine 5–6',
      theme: 'Vitesse & spécifique',
      sessions: [
        { name: 'Tempo run 45 min', detail: 'Allure semi-marathon maintenue en continu — effort contrôlé' },
        { name: 'Séance piste 12×400 m', detail: 'Allure objectif 5K, récup 200 m jogging entre chaque rep' },
        { name: 'Test Cooper 12 min', detail: 'Course max sur 12 min pour évaluer la progression VO2max' },
      ],
    },
    {
      week: 'Semaine 7–8',
      theme: 'Affinage & compétition',
      sessions: [
        { name: 'Réduction volume −30 %', detail: 'Diminue le kilométrage mais maintiens les allures — récupération active' },
        { name: 'Strides 8×100 m', detail: 'Accélérations progressives pour garder la vivacité avant course' },
        { name: 'Race day simulation', detail: 'Échauffement + 20 min à allure objectif + retour au calme' },
      ],
    },
  ],
  faq: [
    { q: 'À quelle fréquence dois-je courir par semaine ?', a: 'Débutant : 3 séances. Intermédiaire : 4–5 séances. Avancé : 5–6 séances avec un jour de repos absolu. La qualité prime sur la quantité.' },
    { q: 'Comment éviter les douleurs au genou ?', a: 'Renforce tes fessiers et tes ischio-jambiers (squats, fentes), travaille ta cadence (vise 175 pas/min) et privilégie des surfaces souples au début.' },
    { q: 'Faut-il courir à jeun pour brûler plus de graisses ?', a: 'La course à jeun améliore l\'utilisation des lipides mais réduit la performance. Conseillé uniquement pour les footings légers (< 45 min) en Zone 2.' },
    { q: 'En combien de temps puis-je courir mon premier 5K ?', a: 'Avec notre programme débutant, 8 semaines suffisent pour enchaîner 5K sans s\'arrêter, quelle que soit ta condition de départ.' },
    { q: 'Quelle chaussure choisir pour commencer ?', a: 'Va dans un magasin spécialisé pour une analyse de ta foulée gratuite. Privilégie une chaussure avec bon amorti si tu cours sur bitume — budget 100–150 € minimum.' },
  ],
}

/* ── Musculation ───────────────────────────────────────────────── */
const musculationContent: DisciplineContent = {
  tagline: 'Construis ton physique avec une précision chirurgicale.',
  heroStat: '3 800+ membres actifs',
  guide: {
    technique: {
      emoji: '💪',
      title: 'Technique & Exécution',
      items: [
        'Range of motion complète — un squat parallèle sollicite 40 % plus de fibres musculaires',
        'Tempo contrôlé : 2 s descente / 1 s pause / 1 s montée pour maximiser le stimulus hypertrophique',
        'Connexion neuro-musculaire — pense au muscle ciblé pendant l\'exercice (mind-muscle connection)',
        'Respiration : expire sur l\'effort concentrique, inspire sur l\'excentrique',
        'Échauffement spécifique obligatoire : 2–3 séries légères avant de charger lourd',
      ],
    },
    equipment: {
      emoji: '🏋️',
      title: 'Équipement clé',
      items: [
        'Ceinture de musculation pour les charges lourdes (squat / deadlift > 80 % 1RM)',
        'Chaussures spécifiques halterophilie (semelle plate) ou running à faible drop',
        'Straps de poignet pour tirage et rowing — préserve les tendons sur le long terme',
        'Chalk (magnésie) pour améliorer la prise en main sur barre et kettlebell',
        'Carnet de suivi ou app Xenotif® pour tracker les charges et la progression',
      ],
    },
    nutrition: {
      emoji: '🥩',
      title: 'Nutrition pour la performance',
      items: [
        'Apport protéique : 1,8–2,2 g de protéines / kg de poids corporel par jour',
        'Surplus calorique de 200–300 kcal/j pour la prise de masse — prise de masse lente et propre',
        'Répartition 4–5 repas/jour pour maintenir la synthèse protéique continue',
        'Créatine monohydrate : 3–5 g/jour — le supplément le plus documenté scientifiquement',
        'Fenêtre anabolique : 40 g de protéines dans les 60 min post-séance',
      ],
    },
    recovery: {
      emoji: '😴',
      title: 'Récupération musculaire',
      items: [
        'Minimum 48h de repos par groupe musculaire avant de le retraviller',
        'Sommeil 8–9h — la GH (hormone de croissance) est sécrétée principalement la nuit',
        'Déload toutes les 4–6 semaines : réduction du volume de 40–50 % pour surcompensation',
        'Massage / rouleau 15 min post-séance sur les muscles travaillés',
        'Bain froid ou contraste chaud/froid pour accélérer l\'élimination des déchets métaboliques',
      ],
    },
  },
  tips: [
    { icon: '📊', title: 'Surcharge progressive', body: 'Augmente charge ou répétitions chaque semaine — même 500 g de plus sur la barre en une année, c\'est 26 kg gagnés sur ton squat.' },
    { icon: '🔬', title: 'Hypertrophie vs force', body: 'Force : 1–5 reps à 85–100 % 1RM. Hypertrophie : 6–12 reps à 65–80 % 1RM. Varie les protocoles chaque mois.' },
    { icon: '⏱️', title: 'Temps de repos optimal', body: 'Hypertrophie : 60–90 s. Force maximale : 3–5 min. Raccourcir les repos n\'est pas plus efficace — c\'est moins efficace.' },
    { icon: '🎯', title: 'Priorité aux polyarticulaires', body: 'Squat, deadlift, bench press, overhead press et rowing donnent 80 % des résultats. Les isolations sont le bonus.' },
  ],
  videos: [
    {
      youtubeId: 'C_VtOYc6j5c',
      title: 'Squat parfait — Technique complète',
      description: 'Guide ultime du squat barre libre : placement des pieds, descente, respiration et erreurs communes.',
      duration: '16 min',
      level: 'Tous niveaux',
      thumbnail: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    },
    {
      youtubeId: 'op9kVnSso6Q',
      title: 'Deadlift sans risque',
      description: 'Maîtrise le soulevé de terre en toute sécurité — les 7 points de contact clés pour carger lourd sans blesser le dos.',
      duration: '14 min',
      level: 'Débutant',
      thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    },
    {
      youtubeId: 'rYfKY8LDqv4',
      title: 'Programme Push/Pull/Legs',
      description: 'Structure ta semaine avec le split PPL pour maximiser la récupération et le volume par groupe musculaire.',
      duration: '20 min',
      level: 'Intermédiaire',
      thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
    },
  ],
  program: [
    {
      week: 'Semaine 1–2',
      theme: 'Apprentissage technique',
      sessions: [
        { name: 'Push A : Poitrine + Épaules', detail: 'Bench press 4×8, OHP 3×10, Dips 3×12, Latéral raises 3×15' },
        { name: 'Pull A : Dos + Biceps', detail: 'Deadlift 4×5, Pull-ups 4×AMRAP, Rowing barre 3×10, Curl 3×12' },
        { name: 'Legs : Quadriceps + Ischios', detail: 'Squat 4×8, Romanian DL 3×10, Leg press 3×12, Mollets 4×15' },
      ],
    },
    {
      week: 'Semaine 3–4',
      theme: 'Hypertrophie — Surcharge progressive',
      sessions: [
        { name: 'Push B : Volume élevé', detail: 'Incliné 4×10, Dips lestés 3×8, Cable fly 3×15, Overhead DB 4×12' },
        { name: 'Pull B : Focus largeur dos', detail: 'Pull-ups lestés 4×6, Seated row 4×12, Face pull 3×20, Hammer curl 3×15' },
        { name: 'Legs B : Force + Volume', detail: 'Squat lourd 5×5, Hack squat 3×12, Leg extension 3×15, GHR 3×10' },
      ],
    },
    {
      week: 'Semaine 5–6',
      theme: 'Intensification — Test de force',
      sessions: [
        { name: 'Full body force', detail: 'Squat 5×3, Bench 5×3, Deadlift 5×3 — charges maximales avec repos complets' },
        { name: 'Full body hypertrophie', detail: 'Supersets antagonistes, 4×12, repos 60 s — volume total élevé' },
        { name: 'AMRAP bilan', detail: 'Test max reps à 75 % 1RM sur squat / bench / deadlift — mesure progrès' },
      ],
    },
    {
      week: 'Semaine 7–8',
      theme: 'Déload & Reconstitution',
      sessions: [
        { name: 'Volume réduit −40 %', detail: 'Même exercices, charges légères — récupération des tendons et système nerveux' },
        { name: 'Mobilité + gainage', detail: 'Yoga muscu, travail de la ceinture scapulaire, planche et anti-rotation' },
        { name: 'Test 1RM jour J', detail: 'Évaluation 1 rep max sur squat, bench et deadlift pour ajuster le prochain cycle' },
      ],
    },
  ],
  faq: [
    { q: 'Combien de fois par semaine s\'entraîner ?', a: '3–4 séances/semaine suffisent pour 90 % des objectifs en musculation. Plus n\'est pas toujours mieux — la récupération est aussi importante que le stimulus.' },
    { q: 'Faut-il prendre des compléments alimentaires ?', a: 'Non obligatoire. La créatine et les protéines whey sont les seuls suppléments scientifiquement validés pour la performance. Priorise d\'abord l\'alimentation.' },
    { q: 'Combien de temps avant de voir des résultats ?', a: 'Les premiers changements neurologiques (force) apparaissent en 2–3 semaines. Les changements musculaires visibles prennent 6–12 semaines selon la génétique et la nutrition.' },
    { q: 'Comment éviter les plateaux ?', a: 'Varie les exercices, le volume, l\'intensité et les temps de repos. Notre IA Xenotif® ajuste automatiquement ton programme pour éviter l\'adaptation.' },
    { q: 'Peut-on prendre du muscle et perdre de la graisse en même temps ?', a: 'Oui, en débutant ou après une longue pause (recomposition corporelle). Nécessite un apport protéique élevé et un déficit calorique léger de 100–200 kcal.' },
  ],
}

/* ── HIIT ──────────────────────────────────────────────────────── */
const hiitContent: DisciplineContent = {
  tagline: 'Brûle 500 kcal en 25 minutes. Prouvé scientifiquement.',
  heroStat: '2 100+ membres actifs',
  guide: {
    technique: {
      emoji: '⚡',
      title: 'Principes HIIT',
      items: [
        'Ratio effort/repos : 1:1 pour débutants (20 s effort / 20 s repos), 2:1 pour avancés',
        'Intensité cible : 85–95 % FCmax pendant les phases d\'effort — sinon ce n\'est pas du HIIT',
        'Exercices polyarticulaires prioritaires : burpees, squat jumps, mountain climbers, sprints',
        'Temps total recommandé : 15–25 min — les séances longues ne sont pas plus efficaces',
        'L\'EPOC (post-combustion) brûle des calories encore 24–48h après une bonne séance HIIT',
      ],
    },
    equipment: {
      emoji: '🏃',
      title: 'Matériel requis',
      items: [
        'Zéro équipement nécessaire — le HIIT au poids du corps est aussi efficace que la salle',
        'Option salle : rameur, vélo assault bike, TRX pour varier les stimuli',
        'Montre cardiaque pour s\'assurer de rester dans la bonne zone d\'intensité',
        'Tapis de sol pour les exercices au sol (burpees, mountain climbers)',
        'Timer application (Interval Timer) — Xenotif® intègre des minuteries HIIT pré-programmées',
      ],
    },
    nutrition: {
      emoji: '🍌',
      title: 'Nutrition HIIT',
      items: [
        'Collation légère 30–60 min avant : banane, toast avec beurre d\'amande',
        'Évite les repas lourds dans les 2h avant une séance — risque de nausées',
        'Hydratation critique : 500 ml d\'eau avant, boire pendant si séance > 20 min',
        'Post-HIIT : combinaison glucides + protéines dans les 30 min (shaker whey + fruit)',
        'La caféine (café noir, pre-workout) améliore la performance HIIT de 10–15 %',
      ],
    },
    recovery: {
      emoji: '🧘',
      title: 'Récupération entre séances',
      items: [
        'Maximum 3–4 séances HIIT / semaine — alternance obligatoire avec jours légers',
        'Cool-down 5–10 min de marche + stretching dynamique post-séance',
        'Le HIIT quotidien mène au surentraînement en 2–3 semaines — respecte les jours off',
        'Qualité du sommeil primordiale : le HIIT tardif (< 3h avant dormir) perturbe le sommeil',
        'Bain froid 10 min ou douche froide immédiatement post-séance — réduction de l\'inflammation',
      ],
    },
  },
  tips: [
    { icon: '🔥', title: 'L\'effet EPOC', body: 'Une séance HIIT de 20 min brûle autant de calories qu\'un footing de 45 min — et continue à brûler 24h plus tard grâce à l\'EPOC post-combustion.' },
    { icon: '📈', title: 'Progressivité obligatoire', body: 'Commence à 30 s/30 s × 8 rounds. Augmente les rounds avant d\'augmenter l\'intensité. Trop vite = blessure ou abandon.' },
    { icon: '🎵', title: 'La musique booste de 15 %', body: 'Une playlist rythmée à 140–160 BPM améliore significativement la performance HIIT. Précharge ta playlist avant chaque séance.' },
    { icon: '🧪', title: 'Varie les protocoles', body: 'Tabata (20/10), EMOM, Pyramid, AMRAPs — alterner les formats prévient l\'adaptation et brise les plateaux.' },
  ],
  videos: [
    {
      youtubeId: 'ml6cT4AZdqI',
      title: 'HIIT 20 min — Poids du corps',
      description: 'Séance intense sans équipement : burpees, mountain climbers, squat jumps. Idéal débutant confirmé.',
      duration: '20 min',
      level: 'Intermédiaire',
      thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
    },
    {
      youtubeId: '5M4L_yOebmA',
      title: 'Tabata Protocol — 4 min max',
      description: 'Le protocole Tabata original (20 s/10 s × 8 rounds) — l\'entraînement le plus intense qui soit.',
      duration: '12 min',
      level: 'Avancé',
      thumbnail: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=800&q=80',
    },
    {
      youtubeId: 'pUkfrfRR4KQ',
      title: 'HIIT débutant — Première séance',
      description: 'Introduction en douceur au HIIT — fréquences cardiaques expliquées et intensité progressive.',
      duration: '25 min',
      level: 'Débutant',
      thumbnail: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    },
  ],
  program: [
    {
      week: 'Semaine 1–2',
      theme: 'Initiation — Découverte de l\'intensité',
      sessions: [
        { name: 'Tabata découverte 4×4 min', detail: 'Squat, mountain climber, jumping jack, planche — 20 s actif / 10 s repos' },
        { name: 'Circuit AMRAP 15 min', detail: '5 burpees + 10 squat jumps + 15 mountain climbers — max tours possible' },
        { name: 'Active recovery', detail: 'Marche rapide 30 min + yoga mobilité 15 min' },
      ],
    },
    {
      week: 'Semaine 3–4',
      theme: 'Progression — Intensité 85 % FCmax',
      sessions: [
        { name: 'EMOM 20 min', detail: 'Chaque minute : 10 burpees + 15 squat jumps — terminer avant la fin de la minute' },
        { name: 'Pyramid HIIT', detail: '30/30 → 40/20 → 50/10 → 40/20 → 30/30 — 3 cycles complets' },
        { name: 'Sprint pyramide', detail: '10-20-30-40-30-20-10 m sprints avec récup complète entre chaque' },
      ],
    },
    {
      week: 'Semaine 5–6',
      theme: 'Performance — Dépassement',
      sessions: [
        { name: 'Death by burpees', detail: 'Minute 1 : 1 burpee. Minute 2 : 2 burpees. Continue jusqu\'à ne plus tenir le rythme' },
        { name: 'Partner WOD', detail: '3 rounds : 50 squat jumps + 40 push-ups + 30 sit-ups + 20 burpees — en duo' },
        { name: 'Test VO2max HIIT', detail: 'Protocol Yo-Yo niveau 1 — évaluation cardio pour ajuster les zones de travail' },
      ],
    },
    {
      week: 'Semaine 7–8',
      theme: 'Maintenance & Consolidation',
      sessions: [
        { name: 'Circuit "best of"', detail: 'Tes 3 exercices préférés des semaines précédentes — 5 rounds à intensité max' },
        { name: 'Active recovery week', detail: 'Volume réduit de 50 % — maintien de la forme sans surcharge' },
        { name: 'Bilan performance', detail: 'Test Cooper + test Tabata + mesures corporelles — évaluation globale' },
      ],
    },
  ],
  faq: [
    { q: 'Le HIIT est-il efficace pour perdre du poids ?', a: 'Oui — la combinaison de forte dépense calorique + EPOC post-combustion en fait l\'un des meilleurs outils pour la perte de masse grasse, surtout abdominal.' },
    { q: 'Peut-on faire du HIIT tous les jours ?', a: 'Non — le corps a besoin de 48h pour récupérer d\'une vraie séance HIIT. 3–4 séances/semaine avec des jours de repos actif est le maximum conseillé.' },
    { q: 'Le HIIT est-il adapté aux débutants ?', a: 'Oui, à condition de commencer avec des protocoles doux (30 s/30 s) et des exercices à faible impact (pas de sauts). Notre programme débutant est progressif sur 4 semaines.' },
    { q: 'Combien de calories brûle une séance HIIT ?', a: 'Entre 300 et 600 kcal pour 20–30 min selon le poids et l\'intensité — plus que 45 min de footing grâce à l\'EPOC.' },
  ],
}

/* ── Cyclisme ──────────────────────────────────────────────────── */
const cyclismeContent: DisciplineContent = {
  tagline: 'De la sportive au grimpeur de cols — un plan pour chaque roue.',
  heroStat: '1 500+ cyclistes actifs',
  guide: {
    technique: {
      emoji: '🚴',
      title: 'Technique de pédalage',
      items: [
        'Cadence optimale : 85–95 RPM pour les routes plates, 70–80 RPM en montée',
        'Position sur le vélo : vérification tri-annuelle de la mise en selle (professionnelle)',
        'Pousser ET tirer — pensez à "gratter" au bas du coup de pédale pour maximiser la puissance',
        'Position aéro : descente de buste progressif — chaque 5 cm économise 20–30 W de résistance',
        'Changement de vitesses anticipé avant la côte — jamais en poussant fort dans le braquet',
      ],
    },
    equipment: {
      emoji: '⚙️',
      title: 'Équipement performance',
      items: [
        'Capteur de puissance — l\'outil le plus précis pour quantifier l\'entraînement (à partir de 400 €)',
        'Cardiofréquencemètre (sangle thoracique plus précise que le poignet)',
        'Casque aéro homologué + lunettes de protection anti-UV',
        'Chaussures SPD-SL avec cales alignées — évite les douleurs aux genoux',
        'Hometrainer connecté (Tacx, Wahoo) pour l\'entraînement intérieur en hiver',
      ],
    },
    nutrition: {
      emoji: '🍝',
      title: 'Nutrition longue distance',
      items: [
        'Loading glucidique J-2 et J-1 avant une compétition : pâtes, riz, pain',
        'Sur vélo : 60–90 g de glucides/heure sur les efforts > 90 min (gel + boisson + barres)',
        'Boisson isotonique maison : 500 ml eau + 30 g maltodextrine + 1 g sel + jus citron',
        'Bouteilles de 750 ml minimum — déshydratation de 2 % réduit la puissance de 10 %',
        'Récupération : riz + poulet ou pasta + thon dans les 30 min post-effort long',
      ],
    },
    recovery: {
      emoji: '🔧',
      title: 'Récupération et entretien',
      items: [
        'Pédalage léger 20–30 min le lendemain d\'un effort intense — circulation active',
        'Massage des jambes : focus sur les quadriceps, ischio-jambiers, mollets et fessiers',
        'Élévation des jambes 15 min post-sortie longue pour réduire les oedèmes',
        'Nutrition récupération cycliste : ratio 4:1 glucides/protéines dans la première heure',
        'Entretien du vélo après chaque sortie pluvieuse : chaîne, freins, jantes',
      ],
    },
  },
  tips: [
    { icon: '📡', title: 'Entraîne-toi par zones', body: 'Zone 2 (65–75 % FTP) pour 80 % du volume — la zone que les pros appellent "le chemin vers la performance". Sous-estimée par 95 % des amateurs.' },
    { icon: '🧱', title: 'FTP est ta boussole', body: 'Teste ton FTP (seuil fonctionnel de puissance) toutes les 4–6 semaines avec un test 20 min à bloc. Toutes tes zones en découlent.' },
    { icon: '🌬️', title: 'L\'aérodynamisme prime', body: 'Sur un plat à 35 km/h, 80 % de la résistance est aérodynamique. Descends le buste avant d\'acheter une roue carbone.' },
    { icon: '🏔️', title: 'La montagne se roule en watts', body: 'En côte, vise un ratio W/kg constant — évite les à-coups qui vident les réserves. Un effort régulier est toujours plus économique.' },
  ],
  videos: [
    {
      youtubeId: '7SZs-bkIiCo',
      title: 'Entraînement en zones — Guide complet',
      description: 'Comprendre les 7 zones de puissance et construire ta base aérobie comme un pro du peloton.',
      duration: '22 min',
      level: 'Tous niveaux',
      thumbnail: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    },
    {
      youtubeId: 'nVnLyAVwj9c',
      title: 'Test FTP 20 minutes',
      description: 'Protocole complet pour mesurer ton seuil fonctionnel de puissance — la mesure clé du cyclisme entraîné.',
      duration: '35 min',
      level: 'Intermédiaire',
      thumbnail: 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?auto=format&fit=crop&w=800&q=80',
    },
    {
      youtubeId: 'Zn88lU-ILqk',
      title: 'Technique de grimpe — Économie en côte',
      description: 'Pédalage en montée, gestion du braquet et de la cadence pour grimper plus loin sans exploser.',
      duration: '17 min',
      level: 'Avancé',
      thumbnail: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=800&q=80',
    },
  ],
  program: [
    {
      week: 'Semaine 1–2',
      theme: 'Base aérobie',
      sessions: [
        { name: 'Endurance Z2 90 min', detail: 'Cadence 90 RPM, FC 65–75 % FCmax — ne pas dépasser la zone' },
        { name: 'Intervals VO2max 4×8 min', detail: 'À 106–120 % FTP, récup 4 min entre chaque — développement VO2max' },
        { name: 'Récupération active 60 min', detail: 'Pédalage très léger Z1 pour activer la circulation sans fatiguer' },
      ],
    },
    {
      week: 'Semaine 3–4',
      theme: 'Seuil & Sweet spot',
      sessions: [
        { name: 'Sweet spot 2×20 min', detail: 'À 88–95 % FTP avec 5 min repos — le ratio bénéfice/fatigue optimal' },
        { name: 'Cadence drills', detail: 'Alternance 100+ RPM / 60 RPM toutes les 3 min sur 60 min total' },
        { name: 'Gran fondo simulé 3h', detail: 'Long ride avec 40 min en sweet spot intégré — endurance spécifique compétition' },
      ],
    },
    {
      week: 'Semaine 5–6',
      theme: 'Intensification haute',
      sessions: [
        { name: 'VO2max 5×5 min', detail: '110–120 % FTP, récup 5 min — augmentation du plafond aérobie' },
        { name: 'Sprints neuromusculaires 10×10 s', detail: 'Puissance maximale, récup 5 min complètes — développement puissance de sprint' },
        { name: 'Test FTP 20 min', detail: 'Effort maximal soutenu 20 min — recalibration de toutes les zones' },
      ],
    },
    {
      week: 'Semaine 7–8',
      theme: 'Affûtage & Performance',
      sessions: [
        { name: 'Volume −30 %, intensité maintenue', detail: 'Réduction du volume mais pas de l\'intensité — supracompensation' },
        { name: 'Race-pace intervals 3×10 min', detail: 'Simulation vitesse course — mental et physique prêts' },
        { name: 'Sortie décontraction 2h', detail: 'Paysage, plaisir, jambes libres — arriver frais au jour J' },
      ],
    },
  ],
  faq: [
    { q: 'Indoor ou outdoor — lequel est plus efficace ?', a: 'L\'indoor (hometrainer) est plus efficace par heure d\'entraînement car il n\'y a pas de temps mort (feux, descentes). L\'outdoor est meilleur pour la technique et la motivation. Combiner les deux est idéal.' },
    { q: 'Quelle puissance pour débuter le cyclisme compétition ?', a: 'Un W/kg de 2,5–3 est suffisant pour débuter les cyclosportives. Avec 6 mois d\'entraînement structuré, atteindre 3–3,5 W/kg est accessible.' },
    { q: 'Combien d\'heures par semaine pour progresser ?', a: 'Minimum 8h/semaine pour une progression significative. Les pros font 20–25h. Entre les deux, 12–15h est le sweet spot amateur compétitif.' },
    { q: 'Faut-il un hometrainer en hiver ?', a: 'Très recommandé — l\'hiver est la période idéale pour construire la base aérobie (Z2) sans les dangers de la route. Zwift ou RGT rendent l\'indoor motivant.' },
  ],
}

/* ── Natation ──────────────────────────────────────────────────── */
const natationContent: DisciplineContent = {
  tagline: 'Technique, efficacité, performance — l\'eau ne ment pas.',
  heroStat: '900+ nageurs actifs',
  guide: {
    technique: {
      emoji: '🏊',
      title: 'Technique de nage',
      items: [
        'Position hydrodynamique : tête dans l\'axe du corps, regard vers le fond du bassin',
        'Rotation des hanches 45° à chaque mouvement de bras — source principale de puissance',
        'Extension maximale du bras avant l\'entrée dans l\'eau — "atteindre le mur du bout des doigts"',
        'Jambes : battements petits et rapides depuis les hanches, genoux légèrement fléchis',
        'Virage flip-turn : toucher le mur à 1 m, roulade, poussée explosive — économise 2–3 s / 100 m',
      ],
    },
    equipment: {
      emoji: '🥽',
      title: 'Équipement de nage',
      items: [
        'Lunettes de natation anti-buée adaptées à la morphologie du visage',
        'Bonnet en silicone pour réduire la traînée et protéger les cheveux',
        'Pull-buoy entre les cuisses pour les séances de travail bras uniquement',
        'Plaquettes de natation pour renforcer les appuis et améliorer la technique bras',
        'Montre de natation (Garmin Swim) pour suivi des longueurs, SWOLF et temps',
      ],
    },
    nutrition: {
      emoji: '💧',
      title: 'Hydratation et nutrition',
      items: [
        'L\'eau fausse la sensation de soif — boire activement même sans ressentir la soif',
        'Repas principal 2h avant la séance : glucides lents + protéines légères',
        'Bouteille d\'eau ou boisson isotonique au bord du bassin pour les séances > 60 min',
        'Les séances à jeun sont déconseillées pour la natation — glycémie stable indispensable',
        'Post-natation : protéines rapides (whey) + glucides simples dans les 30 min',
      ],
    },
    recovery: {
      emoji: '♨️',
      title: 'Récupération aquatique',
      items: [
        'Natation lente 200–400 m de cool-down en fin de séance — retour veino-musculaire',
        'Stretching épaules et pectoraux — zones les plus sollicitées en crawl',
        'Jacuzzi ou bain chaud post-séance pour détendre les muscles du dos et des épaules',
        'Massage des épaules et du cou 2× /semaine — prévention tendinite de la coiffe',
        'Minimum 24h entre deux séances intenses — les muscles respiratoires aussi doivent récupérer',
      ],
    },
  },
  tips: [
    { icon: '📐', title: 'Le SWOLF est ton allié', body: 'SWOLF = temps (secondes) + nombre de mouvements par longueur. Diminuer ton score SWOLF signifie que tu es plus efficace — mieux que de regarder le chrono.' },
    { icon: '🌊', title: 'La résistance change tout', body: 'L\'eau est 800× plus dense que l\'air. Une amélioration technique mineure (angle d\'entrée, rotation) peut faire gagner 5–10 s aux 100 m sans gagner en condition physique.' },
    { icon: '🎯', title: 'Drills ciblés', body: 'Consacre 20–30 % de chaque séance aux drills techniques (catch-up, finger drag, high elbow) — plus efficace que nager vite pendant 1h.' },
    { icon: '🤿', title: 'Vidéo sous-marine', body: 'Filme-toi (ou fais-toi filmer) sous l\'eau 1× par mois. La self-analyse révèle des défauts invisibles sur prise de temps.' },
  ],
  videos: [
    {
      youtubeId: '3Ox8gRCmIXE',
      title: 'Crawl parfait — Technique complète',
      description: 'Décryptage complet de la nage crawl : entrée du bras, traction, rotation et respiration bilatérale.',
      duration: '20 min',
      level: 'Tous niveaux',
      thumbnail: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=800&q=80',
    },
    {
      youtubeId: '5i0xdOhfBag',
      title: '10 drills incontournables',
      description: 'Les 10 exercices techniques que tout nageur doit maîtriser pour un crawl économique et rapide.',
      duration: '18 min',
      level: 'Intermédiaire',
      thumbnail: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80',
    },
    {
      youtubeId: 'sTHmfA_fmXo',
      title: 'Préparation open water',
      description: 'Transition piscine → eau libre : orientation, stratégie de départ, balisage et gestion du stress.',
      duration: '25 min',
      level: 'Avancé',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    },
  ],
  program: [
    {
      week: 'Semaine 1–2',
      theme: 'Technique crawl',
      sessions: [
        { name: 'Séance drills 1 500 m', detail: 'Échauffement 400 m + 6×100 m drills (catch-up, 6-3-6, finger drag) + 400 m cool-down' },
        { name: 'Dos crawlé technique', detail: 'Travail amplitude + rotation hanches + entrée des bras — 1 200 m total' },
        { name: 'Endurance crawl 2 000 m', detail: 'Continu à allure confortable — focus sur la constance des mouvements' },
      ],
    },
    {
      week: 'Semaine 3–4',
      theme: 'Vitesse et intervalles',
      sessions: [
        { name: 'Intervals 10×100 m', detail: 'À 85 % vitesse max, départ toutes les 2 min — travail seuil aérobie' },
        { name: 'Technique brasse', detail: 'Ondulation + coordination bras-jambes-glisse — 1 000 m technique + 500 m libre' },
        { name: 'Open water simulation', detail: 'Nage en piscine sans toucher les lignes : orientation + départ groupé simulé' },
      ],
    },
    {
      week: 'Semaine 5–6',
      theme: 'Performance',
      sessions: [
        { name: 'Sprints 50 m × 20', detail: 'Départ toutes les 90 s — puissance et vitesse de nage sur courte distance' },
        { name: 'Série triathlon 3 × 750 m', detail: 'Avec transitions simulées en bord de bassin — préparation triathlon' },
        { name: 'Test chrono 1 500 m', detail: 'Nage continue à bloc — comparaison avec la semaine 1 pour mesurer la progression' },
      ],
    },
    {
      week: 'Semaine 7–8',
      theme: 'Affûtage & Open water',
      sessions: [
        { name: 'Volume −25 % + sprints courts', detail: 'Maintien de la vivacité sans accumuler de fatigue — fraîcheur pour la compétition' },
        { name: 'Séance open water réelle', detail: 'Lac ou mer : orientation, eau froide, balisage — simulation conditions réelles' },
        { name: 'Test bilan 400 m', detail: 'Crawl à bloc 400 m chrono — référence performance finale du cycle' },
      ],
    },
  ],
  faq: [
    { q: 'Je coule les jambes — comment corriger ?', a: 'Les jambes qui coulent viennent souvent d\'une tête trop haute ou d\'un kick trop puissant. Travaille le drill "torpedo" (bras le long du corps, tête dans l\'eau) pour corriger la position.' },
    { q: 'Combien de fois par semaine nager pour progresser ?', a: '3 séances/semaine minimum pour une progression technique visible. La natation est une activité très technique — la répétition est clé.' },
    { q: 'Je me fatigue après 50 m — est-ce normal ?', a: 'Oui pour un débutant — c\'est un problème technique, pas physique. Travaille d\'abord la respiration bilatérale et le relâchement dans l\'eau. La condition physique vient après.' },
    { q: 'La natation aide-t-elle pour d\'autres sports ?', a: 'Oui — développe la capacité pulmonaire, la souplesse des épaules et la conscience corporelle. Excellent complément pour le running, le cyclisme et la récupération active.' },
  ],
}

/* ── CrossFit ──────────────────────────────────────────────────── */
const crossfitContent: DisciplineContent = {
  tagline: 'Forged in fire. Tested every day.',
  heroStat: '1 800+ athlètes actifs',
  guide: {
    technique: {
      emoji: '🏋️',
      title: 'Mouvements fondamentaux',
      items: [
        'Les 9 mouvements fondamentaux CrossFit doivent être maîtrisés avant de charger lourd',
        'Snatch et Clean & Jerk : travail technique seul minimum 4–6 semaines avant d\'ajouter du poids',
        'Gymnastic skills : string pull-ups avant strict, kipping après — la force précède le kip',
        'Box jumps : atterrissage sur la boîte, descente par l\'extérieur (sécurité genou)',
        'Double-unders : patience — 3–6 mois pour maîtriser, mais ça vaut chaque essai raté',
      ],
    },
    equipment: {
      emoji: '🔗',
      title: 'Équipement CrossFit',
      items: [
        'Chaussures versatiles (Nike Metcon, Reebok Nano) — compromis entre stabilité et course',
        'Ceinture olympique pour les soulevés de terre et mouvements overhead lourds',
        'Grip pads ou spartiates pour les barres kipping — prévention ampoules',
        'Corde à sauter de speed (câble acier) pour les double-unders',
        'Chalk libre — indispensable pour les workouts avec barbell et pull-ups chargés',
      ],
    },
    nutrition: {
      emoji: '🥗',
      title: 'Fuel for CrossFit',
      items: [
        'CrossFit est anaérobie-aérobie : glucides rapides avant le WOD (banane, riz)',
        'Protéines 2 g/kg/jour — la reconstruction musculaire post-WOD est intensive',
        'Créatine 5 g/jour — améliorations mesurables sur les mouvements de puissance',
        'Bêta-alanine pour les WODs longs (> 10 min) — réduction de l\'acidose musculaire',
        'Hydratation : peser avant/après — chaque kg perdu = 1L d\'eau à compenser',
      ],
    },
    recovery: {
      emoji: '🏥',
      title: 'Récupération CrossFit',
      items: [
        'Cool-down obligatoire : 10 min mobility + 5 min breathing après chaque WOD intense',
        'Glace sur les articulations sensibles (poignets, épaules, genoux) post-workout',
        'Foam rolling sur les zones de garde musculaire : thorax, hanches, ischio-jambiers',
        'Maximum 2 jours consécutifs sans repos — le CrossFit détruit autant qu\'il construit',
        'Sommeil : l\'IGF-1 (insulin-like growth factor) nécessite minimum 7,5h de sommeil récupérateur',
      ],
    },
  },
  tips: [
    { icon: '🎯', title: 'Scale intelligemment', body: 'Il n\'y a aucune honte à scaler un WOD. Faire "Fran" en 12 min avec charges adaptées est plus bénéfique que de souffrir 25 min avec trop lourd.' },
    { icon: '⏱️', title: 'Stratégie beats fitness', body: 'Diviser un WOD (sets de 10 → 7-3, 21s → 12-9) avant de fatiguer est toujours plus rapide que partir à bloc et s\'effondrer.' },
    { icon: '📓', title: 'Loggue chaque WOD', body: 'Note ton temps, tes charges et tes notes. Repasser un benchmark WOD en sachant l\'objectif à battre est le moteur de progression numéro 1.' },
    { icon: '🤝', title: 'La communauté est le programme', body: 'L\'effet box — s\'entraîner avec d\'autres — améliore la performance de 20 % en moyenne. La compétition amicale est le meilleur pre-workout.' },
  ],
  videos: [
    {
      youtubeId: 'Ws5iEBMqcco',
      title: 'Les 9 mouvements fondamentaux',
      description: 'Maîtrise la base : squat, presse, deadlift, clean et les mouvements gymnastic — le kit de démarrage CrossFit.',
      duration: '28 min',
      level: 'Débutant',
      thumbnail: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80',
    },
    {
      youtubeId: '7kN7dLLiTMc',
      title: 'Snatch — Tutoriel technique',
      description: 'L\'arraché en 6 étapes progressives : position de départ, tirage, réception et extension complète.',
      duration: '22 min',
      level: 'Intermédiaire',
      thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
    },
    {
      youtubeId: 'HRV5Z7BSCK0',
      title: 'Benchmark WODs — Stratégie',
      description: 'Fran, Murph, Grace, Diane — comment aborder les WODs de référence pour battre son PR à chaque tentative.',
      duration: '16 min',
      level: 'Avancé',
      thumbnail: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?auto=format&fit=crop&w=800&q=80',
    },
  ],
  program: [
    {
      week: 'Semaine 1–2',
      theme: 'Technique & Fondamentaux',
      sessions: [
        { name: 'Skills : Snatch progressif', detail: 'Bar only → 40 kg → 60 % 1RM — technique avant tout, 45 min + WOD léger 10 min' },
        { name: 'WOD : Fran scalée', detail: '21-15-9 : Thrusters (35/25 kg) + Pull-ups — cible < 10 min' },
        { name: 'Gymnastic : HSPU drills', detail: 'Wall walk + negative HSPU + pike push-up — 4×5 progressifs' },
      ],
    },
    {
      week: 'Semaine 3–4',
      theme: 'Volume & Intensity',
      sessions: [
        { name: 'WOD : Murph 50 %', detail: '50 pull-ups, 100 push-ups, 150 squats + 1 mile run — partition libre avec gilet si possible' },
        { name: 'Barbell cycling 20 min', detail: 'Clean & Jerk : EMOM 3 reps à 70 % 1RM — technique sous fatigue' },
        { name: 'WOD : Death by pull-ups', detail: 'Minute 1 : 1 pull-up. Continue jusqu\'à l\'échec — teste l\'endurance gymnastic' },
      ],
    },
    {
      week: 'Semaine 5–6',
      theme: 'Benchmarks & Records',
      sessions: [
        { name: 'Benchmark : Grace', detail: '30 Clean & Jerks (60/40 kg) for time — cible < 5 min pour RX' },
        { name: 'Open WOD simulation', detail: 'WOD style Open avec structure 20 min AMRAP — entraînement compétition' },
        { name: 'Test : Chest-to-bar max unbroken', detail: 'Évaluation C2B pull-ups, bar muscle-up et TTB — baseline gymnastic' },
      ],
    },
    {
      week: 'Semaine 7–8',
      theme: 'Peaking & Competition',
      sessions: [
        { name: 'Volume allégé + skills', detail: 'Focus sur les points faibles identifiés — double-unders, pistol squats, snatch balance' },
        { name: 'WOD test PR', detail: 'Refaire un WOD de la semaine 1–2 pour mesurer la progression — benchmark obligatoire' },
        { name: 'Fun WOD communauté', detail: 'WOD en groupe, poids léger, plaisir — terminer le cycle sur une bonne énergie' },
      ],
    },
  ],
  faq: [
    { q: 'Le CrossFit est-il dangereux ?', a: 'Non si bien encadré. Le risque de blessure au CrossFit est comparable à la gym traditionnelle. La technique prime toujours sur la charge ou la vitesse — scaler est toujours la bonne décision.' },
    { q: 'Faut-il être déjà en forme pour commencer ?', a: 'Non — tout le monde commence le CrossFit en scalant. La programmatique est universelle, seules les charges et modifications varient selon le niveau.' },
    { q: 'Combien de WODs par semaine ?', a: '3 WODs/semaine est idéal pour débutant. 4–5 pour intermédiaire avec un jour de mobilité. Les athlètes de niveau compétition font 5–6 sessions + récupération active.' },
    { q: 'Le CrossFit aide-t-il à maigrir ?', a: 'Oui — la combinaison de force, cardio et intensité variable brûle 500–800 kcal/séance et génère un EPOC significatif. Associé à une alimentation adaptée, c\'est très efficace.' },
  ],
}

/* ── Master map ────────────────────────────────────────────────── */
export const DISCIPLINE_CONTENT: Record<string, DisciplineContent> = {
  'running-cardio': runningContent,
  musculation: musculationContent,
  hiit: hiitContent,
  cyclisme: cyclismeContent,
  natation: natationContent,
  crossfit: crossfitContent,
}
