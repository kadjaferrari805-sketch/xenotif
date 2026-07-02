# Séries hebdomadaires (Streaks) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter une série d'engagement **hebdomadaire** (semaines consécutives où l'objectif de séances est atteint), avec gels de repos, à afficher via un widget anneau sur le dashboard web xenotif — en s'intégrant à la gamification déjà en production.

**Architecture:** Cœur de logique **pur** (`src/lib/streak/core.ts`, testé en TDD) qui réconcilie un état de série à partir des jours actifs par semaine. Un **service** lit l'activité (workouts / séances programme / montre) + une **table `user_streaks`** (uniquement gels + record + objectif) et persiste. Lecture serveur dans les pages dashboard ; un **cron quotidien** finalise les semaines et un **rappel greffé sur `evening-reminder`** relance les retardataires. L'anneau **remplace** le défi `weekSessions` et la série **remplace** le badge `streak7` (zéro doublon).

**Tech Stack:** Next.js (App Router, version modifiée — cf. `AGENTS.md`), TypeScript, Supabase (Postgres + RLS), next-intl (fr/en/de), Jest, Tailwind. Push web (`web-push`) + Expo natif.

**Spec de référence :** `docs/superpowers/specs/2026-07-02-streaks-series-hebdomadaires-design.md`

**⚠️ Avant de coder les routes/Server Components :** `AGENTS.md` prévient que cette version de Next.js a des breaking changes — lire le guide pertinent dans `node_modules/next/dist/docs/`. Suivre les patterns des fichiers existants cités (routes API, crons).

**Conventions de semaine :** semaine ISO **lundi→dimanche en UTC** (déterministe, = fuseau serveur Vercel). Toutes les fonctions de date de `core.ts` utilisent `getUTC*`.

---

## File Structure

**Créés**
- `supabase-streaks.sql` — table `user_streaks` + RLS + index.
- `src/lib/streak/core.ts` — logique pure (dates UTC, bucketing, `reconcile`, jalons). Aucune I/O.
- `src/lib/streak/service.ts` — `getStreak` / `setGoal` (lecture activité + persistance).
- `src/lib/streak/reminder-content.ts` — copie push localisée (pattern `daily-motivation.ts`).
- `src/lib/streak/__tests__/core.test.ts` — tests unitaires du cœur.
- `src/lib/streak/__tests__/service.test.ts` — test service avec faux client Supabase.
- `src/components/streak/StreakRing.tsx` — widget anneau (client, `useTranslations`).
- `src/components/streak/StreakRing.test.tsx` — rendu du widget.
- `src/components/streak/GoalSelector.tsx` — sélecteur d'objectif (client).
- `src/app/api/streak/route.ts` — `GET` view-model.
- `src/app/api/streak/goal/route.ts` — `PATCH` objectif.
- `src/app/api/streak/route.test.ts` — 401 non-auth.
- `src/app/api/cron/streak-finalize/route.ts` — cron quotidien.

**Modifiés**
- `src/lib/gamification.ts` — retirer `streak7` (+ `longestStreak`) et `weekSessions`.
- `src/lib/gamification.test.ts` — retirer les cas correspondants.
- `src/app/[locale]/dashboard/page.tsx` — `getStreak` + anneau compact.
- `src/app/[locale]/dashboard/progression/page.tsx` — `getStreak`, passer la vue.
- `src/app/[locale]/dashboard/progression/ProgressionClient.tsx` — rendre `StreakRing` + `GoalSelector`.
- `src/app/api/cron/evening-reminder/route.ts` — rappel série prioritaire.
- `src/lib/preview-data.ts` (+ composants preview si nécessaire) — données de démo.
- `messages/fr.json`, `messages/en.json`, `messages/de.json` — namespace `streak`, retrait clés obsolètes.
- `vercel.json` — cron `streak-finalize`.

---

## Task 1: Migration DB `user_streaks`

**Files:**
- Create: `supabase-streaks.sql`

- [ ] **Step 1: Écrire la migration SQL**

```sql
-- ──────────────────────────────────────────────────────────────────────
-- Séries hebdomadaires (Streaks) — registre persistant.
-- Ne stocke QUE ce qui n'est pas dérivable de l'activité : objectif, série
-- courante, record, gels, dernière semaine finalisée.
-- À exécuter dans Supabase → SQL Editor.
-- ──────────────────────────────────────────────────────────────────────
create table if not exists public.user_streaks (
  user_id             uuid primary key references public.profiles (id) on delete cascade,
  weekly_goal         smallint not null default 3 check (weekly_goal between 2 and 7),
  current_streak      smallint not null default 0 check (current_streak >= 0),
  longest_streak      smallint not null default 0 check (longest_streak >= 0),
  freezes_available   smallint not null default 0 check (freezes_available between 0 and 2),
  last_finalized_week date,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.user_streaks enable row level security;

-- L'utilisateur lit/écrit uniquement sa propre ligne. Le cron passe par la
-- service-role (bypass RLS).
create policy "own streak select" on public.user_streaks
  for select using (auth.uid() = user_id);
create policy "own streak insert" on public.user_streaks
  for insert with check (auth.uid() = user_id);
create policy "own streak update" on public.user_streaks
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

- [ ] **Step 2: Appliquer la migration**

Exécuter le contenu de `supabase-streaks.sql` dans Supabase → SQL Editor (comme les autres
`supabase-*.sql` du repo). Vérifier : `select * from public.user_streaks limit 1;` renvoie 0 ligne
sans erreur.

- [ ] **Step 3: Commit**

```bash
git add supabase-streaks.sql
git commit -m "feat(streaks): migration table user_streaks + RLS"
```

---

## Task 2: `core.ts` — helpers de date UTC (TDD)

**Files:**
- Create: `src/lib/streak/core.ts`
- Test: `src/lib/streak/__tests__/core.test.ts`

- [ ] **Step 1: Écrire les tests des helpers**

```ts
// src/lib/streak/__tests__/core.test.ts
import { startOfWeek, dayKey, weekKeyOf, addDays, parseWeekKey } from '../core'

