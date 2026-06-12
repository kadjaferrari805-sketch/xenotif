# Phase 3 « App & objets connectés » — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** Ajouter 2 sections marketing à l'accueil — app PWA (mockup smartphone + install) et objets connectés (réel + bientôt) — pour augmenter la valeur perçue.

**Architecture :** 2 composants présentationnels (`'use client'` pour Framer Motion), aucun backend. Réutilise `ActivityRings` et la page d'install `/app`. i18n fr/en/de.

**Tech Stack :** React, next-intl, Framer Motion, lucide-react, Jest. Spec : `docs/superpowers/specs/2026-06-12-phase3-app-devices-design.md`.

---

## File Structure
| Fichier | Responsabilité | Action |
|---|---|---|
| `src/components/home/AppShowcase.tsx` | section app + mockup smartphone | Créer |
| `src/components/home/DevicesSync.tsx` | section objets connectés | Créer |
| `src/components/home/AppShowcase.test.tsx` / `DevicesSync.test.tsx` | tests | Créer |
| `messages/{fr,en,de}.json` | namespaces `appShowcase`, `devicesSync` | Modifier |
| `src/app/[locale]/page.tsx` | insertion des 2 sections | Modifier |

---

## Task 1 : i18n

**Files:** Modify `messages/{fr,en,de}.json` (namespaces top-level `appShowcase` et `devicesSync`, insérés avant `"common"` comme les phases précédentes — via script Node).

- [ ] **Step 1 — insérer les namespaces.** Contenu fr :
```json
"appShowcase": {
  "badge": "Application", "title": "L'app XENOTIF dans ta poche",
  "subtitle": "Tes entraînements, ta nutrition et ta progression — partout, même hors-ligne. Installable en un clic, sans store.",
  "features": ["Entraînements guidés en vidéo", "Suivi nutrition & macros", "Progression, XP & badges", "Coach IA personnalisé", "Fonctionne hors-ligne"],
  "cta": "Installer l'app", "mockSessions": "Séances / sem.", "mockLevel": "Niveau", "mockProgress": "Programme"
},
"devicesSync": {
  "title": "Synchronise tes performances", "subtitle": "XENOTIF suit ton activité en temps réel depuis ton téléphone — et bientôt depuis ta montre.",
  "liveBadge": "En direct", "liveSource": "Capteur du téléphone · Apple Fitness",
  "metrics": ["Fréquence cardiaque", "Calories", "Pas", "Sommeil", "Récupération"],
  "soonTitle": "Compatibilité montres — bientôt", "soonTag": "Bientôt"
}
```
en :
```json
"appShowcase": {
  "badge": "App", "title": "The XENOTIF app in your pocket",
  "subtitle": "Your workouts, nutrition and progress — everywhere, even offline. Install in one click, no store.",
  "features": ["Guided video workouts", "Nutrition & macro tracking", "Progress, XP & badges", "Personalized AI coach", "Works offline"],
  "cta": "Install the app", "mockSessions": "Sessions / wk", "mockLevel": "Level", "mockProgress": "Program"
},
"devicesSync": {
  "title": "Sync your performance", "subtitle": "XENOTIF tracks your activity in real time from your phone — and soon from your watch.",
  "liveBadge": "Live", "liveSource": "Phone sensor · Apple Fitness",
  "metrics": ["Heart rate", "Calories", "Steps", "Sleep", "Recovery"],
  "soonTitle": "Watch compatibility — coming soon", "soonTag": "Soon"
}
```
de :
```json
"appShowcase": {
  "badge": "App", "title": "Die XENOTIF-App in deiner Tasche",
  "subtitle": "Deine Workouts, Ernährung und Fortschritte — überall, auch offline. Mit einem Klick installierbar, ohne Store.",
  "features": ["Geführte Video-Workouts", "Ernährungs- & Makro-Tracking", "Fortschritt, XP & Abzeichen", "Personalisierter KI-Coach", "Funktioniert offline"],
  "cta": "App installieren", "mockSessions": "Einheiten / Wo.", "mockLevel": "Stufe", "mockProgress": "Programm"
},
"devicesSync": {
  "title": "Synchronisiere deine Leistung", "subtitle": "XENOTIF erfasst deine Aktivität in Echtzeit über dein Handy — und bald über deine Uhr.",
  "liveBadge": "Live", "liveSource": "Handy-Sensor · Apple Fitness",
  "metrics": ["Herzfrequenz", "Kalorien", "Schritte", "Schlaf", "Erholung"],
  "soonTitle": "Uhren-Kompatibilität — bald", "soonTag": "Bald"
}
```

- [ ] **Step 2 — valider JSON** (`JSON.parse` fr/en/de) puis **commit :**
```bash
git add messages/fr.json messages/en.json messages/de.json
git commit -m "feat(phase3): i18n app showcase + objets connectés (fr/en/de)"
```

---

## Task 2 : AppShowcase

