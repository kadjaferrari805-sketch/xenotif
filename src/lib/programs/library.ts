import type { Guide } from '@/lib/boutique/guides'
import { priseDeMasse12s } from './prise-de-masse-12s'
import { musculationDebutant } from './musculation-debutant'

// Bibliothèque de programmes fitness premium XENOTIF® (FR).
// Rendu en PDF premium via guide-pdf.ts : couverture photo pleine page, photos
// d'ambiance, cartes info, tableaux planning/progression, fiches exercices avec
// QR vidéo, plan nutrition, recettes, suivi, checklists.
// Versions EN/DE : library.en.ts / library.de.ts.

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
    { type: 'p', text: `Ce document est ton coach de poche : garde-le sur ton téléphone, imprime-le, annote-le. Chaque exercice possède un QR code qui ouvre une vidéo de démonstration sur XENOTIF® — scanne-le si tu as le moindre doute sur la technique.` },
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
    { type: 'h2', text: 'Comment utiliser ce guide' },
    { type: 'list', items: [
      `Lis l’intégralité du guide une première fois avant de commencer.`,
      `Suis le calendrier 30 jours : chaque jour t’indique exactement quoi faire.`,
      `Avant chaque séance, fais l’échauffement de 5 minutes (page dédiée).`,
      `Scanne le QR d’un exercice si tu veux revoir la technique en vidéo.`,
      `Chaque dimanche : remplis ton suivi et coche ta checklist hebdomadaire.`,
    ] },
    { type: 'h2', text: 'Niveau requis' },
    { type: 'p', text: `Aucun prérequis : le programme part de zéro et monte progressivement. Si tu es déjà actif, utilise les variantes avancées indiquées et raccourcis les temps de repos. En cas de douleur, de grossesse ou de pathologie, demande l’avis d’un médecin avant de commencer.` },
    { type: 'note', text: `Règle d’or : la perte de gras se joue à 70 % dans l’assiette. L’entraînement accélère le résultat, mais c’est la régularité alimentaire qui fait la vraie différence.` },

    // ── MÉTHODE ────────────────────────────────────────────
    { type: 'h1', text: 'Comment ça marche' },
    { type: 'list', items: [
      `Déficit calorique modéré : mange 300 à 500 kcal sous ta maintenance, jamais plus.`,
      `Bouge plus au quotidien (NEAT) : vise 8 000 à 10 000 pas par jour.`,
      `Séries × répétitions : « 3 × 12 » = 3 séries de 12 répétitions.`,
      `Repos : 30 à 60 secondes entre les séries pour garder l’intensité et le cœur élevé.`,
      `RPE (intensité ressentie sur 10) : vise 7 à 8. Il doit te rester environ 2 répétitions « en réserve ».`,
      `Échauffe-toi 5 minutes avant chaque séance et étire-toi 5 minutes après.`,
    ] },
    { type: 'h2', text: 'Le déficit calorique, expliqué simplement' },
    { type: 'p', text: `Ton corps brûle un certain nombre de calories chaque jour (ta « maintenance »). Si tu manges un peu moins que ça, il puise dans tes réserves de gras pour combler la différence : c’est le déficit. Trop léger, tu ne perds pas ; trop agressif, tu perds du muscle, ton énergie chute et tu craques. La zone idéale : 300 à 500 kcal sous ta maintenance. Suffisant pour perdre 0,5 à 0,8 kg de gras par semaine, sans souffrir.` },
    { type: 'h2', text: 'Pourquoi muscler en perdant du gras ?' },
    { type: 'p', text: `Le muscle est métaboliquement actif : plus tu en as, plus tu brûles de calories au repos. Surtout, faire du renforcement pendant un déficit envoie au corps le signal de garder le muscle et de puiser dans le gras. Résultat : tu ne deviens pas « maigre et mou », mais sec et tonique.` },

    // ── ÉCHAUFFEMENT ───────────────────────────────────────
    { type: 'h1', text: 'Échauffement & retour au calme' },
    { type: 'p', text: `Ne saute jamais l’échauffement : il prépare les articulations, augmente la performance et réduit nettement le risque de blessure. Le retour au calme accélère la récupération et limite les courbatures.` },
    { type: 'h2', text: 'Échauffement type (5 minutes)' },
    { type: 'table', headers: ['Mouvement', 'Durée'], rows: [
      ['Marche rapide ou course sur place', '60 s'],
      ['Montées de genoux', '45 s'],
      ['Rotations des bras et des hanches', '45 s'],
      ['Squats lents (amplitude croissante)', '45 s'],
      ['Fentes dynamiques', '45 s'],
      ['Talons-fesses', '40 s'],
    ] },
    { type: 'h2', text: 'Retour au calme (5 minutes)' },
    { type: 'list', items: [
      `Marche lente 1 à 2 min pour faire redescendre le cœur.`,
      `Étirement quadriceps, ischios, fessiers, mollets : 20 à 30 s chacun.`,
      `Étirement poitrine, dos et épaules : 20 à 30 s.`,
      `3 à 5 respirations profondes pour clôturer la séance.`,
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
      `Réduis le sucre liquide (sodas, jus, alcool) — la victoire la plus rapide et la plus rentable.`,
      `Garde 1 repas plaisir par semaine : la frustration totale fait craquer.`,
    ] },
    { type: 'h2', text: 'Combien manger ?' },
    { type: 'p', text: `Estimation rapide de ta maintenance : poids (kg) × 30 environ. Exemple pour 70 kg : ≈ 2 100 kcal. Vise alors 1 600 à 1 800 kcal/jour. Ajuste après 2 semaines selon la tendance de ton poids : pas de perte → retire 100-150 kcal ; perte trop rapide (> 1 kg/sem) → ajoute 100-150 kcal.` },
    { type: 'h2', text: 'Journée type (≈ 1 800 kcal)' },
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
    { type: 'h2', text: 'Hydratation & compléments' },
    { type: 'list', items: [
      `Eau : 2 à 2,5 L/jour. Bois un grand verre avant chaque repas (effet satiété).`,
      `Café/thé sans sucre : OK, et coupe-faim naturel avant l’entraînement.`,
      `Compléments utiles (facultatifs) : whey si tu manques de protéines, vitamine D en hiver, oméga-3.`,
      `Inutiles : « brûleurs de graisse » miracles. Aucun ne remplace le déficit.`,
    ] },
    { type: 'note', text: `Astuce batch cooking : cuisine 2 fois par semaine en grande quantité (protéines + glucides + légumes). Quand c’est déjà prêt, tu manges mieux et tu ne craques pas sur le premier plat rapide.` },
    { type: 'h2', text: 'Comprendre tes macros (en 2 minutes)' },
    { type: 'p', text: `Les calories viennent de trois macronutriments. Tu n’as pas besoin de tout compter, mais comprendre leur rôle t’aide à composer de meilleures assiettes.` },
    { type: 'table', headers: ['Macro', 'Rôle', 'Par g', 'Priorité en sèche'], rows: [
      ['Protéines', 'Préservent le muscle, rassasient', '4 kcal', 'HAUTE — 1,8-2,2 g/kg'],
      ['Glucides', 'Énergie, performance', '4 kcal', 'Autour de la séance'],
      ['Lipides', 'Hormones, satiété', '9 kcal', 'Modérée, qualité'],
    ] },
    { type: 'list', items: [
      `Priorise toujours les protéines : c’est le macro n°1 en perte de gras.`,
      `Les glucides ne « font pas grossir » : c’est le surplus calorique total qui compte.`,
      `Garde un peu de bons lipides (huile d’olive, avocat, oléagineux) pour les hormones et la satiété.`,
    ] },

    // ── RECETTES ───────────────────────────────────────────
    { type: 'h1', text: 'Recettes express (moins de 15 min)' },
    { type: 'p', text: `Quatre recettes simples, riches en protéines et rassasiantes, pour ne jamais être pris(e) au dépourvu.` },
    { type: 'h2', text: 'Bowl petit-déj protéiné' },
    { type: 'meta', items: [
      { label: 'Calories', value: '≈ 380 kcal' },
      { label: 'Protéines', value: '32 g' },
    ] },
    { type: 'list', items: [`200 g de skyr nature`, `40 g de flocons d’avoine`, `1 poignée de fruits rouges`, `1 c. à café de miel (option)`] },
    { type: 'p', text: `Préparation : mélange le skyr et les flocons, laisse reposer 5 min (ou la veille au frigo). Ajoute les fruits rouges et le miel. Prêt.` },
    { type: 'h2', text: 'Wrap poulet-crudités' },
    { type: 'meta', items: [
      { label: 'Calories', value: '≈ 450 kcal' },
      { label: 'Protéines', value: '38 g' },
    ] },
    { type: 'list', items: [`1 galette complète`, `120 g de poulet grillé`, `Salade, tomate, concombre`, `1 c. à soupe de fromage blanc + moutarde`] },
    { type: 'p', text: `Préparation : tartine la galette du mélange fromage blanc-moutarde, garnis de poulet et crudités, roule serré. Coupe en deux.` },
    { type: 'h2', text: 'Poêlée express tofu/poulet & légumes' },
    { type: 'meta', items: [
      { label: 'Calories', value: '≈ 480 kcal' },
      { label: 'Protéines', value: '40 g' },
    ] },
    { type: 'list', items: [`150 g de tofu ferme ou de poulet`, `200 g de légumes surgelés`, `100 g de riz cuit`, `Sauce soja, ail, gingembre`] },
    { type: 'p', text: `Préparation : saisis le tofu/poulet à feu vif, ajoute les légumes, déglace à la sauce soja, ail et gingembre. Sers sur le riz.` },
    { type: 'h2', text: 'Omelette légumes du soir' },
    { type: 'meta', items: [
      { label: 'Calories', value: '≈ 320 kcal' },
      { label: 'Protéines', value: '28 g' },
    ] },
    { type: 'list', items: [`3 œufs`, `1 poignée d’épinards`, `1/2 poivron`, `Herbes, sel, poivre`] },
    { type: 'p', text: `Préparation : fais revenir les légumes 3 min, verse les œufs battus, cuis à feu doux. Accompagne d’une salade verte.` },

    // ── RÉCUPÉRATION ───────────────────────────────────────
    { type: 'photo', src: 'recovery.jpg', caption: 'C’est au repos que le corps se transforme.' },
    { type: 'h1', text: 'Récupération' },
    { type: 'list', items: [
      `Dors 7 à 8 h : le manque de sommeil augmente la faim (ghréline) et freine la perte de gras.`,
      `Une courbature légère est normale ; une douleur articulaire ne l’est pas — adapte ou repose.`,
      `Garde au moins 1 vraie journée de repos par semaine (marche douce autorisée).`,
      `Étire-toi 5 à 10 min après chaque séance pour limiter les raideurs.`,
    ] },
    { type: 'h2', text: 'Mieux dormir' },
    { type: 'list', items: [
      `Couche-toi à heure régulière, même le week-end.`,
      `Coupe les écrans 30 min avant de dormir ; baisse la lumière.`,
      `Pas de café après 16 h ; chambre fraîche et sombre.`,
    ] },
    { type: 'h2', text: 'Gérer les fringales' },
    { type: 'list', items: [
      `Bois un grand verre d’eau : on confond souvent soif et faim.`,
      `Garde des en-cas protéinés sous la main (skyr, œuf dur, blanc de dinde).`,
      `Une fringale dure ~15 min : occupe-toi, elle passe.`,
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
    { type: 'h2', text: 'Semaine type (vue d’ensemble)' },
    { type: 'table', headers: ['Jour', 'Séance', 'Durée', 'Intensité'], rows: [
      ['Lundi', 'Séance A — Bas du corps', '30 min', 'Modérée'],
      ['Mardi', 'HIIT brûle-graisses', '20 min', 'Élevée'],
      ['Mercredi', 'Séance B — Haut du corps', '30 min', 'Modérée'],
      ['Jeudi', 'Marche rapide / repos actif', '30 min', 'Faible'],
      ['Vendredi', 'Circuit full body', '35 min', 'Élevée'],
      ['Samedi', 'Cardio + core', '25 min', 'Modérée'],
      ['Dimanche', 'Repos + suivi', '—', 'Récupération'],
    ] },

    // ── CALENDRIER 30 JOURS ────────────────────────────────
    { type: 'h1', text: 'Ton calendrier sur 30 jours' },
    { type: 'p', text: `Chaque jour t’indique exactement quoi faire. Coche au fur et à mesure. Les jours « repos actif » ne sont pas optionnels : la marche fait partie du programme.` },
    { type: 'h2', text: 'Semaine 1 — Adaptation' },
    { type: 'table', headers: ['Jour', 'Au programme', 'Durée'], rows: [
      ['J1', 'Séance A — Bas du corps', '25 min'],
      ['J2', 'HIIT léger + gainage', '20 min'],
      ['J3', 'Séance B — Haut du corps', '25 min'],
      ['J4', 'Marche rapide', '30 min'],
      ['J5', 'Circuit full body', '25 min'],
      ['J6', 'Cardio + core', '25 min'],
      ['J7', 'Repos + suivi hebdo', '—'],
    ] },
    { type: 'h2', text: 'Semaine 2 — Volume' },
    { type: 'table', headers: ['Jour', 'Au programme', 'Durée'], rows: [
      ['J8', 'Séance A — Bas du corps', '30 min'],
      ['J9', 'HIIT 15 min + marche', '30 min'],
      ['J10', 'Séance B — Haut du corps', '30 min'],
      ['J11', 'Marche rapide', '35 min'],
      ['J12', 'Circuit full body', '30 min'],
      ['J13', 'Cardio + core', '25 min'],
      ['J14', 'Repos + suivi hebdo', '—'],
    ] },
    { type: 'h2', text: 'Semaine 3 — Intensité' },
    { type: 'table', headers: ['Jour', 'Au programme', 'Durée'], rows: [
      ['J15', 'Séance A (repos -10 s)', '35 min'],
      ['J16', 'HIIT 20 min', '20 min'],
      ['J17', 'Séance B (repos -10 s)', '35 min'],
      ['J18', 'Marche rapide', '40 min'],
      ['J19', 'Circuit full body intense', '35 min'],
      ['J20', 'HIIT + core', '25 min'],
      ['J21', 'Repos + suivi hebdo', '—'],
    ] },
    { type: 'h2', text: 'Semaine 4 — Pic & finition' },
    { type: 'table', headers: ['Jour', 'Au programme', 'Durée'], rows: [
      ['J22', 'Séance A — max propre', '35 min'],
      ['J23', 'HIIT 20 min', '20 min'],
      ['J24', 'Séance B — max propre', '35 min'],
      ['J25', 'Sortie longue (marche/vélo)', '50 min'],
      ['J26', 'Circuit full body', '35 min'],
      ['J27', 'HIIT + core', '25 min'],
      ['J28', 'Repos + suivi hebdo', '—'],
    ] },
    { type: 'note', text: `Jours 29 & 30 : refais ta séance préférée, reprends tes mesures et une photo « après ». Compare à ton « avant » : c’est ta vraie récompense.` },

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
    { type: 'exercise', name: 'Pont fessier', muscles: 'Fessiers, ischios, sangle abdominale', level: 'Débutant', video: `${D}/musculation`, technique: `Allongé sur le dos, genoux fléchis, pieds à plat. Pousse dans les talons pour décoller le bassin jusqu’à former une ligne épaules-hanches-genoux. Serre les fessiers 1 seconde en haut, puis redescends sans poser complètement.`, mistakes: `Cambrer le bas du dos au lieu de serrer les fessiers, monter trop haut, pieds trop loin du bassin.` },
    { type: 'exercise', name: 'Chaise contre le mur', muscles: 'Quadriceps, gainage', level: 'Débutant', video: `${D}/musculation`, technique: `Dos plaqué au mur, glisse jusqu’à ce que les cuisses soient parallèles au sol, genoux à 90°. Tiens la position, respiration calme, abdos engagés.`, mistakes: `Genoux qui dépassent les chevilles, dos décollé du mur, apnée. Garde le poids dans les talons.` },
    { type: 'exercise', name: 'Pompes (genoux ou pieds)', muscles: 'Pectoraux, triceps, épaules, gainage', level: 'Débutant - Intermédiaire', video: `${D}/musculation`, technique: `Mains un peu plus larges que les épaules, corps gainé en ligne droite. Descends la poitrine vers le sol, coudes à ~45°, puis pousse pour remonter. Sur les genoux si besoin pour garder une forme propre.`, mistakes: `Bassin qui s’affaisse ou pointe vers le haut, coudes trop écartés, amplitude trop courte.` },
    { type: 'exercise', name: 'Rowing haltères (ou bouteilles)', muscles: 'Dos, biceps, arrière d’épaules', level: 'Débutant', video: `${D}/musculation`, technique: `Buste penché en avant (dos plat), bras tendus vers le sol. Tire les coudes vers l’arrière en rapprochant les omoplates, puis redescends lentement. Garde le dos gainé.`, mistakes: `Dos rond, balancier avec le buste, tirer avec les bras au lieu du dos.` },
    { type: 'exercise', name: 'Dips sur chaise', muscles: 'Triceps, épaules, pectoraux', level: 'Débutant - Intermédiaire', video: `${D}/musculation`, technique: `Mains sur le bord d’une chaise stable, jambes devant. Descends le bassin en pliant les coudes vers l’arrière, puis remonte en poussant. Plus les jambes sont tendues, plus c’est dur.`, mistakes: `Épaules qui montent vers les oreilles, descente trop courte, chaise instable.` },
    { type: 'exercise', name: 'Gainage planche', muscles: 'Sangle abdominale, lombaires', level: 'Débutant', video: `${D}/musculation`, technique: `Appui sur les avant-bras et la pointe des pieds, corps en ligne droite. Contracte abdos et fessiers, respire calmement, tiens la position.`, mistakes: `Bassin qui s’affaisse, fesses trop hautes, tête relevée. Imagine une planche rigide.` },
    { type: 'exercise', name: 'Gainage latéral', muscles: 'Obliques, gainage', level: 'Débutant - Intermédiaire', video: `${D}/musculation`, technique: `Sur le côté, en appui sur un avant-bras, corps aligné. Décolle les hanches et tiens, sans laisser le bassin tomber. Change de côté.`, mistakes: `Hanches qui descendent, épaule pas alignée avec le coude, corps qui bascule vers l’avant.` },
    { type: 'exercise', name: 'Mountain climbers', muscles: 'Abdos, épaules, cardio', level: 'Intermédiaire', video: `${D}/hiit`, technique: `En planche bras tendus, ramène alternativement un genou vers la poitrine, de plus en plus vite. Garde les hanches basses et le gainage actif.`, mistakes: `Fesses qui montent trop haut, dos creusé, rythme désordonné.` },
    { type: 'exercise', name: 'Jumping jacks', muscles: 'Cardio, épaules, jambes', level: 'Débutant', video: `${D}/hiit`, technique: `Debout, saute en écartant jambes et bras simultanément, puis reviens. Réception souple sur la pointe des pieds, rythme régulier.`, mistakes: `Réception genoux tendus, dos cambré, bras incomplets. Amortis et garde la cadence.` },
    { type: 'exercise', name: 'Burpee (option avancée)', muscles: 'Corps entier, cardio', level: 'Avancé', video: `${D}/hiit`, technique: `Depuis debout, mains au sol, saute les pieds en arrière en planche, fais une pompe (option), ramène les pieds et saute vers le haut bras tendus. Enchaîne de façon fluide.`, mistakes: `Dos arrondi à la descente, réception jambes tendues. Amortis, privilégie un rythme régulier plutôt que rapide et brouillon.` },

    // ── CARDIO ─────────────────────────────────────────────
    { type: 'photo', src: 'cardio.jpg', caption: 'Le cardio accélère la dépense — et le mental.' },
    { type: 'h1', text: 'Cardio & HIIT' },
    { type: 'p', text: `Le HIIT alterne efforts intenses et récupérations courtes : tu brûles des calories pendant ET après la séance (effet EPOC). La marche rapide, elle, augmente ta dépense quotidienne sans fatiguer — c’est ton arme secrète les jours « off ».` },
    { type: 'list', items: [
      `HIIT : 30 s d’effort / 20 s de récupération, 4 tours par exercice. Sur l’effort, tu dois être incapable de tenir une conversation.`,
      `Marche rapide : 30 à 45 min, allure soutenue, 2 à 3 fois par semaine.`,
      `Semaine 4 : ajoute une sortie longue (45-60 min de marche/vélo) le week-end.`,
      `Au quotidien : prends les escaliers, descends un arrêt plus tôt, marche en téléphonant.`,
    ] },
    { type: 'h2', text: 'Tes zones d’effort' },
    { type: 'p', text: `Pour t’y retrouver sans cardiofréquencemètre, utilise le « test de la parole » : ta capacité à parler t’indique l’intensité.` },
    { type: 'table', headers: ['Zone', 'Ressenti', 'Test de la parole', 'Usage'], rows: [
      ['Faible', 'Très facile', 'Tu chantes', 'Échauffement, marche'],
      ['Modérée', 'Soutenu mais tenable', 'Phrases courtes', 'Renforcement, cardio'],
      ['Élevée', 'Dur, essoufflé', 'Quelques mots', 'HIIT, finitions'],
      ['Max', 'Très dur', 'Impossible de parler', 'Pics de 20-30 s'],
    ] },
    { type: 'h2', text: 'La marche : ton arme secrète' },
    { type: 'list', items: [
      `Brûle des calories sans fatiguer ni creuser l’appétit — idéale en déficit.`,
      `Vise 8 000 à 10 000 pas/jour. Fractionne : 3 × 10 min comptent autant qu’un bloc.`,
      `Le matin à jeun, en musique ou en podcast : c’est le meilleur moment pour tenir l’habitude.`,
    ] },

    // ── PROGRESSION ────────────────────────────────────────
    { type: 'h1', text: 'Progression recommandée' },
    { type: 'p', text: `Le corps s’adapte vite : si tu n’augmentes jamais la difficulté, il stagne. Voici comment progresser chaque semaine.` },
    { type: 'table', headers: ['Semaine', 'Répétitions', 'Repos', 'Cardio'], rows: [
      ['Semaine 1', 'Base (apprends la technique)', '60 s', '2 × 30 min marche'],
      ['Semaine 2', '+1 à 2 reps / série', '50 s', '2 HIIT 15 min'],
      ['Semaine 3', '+2 reps ou variante + dure', '40 s', '3 HIIT 20 min'],
      ['Semaine 4', 'Max propre par série', '30 s', '3 HIIT + sortie longue'],
    ] },
    { type: 'list', items: [
      `Quand un exercice devient facile (RPE < 6), passe à la variante plus difficile.`,
      `Note tes performances : battre la semaine précédente est la meilleure motivation.`,
    ] },
    { type: 'h2', text: 'Les signes que tu progresses (au-delà de la balance)' },
    { type: 'list', items: [
      `Tes vêtements sont plus amples, surtout à la taille.`,
      `Tu fais plus de répétitions ou tiens le gainage plus longtemps.`,
      `Tu récupères plus vite entre les séries et tu montes les escaliers sans t’essouffler.`,
      `Tu dors mieux, tu as plus d’énergie et meilleure humeur.`,
    ] },
    { type: 'note', text: `Plateau après 3 semaines ? Fais une semaine « deload » plus légère (volume −30 %), puis repars plus fort. Le repos fait partie de la progression.` },

    // ── ÉTIREMENTS & MOBILITÉ ──────────────────────────────
    { type: 'h1', text: 'Étirements & mobilité' },
    { type: 'p', text: `5 à 10 minutes d’étirements après chaque séance (ou les jours de repos) améliorent la souplesse, réduisent les courbatures et limitent les blessures. Tiens chaque position 20 à 30 secondes, sans à-coups, en respirant.` },
    { type: 'table', headers: ['Étirement', 'Zone', 'Durée'], rows: [
      ['Fente basse (hip flexor)', 'Hanches, psoas', '30 s / côté'],
      ['Étirement ischios (jambe tendue)', 'Arrière de cuisse', '30 s / côté'],
      ['Quadriceps debout', 'Avant de cuisse', '30 s / côté'],
      ['Étirement fessier (figure 4)', 'Fessiers', '30 s / côté'],
      ['Chat-vache', 'Colonne, dos', '45 s'],
      ['Ouverture poitrine au mur', 'Pectoraux, épaules', '30 s / côté'],
    ] },

    // ── SÉANCE EXPRESS ─────────────────────────────────────
    { type: 'h1', text: 'Plan B : séance express 10 minutes' },
    { type: 'p', text: `Pas le temps ? Une séance courte vaut TOUJOURS mieux que rien : elle entretient l’habitude (le vrai facteur de réussite). Fais ce circuit 2 fois, sans repos entre les exercices, 30 secondes de pause entre les deux tours.` },
    { type: 'table', headers: ['Exercice', 'Durée', 'Récup.'], rows: [
      ['Squats', '40 s', '20 s'],
      ['Pompes (genoux ou pieds)', '40 s', '20 s'],
      ['Mountain climbers', '40 s', '20 s'],
      ['Fentes alternées', '40 s', '20 s'],
      ['Gainage planche', '40 s', '20 s'],
    ] },
    { type: 'note', text: `Garde cette séance « plan B » en mémoire : les jours chargés, c’est elle qui sauve ta régularité.` },

    // ── SUBSTITUTIONS ──────────────────────────────────────
    { type: 'h1', text: 'Adapter chaque exercice à ton niveau' },
    { type: 'p', text: `Trop facile ou trop dur ? Chaque mouvement a une version régressée (plus simple) et progressée (plus dure). Choisis celle qui te permet de garder une technique propre sur toutes tes répétitions.` },
    { type: 'table', headers: ['Exercice', 'Plus facile', 'Plus dur'], rows: [
      ['Squat', 'Squat sur chaise', 'Squat sauté / lesté'],
      ['Pompe', 'Sur les genoux / inclinée', 'Pieds surélevés / déclinée'],
      ['Fente', 'Statique, appui mur', 'Fente sautée'],
      ['Gainage', 'Sur les genoux', 'Planche dynamique / sur 3 appuis'],
      ['Dips', 'Pieds proches', 'Jambes tendues / lesté'],
      ['Mountain climber', 'Plus lent', 'Cross-body rapide'],
    ] },
    { type: 'note', text: `Règle simple : si tu ne peux pas faire le nombre de répétitions prévu avec une bonne forme, régresse. Si c’est trop facile (RPE < 6), progresse.` },

    // ── ERREURS ────────────────────────────────────────────
    { type: 'h1', text: 'Erreurs à éviter' },
    { type: 'list', items: [
      `Vouloir aller trop vite : un déficit trop agressif fait perdre du muscle et casse la motivation.`,
      `Zapper les protéines : sans elles, tu perds du muscle au lieu du gras.`,
      `Te peser tous les jours : pèse-toi 1 fois par semaine, à jeun, le même jour.`,
      `Oublier la récupération : c’est au repos que le corps change.`,
      `Sauter l’échauffement : c’est le meilleur moyen de te blesser et de tout arrêter.`,
      `Comparer ta semaine 1 à la transformation de quelqu’un d’autre. Compare-toi à toi d’hier.`,
    ] },
    { type: 'h2', text: 'Problème → solution' },
    { type: 'table', headers: ['Tu rencontres…', 'La solution'], rows: [
      ['La balance ne bouge plus', 'Regarde sur 2 sem. ; sinon −100 kcal le soir'],
      ['Tu as faim tout le temps', 'Plus de protéines + légumes + eau aux repas'],
      ['Tu manques d’énergie', 'Glucides autour de la séance + 8 h de sommeil'],
      ['Courbatures importantes', 'Réduis le volume 2-3 j, étire-toi, hydrate-toi'],
      ['Tu as zappé une séance', 'Reprends la suivante, ne « rattrape » pas tout'],
    ] },

    // ── MOTIVATION ─────────────────────────────────────────
    { type: 'h1', text: 'Rester motivé(e)' },
    { type: 'list', items: [
      `Fixe-toi un objectif précis et une date (ex. « -3 kg dans 30 jours »).`,
      `Prends une photo « avant » et tes mesures : la balance ment parfois, pas le miroir.`,
      `Prépare ta tenue la veille : moins de friction = plus de séances tenues.`,
      `Trouve un partenaire ou partage ta progression : l’engagement public double la régularité.`,
      `Célèbre chaque semaine terminée. La constance bat la perfection.`,
    ] },
    { type: 'h2', text: 'Construis l’habitude (pas juste la motivation)' },
    { type: 'p', text: `La motivation est un feu de paille : certains jours elle est là, d’autres non. Ce qui te fera réussir, c’est l’habitude. Et une habitude se construit en réduisant la friction et en s’accrochant à un rituel.` },
    { type: 'list', items: [
      `Associe ta séance à un moment fixe (ex. juste après le réveil, ou avant le dîner).`,
      `Règle des 2 minutes : commence juste l’échauffement. Une fois lancé(e), tu finis.`,
      `Ne brise jamais la chaîne 2 fois de suite. Un jour off arrive — deux deviennent un abandon.`,
      `Rends-le visible : coche ton calendrier, c’est étrangement satisfaisant et efficace.`,
    ] },

    // ── FAQ ────────────────────────────────────────────────
    { type: 'h1', text: 'Questions fréquentes' },
    { type: 'h2', text: 'Je n’ai pas d’haltères, c’est grave ?' },
    { type: 'p', text: `Non. Tout le programme se fait au poids du corps. Des bouteilles d’eau ou un sac à dos lesté remplacent parfaitement les haltères pour le rowing et les fentes.` },
    { type: 'h2', text: 'Je peux m’entraîner le matin à jeun ?' },
    { type: 'p', text: `Oui, si tu t’y sens bien. À jeun ou non, ce qui compte sur 30 jours c’est le déficit calorique total et la régularité — pas le moment exact de la séance.` },
    { type: 'h2', text: 'La balance ne bouge pas, je fais quoi ?' },
    { type: 'p', text: `Patience : le poids fluctue (eau, digestion). Regarde la tendance sur 2 semaines et tes mensurations. Si rien ne bouge après 2 semaines, réduis légèrement les glucides du soir.` },
    { type: 'h2', text: 'Combien de poids vais-je perdre ?' },
    { type: 'p', text: `En moyenne 0,5 à 0,8 kg de gras par semaine, soit 2 à 4 kg sur 30 jours. Plus tu pars de loin, plus la perte initiale est rapide (dont une partie d’eau la première semaine).` },
    { type: 'h2', text: 'Puis-je faire ce programme en salle ?' },
    { type: 'p', text: `Bien sûr. Remplace les exercices au poids du corps par leurs versions guidées (presse, tirage, leg curl) si tu préfères, en gardant le même nombre de séries/répétitions.` },
    { type: 'h2', text: 'J’ai mal quelque part, je continue ?' },
    { type: 'p', text: `Une courbature musculaire : oui, en adaptant. Une douleur articulaire ou aiguë : non, repose la zone et consulte si ça persiste. Ne joue jamais avec une vraie douleur.` },
    { type: 'h2', text: 'Le « repas plaisir » ne va pas tout gâcher ?' },
    { type: 'p', text: `Non, au contraire. Un repas plaisir par semaine sur 21 repas reste un déficit hebdomadaire. Il préserve ta motivation et ta vie sociale — les vrais facteurs d’abandon.` },
    { type: 'h2', text: 'Et après les 30 jours ?' },
    { type: 'p', text: `Soit tu refais un cycle (avec plus d’intensité), soit tu passes à un programme PRO (Prise de masse, Musculation, Transformation 90 jours) pour continuer à progresser.` },

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
    { type: 'h2', text: 'Bilan de fin de programme (jour 30)' },
    { type: 'checklist', items: [
      `J’ai repris mon poids et mes mensurations.`,
      `J’ai pris ma photo « après » et comparé à l’« avant ».`,
      `J’ai battu au moins un record de répétitions vs semaine 1.`,
      `J’ai identifié 2 habitudes à garder pour la suite.`,
      `J’ai choisi mon prochain programme pour ne pas perdre l’élan.`,
    ] },

    // ── APRÈS LE PROGRAMME ─────────────────────────────────
    { type: 'h1', text: 'Et après tes 30 jours ?' },
    { type: 'p', text: `Le piège classique, c’est l’effet yo-yo : reprendre les anciennes habitudes et regagner le gras perdu. Pour ancrer tes résultats, la transition compte autant que le programme.` },
    { type: 'h2', text: 'Maintenir tes résultats' },
    { type: 'list', items: [
      `Remonte tes calories progressivement vers ta maintenance (+100 kcal/sem), au lieu de tout relâcher d’un coup.`,
      `Garde les 2-3 habitudes qui t’ont le plus aidé(e) (protéines, marche, sommeil).`,
      `Continue à t’entraîner 3 à 5 fois par semaine : le muscle entretenu maintient ton métabolisme.`,
      `Pèse-toi 1 fois/semaine : si tu reprends 1-2 kg, réagis tout de suite, pas dans 6 mois.`,
    ] },
    { type: 'h2', text: 'Ton prochain objectif' },
    { type: 'list', items: [
      `Encore du gras à perdre ? Refais un cycle de 30 jours, avec plus d’intensité.`,
      `Envie de te tonifier/galber ? Passe au programme Musculation ou Fitness Femme/Homme.`,
      `Prêt(e) pour un vrai défi ? Lance la Transformation Physique 90 jours.`,
    ] },

    // ── NOTES ──────────────────────────────────────────────
    { type: 'h1', text: 'Notes personnelles' },
    { type: 'tracker', columns: ['Mes notes, sensations et victoires de la semaine'], rows: 18 },

    { type: 'note', text: `Tu as terminé tes 30 jours ? Enchaîne avec un programme PRO (Prise de masse, Transformation 90 jours, Musculation) pour continuer sur ta lancée. Crée ton compte sur xenotif.com et garde l’élan.` },
  ],
}

export const PROGRAMS: Record<string, Guide> = {
  'perte-de-poids-30j': perteDePoids30j,
  'prise-de-masse-12s': priseDeMasse12s,
  'musculation-debutant': musculationDebutant,
}

export function getProgram(slug: string): Guide | undefined {
  return PROGRAMS[slug]
}