describe('helpers de date UTC', () => {
  test('startOfWeek renvoie le lundi 00:00 UTC', () => {
    // 2026-07-02 est un jeudi
    const mon = startOfWeek(new Date('2026-07-02T15:30:00Z'))
    expect(dayKey(mon)).toBe('2026-06-29') // lundi
  })

  test('dimanche appartient encore à la semaine du lundi précédent', () => {
    expect(weekKeyOf(new Date('2026-07-05T23:00:00Z'))).toBe('2026-06-29') // dimanche
    expect(weekKeyOf(new Date('2026-07-06T00:00:00Z'))).toBe('2026-07-06') // lundi suivant
  })

  test('addDays et parseWeekKey', () => {
    expect(dayKey(addDays(parseWeekKey('2026-06-29'), 7))).toBe('2026-07-06')
  })
})
```

- [ ] **Step 2: Lancer le test (échec attendu)**

Run: `npx jest src/lib/streak/__tests__/core.test.ts`
Expected: FAIL — `Cannot find module '../core'`.

- [ ] **Step 3: Écrire les helpers**

```ts
// src/lib/streak/core.ts
// Semaine ISO lundi→dimanche, calculée en UTC (déterministe, = fuseau serveur Vercel).

export function startOfWeek(now: Date): Date {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const dow = (d.getUTCDay() + 6) % 7 // 0 = lundi
  d.setUTCDate(d.getUTCDate() - dow)
  return d
}

export function dayKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
}

export function weekKeyOf(d: Date): string {
  return dayKey(startOfWeek(d))
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d)
  x.setUTCDate(x.getUTCDate() + n)
  return x
}

export function parseWeekKey(key: string): Date {
  const [y, m, dd] = key.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, dd))
}
```

- [ ] **Step 4: Lancer le test (succès attendu)**

Run: `npx jest src/lib/streak/__tests__/core.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/streak/core.ts src/lib/streak/__tests__/core.test.ts
git commit -m "feat(streaks): helpers de date UTC (core)"
```

---

## Task 3: `core.ts` — `bucketActiveDaysByWeek` + `nextMilestone` (TDD)

**Files:**
- Modify: `src/lib/streak/core.ts`
- Test: `src/lib/streak/__tests__/core.test.ts`

- [ ] **Step 1: Ajouter les tests**

```ts
// Ajouter dans src/lib/streak/__tests__/core.test.ts
import { bucketActiveDaysByWeek, nextMilestone, MILESTONES } from '../core'

describe('bucketActiveDaysByWeek', () => {
  test('compte les JOURS actifs distincts par semaine (2 activités le même jour = 1)', () => {
    const map = bucketActiveDaysByWeek([
      '2026-06-29T08:00:00Z', // lundi
      '2026-06-29T18:00:00Z', // lundi (même jour)
      '2026-07-01T12:00:00Z', // mercredi
      '2026-07-06T09:00:00Z', // lundi semaine suivante
    ])
    expect(map.get('2026-06-29')).toBe(2)
    expect(map.get('2026-07-06')).toBe(1)
  })

  test('map vide pour aucune activité', () => {
    expect(bucketActiveDaysByWeek([]).size).toBe(0)
  })
})

describe('nextMilestone', () => {
  test('renvoie le prochain jalon strictement supérieur', () => {
    expect(nextMilestone(0)).toBe(4)
    expect(nextMilestone(4)).toBe(12)
    expect(nextMilestone(12)).toBe(26)
    expect(nextMilestone(60)).toBeNull()
    expect(MILESTONES).toEqual([4, 12, 26, 52])
  })
})
```

- [ ] **Step 2: Lancer le test (échec attendu)**

Run: `npx jest src/lib/streak/__tests__/core.test.ts`
Expected: FAIL — `bucketActiveDaysByWeek is not a function`.

- [ ] **Step 3: Implémenter**

```ts
// Ajouter dans src/lib/streak/core.ts
export const MILESTONES = [4, 12, 26, 52] as const

export function bucketActiveDaysByWeek(activityDates: string[]): Map<string, number> {
  const byWeek = new Map<string, Set<string>>()
  for (const iso of activityDates) {
    if (!iso) continue
    const d = new Date(iso)
    const wk = weekKeyOf(d)
    if (!byWeek.has(wk)) byWeek.set(wk, new Set())
    byWeek.get(wk)!.add(dayKey(d))
  }
  const counts = new Map<string, number>()
  for (const [wk, days] of byWeek) counts.set(wk, days.size)
  return counts
}

export function nextMilestone(current: number): number | null {
  for (const m of MILESTONES) if (m > current) return m
  return null
}
```

- [ ] **Step 4: Lancer le test (succès attendu)**

Run: `npx jest src/lib/streak/__tests__/core.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/streak/core.ts src/lib/streak/__tests__/core.test.ts
git commit -m "feat(streaks): bucketing jours actifs + jalons (core)"
```

---

## Task 4: `core.ts` — `reconcile` (TDD, cœur du système)

**Files:**
- Modify: `src/lib/streak/core.ts`
- Test: `src/lib/streak/__tests__/core.test.ts`

- [ ] **Step 1: Ajouter les tests de `reconcile`**

```ts
// Ajouter dans src/lib/streak/__tests__/core.test.ts
import { reconcile, type StreakState } from '../core'

const base: StreakState = {
  weeklyGoal: 3, currentStreak: 0, longestStreak: 0, freezesAvailable: 0, lastFinalizedWeek: null,
}
// Semaines : W1=2026-06-15, W2=2026-06-22, W3=2026-06-29 (lundis). "now" mardi 2026-07-07.
const NOW = new Date('2026-07-07T10:00:00Z')

function daysMap(entries: Record<string, number>): Map<string, number> {
  return new Map(Object.entries(entries))
}

