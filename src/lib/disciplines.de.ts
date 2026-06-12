/* ── Contenu riche par discipline — version allemande ─────────── */
/* Mirror DE de disciplines.ts. Structure identique ; seuls les textes
   diffèrent. Les youtubeIds, emojis et icônes restent communs.        */

import type { DisciplineContent, DisciplineMeta } from './disciplines'

/* ── Running & Cardio ──────────────────────────────────────────── */
const runningContent: DisciplineContent = {
  tagline: 'Lauf schneller, lauf länger, ohne dich zu verletzen.',
  heroStat: '4.200+ aktive Läufer',
  guide: {
    technique: {
      emoji: '👟',
      title: 'Lauftechnik',
      items: [
        'Setze auf dem Mittelfuß statt auf der Ferse auf — senkt das Verletzungsrisiko um 30%',
        'Zielkadenz: 170–180 Schritte/Min für maximale Effizienz',
        'Arme im 90°-Winkel mit lockeren Händen — spart Energie über lange Distanzen',
        'Blick 10–15 m nach vorn gerichtet, um eine aufrechte Haltung zu bewahren',
        'Atme im 3:2-Rhythmus (3 Schritte ein / 2 Schritte aus) bei lockerem Tempo',
      ],
    },
    equipment: {
      emoji: '🛒',
      title: 'Empfohlene Ausrüstung',
      items: [
        'Laufschuhe passend zu deinem Laufstil (lass eine Laufanalyse im Fachgeschäft machen)',
        'GPS-Uhr, um Tempo, Distanz und Herzfrequenz zu verfolgen',
        'Atmungsaktive Funktionskleidung (vermeide Baumwolle)',
        'Herzfrequenz-Brustgurt für präzise Trainingszonen',
        'Tracking-App: Xenotif® + Garmin- / Apple-Watch-Integration',
      ],
    },
    nutrition: {
      emoji: '🥑',
      title: 'Ernährung & Hydration',
      items: [
        'Mahlzeit reich an komplexen Kohlenhydraten 3 h vor einem langen Lauf (Reis, Pasta, Quinoa)',
        'Energiegel oder Banane alle 40–45 Min ab 1 Std 30 Lauf',
        'Hydration: 500 ml Wasser 2 h vorher, dann 150–200 ml alle 20 Min',
        'Erholung: 20–30 g Protein innerhalb von 30 Min nach der Anstrengung',
        'Koffein (3–5 mg/kg) 60 Min vor einem Wettkampf für die Leistung',
      ],
    },
    recovery: {
      emoji: '💆',
      title: 'Optimale Erholung',
      items: [
        'Statisches Dehnen 10–15 Min nach dem Lauf (Beinbeuger, Waden, Quadrizeps)',
        'Faszienrolle auf den Muskelketten 3× /Woche',
        'Kaltes Bad (12–15 °C, 10 Min) nach intensiven Einheiten, um Entzündungen zu reduzieren',
        'Mindestens 8 h Schlaf — der Muskelaufbau passiert nachts',
        'Ein kompletter Ruhetag pro Woche ist Pflicht, um Übertraining vorzubeugen',
      ],
    },
  },
  tips: [
    { icon: '⚡', title: 'Die 10%-Regel', body: 'Erhöhe dein Wochenvolumen nie um mehr als 10% — die goldene Regel, um Überlastungsverletzungen zu vermeiden.' },
    { icon: '🎯', title: 'Trainiere in Zonen', body: '80% deines Volumens bei niedriger Intensität (Zone 2), 20% bei hoher Intensität — das ist die Formel der Ausdauer-Champions.' },
    { icon: '🧠', title: 'Visualisierung vor dem Lauf', body: '5 Min mentale Visualisierung vor jedem harten Lauf verbessern laut Sportstudien die Leistung um 15%.' },
    { icon: '🌡️', title: 'Monatlicher FTP-Check', body: 'Teste deine Geschwindigkeit an der Laktatschwelle jeden Monat (12-Min-Cooper-Test), um deine Trainingszonen feinzujustieren.' },
  ],
  videos: [
    {
      youtubeIds: ['Byjy-LzSNc0', 'BmJbKsV2r9o'],
      title: '9 Minuten, um deine Lauftechnik zu korrigieren',
      description: 'Korrigiere deine Lauftechnik in 9 Min — Haltung, Fußaufsatz und Kadenz Schritt für Schritt erklärt.',
      duration: '9 Min',
      level: 'Alle Niveaus',
    },
    {
      youtubeIds: ['sScNDZu2MWk', 'UrHOGy6jQ1g'],
      title: 'Perfekter Laufschritt — 5 Tipps',
      description: 'Die 5 Geheimnisse, um schneller und schmerzfrei zu laufen — von Elite-Coaches bestätigte Technik.',
      duration: '12 Min',
      level: 'Fortgeschritten',
    },
    {
      youtubeIds: ['_kGESn8ArrU', 'Xpg2JXiNwcY'],
      title: 'Lauftechnik erklärt',
      description: 'Kompletter Leitfaden zur Lauftechnik — Kadenz, Fußaufsatz, Atmung und Verletzungsprävention.',
      duration: '15 Min',
      level: 'Erfahren',
    },
    {
      youtubeIds: ['KxKJEIqS1HQ', 'SU3DqokJnjo'],
      title: '20-Min-Intervalllauf-Einheit',
      description: 'Ein komplettes 20-minütiges Intervalltraining — Wechsel aus Sprints und Erholung für schnellen Fortschritt.',
      duration: '20 Min',
      level: 'Fortgeschritten',
    },
    {
      youtubeIds: ['HFUz5qazxn0', 'UdBR85D8e8g'],
      title: 'Tipps für Intervalle',
      description: 'Wie du deine Intervalle gut strukturierst, um den Fortschritt beim Laufen zu maximieren.',
      duration: '11 Min',
      level: 'Alle Niveaus',
    },
    {
      youtubeIds: ['fbATY-sbqA8', '9rX9m_bemB0'],
      title: 'Warum Intervalltraining?',
      description: 'Die Wissenschaft hinter den Intervallen — wie und warum Intervallarbeit deine Leistung steigert.',
      duration: '13 Min',
      level: 'Anfänger',
    },
  ],
  exercises: [
    { name: 'Ausfallschritte im Gehen', muscles: 'Quadrizeps, Gesäß, Beinbeuger', sets: '3×12/Bein', difficulty: 'Anfänger', description: 'Mach einen großen Schritt nach vorn, senke das hintere Knie nahe an den Boden, drücke dann über den vorderen Fuß ab, um das andere Bein nachzuführen. Halte den Rücken gerade.' },
    { name: 'Jump Squat', muscles: 'Quadrizeps, Gesäß, Cardio', sets: '3×15', difficulty: 'Fortgeschritten', description: 'Geh in eine parallele Kniebeuge, dann explodiere nach oben. Lande weich durch Beugen der Knie zum Abfedern. Baut Antriebskraft auf.' },
    { name: 'Box Step-up', muscles: 'Quadrizeps, Gesäß, Stabilisatoren', sets: '3×10/Bein', difficulty: 'Anfänger', description: 'Setze einen Fuß auf eine Box oder Stufe, drücke dich hoch, senke dann langsam ab. Simuliert bergauf laufen.' },
    { name: 'Sprungausfallschritte', muscles: 'Quadrizeps, Gesäß, Explosivität', sets: '3×10/Bein', difficulty: 'Fortgeschritten', description: 'Aus der Ausfallschrittposition springen und die Beine in der Luft wechseln. Exzellent für die Entwicklung von Beinkraft und Ausdauer.' },
    { name: 'Einbeiniges Kreuzheben', muscles: 'Beinbeuger, Gesäß, Gleichgewicht', sets: '3×8/Bein', difficulty: 'Erfahren', description: 'Beuge dich auf einem Bein nach vorn mit flachem Rücken, das andere Bein streckt sich nach hinten. Kehre zum Stand zurück, ohne den Fuß abzusetzen. Baut Propriozeption auf.' },
    { name: 'Box Jumps', muscles: 'Quadrizeps, Waden, Explosivität', sets: '4×8', difficulty: 'Erfahren', description: 'Springe mit beiden Füßen auf eine Box, fange die Landung in einer halben Kniebeuge ab. Steig außen herunter. Verbessert die explosive Beinkraft.' },
    { name: 'Running A-Drills', muscles: 'Hüftbeuger, Kadenz', sets: '3×20 m', difficulty: 'Anfänger', description: 'Gehe und treibe bei jedem Schritt die Knie hoch, Arme im Rhythmus. Verbessert die Laufmechanik und Kadenz durch Training der Hüftaktivierung.' },
    { name: 'Seitlicher Unterarmstütz', muscles: 'Schräge Bauchmuskeln, laterale Stabilität', sets: '3×30 s/Seite', difficulty: 'Anfänger', description: 'Stütze auf dem Ellbogen und der Fußaußenkante, Körper in einer geraden Linie. Stärkt die seitlichen Rumpfmuskeln, die für die Laufhaltung entscheidend sind.' },
  ],
  program: [
    {
      week: 'Woche 1–2',
      theme: 'Aerobe Grundlage',
      sessions: [
        { name: 'Z2 lockerer Lauf 30 Min', detail: 'Gesprächstempo (Herzfrequenz 65–75% HFmax)' },
        { name: 'Hügel 8× 30 s', detail: 'Bergauf-Sprint, beim Herunterlaufen erholen — verbessert Kraft und Laufschritt' },
        { name: 'Langer Lauf 50 Min', detail: 'Sehr langsames Tempo, Ziel sind Dauer und Grundlagenausdauer' },
      ],
    },
    {
      week: 'Woche 3–4',
      theme: 'Schwellen-Entwicklung',
      sessions: [
        { name: 'Intervalle 5×5 Min', detail: '10-km-Tempo, 90 s Erholung dazwischen — Arbeit an der Laktatschwelle' },
        { name: 'Fartlek 35 Min', detail: 'Wechsle freie Beschleunigungen / lockeres Traben nach Gefühl' },
        { name: 'Langer Lauf 65 Min', detail: 'Mit 15 Min im Marathontempo in der zweiten Hälfte' },
      ],
    },
    {
      week: 'Woche 5–6',
      theme: 'Tempo & Spezifik',
      sessions: [
        { name: 'Tempolauf 45 Min', detail: 'Halbmarathon-Tempo durchgehend gehalten — kontrollierte Anstrengung' },
        { name: 'Bahneinheit 12×400 m', detail: '5-km-Zieltempo, 200 m Trab-Erholung zwischen jeder Wiederholung' },
        { name: '12-Min-Cooper-Test', detail: 'Maximaler Lauf über 12 Min, um den VO2max-Fortschritt zu bewerten' },
      ],
    },
    {
      week: 'Woche 7–8',
      theme: 'Tapering & Wettkampf',
      sessions: [
        { name: 'Volumenreduktion −30%', detail: 'Senke die Kilometer, aber behalte die Tempi — aktive Erholung' },
        { name: 'Steigerungsläufe 8×100 m', detail: 'Progressive Beschleunigungen, um vor dem Wettkampf spritzig zu bleiben' },
        { name: 'Wettkampftag-Simulation', detail: 'Aufwärmen + 20 Min im Zieltempo + Cool-down' },
      ],
    },
  ],
  faq: [
    { q: 'Wie oft sollte ich pro Woche laufen?', a: 'Anfänger: 3 Einheiten. Fortgeschritten: 4–5 Einheiten. Erfahren: 5–6 Einheiten mit einem kompletten Ruhetag. Qualität schlägt Quantität.' },
    { q: 'Wie vermeide ich Knieschmerzen?', a: 'Stärke dein Gesäß und deine Beinbeuger (Kniebeugen, Ausfallschritte), arbeite an deiner Kadenz (ziele auf 175 Schritte/Min) und bevorzuge anfangs weiche Untergründe.' },
    { q: 'Soll ich nüchtern laufen, um mehr Fett zu verbrennen?', a: 'Nüchternlaufen verbessert die Fettnutzung, reduziert aber die Leistung. Nur für lockere Läufe (< 45 Min) in Zone 2 empfohlen.' },
    { q: 'Wie lange bis zu meinen ersten 5 km?', a: 'Mit unserem Anfängerprogramm reichen 8 Wochen, um 5 km ohne Pause zu laufen, egal mit welcher Ausgangsform.' },
    { q: 'Welchen Schuh wähle ich zum Start?', a: 'Geh für eine kostenlose Laufanalyse ins Fachgeschäft. Bevorzuge einen gut gedämpften Schuh, wenn du auf Asphalt läufst — Budget mindestens 100–150 €.' },
  ],
}

