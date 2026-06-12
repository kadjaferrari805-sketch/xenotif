# Phase 2 « Gamification » — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** Ajouter une gamification personnelle (XP, niveaux, badges, défis hebdo/mensuels) calculée depuis l'activité réelle, visible dans le dashboard et l'aperçu public.

**Architecture :** Lib pure `gamification.ts` (déterministe, testable) + 3 composants présentationnels, branchés sur les données déjà chargées (`workouts` + `progress`). **Aucune table DB.** i18n agnostique (la lib renvoie des `id`/`key`, les composants traduisent).

**Tech Stack :** TypeScript, React, next-intl, Framer Motion, Jest. Spec : `docs/superpowers/specs/2026-06-12-phase2-gamification-design.md`.

---

## File Structure
| Fichier | Responsabilité | Action |
|---|---|---|
| `src/lib/gamification.ts` | lib pure XP/niveaux/badges/défis | Créer |
| `src/lib/gamification.test.ts` | tests de la lib | Créer |
| `src/components/gamification/XpLevelBar.tsx` | barre XP + niveau | Créer |
| `src/components/gamification/ChallengesCard.tsx` | défis + progression | Créer |
| `src/components/gamification/BadgesGrid.tsx` | grille de badges | Créer |
| `src/components/gamification/*.test.tsx` | tests composants | Créer |
| `messages/{fr,en,de}.json` | namespace `gamification` | Modifier |
| `src/app/[locale]/dashboard/progression/ProgressionClient.tsx` | intégration réelle | Modifier |
| `src/app/[locale]/dashboard/page.tsx` | mini-carte XP/niveau | Modifier |
| `src/lib/preview-data.ts` | données démo gamification | Modifier |
| `src/components/preview/PreviewDashboard.tsx` | teaser gamifié | Modifier |

---

## Task 1 : Lib `gamification.ts` (pure, TDD)

**Files:** Create `src/lib/gamification.ts`, `src/lib/gamification.test.ts`

