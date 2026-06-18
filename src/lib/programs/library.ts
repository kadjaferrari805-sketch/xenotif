import type { Guide } from '@/lib/boutique/guides'

// Bibliothèque de programmes fitness premium XENOTIF® (FR).
// Chaque programme est un `Guide` rendu en PDF premium via guide-pdf.ts
// (couverture, cartes info, tableaux planning, fiches exercices, suivi, checklist).
// Versions EN/DE : library.en.ts / library.de.ts.

const perteDePoids30j: Guide = {
  id: 'perte-de-poids-30j',
  title: 'Programme Perte de Poids',
  subtitle: '30 jours pour enclencher une perte de gras durable',
  author: 'XENOTIF Coach — Préparation physique & nutrition certifiées',
  level: 'Débutant → Intermédiaire',
  duration: '30 jours · 5 séances/sem',
  blocks: [
    { type: 'h1', text: 'Bienvenue dans ton défi 30 jours' },
    { type: 'p', text: `Pendant 30 jours, tu vas enclencher une perte de gras réelle et durable — sans régime extrême ni séances interminables. La méthode repose sur trois leviers simples : un léger déficit calorique, des séances courtes mais efficaces, et de la régularité. Suis le plan, coche ta checklist chaque semaine, et laisse les résultats arriver.` },
    { type: 'meta', items: [
      { label: 'Objectif', value: 'Perdre 2 à 4 kg de gras' },
      { label: 'Niveau', value: 'Débutant à intermédiaire' },
      { label: 'Durée', value: '30 jours (4 semaines)' },
      { label: 'Fréquence', value: '5 séances par semaine' },
      { label: 'Matériel', value: 'Tapis + 1 paire d’haltères (option)' },
      { label: 'Lieu', value: 'Maison ou salle' },
    ] },
    { type: 'h2', text: 'Ce que tu vas obtenir' },
    { type: 'list', items: [
      `Une perte de gras visible (2 à 4 kg selon ton point de départ).`,
      `Un ventre plus plat et une meilleure définition.`,
      `Plus d’énergie au quotidien et un meilleur sommeil.`,
      `Des habitudes alimentaires saines que tu garderas après les 30 jours.`,
    ] },
    { type: 'note', text: `Règle d’or : la perte de gras se joue à 70 % dans l’assiette. L’entraînement accélère le résultat, mais c’est la régularité alimentaire qui fait la différence.` },

    { type: 'h1', text: 'Comment ça marche' },
    { type: 'list', items: [
      `Déficit calorique modéré : mange 300 à 500 kcal sous ta maintenance, pas plus.`,
      `Bouge plus au quotidien (NEAT) : vise 8 000 à 10 000 pas par jour.`,
      `Séries × répétitions : « 3 × 12 » = 3 séries de 12 répétitions.`,
      `Repos : 30 à 60 secondes entre les séries pour garder l’intensité.`,
      `RPE (intensité ressentie /10) : vise 7 à 8. Il doit te rester 2 répétitions en réserve.`,
    ] },

    { type: 'h1', text: 'Nutrition : la clé de la perte de gras' },
    { type: 'p', text: `Pas besoin de compter chaque calorie au gramme près. Applique ces repères simples et la balance avancera dans le bon sens.` },
    { type: 'meta', items: [
      { label: 'Déficit visé', value: '300 à 500 kcal / jour' },
      { label: 'Protéines', value: '1,8 à 2,2 g par kg de poids' },
      { label: 'Hydratation', value: '2 à 2,5 L d’eau par jour' },
      { label: 'Sommeil', value: '7 à 8 h (clé de la perte de gras)' },
    ] },
    { type: 'list', items: [
      `Une source de protéines à chaque repas (œufs, poulet, poisson, tofu, légumineuses).`,
      `La moitié de l’assiette en légumes, à chaque repas.`,
      `Réduis le sucre liquide (sodas, jus, alcool) — la victoire la plus rapide.`,
      `Garde 1 repas plaisir par semaine : la frustration fait craquer.`,
    ] },
    { type: 'note', text: `Astuce : prépare tes repas à l’avance (batch cooking) 2 fois par semaine. Tu manges mieux quand c’est déjà prêt.` },

    { type: 'h1', text: 'Récupération' },
    { type: 'list', items: [
      `Dors 7 à 8 h : le manque de sommeil augmente la faim et freine la perte de gras.`,
      `Une courbature légère est normale ; une douleur articulaire ne l’est pas — adapte.`,
      `Garde au moins 1 vraie journée de repos par semaine (marche douce autorisée).`,
    ] },

    { type: 'h1', text: 'Ton planning sur 4 semaines' },
    { type: 'p', text: `L’intensité monte progressivement chaque semaine. Ne saute pas d’étape : la progression est ce qui rend le programme efficace et sûr.` },
    { type: 'table', headers: ['Semaine', 'Focus', 'Séances', 'Cardio'], rows: [
      ['Semaine 1', 'Adaptation & technique', '5 × 25 min', '2 marches rapides'],
      ['Semaine 2', 'Volume — full body', '5 × 30 min', '2 HIIT légers'],
      ['Semaine 3', 'Intensité — circuits', '5 × 35 min', '3 HIIT'],
      ['Semaine 4', 'Pic & finition', '5 × 35 min', '3 HIIT + 1 sortie longue'],
    ] },

    { type: 'h1', text: 'Semaine type (planning quotidien)' },
    { type: 'table', headers: ['Jour', 'Séance', 'Durée', 'Intensité'], rows: [
      ['Lundi', 'Full body — bas du corps', '30 min', 'Modérée'],
      ['Mardi', 'HIIT brûle-graisses', '20 min', 'Élevée'],
      ['Mercredi', 'Full body — haut du corps', '30 min', 'Modérée'],
      ['Jeudi', 'Marche rapide / repos actif', '30 min', 'Faible'],
      ['Vendredi', 'Circuit full body', '35 min', 'Élevée'],
      ['Samedi', 'Cardio + core', '25 min', 'Modérée'],
      ['Dimanche', 'Repos', '—', 'Récupération'],
    ] },

    { type: 'h1', text: 'Les exercices clés' },
    { type: 'p', text: `Maîtrise ces mouvements : ils composent l’essentiel des séances. Bonne technique d’abord, charge et vitesse ensuite.` },
    { type: 'exercise', name: 'Squat au poids du corps', muscles: 'Quadriceps, fessiers, ischios', level: 'Débutant', technique: `Pieds largeur d’épaules, descends en poussant les fesses vers l’arrière comme pour t’asseoir, dos droit, talons au sol. Descends jusqu’à ce que les cuisses soient parallèles au sol, puis remonte en poussant dans les talons.`, mistakes: `Genoux qui rentrent vers l’intérieur, talons qui décollent, dos arrondi. Garde la poitrine ouverte et le regard devant.` },
    { type: 'exercise', name: 'Fentes alternées', muscles: 'Fessiers, quadriceps, équilibre', level: 'Débutant', technique: `Grand pas en avant, descends le genou arrière vers le sol en gardant le buste droit. Le genou avant reste au-dessus de la cheville. Pousse dans le talon avant pour revenir, puis change de jambe.`, mistakes: `Pas trop court (genou qui dépasse l’orteil), buste penché en avant, perte d’équilibre. Contracte les abdos pour rester stable.` },
    { type: 'exercise', name: 'Pompes (genoux ou pieds)', muscles: 'Pectoraux, triceps, épaules, gainage', level: 'Débutant → Intermédiaire', technique: `Mains un peu plus larges que les épaules, corps gainé en ligne droite. Descends la poitrine vers le sol en gardant les coudes à ~45°, puis pousse pour remonter. Sur les genoux si besoin pour garder une forme propre.`, mistakes: `Bassin qui s’affaisse ou qui pointe vers le haut, coudes trop écartés, amplitude trop courte.` },
    { type: 'exercise', name: 'Mountain climbers', muscles: 'Abdos, épaules, cardio', level: 'Intermédiaire', technique: `En position de planche bras tendus, ramène alternativement un genou vers la poitrine, de plus en plus vite. Garde les hanches basses et le gainage actif tout du long.`, mistakes: `Fesses qui montent trop haut, dos creusé, rythme désordonné. Reste gainé et contrôle la cadence.` },
    { type: 'exercise', name: 'Gainage planche', muscles: 'Sangle abdominale, lombaires', level: 'Débutant', technique: `Appui sur les avant-bras et la pointe des pieds, corps en ligne droite de la tête aux talons. Contracte abdos et fessiers, respire calmement. Tiens la position le temps prévu.`, mistakes: `Bassin qui s’affaisse, fesses trop hautes, tête relevée. Imagine une planche rigide de la nuque aux chevilles.` },
    { type: 'exercise', name: 'Burpee (option avancée)', muscles: 'Corps entier, cardio', level: 'Avancé', technique: `Depuis debout, mains au sol, saute les pieds en arrière en planche, fais une pompe (option), ramène les pieds et saute vers le haut bras tendus. Enchaîne de façon fluide.`, mistakes: `Dos arrondi à la descente, réception jambes tendues. Amortis la réception, garde le rythme régulier plutôt que rapide et brouillon.` },

    { type: 'h1', text: 'Progression recommandée' },
    { type: 'list', items: [
      `Semaine après semaine : ajoute 1 à 2 répétitions par série, ou réduis le repos de 10 s.`,
      `Quand un exercice devient facile (RPE < 6), passe à la variante plus dure indiquée.`,
      `Note tes performances : battre la semaine précédente = la meilleure source de motivation.`,
    ] },

    { type: 'h1', text: 'Erreurs à éviter' },
    { type: 'list', items: [
      `Vouloir aller trop vite : un déficit trop agressif fait perdre du muscle et casse la motivation.`,
      `Zapper les protéines : sans elles, tu perds du muscle au lieu du gras.`,
      `Te peser tous les jours : pèse-toi 1 fois par semaine, à jeun, le même jour.`,
      `Oublier la récupération : c’est au repos que le corps change.`,
    ] },

    { type: 'h1', text: 'Rester motivé(e)' },
    { type: 'list', items: [
      `Fixe-toi un objectif précis et une date (ex. « -3 kg dans 30 jours »).`,
      `Prends une photo « avant » et des mesures : la balance ment parfois, pas le miroir.`,
      `Prépare ta tenue la veille : moins de friction = plus de séances tenues.`,
      `Célèbre chaque semaine terminée. La constance bat la perfection.`,
    ] },

    { type: 'h1', text: 'Suivi de ta progression' },
    { type: 'p', text: `Remplis ces tableaux chaque semaine. Mesure-toi à jeun, le matin, dans les mêmes conditions.` },
    { type: 'tracker', columns: ['Date', 'Poids (kg)', 'Tour de taille (cm)', 'Énergie /10'], rows: 8 },
    { type: 'h2', text: 'Performances (répétitions ou temps)' },
    { type: 'tracker', columns: ['Exercice', 'Sem. 1', 'Sem. 2', 'Sem. 3', 'Sem. 4'], rows: 6 },

    { type: 'h1', text: 'Checklist hebdomadaire' },
    { type: 'p', text: `Coche chaque case en fin de semaine. Objectif : au moins 6 cases sur 8.` },
    { type: 'checklist', items: [
      `J’ai fait mes 5 séances cette semaine.`,
      `J’ai mangé des protéines à chaque repas.`,
      `J’ai atteint 8 000+ pas la plupart des jours.`,
      `J’ai bu 2 L d’eau par jour.`,
      `J’ai dormi 7 à 8 h la plupart des nuits.`,
      `J’ai limité le sucre liquide et l’alcool.`,
      `Je me suis pesé(e) 1 fois, dans les mêmes conditions.`,
      `J’ai noté mes performances et mes ressentis.`,
    ] },

    { type: 'h1', text: 'Notes personnelles' },
    { type: 'tracker', columns: ['Mes notes, sensations et victoires de la semaine'], rows: 12 },

    { type: 'note', text: `Tu as terminé tes 30 jours ? Enchaîne avec un programme PRO (Prise de masse, Transformation 90 jours, Musculation) pour continuer sur ta lancée. Crée ton compte sur xenotif.com.` },
  ],
}

export const PROGRAMS: Record<string, Guide> = {
  'perte-de-poids-30j': perteDePoids30j,
}

export function getProgram(slug: string): Guide | undefined {
  return PROGRAMS[slug]
}