/* ── Krafttraining ─────────────────────────────────────────────── */
const musculationContent: DisciplineContent = {
  tagline: 'Forme deinen Körper mit chirurgischer Präzision.',
  heroStat: '3.800+ aktive Mitglieder',
  guide: {
    technique: {
      emoji: '💪',
      title: 'Technik & Ausführung',
      items: [
        'Voller Bewegungsumfang — eine parallele Kniebeuge rekrutiert 40% mehr Muskelfasern',
        'Kontrolliertes Tempo: 2 s ab / 1 s Pause / 1 s hoch, um den Hypertrophie-Reiz zu maximieren',
        'Mind-Muscle-Connection — konzentriere dich während der Übung auf den Zielmuskel',
        'Atmung: aus bei der konzentrischen Anstrengung, ein bei der exzentrischen',
        'Spezifisches Aufwärmen ist Pflicht: 2–3 leichte Sätze, bevor du schwer lädst',
      ],
    },
    equipment: {
      emoji: '🏋️',
      title: 'Schlüssel-Ausrüstung',
      items: [
        'Ein Gewichthebergürtel für schwere Lasten (Kniebeuge / Kreuzheben > 80% 1RM)',
        'Gewichtheberschuhe (flache Sohle) oder Laufschuhe mit niedrigem Drop',
        'Zughilfen für Ziehen und Rudern — schützt langfristig die Sehnen',
        'Magnesia für besseren Halt an Stangen und Kettlebells',
        'Ein Trainingstagebuch oder die Xenotif®-App, um Lasten und Fortschritt zu verfolgen',
      ],
    },
    nutrition: {
      emoji: '🥩',
      title: 'Ernährung für Leistung',
      items: [
        'Proteinzufuhr: 1,8–2,2 g Protein pro kg Körpergewicht und Tag',
        'Kalorienüberschuss von 200–300 kcal/Tag für sauberen, langsamen Muskelaufbau',
        '4–5 Mahlzeiten/Tag, um die Proteinsynthese kontinuierlich zu halten',
        'Kreatin-Monohydrat: 3–5 g/Tag — das wissenschaftlich am besten dokumentierte Supplement',
        'Anaboles Fenster: 40 g Protein innerhalb von 60 Min nach der Einheit',
      ],
    },
    recovery: {
      emoji: '😴',
      title: 'Muskelregeneration',
      items: [
        'Mindestens 48 h Ruhe pro Muskelgruppe, bevor du sie erneut trainierst',
        '8–9 h Schlaf — das Wachstumshormon wird vor allem nachts ausgeschüttet',
        'Deload alle 4–6 Wochen: senke das Volumen um 40–50% für die Superkompensation',
        'Massage / Rolle 15 Min nach der Einheit auf den beanspruchten Muskeln',
        'Kaltes Bad oder Warm/Kalt-Wechsel, um den Abtransport von Stoffwechselabfällen zu beschleunigen',
      ],
    },
  },
  tips: [
    { icon: '📊', title: 'Progressive Überlastung', body: 'Füge jede Woche Last oder Wiederholungen hinzu — selbst 500 g mehr auf der Stange über ein Jahr sind 26 kg mehr in deiner Kniebeuge.' },
    { icon: '🔬', title: 'Hypertrophie vs. Kraft', body: 'Kraft: 1–5 Wdh bei 85–100% 1RM. Hypertrophie: 6–12 Wdh bei 65–80% 1RM. Variiere die Protokolle jeden Monat.' },
    { icon: '⏱️', title: 'Optimale Pausenzeit', body: 'Hypertrophie: 60–90 s. Maximalkraft: 3–5 Min. Die Pause zu verkürzen ist nicht effektiver — es ist weniger effektiv.' },
    { icon: '🎯', title: 'Priorisiere Grundübungen', body: 'Kniebeuge, Kreuzheben, Bankdrücken, Schulterdrücken und Rudern bringen 80% der Ergebnisse. Isolationsarbeit ist der Bonus.' },
  ],
  videos: [
    {
      youtubeIds: ['DUuh5wrkLIY', 'tunVzHcch-w'],
      title: 'Das ultimative Kreuzheben-Tutorial',
      description: 'Das perfekte Kreuzheben mit Martins Licis (Strongest Man 2019) — komplette Technik.',
      duration: '18 Min',
      level: 'Alle Niveaus',
    },
    {
      youtubeIds: ['c5tXZfw0nCU', 'LSKZhPM5cDY'],
      title: 'Kniebeuge, Kreuzheben, Bankdrücken — Genug?',
      description: 'Reichen die 3 Grundübungen für den Muskelaufbau? Die Wahrheit über Grundübungen.',
      duration: '14 Min',
      level: 'Anfänger',
    },
    {
      youtubeIds: ['gNdZuaYZz7E'],
      title: 'Kreuzheben — komplettes Tutorial',
      description: 'Ein vollständiger Kreuzheben-Leitfaden: Startposition, flacher Rücken, Lockout und Varianten je nach Ziel.',
      duration: '16 Min',
      level: 'Fortgeschritten',
    },
    {
      youtubeIds: ['KzBvZ0KZ27k'],
      title: 'Bestes Bankdrück-Programm',
      description: 'Wie du ein effektives Bankdrück-Programm aufbaust — Progression, Varianten und zu vermeidende Fehler.',
      duration: '17 Min',
      level: 'Fortgeschritten',
    },
    {
      youtubeIds: ['pxls2vBxFVs'],
      title: 'Perfekte Bankdrück-Technik',
      description: 'Beherrsche die Bankdrück-Technik von A bis Z — Griff, Brücke, Stangenweg und Explosivität.',
      duration: '14 Min',
      level: 'Alle Niveaus',
    },
    {
      youtubeIds: ['h--woXuXXmk'],
      title: 'SBD für Anfänger — Kniebeuge, Bank, Kreuzheben',
      description: 'Einführung in die drei fundamentalen Kraftübungen — alles, was ein Anfänger wissen muss.',
      duration: '20 Min',
      level: 'Anfänger',
    },
  ],
  exercises: [
    { name: 'Langhantel-Kniebeuge', muscles: 'Quadrizeps, Gesäß, Beinbeuger, Rücken', sets: '4×8', difficulty: 'Alle Niveaus', description: 'Stange in High-Bar-Position, Füße schulterbreit. Senke bis zur Parallele, die Knie folgen den Füßen. Die Königin der Kraftübungen.' },
    { name: 'Kreuzheben', muscles: 'Ganzer Rücken, Gesäß, Beinbeuger, Trapez', sets: '4×5', difficulty: 'Fortgeschritten', description: 'Greife die Stange im Obergriff, flacher Rücken, Hüfte tief. Drücke durch den Boden und zieh bis zur vollen Streckung. Eine fundamentale Bewegung für die Ganzkörperkraft.' },
    { name: 'Bankdrücken', muscles: 'Brust, Trizeps, vordere Schulter', sets: '4×8', difficulty: 'Alle Niveaus', description: 'Auf der Bank liegend, Stange auf Brusthöhe. Drücke senkrecht ohne Abprallen. Die Referenzübung für Brust und Trizeps.' },
    { name: 'Klimmzüge', muscles: 'Latissimus, Bizeps, Rhomboiden', sets: '4×AMRAP', difficulty: 'Fortgeschritten', description: 'An der Stange hängend, Obergriff. Zieh, bis das Kinn über der Stange ist. Die beste Übung für Rückendicke und -breite.' },
    { name: 'Schulterdrücken', muscles: 'Schultern, Trizeps, Trapez', sets: '4×8', difficulty: 'Fortgeschritten', description: 'Stange auf Schlüsselbeinhöhe, drücke senkrecht bis zur vollen Streckung. Schiebe den Kopf am Ende durch für einen sicheren Lockout.' },
    { name: 'Rumänisches Kreuzheben', muscles: 'Beinbeuger, Gesäß, unterer Rücken', sets: '3×10', difficulty: 'Fortgeschritten', description: 'Stange vor den Oberschenkeln, beuge dich nach vorn mit flachem Rücken und leicht gebeugten Knien. Exzellent für die Hypertrophie der Beinbeuger.' },
    { name: 'Dips', muscles: 'Brust, Trizeps, vordere Schulter', sets: '3×12', difficulty: 'Fortgeschritten', description: 'Stütze an Parallelbarren, senke, bis die Arme 90° erreichen, drücke hoch ohne die Ellbogen zu überstrecken. Füge Gewicht hinzu, wenn es zu leicht wird.' },
    { name: 'Langhantelrudern', muscles: 'Latissimus, Rhomboiden, Bizeps, Trapez', sets: '4×8', difficulty: 'Erfahren', description: 'Vorgebeugt bei 45°, Stange vom Boden, zieh zur unteren Brust. Rückenvolumen ist essenziell für einen dicken Rücken und ausgewogene Muskulatur.' },
    { name: 'Beinpresse', muscles: 'Quadrizeps, Gesäß, Waden', sets: '3×12', difficulty: 'Anfänger', description: 'An der Beinpresse: Füße schulterbreit, senke auf 90°, dann drücke. Ideal, um Beinvolumen aufzubauen, ohne die Wirbelsäule zu belasten.' },
    { name: 'Face Pull', muscles: 'Hintere Schulter, Rotatorenmanschette, Rhomboiden', sets: '3×20', difficulty: 'Alle Niveaus', description: 'Hoher Kabelzug, zieh das Seil zum Gesicht und spreize die Hände. Essenziell für die Schultergesundheit und zum Ausgleich des Bankdrück-Volumens.' },
  ],
  program: [
    {
      week: 'Woche 1–2',
      theme: 'Technik lernen',
      sessions: [
        { name: 'Push A: Brust + Schultern', detail: 'Bankdrücken 4×8, Schulterdrücken 3×10, Dips 3×12, Seitheben 3×15' },
        { name: 'Pull A: Rücken + Bizeps', detail: 'Kreuzheben 4×5, Klimmzüge 4×AMRAP, Langhantelrudern 3×10, Curls 3×12' },
        { name: 'Beine: Quadrizeps + Beinbeuger', detail: 'Kniebeuge 4×8, RDL 3×10, Beinpresse 3×12, Waden 4×15' },
      ],
    },
    {
      week: 'Woche 3–4',
      theme: 'Hypertrophie — Progressive Überlastung',
      sessions: [
        { name: 'Push B: Hohes Volumen', detail: 'Schrägbank 4×10, Dips mit Gewicht 3×8, Cable Fly 3×15, Kurzhantel-Schulterdrücken 4×12' },
        { name: 'Pull B: Fokus Rückenbreite', detail: 'Klimmzüge mit Gewicht 4×6, Sitzendes Rudern 4×12, Face Pull 3×20, Hammer-Curl 3×15' },
        { name: 'Beine B: Kraft + Volumen', detail: 'Schwere Kniebeuge 5×5, Hackenschmidt-Kniebeuge 3×12, Beinstrecker 3×15, GHR 3×10' },
      ],
    },
    {
      week: 'Woche 5–6',
      theme: 'Intensivierung — Krafttest',
      sessions: [
        { name: 'Ganzkörper Kraft', detail: 'Kniebeuge 5×3, Bank 5×3, Kreuzheben 5×3 — maximale Lasten mit voller Pause' },
        { name: 'Ganzkörper Hypertrophie', detail: 'Antagonisten-Supersätze, 4×12, 60 s Pause — hohes Gesamtvolumen' },
        { name: 'AMRAP-Check', detail: 'Max-Wiederholungstest bei 75% 1RM auf Kniebeuge / Bank / Kreuzheben — Fortschritt messen' },
      ],
    },
    {
      week: 'Woche 7–8',
      theme: 'Deload & Wiederaufbau',
      sessions: [
        { name: 'Volumen reduziert −40%', detail: 'Gleiche Übungen, leichte Lasten — Erholung von Sehnen und Nervensystem' },
        { name: 'Mobilität + Rumpf', detail: 'Yoga-Kraft, Schulterblattarbeit, Plank und Anti-Rotation' },
        { name: '1RM-Testtag', detail: '1-Wiederholungs-Maximum auf Kniebeuge, Bank und Kreuzheben, um den nächsten Zyklus festzulegen' },
      ],
    },
  ],
  faq: [
    { q: 'Wie oft pro Woche sollte ich trainieren?', a: '3–4 Einheiten/Woche reichen für 90% der Kraftziele. Mehr ist nicht immer besser — Erholung ist so wichtig wie der Reiz.' },
    { q: 'Brauche ich Supplemente?', a: 'Nicht zwingend. Kreatin und Whey-Protein sind die einzigen wissenschaftlich für die Leistung validierten Supplemente. Priorisiere zuerst die Ernährung.' },
    { q: 'Wie lange bis ich Ergebnisse sehe?', a: 'Die ersten neuronalen Veränderungen (Kraft) treten in 2–3 Wochen auf. Sichtbare Muskelveränderungen brauchen 6–12 Wochen, je nach Genetik und Ernährung.' },
    { q: 'Wie vermeide ich Plateaus?', a: 'Variiere Übungen, Volumen, Intensität und Pausenzeiten. Unsere Xenotif®-KI passt dein Programm automatisch an, um Gewöhnung zu verhindern.' },
    { q: 'Kann man gleichzeitig Muskeln aufbauen und Fett verlieren?', a: 'Ja, als Anfänger oder nach einer langen Pause (Körper-Rekomposition). Es erfordert hohe Proteinzufuhr und ein leichtes Kaloriendefizit von 100–200 kcal.' },
  ],
}

/* ── HIIT ──────────────────────────────────────────────────────── */
const hiitContent: DisciplineContent = {
  tagline: 'Verbrenne 500 kcal in 25 Minuten. Wissenschaftlich belegt.',
  heroStat: '2.100+ aktive Mitglieder',
  guide: {
    technique: {
      emoji: '⚡',
      title: 'HIIT-Prinzipien',
      items: [
        'Belastungs-/Pausenverhältnis: 1:1 für Anfänger (20 s Arbeit / 20 s Pause), 2:1 für Fortgeschrittene',
        'Zielintensität: 85–95% HFmax während der Arbeitsphasen — sonst ist es kein HIIT',
        'Priorisiere Grundübungen: Burpees, Squat Jumps, Mountain Climbers, Sprints',
        'Empfohlene Gesamtdauer: 15–25 Min — längere Einheiten sind nicht effektiver',
        'EPOC (Nachbrenneffekt) verbrennt 24–48 h nach einer guten HIIT-Einheit weiter Kalorien',
      ],
    },
    equipment: {
      emoji: '🏃',
      title: 'Benötigte Ausrüstung',
      items: [
        'Null Ausrüstung nötig — HIIT mit dem eigenen Körpergewicht ist so effektiv wie das Studio',
        'Studio-Option: Rudergerät, Assault Bike, TRX, um die Reize zu variieren',
        'Ein Herzfrequenzmesser, um sicherzustellen, dass du in der richtigen Intensitätszone bleibst',
        'Eine Bodenmatte für Bodenübungen (Burpees, Mountain Climbers)',
        'Eine Timer-App (Interval Timer) — Xenotif® enthält voreingestellte HIIT-Timer',
      ],
    },
    nutrition: {
      emoji: '🍌',
      title: 'HIIT-Ernährung',
      items: [
        'Leichter Snack 30–60 Min vorher: Banane, Toast mit Mandelmus',
        'Vermeide schwere Mahlzeiten in den 2 h vor einer Einheit — Übelkeitsrisiko',
        'Hydration ist entscheidend: 500 ml Wasser vorher, während trinken, wenn die Einheit > 20 Min dauert',
        'Nach dem HIIT: Kombi aus Kohlenhydraten + Protein innerhalb von 30 Min (Whey-Shake + Obst)',
        'Koffein (schwarzer Kaffee, Pre-Workout) verbessert die HIIT-Leistung um 10–15%',
      ],
    },
    recovery: {
      emoji: '🧘',
      title: 'Erholung zwischen den Einheiten',
      items: [
        'Maximal 3–4 HIIT-Einheiten / Woche — wechsle mit lockeren Tagen ab',
        'Cool-down 5–10 Min Gehen + dynamisches Dehnen nach der Einheit',
        'Tägliches HIIT führt in 2–3 Wochen zu Übertraining — respektiere deine freien Tage',
        'Schlafqualität ist essenziell: spätes HIIT (< 3 h vor dem Bett) stört den Schlaf',
        'Kaltes Bad 10 Min oder kalte Dusche direkt nach der Einheit — reduziert Entzündungen',
      ],
    },
  },
  tips: [
    { icon: '🔥', title: 'Der EPOC-Effekt', body: 'Eine 20-Min-HIIT-Einheit verbrennt so viele Kalorien wie ein 45-Min-Lauf — und verbrennt dank des EPOC-Nachbrenneffekts 24 h später weiter.' },
    { icon: '📈', title: 'Progression ist Pflicht', body: 'Starte mit 30 s/30 s × 8 Runden. Erhöhe die Runden, bevor du die Intensität erhöhst. Zu schnell = Verletzung oder Burnout.' },
    { icon: '🎵', title: 'Musik pusht dich um 15%', body: 'Eine rhythmische Playlist bei 140–160 BPM verbessert die HIIT-Leistung deutlich. Lade deine Playlist vor jeder Einheit.' },
    { icon: '🧪', title: 'Variiere die Protokolle', body: 'Tabata (20/10), EMOM, Pyramide, AMRAPs — der Wechsel der Formate verhindert Gewöhnung und durchbricht Plateaus.' },
  ],
  videos: [
    {
      youtubeIds: ['5C8Ew76sxVY'],
      title: '20-Min-HIIT — Totaler Fettverbrenner',
      description: 'Eine HIIT-Einheit für Anfänger ohne Ausrüstung — verbrenne Fett, baue Ausdauer auf, verbessere die Fitness.',
      duration: '20 Min',
      level: 'Anfänger',
    },
    {
      youtubeIds: ['J8EeluUr4ak'],
      title: 'Low-Impact-HIIT — Ganzkörper',
      description: 'Ein 20-Min-HIIT mit niedriger Intensität, ohne Springen — ideal zum Start oder um deine Gelenke zu schonen.',
      duration: '20 Min',
      level: 'Anfänger',
    },
    {
      youtubeIds: ['fIuACtB2ZZs'],
      title: '20-Min-HIIT — Ohne Ausrüstung',
      description: 'Ein komplettes HIIT-Workout für Anfänger — Körpergewicht, Ganzkörper, schnelle Ergebnisse.',
      duration: '20 Min',
      level: 'Fortgeschritten',
    },
    {
      youtubeIds: ['V4MqB6q3w44'],
      title: 'Tabata 24 Min — Erfahren-Niveau',
      description: 'Eine intensive Tabata-Einheit für erfahrene Athleten — 24 Minuten hochintensive Arbeit.',
      duration: '24 Min',
      level: 'Erfahren',
    },
    {
      youtubeIds: ['1u5eO7AvPjk'],
      title: 'Ganzkörper-Tabata 24 Min',
      description: 'Ein kompletter Tabata-Circuit: Ganzkörper, 24 Minuten, ohne Ausrüstung — verbrennt Kalorien und pusht das Cardio.',
      duration: '24 Min',
      level: 'Fortgeschritten',
    },
    {
      youtubeIds: ['aoKrGARP634'],
      title: 'Tabata + Kraft 42 Min',
      description: 'Eine Kombination aus Tabata und Krafttraining in 42 Minuten — das Beste aus beiden Welten für die Fitness.',
      duration: '42 Min',
      level: 'Erfahren',
    },
  ],
  exercises: [
    { name: 'Burpees', muscles: 'Ganzkörper, Cardio', sets: '3×15', difficulty: 'Fortgeschritten', description: 'Aus dem Stand in die Hocke, Hände aufsetzen, Beine nach hinten in die Liegestützposition, ein Liegestütz, Füße zurück, springen. Die ultimative HIIT-Übung.' },
    { name: 'Mountain Climbers', muscles: 'Bauch, Hüftbeuger, Cardio', sets: '3×30 s', difficulty: 'Anfänger', description: 'Hohe Plank-Position, treibe die Knie abwechselnd mit maximaler Geschwindigkeit zur Brust. Halte die Hüfte stabil und tief.' },
    { name: 'Squat Jumps', muscles: 'Quadrizeps, Gesäß, explosives Cardio', sets: '3×15', difficulty: 'Fortgeschritten', description: 'Kniebeuge auf 90°, dann explosiv nach oben springen, Arme treiben hoch. Lande weich mit gebeugten Knien. Baut Kraft und Cardio gleichzeitig auf.' },
    { name: 'Knieheben (High Knees)', muscles: 'Hüftbeuger, Cardio', sets: '3×30 s', difficulty: 'Anfänger', description: 'Laufe auf der Stelle und treibe die Knie auf Hüfthöhe. Arme im Rhythmus bei 90°. Ein tolles HIIT-Aufwärmen oder Cardio-Intensivierer.' },
    { name: 'Ice Skaters', muscles: 'Gesäß, Abduktoren, Cardio-Koordination', sets: '3×20/Seite', difficulty: 'Fortgeschritten', description: 'Springe seitlich von einem Fuß auf den anderen wie ein Eisläufer. Berühre mit der Hand gegenüber dem Standfuß den Boden. Trainiert Seitwärtsbewegung und Cardio.' },
    { name: 'Klatsch-Liegestütze', muscles: 'Brust, Trizeps, Explosivität', sets: '3×10', difficulty: 'Erfahren', description: 'Explosiver Liegestütz mit Händeklatschen in der Luft vor der Landung. Erfordert eine solide Basis regulärer Liegestütze. Baut Oberkörperkraft auf.' },
    { name: 'Box Jumps', muscles: 'Quadrizeps, Waden, explosives Cardio', sets: '4×10', difficulty: 'Fortgeschritten', description: 'Springe auf eine Box, fange in einer halben Kniebeuge ab. Steig außen herunter. Progressive Höhe: 40, 50, 60, 70 cm je nach Niveau.' },
    { name: 'Dynamische Plank', muscles: 'Bauch, Schultern, Rumpf', sets: '3×30 s', difficulty: 'Fortgeschritten', description: 'Aus der hohen Plank abwechselnd auf die Unterarme ab und wieder hoch. Halte die Hüfte stabil und vermeide das Rotieren des Beckens.' },
    { name: '30-m-Sprint', muscles: 'Max Cardio, Quadrizeps, Waden', sets: '10×30 m', difficulty: 'Erfahren', description: 'Sprinte mit 100% Höchstgeschwindigkeit über 30 Meter. Volle Erholung (90 s) zwischen jedem. Baut anaerobe Leistung und Spitzengeschwindigkeit auf.' },
  ],
  program: [
    {
      week: 'Woche 1–2',
      theme: 'Einführung — Intensität entdecken',
      sessions: [
        { name: 'Tabata-Intro 4×4 Min', detail: 'Kniebeuge, Mountain Climber, Jumping Jack, Plank — 20 s aktiv / 10 s Pause' },
        { name: 'AMRAP-Circuit 15 Min', detail: '5 Burpees + 10 Squat Jumps + 15 Mountain Climbers — so viele Runden wie möglich' },
        { name: 'Aktive Erholung', detail: 'Zügiges Gehen 30 Min + Mobilitäts-Yoga 15 Min' },
      ],
    },
    {
      week: 'Woche 3–4',
      theme: 'Progression — Intensität 85% HFmax',
      sessions: [
        { name: 'EMOM 20 Min', detail: 'Jede Minute: 10 Burpees + 15 Squat Jumps — fertig sein, bevor die Minute um ist' },
        { name: 'Pyramiden-HIIT', detail: '30/30 → 40/20 → 50/10 → 40/20 → 30/30 — 3 volle Zyklen' },
        { name: 'Sprint-Pyramide', detail: '10-20-30-40-30-20-10 m Sprints mit voller Erholung dazwischen' },
      ],
    },
    {
      week: 'Woche 5–6',
      theme: 'Leistung — Grenzen verschieben',
      sessions: [
        { name: 'Death by Burpees', detail: 'Minute 1: 1 Burpee. Minute 2: 2 Burpees. Weiter, bis du das Tempo nicht halten kannst' },
        { name: 'Partner-WOD', detail: '3 Runden: 50 Squat Jumps + 40 Liegestütze + 30 Sit-ups + 20 Burpees — zu zweit' },
        { name: 'HIIT-VO2max-Test', detail: 'Yo-Yo-Level-1-Protokoll — Cardio-Bewertung zur Feinjustierung deiner Arbeitszonen' },
      ],
    },
    {
      week: 'Woche 7–8',
      theme: 'Erhalt & Festigung',
      sessions: [
        { name: '„Best of“-Circuit', detail: 'Deine 3 Lieblingsübungen der vorherigen Wochen — 5 Runden bei max. Intensität' },
        { name: 'Woche der aktiven Erholung', detail: 'Volumen um 50% reduziert — Fitness halten ohne Überlastung' },
        { name: 'Leistungs-Check', detail: 'Cooper-Test + Tabata-Test + Körpermaße — Gesamtbewertung' },
      ],
    },
  ],
  faq: [
    { q: 'Ist HIIT effektiv zum Abnehmen?', a: 'Ja — die Kombination aus hohem Kalorienverbrauch + EPOC-Nachbrenneffekt macht es zu einem der besten Werkzeuge zum Abbau von Körperfett, besonders Bauchfett.' },
    { q: 'Kann man jeden Tag HIIT machen?', a: 'Nein — der Körper braucht 48 h, um sich von einer echten HIIT-Einheit zu erholen. 3–4 Einheiten/Woche mit aktiven Ruhetagen sind das empfohlene Maximum.' },
    { q: 'Ist HIIT für Anfänger geeignet?', a: 'Ja, solange du mit sanften Protokollen (30 s/30 s) und gelenkschonenden Übungen (ohne Springen) startest. Unser Anfängerprogramm ist über 4 Wochen progressiv.' },
    { q: 'Wie viele Kalorien verbrennt eine HIIT-Einheit?', a: 'Zwischen 300 und 600 kcal für 20–30 Min, je nach Gewicht und Intensität — dank EPOC mehr als 45 Min Laufen.' },
  ],
}

