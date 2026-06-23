# 🔍 Stratégie Google Ads — Xenotif® (marchés francophones)

> Document de travail marketing. GA4 `G-3H3JTM404V` actif (gtag.js dans le layout).
> ⚠️ **Conversions Google Ads pas encore configurées** (voir §10 avant de lancer).
> Optimisation : ventes (guides) + abonnements fitness. Langue : **français**, ciblage **francophone**.

---

## 0. Google ≠ Meta — pourquoi ce doc est différent

| | Meta Ads | Google Ads |
|---|---|---|
| Logique | **Interruption** (on pousse à un public qui ne cherche rien) | **Intention** (on répond à une recherche active) |
| Levier créatif | Vidéo/UGC qui arrête le scroll | **Mot-clé** + annonce texte pertinente |
| Intention d'achat | Faible → moyenne | **Élevée** sur la recherche |
| Coût | CPM bas, CPA variable | CPC plus cher mais **trafic chaud** |
| Format clé | Vidéo 9:16 | **RSA** (Responsive Search Ads) + **Performance Max** |

**Conséquence** : sur Google, le nerf de la guerre n'est pas la créa mais le **choix des mots-clés + les négatifs**. On capte des gens qui tapent déjà « coach sportif en ligne » ou « programme prise de masse ».

---

## 1. Analyse de l'offre
- Coaching **IA personnalisé** multi-disciplines (running, muscu, HIIT, CrossFit, natation, cyclisme).
- Abonnements : **Pro 9,99 €/mois** (95,88 €/an) · **Élite 24,99 €/mois** (239,88 €/an) · **essai gratuit 7 j sans engagement**.
- **Boutique** : guides digitaux 14,90–29 € (prise de masse, sèche, HIIT, running) + produits affiliés Amazon.
- Promesse : « Forge ton corps. Dépasse tes limites. »
- Angle clé : coach perso (~200 €/mois) → IA à 9,99 €, à domicile, essai sans risque.

---

## 2. Types de campagnes à activer (et dans quel ordre)

| Priorité | Type | Objectif | Pourquoi |
|---|---|---|---|
| 1 | **Search — Marque** | Protéger « xenotif » | Empêcher les concurrents d'acheter ton nom. CPC ~ nul, ROAS énorme. |
| 2 | **Search — Génériques** | Acquisition abo + guides | Capte l'intention (« coach sportif en ligne », « programme musculation »). Cœur du compte. |
| 3 | **Performance Max** | Ventes (abo + boutique) | Automatisé Google : Search + Display + YouTube + Gmail + Discover. À lancer après ~30 conversions/mois. |
| 4 | **YouTube / Demand Gen** | Notoriété + retargeting | Réutilise les 10 scripts vidéo du doc Meta. Vidéo skippable + Demand Gen. |
| 5 | **Display retargeting** | Récupérer les visiteurs | Visiteurs site / abandons → bannières responsives. |

> Ne PAS lancer Performance Max **en premier** : sans données de conversion, PMax brûle le budget. Commence par Search Marque + Génériques pour alimenter l'algo, puis ouvre PMax.

---

## 3. Architecture du compte

```
Compte Xenotif®
├─ C1 · Search — Marque (FR)
│   └─ AG: Marque exacte / Marque + concurrents
├─ C2 · Search — Coaching/App (FR)
│   ├─ AG: Coach sportif en ligne
│   ├─ AG: Application coaching / fitness
│   └─ AG: Coach IA / programme personnalisé
├─ C3 · Search — Musculation/Objectifs (FR)
│   ├─ AG: Prise de masse
│   ├─ AG: Sèche / perte de poids
│   └─ AG: Programme muscu maison/débutant
├─ C4 · Search — Running (FR)
│   ├─ AG: Plan 10 km / semi
│   └─ AG: Plan marathon débutant
├─ C5 · Search — Boutique guides (FR)
│   └─ AG: Guide/programme PDF
├─ C6 · Performance Max — Abo
├─ C7 · Performance Max — Boutique
└─ C8 · YouTube/Demand Gen + Display retargeting
```

Règle : **un thème = un groupe d'annonces**, 1 jeu de mots-clés serré + 1 RSA dédiée par AG (cohérence mot-clé → annonce → page = meilleur Quality Score = CPC plus bas).

---

## 4. Stratégie de mots-clés (le cœur)