describe('reconcile', () => {
  test('semaine validée incrémente la série', () => {
    const { state } = reconcile(
      { ...base, lastFinalizedWeek: '2026-06-22' }, // finaliser W3 (2026-06-29)
      daysMap({ '2026-06-29': 3 }), NOW,
    )
    expect(state.currentStreak).toBe(1)
    expect(state.lastFinalizedWeek).toBe('2026-06-29')
  })

  test('un gel est gagné toutes les 4 semaines validées (max 2)', () => {
    const s = { ...base, currentStreak: 3, lastFinalizedWeek: '2026-06-22' }
    const { state } = reconcile(s, daysMap({ '2026-06-29': 5 }), NOW)
    expect(state.currentStreak).toBe(4)
    expect(state.freezesAvailable).toBe(1)
  })

  test('semaine ratée avec gel : série préservée, gel consommé', () => {
    const s = { ...base, currentStreak: 7, freezesAvailable: 1, lastFinalizedWeek: '2026-06-22' }
    const { state } = reconcile(s, daysMap({ '2026-06-29': 1 }), NOW) // 1 < 3
    expect(state.currentStreak).toBe(7)
    expect(state.freezesAvailable).toBe(0)
  })

  test('semaine ratée sans gel : reset + record conservé + gels à 0', () => {
    const s = { ...base, currentStreak: 9, freezesAvailable: 0, lastFinalizedWeek: '2026-06-22' }
    const { state } = reconcile(s, daysMap({ '2026-06-29': 0 }), NOW)
    expect(state.currentStreak).toBe(0)
    expect(state.longestStreak).toBe(9)
    expect(state.freezesAvailable).toBe(0)
  })

  test('semaine EN COURS non finalisée : exposée dans la vue seulement', () => {
    // now dans la semaine 2026-07-06 ; W=2026-07-06 ne doit PAS être finalisée
    const now = new Date('2026-07-08T10:00:00Z')
    const { state, view } = reconcile(
      { ...base, lastFinalizedWeek: '2026-06-29' },
      daysMap({ '2026-07-06': 2 }), now,
    )
    expect(state.lastFinalizedWeek).toBe('2026-06-29') // inchangé
    expect(view.activeDaysThisWeek).toBe(2)
    expect(view.weekValidated).toBe(false)
  })

  test('grâce 24 h : une semaine finie depuis < 24 h n’est pas finalisée', () => {
    // W=2026-06-29 finit dimanche 2026-07-05 23:59 ; fin+24h = 2026-07-06 23:59:59
    const now = new Date('2026-07-06T12:00:00Z') // < fin+24h
    const { state } = reconcile(
      { ...base, lastFinalizedWeek: '2026-06-22' },
      daysMap({ '2026-06-29': 3 }), now,
    )
    expect(state.lastFinalizedWeek).toBe('2026-06-22') // pas encore finalisée
  })

  test('changement d’objectif : validation utilise le nouvel objectif', () => {
    const s = { ...base, weeklyGoal: 2, lastFinalizedWeek: '2026-06-22' }
    const { state } = reconcile(s, daysMap({ '2026-06-29': 2 }), NOW)
    expect(state.currentStreak).toBe(1) // 2 >= 2
  })

  test('deux semaines ratées consécutives : gel puis reset', () => {
    // finaliser W2(06-22) et W3(06-29), toutes deux ratées, 1 gel en réserve
    const s = { ...base, currentStreak: 5, freezesAvailable: 1, lastFinalizedWeek: '2026-06-15' }
    const { state } = reconcile(s, daysMap({ '2026-06-22': 0, '2026-06-29': 0 }), NOW)
    expect(state.currentStreak).toBe(0)     // gel absorbe W2, reset sur W3
    expect(state.longestStreak).toBe(5)
    expect(state.freezesAvailable).toBe(0)
  })
})
```

- [ ] **Step 2: Lancer le test (échec attendu)**

Run: `npx jest src/lib/streak/__tests__/core.test.ts`
Expected: FAIL — `reconcile is not a function`.

- [ ] **Step 3: Implémenter `reconcile` + types + constantes**

```ts
// Ajouter dans src/lib/streak/core.ts
export const MAX_FREEZES = 2
export const FREEZE_EVERY = 4
export const MIN_SMARTWATCH_SECONDS = 600
const WEEKS_LOOKBACK = 10
const GRACE_MS = 24 * 60 * 60 * 1000

export type StreakState = {
  weeklyGoal: number
  currentStreak: number
  longestStreak: number
  freezesAvailable: number
  lastFinalizedWeek: string | null // 'YYYY-MM-DD' (lundi) ou null
}

export type StreakView = StreakState & {
  activeDaysThisWeek: number
  weekValidated: boolean
  nextMilestone: number | null
}

function firstCursor(state: StreakState, activeDaysByWeek: Map<string, number>, now: Date): Date {
  if (state.lastFinalizedWeek) return addDays(parseWeekKey(state.lastFinalizedWeek), 7)
  const keys = [...activeDaysByWeek.keys()].sort()
  const earliest = keys.length ? parseWeekKey(keys[0]) : startOfWeek(now)
  const cap = addDays(startOfWeek(now), -7 * WEEKS_LOOKBACK)
  return earliest.getTime() < cap.getTime() ? cap : earliest
}

export function reconcile(
  input: StreakState,
  activeDaysByWeek: Map<string, number>,
  now: Date,
): { state: StreakState; view: StreakView } {
  const state: StreakState = { ...input }
  const thisWeekKey = weekKeyOf(now)
  let cursor = firstCursor(state, activeDaysByWeek, now)

  while (true) {
    const wkKey = dayKey(cursor)
    if (wkKey >= thisWeekKey) break // semaine en cours ou future : ne pas finaliser
    const weekEnd = addDays(cursor, 7) // lundi suivant 00:00 = borne de fin
    if (now.getTime() < weekEnd.getTime() + GRACE_MS) break // grâce 24 h

    const validated = (activeDaysByWeek.get(wkKey) ?? 0) >= state.weeklyGoal
    if (validated) {
      state.currentStreak += 1
      if (state.currentStreak % FREEZE_EVERY === 0 && state.freezesAvailable < MAX_FREEZES) {
        state.freezesAvailable += 1
      }
    } else if (state.freezesAvailable > 0) {
      state.freezesAvailable -= 1 // semaine gelée : série préservée, non incrémentée
    } else {
      state.longestStreak = Math.max(state.longestStreak, state.currentStreak)
      state.currentStreak = 0
      state.freezesAvailable = 0
    }
    state.lastFinalizedWeek = wkKey
    cursor = addDays(cursor, 7)
  }

  state.longestStreak = Math.max(state.longestStreak, state.currentStreak)
  const activeDaysThisWeek = activeDaysByWeek.get(thisWeekKey) ?? 0
  const view: StreakView = {
    ...state,
    activeDaysThisWeek,
    weekValidated: activeDaysThisWeek >= state.weeklyGoal,
    nextMilestone: nextMilestone(state.currentStreak),
  }
  return { state, view }
}
```

- [ ] **Step 4: Lancer TOUS les tests core (succès attendu)**

Run: `npx jest src/lib/streak/__tests__/core.test.ts`
Expected: PASS (tous les describe).

- [ ] **Step 5: Commit**

```bash
git add src/lib/streak/core.ts src/lib/streak/__tests__/core.test.ts
git commit -m "feat(streaks): fonction reconcile + types (core)"
```

---

## Task 5: `service.ts` — `getStreak` / `setGoal` (TDD avec faux client)

**Files:**
- Create: `src/lib/streak/service.ts`
- Test: `src/lib/streak/__tests__/service.test.ts`

- [ ] **Step 1: Écrire le test avec un faux client Supabase**

```ts
// src/lib/streak/__tests__/service.test.ts
import { getStreak } from '../service'