/* ── Radfahren ─────────────────────────────────────────────────── */
const cyclismeContent: DisciplineContent = {
  tagline: 'Vom Rennfahrer bis zum Bergkletterer — ein Plan für jedes Rad.',
  heroStat: '1.500+ aktive Radfahrer',
  guide: {
    technique: {
      emoji: '🚴',
      title: 'Tritttechnik',
      items: [
        'Optimale Trittfrequenz: 85–95 RPM in der Ebene, 70–80 RPM bergauf',
        'Sitzposition: lass dein Bike-Fitting alle paar Jahre von einem Profi prüfen',
        'Drücken UND ziehen — denke ans „Auskratzen“ am unteren Totpunkt, um die Leistung zu maximieren',
        'Aero-Position: senke den Oberkörper schrittweise — jede 5 cm sparen 20–30 W Luftwiderstand',
        'Schalte vor dem Anstieg — nie, während du im Gang stark drückst',
      ],
    },
    equipment: {
      emoji: '⚙️',
      title: 'Leistungsausrüstung',
      items: [
        'Ein Wattmesser — das präziseste Werkzeug zur Quantifizierung des Trainings (ab 400 €)',
        'Ein Herzfrequenzmesser (Brustgurt genauer als am Handgelenk)',
        'Ein zertifizierter Aero-Helm + Brille mit UV-Schutz',
        'SPD-SL-Schuhe mit ausgerichteten Cleats — verhindert Knieschmerzen',
        'Ein vernetzter Indoor-Trainer (Tacx, Wahoo) für das Wintertraining drinnen',
      ],
    },
    nutrition: {
      emoji: '🍝',
      title: 'Langstrecken-Ernährung',
      items: [
        'Carb-Loading 2 und 1 Tag vor einem Wettkampf: Pasta, Reis, Brot',
        'Auf dem Rad: 60–90 g Kohlenhydrate/Stunde bei Belastungen > 90 Min (Gel + Getränk + Riegel)',
        'Hausgemachtes Isogetränk: 500 ml Wasser + 30 g Maltodextrin + 1 g Salz + Zitronensaft',
        'Flaschen mit mindestens 750 ml — 2% Dehydrierung senken die Leistung um 10%',
        'Erholung: Reis + Hühnchen oder Pasta + Thunfisch innerhalb von 30 Min nach langer Anstrengung',
      ],
    },
    recovery: {
      emoji: '🔧',
      title: 'Erholung und Wartung',
      items: [
        'Lockeres Ausfahren 20–30 Min am Tag nach intensiver Belastung — aktive Durchblutung',
        'Beinmassage: konzentriere dich auf Quadrizeps, Beinbeuger, Waden und Gesäß',
        'Lege die Beine 15 Min nach einer langen Fahrt hoch, um Schwellungen zu reduzieren',
        'Radfahrer-Erholungsernährung: 4:1 Kohlenhydrat/Protein-Verhältnis in der ersten Stunde',
        'Warte das Rad nach jeder Regenfahrt: Kette, Bremsen, Felgen',
      ],
    },
  },
  tips: [
    { icon: '📡', title: 'Trainiere in Zonen', body: 'Zone 2 (65–75% FTP) für 80% des Volumens — die Zone, die Profis „den Weg zur Leistung“ nennen. Von 95% der Amateure unterschätzt.' },
    { icon: '🧱', title: 'FTP ist dein Kompass', body: 'Teste deine FTP (funktionelle Schwellenleistung) alle 4–6 Wochen mit einem 20-Min-All-out-Test. Alle deine Zonen leiten sich daraus ab.' },
    { icon: '🌬️', title: 'Aerodynamik regiert', body: 'In der Ebene bei 35 km/h sind 80% des Widerstands aerodynamisch. Senke deinen Oberkörper, bevor du eine Carbon-Felge kaufst.' },
    { icon: '🏔️', title: 'Klettere in Watt', body: 'Am Anstieg ziele auf ein konstantes W/kg-Verhältnis — vermeide Antritte, die deine Reserven leeren. Eine gleichmäßige Anstrengung ist immer ökonomischer.' },
  ],
  videos: [
    {
      youtubeIds: ['NnFGvxDoutY', 'oTZh4uyfxQA'],
      title: 'FTP und Trainingszonen im Radsport',
      description: 'Die Grundlagen des strukturierten Radtrainings — FTP, Leistungszonen und wie du sie zum Fortschritt nutzt.',
      duration: '18 Min',
      level: 'Alle Niveaus',
    },
    {
      youtubeIds: ['TTGkXtfzUxk', 'IvhYkLSm_pQ'],
      title: 'Zonen 1 bis 7 — Einrichtung & kompletter Leitfaden',
      description: 'Einrichten und Nutzen deiner Leistungszonen mit Wattmesser — ein kompletter Praxisleitfaden.',
      duration: '22 Min',
      level: 'Fortgeschritten',
    },
    {
      youtubeIds: ['IKhK5RQ2RXI', 'D0rZ1ecC8c0'],
      title: 'Trainingszonen — Alles verstehen',
      description: 'Was Zonen sind, warum man sie nutzt und wie sie den Amateur-Radsport verändern.',
      duration: '20 Min',
      level: 'Erfahren',
    },
    {
      youtubeIds: ['5e5qS3t17gg', '2BQD-khdL1Y'],
      title: 'HIIT Indoor Cycling — Zwift-Workout',
      description: 'Eine Indoor-HIIT-Einheit auf dem Trainer — Aufbau eines Intervalltrainings mit Zwift.',
      duration: '30 Min',
      level: 'Fortgeschritten',
    },
    {
      youtubeIds: ['_NQE6XbcTcA', 'tX_b-hkCEAA'],
      title: 'Einstieg ins Indoor Cycling',
      description: 'Ein kompletter Leitfaden für den Einstieg ins Indoor Cycling — Ausrüstung, Einrichtung, erste strukturierte Einheiten.',
      duration: '16 Min',
      level: 'Anfänger',
    },
    {
      youtubeIds: ['17HZsFrbZLs', 'Z5tTDRfbs50'],
      title: 'Indoor Cycling — 30-Min-Intervalle',
      description: 'Eine 30-minütige Einheit mit progressiven Intervallen auf dem Indoor-Bike — perfekt für schnellen Fortschritt.',
      duration: '30 Min',
      level: 'Fortgeschritten',
    },
  ],
  exercises: [
    { name: 'Einbeiniges Treten', muscles: 'Quadrizeps, Gesäß, Tritttechnik', sets: '3×2 Min/Bein', difficulty: 'Alle Niveaus', description: 'Tritt 2 Minuten nur mit einem Bein, das andere ruht am Rahmen. Deckt Schwachstellen im Tretzyklus auf und korrigiert Leistungsasymmetrien.' },
    { name: '30-s-Bike-Sprints', muscles: 'Anaerobe Leistung, Quadrizeps, Waden', sets: '8×30 s', difficulty: 'Fortgeschritten', description: 'Maximaler Sprint für 30 Sekunden, 4 Min lockeres Ausrollen zur Erholung. Baut Spitzenleistung und die Fähigkeit auf, im Finale zu beschleunigen.' },
    { name: 'Sweet Spot 2×20 Min', muscles: 'Schwellenausdauer, Herz-Kreislauf', sets: '2×20 Min', difficulty: 'Fortgeschritten', description: 'Tritt 20 Minuten bei 88–95% deiner FTP mit 5 Min Pause dazwischen. Das beste Nutzen/Ermüdungs-Verhältnis für den Radfortschritt.' },
    { name: 'Kadenz-Drills 100+ RPM', muscles: 'Technik, muskuläre Effizienz', sets: '5×3 Min', difficulty: 'Anfänger', description: 'Tritt mit hoher Kadenz (100+ RPM) in einem leichten Gang 3 Min lang. Verbessert die Rundheit des Tretzyklus und reduziert die Kniebelastung.' },
    { name: 'Bulgarische Kniebeuge (Cross-Training)', muscles: 'Quadrizeps, Gesäß, Stabilität', sets: '3×10/Bein', difficulty: 'Fortgeschritten', description: 'Hinterer Fuß auf einer Bank, senke in einen tiefen Ausfallschritt. Stärkt die Beine asymmetrisch und korrigiert die im Radsport häufigen Links/Rechts-Ungleichgewichte.' },
    { name: 'Plank Rumpf', muscles: 'Rumpf, Lendenstabilität', sets: '3×45 s', difficulty: 'Anfänger', description: 'Stütze auf Unterarmen und Zehen, Körper in gerader Linie. Ein starker Rumpf lässt dich die Beinkraft effizient aufs Rad übertragen.' },
    { name: 'Hüftbeuger-Dehnung', muscles: 'Psoas, Hüftbeuger', sets: '3×60 s/Seite', difficulty: 'Alle Niveaus', description: 'In einem tiefen Ausfallschritt halte die Position und längere den Psoas. Durch Radfahren verkürzte Hüftbeuger reduzieren die Leistung und erhöhen das Risiko von Rückenschmerzen.' },
    { name: 'Berg-Intervalle 5 Min', muscles: 'Leistung-zu-Gewicht, Schwellen-Cardio', sets: '5×5 Min', difficulty: 'Erfahren', description: 'An einem echten oder simulierten Anstieg (Steigung > 5%) halte eine Kadenz von 70–75 RPM bei 95–100% FTP. Baut das für das Klettern essenzielle Leistung-zu-Gewicht-Verhältnis auf.' },
  ],
  program: [
    {
      week: 'Woche 1–2',
      theme: 'Aerobe Basis',
      sessions: [
        { name: 'Z2-Ausdauer 90 Min', detail: '90 RPM Kadenz, HF 65–75% HFmax — überschreite die Zone nicht' },
        { name: 'VO2max-Intervalle 4×8 Min', detail: 'Bei 106–120% FTP, 4 Min Erholung dazwischen — VO2max-Entwicklung' },
        { name: 'Aktive Erholung 60 Min', detail: 'Sehr lockeres Z1-Ausrollen zur Durchblutung ohne Ermüdung' },
      ],
    },
    {
      week: 'Woche 3–4',
      theme: 'Schwelle & Sweet Spot',
      sessions: [
        { name: 'Sweet Spot 2×20 Min', detail: 'Bei 88–95% FTP mit 5 Min Pause — das optimale Nutzen/Ermüdungs-Verhältnis' },
        { name: 'Kadenz-Drills', detail: 'Wechsle 100+ RPM / 60 RPM alle 3 Min über 60 Min gesamt' },
        { name: 'Simulierter Gran Fondo 3 h', detail: 'Lange Fahrt mit 40 Min Sweet Spot eingebaut — wettkampfspezifische Ausdauer' },
      ],
    },
    {
      week: 'Woche 5–6',
      theme: 'Hohe Intensivierung',
      sessions: [
        { name: 'VO2max 5×5 Min', detail: '110–120% FTP, 5 Min Erholung — hebt die aerobe Decke an' },
        { name: 'Neuromuskuläre Sprints 10×10 s', detail: 'Maximale Leistung, volle 5 Min Erholung — Sprint-Leistungsentwicklung' },
        { name: 'FTP-Test 20 Min', detail: 'Maximale gehaltene 20-Min-Anstrengung — Neukalibrierung aller Zonen' },
      ],
    },
    {
      week: 'Woche 7–8',
      theme: 'Tapering & Leistung',
      sessions: [
        { name: 'Volumen −30%, Intensität gehalten', detail: 'Reduziere das Volumen, aber nicht die Intensität — Superkompensation' },
        { name: 'Wettkampftempo-Intervalle 3×10 Min', detail: 'Simulation des Renntempos — mental und körperlich bereit' },
        { name: 'Lockere Fahrt 2 h', detail: 'Landschaft, Spaß, freie Beine — frisch am Wettkampftag ankommen' },
      ],
    },
  ],
  faq: [
    { q: 'Indoor oder Outdoor — was ist effektiver?', a: 'Indoor (Trainer) ist pro Trainingsstunde effektiver, weil es keine Totzeiten gibt (Ampeln, Abfahrten). Outdoor ist besser für Technik und Motivation. Beides zu kombinieren ist ideal.' },
    { q: 'Welche Leistung brauche ich, um mit Rennen anzufangen?', a: 'Ein W/kg von 2,5–3 reicht, um mit Jedermann-Rennen anzufangen. Mit 6 Monaten strukturiertem Training sind 3–3,5 W/kg erreichbar.' },
    { q: 'Wie viele Stunden pro Woche, um voranzukommen?', a: 'Mindestens 8 h/Woche für spürbaren Fortschritt. Profis fahren 20–25 h. Dazwischen sind 12–15 h der Sweet Spot für ambitionierte Amateure.' },
    { q: 'Brauche ich im Winter einen Indoor-Trainer?', a: 'Sehr empfehlenswert — der Winter ist die ideale Zeit, um die aerobe Basis (Z2) ohne die Gefahren der Straße aufzubauen. Zwift oder RGT machen das Indoor-Fahren motivierend.' },
  ],
}

