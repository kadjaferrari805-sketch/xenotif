// Contenu des guides PDF — version allemande (mirror DE de guides.ts).
// Structure identique ; seuls les textes sont traduits.

import type { Guide } from './guides'

// ──────────────────────────────────────────────────────────────────────
// d1 — Masseaufbau-Programm 12 Wochen
// ──────────────────────────────────────────────────────────────────────
const masse: Guide = {
  id: 'd1',
  title: 'Masseaufbau-Programm',
  subtitle: '12 Wochen, um Qualitätsmuskeln aufzubauen',
  author: 'XENOTIF Coach — Zertifizierte Leistungsdiagnostik',
  blocks: [
    { type: 'h1', text: 'Willkommen in deinem Programm' },
    { type: 'p', text: `Glückwunsch: Du hältst ein komplettes 12-Wochen-Programm in den Händen, das deinen Körper dauerhaft transformieren soll. Dieser Leitfaden ist keine simple Übungsliste — es ist eine progressive Methode, die dich ohne Verletzung und ohne Stagnation von Punkt A nach Punkt B bringt.` },
    { type: 'p', text: `Ob motivierter Anfänger oder Fortgeschrittener auf der Suche nach Struktur: Hier findest du alles, was du brauchst — den Trainingsplan Einheit für Einheit, die Technik der Schlüsselbewegungen, die Ernährungsstrategie und die Erholungsprotokolle.` },
    { type: 'h2', text: 'Was du in 12 Wochen bekommst' },
    { type: 'list', items: [
      `Einen sichtbaren Muskelaufbau (2 bis 5 kg Muskeln je nach Ausgangspunkt).`,
      `Deutlich mehr Kraft bei den Grundübungen.`,
      `Eine bessere Haltung und eine dichtere Silhouette.`,
      `Trainings- und Ernährungsgewohnheiten, die du ein Leben lang behältst.`,
    ] },
    { type: 'note', text: `Goldene Regel: Beständigkeit schlägt Intensität. Besser 4 solide Einheiten pro Woche über 12 Wochen als eine perfekte Woche, gefolgt vom Aufgeben.` },

    { type: 'h1', text: 'Die nötige Ausrüstung' },
    { type: 'p', text: `Dieses Programm ist für ein klassisches Fitnessstudio gedacht. Hier ist die verwendete Ausrüstung.` },
    { type: 'list', items: [
      `Eine Olympia-Langhantel + Scheiben, eine verstellbare Bank.`,
      `Ein Kniebeugenständer oder ein Power-Käfig.`,
      `Kurzhanteln (idealerweise ein komplettes Sortiment).`,
      `Ein paar Kabelzüge (Latzug und Rudern).`,
      `Optional: Klimmzugstange, Beinpresse, Beinbeuger.`,
    ] },

    { type: 'h1', text: 'So liest du das Programm' },
    { type: 'p', text: `Bevor du beginnst, stelle sicher, dass du diese Begriffe verstehst, die in jeder Einheit vorkommen.` },
    { type: 'list', items: [
      `Sätze × Wiederholungen: „4 × 8“ bedeutet 4 Sätze à 8 Wiederholungen.`,
      `Tempo: Ausführungsgeschwindigkeit. Ziele auf 2 Sekunden abwärts, 1 Sekunde aufwärts.`,
      `Pause: Zeit zwischen den Sätzen. Je schwerer die Last, desto länger die Pause.`,
      `RPE (gefühlte Intensität von 10): ein RPE 8 bedeutet, dass dir etwa 2 Wiederholungen in Reserve blieben.`,
      `Technisches Versagen: der Punkt, an dem deine Technik nachlässt. Man hört DAVOR auf, nie danach.`,
    ] },
    { type: 'note', text: `Führe ein Trainingstagebuch (Papier oder App). Deine Lasten und Wiederholungen zu notieren ist der einzige Weg, den Fortschritt zu steuern und deine Werte der Vorwoche zu schlagen.` },

    { type: 'h1', text: 'Die 3 Säulen des Masseaufbaus' },
    { type: 'p', text: `Muskelaufbau beruht auf drei Hebeln. Fehlt einer, stagnieren die Ergebnisse. Dieses Programm aktiviert alle drei.` },
    { type: 'list', items: [
      `Progressive Überlastung: regelmäßig Last oder Wiederholungen erhöhen, um den Muskel zur Anpassung zu zwingen.`,
      `Kontrollierter Kalorienüberschuss: 10 bis 15% über deinem Erhaltungsbedarf essen, mit genug Protein.`,
      `Erholung: der Muskel wird in Ruhe aufgebaut, nicht während der Einheit. 7 bis 9 h Schlaf und 1 bis 2 freie Tage pro Woche.`,
    ] },

    { type: 'h1', text: 'Grundstruktur & Aufwärmen' },
    { type: 'p', text: `Das Programm folgt einem Split über 4 Tage pro Woche, in 3 Phasen à 4 Wochen organisiert. Jede Phase steigert die Intensität für einen Kraftgipfel am Zyklusende.` },
    { type: 'list', items: [
      `Tag 1 — Brust / Schultern / Trizeps (Push)`,
      `Tag 2 — Rücken / Bizeps (Pull)`,
      `Tag 3 — Komplette Beine (Quadrizeps, Beinbeuger, Waden, Gesäß)`,
      `Tag 4 — Oberkörper in Kraft (Wiederholung der Schwachpunkte)`,
    ] },
    { type: 'h2', text: 'Aufwärmen — vor JEDER Einheit zu machen' },
    { type: 'list', items: [
      `5 Min leichtes Cardio (Rad, Rudergerät oder Springseil).`,
      `Gelenkmobilität: Schulter-, Hüft-, Knöchelkreise — je 8 Wiederholungen.`,
      `Aktivierung: 2 leichte Sätze bei der ersten Übung (50% dann 70% der Arbeitslast).`,
    ] },

    { type: 'h1', text: 'Phase 1 — Grundlagen (Wochen 1 bis 4)' },
    { type: 'p', text: `Ziel: die Technik beherrschen und Volumen aufbauen. 90 Sekunden Pause zwischen den Sätzen. Kontrolliertes Tempo (2 Sekunden abwärts). Ziele auf RPE 7-8.` },
    { type: 'h2', text: 'Tag 1 — Push' },
    { type: 'list', items: [
      `Langhantel-Bankdrücken — 4 × 8 bis 10`,
      `Schrägbank-Kurzhanteldrücken — 3 × 10`,
      `Schulterdrücken — 4 × 8`,
      `Seitheben — 3 × 15`,
      `Dips oder Trizepsdrücken am Kabel — 3 × 12`,
    ] },
    { type: 'h2', text: 'Tag 2 — Pull' },
    { type: 'list', items: [
      `Klimmzüge oder Latzug — 4 × 8 bis 10`,
      `Langhantelrudern — 4 × 10`,
      `Rudern am Kabel — 3 × 12`,
      `Langhantel-Curl — 3 × 10`,
      `Kurzhantel-Hammer-Curl — 3 × 12`,
    ] },
    { type: 'h2', text: 'Tag 3 — Beine' },
    { type: 'list', items: [
      `Langhantel-Kniebeuge — 4 × 8 bis 10`,
      `Beinpresse — 3 × 12`,
      `Rumänisches Kreuzheben — 3 × 10`,
      `Liegender Beinbeuger — 3 × 12`,
      `Stehendes Wadenheben — 4 × 15`,
    ] },
    { type: 'h2', text: 'Tag 4 — Oberkörper (Kraft)' },
    { type: 'list', items: [
      `Bankdrücken — 5 × 5 (schwerere Last)`,
      `Einarmiges Kurzhantelrudern — 4 × 8`,
      `Kurzhantel-Schulterdrücken — 3 × 10`,
      `Superset Curl + Trizepsstrecken — 3 × 12 je`,
    ] },

    { type: 'h1', text: 'Phase 2 — Intensivierung (Wochen 5 bis 8)' },
    { type: 'p', text: `Erhöhe die Lasten um 2,5 bis 5 kg bei den Grundübungen, sobald du das obere Ende der Spanne schaffst. 2 Minuten Pause bei den großen Bewegungen. Ziele auf RPE 8-9.` },
    { type: 'h2', text: 'Tag 1 — Push (schwer)' },
    { type: 'list', items: [
      `Langhantel-Bankdrücken — 5 × 6`,
      `Schrägbank-Kurzhanteldrücken — 4 × 8`,
      `Schulterdrücken — 4 × 6`,
      `Seitheben (Reduktionssatz beim letzten) — 3 × 12`,
      `Dips mit Gewicht — 3 × 8 bis 10`,
    ] },
    { type: 'h2', text: 'Tag 2 — Pull (schwer)' },
    { type: 'list', items: [
      `Klimmzüge mit Gewicht — 4 × 6`,
      `Langhantelrudern — 5 × 6`,
      `Rudern — 4 × 10`,
      `Langhantel-Curl — 4 × 8`,
      `Schrägbank-Kurzhantel-Curl — 3 × 10`,
    ] },
    { type: 'h2', text: 'Tag 3 — Beine (schwer)' },
    { type: 'list', items: [
      `Langhantel-Kniebeuge — 5 × 6`,
      `Beinpresse — 4 × 10`,
      `Rumänisches Kreuzheben — 4 × 8`,
      `Kurzhantel-Ausfallschritte — 3 × 10 pro Bein`,
      `Stehendes Wadenheben — 4 × 12`,
    ] },
    { type: 'note', text: `Doppelte Progression: bleib bei derselben Last, bis du das obere Ende der Spanne in ALLEN Sätzen erreichst. Danach erhöhe die Last beim nächsten Training.` },

    { type: 'h1', text: 'Phase 3 — Kraft & Finish (Wochen 9 bis 12)' },
    { type: 'p', text: `Die anspruchsvollste Phase: das angesammelte Volumen in Kraft und Dichte umwandeln. 2 bis 3 Minuten Pause bei den schweren Bewegungen. Woche 12 ist ein Deload.` },
    { type: 'list', items: [
      `Grundübungen: 4 bis 6 Wiederholungen mit schwerer Last (etwa 85% deines Maximums).`,
      `Isolationsübungen: 12 bis 15 Wiederholungen für den Pump und das Blutvolumen.`,
      `Füge eine Intensitätstechnik pro Einheit hinzu: Reduktionssätze, Rest-Pause oder Teilwiederholungen.`,
      `Woche 12 (Deload): reduziere das Volumen um 40%, um zu regenerieren und die Gewinne zu festigen.`,
    ] },

    { type: 'h1', text: 'Technik der Schlüsselbewegungen' },
    { type: 'p', text: `Technik geht vor Last. Hier sind die Achtungspunkte der 4 Königsbewegungen.` },
    { type: 'h2', text: 'Die Kniebeuge' },
    { type: 'list', items: [
      `Füße schulterbreit, Fußspitzen leicht nach außen.`,
      `Senke ab, indem du die Hüften nach hinten schiebst, neutraler Rücken, Blick nach vorn.`,
      `Oberschenkel mindestens parallel zum Boden, Knie in der Achse der Füße.`,
      `Drücke mit dem ganzen Fuß in den Boden, um hochzukommen.`,
    ] },
    { type: 'h2', text: 'Das Bankdrücken' },
    { type: 'list', items: [
      `Schulterblätter eng und tief, leichte natürliche Brücke.`,
      `Die Stange senkt sich zur unteren Brust, Ellbogen bei etwa 45°.`,
      `Drücke und halte die Handgelenke gerade über den Ellbogen.`,
    ] },
    { type: 'h2', text: 'Das Kreuzheben' },
    { type: 'list', items: [
      `Stange an den Schienbeinen, flacher Rücken, maximale Körperspannung.`,
      `Drücke in den Boden und strecke die Hüften, halte die Stange nah am Körper.`,
      `Runde nie den unteren Rücken — reduziere die Last bei Bedarf.`,
    ] },
    { type: 'h2', text: 'Klimmzüge / Rudern' },
    { type: 'list', items: [
      `Initiiere die Bewegung durch Senken der Schulterblätter, nicht mit den Armen.`,
      `Bring die Brust zur Stange, Ellbogen nach unten und hinten.`,
      `Kontrolliere die Abwärtsbewegung — lass dich nicht fallen.`,
    ] },

    { type: 'h1', text: 'Ernährung für den Masseaufbau' },
    { type: 'p', text: `Ohne Kalorienüberschuss kein Muskelaufbau. So berechnest und organisierst du deine Zufuhr.` },
    { type: 'list', items: [
      `Kalorien: Körpergewicht (kg) × 35 bis 40 = tägliche Zielzufuhr.`,
      `Protein: 1,8 bis 2,2 g pro kg (z. B. 80 kg → 145 bis 175 g/Tag).`,
      `Kohlenhydrate: 4 bis 6 g pro kg, rund ums Training konzentriert.`,
      `Fette: 0,8 bis 1 g pro kg für das hormonelle Gleichgewicht.`,
    ] },
    { type: 'h2', text: 'Tipps nach Körpertyp' },
    { type: 'list', items: [
      `Ektomorph (schwer zuzunehmen): ziele auf das obere Ende der Kalorien, füge einen flüssigen Snack hinzu (Shake + Haferflocken).`,
      `Mesomorph (nimmt leicht zu): moderater Überschuss von 10%, achte auf den Taillenumfang.`,
      `Endomorph (speichert schnell Fett): leichter Überschuss von 5 bis 8%, Kohlenhydrate vor allem rund ums Training.`,
    ] },
    { type: 'h2', text: 'Nützliche Supplemente (optional)' },
    { type: 'list', items: [
      `Whey: praktisch, um deine Proteine zu erreichen.`,
      `Kreatin-Monohydrat: 3 bis 5 g pro Tag, das am besten belegte Supplement für die Kraft.`,
      `Vitamin D und Omega-3, falls deine Ernährung sie nicht abdeckt.`,
    ] },

    { type: 'h1', text: 'Erholung & Schlaf' },
    { type: 'list', items: [
      `Schlaf 7 bis 9 h: der Großteil des Wachstumshormons wird nachts ausgeschüttet.`,
      `Hydriere dich: etwa 35 ml Wasser pro kg Körpergewicht und Tag.`,
      `Bekämpfe Muskelkater mit einem Cool-down, leichtem Dehnen und Gehen.`,
      `Die Deload-Woche (Woche 12) gehört zum Programm: überspringe sie nicht.`,
    ] },

    { type: 'h1', text: 'Deinen Fortschritt verfolgen' },
    { type: 'list', items: [
      `Notiere deine Lasten und Wiederholungen bei jeder Einheit.`,
      `Wieg dich 1 bis 2 Mal pro Woche nüchtern und verfolge den Trend über den Monat.`,
      `Mach alle 4 Wochen Fotos, gleiches Licht und gleiche Haltung.`,
      `Miss alle 4 Wochen Arm-, Brust-, Oberschenkel- und Taillenumfang.`,
    ] },

    { type: 'h1', text: 'Häufige Fehler, die du vermeiden solltest' },
    { type: 'list', items: [
      `Jede Woche das Programm wechseln: Fortschritt erfordert Beständigkeit.`,
      `Die Beine vernachlässigen: sie setzen den meisten gesamten Anabolismus frei.`,
      `Die Technik opfern, um schwerer zu heben.`,
      `Zu wenig essen, um „trocken zu bleiben“: ohne Überschuss kein Muskel.`,
      `Den Schlaf streichen: das sabotiert 100% deiner Mühe im Studio.`,
    ] },

    { type: 'h1', text: 'FAQ' },
    { type: 'p', text: `Wie lange dauert eine Einheit? Zwischen 60 und 75 Minuten, Aufwärmen inklusive.` },
    { type: 'p', text: `Kann ich 3 statt 4 Tage trainieren? Ja: füge Tag 1 und 4 zusammen und verteile den Rest auf 3 Einheiten, halte die Reihenfolge Push / Pull / Beine.` },
    { type: 'p', text: `Und nach den 12 Wochen? Beginne einen neuen Zyklus von den erreichten Lasten aus oder gehe in eine Definitionsphase mit unserem dedizierten Ernährungsplan über.` },
    { type: 'note', text: `Du hast alles in der Hand. Drucke diesen Leitfaden, notiere deine Lasten und komm jede Woche darauf zurück. In 12 Wochen vergleichst du deine Ausgangswerte: der Unterschied wird dich für den nächsten Zyklus motivieren. Wir zählen auf dich.` },
  ],
}