// Faux client Supabase minimal : renvoie des données seedées par table.
function fakeClient(seed: {
  user_streaks?: any | null
  workouts?: any[]
  progress?: any[]
  smartwatch_sessions?: any[]
}) {
  const upserts: any[] = []
  const api: any = {
    _upserts: upserts,
    from(table: string) {
      const chain: any = {
        select: () => chain,
        eq: () => chain,
        gte: () => chain,
        maybeSingle: async () =>
          table === 'user_streaks' ? { data: seed.user_streaks ?? null } : { data: null },
        upsert: async (row: any) => { upserts.push(row); return { data: row, error: null } },
        // Les lectures d'activité résolvent la promesse via then()
        then: (resolve: any) => resolve({ data: (seed as any)[table] ?? [] }),
      }
      return chain
    },
  }
  return api
}

describe('getStreak', () => {
  test('nouvel utilisateur sans activité → série 0, ligne upsertée', async () => {
    const client = fakeClient({ user_streaks: null })
    const view = await getStreak(client, 'u1')
    expect(view.currentStreak).toBe(0)
    expect(view.weeklyGoal).toBe(3)
    expect(client._upserts.length).toBe(1)
  })

  test('agrège workouts + progress + montre (≥10min) en jours actifs', async () => {
    const now = new Date()
    const iso = now.toISOString()
    const client = fakeClient({
      user_streaks: { weekly_goal: 3, current_streak: 0, longest_streak: 0, freezes_available: 0, last_finalized_week: null },
      workouts: [{ completed_at: iso }],
      progress: [{ completed_at: iso }],
      smartwatch_sessions: [{ started_at: iso, duration_seconds: 900 }, { started_at: iso, duration_seconds: 120 }],
    })
    const view = await getStreak(client, 'u1')
    // 3 sources mais le même jour → 1 jour actif ; la session <10min est ignorée
    expect(view.activeDaysThisWeek).toBe(1)
  })
})
```

- [ ] **Step 2: Lancer le test (échec attendu)**

Run: `npx jest src/lib/streak/__tests__/service.test.ts`
Expected: FAIL — `Cannot find module '../service'`.

- [ ] **Step 3: Implémenter le service**

```ts
// src/lib/streak/service.ts
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  reconcile, bucketActiveDaysByWeek,
  MIN_SMARTWATCH_SECONDS, type StreakState, type StreakView,
} from './core'

const DEFAULT_GOAL = 3
const LOOKBACK_DAYS = 77 // ~11 semaines

function defaultState(goal = DEFAULT_GOAL): StreakState {
  return { weeklyGoal: goal, currentStreak: 0, longestStreak: 0, freezesAvailable: 0, lastFinalizedWeek: null }
}

function toState(row: any): StreakState {
  return {
    weeklyGoal: row.weekly_goal,
    currentStreak: row.current_streak,
    longestStreak: row.longest_streak,
    freezesAvailable: row.freezes_available,
    lastFinalizedWeek: row.last_finalized_week,
  }
}

async function loadActivityDates(supabase: SupabaseClient, userId: string, sinceISO: string): Promise<string[]> {
  const [w, p, s] = await Promise.all([
    supabase.from('workouts').select('completed_at').eq('user_id', userId).gte('completed_at', sinceISO),
    supabase.from('progress').select('completed_at').eq('user_id', userId).eq('completed', true).gte('completed_at', sinceISO),
    supabase.from('smartwatch_sessions').select('started_at, duration_seconds').eq('user_id', userId).gte('started_at', sinceISO),
  ])
  return [
    ...((w.data ?? []) as any[]).map(r => r.completed_at),
    ...((p.data ?? []) as any[]).map(r => r.completed_at),
    ...((s.data ?? []) as any[]).filter(r => (r.duration_seconds ?? 0) >= MIN_SMARTWATCH_SECONDS).map(r => r.started_at),
  ].filter(Boolean) as string[]
}

export async function getStreak(supabase: SupabaseClient, userId: string): Promise<StreakView> {
  const { data: row } = await supabase.from('user_streaks').select('*').eq('user_id', userId).maybeSingle()
  const state = row ? toState(row) : defaultState()

  const sinceISO = new Date(Date.now() - LOOKBACK_DAYS * 86400000).toISOString()
  const dates = await loadActivityDates(supabase, userId, sinceISO)
  const now = new Date()
  const { state: next, view } = reconcile(state, bucketActiveDaysByWeek(dates), now)

  await supabase.from('user_streaks').upsert({
    user_id: userId,
    weekly_goal: next.weeklyGoal,
    current_streak: next.currentStreak,
    longest_streak: next.longestStreak,
    freezes_available: next.freezesAvailable,
    last_finalized_week: next.lastFinalizedWeek,
    updated_at: now.toISOString(),
  }, { onConflict: 'user_id' })

  return view
}