/* ── Schwimmen ─────────────────────────────────────────────────── */
const natationContent: DisciplineContent = {
  tagline: 'Technik, Effizienz, Leistung — das Wasser lügt nie.',
  heroStat: '900+ aktive Schwimmer',
  guide: {
    technique: {
      emoji: '🏊',
      title: 'Schwimmtechnik',
      items: [
        'Hydrodynamische Position: Kopf in einer Linie mit dem Körper, Blick zum Beckenboden',
        'Hüftrotation von 45° bei jedem Armzug — die Hauptquelle der Kraft',
        'Maximale Armstreckung, bevor die Hand ins Wasser eintaucht — „erreiche die Wand mit den Fingerspitzen“',
        'Beine: kleine schnelle Schläge aus der Hüfte, Knie leicht gebeugt',
        'Wende (Rollwende): Wand bei 1 m berühren, Rolle, explosiver Abstoß — spart 2–3 s / 100 m',
      ],
    },
    equipment: {
      emoji: '🥽',
      title: 'Schwimmausrüstung',
      items: [
        'Anti-Beschlag-Brille passend zu deiner Gesichtsform',
        'Eine Silikonkappe, um den Widerstand zu reduzieren und die Haare zu schützen',
        'Ein Pull-Buoy zwischen den Oberschenkeln für reine Arm-Sätze',
        'Handpaddles, um den Zug zu stärken und die Armtechnik zu verbessern',
        'Eine Schwimmuhr (Garmin Swim), um Bahnen, SWOLF und Zeiten zu verfolgen',
      ],
    },
    nutrition: {
      emoji: '💧',
      title: 'Hydration und Ernährung',
      items: [
        'Wasser dämpft das Durstgefühl — trinke aktiv, auch ohne Durst',
        'Hauptmahlzeit 2 h vor der Einheit: langsame Kohlenhydrate + leichtes Protein',
        'Trinkflasche oder Isogetränk am Beckenrand für Einheiten > 60 Min',
        'Nüchterne Einheiten sind beim Schwimmen nicht empfohlen — ein stabiler Blutzucker ist essenziell',
        'Nach dem Schwimmen: schnelles Protein (Whey) + einfache Kohlenhydrate innerhalb von 30 Min',
      ],
    },
    recovery: {
      emoji: '♨️',
      title: 'Erholung im Wasser',
      items: [
        'Langsames Ausschwimmen 200–400 m am Ende der Einheit — venös-muskulärer Rückfluss',
        'Dehne Schultern und Brust — die im Kraul am meisten genutzten Bereiche',
        'Whirlpool oder warmes Bad nach der Einheit, um Rücken- und Schultermuskeln zu entspannen',
        'Massiere Schultern und Nacken 2× /Woche — Vorbeugung von Rotatorenmanschetten-Tendinitis',
        'Mindestens 24 h zwischen zwei intensiven Einheiten — auch die Atemmuskeln brauchen Erholung',
      ],
    },
  },
  tips: [
    { icon: '📐', title: 'SWOLF ist dein Verbündeter', body: 'SWOLF = Zeit (Sekunden) + Anzahl der Züge pro Bahn. Deinen SWOLF-Wert zu senken bedeutet, effizienter zu sein — besser, als auf die Uhr zu schauen.' },
    { icon: '🌊', title: 'Widerstand verändert alles', body: 'Wasser ist 800× dichter als Luft. Eine kleine technische Verbesserung (Eintauchwinkel, Rotation) kann 5–10 s pro 100 m sparen, ganz ohne Fitnesszuwachs.' },
    { icon: '🎯', title: 'Gezielte Drills', body: 'Verbringe 20–30% jeder Einheit mit technischen Drills (Catch-up, Finger Drag, hoher Ellbogen) — effektiver, als eine Stunde hart zu schwimmen.' },
    { icon: '🤿', title: 'Unterwasservideo', body: 'Filme dich (oder lass dich filmen) einmal im Monat unter Wasser. Die Selbstanalyse deckt Fehler auf, die auf der Stoppuhr unsichtbar sind.' },
  ],
  videos: [
    {
      youtubeIds: ['6_vXycbD2TM', 'WciCYtnGbkM'],
      title: 'Kraulen lernen — Schritt für Schritt',
      description: 'Ein kompletter Kraul-Leitfaden für Anfänger: Körperposition, Armbewegung, Atmung und Beine.',
      duration: '22 Min',
      level: 'Anfänger',
    },
    {
      youtubeIds: ['OAvy6-XiYng', 'AQy_c30lNjI'],
      title: 'Kraultechnik — Masterclass',
      description: 'Eine detaillierte Analyse der Kraultechnik von einem verbandszertifizierten Coach.',
      duration: '18 Min',
      level: 'Fortgeschritten',
    },
    {
      youtubeIds: ['DUpfLigoWEc', '0BELcjhKOlc'],
      title: 'Anfänger-Kraul — Schnell lernen',
      description: 'Eine schnelle Methode, um das Kraulen zu meistern — die häufigsten Fehler in einem Video korrigiert.',
      duration: '16 Min',
      level: 'Anfänger',
    },
    {
      youtubeIds: ['K5RMFjHBPHE'],
      title: 'Die 4 besten Rückenschwimm-Drills',
      description: 'Vier gezielte Übungen, um deine Rückenschwimm-Technik zu verbessern — Rotation, Armeintauchen, Position.',
      duration: '12 Min',
      level: 'Fortgeschritten',
    },
    {
      youtubeIds: ['WiMMuE7P7P4'],
      title: '3 essenzielle Brustschwimm-Drills',
      description: 'Drei Schlüsselübungen, um dein Brustschwimmen zu perfektionieren — Arm-Bein-Koordination, Gleiten und Timing.',
      duration: '10 Min',
      level: 'Alle Niveaus',
    },
    {
      youtubeIds: ['aU7sdctpxck'],
      title: 'Meistere das Rückenschwimmen — 6 Drills',
      description: 'Sechs progressive Übungen, um das Rückenschwimmen von den Grundlagen bis zum fortgeschrittenen Niveau zu meistern.',
      duration: '18 Min',
      level: 'Erfahren',
    },
  ],
  exercises: [
    { name: 'Catch-up-Kraul-Drill', muscles: 'Schultern, Latissimus, Armtechnik', sets: '6×50 m', difficulty: 'Alle Niveaus', description: 'Schwimme und warte, bis die führende Hand die andere berührt, bevor du den nächsten Arm startest. Verbessert die Armstreckung und die Hüftrotation.' },
    { name: 'Beine mit Schwimmbrett', muscles: 'Knöchelbeuger, Quadrizeps, Beinschlagtechnik', sets: '4×25 m', difficulty: 'Anfänger', description: 'Halte das Brett mit ausgestreckten Armen vor dir und arbeite nur mit den Beinen. Kleine schnelle Schläge aus der Hüfte, Knie leicht gebeugt.' },
    { name: 'Arme mit Pull-Buoy', muscles: 'Schultern, Latissimus, Brust', sets: '4×50 m', difficulty: 'Anfänger', description: 'Pull-Buoy zwischen den Oberschenkeln, arbeite nur mit den Armen. Maximaler Fokus auf den Zug im Wasser und das Fassen am Anfang des Zugs.' },
    { name: 'Isolierte Rollwende', muscles: 'Wendetechnik, Bauch', sets: '3×10 Wenden', difficulty: 'Fortgeschritten', description: 'Nähere dich der Wand bei 1 m, mach die volle Rolle und stoße dich kräftig von der Wand ab. Übe die Wenden zuerst außerhalb des Wassers. Kann 2–3 s pro 100 m sparen.' },
    { name: 'Intervalle 10×100 m', muscles: 'Aerobe Ausdauer, Herz-Kreislauf', sets: '10×100 m', difficulty: 'Fortgeschritten', description: 'Schwimme 100 m bei 85% deiner Höchstgeschwindigkeit, starte alle 2 Min. Zähle deine Bahnen und stoppe jede 100 m, um die Konstanz zu verfolgen.' },
    { name: '50-m-Sprints', muscles: 'Höchstgeschwindigkeit, Armkraft', sets: '8×50 m', difficulty: 'Erfahren', description: 'Start mit Sprung oder Abstoß, sprinte mit 100% über 50 m. Volle 2 Min Erholung dazwischen. Baut Spitzengeschwindigkeit und Explosivität im Wasser auf.' },
    { name: 'Schwimmen mit Paddles', muscles: 'Wasserzug-Kraft, Schultern, Rücken', sets: '4×50 m', difficulty: 'Fortgeschritten', description: 'Paddles an den Händen, um die Zugfläche zu vergrößern. Verbessert Kraft und Wassergefühl. Nicht für mehr als 20% des Gesamtvolumens nutzen.' },
    { name: 'Langsames technisches Brustschwimmen', muscles: 'Ganzkörperkoordination, Hüfte, Knie', sets: '6×50 m', difficulty: 'Alle Niveaus', description: 'Sehr langsames Brustschwimmen mit Betonung des Gleitens: Nach jedem Zug strecken sich die Arme nach vorn und die Beine schließen — halte das Gleiten mindestens 2 s.' },
    { name: 'Rückenschwimmen', muscles: 'Trapez, Latissimus, Schultern, Koordination', sets: '4×50 m', difficulty: 'Anfänger', description: 'Auf dem Rücken, Armeintauchen in Schulterlinie, Hüftrotation bei 45°. Blick zur Decke, Ohren im Wasser. Trainiert die Rücken-Arm-Koordination.' },
  ],
  program: [
    {
      week: 'Woche 1–2',
      theme: 'Kraultechnik',
      sessions: [
        { name: 'Drill-Einheit 1.500 m', detail: 'Aufwärmen 400 m + 6×100 m Drills (Catch-up, 6-3-6, Finger Drag) + 400 m Ausschwimmen' },
        { name: 'Rückenschwimm-Technik', detail: 'Arbeit an Amplitude + Hüftrotation + Armeintauchen — 1.200 m gesamt' },
        { name: 'Kraul-Ausdauer 2.000 m', detail: 'Durchgehend in komfortablem Tempo — Fokus auf gleichmäßigen Zug' },
      ],
    },
    {
      week: 'Woche 3–4',
      theme: 'Geschwindigkeit und Intervalle',
      sessions: [
        { name: 'Intervalle 10×100 m', detail: 'Bei 85% Höchstgeschwindigkeit, Start alle 2 Min — Arbeit an der aeroben Schwelle' },
        { name: 'Brustschwimm-Technik', detail: 'Wellenbewegung + Arm-Bein-Gleit-Koordination — 1.000 m Technik + 500 m frei' },
        { name: 'Freiwasser-Simulation', detail: 'Schwimme im Becken ohne die Leinen zu berühren: Orientieren + simulierter Massenstart' },
      ],
    },
    {
      week: 'Woche 5–6',
      theme: 'Leistung',
      sessions: [
        { name: '50-m-Sprints × 20', detail: 'Start alle 90 s — Leistung und Schwimmgeschwindigkeit über kurze Distanz' },
        { name: 'Triathlon-Set 3 × 750 m', detail: 'Mit simulierten Wechseln am Beckenrand — Triathlon-Vorbereitung' },
        { name: '1.500-m-Zeitfahren', detail: 'Durchgehender All-out-Schwimm — Vergleich mit Woche 1, um den Fortschritt zu messen' },
      ],
    },
    {
      week: 'Woche 7–8',
      theme: 'Tapering & Freiwasser',
      sessions: [
        { name: 'Volumen −25% + kurze Sprints', detail: 'Halte die Spritzigkeit, ohne Ermüdung anzusammeln — Frische für den Wettkampftag' },
        { name: 'Echte Freiwasser-Einheit', detail: 'See oder Meer: Orientieren, kaltes Wasser, Bojen — Simulation unter realen Bedingungen' },
        { name: '400-m-Benchmark-Test', detail: 'All-out 400-m-Kraul-Zeitfahren — finale Leistungsreferenz des Zyklus' },
      ],
    },
  ],
  faq: [
    { q: 'Meine Beine sinken — wie behebe ich das?', a: 'Sinkende Beine kommen oft von einem zu hoch gehaltenen Kopf oder einem zu kräftigen Beinschlag. Arbeite mit dem „Torpedo“-Drill (Arme an den Seiten, Kopf im Wasser), um die Position zu korrigieren.' },
    { q: 'Wie oft sollte ich schwimmen, um voranzukommen?', a: 'Mindestens 3 Einheiten/Woche für sichtbaren technischen Fortschritt. Schwimmen ist eine sehr technische Aktivität — Wiederholung ist der Schlüssel.' },
    { q: 'Ich bin nach 50 m müde — ist das normal?', a: 'Ja, für einen Anfänger — es ist ein technisches, kein körperliches Problem. Arbeite zuerst an der beidseitigen Atmung und am Entspannen im Wasser. Die Fitness kommt danach.' },
    { q: 'Hilft Schwimmen für andere Sportarten?', a: 'Ja — es entwickelt Lungenkapazität, Schultermobilität und Körpergefühl. Eine exzellente Ergänzung für Laufen, Radfahren und aktive Erholung.' },
  ],
}

