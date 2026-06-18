// Contenu réel des guides PDF livrés après achat.
// Chaque guide est généré dynamiquement en PDF (voir guide-pdf.ts) à partir de ces blocs.
// Objectif : au moins 10 pages structurées par guide.

import { priseDeMasse12s } from '@/lib/programs/prise-de-masse-12s'
import { nutritionSeche } from '@/lib/programs/nutrition-seche'
import { hiit6s } from '@/lib/programs/hiit-6s'

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
const hiit: Guide = hiit6s

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
