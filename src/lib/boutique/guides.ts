// Contenu réel des guides PDF livrés après achat.
// Chaque guide est généré dynamiquement en PDF (voir guide-pdf.ts) à partir de ces blocs.
// Objectif : au moins 10 pages structurées par guide.

import { priseDeMasse12s } from '@/lib/programs/prise-de-masse-12s'
import { nutritionSeche } from '@/lib/programs/nutrition-seche'

export type GuideBlock =
  | { type: 'h1'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'note'; text: string }
  // Composants premium (programmes) :
  | { type: 'meta'; items: { label: string; value: string }[] }                 // cartes info (Niveau, Durée, Matériel…)
  | { type: 'table'; headers: string[]; rows: string[][] }                       // planning semaine / jour
  | { type: 'exercise'; name: string; muscles: string; level: string; technique: string; mistakes: string; video?: string } // fiche exercice (+ QR vidéo)
  | { type: 'checklist'; items: string[] }                                       // checklist hebdo (cases à cocher)
  | { type: 'tracker'; columns: string[]; rows: number }                         // grille de suivi vide (poids, mensurations, perfs)
  | { type: 'photo'; src: string; caption?: string }                             // bandeau photo d'ambiance (fichier dans public/program-assets)
  | { type: 'chapter'; title: string; src?: string; intro?: string }             // ouverture de chapitre (nouvelle page A4) : image + titre intégrés

export interface Guide {
  id: string
  title: string
  subtitle: string
  author: string
  level?: string         // affiché en badge sur la couverture
  duration?: string      // affiché en badge sur la couverture
  coverImage?: string    // photo pleine page de couverture (fichier dans public/program-assets)
  blocks: GuideBlock[]
}

// ──────────────────────────────────────────────────────────────────────
// d1 — Programme Prise de Masse 12 semaines
// ──────────────────────────────────────────────────────────────────────
const masse: Guide = priseDeMasse12s

// ──────────────────────────────────────────────────────────────────────
// d2 — Plan Nutrition Sèche 8 semaines
// ──────────────────────────────────────────────────────────────────────
const seche: Guide = nutritionSeche

