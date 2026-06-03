# 📊 Stratégie Meta Ads — Xenotif® (marchés francophones)

> Document de travail marketing. Pixel `1260922799206843` + API Conversions actifs.
> Optimisation : ventes (guides) + abonnements fitness. Langue : **français**, ciblage **francophone**.

---

## 1. Analyse de l'offre
- Coaching **IA personnalisé** multi-disciplines (running, muscu, HIIT, CrossFit, natation, cyclisme).
- Abonnements : **Pro 9,99 €/mois** (95,88 €/an) · **Élite 24,99 €/mois** (239,88 €/an) · **essai gratuit 7 j sans engagement**.
- **Boutique** : guides digitaux 14,90–29 € (prise de masse, sèche, HIIT, running) + produits affiliés Amazon.
- Promesse : « Forge ton corps. Dépasse tes limites. »
- Angle clé : coach perso (~200 €/mois) → IA à 9,99 €, à domicile, essai sans risque.

---

## 2. Ciblage marchés francophones

**Niveau 1 — abonnement payant prioritaire (fort pouvoir d'achat, paiement carte courant)**
- 🇫🇷 France · 🇧🇪 Belgique · 🇨🇭 Suisse (romande) · 🇱🇺 Luxembourg · 🇲🇨 Monaco · 🇨🇦 Canada (Québec, ciblage langue FR).
- Devises affichées par Meta selon le pays ; ton paiement reste en EUR (Stripe gère la conversion carte).

**Niveau 2 — test volume / guides digitaux (CPA plus bas, conversion abo plus difficile)**
- 🇲🇦 Maroc · 🇩🇿 Algérie · 🇹🇳 Tunisie · 🇸🇳 Sénégal · 🇨🇮 Côte d'Ivoire.
- Recommandation : sépare ces pays dans des **ad sets dédiés** (ne PAS les mélanger avec le Niveau 1, sinon le budget part vers le CPM le moins cher au détriment de la valeur). Mets-y plutôt les **guides à 14,90 €** que l'abonnement.

**Réglage langue** : dans l'ad set → Langues → **Français** (évite de diffuser à des non-francophones dans les pays multilingues comme la Suisse/Canada/Belgique).

---

## 3. Structure de campagne

**Phase 1 — Test (S1-S2)**
| Campagne | Objectif | Événement optimisé | Géo |
|---|---|---|---|
| C1 – Acquisition abonnés | Ventes/Conversions | `CompleteRegistration` → `Subscribe` | Niveau 1 |
| C2 – Boutique guides | Ventes/Conversions | `Purchase` | Niveau 1 (+ test Niveau 2) |
| C3 – Notoriété/Trafic | Trafic/Engagement | clic / ViewContent | Niveau 1 |

**Phase 2 — Scaling**
| Campagne | Détail |
|---|---|
| C4 – Retargeting | visiteurs 7/14/30 j + abandons panier → Subscribe/Purchase |
| C5 – Lookalike | LLA 1-3 % (acheteurs/abonnés), pays par pays |
| C6 – Advantage+ Shopping (ASC) | automatisée Meta pour scaler les gagnants |

Règles : 1 campagne = 1 objectif · 2-3 ad sets · 3-5 créas/ad set · CBO après validation du test.

---

## 4. Budget

| Étape | Budget/jour | Durée | But |
|---|---|---|---|
| Test | 20-30 € (12 € C1 / 8 € C2 / 5 € C3) | 7-14 j | trouver créas + audiences gagnantes |
| Apprentissage | viser ≥ 50 conversions/sem/ad set | — | sortir de l'apprentissage |
| Scaling | +20-30 % tous les 3-4 j sur les gagnants | continu | augmenter sans casser l'algo |

Coupe un créatif sous **1 % CTR** ou **CPA > 2× cible**. Ne juge pas avant 3-4 jours.

---

## 5. 10 audiences

**Froides**
1. Fitness débutants — *remise en forme, perte de poids, vie saine* · 18-45.
2. Musculation — *musculation, MyProtein, haltérophilie, whey* · H 18-40.
3. Running — *course à pied, marathon, Strava, semi-marathon* · 20-50.
4. HIIT/CrossFit — *CrossFit, Freeletics, intervalles* · 18-40.
5. Femmes fitness — *yoga, pilates, fitness féminin* · F 20-45.
6. Apps & coaching (concurrence) — *Nike Training Club, Freeletics, Fitbit, Basic-Fit, Fizzup* · 18-45.
7. Nutrition sportive — *nutrition sportive, sèche, compléments* · 20-45.
8. Reprise/résolutions — *salle de sport, motivation* (boost janv./sept.).

**Chaudes**
9. Visiteurs site 7/14/30 j (Pixel), exclure acheteurs.
10. Lookalike 1-3 % sur `CompleteRegistration` + `Purchase` (dès ~100 conv).

---

## 6. 20 textes publicitaires (Primary text)

1. **Et si ton coach sportif tenait dans ta poche ?** Programmes 100 % personnalisés par IA, adaptés à ton niveau et ton emploi du temps. 🏋️ Essaie 7 jours gratuitement.
2. **200 €/mois pour un coach perso ? Plus besoin.** Xenotif® te coache par IA dès 9,99 €/mois. Running, muscu, HIIT… ton programme sur mesure. Essai gratuit 7 jours.
3. Pas le temps d'aller à la salle ? **Entraîne-toi où tu veux, quand tu veux.** Séances guidées de 20 à 45 min, à la maison. Premier résultat en 30 jours. 💪
4. **Tu recommences le sport… encore une fois ?** Cette fois, un coach IA te suit jour après jour pour que tu ne lâches plus. 7 jours offerts, sans engagement.
5. Muscu, running, HIIT, CrossFit, natation, vélo… **un seul abonnement, tous tes sports.** Coaching IA + suivi de progression. Essaie gratuitement 7 jours.
6. **Ton corps peut tout. C'est ta tête qu'il faut convaincre.** Xenotif® te motive chaque jour avec un plan clair et des résultats mesurables. 🔥 Commence gratuitement.
7. Arrête de suivre des programmes au hasard. **Un vrai plan, adapté à TOI**, qui évolue avec tes progrès. Coaching IA dès 9,99 €/mois.
8. **7 jours pour transformer ta routine.** Essaie Xenotif® gratuitement : programmes personnalisés, vidéos HD, suivi des perfs. Aucun engagement.
9. La motivation se construit. **Xenotif® t'envoie ton défi du jour** et t'accompagne à chaque séance. Rejoins des milliers de sportifs. 7 jours offerts.
10. **Débutant ? Parfait.** On te prend par la main : exercices filmés, progression douce, zéro risque de blessure. Premier programme gratuit 7 j.
11. **Prise de masse, sèche, endurance…** quel que soit ton objectif, Xenotif® calcule ton plan et tes macros. Coaching IA + nutrition. Essai gratuit.
12. Le secret des gens en forme ? **La régularité, pas la motivation.** Xenotif® rend l'entraînement simple et addictif. 7 jours gratuits.
13. **Transforme 20 minutes par jour en résultats visibles.** Séances HIIT ultra-efficaces, sans matériel, à la maison. Commence ton essai gratuit. ⚡
14. Ton premier 10 km ? Ton marathon ? **Plan d'entraînement personnalisé semaine par semaine.** Xenotif® t'y emmène. Essaie 7 jours.
15. **Plus de 3 200 sportifs nous font confiance.** Programmes IA, vidéos HD, suivi complet. Rejoins-les avec 7 jours offerts. 💪
16. Marre des salles bondées et des abos hors de prix ? **Ta salle, c'est chez toi.** Xenotif® dès 9,99 €/mois. Essai gratuit 7 jours.
17. **Ton plan nutrition + entraînement, au même endroit.** Macros calculées, recettes fitness, séances guidées. Teste gratuitement.
18. Chaque jour sans plan, c'est un jour perdu. **Reprends le contrôle de ta forme aujourd'hui** avec un coaching IA qui s'adapte à toi. 7 jours offerts.
19. **Femmes : un programme pensé pour vous.** Renforcement, tonus, confiance. Séances guidées et progressives, à ton rythme. Essaie gratuitement.
20. **Guides d'entraînement premium dès 14,90 €.** Prise de masse 12 semaines, sèche, HIIT, running… téléchargement immédiat. Forge ton corps dès aujourd'hui.

---

## 7. 20 titres (Headlines)

1. Ton coach IA pour 9,99 €/mois
2. 7 jours gratuits, sans engagement
3. Forge ton corps. Dépasse tes limites.
4. Le coaching perso enfin accessible
5. Tous tes sports, un seul abo
6. Transforme-toi en 30 jours
7. Ta salle de sport, c'est chez toi
8. Un programme rien que pour toi
9. Essaie gratuitement 7 jours
10. Arrête d'abandonner. Cette fois.
11. Coaching IA + nutrition incluse
12. 20 min/jour = des résultats
13. Débutant ? On t'accompagne
14. Cours ton premier 10 km
15. Prise de masse en 12 semaines
16. Moins cher qu'un café par jour
17. Rejoins +3 200 sportifs
18. Ton plan, tes règles, tes résultats
19. Muscu, running, HIIT… à la maison
20. Commence ta transformation aujourd'hui

---

## 8. 20 descriptions

1. Coaching IA personnalisé. Annule quand tu veux.
2. Programmes adaptés à ton niveau et ton objectif.
3. Vidéos HD, suivi des perfs, motivation quotidienne.
4. Running, muscu, HIIT, CrossFit, natation, vélo.
5. Sans engagement. Premier résultat en 30 jours.
6. Essaie 7 jours, paie seulement si tu continues.
7. Plus de 3 200 sportifs nous font confiance.
8. Ton plan nutrition + entraînement réunis.
9. À domicile, sans matériel, à ton rythme.
10. Dès 9,99 €/mois — moins qu'un abo salle.
11. L'IA qui s'adapte à chaque séance.
12. Macros calculées et recettes fitness incluses.
13. Pour débutants comme confirmés.
14. Des résultats durables, pas des régimes éclair.
15. Rejoins la communauté Xenotif® aujourd'hui.
16. Télécharge ton guide premium en 1 clic.
17. Progresse semaine après semaine.
18. Annulation en 2 clics, zéro engagement.
19. Le coaching premium sans le prix.
20. Ton objectif, notre méthode. Commence gratuitement.

---

## 9. 10 scripts vidéo (storyboards prêts à produire)

> Format **9:16**, 15-30 s, **sous-titres incrustés**, hook < 3 s, logo + CTA en fin. Musique rythmée libre de droits (CapCut/Epidemic). Couleurs : noir + orange #FF4500.

### V1 — « 200 € vs 9,99 € »
- **0-3 s** : split écran. Gauche « COACH PERSO » + « 200 €/mois » (rouge). Droite app Xenotif + « 9,99 €/mois » (orange). Texte : *Le même coaching.*
- **3-10 s** : montage rapide de séances (muscu, run, HIIT) sur le côté droit. Texte : *20× moins cher. Dans ta poche.*
- **10-15 s** : écran final logo + « 7 JOURS GRATUITS ». Voix/texte : *Essaie Xenotif® gratuitement.* CTA.

### V2 — POV première séance
- **0-3 s** : main qui ouvre l'app (POV). Texte : *Ta 1ʳᵉ séance commence ici.*
- **3-12 s** : enchaînement séance guidée (vue 1ʳᵉ personne), sueur, effort, timer. Texte : *Un plan rien que pour toi.*
- **12-18 s** : sourire + écran de stats qui montent. CTA *Commence gratuitement.*

### V3 — Régularité (30 jours)
- **0-3 s** : texte plein écran *30 jours. 1 plan. Des résultats.*
- **3-15 s** : timelapse d'une routine quotidienne (app + séances + cocher les jours). Montrer la **progression des perfs** (graphes), pas le corps.
- **15-22 s** : *La régularité, pas la motivation.* + CTA essai gratuit.

### V4 — « Tu recommences encore ? » (émotionnel)
- **0-3 s** : texte *Tu recommences le sport… encore une fois ?* (fond sombre).
- **3-12 s** : personne hésitante → ouvre Xenotif → reçoit son « défi du jour » → s'entraîne. Texte : *Cette fois, tu ne lâches plus.*
- **12-18 s** : *Un coach IA qui te suit chaque jour.* CTA *7 jours offerts.*

### V5 — Multi-sport
- **0-3 s** : cut ultra-rapide run → muscu → HIIT → natation → vélo. Texte : *Tous tes sports.*
- **3-10 s** : app montrant le choix des disciplines. Texte : *Un seul abo.*
- **10-15 s** : logo + *Dès 9,99 €/mois. Essai gratuit.* CTA.

### V6 — Démo app (screencast)
- **0-3 s** : *Comment ça marche ?*
- **3-15 s** : capture écran : choisir discipline → séance guidée → suivi des perfs (3 étapes claires, zoom).
- **15-20 s** : *Simple. Personnalisé. Efficace.* CTA *Essaie 7 jours.*

### V7 — Sans matériel à la maison
- **0-3 s** : quelqu'un déplace sa table de salon. Texte : *Pas de salle ? Pas d'excuse.*
- **3-12 s** : séance bodyweight dans le salon avec l'app posée devant.
- **12-18 s** : *Ta salle, c'est chez toi.* + CTA.

### V8 — UGC témoignage (style authentique smartphone)
- **0-5 s** : une personne face caméra (selfie) : *J'ai testé Xenotif® pendant 30 jours, voilà ce qui a changé…*
- **5-18 s** : raconte (régularité, plaisir, résultats) + b-roll de ses séances.
- **18-25 s** : *Essaie les 7 jours gratuits, tu verras.* CTA. → **Le format le plus performant : à refaire avec 2-3 personnes différentes.**

### V9 — « 20 minutes chrono »
- **0-3 s** : gros timer **20:00** qui démarre. Texte : *C'est tout ce qu'il te faut.*
- **3-15 s** : montage HIIT intense, timer qui défile, sueur.
- **15-20 s** : timer **00:00** + *Séance terminée.* + CTA *Commence ta 1ʳᵉ séance gratuite.*

### V10 — Coach IA explainer (animation simple)
- **0-3 s** : *Comment l'IA crée TON programme ?*
- **3-15 s** : 3 étapes animées — 1) Tes objectifs → 2) L'IA calcule ton plan → 3) Tu t'entraînes, ça s'adapte.
- **15-20 s** : logo + *Le coaching intelligent dès 9,99 €/mois.* CTA.

