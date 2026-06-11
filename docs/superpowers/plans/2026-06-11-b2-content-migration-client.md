# B2 #2b (client) — Dashboard depuis la base + nettoyage gating — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Le dashboard *Programme* et l'accueil lisent le contenu depuis la base (repli statique) ; le gating du dashboard est piloté par les `min_plan` de la base ; les constantes de gating statiques sont retirées.

**Architecture:** Une route API `GET /api/disciplines/[slug]` expose `getDisciplineFromDb`. Le serveur passe la liste `freeSlugs` (disciplines `min_plan='free'`) au `ProgrammeClient` pour les cadenas d'onglets ; le contenu de l'onglet sélectionné est récupéré via l'API (repli statique). L'accueil pré-charge le contenu des 3 disciplines affichées depuis la base. `content-access.ts` ne gère plus que les services (coach/smartwatch) ; les constantes `FREE_DISCIPLINE`/`FREE_VIDEO_COUNT`/`canAccessDiscipline`/`canAccessVideo` (devenues inutilisées) sont retirées.

**Tech Stack:** Next.js 16 (route handlers, client components), React 19, Supabase, Jest.

**Spec :** `docs/superpowers/specs/2026-06-11-b2-content-migration-design.md` (couvre #2a+#2b). **Suite de #2a** (mergé).
**Branche :** créer `feat-b2-content-migration-client` depuis `main`.

**Décision (YAGNI) :** le spec §4 prévoyait `canAccessByPlan(access, minPlan)`. Avec l'approche `freeSlugs` (liste serveur) + `SubscriberGate` (prop `minPlan`, fait en #2a), ce helper n'est utilisé nulle part → **non ajouté**.

---

## Préambule
- [ ] **Lire les guides Next.js requis par `AGENTS.md`** (`node_modules/next/dist/docs/`).
- [ ] `git checkout main && git pull && git checkout -b feat-b2-content-migration-client`.

## Structure des fichiers
- Modify `src/lib/content-db.ts` — ajouter `getFreeDisciplineSlugs()`.
- Create `src/app/api/disciplines/[slug]/route.ts` — expose `getDisciplineFromDb`.
- Modify `src/app/[locale]/dashboard/programme/page.tsx` — passe `freeSlugs` au client.
- Modify `src/app/[locale]/dashboard/programme/ProgrammeClient.tsx` — `freeSlugs` + fetch contenu DB (repli statique).
- Modify `src/app/[locale]/dashboard/page.tsx` (overview) — contenu des 3 disciplines depuis la base (repli statique).
- Modify `src/lib/content-access.ts` + `src/lib/content-access.test.ts` — retrait des constantes inutilisées.

---

## Task 1 : `content-db.getFreeDisciplineSlugs()`

**Files:** Modify `src/lib/content-db.ts`

- [ ] **Step 1 : Ajouter la fonction** en fin de `src/lib/content-db.ts` :

```ts
// Slugs des disciplines gratuites (min_plan='free'). Repli ['musculation'] si env/base absente.
export async function getFreeDisciplineSlugs(): Promise<string[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return ['musculation']
  const supabase = await createServiceClient()
  const { data } = await supabase.from('content_disciplines').select('slug').eq('min_plan', 'free')
  const slugs = (data ?? []).map(r => r.slug as string)
  return slugs.length ? slugs : ['musculation']
}
```

- [ ] **Step 2 : Vérifier** — `npx tsc --noEmit` → exit 0 ; `npx jest content-db` → 4 tests toujours verts.

- [ ] **Step 3 : Commit**

```bash
git add src/lib/content-db.ts
git commit -m "feat(b2): getFreeDisciplineSlugs (liste des disciplines gratuites)"
```

---

## Task 2 : Route API `GET /api/disciplines/[slug]`

**Files:** Create `src/app/api/disciplines/[slug]/route.ts`

- [ ] **Step 1 : Créer la route**

```ts
import { NextResponse } from 'next/server'
import { getDisciplineFromDb } from '@/lib/content-db'

export const runtime = 'nodejs'

// Contenu d'une discipline depuis la base (publique ; le contenu est déjà public).
// Renvoie null si absente/base vide → le client utilise alors le repli statique.
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const locale = new URL(req.url).searchParams.get('locale') ?? 'fr'
  const db = await getDisciplineFromDb(slug, locale)
  return NextResponse.json(db)
}
```

- [ ] **Step 2 : Vérifier** — `npx tsc --noEmit` → exit 0 ; `npx eslint "src/app/api/disciplines/[slug]/route.ts"` → exit 0.

- [ ] **Step 3 : Commit**

```bash
git add "src/app/api/disciplines/[slug]/route.ts"
git commit -m "feat(b2): route API /api/disciplines/[slug]"
```

---

## Task 3 : `ProgrammeClient` — contenu DB + gating par `freeSlugs`

**Files:** Modify `src/app/[locale]/dashboard/programme/page.tsx`, `src/app/[locale]/dashboard/programme/ProgrammeClient.tsx`

- [ ] **Step 1 : Wrapper passe `freeSlugs`** — `programme/page.tsx` :

```tsx
import { getAccess } from '@/lib/access'
import { getFreeDisciplineSlugs } from '@/lib/content-db'
import { ProgrammeClient } from './ProgrammeClient'

export default async function Page() {
  const access = await getAccess()
  const freeSlugs = await getFreeDisciplineSlugs()
  return <ProgrammeClient isPro={access.isPro} freeSlugs={freeSlugs} />
}
```

- [ ] **Step 2 : Réécrire `ProgrammeClient.tsx`** (contenu depuis l'API, repli statique ; gating par `freeSlugs`). Remplacer **tout** le fichier par :

```tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { CheckCircle, Circle, Play, ArrowRight, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DISCIPLINE_CONTENT, type DisciplineContent } from '@/lib/disciplines'
import { Link } from '@/i18n/navigation'

const DISCIPLINES = [
  { slug: 'running-cardio', color: 'orange' },
  { slug: 'musculation',    color: 'blue' },
  { slug: 'hiit',           color: 'lime' },
  { slug: 'cyclisme',       color: 'orange' },
  { slug: 'natation',       color: 'blue' },
  { slug: 'crossfit',       color: 'lime' },
  { slug: 'yoga',           color: 'orange' },
  { slug: 'boxing',         color: 'blue' },
  { slug: 'stretching',     color: 'lime' },
  { slug: 'nutrition',      color: 'orange' },
]

const COLOR: Record<string, string> = {
  orange: 'bg-sport-orange text-white border-sport-orange',
  blue: 'bg-sport-blue text-white border-sport-blue',
  lime: 'bg-sport-lime text-[#0A0B0F] border-sport-lime',
}

function ProgrammeContent({ isPro, freeSlugs }: { isPro: boolean; freeSlugs: string[] }) {
  const t = useTranslations('dashboard.programme')
  const locale = useLocale()
  const searchParams = useSearchParams()
  const initialSlug = searchParams.get('discipline') ?? 'running-cardio'

  const [selected, setSelected] = useState(initialSlug)
  const [progress, setProgress] = useState<Record<string, boolean>>({})
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState<DisciplineContent>(DISCIPLINE_CONTENT[initialSlug])
  const [videoMinPlans, setVideoMinPlans] = useState<string[]>([])

  const unlocked = (slug: string) => isPro || freeSlugs.includes(slug)
  const selectedUnlocked = unlocked(selected)

  // Progression de l'utilisateur pour la discipline sélectionnée.
  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      setUserId(user.id)
      const { data } = await supabase.from('progress').select('*').eq('user_id', user.id).eq('discipline', selected)
      const map: Record<string, boolean> = {}
      ;(data ?? []).forEach(p => { map[`${p.week}-${p.session_name}`] = p.completed })
      setProgress(map)
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- état de chargement avant fetch déclenché par le changement de discipline
    setLoading(true)
    load()
  }, [selected])

  // Contenu : repli statique immédiat, puis base via l'API (repli si null/échec).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- repli statique immédiat au changement d'onglet
    setContent(DISCIPLINE_CONTENT[selected])
    setVideoMinPlans([])
    let alive = true
    fetch(`/api/disciplines/${selected}?locale=${locale}`)
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (alive && d?.content) { setContent(d.content as DisciplineContent); setVideoMinPlans((d.videoMinPlans ?? []) as string[]) } })
      .catch(() => { /* repli statique déjà en place */ })
    return () => { alive = false }
  }, [selected, locale])

  async function toggleSession(week: number, sessionName: string, completed: boolean) {
    if (!userId) return
    const key = `${week}-${sessionName}`
    setProgress(prev => ({ ...prev, [key]: !completed }))
    const supabase = createClient()
    await supabase.from('progress').upsert({
      user_id: userId, discipline: selected, week, session_name: sessionName,
      completed: !completed, completed_at: !completed ? new Date().toISOString() : null,
    }, { onConflict: 'user_id,discipline,week,session_name' })
  }

  const totalSessions = (content?.program ?? []).reduce((a, w) => a + w.sessions.length, 0)
  const completedCount = Object.values(progress).filter(Boolean).length
  const pct = totalSessions > 0 ? Math.round((completedCount / totalSessions) * 100) : 0
  // Nombre de vidéos visibles pour un non-PRO (depuis la base ; repli 1 pour une discipline gratuite).
  const freeVideoCount = videoMinPlans.length > 0 ? videoMinPlans.filter(p => p === 'free').length : 1

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto pb-24 md:pb-8">
      <h1 className="text-2xl font-black text-white mb-6">{t('title')}</h1>

      {/* Discipline tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {DISCIPLINES.map(d => {
          const locked = !unlocked(d.slug)
          return (
            <button
              key={d.slug}
              onClick={() => setSelected(d.slug)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border inline-flex items-center gap-1.5 ${
                selected === d.slug
                  ? COLOR[d.color]
                  : 'border-sport-border text-sport-gray hover:text-white hover:border-sport-gray bg-transparent'
              }`}
            >
              {locked && <Lock size={11} aria-hidden="true" />}
              {t(`disciplines.${d.slug}`)}
            </button>
          )
        })}
      </div>

      {!selectedUnlocked && (
        <div className="rounded-2xl border border-sport-border bg-sport-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sport-orange/15 border border-sport-orange/30">
            <Lock size={20} className="text-sport-orange" aria-hidden="true" />
          </div>
          <p className="text-lg font-black text-white mb-1">{t('lockedTitle')}</p>
          <p className="text-sport-gray text-sm mb-5">{t('lockedSubtitle', { name: t(`disciplines.${selected}`) })}</p>
          <Link href="/dashboard/abonnement" className="inline-flex items-center gap-2 rounded-full bg-sport-orange px-5 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-all">
            {t('lockedCta')} <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      )}

      {selectedUnlocked && (<>
      {/* Progress bar */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-black text-white">{t('weeks', { name: t(`disciplines.${selected}`) })}</p>
            <p className="text-[11px] text-sport-gray">{t('sessionsCompleted', { completed: completedCount, total: totalSessions })}</p>
          </div>
          <span className="text-2xl font-black text-sport-orange">{pct}%</span>
        </div>
        <div className="w-full bg-sport-dark rounded-full h-2">
          <div className="bg-sport-orange h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        {pct === 100 && (
          <p className="text-emerald-400 text-xs font-bold mt-3 flex items-center gap-1.5">
            <CheckCircle size={13} /> {t('done')}
          </p>
        )}
      </div>

      {/* Videos quick link */}
      {content?.videos && content.videos.length > 0 && (
        <Link
          href={`/disciplines/${selected}`}
          className="flex items-center justify-between bg-sport-card border border-sport-border rounded-xl px-5 py-4 mb-6 hover:border-sport-orange/50 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sport-orange/15 rounded-lg flex items-center justify-center">
              <Play size={14} className="text-sport-orange ml-0.5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{t('videosAvailable', { count: isPro ? content.videos.length : freeVideoCount })}</p>
              <p className="text-[11px] text-sport-gray">{isPro ? t('videosSubtitle') : t('videosFreeHint')}</p>
            </div>
          </div>
          <ArrowRight size={14} className="text-sport-gray group-hover:text-sport-orange transition-colors" />
        </Link>
      )}

      {/* Program weeks */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="bg-sport-card border border-sport-border rounded-xl h-32 animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {(content?.program ?? []).map((block, bi) => (
            <div key={block.week} className="bg-sport-card border border-sport-border rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-sport-border flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-sport-orange">{block.week}</p>
                  <p className="text-sm font-bold text-white">{block.theme}</p>
                </div>
                <span className="text-xs font-bold text-sport-gray">{t('phase', { n: bi + 1 })}</span>
              </div>
              <ul className="divide-y divide-sport-border">
                {block.sessions.map((session) => {
                  const key = `${bi + 1}-${session.name}`
                  const done = progress[key] ?? false
                  return (
                    <li key={session.name} className="px-5 py-4 flex gap-4 items-start">
                      <button
                        onClick={() => toggleSession(bi + 1, session.name, done)}
                        aria-label={done ? t('markUndone', { name: session.name }) : t('markDone', { name: session.name })}
                        className="mt-0.5 shrink-0 transition-all hover:scale-110"
                      >
                        {done
                          ? <CheckCircle size={20} className="text-emerald-400" />
                          : <Circle size={20} className="text-sport-border hover:text-sport-orange transition-colors" />
                        }
                      </button>
                      <div className={done ? 'opacity-50' : ''}>
                        <p className={`text-sm font-bold ${done ? 'line-through text-sport-gray' : 'text-white'}`}>{session.name}</p>
                        <p className="text-xs text-sport-gray mt-0.5 leading-relaxed">{session.detail}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
      </>)}
    </div>
  )
}

export function ProgrammeClient({ isPro, freeSlugs }: { isPro: boolean; freeSlugs: string[] }) {
  return <Suspense fallback={<div className="p-8 text-sport-gray text-sm" />}><ProgrammeContent isPro={isPro} freeSlugs={freeSlugs} /></Suspense>
}
```

- [ ] **Step 3 : Vérifier** — `npx tsc --noEmit` → exit 0 ; `npx eslint "src/app/[locale]/dashboard/programme/ProgrammeClient.tsx" "src/app/[locale]/dashboard/programme/page.tsx"` → exit 0.

- [ ] **Step 4 : Commit**

```bash
git add "src/app/[locale]/dashboard/programme"
git commit -m "feat(b2): dashboard Programme — contenu depuis la base + gating par min_plan (freeSlugs)"
```

---

## Task 4 : Accueil (overview) — contenu des 3 disciplines depuis la base

**Files:** Modify `src/app/[locale]/dashboard/page.tsx`

- [ ] **Step 1 : Importer la lecture DB** — ajouter en tête (à côté des imports existants) :

```tsx
import { getDisciplineFromDb } from '@/lib/content-db'
```

- [ ] **Step 2 : Pré-charger le contenu des 3 disciplines** — juste avant le `return (` du composant, après `const disciplineSlugs = [...]`, ajouter :

```tsx
  const overviewSlugs = disciplineSlugs.slice(0, 3)
  const overviewContents = Object.fromEntries(
    await Promise.all(overviewSlugs.map(async (s) => [s, (await getDisciplineFromDb(s, locale))?.content ?? DISCIPLINE_CONTENT[s]] as const)),
  )
```

- [ ] **Step 3 : Utiliser le contenu pré-chargé** — dans la grille des programmes, remplacer :

```tsx
          {disciplineSlugs.slice(0, 3).map((slug) => {
            const content = DISCIPLINE_CONTENT[slug]
```
par :
```tsx
          {overviewSlugs.map((slug) => {
            const content = overviewContents[slug]
```

- [ ] **Step 4 : Vérifier** — `npx tsc --noEmit` → exit 0 ; `npx eslint "src/app/[locale]/dashboard/page.tsx"` → exit 0.

- [ ] **Step 5 : Commit**

```bash
git add "src/app/[locale]/dashboard/page.tsx"
git commit -m "feat(b2): accueil — contenu des programmes depuis la base (repli statique)"
```

---

## Task 5 : Nettoyage `content-access` (retrait des constantes inutilisées)

**Files:** Modify `src/lib/content-access.ts`, `src/lib/content-access.test.ts`

(À ce stade, plus aucun fichier n'utilise `FREE_DISCIPLINE`/`FREE_VIDEO_COUNT`/`canAccessDiscipline`/`canAccessVideo` — vérifié par grep au Step 1.)

- [ ] **Step 1 : Confirmer l'absence d'usage** — `grep -rnE "FREE_DISCIPLINE|FREE_VIDEO_COUNT|canAccessDiscipline|canAccessVideo" src | grep -v "content-access"` → **doit être vide**. (Sinon, ne pas supprimer ce qui est encore utilisé.)

- [ ] **Step 2 : Réécrire `content-access.ts`** (ne garde que le gating des services) :

```ts
import type { Access } from './access'

// Services réservés à PRO (les disciplines/vidéos sont gérées par leur min_plan en base).
export const PRO_ONLY_SERVICES = ['coach', 'smartwatch'] as const

// PRO/admin : tous les services. Free : tout sauf les services PRO-only. Guest : rien.
export function canUseService(access: Access, key: string): boolean {
  if (access.isPro) return true
  if (access.role !== 'free') return false
  return !(PRO_ONLY_SERVICES as readonly string[]).includes(key)
}
```

- [ ] **Step 3 : Réécrire `content-access.test.ts`** (retirer les tests des helpers supprimés) :

```ts
import { canUseService } from './content-access'
import type { Access } from './access'

const mk = (over: Partial<Access>): Access => ({
  role: 'free', isPro: false, isAdmin: false, status: null, plan: null,
  trialEnd: null, renewDate: null, cancelAtPeriodEnd: false, ...over,
})
const guest = mk({ role: 'guest' })
const free = mk({ role: 'free' })
const pro = mk({ role: 'pro', isPro: true, status: 'active' })
const admin = mk({ role: 'admin', isPro: true, isAdmin: true })

describe('content-access', () => {
  describe('canUseService', () => {
    it('pro/admin : tous les services', () => {
      for (const s of ['coach', 'smartwatch', 'programme', 'progression', 'notifications']) {
        expect(canUseService(pro, s)).toBe(true)
        expect(canUseService(admin, s)).toBe(true)
      }
    })
    it('free : programme/progression/notifications oui, coach/smartwatch non', () => {
      expect(canUseService(free, 'programme')).toBe(true)
      expect(canUseService(free, 'progression')).toBe(true)
      expect(canUseService(free, 'notifications')).toBe(true)
      expect(canUseService(free, 'coach')).toBe(false)
      expect(canUseService(free, 'smartwatch')).toBe(false)
    })
    it('guest : aucun', () => {
      expect(canUseService(guest, 'programme')).toBe(false)
    })
  })
})
```

- [ ] **Step 4 : Vérifier** — `npx jest content-access` → PASS (3 tests) ; `npx tsc --noEmit` → exit 0 ; `npx eslint src` → exit 0.

- [ ] **Step 5 : Commit**

```bash
git add src/lib/content-access.ts src/lib/content-access.test.ts
git commit -m "refactor(b2): content-access ne gère plus que les services (gating contenu = min_plan DB)"
```

---

## Task 6 : Vérification finale

- [ ] **Step 1 : Suite + types + lint + build**

Run : `npx jest && npx tsc --noEmit && npx eslint src && npm run build`
Expected : tests verts, tsc/eslint exit 0, build OK (`/disciplines/[slug]` en `●` SSG, `/api/disciplines/[slug]` en `ƒ`).

- [ ] **Step 2 : Vérif manuelle** (après seed + déploiement) : dashboard *Programme* — Musculation déverrouillée, 9 autres cadenassées (selon `freeSlugs` DB) ; le contenu vient de la base (repli statique si API échoue) ; accueil OK.

- [ ] **Step 3 :** push + PR.

---

## Notes
- DRY : `getDisciplineFromDb`/`getFreeDisciplineSlugs` = uniques accès DB ; le gating contenu vit dans les `min_plan` de la base (plus de constante magique).
- Repli statique conservé partout (résilience + build local sans clés Supabase).
- Reste après #2 : **#3** back-office (CMS) + revalidation à la demande (ISR) — le bénéfice « éditer sans redéploiement ».
