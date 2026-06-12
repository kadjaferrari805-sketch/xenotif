# Phase 1 « Montrer la valeur » — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** Rendre la valeur de l'abonnement visible sur la surface publique (aperçu démo de l'espace, démo Coach IA, bandeau confiance) et purger les statistiques inventées, pour augmenter la conversion.

**Architecture :** Tout est public + présentationnel (SSG, aucune dépendance auth/DB). Données démo centralisées dans `src/lib/preview-data.ts`. Réutilise les composants présentationnels existants (`ActivityRings`, `WeeklyChart`). Animations via Framer Motion (déjà utilisé), `prefers-reduced-motion` respecté.

**Tech Stack :** Next 16 App Router, next-intl (fr/en/de), Tailwind v4, Framer Motion, Jest + @testing-library/react.

**Spec :** `docs/superpowers/specs/2026-06-12-phase1-montrer-la-valeur-design.md`. **AGENTS.md :** suivre les patterns existants ; pas de nouvelle API Next exotique.

---

## File Structure
| Fichier | Responsabilité | Action |
|---|---|---|
| `src/components/home/TrustRow.tsx` | bandeau confiance sous le Hero | Créer |
| `src/components/home/CoachDemo.tsx` | démo Coach IA scriptée | Créer |
| `src/lib/preview-data.ts` | données démo (athlète Alex) | Créer |
| `src/components/preview/PreviewWeightChart.tsx` | sparkline poids | Créer |
| `src/components/preview/PreviewNutrition.tsx` | macros nutrition | Créer |
| `src/components/preview/PreviewDashboard.tsx` | assemblage de l'aperçu | Créer |
| `src/app/[locale]/dashboard-preview/page.tsx` | page publique + metadata | Créer |
| `src/components/home/ProofBar.tsx` | tuiles stats honnêtes | Modifier |
| `src/app/[locale]/page.tsx` | insérer TrustRow + CoachDemo | Modifier |
| `src/components/layout/Nav.tsx` | lien aperçu | Modifier |
| `src/components/layout/Footer.tsx` | lien aperçu | Modifier |
| `src/app/sitemap.ts` | entrée /dashboard-preview | Modifier |
| `messages/{fr,en,de}.json` | namespaces `trust`, `coachDemo`, `dashboardPreview` + correction stats | Modifier |
| tests | TrustRow, CoachDemo, PreviewDashboard, garde-fou stats | Créer |

---

## Task 1 : Bandeau confiance (TrustRow) — quick win

**Files:** Create `src/components/home/TrustRow.tsx`, `src/components/home/TrustRow.test.tsx` ; Modify `src/app/[locale]/page.tsx`, `messages/{fr,en,de}.json`.

- [ ] **Step 1 — i18n :** ajouter le namespace `trust` dans les 3 messages.