export async function setGoal(supabase: SupabaseClient, userId: string, goal: number): Promise<StreakView> {
  const g = Math.max(2, Math.min(7, Math.round(goal)))
  await supabase.from('user_streaks').upsert(
    { user_id: userId, weekly_goal: g, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' },
  )
  return getStreak(supabase, userId)
}
```

- [ ] **Step 4: Lancer le test (succès attendu)**

Run: `npx jest src/lib/streak/__tests__/service.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/streak/service.ts src/lib/streak/__tests__/service.test.ts
git commit -m "feat(streaks): service getStreak/setGoal"
```

---

## Task 6: Routes API `/api/streak` et `/api/streak/goal`

**Files:**
- Create: `src/app/api/streak/route.ts`
- Create: `src/app/api/streak/goal/route.ts`
- Test: `src/app/api/streak/route.test.ts`

- [ ] **Step 1: Écrire le test d'auth (échec 401)**

```ts
// src/app/api/streak/route.test.ts
import { GET } from './route'

jest.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({ auth: { getUser: async () => ({ data: { user: null } }) } }),
}))

describe('GET /api/streak', () => {
  test('non authentifié → 401', async () => {
    const res = await GET()
    expect(res.status).toBe(401)
  })
})
```

- [ ] **Step 2: Lancer le test (échec attendu)**

Run: `npx jest src/app/api/streak/route.test.ts`
Expected: FAIL — `Cannot find module './route'`.

- [ ] **Step 3: Implémenter `GET /api/streak`**

```ts
// src/app/api/streak/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStreak } from '@/lib/streak/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const view = await getStreak(supabase, user.id)
  return NextResponse.json(view)
}
```

- [ ] **Step 4: Implémenter `PATCH /api/streak/goal`**

```ts
// src/app/api/streak/goal/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { setGoal } from '@/lib/streak/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const goal = Number(body?.goal)
  if (!Number.isFinite(goal) || goal < 2 || goal > 7) {
    return NextResponse.json({ error: 'goal doit être entre 2 et 7' }, { status: 400 })
  }
  const view = await setGoal(supabase, user.id, goal)
  return NextResponse.json(view)
}
```

- [ ] **Step 5: Lancer le test (succès attendu)**

Run: `npx jest src/app/api/streak/route.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/streak/route.ts src/app/api/streak/goal/route.ts src/app/api/streak/route.test.ts
git commit -m "feat(streaks): routes API GET /api/streak + PATCH /api/streak/goal"
```

---

## Task 7: i18n — namespace `streak` + retrait clés obsolètes

**Files:**
- Modify: `messages/fr.json`, `messages/en.json`, `messages/de.json`

- [ ] **Step 1: Ajouter le namespace `streak` et retirer les clés obsolètes (fr)**

Dans `messages/fr.json` : sous `gamification.badges`, **supprimer** la clé `"streak7"` ; sous
`gamification.challenges`, **supprimer** `"weekSessions"`. Ajouter au niveau racine un objet
`"streak"` :

```json
"streak": {
  "title": "Ta série",
  "weeks": "semaines",
  "thisWeek": "Cette semaine",
  "record": "record",
  "freezes": "Gels",
  "freezeTooltip": "Un gel absorbe une semaine ratée sans casser ta série.",
  "empty": "Commence ta série cette semaine 💪",
  "goalLabel": "Objectif hebdo",
  "sessions": "séances",
  "newRecord": "Record ! 🎉"
}
```

- [ ] **Step 2: Répéter pour `messages/en.json`**

Supprimer `badges.streak7` et `challenges.weekSessions`. Ajouter :

```json
"streak": {
  "title": "Your streak",
  "weeks": "weeks",
  "thisWeek": "This week",
  "record": "record",
  "freezes": "Freezes",
  "freezeTooltip": "A freeze absorbs one missed week without breaking your streak.",
  "empty": "Start your streak this week 💪",
  "goalLabel": "Weekly goal",
  "sessions": "sessions",
  "newRecord": "New record! 🎉"
}
```

- [ ] **Step 3: Répéter pour `messages/de.json`**

Supprimer `badges.streak7` et `challenges.weekSessions`. Ajouter :

```json
"streak": {
  "title": "Deine Serie",
  "weeks": "Wochen",
  "thisWeek": "Diese Woche",
  "record": "Rekord",
  "freezes": "Einfrierungen",
  "freezeTooltip": "Eine Einfrierung fängt eine verpasste Woche ab, ohne deine Serie zu brechen.",
  "empty": "Starte deine Serie diese Woche 💪",
  "goalLabel": "Wochenziel",
  "sessions": "Einheiten",
  "newRecord": "Neuer Rekord! 🎉"
}
```

- [ ] **Step 4: Vérifier que les JSON sont valides**

Run: `node -e "['fr','en','de'].forEach(l=>JSON.parse(require('fs').readFileSync('messages/'+l+'.json','utf8')))" && echo OK`
Expected: `OK`.

- [ ] **Step 5: Commit**

```bash
git add messages/fr.json messages/en.json messages/de.json
git commit -m "feat(streaks): i18n namespace streak + retrait clés streak7/weekSessions"
```

---

## Task 8: Composant `StreakRing` (widget anneau)

**Files:**
- Create: `src/components/streak/StreakRing.tsx`
- Test: `src/components/streak/StreakRing.test.tsx`

- [ ] **Step 1: Écrire le test de rendu**

```tsx
// src/components/streak/StreakRing.test.tsx
import { render, screen } from '@testing-library/react'
import { StreakRing } from './StreakRing'

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}))

const view = {
  weeklyGoal: 3, currentStreak: 12, longestStreak: 18, freezesAvailable: 1,
  lastFinalizedWeek: '2026-06-29', activeDaysThisWeek: 2, weekValidated: false, nextMilestone: 26,
}