// ──────────────────────────────────────────────────────────────────────
// d2 — Definitions-Ernährungsplan 8 Wochen
// ──────────────────────────────────────────────────────────────────────
const seche: Guide = {
  id: 'd2',
  title: 'Definitions-Ernährungsplan',
  subtitle: '8 Wochen, um Fett zu verlieren ohne Muskeln zu verlieren',
  author: 'XENOTIF Coach — Sporternährung',
  blocks: [
    { type: 'h1', text: 'Willkommen in deiner Definitionsphase' },
    { type: 'p', text: `Dieser 8-Wochen-Plan hilft dir, deine Muskeldefinition freizulegen, indem du Körperfett verlierst, ohne den hart erarbeiteten Muskel zu opfern. Keine extreme Diät, kein absurder Verzicht: eine progressive, durchhaltbare, wissenschaftsbasierte Methode.` },
    { type: 'p', text: `Du findest die Berechnung deines Bedarfs, eine Tagesstruktur, einen Woche-für-Woche-Anpassungsplan, über 20 Rezepte, eine vegane Version und alle Strategien, um nie einzubrechen.` },
    { type: 'note', text: `Eine Diät ist ein Marathon, kein Sprint. Ein stetiger Verlust von 0,5 bis 0,8% deines Gewichts pro Woche erhält den Muskel. Schneller zu gehen = Muskel verlieren und den Stoffwechsel brechen.` },

    { type: 'h1', text: 'Das Prinzip der Definitionsphase' },
    { type: 'p', text: `Definition bedeutet, Körperfett zu verlieren und dabei den Muskel zu erhalten. Das erfordert drei Dinge gleichzeitig.` },
    { type: 'list', items: [
      `Ein moderates Kaloriendefizit: 15 bis 20% unter deinem Erhaltungsbedarf, nicht mehr.`,
      `Hohes Protein: 2 bis 2,4 g pro kg, um die Magermasse zu schützen.`,
      `Das Krafttraining beibehalten: es ist das Signal, das dem Körper sagt, den Muskel zu halten.`,
    ] },

    { type: 'h1', text: 'Deinen Verbrauch verstehen' },
    { type: 'p', text: `Dein Körper verbrennt auf vier Arten Kalorien. Sie zu kennen hilft zu verstehen, warum mehr Alltagsbewegung genauso zählt wie Sport.` },
    { type: 'list', items: [
      `Grundumsatz: die Energie zum Leben in Ruhe (60 bis 70% des Gesamten).`,
      `NEAT: jede nicht-sportliche Aktivität (Gehen, Hausarbeit, Treppen). Stark unterschätzt.`,
      `Sportliche Aktivität: deine Einheiten.`,
      `Thermischer Effekt der Nahrung: die Energie zur Verdauung (Protein verlangt am meisten).`,
    ] },

    { type: 'h1', text: 'Deinen Bedarf berechnen' },
    { type: 'p', text: `Schritt 1: schätze deinen Erhaltungsbedarf. Schritt 2: ziehe das Defizit ab. Schritt 3: verteile die Makros.` },
    { type: 'list', items: [
      `Ungefährer Erhaltungsbedarf: Gewicht (kg) × 33 (sitzend) bis 38 (aktiv).`,
      `Diät-Kalorien: Erhaltungsbedarf − 20% (z. B. 2.500 → 2.000 kcal).`,
      `Protein: Gewicht × 2,2 g. Fette: Gewicht × 0,8 g. Der Rest der Kalorien als Kohlenhydrate.`,
    ] },
    { type: 'note', text: `Wieg dich 3 Mal pro Woche nüchtern und bilde den Wochendurchschnitt. Wenn sich das Gewicht 10 Tage nicht bewegt, nimm 100 bis 150 kcal Kohlenhydrate weg oder füge leichtes Cardio hinzu.` },

    { type: 'h1', text: 'Struktur eines Beispieltags' },
    { type: 'p', text: `Verteile dein Protein auf 4 Mahlzeiten, um Sättigung und Muskelsynthese zu maximieren.` },
    { type: 'h2', text: 'Frühstück' },
    { type: 'list', items: [
      `3-Eier-Omelett + 100 g Eiweiß`,
      `40 g Haferflocken`,
      `1 Obst (Apfel oder eine Handvoll Beeren)`,
    ] },
    { type: 'h2', text: 'Mittagessen' },
    { type: 'list', items: [
      `150 g Hühnchen oder Pute (gekochtes Gewicht)`,
      `60 g Basmatireis (rohes Gewicht) oder 200 g Süßkartoffel`,
      `Grünes Gemüse nach Belieben + 1 EL Olivenöl`,
    ] },
    { type: 'h2', text: 'Snack' },
    { type: 'list', items: [
      `1 Portion Whey oder 200 g Magerquark`,
      `20 g Mandeln`,
    ] },
    { type: 'h2', text: 'Abendessen' },
    { type: 'list', items: [
      `150 g Weißfisch oder Lachs`,
      `Große Portion Gemüse (Brokkoli, Zucchini, grüne Bohnen)`,
      `1 EL Olivenöl oder 1/4 Avocado`,
    ] },

    { type: 'h1', text: 'Progression über 8 Wochen' },
    { type: 'list', items: [
      `Wochen 1-2: baue die Gewohnheiten auf, leichtes Defizit (−15%). Der Körper passt sich sanft an.`,
      `Wochen 3-4: volles Defizit (−20%). Füge an freien Tagen 20 Min zügiges Gehen hinzu.`,
      `Wochen 5-6: bei Plateau nimm 100 kcal Kohlenhydrate weg und füge 2 leichte Cardio-Einheiten hinzu.`,
      `Woche 7: kontrollierter Refeed an einem Tag (+300 kcal Kohlenhydrate), um den Stoffwechsel neu zu starten.`,
      `Woche 8: die Zielgerade, halte den Kurs, hydriere dich gut und fotografiere deinen Fortschritt.`,
    ] },

    { type: 'h1', text: 'Cardio & Training während der Diät' },
    { type: 'list', items: [
      `Behalte das Krafttraining in Kraft: ES ist es, das den Muskel im Defizit erhält.`,
      `Sanftes Cardio (Gehen, Rad): exzellent, um das Defizit zu vertiefen, ohne dich zu erschöpfen.`,
      `Ziele auf 8.000 bis 10.000 Schritte pro Tag: NEAT ist dein bester Verbündeter.`,
      `Vermeide extremes Nüchtern-Cardio: es schmilzt nicht schneller und ermüdet unnötig.`,
    ] },

    { type: 'h1', text: 'Rezepte — Frühstücke & Snacks' },
    { type: 'list', items: [
      `Protein-Pancakes: 1 Banane, 2 Eier, 1 Portion Whey, Haferflocken.`,
      `Magerquark, Beeren und 15 g Mandeln.`,
      `Leichtes Spinat-Feta-Omelett: 3 Eier, eine Handvoll Spinat, 30 g Feta.`,
      `Vollkorntoast, pochiertes Ei und zerdrückte Avocado.`,
      `Skyr, Zimt und ein paar Haferflocken.`,
    ] },

    { type: 'h1', text: 'Rezepte — Mittag- & Abendessen' },
    { type: 'list', items: [
      `Hühnchen-Reis-Avocado-Bowl: 150 g Hühnchen, 60 g Reis, 1/4 Avocado, Zitrone.`,
      `Lachs-Süßkartoffel aus dem Ofen: 150 g Lachs, 200 g Süßkartoffel, Kräuter.`,
      `Thunfisch-Wrap: Vollkorn-Wrap, 1 Dose Thunfisch, Rohkost, Quark.`,
      `Leichtes Hühnchen-Curry: Hühnchen, fettarme Kokosmilch, Curry, Gemüse.`,
      `5%-Hackfleisch-Quinoa: 150 g Hack, 60 g Quinoa, Ratatouille.`,
      `Linsen-Ei-Salat: Linsen, 2 hartgekochte Eier, Tomaten, leichtes Dressing.`,
      `Gedämpfter Kabeljau, Brokkoli und Vollkornreis.`,
      `Mageres Chili con Carne: 5%-Rind, Kidneybohnen, Tomaten, Gewürze.`,
    ] },

    { type: 'h1', text: 'Vegane Version' },
    { type: 'p', text: `Ersetze die tierischen Proteine durch diese Quellen und ergänze mit einem pflanzlichen Proteinpulver.` },
    { type: 'list', items: [
      `Fester Tofu, Tempeh, Seitan (proteinreich).`,
      `Hülsenfrüchte: Linsen, Kichererbsen, Kidneybohnen.`,
      `Edamame, Quinoa, Erbsen- oder Reisproteinpulver.`,
      `Denk an Vitamin B12 und Omega-3 (Leinsamen, Walnüsse).`,
    ] },

    { type: 'h1', text: 'Heißhunger & Plateaus managen' },
    { type: 'list', items: [
      `Trink ein großes Glas Wasser vor jeder Mahlzeit: die Sättigung steigt.`,
      `Bevorzuge voluminöse, kalorienarme Lebensmittel (Gemüse, Suppen).`,
      `Behalte 1 oder 2 „Genuss“-Lebensmittel in deinen Makros, statt sie zu verbieten.`,
      `Plateau über 10 Tage: lege eine „Diätpause“ von 5 bis 7 Tagen auf Erhaltungsniveau ein.`,
      `Schlaf genug: Schlafmangel erhöht den Hunger und die Lust auf Süßes.`,
    ] },

    { type: 'h1', text: 'Supplemente & Hydration' },
    { type: 'list', items: [
      `Whey oder pflanzliches Protein: um deine Proteine leicht zu erreichen.`,
      `Koffein: leichter Appetitzügler und Energie-Booster fürs Training.`,
      `Elektrolyte und 35 ml Wasser pro kg und Tag: Hydration hilft, den Hunger zu managen.`,
      `Kein „Fatburner“ ersetzt das Kaloriendefizit. Behalte dein Geld.`,
    ] },

    { type: 'h1', text: 'Wöchentliche Einkaufsliste' },
    { type: 'list', items: [
      `Protein: Hühnchen, Pute, Weißfisch, Lachs, Eier, Whey, Magerquark, Skyr.`,
      `Kohlenhydrate: Basmatireis, Süßkartoffel, Haferflocken, Quinoa, Obst, Vollkornbrot.`,
      `Fette: Olivenöl, Avocado, Mandeln, Walnüsse, Samen.`,
      `Gemüse: Brokkoli, Spinat, Zucchini, grüne Bohnen, Tomaten, Salat, Paprika.`,
      `Extras: Gewürze, Zitrone, Balsamico, Senf, frische Kräuter.`,
    ] },

    { type: 'h1', text: 'FAQ & nach der Diät' },
    { type: 'p', text: `Verliere ich Muskeln? Nicht, wenn du genug Protein isst und das Krafttraining beibehältst. Das ist der ganze Sinn dieses Plans.` },
    { type: 'p', text: `Wie viel Gewicht verliere ich? Etwa 0,5 bis 0,8% deines Gewichts pro Woche, also 3 bis 5 kg über 8 Wochen je nach Ausgangspunkt.` },
    { type: 'p', text: `Und danach? Erhöhe deine Kalorien schrittweise (+100 kcal pro Woche) bis zum Erhaltungsbedarf: das ist die „Reverse-Diät“, die verhindert, alles wieder zuzunehmen.` },
    { type: 'note', text: `Bereite deine Mahlzeiten im Voraus vor (Batch Cooking), 2 Mal pro Woche. Das ist das Geheimnis Nr. 1, um eine Diät ohne Einbruch durchzuhalten. Du schaffst das.` },
  ],
}