/* ── CrossFit ──────────────────────────────────────────────────── */
const crossfitContent: DisciplineContent = {
  tagline: 'Im Feuer geschmiedet. Jeden Tag getestet.',
  heroStat: '1.800+ aktive Athleten',
  guide: {
    technique: {
      emoji: '🏋️',
      title: 'Fundamentale Bewegungen',
      items: [
        'Die 9 fundamentalen CrossFit-Bewegungen müssen beherrscht werden, bevor man schwer lädt',
        'Snatch und Clean & Jerk: technische Arbeit allein für mindestens 4–6 Wochen, bevor Gewicht hinzukommt',
        'Gymnastik-Skills: strikte Klimmzüge zuerst, Kipping danach — Kraft geht dem Kip voraus',
        'Box Jumps: auf der Box landen, außen heruntersteigen (Kniesicherheit)',
        'Double-Unders: hab Geduld — 3–6 Monate bis zur Beherrschung, aber jeden Fehlversuch wert',
      ],
    },
    equipment: {
      emoji: '🔗',
      title: 'CrossFit-Ausrüstung',
      items: [
        'Vielseitige Schuhe (Nike Metcon, Reebok Nano) — ein Kompromiss zwischen Stabilität und Laufen',
        'Ein Olympia-Gürtel für Kreuzheben und schwere Überkopfbewegungen',
        'Grip-Pads oder Handschützer für Kipping-Stangen — Blasenprävention',
        'Ein Speed-Springseil (Stahlkabel) für Double-Unders',
        'Loses Magnesia — essenziell für Langhantel-Workouts und beladene Klimmzüge',
      ],
    },
    nutrition: {
      emoji: '🥗',
      title: 'Treibstoff für CrossFit',
      items: [
        'CrossFit ist anaerob-aerob: schnelle Kohlenhydrate vor dem WOD (Banane, Reis)',
        'Protein 2 g/kg/Tag — der Muskelwiederaufbau nach dem WOD ist intensiv',
        'Kreatin 5 g/Tag — messbare Verbesserungen bei Kraftbewegungen',
        'Beta-Alanin für lange WODs (> 10 Min) — reduziert die Muskelazidose',
        'Hydration: vorher/nachher wiegen — jedes verlorene kg = 1 L Wasser ersetzen',
      ],
    },
    recovery: {
      emoji: '🏥',
      title: 'CrossFit-Erholung',
      items: [
        'Cool-down ist Pflicht: 10 Min Mobilität + 5 Min Atmung nach jedem intensiven WOD',
        'Eis auf empfindliche Gelenke (Handgelenke, Schultern, Knie) nach dem Workout',
        'Foam Rolling auf den verspannten Bereichen: Brust, Hüften, Beinbeuger',
        'Maximal 2 aufeinanderfolgende Tage ohne Ruhe — CrossFit baut so viel ab, wie es aufbaut',
        'Schlaf: IGF-1 (insulinähnlicher Wachstumsfaktor) erfordert mindestens 7,5 h erholsamen Schlaf',
      ],
    },
  },
  tips: [
    { icon: '🎯', title: 'Skaliere klug', body: 'Es ist keine Schande, ein WOD zu skalieren. „Fran“ in 12 Min mit angepassten Lasten zu machen ist sinnvoller, als 25 Min mit zu viel Gewicht zu leiden.' },
    { icon: '⏱️', title: 'Strategie schlägt Fitness', body: 'Ein WOD aufzuteilen (Sätze von 10 → 7-3, 21er → 12-9), bevor du ermüdest, ist immer schneller, als all-out zu gehen und einzubrechen.' },
    { icon: '📓', title: 'Protokolliere jedes WOD', body: 'Notiere deine Zeit, Lasten und Notizen. Ein Benchmark-WOD zu wiederholen, das Ziel zum Schlagen kennend, ist der Antrieb Nr. 1 für Fortschritt.' },
    { icon: '🤝', title: 'Die Community ist das Programm', body: 'Der Box-Effekt — mit anderen zu trainieren — verbessert die Leistung im Schnitt um 20%. Freundschaftlicher Wettbewerb ist das beste Pre-Workout.' },
  ],
  videos: [
    {
      youtubeIds: ['mLDxJTk6xj8'],
      title: '9 fundamentale CrossFit-Übungen',
      description: 'Beherrsche die 9 Grundbewegungen, bevor du in WODs eintauchst — ein Leitfaden für absolute Anfänger.',
      duration: '20 Min',
      level: 'Anfänger',
    },
    {
      youtubeIds: ['nJWMnyTaU0Y'],
      title: 'Top 5 Anfänger-Benchmark-WODs',
      description: 'Die 5 Referenz-WODs, die man zum CrossFit-Start kennen sollte — Strategie und Skalierung erklärt.',
      duration: '15 Min',
      level: 'Anfänger',
    },
    {
      youtubeIds: ['XwmDh9qQtTc'],
      title: '3 CrossFit-WODs ohne Ausrüstung',
      description: 'Drei CrossFit-Einheiten mit dem eigenen Körpergewicht für zu Hause — effektiv, kein Equipment nötig.',
      duration: '25 Min',
      level: 'Fortgeschritten',
    },
    {
      youtubeIds: ['tCbRldfx7jk'],
      title: 'Ich habe das Murph-WOD ausprobiert',
      description: 'Ein kompletter Erfahrungsbericht zum Murph-WOD — Vorbereitung, Strategie und wie es sich danach anfühlte.',
      duration: '18 Min',
      level: 'Alle Niveaus',
    },
    {
      youtubeIds: ['M_ry-0rLRoc'],
      title: 'Murph-Hero-WOD — Komplette Demonstration',
      description: 'Ein kompletter Durchlauf des Murph-WODs mit Strategietipps, Pacing und Aufteilung, um es zu schaffen.',
      duration: '22 Min',
      level: 'Erfahren',
    },
    {
      youtubeIds: ['j77_rHevrm4'],
      title: 'Live-Tipps für das Murph',
      description: 'Detaillierte Strategie für das Murph-WOD — optimale Aufteilung, Energiemanagement und Tipps zum Durchhalten.',
      duration: '20 Min',
      level: 'Fortgeschritten',
    },
  ],
  exercises: [
    { name: 'Thrusters', muscles: 'Quadrizeps, Gesäß, Schultern, Trizeps', sets: '5×5', difficulty: 'Fortgeschritten', description: 'Front-Rack-Kniebeuge, dann Schulterdrücken über Kopf in einer durchgehenden Bewegung. Die „Königs“-CrossFit-Übung — eine Kniebeuge und ein Schulterdrücken kombiniert.' },
    { name: 'Kipping-Klimmzüge', muscles: 'Latissimus, Bizeps, Bauch', sets: '5×10', difficulty: 'Fortgeschritten', description: 'Klimmzug mit Körperschwung zur Maximierung der Effizienz bei langen WODs. Beherrsche zuerst strikte Klimmzüge, bevor du zum Kipping wechselst, um die Schultern zu schützen.' },
    { name: 'Box Jumps', muscles: 'Quadrizeps, Waden, Rumpf, Explosivität', sets: '5×10', difficulty: 'Alle Niveaus', description: 'Springe mit beiden Füßen auf die Box, fange in einer halben Kniebeuge ab, steig außen herunter. Starte bei 40 cm und steigere dich. Ein CrossFit-WOD-Klassiker.' },
    { name: 'Snatch-Technik', muscles: 'Ganzkörper, Koordination, Power', sets: '4×3', difficulty: 'Erfahren', description: 'Der olympische Snatch — von der Stange am Boden bis zum Overhead-Lockout in einer explosiven Bewegung. Technische Arbeit ist essenziell vor dem Laden. Starte mit der leeren Stange.' },
    { name: 'Double-Unders', muscles: 'Waden, Koordination, Cardio', sets: '5×50', difficulty: 'Fortgeschritten', description: 'Das Seil läuft bei jedem Sprung zweimal unter den Füßen durch. Etwas höhere Sprünge als bei Singles, sehr schnelle Handgelenke. 3–6 Monate Übung bis zur Beherrschung.' },
    { name: 'Wall Balls', muscles: 'Quadrizeps, Gesäß, Schultern, Koordination', sets: '5×15', difficulty: 'Anfänger', description: 'Tiefe Kniebeuge, dann wirf den Medizinball (9/6 kg) auf das Ziel 3 m hoch. Fange den Ball beim Herunterkommen und verkette direkt. Baut allgemeine Muskelausdauer auf.' },
    { name: 'GHD-Sit-ups', muscles: 'Bauch, Hüftbeuger, Rückenstrecker', sets: '3×15', difficulty: 'Erfahren', description: 'An der GHD-Maschine bis zur Horizontalen absenken und mit den Bauchmuskeln zurückkommen. Starte mit kleinem Bewegungsumfang — intensiver Muskelkater für Anfänger.' },
    { name: 'Muscle-ups', muscles: 'Rücken, Trizeps, Brust, Koordination', sets: '3×3', difficulty: 'Erfahren', description: 'Aus dem Hang kombiniere einen Klimmzug und einen Dip in einer Bewegung, um über die Stange zu kommen. Erfordert eine solide Basis an Klimmzügen und Dips vor der Progression zu diesem Ziel.' },
    { name: 'Clean & Jerk', muscles: 'Ganzkörper, Power, olympische Technik', sets: '4×3', difficulty: 'Erfahren', description: 'Das olympische Umsetzen und Stoßen in zwei Phasen — Clean (Boden zum Rack), dann Jerk (Stange über Kopf). Die Bewegung, die High-Level-CrossFit definiert. Technik vor Last.' },
    { name: 'Burpee Box Jumps', muscles: 'Ganzkörper, Cardio, Explosivität', sets: '4×10', difficulty: 'Fortgeschritten', description: 'Ein klassischer Burpee, dann auf die Box springen statt in die Luft. Kombiniert Burpee-Ausdauer und Box-Jump-Power. Häufig in Wettkampf-WODs.' },
  ],
  program: [
    {
      week: 'Woche 1–2',
      theme: 'Technik & Grundlagen',
      sessions: [
        { name: 'Skills: Progressiver Snatch', detail: 'Nur Stange → 40 kg → 60% 1RM — Technik zuerst, 45 Min + leichtes WOD 10 Min' },
        { name: 'WOD: Scaled Fran', detail: '21-15-9: Thrusters (35/25 kg) + Klimmzüge — Ziel < 10 Min' },
        { name: 'Gymnastik: HSPU-Drills', detail: 'Wall Walk + negative HSPU + Pike Push-up — 4×5 progressiv' },
      ],
    },
    {
      week: 'Woche 3–4',
      theme: 'Volumen & Intensität',
      sessions: [
        { name: 'WOD: Murph 50%', detail: '50 Klimmzüge, 100 Liegestütze, 150 Kniebeugen + 1 Meile Lauf — freie Aufteilung, mit Weste wenn möglich' },
        { name: 'Barbell Cycling 20 Min', detail: 'Clean & Jerk: EMOM 3 Wdh bei 70% 1RM — Technik unter Ermüdung' },
        { name: 'WOD: Death by Pull-ups', detail: 'Minute 1: 1 Klimmzug. Weiter bis zum Versagen — testet die Gymnastik-Ausdauer' },
      ],
    },
    {
      week: 'Woche 5–6',
      theme: 'Benchmarks & Rekorde',
      sessions: [
        { name: 'Benchmark: Grace', detail: '30 Clean & Jerks (60/40 kg) auf Zeit — Ziel < 5 Min für RX' },
        { name: 'Open-WOD-Simulation', detail: 'WOD im Open-Stil mit 20-Min-AMRAP-Struktur — Wettkampftraining' },
        { name: 'Test: Chest-to-bar max unbroken', detail: 'Bewerte C2B-Klimmzüge, Bar Muscle-up und TTB — Gymnastik-Ausgangswert' },
      ],
    },
    {
      week: 'Woche 7–8',
      theme: 'Peaking & Wettkampf',
      sessions: [
        { name: 'Reduziertes Volumen + Skills', detail: 'Fokus auf identifizierte Schwächen — Double-Unders, Pistol Squats, Snatch Balance' },
        { name: 'WOD-PR-Test', detail: 'Wiederhole ein WOD aus Woche 1–2, um den Fortschritt zu messen — Pflicht-Benchmark' },
        { name: 'Fun-Community-WOD', detail: 'Gruppen-WOD, leichtes Gewicht, Spaß — beende den Zyklus mit guter Energie' },
      ],
    },
  ],
  faq: [
    { q: 'Ist CrossFit gefährlich?', a: 'Nein, wenn gut gecoacht. Das Verletzungsrisiko im CrossFit ist vergleichbar mit klassischem Studiotraining. Technik geht immer vor Last oder Geschwindigkeit — Skalieren ist immer die richtige Wahl.' },
    { q: 'Muss ich schon fit sein, um anzufangen?', a: 'Nein — jeder beginnt CrossFit mit Skalieren. Die Programmierung ist universell; nur die Lasten und Modifikationen variieren je nach Niveau.' },
    { q: 'Wie viele WODs pro Woche?', a: '3 WODs/Woche sind ideal für Anfänger. 4–5 für Fortgeschrittene mit einem Mobilitätstag. Athleten auf Wettkampfniveau machen 5–6 Einheiten + aktive Erholung.' },
    { q: 'Hilft CrossFit beim Abnehmen?', a: 'Ja — die Kombination aus Kraft, Cardio und variabler Intensität verbrennt 500–800 kcal/Einheit und erzeugt einen deutlichen EPOC. Mit guter Ernährung kombiniert ist es sehr effektiv.' },
  ],
}

/* ── Yoga ──────────────────────────────────────────────────────── */
const yogaContent: DisciplineContent = {
  tagline: 'Flexibilität, innere Stärke und Gelassenheit — auf und neben der Matte.',
  heroStat: '2.900+ aktive Praktizierende',
  guide: {
    technique: {
      emoji: '🧘',
      title: 'Technik & Ausrichtung',
      items: [
        'Körperausrichtung: Ohren, Schultern, Hüften und Knöchel in derselben Achse in stehenden Posen',
        'Ujjayi-Atmung — langsamer Atem durch die Nase, Kehle leicht kontrahiert, mit jeder Bewegung synchronisiert',
        'Aktiviere die Bauch-Bandha (Uddiyana), um den unteren Rücken bei Beugen und Streckungen zu schützen',
        'Posturale Progression: erzwinge nie eine Pose — nutze Blöcke und Gurte, um den Umfang anzupassen',
        'Halte jede Pose 5 bis 10 Atemzüge — das Halten über die Zeit ist sinnvoller als die Tiefe',
      ],
    },
    equipment: {
      emoji: '🛒',
      title: 'Empfohlene Ausrüstung',
      items: [
        'Eine rutschfeste Matte 4–6 mm (TPE oder Naturkautschuk) — essenziell für Stabilität und Gelenkkomfort',
        'Zwei Yoga-Blöcke (Kork oder Schaum), um Posen an deine aktuelle Flexibilität anzupassen',
        'Ein Yoga-Gurt für Vorbeugen und hüftöffnende Posen',
        'Ein zylindrisches Bolster für restoratives Yoga und passive Erholungsposen',
        'Eng anliegende, atmungsaktive Kleidung (keine weite Kleidung, die deine Ausrichtung verbirgt)',
      ],
    },
    nutrition: {
      emoji: '🥗',
      title: 'Ernährung & Hydration',
      items: [
        'Praktiziere nüchtern oder mindestens 2 h nach einer Mahlzeit — ein voller Magen behindert Drehungen und Umkehrhaltungen',
        'Sanfte Hydration: trinke 300–400 ml Wasser vor der Einheit, nicht während aktiver Posen',
        'Grüner Tee oder Ingwer-Zitronen-Aufguss 30 Min vor der Praxis zur Verdauungsförderung',
        'Nach der Einheit: eine leichte Mahlzeit reich an pflanzlichem Protein (Linsen, Quinoa, Tofu) zur Erholung',
        'Vermeide raffinierten Zucker und Alkohol an Tagen intensiver Praxis — sie verstärken Entzündungen',
      ],
    },
    recovery: {
      emoji: '💆',
      title: 'Erholung & Wohlbefinden',
      items: [
        'Savasana ist Pflicht 5–10 Min am Ende jeder Einheit — dann integriert der Körper die Arbeit',
        'Yoga Nidra (Schlaf-Yoga) 20 Min ersetzt laut Studien 1 h konventionellen Schlaf',
        'Selbstmassage von Füßen und Waden mit einem Tennisball nach stehenden Einheiten',
        'Eine warme Dusche nach der Praxis, um tiefe Muskelverspannungen zu lösen',
        'Ein Praxistagebuch: notiere, wie du dich nach jeder Einheit fühlst, um deinen subtilen Fortschritt zu verfolgen',
      ],
    },
  },
  tips: [
    { icon: '🌬️', title: 'Der Atem ist König', body: 'Wenn du die Kontrolle über deinen Atem verlierst, bist du über deine Grenze hinausgegangen. Der Atem führt die Pose — nie umgekehrt.' },
    { icon: '📅', title: 'Beständigkeit > Dauer', body: '20 Minuten jeden Tag verwandeln den Körper in 4 Wochen. Eine Stunde einmal pro Woche bewirkt wenig dauerhafte Veränderung.' },
    { icon: '🧠', title: 'Yoga = Gehirntraining', body: 'MRT-Studien zeigen, dass 8 Wochen regelmäßige Praxis das Volumen des präfrontalen Kortex erhöhen und Angst um 40% reduzieren.' },
    { icon: '🔄', title: 'Wechsle Yin und Yang', body: 'Wechsle dynamisches Yoga (Vinyasa, Ashtanga) und passives Yoga (Yin, restorativ) während der Woche, um Stärkung und Erholung auszugleichen.' },
  ],
  videos: [
    {
      youtubeIds: ['v7AYKMP6rOE', 'e_OolrYHidY'],
      title: 'Anfänger-Yoga — 30-Min-Flow',
      description: 'Eine komplette Yoga-Sequenz für Anfänger — fundamentale Posen, Ausrichtung und Atmung Schritt für Schritt geführt.',
      duration: '30 Min',
      level: 'Anfänger',
    },
    {
      youtubeIds: ['2zCYsv4f4z0', 'AXcdWvE3GsA'],
      title: 'Vinyasa-Flow 45 Min',
      description: 'Ein Vinyasa-Flow für Fortgeschrittene — Atem-Bewegungs-Verbindung, Hüftöffnung und Rumpfkräftigung.',
      duration: '45 Min',
      level: 'Fortgeschritten',
    },
    {
      youtubeIds: ['4pKly2JojMw', '5bNLz6nlkIo'],
      title: 'Morgen-Yoga — Sanftes Erwachen',
      description: 'Eine 20-minütige Morgensequenz, um den Körper zu wecken, Energie zu aktivieren und sich auf den Tag vorzubereiten.',
      duration: '20 Min',
      level: 'Alle Niveaus',
    },
    {
      youtubeIds: ['VaoV1PrYft4', '0Uoe4v1wsjc'],
      title: 'Yin Yoga — Tiefe Öffnung',
      description: 'Ein 40-minütiges Yin Yoga mit Fokus auf Hüften und unteren Rücken — lange gehaltene Posen für Faszien und Bänder.',
      duration: '40 Min',
      level: 'Alle Niveaus',
    },
    {
      youtubeIds: ['pJHRhk7ozlQ'],
      title: 'Power Yoga — Erfahren-Niveau',
      description: 'Eine fortgeschrittene Yoga-Sequenz mit Umkehrhaltungen, Handbalancen und anspruchsvollen Kraftposen.',
      duration: '50 Min',
      level: 'Erfahren',
    },
    {
      youtubeIds: ['UEP4HQ7_Eo0', 'x0to9WbMxrg', 'BCfzvOZ7rI4', 'vdMdqZ6slpM'],
      title: 'Abend-Yoga — Entspannen & schlafen',
      description: 'Ein 30-minütiges restoratives Yoga, um zu entspannen, die Spannung des Tages zu lösen und tiefen Schlaf zu fördern.',
      duration: '30 Min',
      level: 'Anfänger',
    },
  ],
  exercises: [
    { name: 'Herabschauender Hund (Adho Mukha)', muscles: 'Beinbeuger, Waden, Schultern, Rücken', sets: '5 Atemzüge', difficulty: 'Anfänger', description: 'Aus der Plank schiebe die Hüften zur Decke und bilde ein umgekehrtes V. Fersen Richtung Boden, Rücken gelängt. Eine Referenzpose, die zugleich dehnt und stärkt.' },
    { name: 'Krieger I (Virabhadrasana I)', muscles: 'Quadrizeps, Gesäß, Hüftbeuger', sets: '5–8 Atemzüge/Seite', difficulty: 'Anfänger', description: 'Vorderer Fuß bei 90°, hinterer Fuß bei 45°, vorderes Knie über dem Knöchel. Arme erhoben, Schultern entspannt. Stärkt die Beine und öffnet die Brust.' },
    { name: 'Krieger II (Virabhadrasana II)', muscles: 'Quadrizeps, Gesäß, Abduktoren, Schultern', sets: '5–8 Atemzüge/Seite', difficulty: 'Anfänger', description: 'Füße auf einer Linie, vorderes Knie in Linie mit dem Fuß. Arme horizontal, Blick über die vordere Hand. Baut Beinkraft und Fokus auf.' },
    { name: 'Dreieck (Trikonasana)', muscles: 'Beinbeuger, schräge Bauchmuskeln, Hüftbeuger', sets: '5 Atemzüge/Seite', difficulty: 'Fortgeschritten', description: 'Beine weit, Oberkörper seitlich geneigt, untere Hand am Schienbein oder Boden. Eine Drehung, die die Brust öffnet. Verbessert seitliche Flexibilität und Gleichgewicht.' },
    { name: 'Plank (Phalakasana)', muscles: 'Bauch, Schultern, Gesäß, ganzer Rumpf', sets: '3×30–60 s', difficulty: 'Anfänger', description: 'Körper in gerader Linie, Handgelenke unter den Schultern. Spanne Bauch, Gesäß und Beine an. Die Yoga-Plank stärkt, ohne den unteren Rücken zu komprimieren.' },
    { name: 'Krähe (Bakasana)', muscles: 'Bauch, Trizeps, Unterarme, Gleichgewicht', sets: '3×5 Atemzüge', difficulty: 'Erfahren', description: 'In der Hocke setze die Knie auf die gebeugten Arme, neige den Oberkörper nach vorn und hebe die Füße. Stärkt Rumpf und Arme tief. Eine ikonische Balancepose.' },
    { name: 'Stellung des Kindes (Balasana)', muscles: 'Unterer Rücken, Gesäß, Schultern (Dehnung)', sets: '1–3 Min', difficulty: 'Alle Niveaus', description: 'Auf den Fersen sitzend strecke die Arme nach vorn oder neben den Körper. Löse Rücken und Schultern vollständig. Eine Ruhe- und Erholungspose zwischen Sequenzen.' },
    { name: 'Brücke (Setu Bandha)', muscles: 'Gesäß, Beinbeuger, Wirbelsäule', sets: '3×10 Atemzüge', difficulty: 'Anfänger', description: 'Auf dem Rücken liegend, Knie gebeugt, schiebe die Hüften zur Decke. Drücke die Füße in den Boden. Öffnet die Brust, stärkt das Gesäß und dehnt die Wirbelsäule.' },
    { name: 'Sitzende Drehung (Ardha Matsyendrasana)', muscles: 'Schräge Bauchmuskeln, Rückenstrecker, Hüfte', sets: '5 Atemzüge/Seite', difficulty: 'Fortgeschritten', description: 'Auf dem Boden sitzend, ein Fuß außerhalb des gegenüberliegenden Knies, drehe den Oberkörper. Entgiftet die Bauchorgane und verbessert die Brustwirbel-Mobilität.' },
    { name: 'Baum (Vrksasana)', muscles: 'Knöchelstabilisatoren, Gesäß', sets: '5 Atemzüge/Seite', difficulty: 'Anfänger', description: 'Auf einem Bein stehend, der andere Fuß am Schienbein oder Oberschenkel. Hände im Gebet oder Arme erhoben. Baut Propriozeption und mentalen Fokus auf.' },
  ],
  program: [
    {
      week: 'Woche 1–2',
      theme: 'Grundlagen — Basisposen',
      sessions: [
        { name: 'Anfänger-Flow 30 Min', detail: 'Sonnengruß A × 5, Krieger I & II, herabschauender Hund, Kindspose' },
        { name: 'Yin Yoga 40 Min', detail: 'Schmetterling, halber Frosch, liegende Drehung — Posen 3–5 Min je gehalten' },
        { name: 'Morgen-Yoga 20 Min', detail: 'Aufwachsequenz: Katze-Kuh, herabschauender Hund, tiefe Ausfallschritte, Brücke' },
      ],
    },
    {
      week: 'Woche 3–4',
      theme: 'Stärkung & Gleichgewicht',
      sessions: [
        { name: 'Vinyasa-Flow 45 Min', detail: 'Sonnengruß B, Krieger III, Dreieck, seitliche Plank, Chaturanga' },
        { name: 'Core-Yoga 30 Min', detail: 'Plank, Boot, halbes Boot, seitliche Plank, Boot-Crunches — tiefe Stärkung' },
        { name: 'Restoratives Yoga 40 Min', detail: 'Posen gestützt durch Bolster/Blöcke — Hüften und unteren Rücken lösen' },
        { name: 'Sitzmeditation 15 Min', detail: 'Pranayama (5/5 Herzkohärenz) + Body Scan — mentale Erdung' },
      ],
    },
    {
      week: 'Woche 5–6',
      theme: 'Umkehrhaltungen & Vertiefung',
      sessions: [
        { name: 'Fortgeschrittenes Yoga — Umkehrhaltungen 50 Min', detail: 'Schulterstand-Vorbereitung, halber Kopfstand an der Wand, Krähe, Schulteröffnung am Boden' },
        { name: 'Teilweise Ashtanga-Primärserie 60 Min', detail: 'Stehend + sitzend bis Navasana — dynamische, rigorose Praxis' },
        { name: 'Yin & restorativ 45 Min', detail: 'Lange passive Yin-Posen, um die Intensität des Vinyasa auszugleichen' },
      ],
    },
    {
      week: 'Woche 7–8',
      theme: 'Integration & Eigenständigkeit',
      sessions: [
        { name: 'Selbstgeführte Praxis 45 Min', detail: 'Erstelle deine eigene Sequenz mit den gelernten Posen — kultiviere dein intuitives Bewegungsgefühl' },
        { name: 'Schlüsselposen-Workshop', detail: 'Fokus auf eine fortgeschrittene Pose deiner Wahl: Hüftöffnung, Umkehrhaltung oder Armbalance' },
        { name: 'Yoga Nidra 30 Min', detail: 'Tiefe geführte Entspannung — volle Integration des 8-Wochen-Zyklus' },
        { name: 'Flexibilitäts- & Kraft-Check', detail: 'Vorbeuge-Test, einbeiniges Gleichgewicht, max. Chaturanga — Fortschritt messen' },
      ],
    },
  ],
  faq: [
    { q: 'Muss ich flexibel sein, um Yoga zu machen?', a: 'Nein — Steifheit ist genau der Grund, mit Yoga anzufangen, kein Hindernis. Jede Pose ist mit Hilfsmitteln (Blöcke, Gurt) anpassbar. Die Flexibilität kommt mit der Praxis.' },
    { q: 'Was ist der Unterschied zwischen Vinyasa, Ashtanga und Yin Yoga?', a: 'Vinyasa ist dynamisch und kreativ (Atem-Bewegungs-Verbindung). Ashtanga folgt einer festen, sehr strukturierten Sequenz. Yin ist passiv und langsam (Posen 3–5 Min gehalten). Starte mit Vinyasa oder Hatha für eine gute Balance.' },
    { q: 'Wie oft sollte ich üben, um Ergebnisse zu sehen?', a: 'Mindestens 3 Einheiten/Woche à 30–45 Min. Flexibilitätsveränderungen treten in 3–4 Wochen auf. Vorteile bei Stress und Schlafqualität oft schon ab der ersten Woche.' },
    { q: 'Kann Yoga Krafttraining ersetzen?', a: 'Yoga entwickelt funktionelle Kraft, Mobilität und Muskelausdauer — komplementär, aber anders. Stile wie Ashtanga oder Rocket Yoga bieten ernsthafte Stärkung. Ideal ist es, beides zu kombinieren.' },
  ],
}