**Files:** Create `src/components/home/AppShowcase.tsx`, `src/components/home/AppShowcase.test.tsx` ; Modify `src/app/[locale]/page.tsx`.

- [ ] **Step 1 — test (échoue) :** `src/components/home/AppShowcase.test.tsx`
```tsx
import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { AppShowcase } from './AppShowcase'

describe('AppShowcase', () => {
  it('rend le titre et le CTA d’installation', () => {
    renderWithIntl(<AppShowcase />)
    expect(screen.getByText(/dans ta poche/i)).toBeInTheDocument()
    const cta = screen.getByRole('link', { name: /installer l'app/i })
    expect(cta).toHaveAttribute('href', expect.stringContaining('/app'))
  })
})
```

- [ ] **Step 2 — run (échec) :** `npx jest src/components/home/AppShowcase.test.tsx` → FAIL.

- [ ] **Step 3 — implémenter :** `src/components/home/AppShowcase.tsx`
```tsx
'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Dumbbell, Apple, TrendingUp, Bot, WifiOff, ArrowRight, Smartphone } from 'lucide-react'
import { ActivityRings } from '@/components/dashboard/smartwatch/ActivityRings'

const FEATURE_ICONS = [Dumbbell, Apple, TrendingUp, Bot, WifiOff]

export function AppShowcase() {
  const t = useTranslations('appShowcase')
  const features = t.raw('features') as string[]
  const rings = [
    { value: 8420, max: 10000, color: '#FF4500', label: 'Pas', unit: 'pas' },
    { value: 612, max: 700, color: '#A3FF00', label: 'Calories', unit: 'kcal' },
    { value: 47, max: 60, color: '#2563EB', label: 'Minutes', unit: 'min' },
  ]
  return (
    <section className="px-6 py-20 bg-sport-dark overflow-hidden" aria-label={t('title')}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-sport-orange bg-sport-orange/10 border border-sport-orange/20 rounded-full px-3 py-1">
            <Smartphone size={12} aria-hidden="true" /> {t('badge')}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-4">{t('title')}</h2>
          <p className="text-sport-gray text-sm mt-3 max-w-md">{t('subtitle')}</p>
          <ul className="mt-6 space-y-3">
            {features.map((f, i) => {
              const Icon = FEATURE_ICONS[i] ?? Dumbbell
              return (
                <li key={f} className="flex items-center gap-3 text-sm text-white">
                  <span className="w-8 h-8 shrink-0 rounded-lg bg-sport-orange/10 border border-sport-orange/20 flex items-center justify-center">
                    <Icon size={15} className="text-sport-orange" aria-hidden="true" />
                  </span>
                  {f}
                </li>
              )
            })}
          </ul>
          <Link href="/app" className="inline-flex items-center gap-2 mt-8 bg-sport-orange text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-orange-600 transition-all">
            {t('cta')} <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30, rotate: 2 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="flex justify-center">
          <div className="relative w-[270px] rounded-[2.5rem] border-[10px] border-sport-border bg-sport-dark shadow-2xl shadow-sport-orange/10" style={{ aspectRatio: '9 / 19' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-sport-border rounded-b-2xl z-10" aria-hidden="true" />
            <div className="p-5 pt-8 h-full flex flex-col gap-4">
              <p className="text-white font-black text-sm tracking-wide">XENOTIF<span className="text-sport-orange text-[0.6em] align-super">®</span></p>
              <div className="flex justify-center"><ActivityRings rings={rings} size={130} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-sport-card border border-sport-border rounded-xl p-2.5">
                  <p className="text-lg font-black text-white">5</p>
                  <p className="text-[9px] text-sport-gray">{t('mockSessions')}</p>
                </div>
                <div className="bg-sport-card border border-sport-border rounded-xl p-2.5">
                  <p className="text-lg font-black text-sport-orange">920 XP</p>
                  <p className="text-[9px] text-sport-gray">{t('mockLevel')}</p>
                </div>
              </div>
              <div className="bg-sport-card border border-sport-border rounded-xl p-3 mt-auto">
                <div className="flex justify-between text-[9px] text-sport-gray mb-1"><span>{t('mockProgress')}</span><span className="text-sport-orange font-bold">72%</span></div>
                <div className="w-full bg-sport-dark rounded-full h-1.5"><div className="bg-sport-orange h-1.5 rounded-full" style={{ width: '72%' }} /></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4 — intégrer :** dans `src/app/[locale]/page.tsx`, importer `import { AppShowcase } from '@/components/home/AppShowcase'` et l'insérer **après `<IntensityLevels />`**.

- [ ] **Step 5 — run :** `npx jest src/components/home/AppShowcase.test.tsx` → PASS.

- [ ] **Step 6 — commit :**
```bash
git add src/components/home/AppShowcase.tsx src/components/home/AppShowcase.test.tsx "src/app/[locale]/page.tsx"
git commit -m "feat(phase3): section App showcase (mockup + install PWA) (#3)"
```

---

## Task 3 : DevicesSync

**Files:** Create `src/components/home/DevicesSync.tsx`, `src/components/home/DevicesSync.test.tsx` ; Modify `src/app/[locale]/page.tsx`.

- [ ] **Step 1 — test (échoue) :** `src/components/home/DevicesSync.test.tsx`
```tsx
import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { DevicesSync } from './DevicesSync'

