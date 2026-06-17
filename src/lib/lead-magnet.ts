import type { Guide } from './boutique/guides'

// Lead magnet : « Programme Découverte 7 jours » offert contre l'email (newsletter).
// Réutilise le type Guide + le générateur PDF premium (guide-pdf.ts). Contenu réel
// et localisé fr/en/de. Aucun achat requis — généré à la volée via /api/free-program.

const fr: Guide = {
  id: 'free-7d',
  title: 'Programme Découverte',
  subtitle: '7 jours pour (re)démarrer le sport, sans te blesser ni t’épuiser',
  author: 'XENOTIF Coach — Préparation physique certifiée',
  blocks: [
    { type: 'h1', text: 'Bienvenue — tu commences aujourd’hui' },
    { type: 'p', text: `Ce guide est ton point de départ. En 7 jours, tu vas (re)mettre ton corps en mouvement avec une méthode simple, progressive et tenable. Pas de matériel compliqué, pas de séances de 2 heures : juste ce qu’il faut pour créer l’habitude et ressentir les premiers résultats.` },
    { type: 'h2', text: 'Ce que tu vas obtenir cette semaine' },
    { type: 'list', items: [
      `Une routine claire jour par jour, prête à suivre.`,
      `Des séances courtes (20 à 35 min) réalisables à la maison.`,
      `Les bons réflexes nutrition et récupération.`,
      `Surtout : l’élan pour continuer la semaine suivante.`,
    ] },
    { type: 'note', text: `Règle d’or : la régularité bat l’intensité. Mieux vaut 7 petites séances tenues qu’une séance parfaite suivie d’un abandon.` },

    { type: 'h1', text: 'Comment lire le programme' },
    { type: 'list', items: [
      `Séries × répétitions : « 3 × 12 » = 3 séries de 12 répétitions.`,
      `Repos : 45 à 90 secondes entre les séries. Respire, ne te précipite pas.`,
      `Intensité (RPE /10) : vise 7/8. Il doit te rester 2 répétitions « en réserve ».`,
      `Échauffe-toi toujours 3 à 5 minutes (marche rapide, montées de genoux, rotations).`,
    ] },

    { type: 'h1', text: 'Ton plan sur 7 jours' },
    { type: 'h2', text: 'Jour 1 — Bas du corps' },
    { type: 'list', items: [`Squats au poids du corps : 3 × 12`, `Fentes alternées : 3 × 10 par jambe`, `Pont fessier : 3 × 15`, `Gainage planche : 3 × 30 s`] },
    { type: 'h2', text: 'Jour 2 — Cardio léger & mobilité' },
    { type: 'list', items: [`20 à 30 min de marche rapide ou vélo`, `Mobilité hanches/épaules : 10 min`, `Étirements doux : 5 min`] },
    { type: 'h2', text: 'Jour 3 — Haut du corps' },
    { type: 'list', items: [`Pompes (au sol ou sur les genoux) : 3 × 8 à 12`, `Rowing avec bouteilles/haltères : 3 × 12`, `Dips sur chaise : 3 × 10`, `Gainage latéral : 3 × 20 s par côté`] },
    { type: 'h2', text: 'Jour 4 — Repos actif' },
    { type: 'list', items: [`Marche tranquille 20 min`, `Respiration & étirements 10 min`, `Hydrate-toi et dors tôt`] },
    { type: 'h2', text: 'Jour 5 — Full body' },
    { type: 'list', items: [`Squats : 3 × 15`, `Pompes : 3 × 10`, `Fentes : 3 × 10 par jambe`, `Mountain climbers : 3 × 30 s`] },
    { type: 'h2', text: 'Jour 6 — Cardio par intervalles (HIIT doux)' },
    { type: 'list', items: [`30 s d’effort / 60 s de récupération, 8 tours`, `Au choix : montées de genoux, jumping jacks, squats sautés (option)`, `Retour au calme 5 min`] },
    { type: 'h2', text: 'Jour 7 — Bilan & étirements' },
    { type: 'list', items: [`Séance d’étirements complète : 15 min`, `Note tes ressentis et tes progrès`, `Prépare ta semaine 2`] },

    { type: 'h1', text: 'Nutrition : 5 règles simples' },
    { type: 'list', items: [
      `Une source de protéines à chaque repas (œufs, poulet, poisson, légumineuses).`,
      `Des légumes à volonté, à chaque repas.`,
      `Bois 1,5 à 2 L d’eau par jour.`,
      `Limite le sucre liquide (sodas, jus) — c’est la victoire la plus rapide.`,
      `Ne saute pas le petit-déjeuner si tu t’entraînes le matin.`,
    ] },

    { type: 'h1', text: 'Récupération' },
    { type: 'list', items: [
      `Vise 7 à 8 h de sommeil : c’est là que le corps se reconstruit.`,
      `Une courbature légère est normale, une douleur articulaire ne l’est pas — adapte.`,
      `Bouge un peu les jours de repos plutôt que de rester totalement immobile.`,
    ] },

    { type: 'h1', text: 'Et après tes 7 jours ?' },
    { type: 'p', text: `Tu as posé les fondations. Pour continuer sans te poser de questions, XENOTIF te donne des programmes structurés sur plusieurs semaines, un suivi de progression, des défis et un coach IA qui adapte tes séances à tes objectifs.` },
    { type: 'note', text: `Crée ton compte gratuit sur xenotif.com et garde l’élan. La discipline Musculation est offerte ; passe à PRO quand tu veux tout débloquer.` },
  ],
}