/* ── Boxen ─────────────────────────────────────────────────────── */
const boxingContent: DisciplineContent = {
  tagline: 'Kraft, Explosivität und Selbstkontrolle — im Ring geschmiedet.',
  heroStat: '1.800+ aktive Boxer',
  guide: {
    technique: {
      emoji: '🥊',
      title: 'Technik & Deckung',
      items: [
        'Orthodoxe Auslage (linker Fuß vorn) oder Southpaw (rechter Fuß vorn) — dein dominanter Fuß bestimmt die natürliche Auslage',
        'Grundposition: Füße schulterbreit + 45°, 55% des Gewichts auf dem hinteren Bein für Mobilität',
        'Jab — gerader Schlag mit der Führhand, Arm gestreckt, Schulter angehoben zum Schutz des Kinns',
        'Cross — Schlag mit der hinteren Hand mit voller Hüftrotation — 70% der Kraft kommt aus der Hüftdrehung',
        'Kopfbewegung (Slip, Roll) ist so wichtig wie das Schlagen — sie schützt und schafft Öffnungen',
      ],
    },
    equipment: {
      emoji: '🛒',
      title: 'Essenzielle Ausrüstung',
      items: [
        'Boxhandschuhe (10–12 oz für allgemeines Training, 16 oz für Sparring) — schützt Handgelenke und Partner',
        'Handbandagen 4,5 m — Pflicht unter den Handschuhen zur Stütze von Handgelenk und Gelenken',
        'Ein individuell angepasster Mundschutz — der Schutz Nr. 1 gegen Gehirnerschütterungen und Zahnfrakturen',
        'Ein Boxsack (schwer 40–60 kg für Kraft, leicht 20 kg für Schnelligkeit und Technik)',
        'Ein Springseil — das effektivste Cardio- und Koordinationstool im Boxen',
      ],
    },
    nutrition: {
      emoji: '🥩',
      title: 'Ernährung des Boxers',
      items: [
        'Mahlzeit vor dem Training 2 h vorher: Reis + mageres Protein + Gemüse — stabile Energie ohne Schwere',
        'Hydration: mindestens 600 ml Wasser pro Trainingsstunde — Dehydrierung verlangsamt die Reflexe',
        'Protein: 2–2,2 g/kg/Tag, um die Muskelmasse während eines Trainingsblocks zu erhalten',
        'Gewichtsmanagement: max. 500 kcal/Tag Defizit — scharfe Gewichtsreduktionen senken die Kraft um 15%',
        'Erholung: Kollagen + Vitamin C nach der Einheit für die Gesundheit von Handgelenken, Ellbogen und Schultern',
      ],
    },
    recovery: {
      emoji: '💆',
      title: 'Erholung des Boxers',
      items: [
        'Kühle Handgelenke und Gelenke 10–15 Min nach jeder intensiven Einheit — Tendinitis-Prävention',
        'Aktives Dehnen von Schultern, Brust und Hüftbeugern nach der Einheit (10 Min)',
        'Agonist/Antagonist-Rotation: Schlagtag / Bein- + Rumpftag, um die Last zu verteilen',
        'Massiere die Unterarme und den Nacken — die im Boxen am stärksten verspannten Bereiche',
        'Erholsamer Schlaf: Reflexe und Koordination festigen sich in den Tiefschlafphasen',
      ],
    },
  },
  tips: [
    { icon: '⚡', title: 'Kraft kommt aus der Hüfte', body: 'Ein nur vom Arm erzeugter Cross sind 30% der Maximalkraft. Füge Hüft- und Rumpfrotation hinzu, um 100% deines Potenzials zu erreichen.' },
    { icon: '🧠', title: 'Denke in Kombinationen', body: 'Ein einzelner Schlag wird leicht ausgewichen. Kombinationen (1-2, 1-1-2, 1-2-3b) schaffen Öffnungen. Beherrsche 3 Kombinationen, bevor du neue lernst.' },
    { icon: '🦶', title: 'Beinarbeit ist der Schlüssel', body: 'Ein Boxer mit schlechter Beinarbeit kann weder effektiv angreifen noch verteidigen. Verbringe 30% deiner Zeit am Seil und mit Bewegung.' },
    { icon: '🎯', title: 'Qualität > Quantität am Sack', body: '100 saubere Treffer zu landen schlägt 500 schludrige. Jeder Schlag am Sack muss präzise, gut verankert sein, mit schneller Handrückführung.' },
  ],
  videos: [
    {
      youtubeIds: ['kKDHdsVN0b8', 'jhcIjFgz2bI', 'N0U5RPGpjSg'],
      title: 'Anfänger-Boxen — Technische Grundlagen',
      description: 'Eine komplette Einführung ins Boxen — Deckung, Jab, Cross, Haken und Uppercut für absolute Anfänger erklärt.',
      duration: '25 Min',
      level: 'Anfänger',
    },
    {
      youtubeIds: ['93r6lz1pbcw', 'NWEThzMnLq8'],
      title: 'Box-Kombinationen — Fortgeschritten',
      description: 'Lerne 10 essenzielle Kombinationen mit Sack- und Pratzenarbeit — garantierter Fortschritt.',
      duration: '30 Min',
      level: 'Fortgeschritten',
    },
    {
      youtubeIds: ['4hYDno0aaAI', 'bcupGtFmv7k'],
      title: '20-Min-Schattenboxen-Einheit',
      description: 'Ein komplettes Schattenbox-Workout — Beinarbeit, Kombinationen, Slips und Visualisieren des Gegners.',
      duration: '20 Min',
      level: 'Alle Niveaus',
    },
    {
      youtubeIds: ['l6Kvp6OZhEA', 'cpRoLtQaCu0'],
      title: 'Box-Cardio — Intensiver Fettverbrenner',
      description: 'Ein 35-minütiger Box-Cardio-Circuit — Kombinationen, Beinarbeit und athletische Drills für optimale Fitness.',
      duration: '35 Min',
      level: 'Fortgeschritten',
    },
    {
      youtubeIds: ['F7dRCzMDgXA', 'moQUBT4QUWs'],
      title: 'Kopfbewegung und Slips',
      description: 'Beherrsche den Slip, den Roll und das Bob & Weave — die Defensivbewegungen, die gute von großartigen Boxern trennen.',
      duration: '22 Min',
      level: 'Fortgeschritten',
    },
    {
      youtubeIds: ['bb1yVrGe3VU', 'D8DouKeOkfI'],
      title: 'Schlagkraft — Erfahren-Niveau',
      description: 'Entwickle deine Maximalkraft mit plyometrischen, rotatorischen und Schwersack-Schlagdrills.',
      duration: '40 Min',
      level: 'Erfahren',
    },
  ],
  exercises: [
    { name: 'Seilspringen', muscles: 'Cardio, Waden, Koordination, Rhythmus', sets: '10×1 Min / 30 s Pause', difficulty: 'Alle Niveaus', description: 'Einfache Sprünge in gleichmäßigem Rhythmus, fortschreitend zu Double-Unders und Crossovers. Das fundamentale Werkzeug jedes Boxers zur Verbesserung von Fuß-Hand-Auge-Koordination und Cardio.' },
    { name: 'Schattenboxen', muscles: 'Schultern, Cardio, Technik, Koordination', sets: '5×3 Min / 1 Min Pause', difficulty: 'Anfänger', description: 'Boxe in die Luft und visualisiere einen Gegner. Arbeite an Kombinationen, Beinarbeit, Slips und Flüssigkeit. Die technische Einheit schlechthin.' },
    { name: 'Schwersack — Kombinationen', muscles: 'Schultern, Brust, Trizeps, Rumpf, Cardio', sets: '6×3 Min / 1 Min Pause', difficulty: 'Fortgeschritten', description: 'Verkette voreingestellte Kombinationen (1-2, 1-2-3b, 1-2-lb) am Schwersack. Fokus auf Schlagqualität, schnelle Handrückführung und Hüftrotation.' },
    { name: 'Boxer-Liegestütze', muscles: 'Brust, Trizeps, Schultern, Rumpf', sets: '4×15', difficulty: 'Fortgeschritten', description: 'Ein klassischer Liegestütz mit einer Oberkörperrotation und Armstreckung in einen Uppercut am Ende. Stärkt die Schlagmuskeln und trainiert die Koordination.' },
    { name: 'Leiter-Beinarbeit', muscles: 'Waden, Koordination, Reaktionsgeschwindigkeit', sets: '3×4 Durchläufe', difficulty: 'Anfänger', description: 'Nutze eine Koordinationsleiter am Boden für Boxschritte (rein-raus, seitlich, Pivot). Verbessert die Bewegungsgeschwindigkeit und das dynamische Gleichgewicht in deiner Deckung.' },
    { name: 'Jump Squat mit Haken', muscles: 'Quadrizeps, Gesäß, Schultern, Explosivität', sets: '4×10', difficulty: 'Fortgeschritten', description: 'Geh in die Kniebeuge, explodiere nach oben und wirf beim Hochkommen einen imaginären Haken. Kombiniert Beinkraft und Schlagen — wie aus einem Clinch zu kommen und zu kontern.' },
    { name: 'Russian Twist', muscles: 'Schräge Bauchmuskeln, Bauch, Rumpfrotation', sets: '3×20', difficulty: 'Anfänger', description: 'Im V sitzend, Füße angehoben, drehe den Oberkörper rechts nach links und berühre bei jeder Seite den Boden. Die Rumpfrotation ist die Kraftquelle jedes seitlichen Schlags.' },
    { name: 'Medizinball-Slam', muscles: 'Schultern, Rücken, Bauch, Explosivität', sets: '4×12', difficulty: 'Fortgeschritten', description: 'Hebe den Medizinball über den Kopf und schlage ihn dann heftig auf den Boden. Simuliert die Kraft eines Overhands. Exzellent für Oberkörper-Explosivität.' },
    { name: 'Pratzen-Verteidigung', muscles: 'Reflexe, Koordination, Cardio', sets: '4×3 Min', difficulty: 'Erfahren', description: 'Gegenüber einem Partner, der die Pratzen hält, arbeite abwechselnd Schlag-Slip. Entwickelt peripheres Sehen, Reaktionsgeschwindigkeit und taktische Anpassung in Echtzeit.' },
  ],
  program: [
    {
      week: 'Woche 1–2',
      theme: 'Grundlagen — Deckung und Basisschläge',
      sessions: [
        { name: 'Anfänger-Technik 45 Min', detail: 'Deckung, Jab, Cross, Seitwärtsbewegung + 10 Min Basis-Seilspringen' },
        { name: 'Box-Cardio 30 Min', detail: 'Schattenboxen 3×3 Min + leichter Sack einfache Kombos (1-2) 4×2 Min' },
        { name: 'Athletisches Konditionieren 40 Min', detail: 'Seil 5 Min + Liegestütze 4×15 + Kniebeuge 4×15 + Rumpf 3×45 s + Dehnen' },
      ],
    },
    {
      week: 'Woche 3–4',
      theme: 'Kombinationen & Box-Cardio',
      sessions: [
        { name: 'Pratzen / Sack — Kombinationen', detail: '10 verschiedene Kombinationen rotierend am Schwersack — 6×3 Min mit 1 Min Pause' },
        { name: 'Leichtes Sparring (wenn Partner)', detail: '4×2 Min technisches Sparring bei 50% — Fokus nur auf Beinarbeit und Jab' },
        { name: 'Box-HIIT 25 Min', detail: 'Schattenboxen 30 s / 15 s Pause × 10, dann Boxer-Burpees 20 s / 10 s × 10' },
        { name: 'Funktionelle Stärkung', detail: 'Medizinball-Slam 4×12 + Russian Twist 3×20 + Boxer-Liegestütze 4×15' },
      ],
    },
    {
      week: 'Woche 5–6',
      theme: 'Kraft & Verteidigung',
      sessions: [
        { name: 'Schwersack-Kraft-Einheit', detail: 'Maximale Kraftarbeit: 5×3 Min Fokus auf Cross und Uppercut bei max. Intensität' },
        { name: 'Slips und Konter', detail: 'Slip/Roll als Antwort auf die Jabs des Partners + sofortiger 1-2-Konter — 6×2 Min' },
        { name: 'Ausdauer-Cardio 40 Min', detail: 'Seil 15 Min + Schattenboxen 15 Min + Sack 10 Min — moderate durchgehende Intensität' },
      ],
    },
    {
      week: 'Woche 7–8',
      theme: 'Sparring & Festigung',
      sessions: [
        { name: 'Volles Sparring 4×3 Min', detail: 'Volle taktische Anwendung — alle gelernten Schläge und Slips in einer realen Situation' },
        { name: 'Technisches Schärfen 45 Min', detail: 'Zurück zu den Grundlagen: Deckung, Jab, Beinarbeit — Präzision und Flüssigkeit verfeinern' },
        { name: 'Leistungs-Check', detail: 'Max. 3-Min-Seilspring-Test + Schlagkraft-Test mit Sensor + technische Bewertung' },
        { name: 'Aktive Erholung', detail: 'Yoga 30 Min + tiefes Schulter- und Handgelenk-Dehnen + Arm-Selbstmassage' },
      ],
    },
  ],
  faq: [
    { q: 'Ist Boxen für Anfänger gefährlich?', a: 'Box-Fitnesstraining (Sack, Schatten, Pratzen) ist sehr sicher und kontaktlos. Sparring erfordert volle Ausrüstung und einen kompetenten Coach. Boxen baut Selbstverteidigung und Selbstvertrauen auf.' },
    { q: 'Wie lange, um die Grundlagen zu lernen?', a: 'In 4 Wochen regelmäßiger Praxis (3 Einheiten/Woche) beherrschst du Deckung, Jab, Cross und Basis-Beinarbeit. Kombinationen und Verteidigung brauchen 3–6 Monate.' },
    { q: 'Verbrennt Boxen effektiv Fett?', a: 'Ja — eine 45-Min-Box-Einheit verbrennt je nach Intensität zwischen 500 und 800 kcal. Dank der Ganzkörperbeteiligung ist es eine der effektivsten Sportarten für den gesamten Kalorienverbrauch.' },
    { q: 'Brauche ich einen Partner, um zu boxen?', a: 'Nein — ein Boxsack, Schattenboxen und Springseil ermöglichen ein komplettes Solo-Workout. Ein Partner ist ein Plus (Pratzen, Sparring), aber keine Notwendigkeit, besonders am Anfang.' },
  ],
}