describe('DevicesSync', () => {
  it('rend le titre, une métrique et une marque « bientôt » sans Fitbit', () => {
    renderWithIntl(<DevicesSync />)
    expect(screen.getByText(/synchronise tes performances/i)).toBeInTheDocument()
    expect(screen.getByText(/fréquence cardiaque/i)).toBeInTheDocument()
    expect(screen.getByText(/garmin/i)).toBeInTheDocument()
    expect(screen.queryByText(/fitbit/i)).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2 — run (échec) :** `npx jest src/components/home/DevicesSync.test.tsx` → FAIL.

- [ ] **Step 3 — implémenter :** `src/components/home/DevicesSync.tsx`
```tsx
'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Heart, Flame, Footprints, Moon, Activity, Watch } from 'lucide-react'

const METRIC_ICONS = [Heart, Flame, Footprints, Moon, Activity]
const DEVICES = ['Apple Watch', 'Garmin', 'Samsung Health', 'Google Health Connect']

export function DevicesSync() {
  const t = useTranslations('devicesSync')
  const metrics = t.raw('metrics') as string[]
  return (
    <section className="px-6 py-20 bg-sport-card border-y border-sport-border" aria-label={t('title')}>
      <motion.div className="max-w-5xl mx-auto" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-white">{t('title')}</h2>
          <p className="text-sport-gray text-sm mt-3 max-w-xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="bg-sport-dark border border-sport-border rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" /> {t('liveBadge')}
            </span>
            <span className="text-xs text-sport-gray">{t('liveSource')}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {metrics.map((m, i) => {
              const Icon = METRIC_ICONS[i] ?? Activity
              return (
                <div key={m} className="flex flex-col items-center text-center gap-2">
                  <span className="w-11 h-11 rounded-xl bg-sport-orange/10 border border-sport-orange/20 flex items-center justify-center">
                    <Icon size={18} className="text-sport-orange" aria-hidden="true" />
                  </span>
                  <span className="text-[11px] font-bold text-white leading-tight">{m}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-sport-gray text-center mb-4">{t('soonTitle')}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {DEVICES.map(d => (
              <div key={d} className="flex items-center gap-2.5 bg-sport-dark border border-sport-border rounded-xl px-4 py-3">
                <Watch size={16} className="text-sport-gray shrink-0" aria-hidden="true" />
                <span className="text-xs font-bold text-white flex-1">{d}</span>
                <span className="text-[9px] font-black uppercase text-sport-orange bg-sport-orange/10 rounded px-1.5 py-0.5">{t('soonTag')}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 4 — intégrer :** dans `src/app/[locale]/page.tsx`, importer `import { DevicesSync } from '@/components/home/DevicesSync'` et l'insérer **après `<AppShowcase />`** (donc avant `<Pricing />`).

- [ ] **Step 5 — run :** `npx jest src/components/home/DevicesSync.test.tsx` → PASS.

- [ ] **Step 6 — commit :**
```bash
git add src/components/home/DevicesSync.tsx src/components/home/DevicesSync.test.tsx "src/app/[locale]/page.tsx"
git commit -m "feat(phase3): section objets connectés (réel + bientôt, sans Fitbit) (#4)"
```

---

## Task 4 : Vérification finale
- [ ] **Step 1 :** `npx jest` → tous verts.
- [ ] **Step 2 :** `npx tsc --noEmit` → OK.
- [ ] **Step 3 :** `npx eslint` sur les fichiers créés/modifiés → 0 erreur.
- [ ] **Step 4 :** JSON fr/en/de valides.
- [ ] **Step 5 :** skill `superpowers:finishing-a-development-branch` → PR, merge, déploiement, **vérif live** (accueil : section app avec mockup + CTA « Installer l'app » → /app ; section objets connectés « En direct » + « Bientôt » sans Fitbit).

---

## Self-Review (couverture spec)
- Livrable 1 (AppShowcase) → Task 2. ✅
- Livrable 2 (DevicesSync) → Task 3. ✅
- Intégration accueil (après IntensityLevels, avant Pricing) → Tasks 2, 3. ✅
- i18n → Task 1. ✅
- Tests → Tasks 2, 3 + Task 4. ✅
- Hors périmètre (pas de synchro réelle, pas de stores, pas de Fitbit). ✅

Cohérence : `appShowcase.*`/`devicesSync.*` définis (Task 1) avant usage ; `ActivityRings` props `{ rings, size }` respectées ; `DEVICES` sans Fitbit (testé).