const en: Guide = {
  id: 'free-7d',
  title: 'Starter Program',
  subtitle: '7 days to (re)start training — without getting hurt or burning out',
  author: 'XENOTIF Coach — Certified strength & conditioning',
  blocks: [
    { type: 'h1', text: 'Welcome — you start today' },
    { type: 'p', text: `This guide is your starting point. In 7 days you’ll get your body moving again with a simple, progressive, sustainable method. No complicated gear, no two-hour sessions: just enough to build the habit and feel the first results.` },
    { type: 'h2', text: 'What you’ll get this week' },
    { type: 'list', items: [
      `A clear day-by-day routine, ready to follow.`,
      `Short sessions (20 to 35 min) you can do at home.`,
      `The right nutrition and recovery habits.`,
      `Most of all: the momentum to keep going next week.`,
    ] },
    { type: 'note', text: `Golden rule: consistency beats intensity. Seven small sessions you actually do beat one perfect session followed by quitting.` },

    { type: 'h1', text: 'How to read the program' },
    { type: 'list', items: [
      `Sets × reps: "3 × 12" = 3 sets of 12 reps.`,
      `Rest: 45 to 90 seconds between sets. Breathe, don’t rush.`,
      `Intensity (RPE /10): aim for 7/8. Keep about 2 reps "in reserve".`,
      `Always warm up 3 to 5 minutes (brisk walk, high knees, rotations).`,
    ] },

    { type: 'h1', text: 'Your 7-day plan' },
    { type: 'h2', text: 'Day 1 — Lower body' },
    { type: 'list', items: [`Bodyweight squats: 3 × 12`, `Alternating lunges: 3 × 10 per leg`, `Glute bridge: 3 × 15`, `Plank: 3 × 30 s`] },
    { type: 'h2', text: 'Day 2 — Light cardio & mobility' },
    { type: 'list', items: [`20 to 30 min brisk walk or cycling`, `Hip/shoulder mobility: 10 min`, `Gentle stretching: 5 min`] },
    { type: 'h2', text: 'Day 3 — Upper body' },
    { type: 'list', items: [`Push-ups (floor or knees): 3 × 8 to 12`, `Rows with bottles/dumbbells: 3 × 12`, `Chair dips: 3 × 10`, `Side plank: 3 × 20 s per side`] },
    { type: 'h2', text: 'Day 4 — Active rest' },
    { type: 'list', items: [`Easy 20 min walk`, `Breathing & stretching 10 min`, `Hydrate and sleep early`] },
    { type: 'h2', text: 'Day 5 — Full body' },
    { type: 'list', items: [`Squats: 3 × 15`, `Push-ups: 3 × 10`, `Lunges: 3 × 10 per leg`, `Mountain climbers: 3 × 30 s`] },
    { type: 'h2', text: 'Day 6 — Interval cardio (easy HIIT)' },
    { type: 'list', items: [`30 s work / 60 s recovery, 8 rounds`, `Pick: high knees, jumping jacks, jump squats (optional)`, `Cool down 5 min`] },
    { type: 'h2', text: 'Day 7 — Review & stretching' },
    { type: 'list', items: [`Full stretching session: 15 min`, `Note how you feel and your progress`, `Plan your week 2`] },

    { type: 'h1', text: 'Nutrition: 5 simple rules' },
    { type: 'list', items: [
      `A protein source at every meal (eggs, chicken, fish, legumes).`,
      `Vegetables freely, at every meal.`,
      `Drink 1.5 to 2 L of water a day.`,
      `Cut liquid sugar (sodas, juice) — it’s the fastest win.`,
      `Don’t skip breakfast if you train in the morning.`,
    ] },

    { type: 'h1', text: 'Recovery' },
    { type: 'list', items: [
      `Aim for 7 to 8 h of sleep: that’s when the body rebuilds.`,
      `Mild soreness is normal, joint pain is not — adapt.`,
      `Move a little on rest days rather than staying fully still.`,
    ] },

    { type: 'h1', text: 'What’s next after your 7 days?' },
    { type: 'p', text: `You’ve laid the foundations. To keep going without second-guessing, XENOTIF gives you structured multi-week programs, progress tracking, challenges and an AI coach that adapts your sessions to your goals.` },
    { type: 'note', text: `Create your free account on xenotif.com and keep the momentum. The Strength discipline is free; upgrade to PRO whenever you want to unlock everything.` },
  ],
}