// ──────────────────────────────────────────────────────────────────────
// d3 — Programme HIIT 6 semaines
// ──────────────────────────────────────────────────────────────────────
const hiit: Guide = {
  id: 'd3',
  title: 'Programme HIIT Brûle-Graisses',
  subtitle: '6 semaines, 100 % au poids du corps, sans matériel',
  author: 'XENOTIF Coach — Certifié CrossFit Level 2',
  blocks: [
    { type: 'h1', text: 'Bienvenue dans ton programme HIIT' },
    { type: 'p', text: `En 6 semaines, ce programme va transformer ta condition physique et faire fondre la graisse — sans salle, sans matériel, où que tu sois. Tout se fait au poids du corps, en séances courtes mais intenses de 20 à 30 minutes.` },
    { type: 'p', text: `Tu y trouveras les 4 séances de chaque semaine détaillées, la technique de chaque mouvement, les protocoles d'échauffement et de récupération, et les conseils nutrition pour accélérer tes résultats.` },
    { type: 'note', text: `Intensité = clé. Sur les phases d'effort, tu dois être incapable de tenir une conversation. Sur la récupération, tu reprends ton souffle activement (marche sur place, respiration profonde).` },

    { type: 'h1', text: 'Pourquoi le HIIT fonctionne' },
    { type: 'p', text: `Le HIIT alterne efforts intenses et récupérations courtes. Résultat : tu brûles des calories pendant ET après la séance grâce à l'effet EPOC (surconsommation d'oxygène post-effort).` },
    { type: 'list', items: [
      `Une séance de 20 min peut brûler autant qu'un footing de 45 min.`,
      `Le corps continue de brûler des calories jusqu'à 24 h après l'effort.`,
      `Le HIIT préserve le muscle mieux que le cardio long et monotone.`,
      `Aucun matériel : tu peux t'entraîner partout, n'importe quand.`,
    ] },

    { type: 'h1', text: 'Comprendre l\'intensité' },
    { type: 'p', text: `Pour que le HIIT marche, il faut atteindre une vraie haute intensité. Voici comment la repérer sans capteur.` },
    { type: 'list', items: [
      `Test de la parole : à fond, tu ne peux dire que 2 ou 3 mots à la fois.`,
      `Ressenti sur 10 : les phases d'effort doivent être à 8-9/10.`,
      `Si tu peux chanter, ce n'est pas du HIIT — pousse davantage.`,
      `Si tu es au bord de la nausée, c'est trop : ralentis légèrement.`,
    ] },

    { type: 'h1', text: 'Les formats utilisés' },
    { type: 'list', items: [
      `Tabata : 20 s d'effort max / 10 s de repos, 8 tours (4 min par exercice).`,
      `EMOM : « Every Minute On the Minute » — un nombre de répétitions à faire au début de chaque minute, le reste est repos.`,
      `AMRAP : « As Many Rounds As Possible » — maximum de tours sur un temps donné.`,
      `30/30 : 30 s d'effort / 30 s de repos, idéal pour débuter.`,
    ] },

    { type: 'h1', text: 'Échauffement & retour au calme' },
    { type: 'h2', text: 'Échauffement (5 min, avant chaque séance)' },
    { type: 'list', items: [
      `30 s de jumping jacks`,
      `30 s de rotations des bras + cercles de hanches`,
      `30 s de montées de genoux lentes`,
      `30 s de squats au poids du corps`,
      `Répète le circuit 2 fois`,
    ] },
    { type: 'h2', text: 'Retour au calme (5 min, après chaque séance)' },
    { type: 'list', items: [
      `1 à 2 min de marche pour faire redescendre le cœur.`,
      `Étirement des quadriceps, ischios, mollets et épaules (20 s chacun).`,
      `Respiration profonde : inspire 4 s, expire 6 s, ×10.`,
    ] },

    { type: 'h1', text: 'Technique des 8 mouvements de base' },
    { type: 'h2', text: 'Burpees & Squats sautés' },
    { type: 'list', items: [
      `Burpee : descends en squat, mains au sol, saute en planche, pompe, ramène les pieds, saute. Garde le dos gainé.`,
      `Squat sauté : descends en squat contrôlé, explose vers le haut, atterris en fléchissant les genoux en douceur.`,
    ] },
    { type: 'h2', text: 'Mountain climbers & Montées de genoux' },
    { type: 'list', items: [
      `Mountain climbers : en planche, ramène les genoux vers la poitrine en alternance, bassin stable.`,
      `Montées de genoux : course sur place, genoux à hauteur des hanches, bras en rythme.`,
    ] },
    { type: 'h2', text: 'Pompes, Fentes sautées, Gainage, Jumping jacks' },
    { type: 'list', items: [
      `Pompes : corps gainé en planche, descends coudes à 45°, pousse. Sur les genoux si besoin.`,
      `Fentes sautées : alterne les jambes en sautant, genou avant dans l'axe du pied.`,
      `Gainage : avant-bras au sol, corps droit, abdos et fessiers contractés.`,
      `Jumping jacks : écarte bras et jambes en sautant — parfait pour échauffer et récupérer.`,
    ] },
    { type: 'note', text: `Mieux vaut 8 burpees parfaits que 15 brouillons. Adapte le nombre de répétitions, jamais la qualité d'exécution.` },

    { type: 'h1', text: 'Semaines 1 & 2 — Adaptation (format 30/30)' },
    { type: 'p', text: `4 séances par semaine. Pour chaque exercice : 30 s d'effort / 30 s de repos. 3 tours du circuit, 1 min de récupération entre les tours. Objectif : apprendre les mouvements proprement.` },
    { type: 'list', items: [
      `Séance A : jumping jacks → squats → pompes → mountain climbers → gainage.`,
      `Séance B : montées de genoux → fentes alternées → pompes genoux → planche → squats.`,
      `Séances C et D : reprends A et B en cherchant une exécution plus nette.`,
      `Durée totale : environ 20 min, échauffement compris.`,
    ] },

    { type: 'h1', text: 'Semaines 3 & 4 — Intensification (EMOM + AMRAP)' },
    { type: 'p', text: `On augmente la densité de travail. 4 séances par semaine, 25 min. Note tes scores pour mesurer ta progression.` },
    { type: 'list', items: [
      `Séance A — EMOM 16 min : min 1 : 12 squats sautés / min 2 : 10 burpees / min 3 : 14 montées de genoux / min 4 : 30 s gainage. Répète 4 fois.`,
      `Séance B — AMRAP 12 min : 8 burpees + 12 fentes sautées + 16 mountain climbers, max de tours.`,
      `Séance C — EMOM 15 min : alterne pompes, squats sautés, mountain climbers.`,
      `Séance D — AMRAP 10 min : 10 squats + 10 pompes + 10 jumping jacks.`,
    ] },

    { type: 'h1', text: 'Semaines 5 & 6 — Performance (Tabata)' },
    { type: 'p', text: `Le pic du programme. 4 séances de 25 à 30 min, format Tabata sur les mouvements explosifs. 2 min de récupération entre chaque bloc.` },
    { type: 'list', items: [
      `Bloc 1 — Tabata burpees : 20 s max / 10 s repos × 8.`,
      `Bloc 2 — Tabata squats sautés : 20 s / 10 s × 8.`,
      `Bloc 3 — Tabata mountain climbers : 20 s / 10 s × 8.`,
      `Bloc 4 — Tabata gainage dynamique : 20 s / 10 s × 8.`,
      `Les séances suivantes : varie l'ordre des blocs et vise plus de répétitions qu'au tour précédent.`,
    ] },

    { type: 'h1', text: 'Nutrition pour accélérer les résultats' },
    { type: 'list', items: [
      `Le HIIT est un accélérateur, pas un substitut à une bonne alimentation.`,
      `Mange une source de protéines + glucides dans l'heure qui suit la séance.`,
      `Crée un léger déficit calorique si ton objectif est la perte de gras.`,
      `Hydrate-toi avant, pendant et après chaque séance.`,
    ] },

    { type: 'h1', text: 'Adapter le programme & sécurité' },
    { type: 'list', items: [
      `Débutant : réduis le nombre de tours et allonge les récupérations.`,
      `Sans impact (articulations sensibles) : remplace les sauts par des versions au sol (squats normaux, step-back au lieu des burpees sautés).`,
      `Garde au moins 1 jour de repos complet entre deux séances intenses.`,
      `Arrête immédiatement en cas de douleur articulaire vive (différente de la fatigue musculaire).`,
    ] },

    { type: 'h1', text: 'Suivi & FAQ' },
    { type: 'list', items: [
      `Note tes scores (tours, répétitions) à chaque séance pour voir ta progression.`,
      `Prends une photo toutes les 2 semaines.`,
      `Combien de fois par semaine ? 4 séances, avec au moins 1 jour de repos entre les plus dures.`,
      `Et après 6 semaines ? Recommence un cycle en visant plus de répétitions, ou combine avec de la musculation.`,
    ] },
    { type: 'note', text: `Progresse à ton rythme : chaque séance terminée est une victoire. Dans 6 semaines, tu seras plus rapide, plus endurant et plus affûté. Au travail.` },
  ],
}

