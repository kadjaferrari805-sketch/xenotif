# B2 #2a (serveur) — Seed des 10 disciplines + pages publiques depuis la base — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Servir **les 10 disciplines** depuis la base sur les **pages publiques** `/disciplines/[slug]`, avec gating piloté par le `min_plan` de la base (`SubscriberGate`), repli statique conservé.

**Architecture:** Le générateur de #1 produit le seed des 10 disciplines (exécuté manuellement dans Supabase). La page publique lit `getDisciplineFromDb` pour toutes les disciplines (repli statique). `SubscriberGate` passe d'un check par slug à un prop `minPlan`. Le dashboard client (Programme) reste sur le statique → traité en **#2b**.

**Tech Stack:** Supabase (SQL manuel), Next.js 16 (SSG), TypeScript, `tsx`, Jest.

**Spec :** `docs/superpowers/specs/2026-06-11-b2-content-migration-design.md`
**Branche :** `feat-b2-content-migration`.

**Scission :** ce plan = **#2a (serveur)**. **#2b (client)** = route API `/api/disciplines/[slug]` + bascule `ProgrammeClient` + helper `canAccessByPlan` + retrait des constantes `FREE_DISCIPLINE` → plan séparé ensuite.

---

## Préambule
- [ ] **Lire les guides Next.js requis par `AGENTS.md`** (`node_modules/next/dist/docs/`) avant de coder.

## Structure des fichiers
- Modify `supabase-content.sql` — remplacer la section SEED (Musculation seule) par le seed des **10** disciplines.
- Modify `src/components/disciplines/SubscriberGate.tsx` — prop `minPlan` au lieu de `slug`/`FREE_DISCIPLINE`.
- Modify `src/app/[locale]/disciplines/[slug]/page.tsx` — toutes les disciplines via `getDisciplineFromDb` + passe `minPlan` au gate.

---

## Task 1 : Seed des 10 disciplines

**Files:** Modify `supabase-content.sql`

- [ ] **Step 1 : Régénérer le seed pour les 10 disciplines** (conserve le DDL, remplace la section SEED)