`messages/fr.json` (à la racine de l'objet) :
```json
"trust": {
  "securePayment": "Paiement sécurisé",
  "securePaymentSub": "Stripe · 3D Secure",
  "guarantee": "Garantie 30 jours",
  "guaranteeSub": "Satisfait ou remboursé",
  "cancel": "Annulation en 1 clic",
  "cancelSub": "Sans engagement",
  "support": "Support réactif",
  "supportSub": "Une équipe à l'écoute"
}
```
`messages/en.json` :
```json
"trust": {
  "securePayment": "Secure payment",
  "securePaymentSub": "Stripe · 3D Secure",
  "guarantee": "30-day guarantee",
  "guaranteeSub": "Money-back",
  "cancel": "Cancel in 1 click",
  "cancelSub": "No commitment",
  "support": "Responsive support",
  "supportSub": "A team that listens"
}
```
`messages/de.json` :
```json
"trust": {
  "securePayment": "Sichere Zahlung",
  "securePaymentSub": "Stripe · 3D Secure",
  "guarantee": "30 Tage Garantie",
  "guaranteeSub": "Geld-zurück",
  "cancel": "1-Klick-Kündigung",
  "cancelSub": "Ohne Bindung",
  "support": "Schneller Support",
  "supportSub": "Ein Team, das zuhört"
}
```

- [ ] **Step 2 — test (échoue) :** `src/components/home/TrustRow.test.tsx`
```tsx
import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { TrustRow } from './TrustRow'

describe('TrustRow', () => {
  it('rend les 4 garanties de confiance', () => {
    renderWithIntl(<TrustRow />)
    expect(screen.getByText('Paiement sécurisé')).toBeInTheDocument()
    expect(screen.getByText('Garantie 30 jours')).toBeInTheDocument()
    expect(screen.getByText('Annulation en 1 clic')).toBeInTheDocument()
    expect(screen.getByText('Support réactif')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3 — run (échec attendu) :** `npx jest src/components/home/TrustRow.test.tsx` → FAIL (module introuvable).

- [ ] **Step 4 — implémenter :** `src/components/home/TrustRow.tsx`
```tsx
import { useTranslations } from 'next-intl'
import { ShieldCheck, Lock, XCircle, MessageCircle } from 'lucide-react'

export function TrustRow() {
  const t = useTranslations('trust')
  const items = [
    { Icon: Lock, label: t('securePayment'), sub: t('securePaymentSub') },
    { Icon: ShieldCheck, label: t('guarantee'), sub: t('guaranteeSub') },
    { Icon: XCircle, label: t('cancel'), sub: t('cancelSub') },
    { Icon: MessageCircle, label: t('support'), sub: t('supportSub') },
  ]
  return (
    <section aria-label={t('securePayment')} className="bg-sport-dark border-b border-sport-border px-6 py-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(({ Icon, label, sub }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-sport-orange/10 border border-sport-orange/20 flex items-center justify-center">
              <Icon size={18} className="text-sport-orange" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-white leading-tight">{label}</p>
              <p className="text-[11px] text-sport-gray leading-tight">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```
(Composant serveur : pas de `'use client'`, pas d'état.)

- [ ] **Step 5 — intégrer :** dans `src/app/[locale]/page.tsx`, importer `import { TrustRow } from '@/components/home/TrustRow'` et l'insérer entre `<Hero />` et `<MarqueeStrip />`.

- [ ] **Step 6 — run :** `npx jest src/components/home/TrustRow.test.tsx` → PASS.

- [ ] **Step 7 — commit :**
```bash
git add src/components/home/TrustRow.tsx src/components/home/TrustRow.test.tsx "src/app/[locale]/page.tsx" messages/fr.json messages/en.json messages/de.json
git commit -m "feat(conversion): bandeau confiance sous le Hero (#13)"
```

---

## Task 2 : Honnêteté des stats (#8)

**Files:** Modify `src/components/home/ProofBar.tsx`, `messages/{fr,en,de}.json` (`home.proof.stats`, `home.features.items[].stats`, `home.metaDescription`) ; Create `src/components/home/ProofBar.honesty.test.tsx`.

- [ ] **Step 1 — test garde-fou (échoue si chiffres inventés présents) :** `src/components/home/ProofBar.honesty.test.tsx`
```tsx
import fr from '../../../messages/fr.json'

describe('Honnêteté des statistiques', () => {
  const blob = JSON.stringify(fr)
  it('ne contient plus de comptes d’utilisateurs inventés', () => {
    expect(blob).not.toContain('12 000+ athlètes')
    expect(blob).not.toContain('12 000+')
    expect(blob).not.toMatch(/\+\s?\d[\d ]*\s?(coureurs|nageurs|boxeurs|cyclistes|pratiquants)/)
    expect(blob).not.toContain('3 200+ avis')
  })
})
```

- [ ] **Step 2 — run (échec attendu) :** `npx jest src/components/home/ProofBar.honesty.test.tsx` → FAIL.

- [ ] **Step 3 — ProofBar : tuiles vérifiables.** Remplacer le tableau `STAT_STYLE` (haut de `src/components/home/ProofBar.tsx`) par :
```tsx
import { Layers, Bot, ShieldCheck, Lock } from 'lucide-react'

// Stats 100 % vérifiables (aucun compte d'utilisateurs inventé).
const STAT_STYLE = [
  { Icon: Layers,      end: 10, suffix: '',  color: 'text-sport-lime',   bg: 'bg-sport-lime/10 border-sport-lime/20' },
  { Icon: Bot,         end: 24, suffix: '/7', color: 'text-sport-blue',  bg: 'bg-sport-blue/10 border-sport-blue/20' },
  { Icon: ShieldCheck, end: 30, suffix: 'j',  color: 'text-sport-orange',bg: 'bg-sport-orange/10 border-sport-orange/20' },
  { Icon: Lock,        end: 100, suffix: '%', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
]
```
Et remplacer l'import d'icônes en tête (`import { Users, BookOpen, Layers, Star } ...`) par `import { Layers, Bot, ShieldCheck, Lock } from 'lucide-react'`.

- [ ] **Step 4 — labels ProofBar (i18n).** `messages/fr.json` → `home.proof.stats` :
```json
"stats": [
  { "label": "Disciplines", "sublabel": "sport complet" },
  { "label": "Coaching IA", "sublabel": "disponible 24/7" },
  { "label": "Garantie", "sublabel": "satisfait ou remboursé" },
  { "label": "Paiement sécurisé", "sublabel": "Stripe · 3D Secure" }
]
```
`messages/en.json` → `home.proof.stats` :
```json
"stats": [
  { "label": "Disciplines", "sublabel": "complete training" },
  { "label": "AI coaching", "sublabel": "available 24/7" },
  { "label": "Guarantee", "sublabel": "money-back" },
  { "label": "Secure payment", "sublabel": "Stripe · 3D Secure" }
]
```
`messages/de.json` → `home.proof.stats` :
```json
"stats": [
  { "label": "Disziplinen", "sublabel": "komplettes Training" },
  { "label": "KI-Coaching", "sublabel": "rund um die Uhr" },
  { "label": "Garantie", "sublabel": "Geld-zurück" },
  { "label": "Sichere Zahlung", "sublabel": "Stripe · 3D Secure" }
]
```

- [ ] **Step 5 — retirer les headcounts des cartes disciplines.** Dans `home.features.items` des 3 messages, supprimer le **1ᵉʳ élément** (le compte « +N … ») de chaque tableau `stats`, en gardant les 2 faits de contenu. Exemple fr — `Running & Cardio` : `["+4 200 coureurs","120+ plans","12 semaines moy."]` → `["120+ plans","12 semaines moy."]`. Faire de même pour les 10 items (Musculation, HIIT, Cyclisme, Natation, CrossFit, Yoga, Boxe, Stretching, Nutrition) dans fr/en/de.

- [ ] **Step 6 — metaDescription honnête.** Dans les 3 messages, `home.metaDescription` : retirer « Rejoins 12 000+ athlètes… ».
  - fr : `"La plateforme fitness premium — 10 disciplines, coaching IA personnalisé, programmes guidés, garantie 30 jours. Transforme ton corps avec Xenotif®."`
  - en : `"The premium fitness platform — 10 disciplines, personalized AI coaching, guided programs, 30-day guarantee. Transform your body with Xenotif®."`
  - de : `"Die Premium-Fitnessplattform — 10 Disziplinen, personalisiertes KI-Coaching, geführte Programme, 30 Tage Garantie. Verwandle deinen Körper mit Xenotif®."`

- [ ] **Step 7 — run garde-fou + ProofBar existant :** `npx jest src/components/home/ProofBar.honesty.test.tsx src/components/home/ProofBar.test.tsx` → PASS. (Si `ProofBar.test.tsx` asserte d'anciens libellés, mettre à jour ses assertions vers les nouveaux.)

- [ ] **Step 8 — JSON valides :** `node -e "for(const f of ['fr','en','de'])JSON.parse(require('fs').readFileSync('messages/'+f+'.json','utf8'));console.log('JSON OK')"`.

- [ ] **Step 9 — commit :**
```bash
git add src/components/home/ProofBar.tsx src/components/home/ProofBar.honesty.test.tsx messages/fr.json messages/en.json messages/de.json
git commit -m "fix(trust): retire les stats d'utilisateurs inventées, garde le vérifiable (#8)"
```

---

## Task 3 : Démo Coach IA scriptée

**Files:** Create `src/components/home/CoachDemo.tsx`, `src/components/home/CoachDemo.test.tsx` ; Modify `src/app/[locale]/page.tsx`, `messages/{fr,en,de}.json` (namespace `coachDemo`).

- [ ] **Step 1 — i18n :** namespace `coachDemo`. `messages/fr.json` :
```json
"coachDemo": {
  "badge": "Coach IA",
  "title": "Découvrez votre Coach IA",
  "subtitle": "Un coach personnel qui adapte vos séances, votre nutrition et votre progression — en temps réel.",
  "replay": "Rejouer la démo",
  "you": "Vous",
  "coach": "Coach IA",
  "ctaTry": "Essayer mon coach",
  "intro": "Salut 👋 Je suis ton coach IA. Quel est ton objectif aujourd'hui ?",
  "chips": [
    { "q": "Je veux perdre du poids", "a": "Parfait. Je te propose 3 séances HIIT/semaine (20–30 min) + 2 séances de renforcement, avec un léger déficit calorique. Je règle l'intensité selon ta forme du jour." },
    { "q": "Que manger après l'effort ?", "a": "Dans les 30 min : ~25 g de protéines + glucides (ex. shaker whey + banane). Je calcule tes macros selon ton poids et ton objectif." },
    { "q": "Je n'ai pas progressé cette semaine", "a": "Pas d'inquiétude. J'ajuste : +5 % de charge sur tes exercices clés et une séance de récupération active. La progression revient sur 2 semaines." },
    { "q": "Adapte mon programme", "a": "C'est fait : j'ai réorganisé ta semaine autour de tes 3 créneaux et de ta récupération. Tu peux la voir dans ton espace." }
  ]
}
```
`messages/en.json` :
```json
"coachDemo": {
  "badge": "AI Coach",
  "title": "Meet your AI Coach",
  "subtitle": "A personal coach that adapts your workouts, nutrition and progress — in real time.",
  "replay": "Replay demo",
  "you": "You",
  "coach": "AI Coach",
  "ctaTry": "Try my coach",
  "intro": "Hi 👋 I'm your AI coach. What's your goal today?",
  "chips": [
    { "q": "I want to lose weight", "a": "Great. I suggest 3 HIIT sessions/week (20–30 min) + 2 strength sessions, with a slight calorie deficit. I tune intensity to how you feel each day." },
    { "q": "What should I eat after training?", "a": "Within 30 min: ~25 g protein + carbs (e.g. whey shake + banana). I compute your macros from your weight and goal." },
    { "q": "I didn't progress this week", "a": "No worries. I'm adjusting: +5% load on your key lifts and one active-recovery session. Progress returns within 2 weeks." },
    { "q": "Adapt my program", "a": "Done: I reorganized your week around your 3 slots and recovery. You can see it in your space." }
  ]
}
```
`messages/de.json` :
```json
"coachDemo": {
  "badge": "KI-Coach",
  "title": "Entdecke deinen KI-Coach",
  "subtitle": "Ein persönlicher Coach, der Training, Ernährung und Fortschritt in Echtzeit anpasst.",
  "replay": "Demo erneut",
  "you": "Du",
  "coach": "KI-Coach",
  "ctaTry": "Coach testen",
  "intro": "Hallo 👋 Ich bin dein KI-Coach. Was ist heute dein Ziel?",
  "chips": [
    { "q": "Ich will abnehmen", "a": "Perfekt. Ich schlage 3 HIIT-Einheiten/Woche (20–30 Min) + 2 Krafteinheiten mit leichtem Kaloriendefizit vor. Die Intensität passe ich an deine Tagesform an." },
    { "q": "Was nach dem Training essen?", "a": "Innerhalb von 30 Min: ~25 g Protein + Kohlenhydrate (z. B. Whey-Shake + Banane). Ich berechne deine Makros nach Gewicht und Ziel." },
    { "q": "Diese Woche kein Fortschritt", "a": "Keine Sorge. Ich passe an: +5 % Last bei deinen Hauptübungen und eine aktive Erholungseinheit. Der Fortschritt kommt in 2 Wochen zurück." },
    { "q": "Pass mein Programm an", "a": "Erledigt: Ich habe deine Woche um deine 3 Slots und die Erholung herum neu organisiert. Du siehst sie in deinem Bereich." }
  ]
}
```

- [ ] **Step 2 — test (échoue) :** `src/components/home/CoachDemo.test.tsx`
```tsx
import { screen, fireEvent } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { CoachDemo } from './CoachDemo'

describe('CoachDemo', () => {
  it('affiche le titre et l’intro du coach', () => {
    renderWithIntl(<CoachDemo />)
    expect(screen.getByText('Découvrez votre Coach IA')).toBeInTheDocument()
    expect(screen.getByText(/je suis ton coach ia/i)).toBeInTheDocument()
  })

  it('un clic sur une question affiche la réponse préparée', () => {
    renderWithIntl(<CoachDemo />)
    fireEvent.click(screen.getByRole('button', { name: /perdre du poids/i }))
    expect(screen.getByText(/3 séances HIIT/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 3 — run (échec attendu) :** `npx jest src/components/home/CoachDemo.test.tsx` → FAIL.

- [ ] **Step 4 — implémenter :** `src/components/home/CoachDemo.tsx`
```tsx
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Bot, User, Sparkles, RotateCcw, ArrowRight } from 'lucide-react'

type Msg = { role: 'user' | 'coach'; text: string }

export function CoachDemo() {
  const t = useTranslations('coachDemo')
  const chips = t.raw('chips') as { q: string; a: string }[]
  const [messages, setMessages] = useState<Msg[]>([{ role: 'coach', text: t('intro') }])
  const [asked, setAsked] = useState<number[]>([])

  function ask(i: number) {
    if (asked.includes(i)) return
    setAsked(prev => [...prev, i])
    setMessages(prev => [...prev, { role: 'user', text: chips[i].q }, { role: 'coach', text: chips[i].a }])
  }
  function replay() {
    setAsked([])
    setMessages([{ role: 'coach', text: t('intro') }])
  }

  return (
    <section className="px-6 py-20 bg-sport-dark" aria-label={t('title')}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-sport-orange bg-sport-orange/10 border border-sport-orange/20 rounded-full px-3 py-1">
            <Sparkles size={12} aria-hidden="true" /> {t('badge')}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-4">{t('title')}</h2>
          <p className="text-sport-gray text-sm mt-2 max-w-xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="bg-sport-card border border-sport-border rounded-2xl p-4 md:p-6">
          <div className="space-y-3 mb-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${m.role === 'coach' ? 'bg-sport-orange/15' : 'bg-white/10'}`}>
                  {m.role === 'coach' ? <Bot size={15} className="text-sport-orange" /> : <User size={15} className="text-white" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === 'coach' ? 'bg-sport-dark text-white' : 'bg-sport-orange text-white'}`}>
                  <span className="block text-[10px] font-bold uppercase tracking-wider opacity-60 mb-0.5">{m.role === 'coach' ? t('coach') : t('you')}</span>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {chips.map((c, i) => (
              !asked.includes(i) && (
                <button key={i} onClick={() => ask(i)}
                  className="text-xs font-bold border border-sport-border text-sport-gray hover:text-white hover:border-sport-orange rounded-full px-3 py-2 transition-all">
                  {c.q}
                </button>
              )
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <button onClick={replay} className="inline-flex items-center gap-1.5 text-xs font-bold text-sport-gray hover:text-white transition-colors">
            <RotateCcw size={13} aria-hidden="true" /> {t('replay')}
          </button>
          <Link href="/auth/signup?plan=pro" className="inline-flex items-center gap-2 bg-sport-orange text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-orange-600 transition-all">
            {t('ctaTry')} <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
```
(YAGNI : pas d'effet « frappe » temporisé — affichage immédiat au clic, donc testable et `prefers-reduced-motion`-safe d'office. Le « train d'écrire » pourra être ajouté en option ultérieurement.)

- [ ] **Step 5 — intégrer :** dans `src/app/[locale]/page.tsx`, importer `import { CoachDemo } from '@/components/home/CoachDemo'` et l'insérer après `<HowItWorks />`.

- [ ] **Step 6 — run :** `npx jest src/components/home/CoachDemo.test.tsx` → PASS.

- [ ] **Step 7 — commit :**
```bash
git add src/components/home/CoachDemo.tsx src/components/home/CoachDemo.test.tsx "src/app/[locale]/page.tsx" messages/fr.json messages/en.json messages/de.json
git commit -m "feat(conversion): section démo Coach IA scriptée (#2)"
```

---

## Task 4 : Données démo de l'aperçu

**Files:** Create `src/lib/preview-data.ts`.

- [ ] **Step 1 — implémenter :** `src/lib/preview-data.ts`
```ts
// Données de DÉMONSTRATION (athlète fictif « Alex ») pour /dashboard-preview.
// Aucune donnée réelle ; uniquement présentationnel.
export const PREVIEW = {
  name: 'Alex',
  rings: [
    { value: 8420, max: 10000, color: '#FF4500', label: 'Pas', unit: 'pas' },
    { value: 612, max: 700, color: '#A3FF00', label: 'Calories', unit: 'kcal' },
    { value: 47, max: 60, color: '#2563EB', label: 'Minutes actives', unit: 'min' },
  ],
  weekly: [
    { day: 'Lun', steps: 7200, calories: 480, activeMinutes: 38, heartRate: 128 },
    { day: 'Mar', steps: 10300, calories: 690, activeMinutes: 61, heartRate: 142 },
    { day: 'Mer', steps: 5400, calories: 360, activeMinutes: 25, heartRate: 0 },
    { day: 'Jeu', steps: 9100, calories: 600, activeMinutes: 52, heartRate: 138 },
    { day: 'Ven', steps: 11800, calories: 760, activeMinutes: 68, heartRate: 150 },
    { day: 'Sam', steps: 6300, calories: 410, activeMinutes: 30, heartRate: 120 },
    { day: 'Dim', steps: 8420, calories: 612, activeMinutes: 47, heartRate: 132 },
  ],
  stats: { sessionsWeek: 5, hours: 28, activeDays: 6, badges: 4 },
  disciplines: [
    { name: 'Musculation', pct: 72 },
    { name: 'Running & Cardio', pct: 54 },
    { name: 'HIIT', pct: 38 },
  ],
  weight: { unit: 'kg', points: [82.4, 82.0, 81.6, 81.1, 80.7, 80.2, 79.8], startLabel: 'il y a 7 sem.', goal: 78 },
  nutrition: { calories: 2180, target: 2300, protein: 148, carbs: 210, fat: 64 },
  badges: [
    { icon: '🔥', label: '7 jours' },
    { icon: '💪', label: '50 séances' },
    { icon: '🏃', label: '100 km' },
    { icon: '⚡', label: 'HIIT x20' },
  ],
} as const
```

- [ ] **Step 2 — typecheck :** `npx tsc --noEmit` → aucune erreur.

- [ ] **Step 3 — commit :**
```bash
git add src/lib/preview-data.ts
git commit -m "feat(preview): données démo de l'espace (athlète Alex)"
```

---

## Task 5 : Sous-composants de l'aperçu (poids + nutrition)

**Files:** Create `src/components/preview/PreviewWeightChart.tsx`, `src/components/preview/PreviewNutrition.tsx`.

- [ ] **Step 1 — PreviewWeightChart :** `src/components/preview/PreviewWeightChart.tsx`
```tsx
// Sparkline présentationnel de l'évolution du poids (données démo).
export function PreviewWeightChart({ points, unit, goal }: { points: number[]; unit: string; goal: number }) {
  const w = 280, h = 80, pad = 6
  const min = Math.min(...points, goal) - 0.5
  const max = Math.max(...points) + 0.5
  const x = (i: number) => pad + (i * (w - 2 * pad)) / (points.length - 1)
  const y = (v: number) => pad + (1 - (v - min) / (max - min)) * (h - 2 * pad)
  const d = points.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
  const last = points[points.length - 1]
  const delta = (last - points[0]).toFixed(1)
  return (
    <div className="bg-sport-card border border-sport-border rounded-2xl p-5">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-sm font-black text-white">Suivi du poids</h3>
        <span className="text-xs font-bold text-emerald-400">{delta} {unit}</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Évolution du poids">
        <path d={d} fill="none" stroke="#FF4500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={x(points.length - 1)} cy={y(last)} r="3.5" fill="#FF4500" />
      </svg>
      <div className="flex items-center justify-between mt-2 text-[11px] text-sport-gray">
        <span>{last} {unit}</span>
        <span>Objectif {goal} {unit}</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2 — PreviewNutrition :** `src/components/preview/PreviewNutrition.tsx`
```tsx
// Snapshot nutrition présentationnel (macros démo).
const MACROS = [
  { key: 'protein' as const, label: 'Protéines', color: 'bg-sport-orange', max: 180 },
  { key: 'carbs' as const,   label: 'Glucides',  color: 'bg-sport-blue',   max: 280 },
  { key: 'fat' as const,     label: 'Lipides',   color: 'bg-sport-lime',   max: 90 },
]
export function PreviewNutrition({ calories, target, protein, carbs, fat }: { calories: number; target: number; protein: number; carbs: number; fat: number }) {
  const vals = { protein, carbs, fat }
  return (
    <div className="bg-sport-card border border-sport-border rounded-2xl p-5">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-sm font-black text-white">Nutrition du jour</h3>
        <span className="text-xs text-sport-gray"><strong className="text-white">{calories}</strong> / {target} kcal</span>
      </div>
      <div className="space-y-3">
        {MACROS.map(m => (
          <div key={m.key}>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-sport-gray">{m.label}</span>
              <span className="text-white font-bold">{vals[m.key]} g</span>
            </div>
            <div className="w-full bg-sport-dark rounded-full h-1.5">
              <div className={`${m.color} h-1.5 rounded-full`} style={{ width: `${Math.min(100, (vals[m.key] / m.max) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3 — typecheck :** `npx tsc --noEmit` → OK.

- [ ] **Step 4 — commit :**
```bash
git add src/components/preview/PreviewWeightChart.tsx src/components/preview/PreviewNutrition.tsx
git commit -m "feat(preview): sous-composants poids + nutrition"
```

---

## Task 6 : Assemblage PreviewDashboard

**Files:** Create `src/components/preview/PreviewDashboard.tsx`, `src/components/preview/PreviewDashboard.test.tsx`.

- [ ] **Step 1 — test (échoue) :** `src/components/preview/PreviewDashboard.test.tsx`
```tsx
import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { PreviewDashboard } from './PreviewDashboard'

describe('PreviewDashboard', () => {
  it('affiche le badge « aperçu » et le prénom démo', () => {
    const { container } = renderWithIntl(<PreviewDashboard />)
    expect(screen.getByText(/aperçu/i)).toBeInTheDocument()
    expect(screen.getByText(/Alex/)).toBeInTheDocument()
    // au moins une barre de progression et un svg d'anneaux
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2 — run (échec attendu) :** `npx jest src/components/preview/PreviewDashboard.test.tsx` → FAIL.

- [ ] **Step 3 — implémenter :** `src/components/preview/PreviewDashboard.tsx`
```tsx
'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Flame, Clock, TrendingUp, Award, ArrowRight, Bot, Eye } from 'lucide-react'
import { ActivityRings } from '@/components/dashboard/smartwatch/ActivityRings'
import { WeeklyChart } from '@/components/dashboard/smartwatch/WeeklyChart'
import { PreviewWeightChart } from './PreviewWeightChart'
import { PreviewNutrition } from './PreviewNutrition'
import { PREVIEW } from '@/lib/preview-data'

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
}

export function PreviewDashboard() {
  const t = useTranslations('dashboardPreview')
  const stats = [
    { Icon: Flame, label: t('statSessions'), value: PREVIEW.stats.sessionsWeek, color: 'text-sport-orange' },
    { Icon: Clock, label: t('statHours'), value: `${PREVIEW.stats.hours}h`, color: 'text-sport-blue' },
    { Icon: TrendingUp, label: t('statActiveDays'), value: PREVIEW.stats.activeDays, color: 'text-emerald-400' },
    { Icon: Award, label: t('statBadges'), value: PREVIEW.stats.badges, color: 'text-yellow-400' },
  ]
  return (
    <div className="min-h-screen bg-sport-dark text-white">
      {/* Bannière aperçu */}
      <div className="bg-sport-orange/10 border-b border-sport-orange/30 px-6 py-2.5 text-center">
        <span className="inline-flex items-center gap-2 text-xs font-bold text-sport-orange">
          <Eye size={13} aria-hidden="true" /> {t('demoBanner')}
        </span>
      </div>

      <div className="max-w-5xl mx-auto p-6 md:p-8 pb-20">
        {/* En-tête */}
        <motion.div {...reveal} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black">{t('greeting', { name: PREVIEW.name })}</h1>
          <p className="text-sport-gray text-sm mt-1">{t('subtitle')}</p>
        </motion.div>

        {/* Anneaux + graphe */}
        <motion.div {...reveal} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-sport-card border border-sport-border rounded-2xl p-6 flex items-center justify-center">
            <ActivityRings rings={PREVIEW.rings.map(r => ({ ...r }))} size={180} />
          </div>
          <div className="bg-sport-card border border-sport-border rounded-2xl p-6">
            <h3 className="text-sm font-black mb-4">{t('weekActivity')}</h3>
            <WeeklyChart data={PREVIEW.weekly.map(d => ({ ...d }))} metric="steps" color="#FF4500" />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div {...reveal} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(({ Icon, label, value, color }) => (
            <div key={label} className="bg-sport-card border border-sport-border rounded-xl p-4">
              <Icon size={18} className={`${color} mb-2`} aria-hidden="true" />
              <p className="text-2xl font-black">{value}</p>
              <p className="text-[11px] text-sport-gray mt-0.5 leading-tight">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Progression disciplines */}
        <motion.div {...reveal} className="bg-sport-card border border-sport-border rounded-2xl p-6 mb-8">
          <h3 className="text-sm font-black mb-5">{t('byDiscipline')}</h3>
          <div className="space-y-4">
            {PREVIEW.disciplines.map(d => (
              <div key={d.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold">{d.name}</span>
                  <span className="text-sport-orange font-bold">{d.pct}%</span>
                </div>
                <div className="w-full bg-sport-dark rounded-full h-2">
                  <div className="bg-sport-orange h-2 rounded-full" style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Poids + Nutrition */}
        <motion.div {...reveal} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <PreviewWeightChart points={[...PREVIEW.weight.points]} unit={PREVIEW.weight.unit} goal={PREVIEW.weight.goal} />
          <PreviewNutrition {...PREVIEW.nutrition} />
        </motion.div>

        {/* Badges */}
        <motion.div {...reveal} className="bg-sport-card border border-sport-border rounded-2xl p-6 mb-8">
          <h3 className="text-sm font-black mb-5">{t('badges')}</h3>
          <div className="grid grid-cols-4 gap-4">
            {PREVIEW.badges.map(b => (
              <div key={b.label} className="rounded-xl p-4 text-center bg-yellow-400/10 border border-yellow-400/30">
                <span className="text-3xl block mb-2">{b.icon}</span>
                <p className="text-[10px] font-black text-yellow-400 leading-tight">{b.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Teaser Coach IA + CTA */}
        <motion.div {...reveal} className="bg-gradient-to-br from-sport-orange/20 via-sport-card to-sport-card border border-sport-orange/30 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-sport-orange/15 border border-sport-orange/30 flex items-center justify-center mb-3">
            <Bot size={22} className="text-sport-orange" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-black">{t('ctaTitle')}</h3>
          <p className="text-sport-gray text-sm mt-1 mb-5 max-w-md mx-auto">{t('ctaSubtitle')}</p>
          <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-sport-orange text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-orange-600 transition-all">
            {t('ctaButton')} <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4 — i18n :** namespace `dashboardPreview`. `messages/fr.json` :
```json
"dashboardPreview": {
  "metaTitle": "Aperçu de ton espace membre",
  "metaDescription": "Découvre en aperçu ton futur espace XENOTIF® : progression, activité, suivi du poids, nutrition, badges et coach IA.",
  "demoBanner": "Aperçu — données de démonstration",
  "greeting": "Bonjour {name} 👋",
  "subtitle": "Voici un aperçu de ton espace membre.",
  "weekActivity": "Activité de la semaine",
  "statSessions": "Séances / semaine",
  "statHours": "Heures totales",
  "statActiveDays": "Jours actifs",
  "statBadges": "Badges",
  "byDiscipline": "Progression par discipline",
  "badges": "Badges débloqués",
  "ctaTitle": "Et bien plus avec ton Coach IA",
  "ctaSubtitle": "Programmes personnalisés, suivi en temps réel, nutrition adaptée. Crée ton compte gratuitement.",
  "ctaButton": "Créer mon compte gratuit"
}
```
`messages/en.json` :
```json
"dashboardPreview": {
  "metaTitle": "Preview your member space",
  "metaDescription": "Get a preview of your future XENOTIF® space: progress, activity, weight tracking, nutrition, badges and AI coach.",
  "demoBanner": "Preview — demo data",
  "greeting": "Hi {name} 👋",
  "subtitle": "Here's a preview of your member space.",
  "weekActivity": "This week's activity",
  "statSessions": "Sessions / week",
  "statHours": "Total hours",
  "statActiveDays": "Active days",
  "statBadges": "Badges",
  "byDiscipline": "Progress by discipline",
  "badges": "Unlocked badges",
  "ctaTitle": "And much more with your AI Coach",
  "ctaSubtitle": "Personalized programs, real-time tracking, adapted nutrition. Create your free account.",
  "ctaButton": "Create my free account"
}
```
`messages/de.json` :
```json
"dashboardPreview": {
  "metaTitle": "Vorschau deines Mitgliederbereichs",
  "metaDescription": "Eine Vorschau deines künftigen XENOTIF®-Bereichs: Fortschritt, Aktivität, Gewicht, Ernährung, Abzeichen und KI-Coach.",
  "demoBanner": "Vorschau — Demodaten",
  "greeting": "Hallo {name} 👋",
  "subtitle": "Hier ist eine Vorschau deines Mitgliederbereichs.",
  "weekActivity": "Aktivität dieser Woche",
  "statSessions": "Einheiten / Woche",
  "statHours": "Gesamtstunden",
  "statActiveDays": "Aktive Tage",
  "statBadges": "Abzeichen",
  "byDiscipline": "Fortschritt nach Disziplin",
  "badges": "Freigeschaltete Abzeichen",
  "ctaTitle": "Und viel mehr mit deinem KI-Coach",
  "ctaSubtitle": "Personalisierte Programme, Echtzeit-Tracking, angepasste Ernährung. Erstelle dein kostenloses Konto.",
  "ctaButton": "Kostenloses Konto erstellen"
}
```

- [ ] **Step 5 — run :** `npx jest src/components/preview/PreviewDashboard.test.tsx` → PASS.

- [ ] **Step 6 — commit :**
```bash
git add src/components/preview/PreviewDashboard.tsx src/components/preview/PreviewDashboard.test.tsx messages/fr.json messages/en.json messages/de.json
git commit -m "feat(preview): assemblage de l'aperçu de l'espace membre (#1)"
```

---

## Task 7 : Page publique `/dashboard-preview`

**Files:** Create `src/app/[locale]/dashboard-preview/page.tsx`.

- [ ] **Step 1 — implémenter :** `src/app/[locale]/dashboard-preview/page.tsx`
```tsx
import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { PreviewDashboard } from '@/components/preview/PreviewDashboard'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'dashboardPreview' })
  return { title: t('metaTitle'), description: t('metaDescription') }
}

export default async function DashboardPreviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <PreviewDashboard />
}
```

- [ ] **Step 2 — vérifier statut (post-déploiement / dev) :** la route doit répondre 200 et **ne pas** rediriger vers signin (page publique). `npx tsc --noEmit` → OK.

- [ ] **Step 3 — commit :**
```bash
git add "src/app/[locale]/dashboard-preview/page.tsx"
git commit -m "feat(preview): page publique /dashboard-preview (#1)"
```

---

## Task 8 : Maillage (Nav, Footer, sitemap)

**Files:** Modify `src/components/layout/Nav.tsx`, `src/components/layout/Footer.tsx`, `src/app/sitemap.ts`, `messages/{fr,en,de}.json`.

- [ ] **Step 1 — Nav :** dans `NAV_LINKS` (`src/components/layout/Nav.tsx`), ajouter après la ligne `programmes` :
```tsx
  { href: '/dashboard-preview', key: 'preview' },
```
Et ajouter la clé i18n `nav.preview` : fr « Aperçu », en « Preview », de « Vorschau » (dans le namespace utilisé par le Nav — vérifier le `useTranslations` du Nav, ajouter sous la même racine que les autres `nav.*`).

- [ ] **Step 2 — Footer :** ajouter un lien vers `/dashboard-preview` dans la section « programmes » du footer (tableau de liens correspondant) avec la clé `links.preview` (fr « Aperçu de l'espace », en « Space preview », de « Bereich-Vorschau »). Suivre la structure existante des listes de liens du Footer.

- [ ] **Step 3 — sitemap :** dans `src/app/sitemap.ts`, ajouter à `staticPaths` :
```ts
['/dashboard-preview', { changeFrequency: 'weekly', priority: 0.7 }],
```

- [ ] **Step 4 — run non-régression Nav/Footer :** `npx jest src/components/layout/Nav.test.tsx src/components/layout/Footer.test.tsx` → PASS (mettre à jour les assertions si elles comptent les liens).

- [ ] **Step 5 — commit :**
```bash
git add src/components/layout/Nav.tsx src/components/layout/Footer.tsx src/app/sitemap.ts messages/fr.json messages/en.json messages/de.json
git commit -m "feat(preview): maillage Nav + Footer + sitemap vers /dashboard-preview"
```

---

## Task 9 : Vérification finale

- [ ] **Step 1 — suite complète :** `npx jest` → tous verts.
- [ ] **Step 2 — typecheck :** `npx tsc --noEmit` → OK.
- [ ] **Step 3 — lint :** `npx eslint` sur les fichiers créés/modifiés → 0 erreur.
- [ ] **Step 4 — JSON :** valider fr/en/de (`JSON.parse`).
- [ ] **Step 5 — finaliser :** skill `superpowers:finishing-a-development-branch` → PR, merge, déploiement, **vérif live sur xenotif.com** (`/dashboard-preview` 200 + bandeau aperçu ; accueil avec TrustRow + CoachDemo ; plus de « 12 000+ athlètes » dans le HTML).

---

## Self-Review (couverture spec)
- §Livrable 1 (dashboard-preview) → Tasks 4,5,6,7. ✅
- §Livrable 2 (démo Coach IA) → Task 3. ✅
- §Livrable 3 (TrustRow) → Task 1. ✅
- §Livrable 4 (stats honnêtes) → Task 2. ✅
- §Intégration (Nav/Footer/sitemap/accueil) → Tasks 1,3,8. ✅
- §Tests → Tasks 1,2,3,6 + Task 9. ✅
- §Hors périmètre respecté (pas de gamification réelle, app/montres, vidéos, boutique, emails). ✅

Types/clés cohérents : `PREVIEW` (Task 4) consommé en Task 6 ; namespaces `trust`/`coachDemo`/`dashboardPreview` définis avant usage ; `ActivityRings`/`WeeklyChart` props respectées (`rings`, `data/metric/color`).

**Note d'exécution :** chiffres « 300+ séances / 50+ programmes » volontairement **non** réintroduits dans ProofBar (non vérifiables) — seuls 10 disciplines / 24·7 / 30j / paiement sécurisé. Si l'utilisateur confirme un nombre réel de séances, l'ajouter en Task 2.