// ──────────────────────────────────────────────────────────────────────
// d3 — HIIT-Programm 6 Wochen
// ──────────────────────────────────────────────────────────────────────
const hiit: Guide = {
  id: 'd3',
  title: 'Fettverbrennungs-HIIT-Programm',
  subtitle: '6 Wochen, 100% Körpergewicht, ohne Ausrüstung',
  author: 'XENOTIF Coach — CrossFit Level 2 zertifiziert',
  blocks: [
    { type: 'h1', text: 'Willkommen in deinem HIIT-Programm' },
    { type: 'p', text: `In 6 Wochen transformiert dieses Programm deine Fitness und schmilzt Fett — ohne Studio, ohne Ausrüstung, wo immer du bist. Alles läuft über das eigene Körpergewicht, in kurzen, aber intensiven Einheiten von 20 bis 30 Minuten.` },
    { type: 'p', text: `Du findest die 4 Einheiten jeder Woche detailliert, die Technik jeder Bewegung, die Aufwärm- und Erholungsprotokolle und die Ernährungstipps, um deine Ergebnisse zu beschleunigen.` },
    { type: 'note', text: `Intensität = Schlüssel. In den Belastungsphasen solltest du unfähig sein, ein Gespräch zu führen. In der Erholung schöpfst du aktiv Atem (Marschieren auf der Stelle, tiefe Atmung).` },

    { type: 'h1', text: 'Warum HIIT funktioniert' },
    { type: 'p', text: `HIIT wechselt intensive Belastungen und kurze Erholungen. Das Ergebnis: du verbrennst Kalorien während UND nach der Einheit dank des EPOC-Effekts (Sauerstoff-Mehrverbrauch nach der Belastung).` },
    { type: 'list', items: [
      `Eine 20-Min-Einheit kann so viel verbrennen wie ein 45-Min-Lauf.`,
      `Der Körper verbrennt bis zu 24 h nach der Belastung weiter Kalorien.`,
      `HIIT erhält den Muskel besser als langes, eintöniges Cardio.`,
      `Keine Ausrüstung: du kannst überall und jederzeit trainieren.`,
    ] },

    { type: 'h1', text: 'Die Intensität verstehen' },
    { type: 'p', text: `Damit HIIT wirkt, musst du eine echte hohe Intensität erreichen. So erkennst du sie ohne Sensor.` },
    { type: 'list', items: [
      `Sprechtest: bei vollem Einsatz kannst du nur 2 oder 3 Wörter am Stück sagen.`,
      `Gefühl von 10: die Belastungsphasen sollten bei 8-9/10 sein.`,
      `Wenn du singen kannst, ist es kein HIIT — push mehr.`,
      `Wenn du am Rand der Übelkeit bist, ist es zu viel: lass leicht nach.`,
    ] },

    { type: 'h1', text: 'Die verwendeten Formate' },
    { type: 'list', items: [
      `Tabata: 20 s maximaler Einsatz / 10 s Pause, 8 Runden (4 Min pro Übung).`,
      `EMOM: „Every Minute On the Minute“ — eine Anzahl Wiederholungen zu Beginn jeder Minute, der Rest ist Pause.`,
      `AMRAP: „As Many Rounds As Possible“ — maximale Runden in einer festen Zeit.`,
      `30/30: 30 s Einsatz / 30 s Pause, ideal zum Einstieg.`,
    ] },

    { type: 'h1', text: 'Aufwärmen & Cool-down' },
    { type: 'h2', text: 'Aufwärmen (5 Min, vor jeder Einheit)' },
    { type: 'list', items: [
      `30 s Jumping Jacks`,
      `30 s Armkreisen + Hüftkreise`,
      `30 s langsames Knieheben`,
      `30 s Kniebeugen mit Körpergewicht`,
      `Wiederhole den Circuit zweimal`,
    ] },
    { type: 'h2', text: 'Cool-down (5 Min, nach jeder Einheit)' },
    { type: 'list', items: [
      `1 bis 2 Min Gehen, um die Herzfrequenz zu senken.`,
      `Dehne Quadrizeps, Beinbeuger, Waden und Schultern (je 20 s).`,
      `Tiefe Atmung: 4 s ein, 6 s aus, ×10.`,
    ] },

    { type: 'h1', text: 'Technik der 8 Grundbewegungen' },
    { type: 'h2', text: 'Burpees & Squat Jumps' },
    { type: 'list', items: [
      `Burpee: in die Hocke, Hände am Boden, in die Plank springen, Liegestütz, Füße zurück, springen. Halte den Rumpf gespannt.`,
      `Squat Jump: in eine kontrollierte Kniebeuge senken, nach oben explodieren, weich mit gebeugten Knien landen.`,
    ] },
    { type: 'h2', text: 'Mountain Climbers & Knieheben' },
    { type: 'list', items: [
      `Mountain Climbers: in der Plank die Knie abwechselnd zur Brust ziehen, Becken stabil.`,
      `Knieheben: auf der Stelle laufen, Knie auf Hüfthöhe, Arme im Rhythmus.`,
    ] },
    { type: 'h2', text: 'Liegestütze, Sprungausfallschritte, Plank, Jumping Jacks' },
    { type: 'list', items: [
      `Liegestütze: Körper gespannt in der Plank, Ellbogen auf 45° senken, drücken. Auf den Knien bei Bedarf.`,
      `Sprungausfallschritte: Beine springend wechseln, vorderes Knie in der Achse des Fußes.`,
      `Plank: Unterarme am Boden, Körper gerade, Bauch und Gesäß angespannt.`,
      `Jumping Jacks: Arme und Beine springend spreizen — perfekt zum Aufwärmen und Erholen.`,
    ] },
    { type: 'note', text: `Besser 8 perfekte Burpees als 15 schludrige. Passe die Anzahl der Wiederholungen an, nie die Ausführungsqualität.` },

    { type: 'h1', text: 'Wochen 1 & 2 — Anpassung (30/30-Format)' },
    { type: 'p', text: `4 Einheiten pro Woche. Pro Übung: 30 s Einsatz / 30 s Pause. 3 Runden des Circuits, 1 Min Erholung zwischen den Runden. Ziel: die Bewegungen sauber lernen.` },
    { type: 'list', items: [
      `Einheit A: Jumping Jacks → Kniebeugen → Liegestütze → Mountain Climbers → Plank.`,
      `Einheit B: Knieheben → wechselnde Ausfallschritte → Knie-Liegestütze → Plank → Kniebeugen.`,
      `Einheiten C und D: wiederhole A und B mit Fokus auf sauberere Ausführung.`,
      `Gesamtdauer: etwa 20 Min, Aufwärmen inklusive.`,
    ] },

    { type: 'h1', text: 'Wochen 3 & 4 — Intensivierung (EMOM + AMRAP)' },
    { type: 'p', text: `Erhöhe die Arbeitsdichte. 4 Einheiten pro Woche, 25 Min. Notiere deine Scores, um deinen Fortschritt zu messen.` },
    { type: 'list', items: [
      `Einheit A — EMOM 16 Min: Min 1: 12 Squat Jumps / Min 2: 10 Burpees / Min 3: 14 Knieheben / Min 4: 30 s Plank. 4-mal wiederholen.`,
      `Einheit B — AMRAP 12 Min: 8 Burpees + 12 Sprungausfallschritte + 16 Mountain Climbers, max. Runden.`,
      `Einheit C — EMOM 15 Min: wechsle Liegestütze, Squat Jumps, Mountain Climbers.`,
      `Einheit D — AMRAP 10 Min: 10 Kniebeugen + 10 Liegestütze + 10 Jumping Jacks.`,
    ] },

    { type: 'h1', text: 'Wochen 5 & 6 — Leistung (Tabata)' },
    { type: 'p', text: `Der Höhepunkt des Programms. 4 Einheiten à 25 bis 30 Min, Tabata-Format bei den explosiven Bewegungen. 2 Min Erholung zwischen den Blöcken.` },
    { type: 'list', items: [
      `Block 1 — Tabata Burpees: 20 s max / 10 s Pause × 8.`,
      `Block 2 — Tabata Squat Jumps: 20 s / 10 s × 8.`,
      `Block 3 — Tabata Mountain Climbers: 20 s / 10 s × 8.`,
      `Block 4 — Tabata dynamische Plank: 20 s / 10 s × 8.`,
      `Folgende Einheiten: variiere die Reihenfolge der Blöcke und ziele auf mehr Wiederholungen als in der Vorrunde.`,
    ] },

    { type: 'h1', text: 'Ernährung zur Beschleunigung der Ergebnisse' },
    { type: 'list', items: [
      `HIIT ist ein Beschleuniger, kein Ersatz für gute Ernährung.`,
      `Iss eine Proteinquelle + Kohlenhydrate innerhalb der Stunde nach der Einheit.`,
      `Erzeuge ein leichtes Kaloriendefizit, wenn dein Ziel Fettverlust ist.`,
      `Hydriere dich vor, während und nach jeder Einheit.`,
    ] },

    { type: 'h1', text: 'Das Programm anpassen & Sicherheit' },
    { type: 'list', items: [
      `Anfänger: reduziere die Anzahl der Runden und verlängere die Erholungen.`,
      `Ohne Impact (empfindliche Gelenke): ersetze Sprünge durch Bodenvarianten (normale Kniebeugen, Step-back statt Sprung-Burpees).`,
      `Halte mindestens 1 kompletten Ruhetag zwischen zwei intensiven Einheiten.`,
      `Stoppe sofort bei stechendem Gelenkschmerz (anders als Muskelermüdung).`,
    ] },

    { type: 'h1', text: 'Tracking & FAQ' },
    { type: 'list', items: [
      `Notiere deine Scores (Runden, Wiederholungen) bei jeder Einheit, um deinen Fortschritt zu sehen.`,
      `Mach alle 2 Wochen ein Foto.`,
      `Wie oft pro Woche? 4 Einheiten, mit mindestens 1 Ruhetag zwischen den härtesten.`,
      `Und nach 6 Wochen? Beginne einen neuen Zyklus mit mehr Wiederholungen oder kombiniere mit Krafttraining.`,
    ] },
    { type: 'note', text: `Komm in deinem Tempo voran: jede beendete Einheit ist ein Sieg. In 6 Wochen bist du schneller, ausdauernder und definierter. An die Arbeit.` },
  ],
}

