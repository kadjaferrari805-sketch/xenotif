# Phase 2 — « Gamification » — Spécification

**Date :** 2026-06-12
**Branche :** `feat-phase2-gamification`
**Contexte :** Phase 2 de la transformation premium (cf. [[transformation-premium]]). Couvre #9 (communauté/défis) + #10 (XP/niveaux/trophées), version **personnelle** et **calculée depuis l'activité réelle**. Décisions actées : pas de classement public au lancement (perso d'abord) ; défis prédéfinis rotatifs ; **aucune nouvelle table** (tout est dérivable de `workouts` + `progress`).

## Objectif
Augmenter l'engagement et la rétention : l'utilisateur voit sa progression gamifiée (XP, niveau, badges, défis) calculée à partir de son activité réelle.

## Principe d'architecture
- **Aucune table DB ajoutée.** XP/niveaux/badges/défis = **fonction déterministe** de l'activité (séances loggées `workouts` + sessions de programme complétées `progress`). Toujours exact, pas de migration, pas de sync.
- **Lib pure** testable (TDD) + composants présentationnels + intégration dans les pages qui chargent déjà ces données.
- i18n : les libellés (niveaux, badges, défis) viennent de `messages`, la lib reste **agnostique** (renvoie des `id`/`key`).

## Données sources (déjà disponibles)
- `workouts` : `{ discipline: string; duration_minutes: number; completed_at: string }` (la page progression les fetche déjà, sans limite).
- `progress` : nombre de sessions complétées (`completed === true`).

## Livrable 1 — Lib `src/lib/gamification.ts` (pure)

```ts
export type WorkoutLite = { discipline: string; duration_minutes: number; completed_at: string }

export const XP_PER_WORKOUT = 50
export const XP_PER_SESSION = 30

// Paliers cumulés d'XP (clé i18n + seuil).
export const LEVELS = [
  { key: 'recrue', minXp: 0 },
  { key: 'athlete', minXp: 300 },
  { key: 'competiteur', minXp: 800 },
  { key: 'elite', minXp: 1600 },
  { key: 'champion', minXp: 3000 },
  { key: 'legende', minXp: 5000 },
] as const

export type Badge = { id: string; icon: string; earned: boolean }
export type Challenge = { id: string; target: number; current: number }

export type Gamification = {
  xp: number
  levelIndex: number
  levelKey: string
  xpInLevel: number        // XP acquis dans le palier courant
  xpForNext: number | null // XP requis pour finir le palier (null si max)
  badges: Badge[]
  weekly: Challenge[]
  monthly: Challenge[]
}

export function computeGamification(input: {
  workouts: WorkoutLite[]
  programSessionsCompleted: number
  now?: Date
}): Gamification
```

**Règles :**
- `xp = workouts.length * XP_PER_WORKOUT + programSessionsCompleted * XP_PER_SESSION`.
- **Niveau** : dernier `LEVELS` dont `minXp <= xp`. `xpInLevel = xp - level.minXp`. `xpForNext = next.minXp - level.minXp` (null au dernier).
- **Badges** (id, icon, condition) :
  - `first` 🏃 : `workouts.length >= 1`
  - `week` 📅 : `>= 7`
  - `month` 🏆 : `>= 30`
  - `century` 💯 : `>= 100`
  - `tenHours` ⏱️ : somme `duration_minutes >= 600`
  - `fiveDisciplines` 🎯 : disciplines distinctes `>= 5`
  - `streak7` 🔥 : 7 jours **consécutifs** avec ≥ 1 séance (calculé sur les dates de `completed_at`)
- **Défis hebdo** (semaine ISO courante, lundi→dim, via `now`) calculés sur `workouts` dont `completed_at` est dans la semaine :
  - `weekSessions` target 3 ; `weekMinutes` target 120 ; `weekDisciplines` target 2 (disciplines distinctes)
- **Défis mensuels** (mois courant) :
  - `monthSessions` target 12 ; `monthMinutes` target 600
- `now` injectable (défaut `new Date()`) pour des tests déterministes.

## Livrable 2 — Composants `src/components/gamification/`
- `XpLevelBar.tsx` : niveau courant (libellé i18n `gamification.levels.<key>`), barre de progression `xpInLevel / xpForNext`, XP total. Animation Framer Motion (remplissage).
- `ChallengesCard.tsx` : liste de défis (hebdo + mensuels) avec barre de progression `current/target` et libellé i18n `gamification.challenges.<id>` (+ unité). État « complété » si `current >= target`.
- `BadgesGrid.tsx` : grille de badges (icône + libellé i18n `gamification.badges.<id>`), gagnés vs verrouillés (style existant de la progression).
- Tous présentationnels, `prefers-reduced-motion` respecté.

## Livrable 3 — Intégration (données réelles déjà chargées)
- **`/dashboard/progression`** : remplace la grille de badges statique par la gamification réelle — `XpLevelBar` en tête, `ChallengesCard`, `BadgesGrid`. La page fetche déjà `workouts` (toutes, lite) + `progress` ; elle calcule `programSessionsCompleted = progress.filter(p => p.completed).length` et appelle `computeGamification`.
- **`/dashboard` (overview)** : mini-carte XP/niveau (`XpLevelBar` compacte). Ajoute au `Promise.all` un comptage/fetch léger des séances si nécessaire pour l'XP total (les `allWorkouts` y sont limités à 60 → fetch lite sans limite pour l'XP exact, ou `count`).
- **`/dashboard-preview`** : enrichit le teaser — `XpLevelBar` + 1 `ChallengesCard` avec données démo (cohérent avec l'athlète « Alex »). Ajoute `xp`/`level`/`challenges` démo dans `src/lib/preview-data.ts`.

## Livrable 4 — i18n
Namespace `gamification` (fr/en/de) : `levels.{recrue,athlete,competiteur,elite,champion,legende}`, `badges.{first,week,month,century,tenHours,fiveDisciplines,streak7}`, `challenges.{weekSessions,weekMinutes,weekDisciplines,monthSessions,monthMinutes}` (+ unités), titres de sections (`level`, `xp`, `weeklyTitle`, `monthlyTitle`, `badgesTitle`, `done`).

## Tests (Jest)
- **Lib** (`gamification.test.ts`, prioritaire/TDD) : XP (séances + sessions), passage de niveau aux seuils, `xpInLevel`/`xpForNext`, badges (chaque condition, dont streak7 avec dates), défis hebdo/mensuels avec un `now` fixe (séances dans/hors période).
- **Composants** : `XpLevelBar` rend le niveau + la barre ; `ChallengesCard` rend un défi avec sa progression ; `BadgesGrid` rend gagnés/verrouillés.
- Non-régression : `ProgressionClient`/dashboard tests existants mis à jour.

## Hors périmètre (phases ultérieures / explicitement exclu)
- **Classement public** (leaderboard) — reporté (perso d'abord ; soucis vie privée + vide au lancement).
- Récompenses « à réclamer » (pour l'instant badges auto-débloqués, pas de claim).
- Notifications push de défis (réutilisables plus tard via le système push existant).

## Critères de succès
1. Lib `computeGamification` pure, couverte par tests (XP/niveaux/badges/défis).
2. `/dashboard/progression` affiche XP/niveau réels + défis + badges calculés depuis l'activité.
3. Mini-carte XP/niveau sur l'overview.
4. Teaser gamifié sur `/dashboard-preview`.
5. i18n fr/en/de. Tests verts, tsc, lint. Aucune nouvelle table DB.