/* ── Stretching ────────────────────────────────────────────────── */
const stretchingContent: DisciplineContent = {
  tagline: 'Befreie deinen Körper, erhole dich besser und bewege dich ohne Schmerz.',
  heroStat: 'Beweglichkeit, Mobilität & Erholung',
  guide: {
    technique: {
      emoji: '🤸',
      title: 'Dehntechnik',
      items: [
        'Statisches Dehnen: 30–60 Sekunden halten, tief atmen, beim Ausatmen 20% der Spannung lösen',
        'PNF (Propriozeptive Neuromuskuläre Fazilitation): 6 s kontrahieren → lösen → vertiefen — 30% Umfanggewinn',
        'Dehne nie einen kalten Muskel — warte 5 Min leichtes Aufwärmen (Gehen, Rotation) vor jedem tiefen Dehnen',
        'Komfortschwelle: ein tolerierbares Spannungsgefühl, nie stechender Schmerz — Schmerz löst den Dehnreflex aus',
        'Dynamisches Dehnen vor der Anstrengung, statisches Dehnen danach — mische beides nicht in deiner Routine',
      ],
    },
    equipment: {
      emoji: '🛒',
      title: 'Empfohlene Ausrüstung',
      items: [
        'Eine dicke Bodenmatte (6–8 mm) für den Gelenkkomfort von Knien und Hüften',
        'Ein Dehngurt (oder Gürtel) für die Dehnung von Beinbeugern und Hüftbeugern',
        'Eine Faszienrolle für die myofasziale Lösung vor dem Dehnen',
        'Ein Lacrosse- oder Tennisball zum Massieren von Trigger Points an Waden und Fußgewölbe',
        'Ein Timer / eine App, um die Dehndauer einzuhalten — schätze nie nach Augenmaß',
      ],
    },
    nutrition: {
      emoji: '🍊',
      title: 'Ernährung für Flexibilität',
      items: [
        'Kollagen (10–15 g) + Vitamin C 30–60 Min vor intensiven Dehneinheiten für die Kollagensynthese',
        'Optimale Hydration: Faszien und Sehnen bestehen zu 70% aus Wasser — trinke mindestens 2 L pro Tag',
        'Magnesium (300–400 mg/Tag): reduziert Krämpfe und fördert tiefe Muskelentspannung',
        'Curcumin + schwarzer Pfeffer nach der Einheit: ein starker natürlicher Entzündungshemmer gegen Muskelkater',
        'Vermeide übermäßigen Kaffee an Tagen intensiven Dehnens — Koffein erhöht den Grundmuskeltonus',
      ],
    },
    recovery: {
      emoji: '💆',
      title: 'Integration & Erholung',
      items: [
        'Foam Rolling 5–10 Min vor dem Dehnen löst fasziale Einschränkungen und verstärkt die Mobilitätsgewinne',
        'Ein heißes Bad 20 Min (38–40 °C) vor der Einheit — Wärme erhöht die Kollagen-Elastizität um 15%',
        'Abendliches Dehnen → besserer Schlaf: parasympathische Dehnungen senken die Herzfrequenz',
        'Erhalte die Gewinne: 10 Min tägliches Dehnen schlägt eine intensive wöchentliche Einheit',
        'Progressive Überlastung in der Flexibilität: erhöhe den Umfang um 5% pro Woche — der Fortschritt ist linear, wenn regelmäßig',
      ],
    },
  },
  tips: [
    { icon: '🌡️', title: 'Warm = flexibler', body: 'Die Muskeltemperatur verbessert die Elastizität. Dehne nach dem Sport oder nach einem heißen Bad für 2× schnellere Gewinne.' },
    { icon: '📐', title: 'Die Atmung ist das Werkzeug', body: 'Bei jedem Ausatmen entspannen sich die Muskeln natürlich. Atme langsam aus, um „tiefer“ in die Dehnung zu gehen, ohne zu erzwingen.' },
    { icon: '🔄', title: 'Mobilität ≠ Flexibilität', body: 'Flexibilität ist passiv (wie weit du gehen kannst). Mobilität ist aktiv (wie weit du kontrollierst). Arbeite an beidem für funktionelle Flexibilität.' },
    { icon: '⏰', title: 'Beständigkeit regiert', body: '10 Minuten jeden Tag bringen in 3 Wochen Ergebnisse. Ohne Beständigkeit kehrt das Bindegewebe in 72 h zu seiner ursprünglichen Länge zurück.' },
  ],
  videos: [
    {
      youtubeIds: ['g_tea8ZNk5A', 'X4yWT6yqCJ8'],
      title: 'Ganzkörper-Stretching 30 Min',
      description: 'Ein komplettes Ganzkörper-Stretching-Programm in 30 Minuten — ideal nach dem Training oder abends zur Erholung.',
      duration: '30 Min',
      level: 'Alle Niveaus',
    },
    {
      youtubeIds: ['BYsfUroaCcw', '4JQ_oLV8c6Q'],
      title: 'Beinbeuger- & Rückendehnungen',
      description: 'Eine gezielte 25-Min-Routine, um verspannte Beinbeuger und Schmerzen im unteren Rücken zu lindern — Ergebnisse ab der ersten Einheit.',
      duration: '25 Min',
      level: 'Anfänger',
    },
    {
      youtubeIds: ['L_xrDAtykMI', 'Ou2XvUtRCto'],
      title: 'Hüftmobilität — Komplette Routine',
      description: 'Ein 35-Min-Hüftmobilitäts-Programm — Öffnung, Innen-/Außenrotation und Psoas-Lösung.',
      duration: '35 Min',
      level: 'Fortgeschritten',
    },
    {
      youtubeIds: ['T5OEbqLZS5c', 'SsgGV0llXjQ'],
      title: 'Schulter- & Nackendehnungen',
      description: 'Löse Nackenverspannung und steife Schultern in 20 Minuten — perfekt für Menschen, die im Sitzen arbeiten.',
      duration: '20 Min',
      level: 'Anfänger',
    },
    {
      youtubeIds: ['maBhWtvsUeE'],
      title: 'PNF-Stretching — Fortgeschrittene Techniken',
      description: 'Die PNF-Methode erklärt und auf 6 große Muskelgruppen angewendet — schnelle, dauerhafte Mobilitätsgewinne.',
      duration: '40 Min',
      level: 'Erfahren',
    },
    {
      youtubeIds: ['UItWltVZZmE'],
      title: 'Foam Rolling + Erholungs-Stretching',
      description: 'Ein komplettes Erholungsprotokoll: Faszienrollen-Selbstmassage gefolgt von gezielten Dehnungen zur Beschleunigung der Muskelregeneration.',
      duration: '35 Min',
      level: 'Alle Niveaus',
    },
  ],
  exercises: [
    { name: 'Stehende Vorbeuge', muscles: 'Beinbeuger, unterer Rücken, Waden', sets: '3×45 s', difficulty: 'Anfänger', description: 'Stehend, Beine zusammen und gestreckt, senke langsam die Hände zum Boden. Beuge die Knie leicht, wenn du Schmerzen im unteren Rücken spürst. Halte die Position und atme tief.' },
    { name: 'Tiefer Ausfallschritt Psoas (Eidechse)', muscles: 'Psoas, Hüftbeuger, Quadrizeps', sets: '3×45 s/Seite', difficulty: 'Anfänger', description: 'In einem tiefen Ausfallschritt, hinteres Knie am Boden, Becken nach vorn geschoben. Optional: hebe die Arme zur Vertiefung. Löst den durch langes Sitzen verkürzten Psoas.' },
    { name: 'Sitzender Schmetterling', muscles: 'Adduktoren, Hüftbeuger, Leiste', sets: '3×60 s', difficulty: 'Anfänger', description: 'Sitzend, Fußsohlen zusammen, Knie Richtung Boden. Neige den Oberkörper sanft nach vorn und halte den Rücken gerade. Eine fundamentale Dehnung für Läufer und Radfahrer.' },
    { name: 'Taube (vorbereitend)', muscles: 'Gesäß, äußere Hüftrotatoren, Psoas', sets: '2 Min/Seite', difficulty: 'Fortgeschritten', description: 'Im Vierfüßlerstand bringe ein Knie zwischen die Hände, strecke das hintere Bein. Neige den Oberkörper allmählich nach vorn. Eine der effektivsten Hüftdehnungen überhaupt.' },
    { name: 'Türrahmen-Brustdehnung', muscles: 'Brust, Bizeps, Rotatorenmanschette', sets: '3×30 s/Seite', difficulty: 'Anfänger', description: 'Arm bei 90° am Türrahmen, mach einen Schritt nach vorn. Spüre die Dehnung über die gesamte Schultervorderseite. Gleicht das Bankdrück-Volumen aus.' },
    { name: 'Kobra (Bhujangasana)', muscles: 'Bauch, Hüftbeuger, Brust', sets: '3×30 s', difficulty: 'Anfänger', description: 'Bäuchlings liegend, Hände unter den Schultern, drücke den Oberkörper hoch und halte das Becken am Boden. Dehnt die gesamte Körpervorderseite und stärkt die Rückenstrecker.' },
    { name: 'Knieende Brustwirbelrotation', muscles: 'Brustwirbel-Rückenstrecker, schräge Bauchmuskeln', sets: '3×10/Seite', difficulty: 'Fortgeschritten', description: 'Im Vierfüßlerstand, Hand hinter dem Kopf, öffne den Ellbogen zur Decke und rotiere den Oberkörper. Verbessert die für Laufen, Schwimmen und Boxen essenzielle Brustwirbel-Mobilität.' },
    { name: 'Wadendehnung an der Wand', muscles: 'Gastrocnemius, Soleus, Achillessehne', sets: '3×45 s/Seite', difficulty: 'Anfänger', description: 'Hände an der Wand, hinteres Bein gestreckt, Ferse am Boden verankert. Variante mit gebeugtem Knie, um den Soleus zu treffen. Ein Muss für Läufer und Schlägersportler.' },
    { name: 'Figur 4', muscles: 'Gesäß, Piriformis, tiefe Hüftrotatoren', sets: '2 Min/Seite', difficulty: 'Alle Niveaus', description: 'Auf dem Rücken liegend, kreuze den Knöchel über das gegenüberliegende Knie, zieh den Oberschenkel zur Brust. Exzellent zur Linderung des Piriformis-Syndroms und der gesäßbedingten Ischias.' },
  ],
  program: [
    {
      week: 'Woche 1–2',
      theme: 'Entdeckung — Essenzielle Dehnungen',
      sessions: [
        { name: 'Ganzkörper-Stretching 30 Min', detail: 'Beinbeuger, Psoas, Brust, Waden, Gesäß — 40 s pro Pose' },
        { name: 'Morgen-Mobilität 15 Min', detail: 'Dynamische Gelenkrotationen (Nacken, Schultern, Hüften, Knöchel) + 3 Schlüsselposen' },
        { name: 'Foam-Rolling-Erholung', detail: 'Quadrizeps, IT-Band, Brustwirbel-Rücken, Waden — 60 s pro Bereich' },
      ],
    },
    {
      week: 'Woche 3–4',
      theme: 'Gezielt — Prioritäre Bereiche',
      sessions: [
        { name: 'Hüften & unterer Rücken 35 Min', detail: 'Taube, tiefer Ausfallschritt, Schmetterling, sitzende Drehung — 60–90 s pro Pose' },
        { name: 'Hintere Kette 30 Min', detail: 'Vorbeuge, Waden, Beinbeuger stehend und liegend, Figur 4' },
        { name: 'Schultern & Brust 25 Min', detail: 'Brustöffnung, Bizepsdehnung, Brustwirbelrotation, Kobra' },
        { name: 'Tiefe Entspannung 20 Min', detail: 'Restoratives Yoga: mit Bolster gestützte Posen — totale Lösung' },
      ],
    },
    {
      week: 'Woche 5–6',
      theme: 'PNF & Umfanggewinne',
      sessions: [
        { name: 'PNF Beinbeuger 30 Min', detail: '6 s kontrahieren — lösen — vertiefen × 4 Zyklen pro Bein' },
        { name: 'PNF Hüften & Adduktoren', detail: 'PNF-Protokoll auf Schmetterling, Taube und Seitneigung — 3 Zyklen pro Bereich' },
        { name: 'Aktiv-passives Dehnen 40 Min', detail: 'Wechsle konzentrische Kontraktion und tiefe passive Dehnung an den großen Gruppen' },
      ],
    },
    {
      week: 'Woche 7–8',
      theme: 'Integration & Eigenständigkeit',
      sessions: [
        { name: 'Personalisierte Sequenz 40 Min', detail: 'Baue deine Routine mit den nützlichsten über 6 Wochen identifizierten Dehnungen' },
        { name: 'Bewegungsumfang-Check', detail: 'Finger-zu-Boden-Abstand, Schulterrotation, Seitneigung, Thomas-Test für den Psoas' },
        { name: 'Sportspezifisches Dehnen', detail: 'Passe deine Routine an deine Hauptsportart an — Laufen, Kraft, Boxen oder Yoga' },
        { name: 'Erhaltungsprogramm 10 Min/Tag', detail: 'Eine tägliche Mini-Routine der 5 prioritären Bereiche, um deine Gewinne zu halten' },
      ],
    },
  ],
  faq: [
    { q: 'Wann sollte ich dehnen: vor oder nach dem Training?', a: 'Davor: bevorzuge dynamische Dehnungen (Schwünge, Rotationen), um die Gelenke vorzubereiten. Danach: statische Dehnungen (30–60 s gehalten), um dich zu erholen und die Flexibilität an warmen Muskeln zu erhöhen.' },
    { q: 'Wie lange bis ich eine Verbesserung der Flexibilität sehe?', a: 'Mit 3–4 Einheiten pro Woche à 20–30 Min treten die ersten messbaren Gewinne in 3–4 Wochen auf. Bedeutende Flexibilität baut sich über 3–6 Monate regelmäßiger Praxis auf.' },
    { q: 'Tut Dehnen am Anfang wirklich weh?', a: 'Ein intensives Spannungsgefühl ist normal und nötig. Stechender oder Gelenkschmerz ist ein sofortiges Stoppsignal. Arbeite bei 70–80% deines maximalen Umfangs, um sicher voranzukommen.' },
    { q: 'Kann Dehnen chronische Schmerzen reduzieren?', a: 'Ja — viele Schmerzen im unteren Rücken, Nacken und in der Hüfte werden durch verkürzte Muskeln verursacht. Ein regelmäßiges Programm gezielten Dehnens reduziert diese Schmerzen laut Studien in 4–8 Wochen deutlich.' },
  ],
}

