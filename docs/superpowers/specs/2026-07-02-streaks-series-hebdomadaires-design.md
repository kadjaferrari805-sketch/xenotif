# Design — Séries hebdomadaires (Streaks) · Engagement & rétention

- **Date** : 2026-07-02
- **Statut** : Design validé, prêt pour plan d'implémentation
- **Repo cible** : **xenotif _site_** (`/Users/dave/xenotif`, Next.js — site + dashboard/PWA web). L'app mobile Expo est un repo séparé ; on soigne le contrat `GET /api/streak` pour qu'elle s'y branche (travail Expo listé §12, hors de ce repo).
- **Domaine** : Engagement & rétention (1ʳᵉ feature d'une série ; badges/défis/XP existent déjà, cf. intégration §3).

## 1. Contexte & objectif

xenotif est un SaaS de coaching fitness (Next.js + Supabase + Stripe, push web + Expo natif,
next-intl fr/en/de). On veut augmenter la rétention avec une **série (streak)** récompensant la
régularité d'entraînement.

Contrainte métier : le fitness demande des **jours de repos**. Une série « chaque jour » pousserait
au surentraînement et découragerait (perdre une longue série = abandon). D'où un modèle
**hebdomadaire par objectif**, avec des **gels** pour absorber une mauvaise semaine.

> ⚠️ **La gamification est déjà en production** (`src/lib/gamification.ts` + composants, affichés sur
> `dashboard` et `dashboard/progression`). Ce design **s'intègre** à l'existant (§3), il ne repart
> pas de zéro.

## 2. Décisions produit (verrouillées)

| Décision | Choix |
|---|---|
| Modèle | Série de **semaines consécutives** validées |
| Semaine validée | **jours actifs distincts ≥ objectif** (semaine ISO lun→dim, **heure serveur/UTC**, comme la gamification existante) |
| Objectif hebdo | **Configurable par l'utilisateur (2–7), défaut 3** |
| Activité qualifiante | Séance de programme (`progress.completed`) **OU** workout manuel (`workouts`) **OU** session montre (`smartwatch_sessions`, durée ≥ 10 min) |
| Unité de comptage | **Jours actifs distincts** (2 séances le même jour = 1 jour) |
| Semaine ratée | **1 gel** absorbe la semaine (série préservée, non incrémentée) ; sinon reset à 0 |
| Octroi de gels | +1 toutes les **4 semaines validées** (`current_streak % 4 == 0`), **max 2** en réserve |
| Reset | À la casse : `current_streak = 0`, `freezes_available = 0` ; `longest_streak` conservé |
| Architecture | **Hybride** : comptage dérivé en direct + registre persistant (`user_streaks`) + cron de finalisation |
| Widget | **Anneau** (variante A) — la progression de la semaine remplit l'anneau, série au centre |
| Rappel push | **Greffé sur le cron `evening-reminder`** (18 h) existant |

## 3. Intégration avec la gamification existante (décision : **intégrer**)

La lib pure `computeGamification` (`src/lib/gamification.ts`) contient déjà, et rend via
`XpLevelBar`/`ChallengesCard`/`BadgesGrid` :
- un badge **`streak7`** 🔥 = série **quotidienne** (7 jours consécutifs, dérivé de `workouts`) ;
- un défi hebdo **`weekSessions`** (cible 3, `current` = séances de la semaine) ;
- XP/niveaux, autres badges, `weekMinutes`/`weekDisciplines`, défis mensuels.

Notre série hebdo = « semaines consécutives où l'objectif est atteint » + gels + record. Pour
**éviter tout doublon** :

- **L'anneau de série _remplace_ le défi `weekSessions`.** L'anneau montre déjà « cette semaine
  X/objectif » : on **retire `weekSessions`** de `weekly` dans `computeGamification`.
- **La série hebdo _remplace_ le badge `streak7`.** Le 🔥 devient la série hebdo : on **retire
  `streak7`** de `badges` (et sa fonction `longestStreak` devient inutile → à supprimer).
- **On conserve** : XP/niveaux, badges `first/week/month/century/tenHours/fiveDisciplines`,
  défis `weekMinutes`/`weekDisciplines` et mensuels.
- **Divergence d'archi assumée** : la gamification est « zéro table DB » (tout dérivable). La série
  ajoute **une** table `user_streaks`, **uniquement** parce que les **gels** et le **record** sont
  un état non dérivable de l'historique. Exception consciente et documentée.
- **Semaines côté serveur/UTC** : on réutilise la sémantique de `startOfWeek(now)` existante
  (lundi, heure serveur). Pas de timezone par utilisateur → **pas de colonne `profiles.timezone`**
  (retirée du design initial pour rester cohérent avec la gamification).

## 4. Modèle de données

### Table `public.user_streaks` (registre persistant, 1 ligne/user)

| Colonne | Type | Défaut | Rôle |
|---|---|---|---|
| `user_id` | uuid PK → `profiles(id)` on delete cascade | — | propriétaire |
| `weekly_goal` | smallint (check 2–7) | `3` | objectif configurable |
| `current_streak` | smallint | `0` | semaines validées consécutives |
| `longest_streak` | smallint | `0` | record (jamais décrémenté) |
| `freezes_available` | smallint (check 0–2) | `0` | gels en réserve |
| `last_finalized_week` | date | `null` | lundi (UTC) de la dernière semaine finalisée |
| `created_at` | timestamptz | `now()` | — |
| `updated_at` | timestamptz | `now()` | — |

### RLS
- `select`/`insert`/`update` réservés à `auth.uid() = user_id` (calqué sur les autres tables user).
- Le cron écrit via l'**admin client (service role)**, qui contourne RLS.

### Source de vérité « a-t-il entraîné ? » (dérivée, non stockée)
Un **jour actif** = ≥ 1 activité qualifiante ce jour-là (heure serveur) :
- `workouts` avec `completed_at`
- `progress` avec `completed = true` et `completed_at`
- `smartwatch_sessions` avec `started_at` et `duration_seconds >= 600` (≥ 10 min)

## 5. Logique cœur — `reconcile` (pure, testable)

Signature : `reconcile(state, activeDaysByWeek, now) -> { state, thisWeek }`
- `state` : l'enregistrement `user_streaks`
- `activeDaysByWeek` : map `weekStart(date ISO lundi UTC) -> nombre de jours actifs distincts`
- `now` : instant courant (heure serveur)

```
weekStartNow = startOfWeek(now)                 // lundi 00:00 (serveur), cf. gamification
pour chaque semaine W strictement après last_finalized_week,
    dont la fin (dimanche 23:59:59) est passée depuis >= 24 h (grâce synchro tardive),
    de la plus ancienne à la plus récente :

    validee = activeDaysByWeek[W] >= weekly_goal
    si validee:
        current_streak += 1
        si current_streak % 4 == 0 et freezes_available < 2:
            freezes_available += 1              // gel gagné
    sinon:
        si freezes_available > 0:
            freezes_available -= 1              // semaine gelée : série préservée, NON incrémentée
        sinon:
            longest_streak = max(longest_streak, current_streak)
            current_streak = 0
            freezes_available = 0
    last_finalized_week = W

longest_streak = max(longest_streak, current_streak)
thisWeek = { activeDays: activeDaysByWeek[weekStartNow] ?? 0,
             validated: activeDays >= weekly_goal }
```

Propriétés :
- **Idempotente** (gardée par `last_finalized_week`) → rejouable à chaque lecture ET par le cron.
- **Un seul cron quotidien suffit** : ne finalise qu'une semaine dont la fin (+24 h) est passée.

Helpers purs : réutiliser `startOfWeek` (extrait de `gamification.ts` vers un module partagé, ou
ré-exporté) ; `activeDaysInWeek(activities, weekStart)`.

## 6. Lib partagée, lectures serveur & API

### `src/lib/streak/`
- **`core.ts`** — `startOfWeek` (partagé), `activeDaysInWeek`, `reconcile`, prochain jalon. Zéro I/O
  → 100 % testable (TDD).
- **`service.ts`** :
  - `getStreak(userId)` : charge (ou crée par défaut) `user_streaks`, lit l'activité (`workouts`,
    `progress.completed` avec `completed_at`, `smartwatch_sessions` ≥ 10 min) depuis
    `last_finalized_week` (ou ~8 dernières semaines si nouveau), appelle `reconcile`, **persiste**
    (upsert gardé par `last_finalized_week`), renvoie le **view-model stable** (§ contrat API).
  - `setGoal(userId, goal)` : valide 2–7, met à jour `weekly_goal`.