- [ ] **Step 1 — tests (échouent) :** `src/lib/gamification.test.ts`
```ts
import { computeXp, xpToLevel, computeGamification, XP_PER_WORKOUT, XP_PER_SESSION } from './gamification'

const NOW = new Date('2026-06-12T12:00:00') // vendredi
const w = (date: string, discipline = 'musculation', min = 45) => ({ discipline, duration_minutes: min, completed_at: date })

describe('computeXp / xpToLevel', () => {
  it('cumule l’XP séances + sessions', () => {
    expect(computeXp(3, 4)).toBe(3 * XP_PER_WORKOUT + 4 * XP_PER_SESSION)
  })
  it('niveau 0 (recrue) à 0 XP', () => {
    const l = xpToLevel(0)
    expect(l.levelIndex).toBe(0)
    expect(l.levelKey).toBe('recrue')
    expect(l.xpInLevel).toBe(0)
    expect(l.xpForNext).toBe(300)
  })
  it('passe athlète à 300 XP', () => {
    expect(xpToLevel(300).levelKey).toBe('athlete')
    expect(xpToLevel(450).xpInLevel).toBe(150)
  })
  it('niveau max (légende) sans next', () => {
    const l = xpToLevel(99999)
    expect(l.levelKey).toBe('legende')
    expect(l.xpForNext).toBeNull()
  })
})

describe('computeGamification — badges', () => {
  it('débloque first à 1 séance, pas week', () => {
    const g = computeGamification({ workouts: [w('2026-06-10')], programSessionsCompleted: 0, now: NOW })
    expect(g.badges.find(b => b.id === 'first')!.earned).toBe(true)
    expect(g.badges.find(b => b.id === 'week')!.earned).toBe(false)
  })
  it('tenHours quand total minutes >= 600', () => {
    const many = Array.from({ length: 14 }, () => w('2026-01-01', 'musculation', 45)) // 630 min
    const g = computeGamification({ workouts: many, programSessionsCompleted: 0, now: NOW })
    expect(g.badges.find(b => b.id === 'tenHours')!.earned).toBe(true)
  })
  it('fiveDisciplines quand 5 disciplines distinctes', () => {
    const five = ['a', 'b', 'c', 'd', 'e'].map(d => w('2026-01-01', d))
    const g = computeGamification({ workouts: five, programSessionsCompleted: 0, now: NOW })
    expect(g.badges.find(b => b.id === 'fiveDisciplines')!.earned).toBe(true)
  })
  it('streak7 sur 7 jours consécutifs', () => {
    const days = ['2026-06-01','2026-06-02','2026-06-03','2026-06-04','2026-06-05','2026-06-06','2026-06-07']
    const g = computeGamification({ workouts: days.map(d => w(d + 'T10:00:00')), programSessionsCompleted: 0, now: NOW })
    expect(g.badges.find(b => b.id === 'streak7')!.earned).toBe(true)
  })
})

describe('computeGamification — défis', () => {
  it('compte les séances de la semaine courante (lun→dim)', () => {
    // semaine du 2026-06-08 (lun) au 14 (dim)
    const ws = [w('2026-06-09T10:00:00'), w('2026-06-11T10:00:00'), w('2026-06-02T10:00:00')]
    const g = computeGamification({ workouts: ws, programSessionsCompleted: 0, now: NOW })
    const weekSessions = g.weekly.find(c => c.id === 'weekSessions')!
    expect(weekSessions.current).toBe(2) // 09 et 11 dans la semaine, 02 hors
    expect(weekSessions.target).toBe(3)
  })
  it('compte les minutes du mois courant', () => {
    const ws = [w('2026-06-03T10:00:00', 'm', 60), w('2026-06-20T10:00:00', 'm', 90), w('2026-05-30T10:00:00', 'm', 120)]
    const g = computeGamification({ workouts: ws, programSessionsCompleted: 0, now: NOW })
    expect(g.monthly.find(c => c.id === 'monthMinutes')!.current).toBe(150) // mai exclu
  })
})
```

- [ ] **Step 2 — run (échec) :** `npx jest src/lib/gamification.test.ts` → FAIL.

