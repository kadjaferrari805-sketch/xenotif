# Phase 3 — « App & objets connectés » — Spécification

**Date :** 2026-06-12
**Branche :** `feat-phase3-app-devices`
**Contexte :** Phase 3 de la transformation premium (cf. [[transformation-premium]]). Couvre #3 (app) + #4 (objets connectés), version **marketing/présentationnelle** (aucun backend). Décisions actées : **PWA** (pas de boutons App Store/Play, cf. [[project_pwa]]) ; objets connectés présentés en **« réel + bientôt »** (capteur téléphone / Apple Fitness en direct, autres marques « bientôt » ; **Fitbit exclu**, cf. [[project_smartwatch]]).

## Objectif
Montrer que XENOTIF est une vraie app mobile (PWA installable) et qu'elle suit les performances depuis le téléphone/montres → confiance + valeur perçue.

## Principe
- 2 **sections d'accueil** présentationnelles, aucune nouvelle dépendance/backend.
- Réutilise l'existant : page d'install PWA `/app` (rend `AppInstall`), composant `ActivityRings`.
- i18n agnostique (libellés dans `messages`), animations Framer Motion (déjà utilisé), `prefers-reduced-motion` respecté, responsive + safe-area.

## Livrable 1 — `src/components/home/AppShowcase.tsx` (« L'app dans ta poche »)
- **Mockup smartphone** : cadre CSS (bord arrondi, encoche, ombre premium) contenant un **mini-écran d'app stylé** — réutilise `ActivityRings` (taille réduite) + 2-3 cartes stat + une barre type XP, pour évoquer l'app réelle **sans fausse capture**.
- **Texte** : titre + sous-titre + 4-5 points clés (entraînements guidés, nutrition, progression/XP, Coach IA, fonctionne hors-ligne).
- **CTA** « Installer l'app » → `Link` vers `/app` (page existante : QR desktop + « Ajouter à l'écran d'accueil »). **Aucun bouton App Store / Google Play.**
- Layout : 2 colonnes (texte / mockup) en desktop, empilé en mobile. Reveal au scroll + léger tilt du mockup.

## Livrable 2 — `src/components/home/DevicesSync.tsx` (« Synchronise tes performances »)
- **Titre + intro.**
- **Bloc « En direct »** (réel) : badge « En direct », mention capteur du téléphone / Apple Fitness (sur Mon espace). Liste de **métriques** suivies avec icônes lucide : Fréquence cardiaque (`Heart`), Calories (`Flame`), Pas (`Footprints`), Sommeil (`Moon`), Récupération (`Activity`).
- **Bloc « Bientôt »** : grille de marques compatibles à venir avec tag « Bientôt » — **Apple Watch, Garmin, Samsung Health, Google Health Connect** (PAS Fitbit). Représentées par une pastille + nom (pas de logos tiers téléchargés → on utilise icône `Watch` + nom, pour éviter tout asset de marque).
- Reveal au scroll.

## Intégration
- `src/app/[locale]/page.tsx` : insérer `<AppShowcase />` puis `<DevicesSync />` **après `<IntensityLevels />`** (avant `<Pricing />`).
- **i18n** : namespaces `appShowcase` et `devicesSync` (fr/en/de) — titres, sous-titres, points clés, libellés métriques, libellé « Bientôt »/« En direct », CTA.

## Tests (Jest)
- `AppShowcase` : rend le titre + le CTA « Installer l'app » (lien vers `/app`).
- `DevicesSync` : rend le titre, au moins une métrique (« Fréquence cardiaque »), et une marque « bientôt » (« Garmin ») ; **n'affiche PAS** « Fitbit ».

## Performance / SEO
- Sections SSG (composants serveur si pas d'état ; `AppShowcase` peut rester serveur, le tilt/anim via Framer = `'use client'` si nécessaire — garder client minimal). Pas d'image lourde (mockup CSS).

## Hors périmètre (phases ultérieures)
- **Synchronisation réelle multi-marques** (OAuth Garmin/Samsung/Google Health Connect, ingestion) — gros backend, non inclus.
- App native / stores — exclu (PWA).
- Vidéos témoignages / avant-après (#5/#6) → Phase 4.

## Critères de succès
1. Section app premium (mockup + install PWA, sans boutons stores) sur l'accueil.
2. Section objets connectés « réel + bientôt » (sans Fitbit, sans sur-promesse).
3. i18n fr/en/de, responsive, animations. Tests verts, tsc, lint.