const de: Guide = {
  id: 'free-7d',
  title: 'Einsteiger-Programm',
  subtitle: '7 Tage, um (wieder) zu starten — ohne Verletzung oder Burnout',
  author: 'XENOTIF Coach — Zertifiziertes Kraft- & Konditionstraining',
  blocks: [
    { type: 'h1', text: 'Willkommen — du startest heute' },
    { type: 'p', text: `Dieser Leitfaden ist dein Startpunkt. In 7 Tagen bringst du deinen Körper mit einer einfachen, progressiven und machbaren Methode wieder in Bewegung. Keine komplizierte Ausrüstung, keine Zwei-Stunden-Einheiten: nur so viel, dass die Gewohnheit entsteht und du erste Ergebnisse spürst.` },
    { type: 'h2', text: 'Was du diese Woche bekommst' },
    { type: 'list', items: [
      `Eine klare Routine Tag für Tag, sofort umsetzbar.`,
      `Kurze Einheiten (20 bis 35 Min.), die du zu Hause machen kannst.`,
      `Die richtigen Gewohnheiten für Ernährung und Erholung.`,
      `Vor allem: den Schwung, um nächste Woche weiterzumachen.`,
    ] },
    { type: 'note', text: `Goldene Regel: Beständigkeit schlägt Intensität. Sieben kleine Einheiten, die du wirklich machst, sind besser als eine perfekte, gefolgt vom Aufgeben.` },

    { type: 'h1', text: 'So liest du das Programm' },
    { type: 'list', items: [
      `Sätze × Wiederholungen: "3 × 12" = 3 Sätze à 12 Wiederholungen.`,
      `Pause: 45 bis 90 Sekunden zwischen den Sätzen. Atme, hetze nicht.`,
      `Intensität (RPE /10): ziele auf 7/8. Behalte etwa 2 Wiederholungen "in Reserve".`,
      `Wärme dich immer 3 bis 5 Minuten auf (zügiges Gehen, Knieheben, Rotationen).`,
    ] },

    { type: 'h1', text: 'Dein 7-Tage-Plan' },
    { type: 'h2', text: 'Tag 1 — Unterkörper' },
    { type: 'list', items: [`Kniebeugen mit Körpergewicht: 3 × 12`, `Ausfallschritte abwechselnd: 3 × 10 pro Bein`, `Glute Bridge: 3 × 15`, `Unterarmstütz (Plank): 3 × 30 s`] },
    { type: 'h2', text: 'Tag 2 — Leichtes Cardio & Mobilität' },
    { type: 'list', items: [`20 bis 30 Min. zügiges Gehen oder Radfahren`, `Hüft-/Schultermobilität: 10 Min.`, `Sanftes Dehnen: 5 Min.`] },
    { type: 'h2', text: 'Tag 3 — Oberkörper' },
    { type: 'list', items: [`Liegestütze (Boden oder Knie): 3 × 8 bis 12`, `Rudern mit Flaschen/Hanteln: 3 × 12`, `Dips am Stuhl: 3 × 10`, `Seitlicher Unterarmstütz: 3 × 20 s pro Seite`] },
    { type: 'h2', text: 'Tag 4 — Aktive Erholung' },
    { type: 'list', items: [`Lockerer 20-Min.-Spaziergang`, `Atmung & Dehnen 10 Min.`, `Trinken und früh schlafen`] },
    { type: 'h2', text: 'Tag 5 — Ganzkörper' },
    { type: 'list', items: [`Kniebeugen: 3 × 15`, `Liegestütze: 3 × 10`, `Ausfallschritte: 3 × 10 pro Bein`, `Mountain Climbers: 3 × 30 s`] },
    { type: 'h2', text: 'Tag 6 — Intervall-Cardio (leichtes HIIT)' },
    { type: 'list', items: [`30 s Belastung / 60 s Erholung, 8 Runden`, `Auswahl: Knieheben, Hampelmänner, Sprungkniebeugen (optional)`, `5 Min. Cool-down`] },
    { type: 'h2', text: 'Tag 7 — Rückblick & Dehnen' },
    { type: 'list', items: [`Komplette Dehneinheit: 15 Min.`, `Notiere dein Gefühl und deine Fortschritte`, `Plane deine Woche 2`] },

    { type: 'h1', text: 'Ernährung: 5 einfache Regeln' },
    { type: 'list', items: [
      `Eine Proteinquelle bei jeder Mahlzeit (Eier, Hähnchen, Fisch, Hülsenfrüchte).`,
      `Gemüse nach Belieben, bei jeder Mahlzeit.`,
      `Trinke 1,5 bis 2 L Wasser pro Tag.`,
      `Reduziere flüssigen Zucker (Limos, Säfte) — der schnellste Erfolg.`,
      `Lass das Frühstück nicht aus, wenn du morgens trainierst.`,
    ] },

    { type: 'h1', text: 'Erholung' },
    { type: 'list', items: [
      `Ziele auf 7 bis 8 Std. Schlaf: dann baut sich der Körper wieder auf.`,
      `Leichter Muskelkater ist normal, Gelenkschmerz nicht — passe an.`,
      `Bewege dich an Ruhetagen etwas, statt völlig still zu bleiben.`,
    ] },

    { type: 'h1', text: 'Und nach deinen 7 Tagen?' },
    { type: 'p', text: `Du hast das Fundament gelegt. Um ohne Grübeln weiterzumachen, gibt dir XENOTIF strukturierte mehrwöchige Programme, Fortschritts-Tracking, Challenges und einen KI-Coach, der deine Einheiten an deine Ziele anpasst.` },
    { type: 'note', text: `Erstelle dein kostenloses Konto auf xenotif.com und behalte den Schwung. Die Disziplin Krafttraining ist gratis; upgrade auf PRO, wann immer du alles freischalten willst.` },
  ],
}

const PROGRAMS: Record<string, Guide> = { fr, en, de }

export function getFreeProgram(locale: string): Guide {
  return PROGRAMS[locale] ?? fr
}