// ──────────────────────────────────────────────────────────────────────
// d4 — Guide Running : du 5K au Marathon
// ──────────────────────────────────────────────────────────────────────
const running: Guide = {
  id: 'd4',
  title: 'Guide Running — Du 5K au Marathon',
  subtitle: 'Plans, allures, nutrition et préparation mentale',
  author: 'XENOTIF Coach — Entraîneur athlétisme FFA',
  blocks: [
    { type: 'h1', text: 'Bienvenue, coureur' },
    { type: 'p', text: `Que tu veuilles courir ton premier 5 km ou décrocher un marathon, ce guide t'accompagne sur tout le chemin. Il rassemble des plans pour quatre distances, la science des allures, la technique de course, la nutrition et la préparation mentale.` },
    { type: 'p', text: `Lis d'abord les chapitres sur les allures et la technique : ce sont eux qui feront la différence sur ta progression et ta prévention des blessures.` },
    { type: 'note', text: `La règle des 80/20 : 80 % de tes kilomètres en endurance fondamentale lente, 20 % en intensité. C'est la base de toute progression durable.` },

    { type: 'h1', text: 'L\'équipement essentiel' },
    { type: 'list', items: [
      `Une bonne paire de chaussures adaptée à ta foulée (fais-toi conseiller en magasin spécialisé).`,
      `Des vêtements techniques respirants, adaptés à la météo.`,
      `Optionnel mais utile : une montre GPS pour suivre allure et distance.`,
      `Pour les sorties longues : une ceinture porte-bidon ou un soft flask.`,
    ] },

    { type: 'h1', text: 'Comprendre tes allures' },
    { type: 'p', text: `Progresser en course, c'est avant tout courir aux bonnes allures. Trop de coureurs vont trop vite à l'entraînement et trop lentement en course. Voici les 3 allures fondamentales.` },
    { type: 'list', items: [
      `Endurance fondamentale (EF) : allure conversationnelle, 65 à 75 % de ta FC max. 80 % de ton volume doit s'y faire.`,
      `Allure seuil : effort soutenu mais contrôlé, que tu pourrais tenir environ 1 h. Développe la résistance.`,
      `VMA (vitesse maximale aérobie) : fractionné court et rapide. Développe la cylindrée.`,
    ] },
    { type: 'h2', text: 'Trouver tes zones simplement' },
    { type: 'list', items: [
      `EF : tu peux parler en faisant des phrases complètes.`,
      `Seuil : tu ne peux dire que quelques mots à la fois.`,
      `VMA : tu es presque à fond, parler est impossible.`,
    ] },

    { type: 'h1', text: 'La foulée et la cadence' },
    { type: 'list', items: [
      `Vise une cadence de 170 à 180 pas par minute pour limiter les impacts.`,
      `Pose le pied sous ton centre de gravité, pas devant — réduit le freinage et les blessures.`,
      `Garde le buste droit, le regard loin, les épaules relâchées.`,
      `Les bras rythment la foulée : coudes à 90°, mouvement d'avant en arrière, mains détendues.`,
    ] },

    { type: 'h1', text: 'Plan 5 km — 6 semaines (débutant)' },
    { type: 'p', text: `3 séances par semaine. Objectif : courir 5 km sans s'arrêter, puis améliorer le chrono.` },
    { type: 'list', items: [
      `Semaine 1 : 1 min course / 1 min marche × 10, trois fois.`,
      `Semaine 2 : 2 min course / 1 min marche × 8.`,
      `Semaine 3 : 5 min course / 1 min marche × 4.`,
      `Semaine 4 : 10 min course / 1 min marche × 3.`,
      `Semaine 5 : 20 min de course continue en endurance fondamentale.`,
      `Semaine 6 : 1 sortie de 25 min + 1 séance de 5 × 1 min rapide + objectif 5 km le week-end.`,
    ] },

    { type: 'h1', text: 'Plan 10 km — 8 semaines' },
    { type: 'p', text: `4 séances par semaine : 2 en endurance, 1 au seuil, 1 sortie longue. Augmente le volume de 10 % maximum par semaine.` },
    { type: 'list', items: [
      `Séance endurance : 30 à 45 min faciles.`,
      `Séance seuil : 2 × 10 min à allure 10K avec 3 min de récupération.`,
      `Séance VMA : 8 à 10 × 400 m rapides avec 200 m de récupération.`,
      `Sortie longue : 50 à 70 min progressives, jusqu'à 12 km.`,
    ] },

    { type: 'h1', text: 'Plan semi-marathon — 10 semaines' },
    { type: 'list', items: [
      `Volume : 4 à 5 séances, montée progressive jusqu'à 18 km en sortie longue.`,
      `Séance clé : 3 × 2 km à allure semi, récupération 2 min.`,
      `Intègre une séance de côtes toutes les 2 semaines pour la force.`,
      `Garde une séance VMA courte pour entretenir la vitesse.`,
      `Semaines 9-10 : affûtage — réduis le volume de 40 %, garde un peu d'intensité.`,
    ] },

    { type: 'h1', text: 'Plan marathon — 12 semaines' },
    { type: 'list', items: [
      `Base : 5 séances par semaine, sortie longue progressive jusqu'à 30-32 km.`,
      `Séances spécifiques à allure marathon : 2 × 5 km, puis 3 × 5 km au fil des semaines.`,
      `Une sortie longue par semaine, en endurance, c'est le pilier du plan.`,
      `Teste impérativement ta nutrition de course sur les sorties longues.`,
      `Affûtage de 3 semaines avant le jour J : la fatigue se transforme en fraîcheur.`,
    ] },
    { type: 'note', text: `Ne teste jamais rien de nouveau le jour de la course : ni chaussures, ni alimentation, ni allure de départ. Tout doit avoir été répété à l'entraînement.` },

    { type: 'h1', text: 'Le renforcement du coureur' },
    { type: 'p', text: `Deux séances courtes par semaine suffisent à réduire les blessures et améliorer l'économie de course.` },
    { type: 'list', items: [
      `Gainage (planche, planche latérale) : 3 × 30 à 45 s.`,
      `Fentes et squats au poids du corps : 3 × 12.`,
      `Montées sur pointes (mollets) : 3 × 20.`,
      `Pont fessier : 3 × 15 pour renforcer la chaîne postérieure.`,
    ] },

    { type: 'h1', text: 'Nutrition du coureur' },
    { type: 'list', items: [
      `Avant (3 h) : repas riche en glucides, pauvre en graisses et fibres.`,
      `Pendant (au-delà de 75 min) : 30 à 60 g de glucides par heure (gels, boisson, fruits secs).`,
      `Hydratation : bois régulièrement par petites gorgées, n'attends pas la soif.`,
      `Après : glucides + protéines dans les 30 min pour recharger et réparer.`,
      `« Le mur » du marathon vient d'un manque de glucides : entraîne ton ravitaillement.`,
    ] },

    { type: 'h1', text: 'Prévention des blessures — 7 points' },
    { type: 'list', items: [
      `Augmente ton volume de 10 % maximum par semaine.`,
      `Renforce les fessiers et les mollets 2 fois par semaine.`,
      `Travaille la mobilité des chevilles et des hanches.`,
      `Alterne tes paires de chaussures et change-les tous les 700 à 900 km.`,
      `Ne néglige jamais l'échauffement avant les séances intenses.`,
      `Respecte au moins 1 jour de repos complet par semaine.`,
      `Écoute les signaux : une douleur qui persiste 3 jours impose le repos.`,
    ] },

    { type: 'h1', text: 'Le mental du compétiteur' },
    { type: 'list', items: [
      `Découpe la course en segments courts plutôt que de penser à la distance totale.`,
      `Prépare 2 ou 3 mantras à répéter quand ça devient dur.`,
      `Visualise ta course idéale la veille, du départ à l'arrivée.`,
      `Accepte l'inconfort : il est temporaire et fait partie du jeu.`,
      `Fixe-toi 3 objectifs : un ambitieux, un réaliste, un « quoi qu'il arrive ».`,
    ] },

    { type: 'h1', text: 'FAQ & jour de course' },
    { type: 'p', text: `À quelle fréquence courir ? 3 séances pour débuter, 4 à 5 pour les distances longues. La régularité prime sur le volume.` },
    { type: 'p', text: `Faut-il s'étirer avant ? Plutôt un échauffement progressif (marche puis trottinement). Garde les étirements longs pour après ou les jours de repos.` },
    { type: 'p', text: `Comment gérer le départ ? Pars plus lentement que ton allure cible : on ne gagne pas une course au premier kilomètre, mais on peut la perdre.` },
    { type: 'note', text: `Bonne course ! Le plus dur est déjà fait : tu t'es engagé. Suis le plan, respecte tes allures, et fais confiance à ta préparation. Rendez-vous sur la ligne d'arrivée.` },
  ],
}

export const GUIDES: Record<string, Guide> = {
  d1: masse,
  d2: seche,
  d3: hiit,
  d4: running,
}

export function getGuide(productId: string): Guide | undefined {
  return GUIDES[productId]
}