// ──────────────────────────────────────────────────────────────────────
// d4 — Lauf-Leitfaden: Von 5 km bis Marathon
// ──────────────────────────────────────────────────────────────────────
const running: Guide = {
  id: 'd4',
  title: 'Lauf-Leitfaden — Von 5 km bis Marathon',
  subtitle: 'Pläne, Tempi, Ernährung und mentale Vorbereitung',
  author: 'XENOTIF Coach — Zertifizierter Leichtathletik-Trainer',
  blocks: [
    { type: 'h1', text: 'Willkommen, Läufer' },
    { type: 'p', text: `Ob du deine ersten 5 km laufen oder einen Marathon meistern willst — dieser Leitfaden begleitet dich den ganzen Weg. Er versammelt Pläne für vier Distanzen, die Wissenschaft der Tempi, die Lauftechnik, die Ernährung und die mentale Vorbereitung.` },
    { type: 'p', text: `Lies zuerst die Kapitel über Tempi und Technik: sie machen den Unterschied bei deinem Fortschritt und deiner Verletzungsprävention.` },
    { type: 'note', text: `Die 80/20-Regel: 80% deiner Kilometer in langsamer Grundlagenausdauer, 20% in Intensität. Das ist die Basis jedes nachhaltigen Fortschritts.` },

    { type: 'h1', text: 'Die essenzielle Ausrüstung' },
    { type: 'list', items: [
      `Ein gutes Paar Schuhe passend zu deinem Laufstil (lass dich im Fachgeschäft beraten).`,
      `Atmungsaktive Funktionskleidung passend zum Wetter.`,
      `Optional, aber nützlich: eine GPS-Uhr, um Tempo und Distanz zu verfolgen.`,
      `Für lange Läufe: ein Flaschengürtel oder eine Soft-Flask.`,
    ] },

    { type: 'h1', text: 'Deine Tempi verstehen' },
    { type: 'p', text: `Beim Laufen voranzukommen heißt vor allem, in den richtigen Tempi zu laufen. Zu viele Läufer laufen im Training zu schnell und im Wettkampf zu langsam. Hier sind die 3 fundamentalen Tempi.` },
    { type: 'list', items: [
      `Grundlagenausdauer (GA): Gesprächstempo, 65 bis 75% deiner max. HF. 80% deines Volumens gehören hierher.`,
      `Schwellentempo: eine anhaltende, aber kontrollierte Anstrengung, die du etwa 1 h halten könntest. Baut Widerstand auf.`,
      `VO2max (maximale aerobe Geschwindigkeit): kurzes, schnelles Intervall. Baut den Motor auf.`,
    ] },
    { type: 'h2', text: 'Deine Zonen einfach finden' },
    { type: 'list', items: [
      `GA: du kannst in vollständigen Sätzen sprechen.`,
      `Schwelle: du kannst nur ein paar Wörter am Stück sagen.`,
      `VO2max: du bist fast all-out, Sprechen ist unmöglich.`,
    ] },

    { type: 'h1', text: 'Laufschritt und Kadenz' },
    { type: 'list', items: [
      `Ziele auf eine Kadenz von 170 bis 180 Schritten pro Minute, um die Stöße zu begrenzen.`,
      `Setze den Fuß unter deinem Schwerpunkt auf, nicht davor — reduziert das Bremsen und Verletzungen.`,
      `Halte den Oberkörper aufrecht, den Blick fern, die Schultern locker.`,
      `Die Arme geben den Rhythmus: Ellbogen bei 90°, Vor-und-zurück-Bewegung, Hände locker.`,
    ] },

    { type: 'h1', text: '5-km-Plan — 6 Wochen (Anfänger)' },
    { type: 'p', text: `3 Einheiten pro Woche. Ziel: 5 km ohne Pause laufen, dann die Zeit verbessern.` },
    { type: 'list', items: [
      `Woche 1: 1 Min Laufen / 1 Min Gehen × 10, dreimal.`,
      `Woche 2: 2 Min Laufen / 1 Min Gehen × 8.`,
      `Woche 3: 5 Min Laufen / 1 Min Gehen × 4.`,
      `Woche 4: 10 Min Laufen / 1 Min Gehen × 3.`,
      `Woche 5: 20 Min Dauerlauf in der Grundlagenausdauer.`,
      `Woche 6: 1 Lauf von 25 Min + 1 Einheit 5 × 1 Min schnell + 5-km-Ziel am Wochenende.`,
    ] },

    { type: 'h1', text: '10-km-Plan — 8 Wochen' },
    { type: 'p', text: `4 Einheiten pro Woche: 2 in Ausdauer, 1 an der Schwelle, 1 langer Lauf. Erhöhe das Volumen um maximal 10% pro Woche.` },
    { type: 'list', items: [
      `Ausdauereinheit: 30 bis 45 Min locker.`,
      `Schwelleneinheit: 2 × 10 Min im 10-km-Tempo mit 3 Min Erholung.`,
      `VO2max-Einheit: 8 bis 10 × 400 m schnell mit 200 m Erholung.`,
      `Langer Lauf: 50 bis 70 Min progressiv, bis 12 km.`,
    ] },

    { type: 'h1', text: 'Halbmarathon-Plan — 10 Wochen' },
    { type: 'list', items: [
      `Volumen: 4 bis 5 Einheiten, progressive Steigerung bis 18 km beim langen Lauf.`,
      `Schlüsseleinheit: 3 × 2 km im Halbmarathon-Tempo, 2 Min Erholung.`,
      `Baue alle 2 Wochen eine Berg-Einheit für die Kraft ein.`,
      `Behalte eine kurze VO2max-Einheit, um die Geschwindigkeit zu erhalten.`,
      `Wochen 9-10: Tapering — reduziere das Volumen um 40%, behalte etwas Intensität.`,
    ] },

    { type: 'h1', text: 'Marathon-Plan — 12 Wochen' },
    { type: 'list', items: [
      `Basis: 5 Einheiten pro Woche, progressiver langer Lauf bis 30-32 km.`,
      `Spezifische Einheiten im Marathon-Tempo: 2 × 5 km, dann 3 × 5 km im Lauf der Wochen.`,
      `Ein langer Lauf pro Woche in Ausdauer ist die Säule des Plans.`,
      `Teste unbedingt deine Wettkampfernährung bei den langen Läufen.`,
      `3 Wochen Tapering vor dem großen Tag: die Müdigkeit verwandelt sich in Frische.`,
    ] },
    { type: 'note', text: `Teste am Wettkampftag nie etwas Neues: weder Schuhe noch Ernährung noch Starttempo. Alles muss im Training geprobt worden sein.` },

    { type: 'h1', text: 'Die Kräftigung des Läufers' },
    { type: 'p', text: `Zwei kurze Einheiten pro Woche reichen, um Verletzungen zu reduzieren und die Laufökonomie zu verbessern.` },
    { type: 'list', items: [
      `Rumpf (Plank, seitliche Plank): 3 × 30 bis 45 s.`,
      `Ausfallschritte und Kniebeugen mit Körpergewicht: 3 × 12.`,
      `Wadenheben: 3 × 20.`,
      `Gesäßbrücke: 3 × 15, um die hintere Kette zu stärken.`,
    ] },

    { type: 'h1', text: 'Die Ernährung des Läufers' },
    { type: 'list', items: [
      `Davor (3 h): Mahlzeit reich an Kohlenhydraten, arm an Fett und Ballaststoffen.`,
      `Während (ab 75 Min): 30 bis 60 g Kohlenhydrate pro Stunde (Gels, Getränk, Trockenfrüchte).`,
      `Hydration: trink regelmäßig in kleinen Schlucken, warte nicht auf den Durst.`,
      `Danach: Kohlenhydrate + Protein in den ersten 30 Min zum Auffüllen und Reparieren.`,
      `Der „Mann mit dem Hammer“ im Marathon kommt von Kohlenhydratmangel: trainiere deine Verpflegung.`,
    ] },

    { type: 'h1', text: 'Verletzungsprävention — 7 Punkte' },
    { type: 'list', items: [
      `Erhöhe dein Volumen um maximal 10% pro Woche.`,
      `Kräftige Gesäß und Waden zweimal pro Woche.`,
      `Arbeite an der Mobilität von Knöcheln und Hüften.`,
      `Wechsle deine Schuhpaare und tausche sie alle 700 bis 900 km.`,
      `Vernachlässige nie das Aufwärmen vor intensiven Einheiten.`,
      `Halte mindestens 1 kompletten Ruhetag pro Woche ein.`,
      `Höre auf die Signale: ein Schmerz, der 3 Tage bleibt, verlangt Ruhe.`,
    ] },

    { type: 'h1', text: 'Das Mindset des Wettkämpfers' },
    { type: 'list', items: [
      `Teile das Rennen in kurze Abschnitte, statt an die Gesamtdistanz zu denken.`,
      `Bereite 2 oder 3 Mantras vor, die du wiederholst, wenn es hart wird.`,
      `Visualisiere am Vorabend dein ideales Rennen, vom Start bis ins Ziel.`,
      `Akzeptiere das Unbehagen: es ist vorübergehend und Teil des Spiels.`,
      `Setze dir 3 Ziele: ein ehrgeiziges, ein realistisches und ein „egal was passiert“.`,
    ] },

    { type: 'h1', text: 'FAQ & Wettkampftag' },
    { type: 'p', text: `Wie oft laufen? 3 Einheiten zum Start, 4 bis 5 für die langen Distanzen. Beständigkeit geht vor Volumen.` },
    { type: 'p', text: `Soll ich mich vorher dehnen? Eher ein progressives Aufwärmen (Gehen, dann Traben). Spare die langen Dehnungen für danach oder Ruhetage auf.` },
    { type: 'p', text: `Wie gehe ich den Start an? Geh langsamer los als dein Zieltempo: man gewinnt ein Rennen nicht im ersten Kilometer, aber man kann es verlieren.` },
    { type: 'note', text: `Gutes Rennen! Das Schwerste ist schon getan: du hast dich verpflichtet. Folge dem Plan, respektiere deine Tempi und vertraue deiner Vorbereitung. Wir sehen uns im Ziel.` },
  ],
}

export const GUIDES_DE: Record<string, Guide> = {
  d1: masse,
  d2: seche,
  d3: hiit,
  d4: running,
}