### Types de correspondance — par où commencer
- **Phrase** `"…"` et **Exact** `[…]` au lancement (contrôle + données propres).
- **Large** (broad) seulement **après** que le Smart Bidding tourne (avec signaux d'audience), jamais à froid.

### C1 — Marque
`[xenotif]` · `"xenotif app"` · `"xenotif avis"` · `"xenotif abonnement"` · `"xenotif coach"`

### C2 — Coaching / App
`"coach sportif en ligne"` · `"coach sportif à domicile"` · `[coach sportif ia]` · `"application coaching sportif"` · `"appli coach sportif"` · `"programme sport personnalisé"` · `"coaching fitness en ligne"` · `"coach musculation en ligne"` · `"meilleure application fitness"`

### C3 — Musculation / Objectifs
`"programme prise de masse"` · `[programme prise de masse]` · `"programme sèche musculation"` · `"programme musculation maison"` · `"programme musculation débutant"` · `"programme perte de poids"` · `"programme minceur sport"` · `"plan nutrition musculation"` · `"calcul macros musculation"`

### C4 — Running
`"plan entraînement 10 km"` · `"programme semi-marathon"` · `"plan marathon débutant"` · `"programme course à pied débutant"` · `"plan entraînement running"`

### C5 — Boutique guides
`"guide musculation pdf"` · `"programme musculation pdf"` · `"programme prise de masse pdf"` · `"plan entraînement pdf"` · `"guide sèche pdf"`

### Concurrents (campagne Search distincte, budget séparé)
`"alternative Freeletics"` · `"comme Nike Training Club"` · `"alternative Fizzup"` · `"Gymondo avis"`
> ⚠️ On peut **enchérir** sur les marques concurrentes mais **interdiction d'écrire leur nom dans l'annonce** (règle Google sur les marques déposées). Garde-les isolées : CPC et CTR différents.

### 🚫 Mots-clés négatifs (CRITIQUE — à poser dès J0)
Liste partagée au niveau du compte :
`gratuit` (ambigu — tester) · `emploi` · `recrutement` · `salaire` · `devenir coach sportif` · `formation coach sportif` · `BPJEPS` · `diplôme` · `métier` · `fiche métier` · `stage` · `pdf gratuit` · `torrent` · `crack` · `télécharger gratuit` · `wikipedia` · `définition`
> Sans ça, ton budget part dans les recherches « devenir coach sportif » / « formation BPJEPS » qui ne convertiront jamais. **Vérifie le rapport sur les termes de recherche 2×/semaine** la 1ʳᵉ quinzaine et ajoute les négatifs au fil de l'eau.

---

## 5. Annonces RSA (Responsive Search Ads)

> Format Google : **jusqu'à 15 titres (≤ 30 caractères)** + **4 descriptions (≤ 90 caractères)**. Google teste les combinaisons. **Épingle** 1-2 titres clés en position 1 (nom + promesse) et laisse le reste libre. URL finale `https://xenotif.com/...`, chemins d'affichage `/coaching` `/essai-gratuit`.

### RSA — Abonnement (C2/C3/C4)
**15 titres**
1. Coach sportif IA 9,99 €/mois
2. Ton coach dans ta poche
3. 7 jours d'essai gratuit
4. Programme 100% personnalisé
5. Tous tes sports, un seul abo
6. Coaching fitness à domicile
7. Sans engagement, annule quand
8. Forge ton corps
9. Muscu, running, HIIT & +
10. Résultats en 30 jours
11. Moins cher qu'une salle
12. Essaie gratuitement 7 jours
13. Coaching IA + nutrition
14. Ton programme sur mesure
15. Le coach perso accessible

**4 descriptions**
1. Coach IA perso : muscu, running, HIIT, CrossFit. Essaie 7 jours, sans engagement.
2. Programmes adaptés à ton niveau et objectif. Vidéos HD + suivi des perfs. Dès 9,99 €.
3. Ta salle à la maison. Séances guidées de 20 à 45 min. Premier résultat en 30 jours.
4. Coaching premium sans le prix. Annulation en 2 clics. Commence ton essai gratuit.

### RSA — Boutique guides (C5)
**Titres (extrait)**
1. Guides d'entraînement premium
2. Programme prise de masse PDF
3. Téléchargement immédiat
4. Dès 14,90 € — accès direct
5. Prise de masse 12 semaines
6. Programme sèche & HIIT
7. Plan running semaine/semaine
8. Forge ton corps dès aujourd'hui

**Descriptions**
1. Guides premium muscu, sèche, HIIT, running. PDF haute qualité, téléchargement immédiat.
2. Programmes pros dès 14,90 €. Paiement sécurisé, accès à vie. Commence aujourd'hui.

---

## 6. Extensions / Assets (à remplir — gain de CTR immédiat)

- **Liens annexes (sitelinks)** : *Essai gratuit 7 j* → `/auth/signup?plan=pro` · *Disciplines* → `/disciplines` · *Boutique* → `/boutique` · *Tarifs* → `/abonnement`.
- **Accroches (callouts)** : Sans engagement · Essai 7 jours · Coaching IA · Vidéos HD · Annulation en 2 clics · +3 200 sportifs.
- **Extraits structurés** : en-tête *Types* → Musculation, Running, HIIT, CrossFit, Natation, Cyclisme.
- **Asset image** : visuels premium (réutiliser les concepts du doc Meta).
- **Asset appel à l'action / Promotion** : « 7 jours offerts ».
- **Extension de prix** : Pro 9,99 €/mois · Guides dès 14,90 €.

---

## 7. Performance Max — groupes d'éléments (après ~30 conv/mois)

Par **groupe d'éléments** (1 pour l'abo, 1 pour la boutique), fournir :
- **Titres** (≤ 30 car) : piocher dans la RSA ci-dessus.
- **Titres longs** (≤ 90 car) : « Ton coach sportif IA personnalisé — muscu, running, HIIT. Essai 7 jours offerts. »
- **Descriptions** (≤ 90 car) : idem RSA.
- **Images** : 1200×628 (paysage), 1200×1200 (carré), 1200×1500 (portrait) + logo.
- **Vidéos** : réutiliser les **10 scripts** du doc Meta (9:16 + 16:9). Si aucune vidéo fournie, Google en génère une (médiocre → en fournir une vraie).
- **Signaux d'audience** : clients existants (liste e-mails abonnés), visiteurs site, intérêts fitness/musculation/running. → accélère l'apprentissage.

