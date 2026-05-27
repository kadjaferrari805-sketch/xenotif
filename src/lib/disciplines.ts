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

export interface Exercise {
  name: string
  muscles: string
  sets: string
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Tous niveaux'
  description: string
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
  exercises: Exercise[]
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
      youtubeId: 'Byjy-LzSNc0',
      title: '9 Minutes pour corriger ta foulée',
      description: 'Corrige ta technique de course en 9 min — posture, attaque, cadence détaillées étape par étape.',
      duration: '9 min',
      level: 'Tous niveaux',
      thumbnail: 'https://img.youtube.com/vi/Byjy-LzSNc0/maxresdefault.jpg',
    },
    {
      youtubeId: 'sScNDZu2MWk',
      title: 'Foulée parfaite — 5 conseils',
      description: 'Les 5 secrets pour courir plus vite et sans douleur — technique validée par des coachs de haut niveau.',
      duration: '12 min',
      level: 'Intermédiaire',
      thumbnail: 'https://img.youtube.com/vi/sScNDZu2MWk/maxresdefault.jpg',
    },
    {
      youtubeId: '_kGESn8ArrU',
      title: 'Technique de course expliquée',
      description: 'Guide complet de la technique de course — cadence, appui, respiration et prévention des blessures.',
      duration: '15 min',
      level: 'Avancé',
      thumbnail: 'https://img.youtube.com/vi/_kGESn8ArrU/maxresdefault.jpg',
    },
    {
      youtubeId: 'KxKJEIqS1HQ',
      title: 'Séance interval run 20 min',
      description: 'Entraînement fractionné complet de 20 minutes — alternance sprints et récupération pour progresser vite.',
      duration: '20 min',
      level: 'Intermédiaire',
      thumbnail: 'https://img.youtube.com/vi/KxKJEIqS1HQ/maxresdefault.jpg',
    },
    {
      youtubeId: 'HFUz5qazxn0',
      title: 'Conseils pour les intervalles',
      description: 'Comment bien structurer ses intervalles pour maximiser la progression en course à pied.',
      duration: '11 min',
      level: 'Tous niveaux',
      thumbnail: 'https://img.youtube.com/vi/HFUz5qazxn0/maxresdefault.jpg',
    },
    {
      youtubeId: 'fbATY-sbqA8',
      title: 'Pourquoi faire des intervalles ?',
      description: 'La science derrière le fractionné — comment et pourquoi les intervalles boostent vos performances.',
      duration: '13 min',
      level: 'Débutant',
      thumbnail: 'https://img.youtube.com/vi/fbATY-sbqA8/maxresdefault.jpg',
    },
  ],
  exercises: [
    { name: 'Fentes marchées', muscles: 'Quadriceps, fessiers, ischio-jambiers', sets: '3×12/jambe', difficulty: 'Débutant', description: 'Fais un grand pas en avant, descends le genou arrière près du sol, puis pousse sur le pied avant pour ramener l\'autre jambe. Maintiens le dos droit.' },
    { name: 'Squat sauté', muscles: 'Quadriceps, fessiers, cardio', sets: '3×15', difficulty: 'Intermédiaire', description: 'Descends en squat parallèle puis explose vers le haut. Atterris doucement en fléchissant les genoux pour amortir. Renforce la puissance propulsive.' },
    { name: 'Step-up sur caisse', muscles: 'Quadriceps, fessiers, stabilisateurs', sets: '3×10/jambe', difficulty: 'Débutant', description: 'Pose un pied sur une caisse ou step, pousse pour monter, redescends lentement. Simule la montée de côtes en course.' },
    { name: 'Jumping lunges', muscles: 'Quadriceps, fessiers, explosivité', sets: '3×10/jambe', difficulty: 'Intermédiaire', description: 'Depuis la position de fente, saute et échange les jambes en l\'air. Excellent pour développer la puissance et l\'endurance des membres inférieurs.' },
    { name: 'Single-leg deadlift', muscles: 'Ischio-jambiers, fessiers, équilibre', sets: '3×8/jambe', difficulty: 'Avancé', description: 'Penche-toi en avant sur une jambe en gardant le dos plat, l\'autre jambe s\'étend derrière. Reviens à la verticale sans poser le pied. Renforce proprioception.' },
    { name: 'Box jumps', muscles: 'Quadriceps, mollets, explosivité', sets: '4×8', difficulty: 'Avancé', description: 'Saute sur une boîte en deux pieds, absorbe l\'atterrissage en demi-squat. Descends par l\'extérieur. Améliore la puissance explosive des membres inférieurs.' },
    { name: 'Running A-drills', muscles: 'Fléchisseurs de hanche, cadence', sets: '3×20 m', difficulty: 'Débutant', description: 'Marche en montant les genoux haut à chaque pas, bras en rythme. Améliore la mécanique de course et la cadence en travaillant l\'activation des hanches.' },
    { name: 'Planche latérale', muscles: 'Obliques, stabilité latérale', sets: '3×30 s/côté', difficulty: 'Débutant', description: 'Appui sur le coude et le côté du pied, corps en ligne droite. Renforce les muscles latéraux du tronc indispensables au maintien de la posture en course.' },
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
      youtubeId: 'WP0IFHkkRZ0',
      title: 'Tutoriel ultime du Deadlift',
      description: 'Le soulevé de terre parfait avec Martins Licis (Champion du Monde Strongman 2019) — technique complète.',
      duration: '18 min',
      level: 'Tous niveaux',
      thumbnail: 'https://img.youtube.com/vi/WP0IFHkkRZ0/maxresdefault.jpg',
    },
    {
      youtubeId: 'c5tXZfw0nCU',
      title: 'Squat, Deadlift, Bench — Suffisants ?',
      description: 'Les 3 mouvements de base suffisent-ils pour se muscler ? La vérité sur les exercices polyarticulaires.',
      duration: '14 min',
      level: 'Débutant',
      thumbnail: 'https://img.youtube.com/vi/c5tXZfw0nCU/maxresdefault.jpg',
    },
    {
      youtubeId: 'gNdZuaYZz7E',
      title: 'Soulevé de terre — Tutoriel complet',
      description: 'Guide en français du deadlift : position de départ, dos plat, verrouillage et variantes selon l\'objectif.',
      duration: '16 min',
      level: 'Intermédiaire',
      thumbnail: 'https://img.youtube.com/vi/gNdZuaYZz7E/maxresdefault.jpg',
    },
    {
      youtubeId: 'KzBvZ0KZ27k',
      title: 'Meilleur programme développé couché',
      description: 'Comment construire un programme efficace pour le bench press — progression, variations et erreurs à éviter.',
      duration: '17 min',
      level: 'Intermédiaire',
      thumbnail: 'https://img.youtube.com/vi/KzBvZ0KZ27k/maxresdefault.jpg',
    },
    {
      youtubeId: 'pxls2vBxFVs',
      title: 'Technique développé couché parfaite',
      description: 'Maîtrise la technique du bench press de A à Z — grip, arc, descente de barre et explosivité.',
      duration: '14 min',
      level: 'Tous niveaux',
      thumbnail: 'https://img.youtube.com/vi/pxls2vBxFVs/maxresdefault.jpg',
    },
    {
      youtubeId: 'rMmywzMtMYI',
      title: 'SBD pour débutants — Squat, Bench, Deadlift',
      description: 'Introduction aux trois mouvements fondamentaux de la force — tout ce qu\'un débutant doit savoir.',
      duration: '20 min',
      level: 'Débutant',
      thumbnail: 'https://img.youtube.com/vi/rMmywzMtMYI/maxresdefault.jpg',
    },
  ],
  exercises: [
    { name: 'Squat barre', muscles: 'Quadriceps, fessiers, ischio-jambiers, dos', sets: '4×8', difficulty: 'Tous niveaux', description: 'Barre en position haute dorsale, pieds à largeur d\'épaules. Descend jusqu\'au parallèle en gardant les genoux dans l\'axe des pieds. Le roi des exercices de musculation.' },
    { name: 'Deadlift', muscles: 'Dos entier, fessiers, ischio-jambiers, trapèzes', sets: '4×5', difficulty: 'Intermédiaire', description: 'Attrape la barre en pronation, dos plat, hanches basses. Pousse dans le sol et tire jusqu\'à l\'extension complète. Mouvement fondamental pour la force totale.' },
    { name: 'Développé couché', muscles: 'Pectoraux, triceps, deltoïde antérieur', sets: '4×8', difficulty: 'Tous niveaux', description: 'Allongé sur le banc, barre au niveau de la poitrine. Pousse verticalement sans rebond. L\'exercice de référence pour développer la poitrine et les triceps.' },
    { name: 'Tractions / Pull-ups', muscles: 'Grand dorsal, biceps, rhomboïdes', sets: '4×AMRAP', difficulty: 'Intermédiaire', description: 'Suspendu à la barre, prise en pronation. Tire jusqu\'au menton au-dessus de la barre. Meilleur exercice pour l\'épaisseur et la largeur du dos.' },
    { name: 'Overhead Press', muscles: 'Épaules, triceps, trapèzes', sets: '4×8', difficulty: 'Intermédiaire', description: 'Barre au niveau des clavicules, pousse verticalement jusqu\'à extension complète. Rentre la tête dans les épaules en fin de mouvement pour un verrouillage sûr.' },
    { name: 'Romanian Deadlift', muscles: 'Ischio-jambiers, fessiers, bas du dos', sets: '3×10', difficulty: 'Intermédiaire', description: 'Barre tenue devant les cuisses, penche le buste en avant en gardant le dos plat et les genoux légèrement fléchis. Excellent pour l\'hypertrophie des ischios.' },
    { name: 'Dips', muscles: 'Pectoraux, triceps, deltoïde antérieur', sets: '3×12', difficulty: 'Intermédiaire', description: 'Appui sur les barres parallèles, descends jusqu\'à ce que les bras soient à 90°, remonte sans hyperextension des coudes. Ajoute un lest quand c\'est trop facile.' },
    { name: 'Rowing barre', muscles: 'Grand dorsal, rhomboïdes, biceps, trapèzes', sets: '4×8', difficulty: 'Avancé', description: 'Penché à 45°, barre au sol, tire jusqu\'au bas de la poitrine. Volume sur les muscles du dos indispensable pour un dos épais et un équilibre musculaire optimal.' },
    { name: 'Leg press', muscles: 'Quadriceps, fessiers, mollets', sets: '3×12', difficulty: 'Débutant', description: 'Machine leg press : pieds à largeur d\'épaules, descends jusqu\'au 90° puis pousse. Idéal pour augmenter le volume sur les jambes sans charger la colonne.' },
    { name: 'Face pull', muscles: 'Deltoïde postérieur, coiffe des rotateurs, rhomboïdes', sets: '3×20', difficulty: 'Tous niveaux', description: 'Poulie haute, tire la corde vers le visage en écartant les mains. Indispensable pour la santé des épaules et contre-balancer le volume en développé couché.' },
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
      youtubeId: 'cDEZrynoEdM',
      title: 'HIIT 20 min — Brûle-graisse total',
      description: 'Séance HIIT débutant sans équipement — brûle des graisses, construit l\'endurance, améliore la condition physique.',
      duration: '20 min',
      level: 'Débutant',
      thumbnail: 'https://img.youtube.com/vi/cDEZrynoEdM/maxresdefault.jpg',
    },
    {
      youtubeId: 'J8EeluUr4ak',
      title: 'HIIT sans impact — Full body',
      description: 'HIIT basse intensité 20 min, sans sauts — idéal pour débuter ou protéger les articulations.',
      duration: '20 min',
      level: 'Débutant',
      thumbnail: 'https://img.youtube.com/vi/J8EeluUr4ak/maxresdefault.jpg',
    },
    {
      youtubeId: 'NvHsieMfZxU',
      title: '20 min HIIT — Zéro équipement',
      description: 'Entraînement HIIT complet pour débutants — poids du corps, full body, résultats rapides.',
      duration: '20 min',
      level: 'Intermédiaire',
      thumbnail: 'https://img.youtube.com/vi/NvHsieMfZxU/maxresdefault.jpg',
    },
    {
      youtubeId: 'V4MqB6q3w44',
      title: 'Tabata 24 min — Niveau avancé',
      description: 'Séance Tabata intense pour sportifs confirmés — 24 minutes de travail à haute intensité.',
      duration: '24 min',
      level: 'Avancé',
      thumbnail: 'https://img.youtube.com/vi/V4MqB6q3w44/maxresdefault.jpg',
    },
    {
      youtubeId: '1u5eO7AvPjk',
      title: 'Tabata Full Body 24 min',
      description: 'Circuit Tabata complet : full body, 24 minutes, sans équipement — brûle calories et booste le cardio.',
      duration: '24 min',
      level: 'Intermédiaire',
      thumbnail: 'https://img.youtube.com/vi/1u5eO7AvPjk/maxresdefault.jpg',
    },
    {
      youtubeId: 'aoKrGARP634',
      title: 'Tabata + Force 42 min',
      description: 'Combinaison Tabata et musculation en 42 minutes — le meilleur des deux mondes pour la condition physique.',
      duration: '42 min',
      level: 'Avancé',
      thumbnail: 'https://img.youtube.com/vi/aoKrGARP634/maxresdefault.jpg',
    },
  ],
  exercises: [
    { name: 'Burpees', muscles: 'Full body, cardio', sets: '3×15', difficulty: 'Intermédiaire', description: 'Position debout, descends en squat, pose les mains, étends les jambes en position pompe, fais une pompe, ramène les pieds, saute. L\'exercice HIIT ultime.' },
    { name: 'Mountain climbers', muscles: 'Abdominaux, fléchisseurs de hanche, cardio', sets: '3×30 s', difficulty: 'Débutant', description: 'Position de planche haute, ramène les genoux vers la poitrine en alternance à vitesse maximum. Maintiens le bassin stable et les hanches basses.' },
    { name: 'Squat jumps', muscles: 'Quadriceps, fessiers, explosivité cardio', sets: '3×15', difficulty: 'Intermédiaire', description: 'Squat à 90° puis explose vers le haut en sautant, bras propulsés. Atterris en amortissant avec les genoux fléchis. Développe la puissance et le cardio simultanément.' },
    { name: 'High knees', muscles: 'Fléchisseurs de hanche, cardio', sets: '3×30 s', difficulty: 'Débutant', description: 'Course sur place en montant les genoux à hauteur des hanches. Bras en rythme à 90°. Excellent échauffement HIIT ou exercice d\'intensification cardio.' },
    { name: 'Ice skaters', muscles: 'Fessiers, abducteurs, coordination cardio', sets: '3×20/côté', difficulty: 'Intermédiaire', description: 'Saute latéralement d\'un pied à l\'autre en mimant le patineur. Touche le sol avec la main opposée au pied d\'appui. Travaille les déplacements latéraux et le cardio.' },
    { name: 'Push-up clapping', muscles: 'Pectoraux, triceps, explosivité', sets: '3×10', difficulty: 'Avancé', description: 'Pompe explosive avec claquement des mains en l\'air avant de revenir. Nécessite une bonne base de pompes classiques. Développe la puissance du haut du corps.' },
    { name: 'Box jumps', muscles: 'Quadriceps, mollets, puissance cardio', sets: '4×10', difficulty: 'Intermédiaire', description: 'Monte sur une caisse en sautant, amortis en demi-squat. Descends par l\'extérieur. Hauteur progressive : 40, 50, 60, 70 cm selon le niveau.' },
    { name: 'Planche dynamique', muscles: 'Abdominaux, épaules, gainage', sets: '3×30 s', difficulty: 'Intermédiaire', description: 'Depuis la planche haute, descends sur les avant-bras et remonte en alternant les bras. Garde les hanches stables et évite la rotation du bassin.' },
    { name: 'Sprint 30 m', muscles: 'Cardio max, quadriceps, mollets', sets: '10×30 m', difficulty: 'Avancé', description: 'Sprint à 100 % de la vitesse maximale sur 30 mètres. Récupération complète (90 s) entre chaque. Développe la puissance anaérobie et la vitesse de pointe.' },
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
      youtubeId: 'NnFGvxDoutY',
      title: 'FTP et zones d\'entraînement cyclisme',
      description: 'Les bases du cyclisme structuré — FTP, zones de puissance et comment les utiliser pour progresser.',
      duration: '18 min',
      level: 'Tous niveaux',
      thumbnail: 'https://img.youtube.com/vi/NnFGvxDoutY/maxresdefault.jpg',
    },
    {
      youtubeId: 'TTGkXtfzUxk',
      title: 'Zones 1 à 7 — Setup & guide complet',
      description: 'Configuration et utilisation de tes zones de puissance avec un capteur — guide pratique complet.',
      duration: '22 min',
      level: 'Intermédiaire',
      thumbnail: 'https://img.youtube.com/vi/TTGkXtfzUxk/maxresdefault.jpg',
    },
    {
      youtubeId: 'IKhK5RQ2RXI',
      title: 'Zones d\'entraînement — Tout comprendre',
      description: 'Ce que sont les zones, pourquoi les utiliser et comment elles transforment le cyclisme amateur.',
      duration: '20 min',
      level: 'Avancé',
      thumbnail: 'https://img.youtube.com/vi/IKhK5RQ2RXI/maxresdefault.jpg',
    },
    {
      youtubeId: '5e5qS3t17gg',
      title: 'HIIT Indoor Cycling — Zwift workout',
      description: 'Séance HIIT à l\'intérieur sur hometrainer — structure d\'entraînement par intervalles avec Zwift.',
      duration: '30 min',
      level: 'Intermédiaire',
      thumbnail: 'https://img.youtube.com/vi/5e5qS3t17gg/maxresdefault.jpg',
    },
    {
      youtubeId: '_NQE6XbcTcA',
      title: 'Débuter le cyclisme indoor',
      description: 'Guide complet pour commencer le vélo d\'appartement — matériel, réglages, premières séances structurées.',
      duration: '16 min',
      level: 'Débutant',
      thumbnail: 'https://img.youtube.com/vi/_NQE6XbcTcA/maxresdefault.jpg',
    },
    {
      youtubeId: '17HZsFrbZLs',
      title: 'Indoor cycling — 30 min intervalles',
      description: 'Séance de 30 minutes avec intervalles progressifs sur vélo d\'intérieur — parfait pour progresser rapidement.',
      duration: '30 min',
      level: 'Intermédiaire',
      thumbnail: 'https://img.youtube.com/vi/17HZsFrbZLs/maxresdefault.jpg',
    },
  ],
  exercises: [
    { name: 'Pédalage unijambiste', muscles: 'Quadriceps, fessiers, technique pédalage', sets: '3×2 min/jambe', difficulty: 'Tous niveaux', description: 'Pédale avec une seule jambe pendant 2 minutes, l\'autre repose sur le cadre. Révèle les points faibles du coup de pédale et corrige les asymétries de puissance.' },
    { name: 'Sprints sur vélo 30 s', muscles: 'Puissance anaérobie, quadriceps, mollets', sets: '8×30 s', difficulty: 'Intermédiaire', description: 'Sprint maximum pendant 30 secondes, récupération 4 min en pédalage léger. Développe la puissance de pointe et la capacité à accélérer dans les finales.' },
    { name: 'Sweet spot 2×20 min', muscles: 'Endurance seuil, cardio-respiratoire', sets: '2×20 min', difficulty: 'Intermédiaire', description: 'Pédale à 88–95 % de ton FTP pendant 20 minutes avec 5 min de repos entre. Le meilleur rapport bénéfice/fatigue pour progresser en cyclisme.' },
    { name: 'Cadence drills 100+ RPM', muscles: 'Technique, efficacité musculaire', sets: '5×3 min', difficulty: 'Débutant', description: 'Pédale à cadence élevée (100+ RPM) en braquet léger pendant 3 min. Améliore la fluidité du coup de pédale et réduit la charge sur les genoux.' },
    { name: 'Squat bulgare (cross-training)', muscles: 'Quadriceps, fessiers, stabilité', sets: '3×10/jambe', difficulty: 'Intermédiaire', description: 'Pied arrière posé sur un banc, descends en fente profonde. Renforce les jambes de façon asymétrique, corrige les déséquilibres droite/gauche courants en cyclisme.' },
    { name: 'Gainage planche', muscles: 'Core, stabilité lombaire', sets: '3×45 s', difficulty: 'Débutant', description: 'Appui sur les avant-bras et les pointes des pieds, corps en ligne droite. Un core fort permet de transmettre la puissance des jambes efficacement sur le vélo.' },
    { name: 'Étirements fléchisseurs de hanche', muscles: 'Psoas, fléchisseurs de hanche', sets: '3×60 s/côté', difficulty: 'Tous niveaux', description: 'En fente basse, maintiens la position en allongeant le psoas. Les fléchisseurs raccourcis en cyclisme réduisent la puissance et augmentent le risque de lombalgie.' },
    { name: 'Climbing intervals 5 min', muscles: 'Puissance/poids, cardio seuil', sets: '5×5 min', difficulty: 'Avancé', description: 'En montée réelle ou simulée (pente > 5 %), maintiens une cadence de 70–75 RPM à 95–100 % FTP. Développe le rapport puissance/poids indispensable pour grimper.' },
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
      youtubeId: '6_vXycbD2TM',
      title: 'Apprendre le crawl — Guide étape par étape',
      description: 'Guide complet du crawl pour débutants : position du corps, mouvement des bras, respiration et jambes.',
      duration: '22 min',
      level: 'Débutant',
      thumbnail: 'https://img.youtube.com/vi/6_vXycbD2TM/maxresdefault.jpg',
    },
    {
      youtubeId: 'AQy_c30lNjI',
      title: 'Technique crawl — Masterclass',
      description: 'Analyse en détail de la technique de nage crawl (front crawl) par un coach certifié fédéral.',
      duration: '18 min',
      level: 'Intermédiaire',
      thumbnail: 'https://img.youtube.com/vi/AQy_c30lNjI/maxresdefault.jpg',
    },
    {
      youtubeId: 'DUpfLigoWEc',
      title: 'Crawl débutant — Apprends vite',
      description: 'Méthode rapide pour maîtriser le crawl — les erreurs les plus courantes corrigées en une vidéo.',
      duration: '16 min',
      level: 'Débutant',
      thumbnail: 'https://img.youtube.com/vi/DUpfLigoWEc/maxresdefault.jpg',
    },
    {
      youtubeId: 'K5RMFjHBPHE',
      title: 'Les 4 meilleurs drills de dos crawlé',
      description: 'Quatre exercices ciblés pour améliorer ta technique de dos crawlé — rotation, entrée de bras, position.',
      duration: '12 min',
      level: 'Intermédiaire',
      thumbnail: 'https://img.youtube.com/vi/K5RMFjHBPHE/maxresdefault.jpg',
    },
    {
      youtubeId: 'WiMMuE7P7P4',
      title: '3 drills de brasse essentiels',
      description: 'Trois exercices clés pour perfectionner ta brasse — coordination bras-jambes, glisse et timing.',
      duration: '10 min',
      level: 'Tous niveaux',
      thumbnail: 'https://img.youtube.com/vi/WiMMuE7P7P4/maxresdefault.jpg',
    },
    {
      youtubeId: 'aU7sdctpxck',
      title: 'Maîtriser le dos crawlé — 6 drills',
      description: 'Six exercices progressifs pour maîtriser le dos crawlé de la technique de base aux niveaux avancés.',
      duration: '18 min',
      level: 'Avancé',
      thumbnail: 'https://img.youtube.com/vi/aU7sdctpxck/maxresdefault.jpg',
    },
  ],
  exercises: [
    { name: 'Crawl drills catch-up', muscles: 'Épaules, grand dorsal, technique bras', sets: '6×50 m', difficulty: 'Tous niveaux', description: 'Nage en attendant que la main avant touche l\'autre avant de démarrer le bras suivant. Améliore l\'extension du bras et la rotation des hanches.' },
    { name: 'Planche jambes', muscles: 'Fléchisseurs de cheville, quadriceps, technique kick', sets: '4×25 m', difficulty: 'Débutant', description: 'Tiens la planche devant toi à bout de bras et travaille uniquement les jambes. Battements petits et rapides depuis les hanches, genoux légèrement fléchis.' },
    { name: 'Pull-buoy bras', muscles: 'Épaules, grand dorsal, pectoraux', sets: '4×50 m', difficulty: 'Débutant', description: 'Pull-buoy entre les cuisses, travaille uniquement les bras. Concentration maximale sur la traction dans l\'eau et le catch en haut du mouvement.' },
    { name: 'Flip-turn isolé', muscles: 'Technique virage, abdominaux', sets: '3×10 virages', difficulty: 'Intermédiaire', description: 'Approche le mur à 1 m, exécute la roulade complète et pousse fort sur le mur. Pratique les virages hors de l\'eau d\'abord. Peut faire gagner 2–3 s aux 100 m.' },
    { name: 'Intervals 10×100 m', muscles: 'Endurance aérobie, cardio-respiratoire', sets: '10×100 m', difficulty: 'Intermédiaire', description: 'Nage 100 m à 85 % de ta vitesse max, départ toutes les 2 min. Compte tes longueurs et chronomètre chaque 100 m pour suivre la régularité.' },
    { name: 'Sprints 50 m', muscles: 'Vitesse maximale, puissance bras', sets: '8×50 m', difficulty: 'Avancé', description: 'Départ plongé ou culbute, sprint à 100 % sur 50 m. Récupération complète de 2 min entre chaque. Développe la vitesse de pointe et l\'explosivité en nage.' },
    { name: 'Nage avec plaquettes', muscles: 'Force appuis eau, épaules, dos', sets: '4×50 m', difficulty: 'Intermédiaire', description: 'Plaquettes aux mains pour augmenter la surface d\'appui. Améliore la force et la proprioception de la prise d\'eau. Ne pas utiliser plus de 20 % du volume total.' },
    { name: 'Brasse technique lente', muscles: 'Coordination globale, hanches, genoux', sets: '6×50 m', difficulty: 'Tous niveaux', description: 'Brasse très lente avec accent sur la glisse : après chaque traction, les bras s\'étendent en avant et les jambes se rejoignent — maintiens la glisse 2 s minimum.' },
    { name: 'Dos crawlé', muscles: 'Trapèzes, grand dorsal, épaules, coordination', sets: '4×50 m', difficulty: 'Débutant', description: 'Sur le dos, entrée du bras dans l\'axe de l\'épaule, rotation des hanches à 45°. Regard vers le plafond, oreilles dans l\'eau. Travaille la coordination dos/bras.' },
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
      youtubeId: 'mLDxJTk6xj8',
      title: '9 exercices fondamentaux CrossFit',
      description: 'Maîtrise les 9 mouvements de base avant de te lancer dans les WODs — guide pour débutants complets.',
      duration: '20 min',
      level: 'Débutant',
      thumbnail: 'https://img.youtube.com/vi/mLDxJTk6xj8/maxresdefault.jpg',
    },
    {
      youtubeId: 'nJWMnyTaU0Y',
      title: 'Top 5 WODs benchmark débutants',
      description: 'Les 5 WODs de référence à connaître quand on débute le CrossFit — stratégie et scaling expliqués.',
      duration: '15 min',
      level: 'Débutant',
      thumbnail: 'https://img.youtube.com/vi/nJWMnyTaU0Y/maxresdefault.jpg',
    },
    {
      youtubeId: 'XwmDh9qQtTc',
      title: '3 WODs CrossFit sans équipement',
      description: 'Trois séances CrossFit au poids du corps à faire à la maison — efficaces, sans matériel requis.',
      duration: '25 min',
      level: 'Intermédiaire',
      thumbnail: 'https://img.youtube.com/vi/XwmDh9qQtTc/maxresdefault.jpg',
    },
    {
      youtubeId: 'tCbRldfx7jk',
      title: 'J\'ai essayé le WOD Murph',
      description: 'Retour d\'expérience complet sur le WOD Murph — préparation, stratégie et ressenti après l\'effort.',
      duration: '18 min',
      level: 'Tous niveaux',
      thumbnail: 'https://img.youtube.com/vi/tCbRldfx7jk/maxresdefault.jpg',
    },
    {
      youtubeId: 'M_ry-0rLRoc',
      title: 'Murph Hero WOD — Démonstration complète',
      description: 'Exécution complète du WOD Murph avec conseils de stratégie, partition et rythme pour le finir.',
      duration: '22 min',
      level: 'Avancé',
      thumbnail: 'https://img.youtube.com/vi/M_ry-0rLRoc/maxresdefault.jpg',
    },
    {
      youtubeId: 'j77_rHevrm4',
      title: 'Conseils live pour le Murph',
      description: 'Stratégie détaillée pour le WOD Murph — partition optimale, gestion de l\'énergie et tips pour se dépasser.',
      duration: '20 min',
      level: 'Intermédiaire',
      thumbnail: 'https://img.youtube.com/vi/j77_rHevrm4/maxresdefault.jpg',
    },
  ],
  exercises: [
    { name: 'Thrusters', muscles: 'Quadriceps, fessiers, épaules, triceps', sets: '5×5', difficulty: 'Intermédiaire', description: 'Squat avec la barre en rack frontal puis poussée overhead dans la continuité du mouvement. Exercice "roi" du CrossFit — combinaison squat et shoulder press en un.' },
    { name: 'Pull-ups kipping', muscles: 'Grand dorsal, biceps, abdominal', sets: '5×10', difficulty: 'Intermédiaire', description: 'Traction avec balancier du corps pour maximiser l\'efficacité sur les WODs longs. Maîtrise d\'abord les strict pull-ups avant de passer au kipping pour protéger les épaules.' },
    { name: 'Box jumps', muscles: 'Quadriceps, mollets, gainage, explosivité', sets: '5×10', difficulty: 'Tous niveaux', description: 'Saute sur la caisse en deux pieds, absorbe en demi-squat, descends par l\'extérieur. Commence à 40 cm et monte progressivement. Fondamental des WODs CrossFit.' },
    { name: 'Snatch technique', muscles: 'Full body, coordination, puissance', sets: '4×3', difficulty: 'Avancé', description: 'L\'arraché olympique — de la barre au sol au verrouillage overhead en un mouvement explosif. Travail technique indispensable avant de charger. Commencer à la barre seule.' },
    { name: 'Double-unders', muscles: 'Mollets, coordination, cardio', sets: '5×50', difficulty: 'Intermédiaire', description: 'La corde passe deux fois sous les pieds à chaque saut. Sauts légèrement plus hauts que les simples, poignets très rapides. 3–6 mois de pratique pour les maîtriser.' },
    { name: 'Wall balls', muscles: 'Quadriceps, fessiers, épaules, coordination', sets: '5×15', difficulty: 'Débutant', description: 'Squat profond puis projette la medball (9/6 kg) contre la cible à 3 m. Attrape la balle à la descente et enchaîne directement. Développe l\'endurance musculaire globale.' },
    { name: 'GHD sit-ups', muscles: 'Abdominaux, fléchisseurs de hanche, extenseurs dos', sets: '3×15', difficulty: 'Avancé', description: 'Sur le GHD machine, descends jusqu\'à l\'horizontale et remonte en utilisant les abdos. Commence avec petit range of motion — douleurs de DOMS intenses chez les débutants.' },
    { name: 'Muscle-ups', muscles: 'Dos, triceps, pectoraux, coordination', sets: '3×3', difficulty: 'Avancé', description: 'Depuis la suspension, combine traction et dips en un seul mouvement pour passer au-dessus de la barre. Nécessite une base solide de pull-ups et dips avant de progresser vers cet objectif.' },
    { name: 'Clean & Jerk', muscles: 'Full body, puissance, technique olympique', sets: '4×3', difficulty: 'Avancé', description: 'Épaulé-jeté olympique en deux temps — épaulé (barre de sol en rack) puis jeté (barre overhead). Le mouvement qui définit le CrossFit de haut niveau. Technique avant charge.' },
    { name: 'Burpees box jumps', muscles: 'Full body, cardio, explosivité', sets: '4×10', difficulty: 'Intermédiaire', description: 'Burpee classique puis saute sur la caisse au lieu de sauter en l\'air. Combine l\'endurance du burpee et la puissance du box jump. Fréquent dans les WODs compétition.' },
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
/* ── Yoga ──────────────────────────────────────────────────────── */
const yogaContent: DisciplineContent = {
  tagline: 'Flexibilité, force intérieure et sérénité — sur et hors du tapis.',
  heroStat: '2 900+ pratiquants actifs',
  guide: {
    technique: {
      emoji: '🧘',
      title: 'Technique & Alignement',
      items: [
        'Alignement corporel : oreilles, épaules, hanches et chevilles dans le même axe en postures debout',
        'Respiration ujjayi — souffle lent par le nez, gorge légèrement contractée, synchronisé avec chaque mouvement',
        'Engage le bandha abdominal (uddiyana) pour protéger le bas du dos dans les flexions et extensions',
        'Progression posturale : ne force jamais une posture — utilise des briques et sangles pour adapter l\'amplitude',
        'Maintiens chaque posture de 5 à 10 respirations — la tenue dans le temps est plus bénéfique que la profondeur',
      ],
    },
    equipment: {
      emoji: '🛒',
      title: 'Équipement recommandé',
      items: [
        'Tapis antidérapant 4–6 mm (TPE ou caoutchouc naturel) — indispensable pour la stabilité et le confort articulaire',
        'Deux briques yoga (liège ou mousse) pour adapter les postures à ta souplesse actuelle',
        'Sangle de yoga pour les postures de flexion avant et d\'ouverture des hanches',
        'Bolster cylindrique pour le yoga restauratif et les postures de récupération passives',
        'Vêtements ajustés et respirants (pas de vêtements trop amples qui gênent la vision de l\'alignement)',
      ],
    },
    nutrition: {
      emoji: '🥗',
      title: 'Nutrition & Hydratation',
      items: [
        'Pratique à jeun ou au moins 2h après un repas — l\'estomac plein gêne les torsions et les inversions',
        'Hydratation douce : bois 300–400 ml d\'eau avant la séance, pas pendant les postures actives',
        'Thé vert ou infusion gingembre-citron 30 min avant la pratique pour activer la digestion',
        'Post-séance : repas léger riche en protéines végétales (lentilles, quinoa, tofu) pour la récupération',
        'Évite sucre raffiné et alcool les jours de pratique intensive — ils amplifient l\'inflammation',
      ],
    },
    recovery: {
      emoji: '💆',
      title: 'Récupération & Bien-être',
      items: [
        'Savasana obligatoire 5–10 min à chaque fin de séance — c\'est là que le corps intègre le travail',
        'Yoga nidra (yoga du sommeil) 20 min remplace 1h de sommeil conventionnel selon les études',
        'Auto-massage des pieds et des mollets avec balle de tennis après les séances en debout',
        'Douche chaude post-pratique pour relâcher les tensions musculaires profondes',
        'Journal de pratique : note tes ressentis après chaque séance pour suivre tes progrès subtils',
      ],
    },
  },
  tips: [
    { icon: '🌬️', title: 'Le souffle est roi', body: 'Si tu perds le contrôle de ta respiration, tu as dépassé ta limite. La respiration guide la posture — jamais l\'inverse.' },
    { icon: '📅', title: 'Régularité > Durée', body: '20 minutes chaque jour transforment le corps en 4 semaines. Une heure une fois par semaine ne produit que peu de changements durables.' },
    { icon: '🧠', title: 'Yoga = entraînement du cerveau', body: 'Les études IRM montrent que 8 semaines de pratique régulière augmentent le volume du cortex préfrontal, réduisant l\'anxiété de 40 %.' },
    { icon: '🔄', title: 'Enchaîne yin et yang', body: 'Alterne yoga dynamique (vinyasa, ashtanga) et yoga passif (yin, restauratif) dans la semaine pour équilibrer renforcement et récupération.' },
  ],
  videos: [
    {
      youtubeId: 'v7AYKMP6rOE',
      title: 'Yoga débutant — 30 min flow',
      description: 'Séquence yoga complète pour débutants — postures fondamentales, alignement et respiration guidés étape par étape.',
      duration: '30 min',
      level: 'Débutant',
      thumbnail: 'https://img.youtube.com/vi/v7AYKMP6rOE/maxresdefault.jpg',
    },
    {
      youtubeId: 'sTANio_2E0Q',
      title: 'Vinyasa flow 45 min',
      description: 'Enchaînement vinyasa intermédiaire — lien souffle-mouvement, ouverture des hanches et renforcement du core.',
      duration: '45 min',
      level: 'Intermédiaire',
      thumbnail: 'https://img.youtube.com/vi/sTANio_2E0Q/maxresdefault.jpg',
    },
    {
      youtubeId: '4pKly2JojMw',
      title: 'Yoga du matin — Réveil en douceur',
      description: 'Séquence matinale de 20 minutes pour éveiller le corps, activer l\'énergie et préparer la journée.',
      duration: '20 min',
      level: 'Tous niveaux',
      thumbnail: 'https://img.youtube.com/vi/4pKly2JojMw/maxresdefault.jpg',
    },
    {
      youtubeId: 'VaoV1PrYft4',
      title: 'Yin Yoga — Ouverture profonde',
      description: 'Yin yoga 40 minutes axé sur les hanches et le bas du dos — postures tenues longtemps pour les fascias et ligaments.',
      duration: '40 min',
      level: 'Tous niveaux',
      thumbnail: 'https://img.youtube.com/vi/VaoV1PrYft4/maxresdefault.jpg',
    },
    {
      youtubeId: 'pJHRhk7ozlQ',
      title: 'Yoga force — Niveau avancé',
      description: 'Séquence yoga avancée avec inversions, équilibres sur les mains et postures exigeantes de force.',
      duration: '50 min',
      level: 'Avancé',
      thumbnail: 'https://img.youtube.com/vi/pJHRhk7ozlQ/maxresdefault.jpg',
    },
    {
      youtubeId: '_yZHcnEsiaA',
      title: 'Yoga du soir — Détente & sommeil',
      description: 'Yoga restauratif 30 minutes pour se décompresser, relâcher les tensions de la journée et favoriser un sommeil profond.',
      duration: '30 min',
      level: 'Débutant',
      thumbnail: 'https://img.youtube.com/vi/_yZHcnEsiaA/maxresdefault.jpg',
    },
  ],
  exercises: [
    { name: 'Chien tête en bas (Adho Mukha)', muscles: 'Ischio-jambiers, mollets, épaules, dos', sets: '5 respirations', difficulty: 'Débutant', description: 'Depuis la planche, pousse les hanches vers le plafond en formant un V inversé. Talons vers le sol, dos allongé. Posture de référence qui étire et renforce simultanément.' },
    { name: 'Guerrier I (Virabhadrasana I)', muscles: 'Quadriceps, fessiers, fléchisseurs de hanche', sets: '5–8 respirations/côté', difficulty: 'Débutant', description: 'Pied avant à 90°, pied arrière à 45°, genou avant au-dessus de la cheville. Bras levés, épaules relâchées. Renforce les jambes et ouvre la poitrine.' },
    { name: 'Guerrier II (Virabhadrasana II)', muscles: 'Quadriceps, fessiers, abducteurs, épaules', sets: '5–8 respirations/côté', difficulty: 'Débutant', description: 'Pieds sur une même ligne, genou avant dans l\'axe du pied. Bras horizontaux, regard au-dessus de la main avant. Développe la force des jambes et la concentration.' },
    { name: 'Triangle (Trikonasana)', muscles: 'Ischio-jambiers, obliques, fléchisseurs de hanche', sets: '5 respirations/côté', difficulty: 'Intermédiaire', description: 'Jambes écartées, buste incliné latéralement, main basse sur le tibia ou le sol. Torsion ouvrant la poitrine. Améliore la souplesse latérale et l\'équilibre.' },
    { name: 'Planche (Phalakasana)', muscles: 'Abdominaux, épaules, fessiers, gainage global', sets: '3×30–60 s', difficulty: 'Débutant', description: 'Corps en ligne droite, poignets sous les épaules. Active les abdominaux, les fessiers et les jambes. La planche de yoga renforce sans comprimer les lombaires.' },
    { name: 'Corbeau (Bakasana)', muscles: 'Abdominaux, triceps, avant-bras, équilibre', sets: '3×5 respirations', difficulty: 'Avancé', description: 'Accroupi, pose les genoux sur les bras fléchis, incline le buste en avant et soulève les pieds. Renforce profondément le core et les bras. Posture d\'équilibre emblématique.' },
    { name: 'Posture de l\'enfant (Balasana)', muscles: 'Bas du dos, fessiers, épaules (étirement)', sets: '1–3 min', difficulty: 'Tous niveaux', description: 'Assis sur les talons, allonge les bras devant ou le long du corps. Relâche complètement le dos et les épaules. Posture de repos et de récupération entre les séquences.' },
    { name: 'Demi-pont (Setu Bandha)', muscles: 'Fessiers, ischio-jambiers, colonne vertébrale', sets: '3×10 respirations', difficulty: 'Débutant', description: 'Allongé sur le dos, genoux fléchis, pousse les hanches vers le plafond. Presse les pieds dans le sol. Ouvre la poitrine, renforce les fessiers et étire la colonne.' },
    { name: 'Torsion assise (Ardha Matsyendrasana)', muscles: 'Obliques, muscles paravertébraux, hanche', sets: '5 respirations/côté', difficulty: 'Intermédiaire', description: 'Assis au sol, pied d\'une jambe posé à l\'extérieur du genou opposé, torsion du buste. Détoxifie les organes abdominaux et améliore la mobilité thoracique.' },
    { name: 'Équilibre sur une jambe (Vrksasana)', muscles: 'Muscles stabilisateurs de la cheville, fessiers', sets: '5 respirations/côté', difficulty: 'Débutant', description: 'Debout sur une jambe, pied de l\'autre posé sur le tibia ou la cuisse. Mains en prière ou bras levés. Développe la proprioception et la concentration mentale.' },
  ],
  program: [
    {
      week: 'Semaine 1–2',
      theme: 'Fondations — Postures de base',
      sessions: [
        { name: 'Flow débutant 30 min', detail: 'Salutation au soleil A × 5, guerriers I & II, chien tête en bas, posture de l\'enfant' },
        { name: 'Yin yoga 40 min', detail: 'Papillon, demi-grenouille, torsion allongée — postures tenues 3–5 min chacune' },
        { name: 'Yoga du matin 20 min', detail: 'Séquence réveil : chat-vache, chien tête en bas, fentes basses, demi-pont' },
      ],
    },
    {
      week: 'Semaine 3–4',
      theme: 'Renforcement & Équilibre',
      sessions: [
        { name: 'Vinyasa flow 45 min', detail: 'Salutation au soleil B, guerrier III, triangle, planche latérale, chaturanga' },
        { name: 'Yoga core 30 min', detail: 'Planche, bateau, demi-bateau, planche latérale, boat crunches — renforcement profond' },
        { name: 'Yoga restauratif 40 min', detail: 'Postures soutenues par bolster/briques — libération des hanches et du bas du dos' },
        { name: 'Méditation assise 15 min', detail: 'Pranayama (cohérence cardiaque 5/5) + balayage corporel — ancrage mental' },
      ],
    },
    {
      week: 'Semaine 5–6',
      theme: 'Inversions & Approfondissement',
      sessions: [
        { name: 'Yoga avancé — inversions 50 min', detail: 'Prépa chandelle, demi-poirier contre le mur, corbeau, ouverture des épaules au sol' },
        { name: 'Ashtanga primary series partielle 60 min', detail: 'Debout + assis jusqu\'à navasana — practice dynamique et rigoureuse' },
        { name: 'Yin & restoratif 45 min', detail: 'Postures yin passives longues pour compenser l\'intensité du vinyasa' },
      ],
    },
    {
      week: 'Semaine 7–8',
      theme: 'Intégration & Autonomie',
      sessions: [
        { name: 'Pratique autonome 45 min', detail: 'Crée ta propre séquence avec les postures apprises — cultive ton intelligence intuitive du mouvement' },
        { name: 'Atelier posture clé', detail: 'Focus sur une posture avancée de ton choix : ouverture de hanche, inversion ou équilibre de bras' },
        { name: 'Yoga nidra 30 min', detail: 'Relaxation profonde guidée — intégration complète du cycle de 8 semaines' },
        { name: 'Bilan souplesse & force', detail: 'Test de flexion avant, équilibre unipodal, chaturanga max — mesure de la progression' },
      ],
    },
  ],
  faq: [
    { q: 'Faut-il être souple pour faire du yoga ?', a: 'Non — la raideur est justement la raison de commencer le yoga, pas un obstacle. Chaque posture est adaptable avec des accessoires (briques, sangle). La souplesse viendra avec la pratique.' },
    { q: 'Quelle différence entre vinyasa, ashtanga et yin yoga ?', a: 'Vinyasa est dynamique et créatif (lien souffle-mouvement). Ashtanga suit une séquence fixe, très structurée. Yin est passif et lent (postures tenues 3–5 min). Commence par le vinyasa ou le hatha pour un bon équilibre.' },
    { q: 'À quelle fréquence pratiquer pour voir des résultats ?', a: 'Minimum 3 séances/semaine de 30–45 min. Les changements de souplesse apparaissent en 3–4 semaines. Les bénéfices sur le stress et la qualité du sommeil souvent dès la première semaine.' },
    { q: 'Le yoga peut-il remplacer la musculation ?', a: 'Le yoga développe la force fonctionnelle, la mobilité et l\'endurance musculaire — complémentaire mais différent. Des styles comme l\'ashtanga ou le rocket yoga offrent un renforcement sérieux. L\'idéal est de combiner les deux.' },
  ],
}

/* ── Boxing ────────────────────────────────────────────────────── */
const boxingContent: DisciplineContent = {
  tagline: 'Puissance, explosivité et maîtrise de soi — forgées sur le ring.',
  heroStat: '1 800+ boxeurs actifs',
  guide: {
    technique: {
      emoji: '🥊',
      title: 'Technique & Garde',
      items: [
        'Garde orthodoxe (gaucher en avant) ou southpaw (droitier en avant) — pied directeur détermine la garde naturelle',
        'Position de base : pieds à largeur d\'épaules + 45°, poids 55 % sur la jambe arrière pour la mobilité',
        'Jab — coup direct du poing avant, bras tendu, épaule qui remonte pour protéger le menton',
        'Cross — coup du poing arrière avec rotation complète des hanches — 70 % de la puissance vient de la rotation du bassin',
        'Le mouvement de tête (slip, roll) est aussi important que les frappes — protège et crée les opportunités',
      ],
    },
    equipment: {
      emoji: '🛒',
      title: 'Équipement essentiel',
      items: [
        'Gants de boxe (10–12 oz pour entraînement général, 16 oz pour sparring) — protège les poignets et les adversaires',
        'Bandes de boxe 4,5 m — obligatoires sous les gants pour le soutien des poignets et des articulations',
        'Protège-dents moulé sur mesure — protection n°1 contre les commotions et fractures dentaires',
        'Sac de frappe (lourd 40–60 kg pour force, léger 20 kg pour vitesse et technique)',
        'Corde à sauter — l\'outil de cardio et de coordination le plus efficace de la boxe',
      ],
    },
    nutrition: {
      emoji: '🥩',
      title: 'Nutrition du boxeur',
      items: [
        'Repas pré-entraînement 2h avant : riz + protéine maigre + légumes — energie stable sans lourdeur',
        'Hydratation : minimum 600 ml d\'eau par heure d\'entraînement — la déshydratation ralentit les réflexes',
        'Protéines : 2–2,2 g/kg/jour pour maintenir la masse musculaire en période de préparation',
        'Gestion du poids : déficit calorique max 500 kcal/jour — les coupures de poids brutales réduisent la puissance de 15 %',
        'Récupération : collagène + vitamine C post-séance pour la santé des poignets, coudes et épaules',
      ],
    },
    recovery: {
      emoji: '💆',
      title: 'Récupération du boxeur',
      items: [
        'Glaçage poignets et articulations 10–15 min après chaque séance intense — prévention tendinite',
        'Étirements actifs des épaules, pectoraux et fléchisseurs de hanche post-séance (10 min)',
        'Rotation agoniste/antagoniste : jour frappe / jour jambes + core pour répartir la charge',
        'Massage des avant-bras et de la nuque — zones les plus contractées lors de la boxe',
        'Sommeil réparateur : les réflexes et la coordination se consolident pendant les phases de sommeil profond',
      ],
    },
  },
  tips: [
    { icon: '⚡', title: 'La puissance vient des hanches', body: 'Un cross généré uniquement par le bras représente 30 % de la puissance maximale. Ajoute la rotation des hanches et du tronc pour atteindre 100 % de ton potentiel.' },
    { icon: '🧠', title: 'Pense en combinaisons', body: 'Un seul coup est facilement évitable. Les combinaisons (1-2, 1-1-2, 1-2-3b) créent des ouvertures. Maîtrise 3 combinaisons avant d\'en apprendre de nouvelles.' },
    { icon: '🦶', title: 'Le travail de jambes est la clé', body: 'Un boxeur avec un mauvais travail de jambes ne peut pas attaquer ni défendre efficacement. Consacre 30 % de ton temps à la corde et aux déplacements.' },
    { icon: '🎯', title: 'Qualité > Quantité sur le sac', body: 'Frapper 100 coups propres vaut mieux que 500 coups bâclés. Chaque frappe sur le sac doit être précise, bien ancrée, avec retrait rapide des mains.' },
  ],
  videos: [
    {
      youtubeId: 'Xc9QRXUoNMw',
      title: 'Boxe débutant — Bases techniques',
      description: 'Initiation complète à la boxe — garde, jab, cross, crochet et uppercut expliqués pour les débutants absolus.',
      duration: '25 min',
      level: 'Débutant',
      thumbnail: 'https://img.youtube.com/vi/Xc9QRXUoNMw/maxresdefault.jpg',
    },
    {
      youtubeId: '93r6lz1pbcw',
      title: 'Combinaisons de boxe — Intermédiaire',
      description: 'Apprentissage de 10 combinaisons essentielles avec travail sur sac et mitaines — progression garantie.',
      duration: '30 min',
      level: 'Intermédiaire',
      thumbnail: 'https://img.youtube.com/vi/93r6lz1pbcw/maxresdefault.jpg',
    },
    {
      youtubeId: '4hYDno0aaAI',
      title: 'Séance shadow boxing 20 min',
      description: 'Entraînement shadow boxing complet — mouvement de jambes, combinaisons, esquives et visualisation de l\'adversaire.',
      duration: '20 min',
      level: 'Tous niveaux',
      thumbnail: 'https://img.youtube.com/vi/4hYDno0aaAI/maxresdefault.jpg',
    },
    {
      youtubeId: 'l6Kvp6OZhEA',
      title: 'Cardio boxe — Brûle-graisses intense',
      description: 'Circuit cardio boxe de 35 minutes — combinaisons, footwork et exercices athlétiques pour une condition physique optimale.',
      duration: '35 min',
      level: 'Intermédiaire',
      thumbnail: 'https://img.youtube.com/vi/l6Kvp6OZhEA/maxresdefault.jpg',
    },
    {
      youtubeId: 'F7dRCzMDgXA',
      title: 'Travail de tête et esquives',
      description: 'Maîtrise le slip, le roll et le bob & weave — les mouvements défensifs qui séparent les bons boxeurs des grands.',
      duration: '22 min',
      level: 'Intermédiaire',
      thumbnail: 'https://img.youtube.com/vi/F7dRCzMDgXA/maxresdefault.jpg',
    },
    {
      youtubeId: 'bb1yVrGe3VU',
      title: 'Puissance de frappe — Niveau avancé',
      description: 'Développe ta puissance maximale avec des exercices de plyométrie, de rotation et de frappe lourde sur sac.',
      duration: '40 min',
      level: 'Avancé',
      thumbnail: 'https://img.youtube.com/vi/bb1yVrGe3VU/maxresdefault.jpg',
    },
  ],
  exercises: [
    { name: 'Corde à sauter', muscles: 'Cardio, mollets, coordination, rythme', sets: '10×1 min / récup 30 s', difficulty: 'Tous niveaux', description: 'Saut simple en rythme constant, progresser vers double-under et crossover. L\'outil fondamental de tout boxeur pour améliorer la coordination pied-main-oeil et le cardio.' },
    { name: 'Shadow boxing', muscles: 'Épaules, cardio, technique, coordination', sets: '5×3 min / 1 min repos', difficulty: 'Débutant', description: 'Boxe dans le vide en visualisant un adversaire. Travaille les combinaisons, les déplacements, les esquives et la fluidité. Séance technique par excellence.' },
    { name: 'Sac lourd — combinaisons', muscles: 'Épaules, pectoraux, triceps, core, cardio', sets: '6×3 min / 1 min repos', difficulty: 'Intermédiaire', description: 'Enchaîne des combinaisons prédéfinies (1-2, 1-2-3b, 1-2-lb) sur le sac lourd. Focus sur la qualité de frappe, le retrait rapide des mains et la rotation des hanches.' },
    { name: 'Pompes boxeur', muscles: 'Pectoraux, triceps, épaules, core', sets: '4×15', difficulty: 'Intermédiaire', description: 'Pompe classique avec rotation du buste et extension du bras en uppercut en fin de mouvement. Renforce les muscles de frappe tout en travaillant la coordination.' },
    { name: 'Footwork en échelle', muscles: 'Mollets, coordination, vitesse de réaction', sets: '3×4 passages', difficulty: 'Débutant', description: 'Utilise une échelle de coordination au sol pour travailler les pas de boxe (in-out, latéral, pivot). Améliore la vitesse de déplacement et l\'équilibre dynamique en garde.' },
    { name: 'Squat sauté avec crochet', muscles: 'Quadriceps, fessiers, épaules, explosivité', sets: '4×10', difficulty: 'Intermédiaire', description: 'Descend en squat, explose vers le haut et envoie un crochet imaginaire en montant. Combine puissance des jambes et frappe — comme pour sortir d\'un clinch et contre-attaquer.' },
    { name: 'Gainage avec rotation (Russian twist)', muscles: 'Obliques, abdominaux, rotation du tronc', sets: '3×20', difficulty: 'Débutant', description: 'Assis en V, pieds décollés, tourne le buste de droite à gauche en touchant le sol de chaque côté. La rotation du tronc est la source de puissance de tous les coups latéraux.' },
    { name: 'Medicine ball slam', muscles: 'Épaules, dos, abdominaux, explosivité', sets: '4×12', difficulty: 'Intermédiaire', description: 'Lève le médecine ball à bout de bras puis projette-le violemment au sol. Simule la puissance d\'un overhand ou d\'un coup de tête. Excellent pour l\'explosivité du haut du corps.' },
    { name: 'Défense aux mitaines', muscles: 'Réflexes, coordination, cardio', sets: '4×3 min', difficulty: 'Avancé', description: 'Face au partenaire tenant les mitaines, travaille frappe-esquive alternée. Développe la vision périphérique, la vitesse de réaction et l\'adaptation tactique en temps réel.' },
  ],
  program: [
    {
      week: 'Semaine 1–2',
      theme: 'Fondations — Garde et coups de base',
      sessions: [
        { name: 'Technique débutant 45 min', detail: 'Garde, jab, cross, déplacements latéraux + 10 min corde à sauter basique' },
        { name: 'Cardio boxe 30 min', detail: 'Shadow boxing 3×3 min + sac léger combinaisons simples (1-2) 4×2 min' },
        { name: 'Conditioning athlétique 40 min', detail: 'Corde 5 min + pompes 4×15 + squat 4×15 + gainage 3×45 s + étirements' },
      ],
    },
    {
      week: 'Semaine 3–4',
      theme: 'Combinaisons & Cardio boxing',
      sessions: [
        { name: 'Mitaines / sac — combinaisons', detail: '10 combinaisons différentes en rotation sur sac lourd — 6×3 min avec 1 min repos' },
        { name: 'Sparring léger (si partenaire)', detail: '4×2 min de sparring technique à 50 % — focus déplacements et jab uniquement' },
        { name: 'HIIT boxe 25 min', detail: 'Shadow boxing 30 s / repos 15 s × 10, puis burpees boxeur 20 s / 10 s × 10' },
        { name: 'Renforcement fonctionnel', detail: 'Medicine ball slam 4×12 + Russian twist 3×20 + pompes boxeur 4×15' },
      ],
    },
    {
      week: 'Semaine 5–6',
      theme: 'Puissance & Défense',
      sessions: [
        { name: 'Séance puissance sac lourd', detail: 'Travail de puissance maximale : 5×3 min avec focus cross et uppercut à intensité maximale' },
        { name: 'Esquives et contre-attaques', detail: 'Slip/roll en réponse aux jabs du partenaire + contre 1-2 immédiat — 6×2 min' },
        { name: 'Cardio endurance 40 min', detail: 'Corde 15 min + shadow boxing 15 min + sac 10 min — intensité modérée continue' },
      ],
    },
    {
      week: 'Semaine 7–8',
      theme: 'Sparring & Consolidation',
      sessions: [
        { name: 'Sparring complet 4×3 min', detail: 'Application tactique complète — tous les coups et esquives appris en situation réelle' },
        { name: 'Affûtage technique 45 min', detail: 'Retour aux fondamentaux : garde, jab, déplacements — affiner la précision et la fluidité' },
        { name: 'Bilan performance', detail: 'Test corde à sauter max 3 min + test frappe puissance sur sac avec capteur + évaluation technique' },
        { name: 'Récupération active', detail: 'Yoga 30 min + étirements profonds épaules et poignets + auto-massage bras' },
      ],
    },
  ],
  faq: [
    { q: 'La boxe est-elle dangereuse pour les débutants ?', a: 'L\'entraînement boxe fitness (sac, shadow, mitaines) est très sûr et sans contact. Le sparring nécessite un équipement complet et un entraîneur compétent. La boxe développe la self-défense et la confiance en soi.' },
    { q: 'Combien de temps pour apprendre les bases ?', a: 'En 4 semaines de pratique régulière (3 séances/sem), tu maîtrises la garde, le jab, le cross et les déplacements de base. Les combinaisons et la défense nécessitent 3–6 mois.' },
    { q: 'La boxe fait-elle perdre du poids efficacement ?', a: 'Oui — une séance de boxe de 45 min brûle entre 500 et 800 kcal selon l\'intensité. C\'est l\'un des sports les plus efficaces pour la dépense calorique totale grâce à l\'implication du corps entier.' },
    { q: 'Faut-il un partenaire pour s\'entraîner à la boxe ?', a: 'Non — sac de frappe, shadow boxing et corde à sauter permettent un entraînement complet en solo. Le partenaire est un plus (mitaines, sparring) mais pas une nécessité, surtout au début.' },
  ],
}

/* ── Stretching ────────────────────────────────────────────────── */
const stretchingContent: DisciplineContent = {
  tagline: 'Libère ton corps, récupère mieux et bougez sans douleur.',
  heroStat: '3 200+ pratiquants actifs',
  guide: {
    technique: {
      emoji: '🤸',
      title: 'Technique d\'étirement',
      items: [
        'Étirement statique : tiens 30–60 secondes, respire profondément, relâche 20 % de tension à l\'expir',
        'PNF (Proprioceptive Neuromuscular Facilitation) : contraction 6 s → relâchement → approfondissement — gain de 30 % d\'amplitude',
        'Ne jamais étirer un muscle froid — attends 5 min d\'échauffement léger (marche, rotation) avant tout stretching profond',
        'Seuil de confort : sensation de tension tolérable, jamais de douleur aiguë — la douleur déclenche le réflexe myotatique',
        'Étirement dynamique avant l\'effort, étirement statique après — ne pas confondre les deux dans ta routine',
      ],
    },
    equipment: {
      emoji: '🛒',
      title: 'Matériel recommandé',
      items: [
        'Tapis de sol épais (6–8 mm) pour le confort articulaire des genoux et des hanches',
        'Sangle de stretching (ou ceinture) pour les étirements des ischio-jambiers et des fléchisseurs de hanche',
        'Foam roller (rouleau de massage) pour le relâchement myofascial avant les étirements',
        'Balle de lacrosse ou balle de tennis pour le massage des points trigger sur mollets et voûte plantaire',
        'Timer / application pour respecter les durées d\'étirement — ne jamais estimer à l\'oeil',
      ],
    },
    nutrition: {
      emoji: '🍊',
      title: 'Nutrition pour la souplesse',
      items: [
        'Collagène (10–15 g) + vitamine C 30–60 min avant les séances de stretching intensif pour la synthèse du collagène',
        'Hydratation optimale : les fascias et les tendons sont composés à 70 % d\'eau — bois 2L minimum par jour',
        'Magnésium (300–400 mg/j) : réduit les crampes et favorise la relaxation musculaire profonde',
        'Curcumine + poivre noir post-séance : anti-inflammatoire naturel puissant pour les douleurs de courbatures',
        'Évite le café en excès les jours de stretching intensif — la caféine augmente le tonus musculaire basal',
      ],
    },
    recovery: {
      emoji: '💆',
      title: 'Intégration & Récupération',
      items: [
        'Foam rolling 5–10 min avant les étirements libère les restrictions fasciales et amplifie les gains de mobilité',
        'Bain chaud 20 min (38–40 °C) pré-séance — la chaleur augmente l\'élasticité du collagène de 15 %',
        'Stretching du soir → meilleur sommeil : les étirements parasympathiques abaissent la fréquence cardiaque',
        'Maintiens les gains : 10 min de stretching quotidien vaut mieux qu\'une session intensive hebdomadaire',
        'Progressive overload en souplesse : augmente l\'amplitude de 5 % par semaine — la progression est linéaire si régulière',
      ],
    },
  },
  tips: [
    { icon: '🌡️', title: 'Chaud = plus souple', body: 'La température musculaire améliore l\'élasticité. Étire-toi après l\'effort ou après un bain chaud pour des gains 2× plus rapides.' },
    { icon: '📐', title: 'La respiration est l\'outil', body: 'À chaque expiration, les muscles se relâchent naturellement. Expire lentement pour "aller plus loin" dans l\'étirement sans forcer.' },
    { icon: '🔄', title: 'Mobilité ≠ Souplesse', body: 'La souplesse est passive (jusqu\'où tu peux aller). La mobilité est active (jusqu\'où tu contrôles). Travaille les deux pour une flexibilité fonctionnelle.' },
    { icon: '⏰', title: 'La constance prime', body: '10 minutes chaque jour produisent des résultats en 3 semaines. Sans régularité, les tissus conjonctifs retournent à leur longueur d\'origine en 72h.' },
  ],
  videos: [
    {
      youtubeId: 'g_tea8ZNk5A',
      title: 'Stretching full body 30 min',
      description: 'Programme d\'étirement complet du corps en 30 minutes — idéal après l\'entraînement ou le soir pour récupérer.',
      duration: '30 min',
      level: 'Tous niveaux',
      thumbnail: 'https://img.youtube.com/vi/g_tea8ZNk5A/maxresdefault.jpg',
    },
    {
      youtubeId: 'BYsfUroaCcw',
      title: 'Étirements ischio-jambiers & dos',
      description: 'Routine ciblée 25 minutes pour soulager les ischio-jambiers tendus et les douleurs lombaires — résultats dès la première séance.',
      duration: '25 min',
      level: 'Débutant',
      thumbnail: 'https://img.youtube.com/vi/BYsfUroaCcw/maxresdefault.jpg',
    },
    {
      youtubeId: 'L_xrDAtykMI',
      title: 'Mobilité des hanches — Routine complète',
      description: 'Programme mobilité des hanches en 35 minutes — ouverture, rotation interne/externe et libération du psoas.',
      duration: '35 min',
      level: 'Intermédiaire',
      thumbnail: 'https://img.youtube.com/vi/L_xrDAtykMI/maxresdefault.jpg',
    },
    {
      youtubeId: 'T5OEbqLZS5c',
      title: 'Stretching épaules & cou',
      description: 'Libère les tensions cervicales et les épaules bloquées en 20 minutes — parfait pour les personnes travaillant assis.',
      duration: '20 min',
      level: 'Débutant',
      thumbnail: 'https://img.youtube.com/vi/T5OEbqLZS5c/maxresdefault.jpg',
    },
    {
      youtubeId: 'maBhWtvsUeE',
      title: 'PNF Stretching — Techniques avancées',
      description: 'Méthode PNF expliquée et appliquée sur 6 groupes musculaires majeurs — gains de mobilité rapides et durables.',
      duration: '40 min',
      level: 'Avancé',
      thumbnail: 'https://img.youtube.com/vi/maBhWtvsUeE/maxresdefault.jpg',
    },
    {
      youtubeId: 'UItWltVZZmE',
      title: 'Foam rolling + Stretching récupération',
      description: 'Protocole complet de récupération : automassage au rouleau suivi d\'étirements ciblés pour accélérer la récupération musculaire.',
      duration: '35 min',
      level: 'Tous niveaux',
      thumbnail: 'https://img.youtube.com/vi/UItWltVZZmE/maxresdefault.jpg',
    },
  ],
  exercises: [
    { name: 'Flexion avant jambes tendues', muscles: 'Ischio-jambiers, bas du dos, mollets', sets: '3×45 s', difficulty: 'Débutant', description: 'Debout, jambes jointes et tendues, descends lentement les mains vers le sol. Fléchis légèrement les genoux si douleur dans le bas du dos. Tiens la position en respirant profondément.' },
    { name: 'Fente basse psoas (lézard)', muscles: 'Psoas, fléchisseurs de hanche, quadriceps', sets: '3×45 s/côté', difficulty: 'Débutant', description: 'En fente profonde, genou arrière au sol, bassin poussé vers l\'avant. Optionnel : lève les bras pour approfondir. Libère le psoas raccourci par la position assise prolongée.' },
    { name: 'Papillon assis', muscles: 'Adducteurs, fléchisseurs de hanche, aine', sets: '3×60 s', difficulty: 'Débutant', description: 'Assis, plantes des pieds collées, genoux vers le sol. Penche doucement le buste en avant en gardant le dos droit. Étirement fondamental pour les coureurs et cyclistes.' },
    { name: 'Pigeon (préparatoire)', muscles: 'Fessiers, rotateurs externes de hanche, psoas', sets: '2 min/côté', difficulty: 'Intermédiaire', description: 'En quadrupédie, avance un genou entre les mains, étends la jambe arrière. Incline progressivement le buste vers l\'avant. L\'un des étirements de hanche les plus efficaces qui existe.' },
    { name: 'Étirement pectoral à la porte', muscles: 'Pectoraux, biceps, coiffe des rotateurs', sets: '3×30 s/côté', difficulty: 'Débutant', description: 'Bras à 90° contre le montant d\'une porte, fais un pas en avant. Ressens l\'étirement de toute la face antérieure de l\'épaule. Contre-balance le volume en développé couché.' },
    { name: 'Cobra (Bhujangasana)', muscles: 'Abdominaux, fléchisseurs de hanche, pectoraux', sets: '3×30 s', difficulty: 'Débutant', description: 'Allongé face au sol, mains sous les épaules, pousse le buste vers le haut en gardant le bassin au sol. Étire toute la face antérieure du corps et renforce les érecteurs du rachis.' },
    { name: 'Rotation thoracique à genoux', muscles: 'Muscles paravertébraux thoraciques, obliques', sets: '3×10/côté', difficulty: 'Intermédiaire', description: 'En quadrupédie, main derrière la tête, ouvre le coude vers le plafond en pivotant le buste. Améliore la mobilité thoracique essentielle pour la course, la natation et la boxe.' },
    { name: 'Étirement du mollet au mur', muscles: 'Gastrocnémiens, soléaire, tendon d\'Achille', sets: '3×45 s/côté', difficulty: 'Débutant', description: 'Mains au mur, jambe arrière tendue, talon ancré au sol. Variante genou fléchi pour cibler le soléaire. Incontournable pour les coureurs et pratiquants de sports de raquette.' },
    { name: 'Lacet (figure 4)', muscles: 'Fessiers, pyramidal, rotateurs profonds de hanche', sets: '2 min/côté', difficulty: 'Tous niveaux', description: 'Assis sur le dos, croise la cheville sur le genou opposé, tire la cuisse vers la poitrine. Excellent pour soulager le syndrome du piriforme et les sciatiques d\'origine fessière.' },
  ],
  program: [
    {
      week: 'Semaine 1–2',
      theme: 'Découverte — Étirements essentiels',
      sessions: [
        { name: 'Full body stretching 30 min', detail: 'Ischio-jambiers, psoas, pectoraux, mollets, fessiers — 40 s par posture' },
        { name: 'Mobilité matinale 15 min', detail: 'Rotations articulaires dynamiques (cou, épaules, hanches, chevilles) + 3 postures clés' },
        { name: 'Foam rolling récupération', detail: 'Quadriceps, IT band, dos thoracique, mollets — 60 s par zone' },
      ],
    },
    {
      week: 'Semaine 3–4',
      theme: 'Ciblé — Zones prioritaires',
      sessions: [
        { name: 'Hanches & bas du dos 35 min', detail: 'Pigeon, fente basse, papillon, torsion assise — 60–90 s par posture' },
        { name: 'Chaîne postérieure 30 min', detail: 'Flexion avant, mollets, ischio-jambiers debout et allongé, lacet' },
        { name: 'Épaules & thorax 25 min', detail: 'Ouverture pectorale, étirement biceps, rotation thoracique, cobra' },
        { name: 'Relaxation profonde 20 min', detail: 'Yoga restauratif : postures soutenues avec bolster — relâchement total' },
      ],
    },
    {
      week: 'Semaine 5–6',
      theme: 'PNF & Gains d\'amplitude',
      sessions: [
        { name: 'PNF ischio-jambiers 30 min', detail: 'Contraction 6 s — relâchement — approfondissement × 4 cycles par jambe' },
        { name: 'PNF hanches & adducteurs', detail: 'Protocole PNF sur papillon, pigeon et flexion latérale — 3 cycles par zone' },
        { name: 'Stretching actif-passif 40 min', detail: 'Alternance contraction concentrique et étirement passif profond sur les grands groupes' },
      ],
    },
    {
      week: 'Semaine 7–8',
      theme: 'Intégration & Autonomie',
      sessions: [
        { name: 'Séquence personnalisée 40 min', detail: 'Construis ta routine avec les étirements les plus bénéfiques identifiés sur 6 semaines' },
        { name: 'Test d\'amplitude bilan', detail: 'Distance doigts-sol, rotation d\'épaule, flexion latérale, test Thomas pour psoas' },
        { name: 'Stretching sport-spécifique', detail: 'Adapte ta routine à ton sport principal — running, musculation, boxe ou yoga' },
        { name: 'Programme d\'entretien 10 min/j', detail: 'Mini-routine quotidienne des 5 zones prioritaires pour maintenir les acquis' },
      ],
    },
  ],
  faq: [
    { q: 'Quand faut-il s\'étirer : avant ou après l\'entraînement ?', a: 'Avant : privilégie les étirements dynamiques (balancés, rotations) pour préparer les articulations. Après : les étirements statiques (30–60 s tenus) pour récupérer et augmenter la souplesse à froid musculaire.' },
    { q: 'Combien de temps avant de voir une amélioration de la souplesse ?', a: 'Avec 3–4 séances par semaine de 20–30 min, les premiers gains mesurables apparaissent en 3–4 semaines. Une souplesse significative se construit sur 3–6 mois de pratique régulière.' },
    { q: 'Est-ce que s\'étirer fait vraiment mal au début ?', a: 'Une sensation de tension intense est normale et nécessaire. La douleur aiguë ou articulaire est un signal d\'arrêt immédiat. Travaille à 70–80 % de ton amplitude maximale pour progresser en sécurité.' },
    { q: 'Le stretching peut-il réduire les douleurs chroniques ?', a: 'Oui — de nombreuses douleurs lombaires, cervicales et des hanches sont causées par des muscles raccourcis. Un programme régulier de stretching ciblé réduit significativement ces douleurs en 4–8 semaines selon les études.' },
  ],
}

/* ── Nutrition ─────────────────────────────────────────────────── */
const nutritionContent: DisciplineContent = {
  tagline: 'Mange avec intelligence — la performance commence dans l\'assiette.',
  heroStat: '4 100+ membres actifs',
  guide: {
    technique: {
      emoji: '🥗',
      title: 'Principes nutritionnels',
      items: [
        'Déficit calorique pour perdre du poids : 300–500 kcal/jour sous le TDEE — jamais sous 1 200 kcal (femmes) ou 1 500 kcal (hommes)',
        'Surplus calorique pour la prise de masse : 200–300 kcal/jour au-dessus du TDEE pour une prise lean',
        'Macronutriments sportifs : 30–35 % protéines / 40–50 % glucides / 20–25 % lipides pour la performance',
        'Index glycémique (IG) : privilégie les glucides à IG bas (quinoa, patate douce, légumineuses) pour une énergie stable',
        'Chrononutrition : glucides en priorité le matin et autour des entraînements, lipides le soir',
      ],
    },
    equipment: {
      emoji: '⚖️',
      title: 'Outils essentiels',
      items: [
        'Balance alimentaire de précision (au gramme) — indispensable pour comprendre les portions réelles',
        'Application de suivi nutritionnel (MyFitnessPal, Cronometer) pour tracker les macros et micronutriments',
        'Boîtes de préparation repas (meal prep) hermétiques pour la planification hebdomadaire',
        'Mixeur haute puissance pour les smoothies protéinés et les sauces maison nutritives',
        'Thermomètre de cuisson pour maîtriser la température et préserver les nutriments des aliments',
      ],
    },
    nutrition: {
      emoji: '🍽️',
      title: 'Planification & Répartition',
      items: [
        'Timing protéines : 20–40 g de protéines toutes les 3–4 h pour maximiser la synthèse protéique musculaire',
        'Fenêtre anabolique : repas riche en protéines et glucides dans les 60–90 min post-entraînement',
        'Repas pré-entraînement : glucides complexes + protéines légères 2–3h avant (riz + poulet + légumes)',
        '5 portions de légumes/fruits par jour minimum — vitamines, minéraux et fibres pour la santé globale',
        'Hydratation : 35 ml/kg de poids corporel par jour + 500 ml supplémentaires par heure d\'exercice',
      ],
    },
    recovery: {
      emoji: '🔄',
      title: 'Nutrition de récupération',
      items: [
        'Les 30 premières minutes post-effort sont la fenêtre de réponse maximale : glucides + protéines 4:1',
        'Caséine (protéine à digestion lente) au coucher pour alimenter la synthèse protéique nocturne',
        'Oméga-3 (2–4 g/jour EPA+DHA) : réduisent l\'inflammation musculaire et accélèrent la récupération',
        'Tart cherry ou jus de betterave post-effort intense : anti-inflammatoires naturels validés scientifiquement',
        'Alcool post-effort : réduit la synthèse protéique de 37 % — à éviter dans les 6h qui suivent une séance intensive',
      ],
    },
  },
  tips: [
    { icon: '🍳', title: 'Meal prep = réussite', body: 'Prépare tes repas du dimanche pour la semaine. Les études montrent que les personnes qui planifient leur alimentation atteignent leurs objectifs 2,5× plus souvent que celles qui improvisent.' },
    { icon: '🥦', title: 'La règle de l\'assiette', body: 'Chaque repas principal : 1/2 assiette légumes, 1/4 protéines, 1/4 glucides complexes. Simple, efficace, sans calculer les calories à chaque fois.' },
    { icon: '💧', title: 'La soif = déjà déshydraté', body: 'Quand tu ressens la soif, tu as déjà perdu 1–2 % de ton poids en eau. Bois régulièrement tout au long de la journée — pas en grandes quantités sporadiques.' },
    { icon: '📊', title: 'Les calories de base d\'abord', body: 'Maîtrise d\'abord la quantité (calories totales), puis optimise la qualité (macros), enfin le timing (chrononutrition). Ne saute pas les étapes.' },
  ],
  videos: [
    {
      youtubeId: 'EXuaTsr43eQ',
      title: 'Nutrition sportive — Bases essentielles',
      description: 'Comprends les macronutriments, le TDEE, les protéines et les glucides pour optimiser ta nutrition sportive dès aujourd\'hui.',
      duration: '22 min',
      level: 'Débutant',
      thumbnail: 'https://img.youtube.com/vi/EXuaTsr43eQ/maxresdefault.jpg',
    },
    {
      youtubeId: '3Xw69xfbIuE',
      title: 'Protéines — Tout ce que tu dois savoir',
      description: 'Sources, quantités, timing et suppléments protéinés — guide complet et scientifiquement validé sur les protéines pour le sport.',
      duration: '28 min',
      level: 'Tous niveaux',
      thumbnail: 'https://img.youtube.com/vi/3Xw69xfbIuE/maxresdefault.jpg',
    },
    {
      youtubeId: 'ZualDnEH00M',
      title: 'Meal prep — Planifier ses repas sportifs',
      description: 'Comment préparer une semaine de repas équilibrés en 2 heures le dimanche — méthode complète avec recettes pour sportifs.',
      duration: '35 min',
      level: 'Débutant',
      thumbnail: 'https://img.youtube.com/vi/ZualDnEH00M/maxresdefault.jpg',
    },
    {
      youtubeId: 'qPhJJOm3Lfc',
      title: 'Perte de poids — La science derrière',
      description: 'Comprends le déficit calorique, le métabolisme de base et les stratégies nutritionnelles qui fonctionnent vraiment pour perdre du gras.',
      duration: '30 min',
      level: 'Intermédiaire',
      thumbnail: 'https://img.youtube.com/vi/qPhJJOm3Lfc/maxresdefault.jpg',
    },
    {
      youtubeId: 'i3AyCq2o5pk',
      title: 'Prise de masse — Nutrition optimisée',
      description: 'Le guide nutritionnel complet de la prise de masse : surplus calorique, macros, timing et suppléments pour un bulk clean.',
      duration: '32 min',
      level: 'Intermédiaire',
      thumbnail: 'https://img.youtube.com/vi/i3AyCq2o5pk/maxresdefault.jpg',
    },
    {
      youtubeId: 'A_GIpkGMIAU',
      title: 'Suppléments — Lesquels fonctionnent vraiment ?',
      description: 'Analyse objective des compléments alimentaires les plus populaires — créatine, whey, BCAA, oméga-3 : la vérité scientifique.',
      duration: '38 min',
      level: 'Avancé',
      thumbnail: 'https://img.youtube.com/vi/A_GIpkGMIAU/maxresdefault.jpg',
    },
  ],
  exercises: [
    { name: 'Planification hebdomadaire des repas', muscles: 'Habitude, organisation nutritionnelle', sets: '1× /semaine — 20 min', difficulty: 'Débutant', description: 'Chaque dimanche, planifie tes 5 repas principaux pour la semaine. Calcule les macros cibles, liste les ingrédients, prépare les protéines et céréales à l\'avance. Fondement de la réussite nutritionnelle.' },
    { name: 'Calcul de son TDEE', muscles: 'Connaissance métabolique', sets: '1× au départ puis chaque mois', difficulty: 'Débutant', description: 'Calcule ton Total Daily Energy Expenditure (TDEE) avec la formule Mifflin-St Jeor × facteur d\'activité. Ajuste de ±300 kcal selon l\'objectif (perte ou prise). Recalcule à chaque -5 kg.' },
    { name: 'Tracking macros 7 jours', muscles: 'Conscience alimentaire', sets: '7 jours consécutifs', difficulty: 'Débutant', description: 'Note chaque aliment dans une app (Cronometer recommandé) pendant 7 jours consécutifs sans changer tes habitudes. Révèle les écarts réels entre ce que tu penses manger et ce que tu manges réellement.' },
    { name: 'Batch cooking protéines', muscles: 'Préparation culinaire sportive', sets: '1× /semaine — 45 min', difficulty: 'Débutant', description: 'Cuis 600–800 g de protéines maigres (poulet, œufs durs, thon, lentilles) en une session. Répartis en portions de 150–200 g. Garantit tes apports protéiques sans effort en semaine.' },
    { name: 'Audit de l\'assiette', muscles: 'Équilibre nutritionnel', sets: 'À chaque repas', difficulty: 'Tous niveaux', description: 'Avant chaque repas, vérifie visuellement : 50 % légumes, 25 % protéines, 25 % glucides complexes dans l\'assiette. Méthode simple qui remplace le comptage de calories pour la plupart des objectifs.' },
    { name: 'Hydratation structurée', muscles: 'Métabolisme, performance physique', sets: '8 verres répartis sur la journée', difficulty: 'Débutant', description: 'Planifie tes apports hydriques : verre au réveil, avant chaque repas, pendant et après l\'exercice. Utilise une bouteille graduée de 1,5L comme référence. La déshydratation de 2 % réduit la performance de 20 %.' },
    { name: 'Fenêtre anabolique post-effort', muscles: 'Récupération, synthèse protéique', sets: 'Après chaque entraînement', difficulty: 'Intermédiaire', description: 'Dans les 30–60 min suivant chaque séance, consomme 30–40 g de protéines + 50–80 g de glucides (riz, banane, pain complet). Maximise la récupération et l\'adaptation musculaire.' },
    { name: 'Chrononutrition — Test 4 semaines', muscles: 'Synchronisation circadienne', sets: '4 semaines', difficulty: 'Intermédiaire', description: 'Semaine 1 : repas normaux (référence). Semaines 2–4 : glucides concentrés sur petit-déj et déjeuner, protéines/lipides le soir. Compare les niveaux d\'énergie, la récupération et la composition corporelle.' },
    { name: 'Supplément créatine — Protocole', muscles: 'Force, récupération, performance', sets: '3–5 g/jour en continu', difficulty: 'Intermédiaire', description: 'Prends 3–5 g de créatine monohydrate par jour à n\'importe quelle heure (la saturation prend 4 semaines). Pas de phase de charge nécessaire. Le supplément le plus validé scientifiquement pour la performance sportive.' },
  ],
  program: [
    {
      week: 'Semaine 1–2',
      theme: 'Diagnostic — Connais ton point de départ',
      sessions: [
        { name: 'Calcul TDEE & macros cibles', detail: 'Formule Mifflin-St Jeor + facteur activité → déficit ou surplus de 300 kcal selon objectif' },
        { name: 'Tracking alimentaire 7 j', detail: 'Note tout sans changer tes habitudes — révèle les vrais déficits (protéines en général)' },
        { name: 'Audit du frigo et placard', detail: 'Identifie les aliments ultra-transformés à remplacer progressivement par des alternatives saines' },
      ],
    },
    {
      week: 'Semaine 3–4',
      theme: 'Structure — Mettre en place les bases',
      sessions: [
        { name: 'Premier meal prep complet', detail: 'Prépare 5 déjeuners + 5 dîners le dimanche — riz, légumes rôtis, protéines variées' },
        { name: 'Optimisation petit-déjeuner', detail: 'Transition vers un petit-déjeuner protéiné 25–30 g : œufs + flocons + fruits + noix' },
        { name: 'Hydratation structurée', detail: 'Bouteille 1,5L à finir avant 18h + 500 ml autour de chaque entraînement' },
        { name: 'Bilan macros semaine 4', detail: 'Vérifie l\'atteinte des objectifs protein/carbs/fats sur 7 jours avec l\'app — ajuste si besoin' },
      ],
    },
    {
      week: 'Semaine 5–6',
      theme: 'Optimisation — Timing et qualité',
      sessions: [
        { name: 'Chrononutrition appliquée', detail: 'Glucides le matin et péri-entraînement, lipides au dîner — teste sur 2 semaines' },
        { name: 'Fenêtre anabolique systématique', detail: 'Shaker whey + banane ou riz + thon dans les 30 min post-effort à chaque séance' },
        { name: 'Intégration suppléments', detail: 'Créatine 5 g/j + oméga-3 2 g/j + vitamine D3 2 000 UI/j — protocole de base éprouvé' },
      ],
    },
    {
      week: 'Semaine 7–8',
      theme: 'Autonomie & Pérennité',
      sessions: [
        { name: 'Flexibilité nutritionnelle', detail: 'Applique la règle 80/20 — 80 % nutrition rigoureuse, 20 % repas libres sans culpabilité' },
        { name: 'Recettes hautes protéines maison', detail: 'Maîtrise 5 recettes rapides (< 15 min) qui atteignent 40 g de protéines/portion' },
        { name: 'Bilan composition corporelle', detail: 'Tour de taille, poids, photos comparatives J1/J56 — évalue l\'impact sur la composition' },
        { name: 'Plan de maintenance personnalisé', detail: 'Adapte les macros cibles à ta nouvelle composition — recalcul TDEE post-progression' },
      ],
    },
  ],
  faq: [
    { q: 'Faut-il compter les calories pour progresser ?', a: 'Pas nécessairement au quotidien, mais le faire au moins une fois pendant 2–4 semaines est très révélateur. Ça calibre l\'intuition alimentaire de façon permanente. Ensuite, la méthode de l\'assiette (50/25/25) suffit pour la majorité des objectifs.' },
    { q: 'Les compléments alimentaires sont-ils indispensables ?', a: 'Non — l\'alimentation doit couvrir 90 % des besoins. La whey est pratique (pas magique), la créatine améliore mesurément la performance, les oméga-3 et la vitamine D sont pertinents si les apports alimentaires sont insuffisants. Tout le reste est marketing.' },
    { q: 'Peut-on perdre du gras et prendre du muscle en même temps ?', a: 'Oui, en débutant ou après une longue pause (recomposition corporelle). Nécessite un apport protéique élevé (2–2,2 g/kg), un entraînement en résistance et un déficit calorique léger (−200 kcal max). Les résultats sont plus lents mais durables.' },
    { q: 'Combien de repas par jour faut-il manger ?', a: 'La fréquence des repas a peu d\'impact sur le métabolisme. Ce qui compte : atteindre ses cibles caloriques et protéiques totales sur la journée. 3 repas ou 5 repas : choisis celui qui s\'intègre le mieux à ton mode de vie et t\'aide à respecter tes objectifs.' },
  ],
}

export const DISCIPLINE_CONTENT: Record<string, DisciplineContent> = {
  'running-cardio': runningContent,
  musculation: musculationContent,
  hiit: hiitContent,
  cyclisme: cyclismeContent,
  natation: natationContent,
  crossfit: crossfitContent,
  yoga: yogaContent,
  boxing: boxingContent,
  stretching: stretchingContent,
  nutrition: nutritionContent,
}