- [ ] **Step 3 — implémenter :** `src/lib/gamification.ts`
```ts
export type WorkoutLite = { discipline: string; duration_minutes: number; completed_at: string }

export const XP_PER_WORKOUT = 50
export const XP_PER_SESSION = 30

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
  xpInLevel: number
  xpForNext: number | null
  badges: Badge[]
  weekly: Challenge[]
  monthly: Challenge[]
}

export function computeXp(workoutCount: number, programSessionsCompleted: number): number {
  return workoutCount * XP_PER_WORKOUT + programSessionsCompleted * XP_PER_SESSION
}

export function xpToLevel(xp: number) {
  let i = 0
  for (let k = 0; k < LEVELS.length; k++) if (xp >= LEVELS[k].minXp) i = k
  const level = LEVELS[i]
  const next = LEVELS[i + 1]
  return {
    levelIndex: i,
    levelKey: level.key as string,
    xpInLevel: xp - level.minXp,
    xpForNext: next ? next.minXp - level.minXp : null,
  }
}

// Jour local "YYYY-MM-DD" d'une date ISO.
function dayKey(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Plus longue série de jours consécutifs présents dans l'ensemble.
function longestStreak(days: Set<string>): number {
  let best = 0
  for (const day of days) {
    // début de série : la veille n'est pas présente
    const prev = new Date(day); prev.setDate(prev.getDate() - 1)
    if (days.has(dayKey(prev.toISOString()))) continue
    let len = 1
    const cur = new Date(day)
    for (;;) {
      cur.setDate(cur.getDate() + 1)
      if (days.has(dayKey(cur.toISOString()))) len++
      else break
    }
    best = Math.max(best, len)
  }
  return best
}

function startOfWeek(now: Date): Date {
  const d = new Date(now); d.setHours(0, 0, 0, 0)
  const dow = (d.getDay() + 6) % 7 // 0 = lundi
  d.setDate(d.getDate() - dow)
  return d
}

export function computeGamification(input: { workouts: WorkoutLite[]; programSessionsCompleted: number; now?: Date }): Gamification {
  const { workouts, programSessionsCompleted } = input
  const now = input.now ?? new Date()
  const xp = computeXp(workouts.length, programSessionsCompleted)
  const lvl = xpToLevel(xp)

  const totalMinutes = workouts.reduce((a, w) => a + (w.duration_minutes ?? 0), 0)
  const disciplines = new Set(workouts.map(w => w.discipline))
  const dayset = new Set(workouts.map(w => dayKey(w.completed_at)))
  const streak = longestStreak(dayset)

  const badges: Badge[] = [
    { id: 'first', icon: '🏃', earned: workouts.length >= 1 },
    { id: 'week', icon: '📅', earned: workouts.length >= 7 },
    { id: 'month', icon: '🏆', earned: workouts.length >= 30 },
    { id: 'century', icon: '💯', earned: workouts.length >= 100 },
    { id: 'tenHours', icon: '⏱️', earned: totalMinutes >= 600 },
    { id: 'fiveDisciplines', icon: '🎯', earned: disciplines.size >= 5 },
    { id: 'streak7', icon: '🔥', earned: streak >= 7 },
  ]

  const weekStart = startOfWeek(now).getTime()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
  const inWeek = workouts.filter(w => new Date(w.completed_at).getTime() >= weekStart)
  const inMonth = workouts.filter(w => new Date(w.completed_at).getTime() >= monthStart)
  const min = (arr: WorkoutLite[]) => arr.reduce((a, w) => a + (w.duration_minutes ?? 0), 0)

  const weekly: Challenge[] = [
    { id: 'weekSessions', target: 3, current: inWeek.length },
    { id: 'weekMinutes', target: 120, current: min(inWeek) },
    { id: 'weekDisciplines', target: 2, current: new Set(inWeek.map(w => w.discipline)).size },
  ]
  const monthly: Challenge[] = [
    { id: 'monthSessions', target: 12, current: inMonth.length },
    { id: 'monthMinutes', target: 600, current: min(inMonth) },
  ]

  return { xp, ...lvl, badges, weekly, monthly }
}
```

- [ ] **Step 4 — run (passe) :** `npx jest src/lib/gamification.test.ts` → PASS.

- [ ] **Step 5 — commit :**
```bash
git add src/lib/gamification.ts src/lib/gamification.test.ts
git commit -m "feat(gamification): lib pure XP/niveaux/badges/défis (calculée depuis l'activité)"
```

---

## Task 2 : i18n `gamification`

**Files:** Modify `messages/{fr,en,de}.json` (namespace top-level `gamification`).