---

## 8. YouTube / Demand Gen

- **Vidéos** : V1 (« 200 € vs 9,99 € »), V8 (UGC témoignage) et V9 (« 20 minutes chrono ») du doc Meta sont les meilleures pour YouTube.
- **Formats** : In-stream skippable (CPV) pour la notoriété + **Demand Gen** (ex-Discovery) pour la conversion, audiences fitness + similaires aux abonnés.
- **Hook < 5 s** obligatoire (avant le bouton « Ignorer »).

---

## 9. Enchères & budget

| Étape | Stratégie d'enchères | Budget/jour | Note |
|---|---|---|---|
| Lancement (S1-S2) | **Maximiser les conversions** (sans tCPA) | 15-25 € | Laisser Google apprendre, ne pas brider. |
| Stabilisation | **tCPA** (cible CPA) une fois ~30 conv | — | Fixer le tCPA légèrement au-dessus du CPA observé. |
| Boutique | **Maximiser la valeur de conv. / tROAS** | inclus | Quand les achats ont une valeur €. |

Répartition de départ : **Marque 15%** · **Génériques abo 55%** · **Boutique 20%** · **Concurrents 10%**.
Règle : ne pas changer d'enchères pendant la phase d'apprentissage (1-2 sem). Scaler le budget **+20-30%** tous les 4-5 jours sur les campagnes rentables.

---

## 10. ⚠️ Tracking des conversions — À CONFIGURER avant de lancer

**État actuel** : GA4 `G-3H3JTM404V` est posé (gtag.js + events `select_item` / `affiliate_click`). **Il n'y a PAS encore de conversion Google Ads** (aucune balise `AW-…`, aucun `send_to`).

**À faire (ordre recommandé)** :
1. **Lier GA4 ↔ Google Ads** (Admin GA4 → Associations de produits → Google Ads).
2. Dans GA4, marquer comme **événements clés** : `sign_up` (inscription → proxy `CompleteRegistration`), `purchase` (achat guide), et un event abonnement (`subscribe`/`begin_checkout`).
   - ⚠️ Vérifier que GA4 **émet bien** ces events : aujourd'hui le code ne pousse que `select_item`/`affiliate_click`. Il faudra ajouter `sign_up` à l'inscription et `purchase` après paiement (page de confirmation / webhook Stripe → gtag).
3. **Importer** ces événements clés comme **conversions** dans Google Ads.
4. Activer les **Conversions étendues (Enhanced Conversions)** — hash e-mail au moment de la conversion → meilleure attribution (équivalent de la CAPI Meta).
5. Définir la conversion **principale** = abonnement (Subscribe) ; secondaires = inscription + achat guide.

> Tant que §10 n'est pas fait, les campagnes Search peuvent tourner en « clics » mais le Smart Bidding (Max conv / tCPA / PMax) est **inutilisable**. C'est le prérequis n°1.

---

## 11. Plan de lancement pas à pas (première campagne)