describe('StreakRing', () => {
  test('affiche la série et la progression de la semaine', () => {
    render(<StreakRing view={view as any} />)
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText(/2\s*\/\s*3/)).toBeInTheDocument()
  })

  test('état vide quand série 0 et aucune activité', () => {
    render(<StreakRing view={{ ...view, currentStreak: 0, activeDaysThisWeek: 0 } as any} />)
    expect(screen.getByText('empty')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Lancer le test (échec attendu)**

Run: `npx jest src/components/streak/StreakRing.test.tsx`
Expected: FAIL — `Cannot find module './StreakRing'`.

- [ ] **Step 3: Implémenter `StreakRing`**

```tsx
// src/components/streak/StreakRing.tsx
'use client'

import { useTranslations } from 'next-intl'
import type { StreakView } from '@/lib/streak/core'

const R = 52
const CIRC = 2 * Math.PI * R

export function StreakRing({ view, compact = false }: { view: StreakView; compact?: boolean }) {
  const t = useTranslations('streak')
  const { currentStreak, longestStreak, weeklyGoal, activeDaysThisWeek } = view
  const ratio = weeklyGoal > 0 ? Math.min(1, activeDaysThisWeek / weeklyGoal) : 0
  const offset = CIRC * (1 - ratio)
  const isEmpty = currentStreak === 0 && activeDaysThisWeek === 0

  return (
    <div className="bg-sport-card border border-sport-border rounded-2xl p-5 flex flex-col items-center gap-3">
      <div className="self-start text-[11px] uppercase tracking-wider text-sport-gray">{t('title')}</div>
      <svg width="132" height="132" viewBox="0 0 132 132" role="img" aria-label={t('title')}>
        <circle cx="66" cy="66" r={R} fill="none" stroke="#1E2028" strokeWidth="10" />
        <circle
          cx="66" cy="66" r={R} fill="none" stroke="#FF4500" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={CIRC} strokeDashoffset={offset} transform="rotate(-90 66 66)"
        />
        <text x="66" y="58" textAnchor="middle" fontSize="24">🔥</text>
        <text x="66" y="88" textAnchor="middle" fontSize="26" fill="#fff" fontWeight="800">{currentStreak}</text>
        <text x="66" y="106" textAnchor="middle" fontSize="11" fill="#8B929F">{t('weeks')}</text>
      </svg>
      {isEmpty ? (
        <p className="text-sm text-sport-gray text-center">{t('empty')}</p>
      ) : (
        <div className="text-[13px] text-sport-gray">
          {t('thisWeek')} <span className="text-white font-bold">{activeDaysThisWeek} / {weeklyGoal}</span>
          {' · '}{t('record')} <span className="text-white font-bold">{longestStreak}</span>
        </div>
      )}
      {!compact && view.freezesAvailable > 0 && (
        <div className="text-[12px] text-sport-gray" title={t('freezeTooltip')}>
          {t('freezes')}: {'❄️'.repeat(view.freezesAvailable)}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Lancer le test (succès attendu)**

Run: `npx jest src/components/streak/StreakRing.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/streak/StreakRing.tsx src/components/streak/StreakRing.test.tsx
git commit -m "feat(streaks): composant StreakRing (anneau)"
```

---

## Task 9: Composant `GoalSelector`

**Files:**
- Create: `src/components/streak/GoalSelector.tsx`

- [ ] **Step 1: Implémenter le sélecteur d'objectif**

```tsx
// src/components/streak/GoalSelector.tsx
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

const OPTIONS = [2, 3, 4, 5, 6, 7]

export function GoalSelector({ initialGoal }: { initialGoal: number }) {
  const t = useTranslations('streak')
  const [goal, setGoal] = useState(initialGoal)
  const [saving, setSaving] = useState(false)

  async function update(next: number) {
    const prev = goal
    setGoal(next); setSaving(true)
    try {
      const res = await fetch('/api/streak/goal', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: next }),
      })
      if (!res.ok) setGoal(prev)
    } catch {
      setGoal(prev)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] uppercase tracking-wider text-sport-gray">{t('goalLabel')}</span>
      <div className="flex gap-1">
        {OPTIONS.map(n => (
          <button
            key={n}
            disabled={saving}
            onClick={() => update(n)}
            className={`w-8 h-8 rounded-lg text-sm font-bold transition-all disabled:opacity-50 ${
              n === goal
                ? 'bg-sport-orange text-white'
                : 'bg-sport-dark border border-sport-border text-sport-gray hover:text-white'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Vérifier la compilation TypeScript**

Run: `npx tsc --noEmit`
Expected: aucune erreur nouvelle liée à `GoalSelector`.

- [ ] **Step 3: Commit**

```bash
git add src/components/streak/GoalSelector.tsx
git commit -m "feat(streaks): composant GoalSelector"
```

---

## Task 10: Nettoyer `gamification.ts` (retrait `streak7` + `weekSessions`)

**Files:**
- Modify: `src/lib/gamification.ts`
- Modify: `src/lib/gamification.test.ts`

- [ ] **Step 1: Mettre à jour les tests de gamification**

Dans `src/lib/gamification.test.ts` : **supprimer** les assertions référençant le badge `streak7`
et le défi `weekSessions` (et la fonction `longestStreak` si testée directement). Les autres cas
(XP, niveaux, autres badges, `weekMinutes`/`weekDisciplines`, mensuels) restent inchangés.

- [ ] **Step 2: Retirer `streak7`, `longestStreak`, `weekSessions` de `gamification.ts`**

Dans `src/lib/gamification.ts` :
- Supprimer la fonction `longestStreak` (l.51-67) et la ligne `const streak = longestStreak(dayset)`
  (l.85) ainsi que `const dayset = ...` (l.84) si `dayset` n'est plus utilisé.
- Dans le tableau `badges`, **supprimer** la ligne `{ id: 'streak7', icon: '🔥', earned: streak >= 7 }`.
- Dans le tableau `weekly`, **supprimer** la ligne `{ id: 'weekSessions', target: 3, current: inWeek.length }`.

Résultat attendu du tableau `weekly` :

```ts
  const weekly: Challenge[] = [
    { id: 'weekMinutes', target: 120, current: min(inWeek) },
    { id: 'weekDisciplines', target: 2, current: new Set(inWeek.map(w => w.discipline)).size },
  ]
```

- [ ] **Step 3: Lancer les tests gamification (succès attendu)**

Run: `npx jest src/lib/gamification.test.ts`
Expected: PASS (sans les cas retirés).

- [ ] **Step 4: Vérifier les données de preview**

Run: `grep -rnE "streak7|weekSessions" src/`
Expected: plus aucune occurrence hors dossier `streak/`. Si `src/lib/preview-data.ts` ou un
composant preview référence `streak7`/`weekSessions`, retirer ces entrées de la même façon.

- [ ] **Step 5: Commit**

```bash
git add src/lib/gamification.ts src/lib/gamification.test.ts src/lib/preview-data.ts
git commit -m "refactor(gamification): retire streak7 et weekSessions (remplacés par la série hebdo)"
```

---

## Task 11: Intégrer le widget dans la page progression

**Files:**
- Modify: `src/app/[locale]/dashboard/progression/page.tsx`
- Modify: `src/app/[locale]/dashboard/progression/ProgressionClient.tsx`

- [ ] **Step 1: Charger la série côté serveur et la passer au client**

Dans `src/app/[locale]/dashboard/progression/page.tsx`, importer et appeler `getStreak`, puis
passer la vue au client :

```tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/session'
import { getStreak } from '@/lib/streak/service'
import { ProgressionClient } from './ProgressionClient'

export default async function ProgressionPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/signin')

  const supabase = await createClient()
  const [{ data: workouts }, { data: progress }, streak] = await Promise.all([
    supabase.from('workouts').select('discipline, duration_minutes, completed_at').eq('user_id', user.id).order('completed_at', { ascending: false }),
    supabase.from('progress').select('discipline, completed').eq('user_id', user.id),
    getStreak(supabase, user.id),
  ])

  return (
    <ProgressionClient
      userId={user.id}
      initialWorkouts={workouts ?? []}
      initialProgress={progress ?? []}
      streak={streak}
    />
  )
}
```

- [ ] **Step 2: Rendre `StreakRing` + `GoalSelector` dans le client**

Dans `src/app/[locale]/dashboard/progression/ProgressionClient.tsx` :
- Ajouter les imports en tête de fichier :

```tsx
import { StreakRing } from '@/components/streak/StreakRing'
import { GoalSelector } from '@/components/streak/GoalSelector'
import type { StreakView } from '@/lib/streak/core'
```

- Étendre le type des props du composant pour recevoir `streak: StreakView` (ajouter `streak` à la
  signature de `ProgressionClient({ ... })`).
- Insérer le bloc série juste après le `XpLevelBar` (autour de l.73-75), avant la modale :

```tsx
      <div className="mb-8 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 items-start">
        <StreakRing view={streak} />
        <div className="bg-sport-card border border-sport-border rounded-2xl p-5">
          <GoalSelector initialGoal={streak.weeklyGoal} />
        </div>
      </div>
```

- [ ] **Step 3: Vérifier compilation + tests**

Run: `npx tsc --noEmit && npx jest src/lib/streak src/components/streak`
Expected: aucune erreur TS, tests streak PASS.

- [ ] **Step 4: Commit**

```bash
git add "src/app/[locale]/dashboard/progression/page.tsx" "src/app/[locale]/dashboard/progression/ProgressionClient.tsx"
git commit -m "feat(streaks): widget série sur la page progression"
```

---

## Task 12: Anneau compact sur le dashboard home

**Files:**
- Modify: `src/app/[locale]/dashboard/page.tsx`

- [ ] **Step 1: Charger la série et l'afficher en compact**

Dans `src/app/[locale]/dashboard/page.tsx` :
- Ajouter les imports :

```tsx
import { getStreak } from '@/lib/streak/service'
import { StreakRing } from '@/components/streak/StreakRing'
```

- La page a déjà `const user = await getCurrentUser()` (l.44), `const supabase = await createClient()`
  (l.53) et un `Promise.all([...])` (l.57-65). Ajouter `getStreak(supabase, user.id)` comme **dernier
  élément** de ce `Promise.all` et `streak` comme **dernière variable** déstructurée. Concrètement, la
  ligne de déstructuration devient :

```tsx
  const [access, fullName, { data: allWorkouts }, { count: workoutCount }, { data: progress }, { data: healthMetrics }, overviewPairs, streak] = await Promise.all([
    getAccess(),
    getProfileName(),
    supabase.from('workouts').select('*').eq('user_id', user.id).order('completed_at', { ascending: false }).limit(60),
    supabase.from('workouts').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('progress').select('*').eq('user_id', user.id),
    supabase.from('health_metrics').select('date, steps, active_minutes').eq('user_id', user.id).gte('date', weekAgoStr),
    Promise.all(overviewSlugs.map(async (s) => [s, (await getDisciplineFromDb(s, locale))?.content ?? DISCIPLINE_CONTENT[s]] as const)),
    getStreak(supabase, user.id),
  ])
```

- Ajouter l'anneau compact près du `XpLevelBar` (l.155-157) :

```tsx
      <div className="mb-4">
        <StreakRing view={streak} compact />
      </div>
```

- [ ] **Step 2: Vérifier compilation**

Run: `npx tsc --noEmit`
Expected: aucune erreur.

- [ ] **Step 3: Vérifier visuellement (dev server)**

Run: `npm run dev` puis ouvrir `http://localhost:3000/fr/dashboard` (connecté).
Expected: anneau visible, série et progression de la semaine cohérentes.

- [ ] **Step 4: Commit**

```bash
git add "src/app/[locale]/dashboard/page.tsx"
git commit -m "feat(streaks): anneau compact sur le dashboard"
```

---

## Task 13: Cron de finalisation quotidien

**Files:**
- Create: `src/app/api/cron/streak-finalize/route.ts`
- Modify: `vercel.json`

- [ ] **Step 1: Implémenter le cron**

```ts
// src/app/api/cron/streak-finalize/route.ts
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStreak } from '@/lib/streak/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Finalise chaque semaine terminée (série, gels, reset) pour tous les users
// ayant une ligne user_streaks — même sans ouverture de l'app. getStreak est
// idempotent (gardé par last_finalized_week).
export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const { data: rows } = await supabase.from('user_streaks').select('user_id')
  const users = (rows ?? []).map((r: { user_id: string }) => r.user_id)

  let finalized = 0
  const errors: string[] = []
  for (const userId of users) {
    try { await getStreak(supabase, userId); finalized++ }
    catch (e) { errors.push(`streak ${userId}: ${e}`) }
  }

  console.log(`[streak-finalize] finalized=${finalized}/${users.length} errors=${errors.length}`)
  return NextResponse.json({ finalized, users: users.length, errors })
}
```

- [ ] **Step 2: Ajouter le cron dans `vercel.json`**

Ajouter cette entrée au tableau `crons` de `vercel.json` :

```json
    {
      "path": "/api/cron/streak-finalize",
      "schedule": "0 2 * * *"
    }
```

- [ ] **Step 3: Vérifier l'auth du cron localement**

Run: `npm run dev` puis dans un autre terminal :
`curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/cron/streak-finalize`
Expected: `401` (sans le header `Authorization: Bearer $CRON_SECRET`).

- [ ] **Step 4: Vérifier le JSON**

Run: `node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8')); console.log('OK')"`
Expected: `OK`.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/cron/streak-finalize/route.ts vercel.json
git commit -m "feat(streaks): cron quotidien de finalisation"
```

---

## Task 14: Contenu du rappel + greffe sur `evening-reminder`

**Files:**
- Create: `src/lib/streak/reminder-content.ts`
- Modify: `src/app/api/cron/evening-reminder/route.ts`

- [ ] **Step 1: Implémenter le contenu localisé**

```ts
// src/lib/streak/reminder-content.ts
type Locale = 'fr' | 'en' | 'de'

function loc(raw: string | null | undefined): Locale {
  return raw === 'en' ? 'en' : raw === 'de' ? 'de' : 'fr'
}

// remaining = séances restantes pour valider la semaine ; streak = série courante.
export function getStreakReminderContent(
  rawLocale: string | null | undefined,
  remaining: number,
  streak: number,
): { title: string; body: string } {
  const l = loc(rawLocale)
  const s = remaining > 1
  const map = {
    fr: {
      title: '🔥 Sauve ta série',
      body: `Plus que ${remaining} séance${s ? 's' : ''} pour valider ta semaine et garder ta série de ${streak}.`,
    },
    en: {
      title: '🔥 Save your streak',
      body: `Just ${remaining} more session${s ? 's' : ''} to complete your week and keep your ${streak}-week streak.`,
    },
    de: {
      title: '🔥 Rette deine Serie',
      body: `Nur noch ${remaining} Einheit${s ? 'en' : ''}, um deine Woche zu schaffen und deine ${streak}-Wochen-Serie zu halten.`,
    },
  }
  return map[l]
}
```

- [ ] **Step 2: Greffer le rappel dans `evening-reminder`**

Dans `src/app/api/cron/evening-reminder/route.ts`, modifier la boucle sur `recipients`. Pour chaque
destinataire, calculer la série et, si la semaine se termine bientôt et que l'objectif est encore
atteignable, envoyer le rappel de série **à la place** du contenu du soir standard :

```ts
import { getStreak } from '@/lib/streak/service'
import { getStreakReminderContent } from '@/lib/streak/reminder-content'
// ... (imports existants conservés)

  for (const { userId, locale } of recipients) {
    // Rappel de série si la semaine (UTC) se termine bientôt et reste atteignable.
    let content = getEveningPushContent(locale)
    let data: Record<string, string> = { type: 'evening_reminder' }
    let url = '/dashboard/notifications'
    let tag = 'evening_reminder'
    try {
      const streak = await getStreak(supabase, userId)
      const dow = new Date().getUTCDay() // 0 = dimanche, 6 = samedi
      const daysLeft = dow === 0 ? 1 : dow === 6 ? 2 : 0 // seulement sam/dim
      const remaining = streak.weeklyGoal - streak.activeDaysThisWeek
      if (daysLeft > 0 && remaining > 0 && remaining <= daysLeft) {
        content = getStreakReminderContent(locale, remaining, streak.currentStreak)
        data = { type: 'streak_reminder' }
        url = '/dashboard/progression'
        tag = 'streak_reminder'
      }
    } catch (e) {
      errors.push(`streak ${userId}: ${e}`)
    }

    const { title, body } = content
    try {
      pushed += await sendPushToUser(userId, { title, body, data })
    } catch (e) {
      errors.push(`push ${userId}: ${e}`)
    }
    try {
      pushed += await sendWebPushToUser(userId, { title, body, url, tag })
    } catch (e) {
      errors.push(`webpush ${userId}: ${e}`)
    }
  }
```

> Note : `getEveningPushContent(locale)` était appelé sans date ; le comportement par défaut (date
> du jour) est conservé. Garder les `let pushed`, `errors`, et le `return` existants.

- [ ] **Step 3: Vérifier compilation**

Run: `npx tsc --noEmit`
Expected: aucune erreur.

- [ ] **Step 4: Commit**

```bash
git add src/lib/streak/reminder-content.ts src/app/api/cron/evening-reminder/route.ts
git commit -m "feat(streaks): rappel « sauve ta série » greffé sur evening-reminder"
```

---

## Task 15: Vérification finale

- [ ] **Step 1: Suite de tests complète**

Run: `npm test`
Expected: tous les tests PASS (streak core/service/API/composants + gamification mis à jour).

- [ ] **Step 2: Lint + types**

Run: `npm run lint && npx tsc --noEmit`
Expected: aucune erreur.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: build réussi.

- [ ] **Step 4: Vérification manuelle (dev)**

Run: `npm run dev`, se connecter, ouvrir `/fr/dashboard` puis `/fr/dashboard/progression`.
Vérifier : anneau affiché, progression de la semaine correcte, changement d'objectif persistant
(recharger la page), plus de badge `streak7` ni de défi `weekSessions`.

- [ ] **Step 5: Commit final éventuel (ajustements)**

```bash
git add -A && git commit -m "chore(streaks): ajustements post-vérification" || echo "rien à committer"
```

---

## Notes finales

- **Contrat mobile** : `GET /api/streak` renvoie le view-model
  `{ currentStreak, longestStreak, weeklyGoal, activeDaysThisWeek, weekValidated, freezesAvailable, nextMilestone }`.
  Le push `{ type: 'streak_reminder' }` part déjà vers les appareils Expo via `sendPushToUser`.
  Travail app mobile = repo Expo séparé (hors de ce plan).
- **Jalons visuels** (toast « Record ! 🎉 » à 4/12/26/52) : `nextMilestone` est exposé dans la vue ;
  l'affichage de célébration est laissé minimal en v1 (YAGNI) et peut être ajouté ensuite sans
  changement de données.
