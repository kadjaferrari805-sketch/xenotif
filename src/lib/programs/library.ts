import type { Guide } from '@/lib/boutique/guides'

// Bibliothèque de programmes fitness premium XENOTIF® (FR).
// Chaque programme est un `Guide` rendu en PDF premium via guide-pdf.ts :
// couverture photo pleine page, photos d'ambiance, cartes info, tableaux de
// planning/progression, fiches exercices avec QR vidéo, plan nutrition, suivi,
// checklists. Versions EN/DE : library.en.ts / library.de.ts.

const D = 'https://xenotif.com/disciplines' // base des QR vidéo (pages disciplines)

const perteDePoids30j: Guide = {
  id: 'perte-de-poids-30j',
  title: 'Programme Perte de Poids',
  subtitle: '30 jours pour enclencher une perte de gras durable, sans régime extrême',
  author: 'XENOTIF Coach — Préparation physique & nutrition certifiées',
  level: 'Débutant - Intermédiaire',
  duration: '30 jours · 5 séances/sem',
  coverImage: 'cover.jpg',
  blocks: [
    // ── INTRO ──────────────────────────────────────────────
    { type: 'h1', text: 'Bienvenue dans ton défi 30 jours' },
    { type: 'p', text: `Pendant 30 jours, tu vas enclencher une perte de gras réelle et durable — sans régime extrême ni séances interminables. La méthode repose sur trois leviers simples et prouvés : un léger déficit calorique, des séances courtes mais efficaces, et de la régularité. Suis le plan jour par jour, coche ta checklist chaque semaine, remplis ton suivi, et laisse les résultats s’installer.` },
    { type: 'p', text: `Ce document est ton coach de poche : garde-le sur ton téléphone, imprime-le, annote-le. Chaque exercice possède un QR code qui ouvre une vidéo de démonstration sur XENOTIF® — scanne-le si tu as un doute sur la technique.` },
    { type: 'meta', items: [
      { label: 'Objectif', value: 'Perdre 2 à 4 kg de gras' },
      { label: 'Niveau', value: 'Débutant à intermédiaire' },
      { label: 'Durée', value: '30 jours (4 semaines)' },
      { label: 'Fréquence', value: '5 séances par semaine' },
      { label: 'Matériel', value: 'Tapis + 1 paire d’haltères (option)' },
      { label: 'Lieu', value: 'Maison ou salle' },
    ] },
    { type: 'h2', text: 'Objectifs du programme' },
    { type: 'list', items: [
      `Perdre 2 à 4 kg de masse grasse (selon ton point de départ).`,
      `Affiner ta silhouette : ventre plus plat, meilleure définition.`,
      `Gagner en énergie, en souffle et en qualité de sommeil.`,
      `Installer des habitudes alimentaires saines qui durent après les 30 jours.`,
    ] },
    { type: 'h2', text: 'Niveau requis' },
    { type: 'p', text: `Aucun prérequis : le programme part de zéro et monte progressivement. Si tu es déjà actif, utilise les variantes avancées indiquées et raccourcis les temps de repos. En cas de douleur ou de pathologie, demande l’avis d’un médecin avant de commencer.` },
    { type: 'note', text: `Règle d’or : la perte de gras se joue à 70 % dans l’assiette. L’entraînement accélère le résultat, mais c’est la régularité alimentaire qui fait la vraie différence.` },

    // ── MÉTHODE ────────────────────────────────────────────
    { type: 'h1', text: 'Comment ça marche' },
    { type: 'list', items: [
      `Déficit calorique modéré : mange 300 à 500 kcal sous ta maintenance, jamais plus.`,
      `Bouge plus au quotidien (NEAT) : vise 8 000 à 10 000 pas par jour.`,
      `Séries × répétitions : « 3 × 12 » = 3 séries de 12 répétitions.`,
      `Repos : 30 à 60 secondes entre les séries pour garder l’intensité et le rythme cardiaque élevé.`,
      `RPE (intensité ressentie sur 10) : vise 7 à 8. Il doit te rester environ 2 répétitions « en réserve ».`,
      `Échauffe-toi 5 minutes avant chaque séance (marche rapide, montées de genoux, rotations articulaires).`,
    ] },

    // ── NUTRITION ──────────────────────────────────────────
    { type: 'photo', src: 'nutrition.jpg', caption: 'Nutrition : 70 % du résultat se joue dans l’assiette.' },
    { type: 'h1', text: 'Plan nutrition' },
    { type: 'p', text: `Pas besoin de peser chaque aliment au gramme près. Applique ces repères simples, et la balance avancera dans le bon sens semaine après semaine.` },
    { type: 'meta', items: [
      { label: 'Déficit visé', value: '300 à 500 kcal / jour' },
      { label: 'Protéines', value: '1,8 à 2,2 g par kg de poids' },
      { label: 'Hydratation', value: '2 à 2,5 L d’eau par jour' },
      { label: 'Sommeil', value: '7 à 8 h (clé de la perte de gras)' },
    ] },
    { type: 'h2', text: 'Les 5 règles d’or' },
    { type: 'list', items: [
      `Une source de protéines à chaque repas (œufs, poulet, poisson, tofu, légumineuses, skyr).`,
      `La moitié de l’assiette en légumes, à chaque repas principal.`,
      `Des glucides surtout autour de l’entraînement (riz, patate douce, flocons d’avoine, fruits).`,
      `Réduis le sucre liquide (sodas, jus, alcool) — c’est la victoire la plus rapide et la plus rentable.`,
      `Garde 1 repas plaisir par semaine : la frustration totale fait craquer.`,
    ] },
    { type: 'h2', text: 'Exemple de journée type (≈ 1 800 kcal)' },
    { type: 'table', headers: ['Repas', 'Exemple', 'Protéines'], rows: [
      ['Petit-déj', 'Skyr + flocons d’avoine + fruits rouges', '30 g'],
      ['Déjeuner', 'Poulet + riz + légumes verts + huile d’olive', '40 g'],
      ['Collation', '1 fruit + une poignée d’amandes', '8 g'],
      ['Dîner', 'Saumon (ou tofu) + patate douce + salade', '35 g'],
      ['Total', '≈ 1 800 kcal · déficit modéré', '≈ 113 g'],
    ] },
    { type: 'h2', text: 'Liste de courses de base' },
    { type: 'list', items: [
      `Protéines : œufs, poulet, dinde, poisson blanc, saumon, tofu, skyr, lentilles.`,
      `Glucides : riz, patate douce, flocons d’avoine, pain complet, fruits.`,
      `Légumes : brocoli, courgette, épinards, poivron, tomates, salade.`,
      `Bons lipides : huile d’olive, avocat, amandes, noix.`,
      `Extras : café/thé, épices, citron, vinaigre balsamique.`,
    ] },
    { type: 'note', text: `Astuce batch cooking : cuisine 2 fois par semaine en grande quantité (protéines + glucides + légumes). Quand c’est déjà prêt, tu manges mieux et tu ne craques pas sur le premier plat rapide.` },

    // ── RÉCUPÉRATION ───────────────────────────────────────
    { type: 'photo', src: 'recovery.jpg', caption: 'C’est au repos que le corps se transforme.' },
    { type: 'h1', text: 'Récupération' },
    { type: 'list', items: [
      `Dors 7 à 8 h : le manque de sommeil augmente la faim (ghréline) et freine la perte de gras.`,
      `Une courbature légère est normale ; une douleur articulaire ne l’est pas — adapte ou repose.`,
      `Garde au moins 1 vraie journée de repos par semaine (marche douce autorisée).`,
      `Étire-toi 5 à 10 min après chaque séance pour limiter les raideurs.`,
      `Gère le stress : 5 min de respiration profonde le soir améliorent le sommeil et la récupération.`,
    ] },

    // ── PLANNING ───────────────────────────────────────────
    { type: 'photo', src: 'training.jpg', caption: 'Un plan clair, semaine après semaine.' },
    { type: 'h1', text: 'Ton planning sur 4 semaines' },
    { type: 'p', text: `L’intensité monte progressivement chaque semaine. Ne saute pas d’étape : la progression est exactement ce qui rend le programme efficace et sûr.` },
    { type: 'table', headers: ['Semaine', 'Focus', 'Séances', 'Cardio'], rows: [
      ['Semaine 1', 'Adaptation & technique', '5 × 25 min', '2 marches rapides'],
      ['Semaine 2', 'Volume — full body', '5 × 30 min', '2 HIIT légers'],
      ['Semaine 3', 'Intensité — circuits', '5 × 35 min', '3 HIIT'],
      ['Semaine 4', 'Pic & finition', '5 × 35 min', '3 HIIT + 1 sortie longue'],
    ] },
    { type: 'h2', text: 'Semaine type (planning quotidien)' },
    { type: 'table', headers: ['Jour', 'Séance', 'Durée', 'Intensité'], rows: [
      ['Lundi', 'Séance A — Bas du corps', '30 min', 'Modérée'],
      ['Mardi', 'HIIT brûle-graisses', '20 min', 'Élevée'],
      ['Mercredi', 'Séance B — Haut du corps', '30 min', 'Modérée'],
      ['Jeudi', 'Marche rapide / repos actif', '30 min', 'Faible'],
      ['Vendredi', 'Circuit full body', '35 min', 'Élevée'],
      ['Samedi', 'Cardio + core', '25 min', 'Modérée'],
      ['Dimanche', 'Repos', '—', 'Récupération'],
    ] },

    // ── SÉANCES DÉTAILLÉES ─────────────────────────────────
    { type: 'h1', text: 'Tes séances en détail' },
    { type: 'h2', text: 'Séance A — Bas du corps' },
    { type: 'table', headers: ['Exercice', 'Séries', 'Répétitions', 'Repos'], rows: [
      ['Squat au poids du corps', '4', '15', '45 s'],
      ['Fentes alternées', '3', '12 / jambe', '45 s'],
      ['Pont fessier', '3', '20', '40 s'],
      ['Chaise contre le mur', '3', '30 s', '40 s'],
      ['Mollets debout', '3', '20', '30 s'],
    ] },
    { type: 'h2', text: 'Séance B — Haut du corps & gainage' },
    { type: 'table', headers: ['Exercice', 'Séries', 'Répétitions', 'Repos'], rows: [
      ['Pompes (genoux ou pieds)', '4', '8 à 12', '45 s'],
      ['Rowing haltères / bouteilles', '4', '12', '45 s'],
      ['Dips sur chaise', '3', '10', '40 s'],
      ['Gainage planche', '3', '30 à 45 s', '40 s'],
      ['Gainage latéral', '3', '20 s / côté', '30 s'],
    ] },
    { type: 'h2', text: 'Circuit HIIT brûle-graisses (20 min)' },
    { type: 'table', headers: ['Bloc', 'Effort', 'Récup.', 'Tours'], rows: [
      ['Mountain climbers', '30 s', '20 s', '4'],
      ['Squats sautés (ou squats)', '30 s', '20 s', '4'],
      ['Jumping jacks', '30 s', '20 s', '4'],
      ['Gainage dynamique', '30 s', '20 s', '4'],
    ] },

    // ── BIBLIOTHÈQUE D'EXERCICES ───────────────────────────
    { type: 'h1', text: 'Bibliothèque d’exercices' },
    { type: 'p', text: `Maîtrise ces mouvements : ils composent l’essentiel des séances. Bonne technique d’abord, charge et vitesse ensuite. Scanne le QR de chaque fiche pour voir la vidéo de démonstration sur XENOTIF®.` },
    { type: 'exercise', name: 'Squat au poids du corps', muscles: 'Quadriceps, fessiers, ischios', level: 'Débutant', video: `${D}/musculation`, technique: `Pieds largeur d’épaules, descends en poussant les fesses vers l’arrière comme pour t’asseoir, dos droit, talons au sol. Descends jusqu’à ce que les cuisses soient parallèles au sol, puis remonte en poussant dans les talons.`, mistakes: `Genoux qui rentrent vers l’intérieur, talons qui décollent, dos arrondi. Garde la poitrine ouverte et le regard devant.` },
    { type: 'exercise', name: 'Fentes alternées', muscles: 'Fessiers, quadriceps, équilibre', level: 'Débutant', video: `${D}/musculation`, technique: `Grand pas en avant, descends le genou arrière vers le sol en gardant le buste droit. Le genou avant reste au-dessus de la cheville. Pousse dans le talon avant pour revenir, puis change de jambe.`, mistakes: `Pas trop court (genou qui dépasse l’orteil), buste penché en avant, perte d’équilibre. Contracte les abdos pour rester stable.` },
    { type: 'exercise', name: 'Pont fessier', muscles: 'Fessiers, ischios, sangle abdominale', level: 'Débutant', video: `${D}/musculation`, technique: `Allongé sur le dos, genoux fléchis, pieds à plat. Pousse dans les talons pour décoller le bassin jusqu’à former une ligne épaules-hanches-genoux. Serre les fessiers en haut 1 seconde, puis redescends sans poser complètement.`, mistakes: `Cambrer le bas du dos au lieu de serrer les fessiers, monter trop haut, pieds trop loin du bassin.` },
    { type: 'exercise', name: 'Pompes (genoux ou pieds)', muscles: 'Pectoraux, triceps, épaules, gainage', level: 'Débutant - Intermédiaire', video: `${D}/musculation`, technique: `Mains un peu plus larges que les épaules, corps gainé en ligne droite. Descends la poitrine vers le sol en gardant les coudes à environ 45°, puis pousse pour remonter. Sur les genoux si besoin pour garder une forme propre.`, mistakes: `Bassin qui s’affaisse ou qui pointe vers le haut, coudes trop écartés, amplitude trop courte.` },
    { type: 'exercise', name: 'Rowing haltères (ou bouteilles)', muscles: 'Dos, biceps, arrière d’épaules', level: 'Débutant', video: `${D}/musculation`, technique: `Buste penché en avant (dos plat), bras tendus vers le sol. Tire les coudes vers l’arrière en rapprochant les omoplates, puis redescends lentement. Garde le dos gainé tout du long.`, mistakes: `Dos rond, mouvement de balancier avec le buste, tirer avec les bras au lieu du dos.` },
    { type: 'exercise', name: 'Gainage planche', muscles: 'Sangle abdominale, lombaires', level: 'Débutant', video: `${D}/musculation`, technique: `Appui sur les avant-bras et la pointe des pieds, corps en ligne droite de la tête aux talons. Contracte abdos et fessiers, respire calmement, tiens la position le temps prévu.`, mistakes: `Bassin qui s’affaisse, fesses trop hautes, tête relevée. Imagine une planche rigide de la nuque aux chevilles.` },
    { type: 'exercise', name: 'Mountain climbers', muscles: 'Abdos, épaules, cardio', level: 'Intermédiaire', video: `${D}/hiit`, technique: `En position de planche bras tendus, ramène alternativement un genou vers la poitrine, de plus en plus vite. Garde les hanches basses et le gainage actif tout du long.`, mistakes: `Fesses qui montent trop haut, dos creusé, rythme désordonné. Reste gainé et contrôle la cadence.` },
    { type: 'exercise', name: 'Burpee (option avancée)', muscles: 'Corps entier, cardio', level: 'Avancé', video: `${D}/hiit`, technique: `Depuis debout, mains au sol, saute les pieds en arrière en planche, fais une pompe (option), ramène les pieds et saute vers le haut bras tendus. Enchaîne de façon fluide.`, mistakes: `Dos arrondi à la descente, réception jambes tendues. Amortis la réception, privilégie un rythme régulier plutôt que rapide et brouillon.` },

    // ── CARDIO ─────────────────────────────────────────────
    { type: 'photo', src: 'cardio.jpg', caption: 'Le cardio accélère la dépense — et le mental.' },
    { type: 'h1', text: 'Cardio & HIIT' },
    { type: 'p', text: `Le HIIT alterne efforts intenses et récupérations courtes : tu brûles des calories pendant ET après la séance (effet EPOC). La marche rapide, elle, augmente ta dépense quotidienne sans fatiguer — c’est ton arme secrète les jours « off ».` },
    { type: 'list', items: [
      `HIIT : 30 s d’effort / 20 s de récupération, 4 tours par exercice. Sur l’effort, tu dois être incapable de tenir une conversation.`,
      `Marche rapide : 30 à 45 min, allure soutenue, 2 à 3 fois par semaine.`,
      `Semaine 4 : ajoute une sortie longue (45-60 min de marche/vélo) le week-end.`,
    ] },

    // ── PROGRESSION ────────────────────────────────────────
    { type: 'h1', text: 'Progression recommandée' },
    { type: 'p', text: `Le corps s’adapte vite : si tu ne progresses pas, il stagne. Voici comment augmenter la difficulté chaque semaine.` },
    { type: 'table', headers: ['Semaine', 'Répétitions', 'Repos', 'Cardio'], rows: [
      ['Semaine 1', 'Base (apprends la technique)', '60 s', '2 × 30 min marche'],
      ['Semaine 2', '+1 à 2 reps / série', '50 s', '2 HIIT 15 min'],
      ['Semaine 3', '+2 reps ou variante + dure', '40 s', '3 HIIT 20 min'],
      ['Semaine 4', 'Max propre par série', '30 s', '3 HIIT + sortie longue'],
    ] },
    { type: 'list', items: [
      `Quand un exercice devient facile (RPE < 6), passe à la variante plus difficile indiquée.`,
      `Note tes performances : battre la semaine précédente est la meilleure source de motivation.`,
    ] },

    // ── ERREURS / MOTIVATION / FAQ ─────────────────────────
    { type: 'h1', text: 'Erreurs à éviter' },
    { type: 'list', items: [
      `Vouloir aller trop vite : un déficit trop agressif fait perdre du muscle et casse la motivation.`,
      `Zapper les protéines : sans elles, tu perds du muscle au lieu du gras.`,
      `Te peser tous les jours : pèse-toi 1 fois par semaine, à jeun, le même jour.`,
      `Oublier la récupération : c’est au repos que le corps change.`,
      `Comparer ta semaine 1 à la transformation de quelqu’un d’autre. Compare-toi à toi d’hier.`,
    ] },
    { type: 'h1', text: 'Rester motivé(e)' },
    { type: 'list', items: [
      `Fixe-toi un objectif précis et une date (ex. « -3 kg dans 30 jours »).`,
      `Prends une photo « avant » et tes mesures : la balance ment parfois, pas le miroir.`,
      `Prépare ta tenue la veille : moins de friction = plus de séances tenues.`,
      `Trouve un partenaire ou partage ta progression : l’engagement public double la régularité.`,
      `Célèbre chaque semaine terminée. La constance bat la perfection.`,
    ] },
    { type: 'h1', text: 'Questions fréquentes' },
    { type: 'h2', text: 'Je n’ai pas d’haltères, c’est grave ?' },
    { type: 'p', text: `Non. Tout le programme se fait au poids du corps. Des bouteilles d’eau ou un sac à dos lesté remplacent parfaitement les haltères pour le rowing et les fentes.` },
    { type: 'h2', text: 'Je peux m’entraîner le matin à jeun ?' },
    { type: 'p', text: `Oui, si tu t’y sens bien. À jeun ou non, ce qui compte sur 30 jours, c’est le déficit calorique total et la régularité — pas le moment exact de la séance.` },
    { type: 'h2', text: 'La balance ne bouge pas, je fais quoi ?' },
    { type: 'p', text: `Patience : le poids fluctue (eau, digestion). Regarde la tendance sur 2 semaines et tes mensurations. Si rien ne bouge après 2 semaines, réduis légèrement les portions de glucides le soir.` },

    // ── SUIVI ──────────────────────────────────────────────
    { type: 'h1', text: 'Suivi de ta progression' },
    { type: 'p', text: `Remplis ces tableaux chaque semaine. Mesure-toi à jeun, le matin, dans les mêmes conditions. C’est ton tableau de bord : ce qui se mesure se pilote.` },
    { type: 'h2', text: 'Poids & énergie' },
    { type: 'tracker', columns: ['Date', 'Poids (kg)', 'Tour de taille (cm)', 'Énergie /10'], rows: 8 },
    { type: 'h2', text: 'Mensurations (cm)' },
    { type: 'tracker', columns: ['Date', 'Taille', 'Hanches', 'Cuisse', 'Bras'], rows: 5 },
    { type: 'h2', text: 'Performances (répétitions ou temps)' },
    { type: 'tracker', columns: ['Exercice', 'Sem. 1', 'Sem. 2', 'Sem. 3', 'Sem. 4'], rows: 6 },

    // ── CHECKLIST ──────────────────────────────────────────
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

    // ── NOTES ──────────────────────────────────────────────
    { type: 'h1', text: 'Notes personnelles' },
    { type: 'tracker', columns: ['Mes notes, sensations et victoires de la semaine'], rows: 14 },

    { type: 'note', text: `Tu as terminé tes 30 jours ? Enchaîne avec un programme PRO (Prise de masse, Transformation 90 jours, Musculation) pour continuer sur ta lancée. Crée ton compte sur xenotif.com et garde l’élan.` },
  ],
}

export const PROGRAMS: Record<string, Guide> = {
  'perte-de-poids-30j': perteDePoids30j,
}

export function getProgram(slug: string): Guide | undefined {
  return PROGRAMS[slug]
}