### Lectures = server-side
`dashboard/page.tsx` et `dashboard/progression/page.tsx` (Server Components) appellent
`getStreak(userId)` et passent le view-model aux composants clients.

### Contrat API `GET /api/streak` (consommé aussi par l'app mobile Expo)
Réponse JSON **stable** (view-model) :
```jsonc
{
  "currentStreak": 12,      // semaines consécutives validées
  "longestStreak": 18,      // record
  "weeklyGoal": 3,          // objectif configurable (2–7)
  "activeDaysThisWeek": 2,  // jours actifs distincts semaine en cours
  "weekValidated": false,   // activeDaysThisWeek >= weeklyGoal
  "freezesAvailable": 1,    // gels en réserve (0–2)
  "nextMilestone": 26       // prochain jalon d'affichage (4/12/26/52), ou null
}
```
- `GET /api/streak` — authentifiée, renvoie ce view-model (exécute `getStreak`).
- `PATCH /api/streak/goal` — body `{ goal }`, valide 2–7, appelle `setGoal`, renvoie le view-model.

## 7. Crons & rappels

### Cron 1 — finalisation quotidienne (nouveau)
`GET /api/cron/streak-finalize`, auth `Authorization: Bearer ${CRON_SECRET}`, `runtime = 'nodejs'`.
- Boucle sur les users actifs (ligne `user_streaks` existante ou activité récente), appelle
  `getStreak` (réconcilie + persiste) → séries/gels/reset à l'heure **même sans ouverture de l'app**.