---

## 10. 10 concepts d'images (+ prompts IA)

> 1:1 (feed) et 9:16 (stories). Texte < 20 % de l'image. Noir/anthracite + orange #FF4500. Coller les prompts dans Midjourney / DALL·E / Ideogram, puis ajouter le texte sur Canva.

1. **Athlète en effort** — overlay « 7 JOURS OFFERTS ».
   `athletic person training hard in a dark modern gym, dramatic orange rim lighting, cinematic motivational fitness photography, empty copy space at top, ultra detailed, 1:1`
2. **App en main** — overlay « Ton coach dans ta poche ».
   `close-up of a hand holding a smartphone showing a sleek dark fitness app with orange accents, blurred gym background, modern, 1:1`
3. **Split prix** — montage Canva : « Coach perso 200 € » (barré) / « Xenotif 9,99 € » (orange).
4. **Flat-lay home workout** — overlay « Ta salle, c'est chez toi ».
   `top-down flat lay of home workout gear: dumbbells, yoga mat, smartphone with fitness app, water bottle, dark moody background, orange accents, 1:1`
5. **Femme renforcement** — overlay « Un programme pensé pour toi ».
   `fit woman doing a strength workout at home, bright natural light, motivational, authentic, copy space, 1:1`
6. **Coureur lever de soleil** — overlay « Cours ton premier 10 km ».
   `runner on an empty road at sunrise, dynamic motion, warm orange tones, cinematic, 9:16`