Run :
```bash
awk '/^-- ── SEED/{print; exit} {print}' supabase-content.sql > /tmp/content.sql
npx tsx scripts/gen-content-seed.ts running-cardio musculation hiit cyclisme natation crossfit yoga boxing stretching nutrition >> /tmp/content.sql
mv /tmp/content.sql supabase-content.sql
```
(`awk` garde tout jusqu'au marqueur `-- ── SEED …` inclus, puis on ajoute le seed des 10. `tsx` sera installé par `npx` si absent.)

- [ ] **Step 2 : Vérifier le contenu généré**

Run :
```bash
grep -c "insert into public.content_disciplines" supabase-content.sql   # attendu : 10
grep -c "insert into public.content_discipline_i18n" supabase-content.sql # attendu : 30
node -e "const fs=require('fs');const sql=fs.readFileSync('supabase-content.sql','utf8');const m=[...sql.matchAll(/'(\{.*?\})'::jsonb/gs)];let ok=0;for(const x of m){try{JSON.parse(x[1].replace(/''/g,String.fromCharCode(39)));ok++}catch(e){console.error('JSON KO');process.exit(1)}}console.log('jsonb blocs valides:',ok)"
```
Expected : 10 disciplines, 30 i18n, tous les blocs jsonb valides.

- [ ] **Step 3 : Commit**

```bash
git add supabase-content.sql
git commit -m "feat(b2): seed des 10 disciplines (fr/en/de)"
```

- [ ] **Step 4 : (ACTION UTILISATEUR, hors agent)** exécuter `supabase-content.sql` dans Supabase → SQL Editor (idempotent). Tant que ce n'est pas fait, les disciplines non encore en base restent servies par le statique (repli).

---

## Task 2 : `SubscriberGate` piloté par `minPlan`

**Files:** Modify `src/components/disciplines/SubscriberGate.tsx`

- [ ] **Step 1 : Remplacer le prop `slug`/`FREE_DISCIPLINE` par `minPlan`** — réécrire l'en-tête et la signature :

Remplacer :
```tsx
import { Lock, ArrowRight } from 'lucide-react'
import { FREE_DISCIPLINE } from '@/lib/content-access'

// Soft-paywall : le contenu reste dans le DOM (indexable pour le SEO) mais est
// tronqué + estompé pour les non-abonnés, avec un appel à l'abonnement.
// La discipline gratuite (Musculation) n'est jamais verrouillée ; les abonnés
// actifs/en essai voient tout. Les autres disciplines exigent PRO.
export function SubscriberGate({ slug, children }: { slug?: string; children: React.ReactNode }) {
  const t = useTranslations('disciplines.gate')
  const isFree = slug === FREE_DISCIPLINE
  const [locked, setLocked] = useState(!isFree) // discipline gratuite → jamais verrouillée
```
par :
```tsx
import { Lock, ArrowRight } from 'lucide-react'

// Soft-paywall : le contenu reste dans le DOM (indexable pour le SEO) mais est
// tronqué + estompé pour les non-abonnés, avec un appel à l'abonnement.
// Le contenu `min_plan === 'free'` n'est jamais verrouillé ; sinon, réservé aux
// abonnés actifs/en essai (PRO).
export function SubscriberGate({ minPlan, children }: { minPlan?: string; children: React.ReactNode }) {
  const t = useTranslations('disciplines.gate')
  const isFree = minPlan === 'free'
  const [locked, setLocked] = useState(!isFree)
```
(Le reste du composant — `useEffect` fetch `/api/subscription`, le rendu paywall — est inchangé.)

- [ ] **Step 2 : Vérifier** — `npx tsc --noEmit` échouera tant que la page passe encore `slug` (corrigé Task 3). Lance `npx eslint src/components/disciplines/SubscriberGate.tsx` (doit passer). La compilation complète est validée en Task 3.

---

## Task 3 : Page publique — toutes les disciplines depuis la base

**Files:** Modify `src/app/[locale]/disciplines/[slug]/page.tsx`

- [ ] **Step 1 : Lire toutes les disciplines depuis la base + calculer `minPlan`** — remplacer :

```tsx
  // B2 : Musculation est servie depuis la base (repli sur le statique si la base est vide).
  const db = slug === 'musculation' ? await getDisciplineFromDb(slug, locale) : null
  const meta = db?.meta ?? getDisciplineMeta(slug, locale)
  if (!base || !meta) notFound()

  const t = await getTranslations('disciplines')

  const photo   = DISC_PHOTOS[slug] ?? ''
  const content = db?.content ?? getDisciplineContent(locale)[slug]
```
par :
```tsx
  // B2 : contenu servi depuis la base pour toutes les disciplines (repli statique si absent).
  const db = await getDisciplineFromDb(slug, locale)
  const meta = db?.meta ?? getDisciplineMeta(slug, locale)
  if (!base || !meta) notFound()

  const t = await getTranslations('disciplines')

  const photo   = DISC_PHOTOS[slug] ?? ''
  const content = db?.content ?? getDisciplineContent(locale)[slug]
  const minPlan = db?.minPlan ?? (slug === 'musculation' ? 'free' : 'pro')
```

- [ ] **Step 2 : Passer `minPlan` aux deux `SubscriberGate`** — remplacer les deux occurrences `<SubscriberGate slug={slug}>` par `<SubscriberGate minPlan={minPlan}>` (l'une autour des vidéos, l'autre autour du programme détaillé).

Run pour les localiser : `grep -n "SubscriberGate slug={slug}" "src/app/[locale]/disciplines/[slug]/page.tsx"` (attendu : 2 lignes).

- [ ] **Step 3 : Vérifier** — `npx tsc --noEmit` → exit 0 ; `npx eslint "src/app/[locale]/disciplines/[slug]/page.tsx" src/components/disciplines/SubscriberGate.tsx` → exit 0.

- [ ] **Step 4 : Build — pages disciplines en SSG**

Run : `npm run build` → vérifier `● /[locale]/disciplines/[slug]` (SSG) et build OK. (En local, env Supabase absent → `getDisciplineFromDb` renvoie `null` → repli statique → build OK.)

- [ ] **Step 5 : Commit**

```bash
git add "src/app/[locale]/disciplines/[slug]/page.tsx" src/components/disciplines/SubscriberGate.tsx
git commit -m "feat(b2): pages publiques — toutes les disciplines depuis la base + gate par min_plan"
```

---

## Task 4 : Vérification finale

- [ ] **Step 1 : Suite + types + lint + build**

Run : `npx jest && npx tsc --noEmit && npx eslint src && npm run build`
Expected : 66/66 tests, tsc/eslint exit 0, build OK, `/disciplines/[slug]` en `●` SSG.

- [ ] **Step 2 : Vérif manuelle** (après que l'utilisateur a exécuté le SQL + déploiement) : chaque page `/disciplines/<slug>` (fr/en/de) sert le contenu depuis la base ; pour un non-PRO, vidéos + programme **verrouillés sauf Musculation** (`min_plan` DB) ; Musculation libre.

- [ ] **Step 3 :** push + PR.

---

## Notes
- DRY : `getDisciplineFromDb` (de #1) est l'unique lecture ; `SubscriberGate` ne connaît plus de slug « magique » → piloté par `minPlan`.
- Repli statique conservé partout (résilience). Le dashboard client (Programme/Progression) reste statique → **#2b**.
- `content-access.ts` n'est PAS touché ici (les constantes `FREE_DISCIPLINE`/helpers restent utilisées par le dashboard jusqu'à #2b).