- `vercel.json` : `{ "path": "/api/cron/streak-finalize", "schedule": "0 2 * * *" }` (02:00 UTC).

### Cron 2 — rappel « sauve ta série » (greffé sur `evening-reminder`)
Dans `src/app/api/cron/evening-reminder/route.ts`, pour chaque destinataire : si la semaine se
termine bientôt (**dimanche**, ou **samedi+dimanche**) et `activeDaysThisWeek < weekly_goal` mais
l'objectif est **encore atteignable** → push localisé :
> « Il te reste X séance(s) pour valider ta semaine et garder ta série 🔥 N »
- Réutilise `sendPushToUser` (Expo natif) + `sendWebPushToUser` (Web Push PWA) +
  `getDevicePushRecipients` → **atteint déjà l'app mobile** et respecte les préférences de notif.
- Contenu via `getStreakReminderContent(locale, remaining, streak)` (pattern `getEveningPushContent`).
  Data `{ type: 'streak_reminder' }`, url `/dashboard/progression`.
- **Un seul push le soir** : si le rappel de série s'applique, il **remplace** le contenu du soir
  standard pour ce user.

## 8. UI (intégrée aux blocs gamification)

- **`src/components/streak/StreakRing.tsx`** — variante A : anneau SVG, remplissage =
  `activeDaysThisWeek / weeklyGoal`, 🔥 + `currentStreak` (semaines) au centre, « Cette semaine
  X/objectif · record N » dessous. Rendu à partir du view-model. Couleurs marque : remplissage
  `#FF4500`, piste `#1E2028`, carte `#111318`, fond `#0A0B0F`.
- **`src/components/streak/GoalSelector.tsx`** — contrôle client 2–7, maj optimiste →
  `PATCH /api/streak/goal`.
- **Emplacements** :
  - `dashboard/page.tsx` : anneau **compact** à côté du `XpLevelBar` (l.156).
  - `dashboard/progression/ProgressionClient.tsx` : bloc complet — anneau + **gels ❄️ ×N** (tooltip
    « un gel absorbe une semaine ratée ») + record + prochain jalon + `GoalSelector`, à la place de
    l'ancien défi `weekSessions` (zone défis/badges l.151-158).
- **Retraits** (via §3) : `streak7` disparaît de `BadgesGrid` (retiré du tableau `badges`) ;
  `weekSessions` disparaît de `ChallengesCard` weekly (retiré de `weekly`).
- **Jalons** — à 4/12/26/52 sem. ou nouveau record : label/toast léger « Record ! 🎉 ». Minimal v1.
- **État vide** — nouveau user (série 0) : anneau vide + « Commence ta série cette semaine 💪 ».
- **i18n** — namespace `streak` dans `messages/{fr,en,de}.json` (labels widget, sélecteur, tooltip,
  jalons, copie push). Clés devenues inutiles : `badges.streak7`, `challenges.weekSessions`
  (à retirer).
- **Preview marketing** — `src/lib/preview-data.ts` / `PreviewDashboard` / `ExperiencePreview`
  référencent la gamification : mettre à jour les données de démo (série factice, sans `streak7`/
  `weekSessions`).

## 9. Cas limites & gestion d'erreurs

- **Nouveau user / aucune activité** → ligne créée à la volée, série 0, état vide.
- **Synchro montre tardive** → semaine en cours recalculée en direct ; semaines passées finalisées
  après **24 h de grâce**. Une semaine déjà finalisée n'est **pas** « dé-cassée » rétroactivement
  (limitation assumée).