/* ── Ernährung ─────────────────────────────────────────────────── */
const nutritionContent: DisciplineContent = {
  tagline: 'Iss klug — Leistung beginnt auf dem Teller.',
  heroStat: '4.100+ aktive Mitglieder',
  guide: {
    technique: {
      emoji: '🥗',
      title: 'Ernährungsprinzipien',
      items: [
        'Kaloriendefizit zum Abnehmen: 300–500 kcal/Tag unter dem TDEE — nie unter 1.200 kcal (Frauen) oder 1.500 kcal (Männer)',
        'Kalorienüberschuss für Muskelaufbau: 200–300 kcal/Tag über dem TDEE für einen schlanken Aufbau',
        'Sportliche Makronährstoffe: 30–35% Protein / 40–50% Kohlenhydrate / 20–25% Fett für die Leistung',
        'Glykämischer Index (GI): bevorzuge Kohlenhydrate mit niedrigem GI (Quinoa, Süßkartoffel, Hülsenfrüchte) für stabile Energie',
        'Chrononutrition: Kohlenhydrate vor allem morgens und rund ums Training, Fette abends',
      ],
    },
    equipment: {
      emoji: '⚖️',
      title: 'Essenzielle Werkzeuge',
      items: [
        'Eine präzise Küchenwaage (auf das Gramm) — essenziell, um echte Portionen zu verstehen',
        'Eine Ernährungs-Tracking-App (MyFitnessPal, Cronometer), um Makros und Mikronährstoffe zu verfolgen',
        'Luftdichte Meal-Prep-Behälter für die wöchentliche Planung',
        'Ein leistungsstarker Mixer für Protein-Smoothies und nahrhafte hausgemachte Saucen',
        'Ein Küchenthermometer, um die Temperatur zu kontrollieren und die Nährstoffe in Lebensmitteln zu erhalten',
      ],
    },
    nutrition: {
      emoji: '🍽️',
      title: 'Planung & Verteilung',
      items: [
        'Protein-Timing: 20–40 g Protein alle 3–4 h, um die Muskelproteinsynthese zu maximieren',
        'Anaboles Fenster: eine Mahlzeit reich an Protein und Kohlenhydraten innerhalb von 60–90 Min nach dem Training',
        'Mahlzeit vor dem Training: komplexe Kohlenhydrate + leichtes Protein 2–3 h vorher (Reis + Hühnchen + Gemüse)',
        '5 Portionen Gemüse/Obst pro Tag minimum — Vitamine, Mineralien und Ballaststoffe für die allgemeine Gesundheit',
        'Hydration: 35 ml/kg Körpergewicht pro Tag + zusätzliche 500 ml pro Trainingsstunde',
      ],
    },
    recovery: {
      emoji: '🔄',
      title: 'Erholungsernährung',
      items: [
        'Die ersten 30 Minuten nach der Anstrengung sind das Fenster maximaler Reaktion: Kohlenhydrate + Protein 4:1',
        'Casein (langsam verdauliches Protein) vor dem Schlafen, um die nächtliche Proteinsynthese zu speisen',
        'Omega-3 (2–4 g/Tag EPA+DHA): reduzieren Muskelentzündungen und beschleunigen die Erholung',
        'Sauerkirsch- oder Rote-Bete-Saft nach intensiver Anstrengung: wissenschaftlich validierte natürliche Entzündungshemmer',
        'Alkohol nach der Anstrengung: reduziert die Proteinsynthese um 37% — vermeide ihn in den 6 h nach einer intensiven Einheit',
      ],
    },
  },
  tips: [
    { icon: '🍳', title: 'Meal Prep = Erfolg', body: 'Bereite deine Mahlzeiten am Sonntag für die Woche vor. Studien zeigen, dass Menschen, die ihre Ernährung planen, ihre Ziele 2,5× häufiger erreichen als die, die improvisieren.' },
    { icon: '🥦', title: 'Die Teller-Regel', body: 'Jede Hauptmahlzeit: 1/2 Teller Gemüse, 1/4 Protein, 1/4 komplexe Kohlenhydrate. Einfach, effektiv, kein Kalorienzählen jedes Mal.' },
    { icon: '💧', title: 'Durst = schon dehydriert', body: 'Wenn du Durst spürst, hast du bereits 1–2% deines Körpergewichts an Wasser verloren. Trink regelmäßig über den Tag — nicht sporadisch in großen Mengen.' },
    { icon: '📊', title: 'Zuerst die Basiskalorien', body: 'Beherrsche zuerst die Menge (Gesamtkalorien), dann optimiere die Qualität (Makros), schließlich das Timing (Chrononutrition). Überspringe keine Schritte.' },
  ],
  videos: [
    {
      youtubeIds: ['EXuaTsr43eQ', 'hRVU04jMowo'],
      title: 'Sporternährung — Essenzielle Grundlagen',
      description: 'Verstehe Makronährstoffe, TDEE, Protein und Kohlenhydrate, um deine Sporternährung ab heute zu optimieren.',
      duration: '22 Min',
      level: 'Anfänger',
    },
    {
      youtubeIds: ['3Xw69xfbIuE', 'GiIPh3pkR6U'],
      title: 'Protein — Alles, was du wissen musst',
      description: 'Quellen, Mengen, Timing und Proteinsupplemente — ein kompletter, wissenschaftlich validierter Protein-Leitfaden für den Sport.',
      duration: '28 Min',
      level: 'Alle Niveaus',
    },
    {
      youtubeIds: ['ZualDnEH00M', 'nFua_QH9_ME'],
      title: 'Meal Prep — Deine Sportmahlzeiten planen',
      description: 'Wie du eine Woche ausgewogener Mahlzeiten in 2 Stunden am Sonntag vorbereitest — eine komplette Methode mit Rezepten für Athleten.',
      duration: '35 Min',
      level: 'Anfänger',
    },
    {
      youtubeIds: ['qPhJJOm3Lfc', 'oOXe0KZLLSE'],
      title: 'Abnehmen — Die Wissenschaft dahinter',
      description: 'Verstehe das Kaloriendefizit, den Grundumsatz und die Ernährungsstrategien, die wirklich funktionieren, um Fett zu verlieren.',
      duration: '30 Min',
      level: 'Fortgeschritten',
    },
    {
      youtubeIds: ['i3AyCq2o5pk', 'q-hdHMhuJww'],
      title: 'Muskelaufbau — Optimierte Ernährung',
      description: 'Der komplette Ernährungs-Leitfaden für den Muskelaufbau: Kalorienüberschuss, Makros, Timing und Supplemente für einen sauberen Aufbau.',
      duration: '32 Min',
      level: 'Fortgeschritten',
    },
    {
      youtubeIds: ['A_GIpkGMIAU', 'NYHzJGKCKDM'],
      title: 'Supplemente — Welche wirken wirklich?',
      description: 'Eine objektive Analyse der beliebtesten Supplemente — Kreatin, Whey, BCAA, Omega-3: die wissenschaftliche Wahrheit.',
      duration: '38 Min',
      level: 'Erfahren',
    },
  ],
  exercises: [
    { name: 'Wöchentliche Mahlzeitenplanung', muscles: 'Gewohnheit, Ernährungsorganisation', sets: '1× /Woche — 20 Min', difficulty: 'Anfänger', description: 'Plane jeden Sonntag deine 5 Hauptmahlzeiten für die Woche. Berechne die Ziel-Makros, liste die Zutaten, bereite Proteine und Getreide im Voraus zu. Die Grundlage des Ernährungserfolgs.' },
    { name: 'Berechne deinen TDEE', muscles: 'Metabolisches Wissen', sets: '1× am Start, dann jeden Monat', difficulty: 'Anfänger', description: 'Berechne deinen Gesamttagesenergieverbrauch (TDEE) mit der Mifflin-St-Jeor-Formel × Aktivitätsfaktor. Passe um ±300 kcal je nach Ziel an (Abnehmen oder Aufbau). Berechne alle -5 kg neu.' },
    { name: '7-Tage-Makro-Tracking', muscles: 'Ernährungsbewusstsein', sets: '7 aufeinanderfolgende Tage', difficulty: 'Anfänger', description: 'Protokolliere jedes Lebensmittel in einer App (Cronometer empfohlen) 7 Tage hintereinander, ohne deine Gewohnheiten zu ändern. Deckt die reale Lücke zwischen dem auf, was du zu essen glaubst, und was du tatsächlich isst.' },
    { name: 'Batch Cooking Protein', muscles: 'Sportliche Mahlzeitenvorbereitung', sets: '1× /Woche — 45 Min', difficulty: 'Anfänger', description: 'Koche 600–800 g mageres Protein (Hühnchen, hartgekochte Eier, Thunfisch, Linsen) in einer Session. Teile in 150–200-g-Portionen. Garantiert deine Proteinzufuhr mühelos während der Woche.' },
    { name: 'Teller-Audit', muscles: 'Ernährungsgleichgewicht', sets: 'Bei jeder Mahlzeit', difficulty: 'Alle Niveaus', description: 'Prüfe vor jeder Mahlzeit visuell: 50% Gemüse, 25% Protein, 25% komplexe Kohlenhydrate auf dem Teller. Eine einfache Methode, die für die meisten Ziele das Kalorienzählen ersetzt.' },
    { name: 'Strukturierte Hydration', muscles: 'Stoffwechsel, körperliche Leistung', sets: '8 Gläser über den Tag verteilt', difficulty: 'Anfänger', description: 'Plane deine Flüssigkeitszufuhr: ein Glas beim Aufwachen, vor jeder Mahlzeit, während und nach dem Sport. Nutze eine 1,5-L-Flasche mit Skala als Referenz. 2% Dehydrierung senkt die Leistung um 20%.' },
    { name: 'Anaboles Fenster nach der Anstrengung', muscles: 'Erholung, Proteinsynthese', sets: 'Nach jedem Workout', difficulty: 'Fortgeschritten', description: 'Nimm innerhalb von 30–60 Min nach jeder Einheit 30–40 g Protein + 50–80 g Kohlenhydrate (Reis, Banane, Vollkornbrot) zu dir. Maximiert Erholung und Muskelanpassung.' },
    { name: 'Chrononutrition — 4-Wochen-Test', muscles: 'Zirkadianes Timing', sets: '4 Wochen', difficulty: 'Fortgeschritten', description: 'Woche 1: normale Mahlzeiten (Ausgangswert). Wochen 2–4: Kohlenhydrate auf Frühstück und Mittag konzentriert, Protein/Fett abends. Vergleiche Energie, Erholung und Körperzusammensetzung.' },
    { name: 'Kreatin-Supplement — Protokoll', muscles: 'Kraft, Erholung, Leistung', sets: '3–5 g/Tag laufend', difficulty: 'Fortgeschritten', description: 'Nimm 3–5 g Kreatin-Monohydrat pro Tag zu beliebiger Zeit (Sättigung dauert 4 Wochen). Keine Ladephase nötig. Das wissenschaftlich am besten validierte Supplement für die sportliche Leistung.' },
  ],
  program: [
    {
      week: 'Woche 1–2',
      theme: 'Diagnose — Kenne deinen Ausgangspunkt',
      sessions: [
        { name: 'TDEE & Ziel-Makros', detail: 'Mifflin-St-Jeor-Formel + Aktivitätsfaktor → 300 kcal Defizit oder Überschuss je nach Ziel' },
        { name: 'Ernährungs-Tracking 7 Tage', detail: 'Protokolliere alles, ohne deine Gewohnheiten zu ändern — deckt die echten Lücken auf (Protein generell)' },
        { name: 'Kühlschrank- und Vorrats-Audit', detail: 'Identifiziere die ultraverarbeiteten Lebensmittel, die schrittweise durch gesunde Alternativen ersetzt werden' },
      ],
    },
    {
      week: 'Woche 3–4',
      theme: 'Struktur — Die Basis aufbauen',
      sessions: [
        { name: 'Erste komplette Meal Prep', detail: 'Bereite 5 Mittag- + 5 Abendessen am Sonntag vor — Reis, geröstetes Gemüse, abwechslungsreiche Proteine' },
        { name: 'Frühstücks-Optimierung', detail: 'Übergang zu einem Protein-Frühstück von 25–30 g: Eier + Haferflocken + Obst + Nüsse' },
        { name: 'Strukturierte Hydration', detail: 'Eine 1,5-L-Flasche bis 18 Uhr leeren + 500 ml rund um jedes Workout' },
        { name: 'Makro-Check Woche 4', detail: 'Prüfe, ob du die Protein-/Kohlenhydrat-/Fett-Ziele über 7 Tage mit der App triffst — bei Bedarf anpassen' },
      ],
    },
    {
      week: 'Woche 5–6',
      theme: 'Optimierung — Timing und Qualität',
      sessions: [
        { name: 'Angewandte Chrononutrition', detail: 'Kohlenhydrate morgens und rund ums Training, Fette am Abend — über 2 Wochen testen' },
        { name: 'Systematisches anaboles Fenster', detail: 'Whey-Shake + Banane oder Reis + Thunfisch innerhalb von 30 Min nach der Anstrengung bei jeder Einheit' },
        { name: 'Supplement-Integration', detail: 'Kreatin 5 g/Tag + Omega-3 2 g/Tag + Vitamin D3 2.000 IE/Tag — ein bewährtes Basisprotokoll' },
      ],
    },
    {
      week: 'Woche 7–8',
      theme: 'Eigenständigkeit & Nachhaltigkeit',
      sessions: [
        { name: 'Ernährungsflexibilität', detail: 'Wende die 80/20-Regel an — 80% rigorose Ernährung, 20% freie Mahlzeiten ohne Schuldgefühl' },
        { name: 'Proteinreiche Rezepte für zu Hause', detail: 'Beherrsche 5 schnelle Rezepte (< 15 Min), die 40 g Protein/Portion erreichen' },
        { name: 'Körperzusammensetzungs-Check', detail: 'Taillenumfang, Gewicht, Vergleichsfotos Tag 1/Tag 56 — Wirkung auf die Komposition bewerten' },
        { name: 'Personalisierter Erhaltungsplan', detail: 'Passe die Ziel-Makros an deine neue Komposition an — TDEE nach Fortschritt neu berechnen' },
      ],
    },
  ],
  faq: [
    { q: 'Muss ich Kalorien zählen, um voranzukommen?', a: 'Nicht unbedingt jeden Tag, aber es mindestens einmal für 2–4 Wochen zu tun ist sehr aufschlussreich. Es kalibriert deine Ernährungsintuition dauerhaft. Danach reicht die Teller-Methode (50/25/25) für die meisten Ziele.' },
    { q: 'Sind Supplemente unverzichtbar?', a: 'Nein — deine Ernährung sollte 90% deines Bedarfs decken. Whey ist praktisch (nicht magisch), Kreatin verbessert die Leistung messbar, Omega-3 und Vitamin D sind relevant, wenn deine Nahrungszufuhr unzureichend ist. Alles andere ist Marketing.' },
    { q: 'Kann man gleichzeitig Fett verlieren und Muskeln aufbauen?', a: 'Ja, als Anfänger oder nach einer langen Pause (Körper-Rekomposition). Es erfordert hohe Proteinzufuhr (2–2,2 g/kg), Krafttraining und ein leichtes Kaloriendefizit (−200 kcal max). Die Ergebnisse sind langsamer, aber dauerhaft.' },
    { q: 'Wie viele Mahlzeiten pro Tag sollte ich essen?', a: 'Die Mahlzeitenhäufigkeit hat wenig Einfluss auf den Stoffwechsel. Was zählt: deine täglichen Gesamt-Kalorien- und Proteinziele zu treffen. 3 Mahlzeiten oder 5 Mahlzeiten: wähle die, die am besten zu deinem Lebensstil passt und dir hilft, deine Ziele zu erreichen.' },
  ],
}

/* ── Master maps ───────────────────────────────────────────────── */
export const DISCIPLINE_CONTENT_DE: Record<string, DisciplineContent> = {
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

// Méta DE par slug (titres/tags/descriptions/stats alignés sur les cartes
// d'accueil, niveaux traduits).
export const DISCIPLINE_META_DE: Record<string, DisciplineMeta> = {
  'running-cardio': {
    title: 'Running & Cardio',
    tag: 'Cardio',
    description: 'Laufprogramme für alle Niveaus — vom 5-km-Lauf bis zum Marathon. Personalisierte Pläne mit GPS-Coaching und Herzfrequenz-Tracking.',
    stats: ['+4.200 Läufer', '120+ Pläne', 'Ø 12 Wochen'],
    levels: ['Anfänger', 'Fortgeschritten', 'Erfahren', 'Elite'],
  },
  musculation: {
    title: 'Krafttraining',
    tag: 'Kraft',
    description: 'Masseaufbau, Definition oder Tonisierung — unsere zertifizierten Coaches erstellen ein maßgeschneidertes Programm passend zu deinem Körpertyp.',
    stats: ['+3.800 Mitglieder', '90+ Programme', 'Ø 8 Wochen'],
    levels: ['Anfänger', 'Fortgeschritten', 'Erfahren', 'Elite'],
  },
  hiit: {
    title: 'HIIT',
    tag: 'Fettverbrennung',
    description: 'Kurze, intensive Einheiten, um maximal Kalorien zu verbrennen und deinen Stoffwechsel dauerhaft in 20 bis 30 Min anzukurbeln.',
    stats: ['+2.100 Mitglieder', '60+ Circuits', '20–30 Min / Einheit'],
    levels: ['Anfänger', 'Fortgeschritten', 'Erfahren'],
  },
  cyclisme: {
    title: 'Radfahren',
    tag: 'Ausdauer',
    description: 'Indoor- und Outdoor-Training mit Wattmesser. Vom Rennfahrer bis zum Bergkletterer — ein Plan für jedes Profil.',
    stats: ['+1.500 Radfahrer', '45+ Pläne', 'Ø 16 Wochen'],
    levels: ['Anfänger', 'Fortgeschritten', 'Erfahren', 'Wettkampf'],
  },
  natation: {
    title: 'Schwimmen',
    tag: 'Wasser',
    description: 'Schwimmtechnik, Triathlon-Vorbereitung, Freiwasser — verbessere dich in allen Stilen mit HD-Video-Drills.',
    stats: ['+900 Schwimmer', '30+ Programme', 'Ø 10 Wochen'],
    levels: ['Anfänger', 'Fortgeschritten', 'Erfahren', 'Triathlon'],
  },
  crossfit: {
    title: 'CrossFit',
    tag: 'Funktional',
    description: 'Tägliche WODs, funktionelle Bewegungen und Community-Challenges, um deine Grenzen jede Woche zu erweitern.',
    stats: ['+1.800 Athleten', '365 WODs/Jahr', '5× / Woche'],
    levels: ['Anfänger', 'Fortgeschritten', 'RX', 'Wettkampf'],
  },
  yoga: {
    title: 'Yoga',
    tag: 'Wohlbefinden',
    description: 'Flexibilität, innere Stärke und Achtsamkeit — von Anfänger-Flows bis zu fortgeschrittenem Yoga für einen ausgeglichenen Körper und Geist.',
    stats: ['+2.000 Praktizierende', '40+ Sequenzen', '20–60 Min / Einheit'],
    levels: ['Anfänger', 'Fortgeschritten', 'Erfahren', 'Alle Niveaus'],
  },
  boxing: {
    title: 'Boxen',
    tag: 'Kampf',
    description: 'Technik, Cardio und Kraft — von den Grundlagen bis zu fortgeschrittenen Kombinationen, um dich körperlich und mental zu transformieren.',
    stats: ['+1.200 Boxer', '35+ Programme', 'Ø 8 Wochen'],
    levels: ['Anfänger', 'Fortgeschritten', 'Erfahren', 'Wettkampf'],
  },
  stretching: {
    title: 'Stretching',
    tag: 'Mobilität',
    description: 'Mobilität, Beweglichkeit und optimale Erholung — geführte Dehnroutinen, um Verletzungen vorzubeugen und Leistung zu bringen.',
    stats: ['+1.600 Mitglieder', '30+ Routinen', '10–30 Min / Einheit'],
    levels: ['Anfänger', 'Fortgeschritten', 'Erfahren', 'Alle Niveaus'],
  },
  nutrition: {
    title: 'Ernährung',
    tag: 'Ernährung',
    description: 'Personalisierte Ernährungspläne, Makro-Tracking und Ernährungsstrategien, um deine sportlichen Ziele zu erreichen.',
    stats: ['+3.000 Mitglieder', '50+ Pläne', 'Tägliches Tracking'],
    levels: ['Anfänger', 'Fortgeschritten', 'Erfahren', 'Athlet'],
  },
}