7. **Typo forte** — Canva : fond noir, « FORGE TON CORPS. » blanc + accent orange + logo + CTA.
8. **Grille 3 sports** — Canva : run / muscu / HIIT, overlay « Tous tes sports, un seul abo ».
9. **Badge essai** — Canva : fond orange, « 7 JOURS GRATUITS · SANS ENGAGEMENT » + logo.
10. **Boutique guides** — Canva : couvertures PDF (prise de masse, sèche, HIIT, running), overlay « Guides premium dès 14,90 € ».

---

## 11. Tracking des conversions (déjà en place)

| Campagne | Événement d'optimisation |
|---|---|
| Acquisition abonnés | `CompleteRegistration` → `Subscribe` |
| Boutique | `Purchase` (avec valeur €) |
| Retargeting | `InitiateCheckout` → `Subscribe`/`Purchase` |
| Notoriété/Trafic | `ViewContent` / clic |

Pixel + API Conversions actifs, déduplication OK. Commence sur `CompleteRegistration` (volume) puis bascule sur `Subscribe`/`Purchase` à ≥ 50 conv/sem.

---

## 12. Config pas à pas — première campagne (Acquisition abonnés)

1. **Gestionnaire de publicités** → **Créer**.
2. **Objectif** : *Ventes* (Sales).
3. **Campagne** : nomme `C1 – Acquisition abonnés FR` · laisse Advantage Campaign Budget **désactivé** au début (budget à l'ad set pour mieux tester).
4. **Ad set** :
   - **Conversion** : Site web → événement **`CompleteRegistration`**.
   - **Budget** : 12 €/jour.
   - **Audience** : commence par 1 intérêt large (ex. *remise en forme*) OU **Advantage+ Audience** (recommandé par Meta) avec suggestion.
   - **Lieux** : France, Belgique, Suisse, Luxembourg, Monaco (Niveau 1).
   - **Langue** : Français.
   - **Âge** : 18-45.
   - **Placements** : **Advantage+ (automatiques)**.
5. **Publicité** :
   - Format : *Une seule image ou vidéo* (teste 1 vidéo + 1 image par ad).
   - **Texte principal** : un des 20 textes · **Titre** : un des 20 · **Description** : une des 20.
   - **Destination** : `https://xenotif.com/auth/signup?plan=pro` (ou la home).
   - **CTA** : *S'inscrire* ou *Essayer gratuitement*.
6. Crée **3-4 publicités** (angles différents) dans le même ad set.
7. **Publier** → laisser tourner **3-4 jours sans toucher**.

> Duplique ensuite l'ad set gagnant pour C2 (Boutique, objectif `Purchase`, destination `/boutique`).

---

## 13. Optimisation & conformité

- Apprentissage : viser 50 conv/sem/ad set, ne rien toucher 3-4 j.
- Scaling : +20 % de budget tous les 3-4 j sur les gagnants ; ou duplique en CBO.
- **Le créatif fait 80 % du résultat** : teste 4-5 angles, renouvelle toutes les 2 semaines (fatigue créative). **UGC > production léchée** en fitness.
- ⚠️ **Conformité Meta** : pas de « avant/après » culpabilisant, pas de gros plans sur les défauts du corps, pas de promesses chiffrées irréalistes. Reste positif et factuel pour éviter les refus.

---

*Dernière mise à jour : juin 2026.*