- **Objectif changé en cours de semaine** → s'applique à la semaine courante + suivantes ; pas de
  recalcul des semaines finalisées.
- **Concurrence lecture/cron** → `reconcile` idempotente, gardée par `last_finalized_week`, upsert.
- **Échecs push** → try/catch par user (pattern existant), non bloquant.
- **Ratés consécutifs** → chaque semaine ratée consomme 1 gel jusqu'à épuisement, puis reset (ex.
  série 12 + 2 gels : rate A→gel 1, rate B→gel 0, rate C→reset 0).

## 10. Tests (TDD)

- **Unitaires `core.ts` (pur)** — cœur : semaine validée → incrément ; gel tous les 4 (cap 2) ;
  semaine ratée avec/sans gel ; reset + `longest` + gels à 0 ; ratés consécutifs ; changement
  d'objectif ; découpage semaine (dim/lun, grâce 24 h) ; jours actifs distincts (2 séances/jour =
  1 jour) ; filtre montre < 10 min.
- **Service/intégration** — `getStreak` avec activité seedée : création ligne, réconciliation,
  persistance, idempotence.
- **API** — `GET /api/streak` (forme du view-model, non-auth → 401) ; `PATCH /api/streak/goal`
  (rejet < 2 / > 7, non-auth) ; cron `streak-finalize` (401 sans bearer).
- **Régression gamification** — mettre à jour `gamification.test.ts` : retrait des cas `streak7` et
  `weekSessions`, le reste inchangé.
- Via le `jest` déjà configuré (`jest.config.ts`, script `test`).

## 11. Fichiers

**Nouveaux**
- `supabase-streaks.sql` — table `user_streaks` + RLS
- `src/lib/streak/core.ts`, `src/lib/streak/service.ts`, `src/lib/streak/reminder-content.ts`
- `src/components/streak/StreakRing.tsx`, `src/components/streak/GoalSelector.tsx`
- `src/app/api/streak/route.ts`, `src/app/api/streak/goal/route.ts`
- `src/app/api/cron/streak-finalize/route.ts`
- Tests : `src/lib/streak/__tests__/core.test.ts` (+ service/API)

**Modifiés**
- `src/lib/gamification.ts` — retirer `streak7` (+ `longestStreak`) et `weekSessions` ; extraire/
  partager `startOfWeek`
- `src/app/[locale]/dashboard/page.tsx` — `getStreak` + anneau compact
- `src/app/[locale]/dashboard/progression/page.tsx` — `getStreak`, passer le view-model
- `src/app/[locale]/dashboard/progression/ProgressionClient.tsx` — rendre `StreakRing`+`GoalSelector`
- `src/app/api/cron/evening-reminder/route.ts` — rappel série
- `src/lib/gamification.test.ts` — retrait cas `streak7`/`weekSessions`
- `src/lib/preview-data.ts` + composants preview — données de démo
- `messages/fr.json`, `messages/en.json`, `messages/de.json` — namespace `streak`, retrait clés
  obsolètes
- `vercel.json` — cron `streak-finalize`

## 12. Côté app mobile (repo Expo, HORS de ce repo — pour info/coordination)

Le contrat est conçu pour l'app ; le travail Expo (à faire dans l'autre repo, non couvert par ce
plan) :
- Appeler `GET /api/streak` (auth utilisateur) et afficher l'anneau natif.
- `PATCH /api/streak/goal` pour le réglage d'objectif.
- Gérer le push `{ type: 'streak_reminder' }` (deep-link vers l'écran progression). Le push part
  déjà vers les appareils Expo via `sendPushToUser` — rien à changer côté site.

## 13. Hors périmètre (v1 / YAGNI) & évolutions futures

- Gels achetables / offerts par le coach ; célébrations riches (confettis, partage).
- Historique visuel des semaines passées (calendrier) au-delà du record.
- Classements / défis entre utilisateurs (feature « Défis » séparée).
- Objectif adaptatif ou par discipline ; timezone par utilisateur (si besoin d'exactitude fine).
- Dé-cassage rétroactif sur synchro très tardive (> 24 h).

## 14. Notes d'implémentation

- **AGENTS.md** : cette version de Next.js a des breaking changes — lire le guide pertinent dans
  `node_modules/next/dist/docs/` avant d'écrire les routes/Server Components.
- Suivre les patterns existants : `createAdminClient` (`@/lib/supabase/admin`), helpers push
  (`@/lib/push`, `@/lib/web-push`, `@/lib/push-recipients`), auth cron via `CRON_SECRET`.
- Développer `core.ts` en **TDD** avant le câblage service/UI.