1. **Google Ads** → Nouvelle campagne → Objectif **Ventes** (ou *Sans objectif → Search* pour garder la main).
2. Type **Search**. Décocher le Réseau Display (sinon le budget fuit en Display bas de gamme).
3. **Zones** : France (puis Belgique, Suisse, Luxembourg, Monaco, Québec). **Langue** : Français. *Présence : personnes dans la zone ciblée* (pas « intérêt pour »).
4. **Enchères** : Maximiser les conversions (ou « Clics » avec CPC plafonné si §10 pas prêt).
5. **Budget** : 15 €/jour.
6. **Groupe d'annonces** : 1 thème (ex. *Coach sportif en ligne*) + 8-12 mots-clés en **phrase/exact**.
7. **Négatifs** : importer la liste du §4 dès maintenant.
8. **RSA** : 15 titres + 4 descriptions (§5), 1-2 titres épinglés.
9. **Extensions** : sitelinks + accroches + extraits + appel (§6).
10. **URL finale** : `https://xenotif.com/auth/signup?plan=pro` (abo) ou `/boutique` (guides).
11. Publier → **laisser tourner 1-2 semaines** sans toucher (phase d'apprentissage).

> Démarre avec **C1 Marque + C2 Génériques abo**. Ajoute C5 Boutique, puis PMax (C6/C7) une fois les conversions remontées.

---

## 12. Optimisation & conformité

- **Quality Score** : aligner mot-clé → titre RSA → page de destination. Un QS élevé = CPC plus bas pour la même position.
- **Termes de recherche** : 2×/sem au début → ajouter négatifs + récupérer les nouveaux mots-clés gagnants.
- **Ne pas micro-optimiser** pendant l'apprentissage (1-2 sem). Juger après ≥ 30 conversions.
- Scaling : +20-30% de budget tous les 4-5 j sur le rentable ; ouvrir PMax une fois la donnée stable.
- ⚠️ **Règles Google** : pas d'allégations santé/perte de poids irréalistes (« perdez 10 kg en 1 semaine » = refus), pas de « avant/après » trompeur, pas de superlatifs non prouvés (« n°1 mondial »). Reste factuel.
- **RGPD / Consent Mode** : pas de bandeau de consentement aujourd'hui (cohérent avec GA4/Meta actuels) — à arbitrer si on veut le Consent Mode v2 pour l'UE.

---

## 14. Annexe — Liaison GA4 ↔ Google Ads (runbook UI)

> Les events `sign_up` et `purchase` sont **déjà en production** (`src/lib/analytics.ts` → `trackSignUp` / `trackPurchase`, posés à côté des events Meta sur signup + les 2 pages de succès Stripe). Il reste à les exploiter côté Google. Tout se fait dans les interfaces web GA4 + Google Ads.

**A. Prérequis**
- Compte **Google Ads** actif (facturation configurable sans lancer de campagne).
- **Administrateur** sur GA4 `G-3H3JTM404V` **et** sur Google Ads (idéalement même login Google).

**B. GA4 — marquer les événements clés**
1. GA4 → **Admin** → *Affichage des données* → **Événements clés**.
2. **« Nouvel événement clé »** → `sign_up` → Enregistrer. Refaire pour `purchase`.
   - 💡 On peut les créer par leur nom même avant le 1er déclenchement.

**C. Lier GA4 ↔ Google Ads**
1. GA4 → **Admin** → *Associations de produits* → **Associations Google Ads** → **Associer**.
2. Sélectionner le compte Google Ads → activer **Personnalisation pub** + **Marquage automatique (auto-tagging)** → Envoyer.

**D. Importer les conversions dans Google Ads**
1. Google Ads → **Objectifs** → **Conversions** → **+ Nouvelle action** → **Importer**.
2. **Google Analytics 4 (Web)** → cocher **`sign_up`** + **`purchase`** → Importer.

**E. Principale / secondaire**
- **`purchase`** = **Principale** (optimisation/ROAS). ⚠️ Couvre abo **et** guides (l'abo est câblé en `purchase`).
- **`sign_up`** = **Secondaire** (signal haut d'entonnoir). Possibilité de le passer Principale au démarrage pour le volume, puis rebasculer sur `purchase` à ~30-50 conv/sem.

**F. Conversions étendues (recommandé)**
- GA4 → **Admin** → *Collecte de données* → **Collecte de données fournies par l'utilisateur** → activer (hash e-mail → meilleure attribution, équivalent CAPI Meta).

**G. Vérifier**
- Google Ads → Conversions : statut **« Enregistrement des conversions »** sous 24-48 h après des events réels.
- GA4 → **Temps réel / DebugView** : `sign_up` à l'inscription, `purchase` à l'achat.

---

*Dernière mise à jour : juin 2026.*