- [ ] **Step 1 — insérer le namespace** (via script d'insertion avant `"common"`, comme les phases précédentes). Contenu fr :
```json
"gamification": {
  "level": "Niveau", "xp": "XP", "nextLevel": "Niveau suivant",
  "weeklyTitle": "Défis de la semaine", "monthlyTitle": "Défis du mois",
  "badgesTitle": "Badges", "done": "Terminé",
  "levels": { "recrue": "Recrue", "athlete": "Athlète", "competiteur": "Compétiteur", "elite": "Élite", "champion": "Champion", "legende": "Légende" },
  "badges": { "first": "Première séance", "week": "7 séances", "month": "30 séances", "century": "100 séances", "tenHours": "10h cumulées", "fiveDisciplines": "5 disciplines", "streak7": "7 jours d'affilée" },
  "challenges": { "weekSessions": "{current}/{target} séances", "weekMinutes": "{current}/{target} min d'activité", "weekDisciplines": "{current}/{target} disciplines", "monthSessions": "{current}/{target} séances", "monthMinutes": "{current}/{target} min d'activité" }
}
```
en :
```json
"gamification": {
  "level": "Level", "xp": "XP", "nextLevel": "Next level",
  "weeklyTitle": "Weekly challenges", "monthlyTitle": "Monthly challenges",
  "badgesTitle": "Badges", "done": "Done",
  "levels": { "recrue": "Rookie", "athlete": "Athlete", "competiteur": "Competitor", "elite": "Elite", "champion": "Champion", "legende": "Legend" },
  "badges": { "first": "First session", "week": "7 sessions", "month": "30 sessions", "century": "100 sessions", "tenHours": "10h total", "fiveDisciplines": "5 disciplines", "streak7": "7-day streak" },
  "challenges": { "weekSessions": "{current}/{target} sessions", "weekMinutes": "{current}/{target} active min", "weekDisciplines": "{current}/{target} disciplines", "monthSessions": "{current}/{target} sessions", "monthMinutes": "{current}/{target} active min" }
}
```
de :
```json
"gamification": {
  "level": "Stufe", "xp": "XP", "nextLevel": "Nächste Stufe",
  "weeklyTitle": "Wöchentliche Challenges", "monthlyTitle": "Monatliche Challenges",
  "badgesTitle": "Abzeichen", "done": "Geschafft",
  "levels": { "recrue": "Rekrut", "athlete": "Athlet", "competiteur": "Wettkämpfer", "elite": "Elite", "champion": "Champion", "legende": "Legende" },
  "badges": { "first": "Erste Einheit", "week": "7 Einheiten", "month": "30 Einheiten", "century": "100 Einheiten", "tenHours": "10 Std. gesamt", "fiveDisciplines": "5 Disziplinen", "streak7": "7 Tage in Folge" },
  "challenges": { "weekSessions": "{current}/{target} Einheiten", "weekMinutes": "{current}/{target} aktive Min.", "weekDisciplines": "{current}/{target} Disziplinen", "monthSessions": "{current}/{target} Einheiten", "monthMinutes": "{current}/{target} aktive Min." }
}
```

- [ ] **Step 2 — valider JSON** (`JSON.parse` fr/en/de) puis **commit :**
```bash
git add messages/fr.json messages/en.json messages/de.json
git commit -m "feat(gamification): i18n niveaux/badges/défis (fr/en/de)"
```

---

## Task 3 : Composants gamification

**Files:** Create `XpLevelBar.tsx`, `ChallengesCard.tsx`, `BadgesGrid.tsx` (+ tests) dans `src/components/gamification/`.

- [ ] **Step 1 — tests (échouent) :**

`src/components/gamification/XpLevelBar.test.tsx`
```tsx
import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { XpLevelBar } from './XpLevelBar'

it('rend le niveau et l’XP', () => {
  renderWithIntl(<XpLevelBar xp={450} levelKey="athlete" xpInLevel={150} xpForNext={500} />)
  expect(screen.getByText(/athlète/i)).toBeInTheDocument()
  expect(screen.getByText(/450/)).toBeInTheDocument()
})
```
`src/components/gamification/ChallengesCard.test.tsx`
```tsx
import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { ChallengesCard } from './ChallengesCard'

it('rend un défi avec sa progression', () => {
  renderWithIntl(<ChallengesCard titleKey="weeklyTitle" challenges={[{ id: 'weekSessions', target: 3, current: 2 }]} />)
  expect(screen.getByText(/défis de la semaine/i)).toBeInTheDocument()
  expect(screen.getByText(/2\/3 séances/i)).toBeInTheDocument()
})
```
`src/components/gamification/BadgesGrid.test.tsx`
```tsx
import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { BadgesGrid } from './BadgesGrid'

it('rend les badges gagnés et verrouillés', () => {
  renderWithIntl(<BadgesGrid badges={[{ id: 'first', icon: '🏃', earned: true }, { id: 'week', icon: '📅', earned: false }]} />)
  expect(screen.getByText(/première séance/i)).toBeInTheDocument()
  expect(screen.getByText(/7 séances/i)).toBeInTheDocument()
})
```

- [ ] **Step 2 — run (échec) :** `npx jest src/components/gamification` → FAIL.

- [ ] **Step 3 — implémenter :**

`src/components/gamification/XpLevelBar.tsx`
```tsx
'use client'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Zap } from 'lucide-react'

export function XpLevelBar({ xp, levelKey, xpInLevel, xpForNext, compact = false }: { xp: number; levelKey: string; xpInLevel: number; xpForNext: number | null; compact?: boolean }) {
  const t = useTranslations('gamification')
  const pct = xpForNext ? Math.min(100, Math.round((xpInLevel / xpForNext) * 100)) : 100
  return (
    <div className={`bg-sport-card border border-sport-border rounded-2xl ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-sport-orange/15 border border-sport-orange/30 flex items-center justify-center">
            <Zap size={16} className="text-sport-orange" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-sport-gray leading-none">{t('level')}</p>
            <p className="text-base font-black text-white leading-tight">{t(`levels.${levelKey}`)}</p>
          </div>
        </div>
        <span className="text-sm font-black text-sport-orange tabular-nums">{xp} {t('xp')}</span>
      </div>
      <div className="w-full bg-sport-dark rounded-full h-2 overflow-hidden">
        <motion.div className="bg-sport-orange h-2 rounded-full" initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
      </div>
      {xpForNext && (
        <p className="text-[11px] text-sport-gray mt-1.5 text-right">{xpInLevel}/{xpForNext} {t('xp')} · {t('nextLevel')}</p>
      )}
    </div>
  )
}
```

`src/components/gamification/ChallengesCard.tsx`
```tsx
import { useTranslations } from 'next-intl'
import { CheckCircle } from 'lucide-react'
import type { Challenge } from '@/lib/gamification'

export function ChallengesCard({ titleKey, challenges }: { titleKey: 'weeklyTitle' | 'monthlyTitle'; challenges: Challenge[] }) {
  const t = useTranslations('gamification')
  return (
    <div className="bg-sport-card border border-sport-border rounded-2xl p-6">
      <h3 className="text-sm font-black text-white mb-4">{t(titleKey)}</h3>
      <div className="space-y-4">
        {challenges.map(c => {
          const pct = Math.min(100, Math.round((c.current / c.target) * 100))
          const done = c.current >= c.target
          return (
            <div key={c.id}>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-sport-gray">{t(`challenges.${c.id}`, { current: c.current, target: c.target })}</span>
                {done && <span className="inline-flex items-center gap-1 text-emerald-400 font-bold"><CheckCircle size={11} aria-hidden="true" /> {t('done')}</span>}
              </div>
              <div className="w-full bg-sport-dark rounded-full h-1.5">
                <div className={`${done ? 'bg-emerald-400' : 'bg-sport-orange'} h-1.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

`src/components/gamification/BadgesGrid.tsx`
```tsx
import { useTranslations } from 'next-intl'
import { CheckCircle } from 'lucide-react'
import type { Badge } from '@/lib/gamification'

export function BadgesGrid({ badges }: { badges: Badge[] }) {
  const t = useTranslations('gamification')
  return (
    <div className="bg-sport-card border border-sport-border rounded-2xl p-6">
      <h3 className="text-base font-black text-white mb-5">{t('badgesTitle')}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map(b => (
          <div key={b.id} className={`rounded-xl p-4 text-center border transition-all ${b.earned ? 'bg-yellow-400/10 border-yellow-400/30' : 'bg-sport-dark border-sport-border opacity-50'}`}>
            <span className="text-3xl block mb-2">{b.icon}</span>
            <p className={`text-[11px] font-black leading-tight ${b.earned ? 'text-yellow-400' : 'text-sport-gray'}`}>{t(`badges.${b.id}`)}</p>
            {b.earned && <CheckCircle size={12} className="text-emerald-400 mx-auto mt-2" aria-hidden="true" />}
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4 — run (passe) :** `npx jest src/components/gamification` → PASS.

- [ ] **Step 5 — commit :**
```bash
git add src/components/gamification/
git commit -m "feat(gamification): composants XpLevelBar / ChallengesCard / BadgesGrid"
```

---

## Task 4 : Intégration `/dashboard/progression`

**Files:** Modify `src/app/[locale]/dashboard/progression/ProgressionClient.tsx`

- [ ] **Step 1 — imports :** ajouter en tête :
```tsx
import { computeGamification } from '@/lib/gamification'
import { XpLevelBar } from '@/components/gamification/XpLevelBar'
import { ChallengesCard } from '@/components/gamification/ChallengesCard'
import { BadgesGrid } from '@/components/gamification/BadgesGrid'
```

- [ ] **Step 2 — supprimer le tableau statique `BADGES`** (lignes 14-19) et l'import `Award`/`CheckCircle` s'il ne sert plus ailleurs (vérifier : `Award` utilisé dans la grille stats → garder ; `CheckCircle` utilisé dans le chart 100% → vérifier avant retrait).

- [ ] **Step 3 — calculer la gamification** dans le composant (après `const totalHours = ...`) :
```tsx
  const gam = computeGamification({
    workouts,
    programSessionsCompleted: progress.filter(p => p.completed).length,
  })
```

- [ ] **Step 4 — injecter `XpLevelBar`** juste après le `</div>` de l'en-tête (la div `flex items-center justify-between mb-8`), avant la modal :
```tsx
      <XpLevelBar xp={gam.xp} levelKey={gam.levelKey} xpInLevel={gam.xpInLevel} xpForNext={gam.xpForNext} />
      <div className="h-8" />
```

- [ ] **Step 5 — remplacer la grille de badges statique** (le bloc `{/* Badges */}` qui mappe `BADGES`) par :
```tsx
      <ChallengesCard titleKey="weeklyTitle" challenges={gam.weekly} />
      <div className="h-8" />
      <ChallengesCard titleKey="monthlyTitle" challenges={gam.monthly} />
      <div className="h-8" />
      <BadgesGrid badges={gam.badges} />
      <div className="h-8" />
```
La carte « stat badges » de la grille de stats devient `gam.badges.filter(b => b.earned).length`.

- [ ] **Step 6 — run :** `npx jest src/app/[locale]/dashboard/progression` (si test existant) + `npx tsc --noEmit`. Mettre à jour les assertions de test impactées.

- [ ] **Step 7 — commit :**
```bash
git add "src/app/[locale]/dashboard/progression/ProgressionClient.tsx"
git commit -m "feat(gamification): /dashboard/progression — XP/niveau + défis + badges réels"
```

---

## Task 5 : Mini-carte XP/niveau sur l'overview

**Files:** Modify `src/app/[locale]/dashboard/page.tsx`

- [ ] **Step 1 — imports :**
```tsx
import { computeXp, xpToLevel } from '@/lib/gamification'
import { XpLevelBar } from '@/components/gamification/XpLevelBar'
```

- [ ] **Step 2 — comptage des séances** : ajouter au `Promise.all` un comptage exact (les `allWorkouts` sont limités à 60) :
```tsx
    supabase.from('workouts').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
```
Récupérer `{ count: workoutCount }` dans le destructuring du `Promise.all`.

- [ ] **Step 3 — calculer XP/niveau** après le `Promise.all` :
```tsx
  const xp = computeXp(workoutCount ?? 0, totalSessions)
  const lvl = xpToLevel(xp)
```
(`totalSessions` existe déjà = `progress.filter(p => p.completed).length`.)

- [ ] **Step 4 — afficher** la mini-carte sous l'en-tête (après le bloc header, avant les anneaux/TodayActivity) :
```tsx
      <div className="mb-6">
        <XpLevelBar xp={xp} levelKey={lvl.levelKey} xpInLevel={lvl.xpInLevel} xpForNext={lvl.xpForNext} compact />
      </div>
```

- [ ] **Step 5 — run :** `npx tsc --noEmit` + `npx jest` (overview n'a pas de test dédié ; vérifier non-régression). **Commit :**
```bash
git add "src/app/[locale]/dashboard/page.tsx"
git commit -m "feat(gamification): mini-carte XP/niveau sur l'overview"
```

---

## Task 6 : Teaser gamifié `/dashboard-preview`

**Files:** Modify `src/lib/preview-data.ts`, `src/components/preview/PreviewDashboard.tsx`

- [ ] **Step 1 — données démo** : ajouter dans `PREVIEW` (`src/lib/preview-data.ts`) :
```ts
  gamification: {
    xp: 920,
    levelKey: 'competiteur',
    xpInLevel: 120,
    xpForNext: 800,
    weekly: [
      { id: 'weekSessions', target: 3, current: 2 },
      { id: 'weekMinutes', target: 120, current: 95 },
      { id: 'weekDisciplines', target: 2, current: 2 },
    ],
  },
```

- [ ] **Step 2 — afficher** dans `PreviewDashboard.tsx` : importer `XpLevelBar` + `ChallengesCard`, et insérer après l'en-tête (`motion.div` greeting) :
```tsx
        <motion.div {...reveal} className="mb-8">
          <XpLevelBar xp={PREVIEW.gamification.xp} levelKey={PREVIEW.gamification.levelKey} xpInLevel={PREVIEW.gamification.xpInLevel} xpForNext={PREVIEW.gamification.xpForNext} />
        </motion.div>
```
et une `ChallengesCard` avant la carte teaser Coach IA :
```tsx
        <motion.div {...reveal} className="mb-8">
          <ChallengesCard titleKey="weeklyTitle" challenges={[...PREVIEW.gamification.weekly]} />
        </motion.div>
```

- [ ] **Step 3 — run :** `npx jest src/components/preview/PreviewDashboard.test.tsx` + `npx tsc --noEmit` → PASS.

- [ ] **Step 4 — commit :**
```bash
git add src/lib/preview-data.ts src/components/preview/PreviewDashboard.tsx
git commit -m "feat(gamification): teaser XP/niveau + défis sur /dashboard-preview"
```

---

## Task 7 : Vérification finale
- [ ] **Step 1 :** `npx jest` → tous verts.
- [ ] **Step 2 :** `npx tsc --noEmit` → OK.
- [ ] **Step 3 :** `npx eslint` sur les fichiers créés/modifiés → 0 erreur.
- [ ] **Step 4 :** JSON fr/en/de valides.
- [ ] **Step 5 :** skill `superpowers:finishing-a-development-branch` → PR, merge, déploiement, **vérif live** (`/dashboard-preview` montre XP/niveau + défis ; pages dashboard logguées via test manuel ou confiance).

---

## Self-Review (couverture spec)
- Livrable 1 (lib pure) → Task 1. ✅
- Livrable 2 (composants) → Task 3. ✅
- Livrable 3 (intégration progression / overview / preview) → Tasks 4, 5, 6. ✅
- Livrable 4 (i18n) → Task 2. ✅
- Tests (lib + composants) → Tasks 1, 3 + Task 7. ✅
- Hors périmètre respecté (pas de classement, pas de claim, pas de table). ✅

Cohérence des types : `Gamification`/`Badge`/`Challenge`/`WorkoutLite` (Task 1) consommés par composants (Task 3) et intégrations (Tasks 4-6) ; `computeGamification`/`computeXp`/`xpToLevel` signatures stables ; clés i18n `gamification.*` définies (Task 2) avant usage.
