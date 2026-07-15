// ──────────────────────────────────────────────────────────────────────
// Campagnes quotidiennes - contenu des notifications/newsletters thématiques,
// en fr / en / de. Complète la motivation (matin) + le rappel (soir) de
// `daily-motivation.ts`. Thèmes ajoutés : boutique, guide programme, abonnement.
//
// PUSH : 5 créneaux/jour au total (motivation 8h · boutique 12h · guide 15h ·
//        rappel 18h · abonnement 20h). EMAIL : 1/jour à thème tournant.
// Tout est localisé selon `profiles.locale` (fr par défaut).
// ──────────────────────────────────────────────────────────────────────

export type CampaignLocale = 'fr' | 'en' | 'de'
export const normCampaignLocale = (l?: string | null): CampaignLocale =>
  l === 'en' ? 'en' : l === 'de' ? 'de' : 'fr'

export type CampaignTheme = 'motivation' | 'boutique' | 'guide' | 'subscribe' | 'reminder'

export type PushPayload = { title: string; body: string; url: string; tag: string }

// ── Contenu PUSH (court : titre + une ligne) ──────────────────────────
const PUSH: Record<Exclude<CampaignTheme, 'motivation' | 'reminder'>, Record<CampaignLocale, { title: string; body: string }>> = {
  boutique: {
    fr: { title: '🛒 La sélection Xenotif', body: 'Protéines, matériel et accessoires testés par nos coachs. Découvre la boutique.' },
    en: { title: '🛒 The Xenotif picks', body: 'Protein, gear and accessories tested by our coaches. Explore the shop.' },
    de: { title: '🛒 Die Xenotif-Auswahl', body: 'Protein, Equipment & Zubehör, von unseren Coaches getestet. Entdecke den Shop.' },
  },
  guide: {
    fr: { title: '📘 Ton programme t\'attend', body: 'Télécharge ton guide d\'entraînement complet (PDF) et suis un plan jour après jour.' },
    en: { title: '📘 Your program is ready', body: 'Download your full training guide (PDF) and follow a day-by-day plan.' },
    de: { title: '📘 Dein Programm wartet', body: 'Lade deinen kompletten Trainingsguide (PDF) herunter und folge Tag für Tag einem Plan.' },
  },
  subscribe: {
    fr: { title: '🚀 Passe au niveau supérieur', body: 'Tous les programmes, le coach IA et le suivi complet - active ton abonnement Pro.' },
    en: { title: '🚀 Level up', body: 'All programs, the AI coach and full tracking - start your Pro membership.' },
    de: { title: '🚀 Leg eine Stufe höher', body: 'Alle Programme, der KI-Coach und volles Tracking - starte dein Pro-Abo.' },
  },
}

const PUSH_META: Record<keyof typeof PUSH, { url: string; tag: string }> = {
  boutique: { url: '/boutique', tag: 'boutique_daily' },
  guide: { url: '/dashboard/programme', tag: 'guide_daily' },
  subscribe: { url: '/dashboard/abonnement', tag: 'subscribe_daily' },
}

export function getCampaignPush(theme: keyof typeof PUSH, locale?: string | null): PushPayload {
  const loc = normCampaignLocale(locale)
  return { ...PUSH[theme][loc], ...PUSH_META[theme] }
}

// ── Contenu EMAIL (newsletter à thème tournant) ───────────────────────
export type CampaignEmail = { subject: string; headline: string; body: string; cta: string; ctaUrl: string }

const EMAIL: Record<'boutique' | 'guide' | 'subscribe', Record<CampaignLocale, CampaignEmail>> = {
  boutique: {
    fr: {
      subject: '🛒 La sélection matériel & nutrition de tes coachs',
      headline: 'Équipe-toi comme un pro',
      body: 'Notre boutique réunit protéines, matériel d\'entraînement et accessoires sélectionnés et testés par nos coachs. De quoi optimiser chaque séance, à la maison comme en salle.',
      cta: 'Découvrir la boutique →', ctaUrl: '/boutique',
    },
    en: {
      subject: '🛒 Your coaches\' gear & nutrition picks',
      headline: 'Gear up like a pro',
      body: 'Our shop brings together protein, training equipment and accessories handpicked and tested by our coaches - everything you need to get more out of every session, at home or at the gym.',
      cta: 'Explore the shop →', ctaUrl: '/boutique',
    },
    de: {
      subject: '🛒 Die Equipment- & Ernährungsauswahl deiner Coaches',
      headline: 'Rüste dich wie ein Profi',
      body: 'In unserem Shop findest du Protein, Trainingsequipment und Zubehör, von unseren Coaches ausgewählt und getestet - für mehr aus jeder Einheit, zu Hause oder im Studio.',
      cta: 'Shop entdecken →', ctaUrl: '/boutique',
    },
  },
  guide: {
    fr: {
      subject: '📘 Ton guide programme - un plan structuré jour après jour',
      headline: 'Suis un vrai programme, pas l\'improvisation',
      body: 'Nos guides programmes (PDF premium) te donnent un plan clair, progressif et structuré : exercices, séries, répétitions et vidéos. Plus besoin de te demander quoi faire à la salle.',
      cta: 'Accéder à mes programmes →', ctaUrl: '/dashboard/programme',
    },
    en: {
      subject: '📘 Your program guide - a structured day-by-day plan',
      headline: 'Follow a real program, not improvisation',
      body: 'Our premium PDF program guides give you a clear, progressive and structured plan: exercises, sets, reps and videos. No more wondering what to do at the gym.',
      cta: 'Open my programs →', ctaUrl: '/dashboard/programme',
    },
    de: {
      subject: '📘 Dein Programm-Guide - ein strukturierter Plan Tag für Tag',
      headline: 'Folge einem echten Programm statt zu improvisieren',
      body: 'Unsere Premium-PDF-Programmguides geben dir einen klaren, progressiven und strukturierten Plan: Übungen, Sätze, Wiederholungen und Videos. Nie wieder überlegen, was im Studio zu tun ist.',
      cta: 'Meine Programme öffnen →', ctaUrl: '/dashboard/programme',
    },
  },
  subscribe: {
    fr: {
      subject: '🚀 Débloque tout Xenotif® - passe à l\'abonnement Pro',
      headline: 'Tu es à un clic de tout débloquer',
      body: 'L\'abonnement Pro te donne accès à tous les programmes, au coach IA personnalisé et au suivi complet de ta progression. Rejoins les athlètes qui transforment leur corps durablement.',
      cta: 'Voir les offres →', ctaUrl: '/#tarifs',
    },
    en: {
      subject: '🚀 Unlock all of Xenotif® - go Pro',
      headline: 'You\'re one click away from unlocking everything',
      body: 'The Pro membership gives you access to all programs, the personalized AI coach and full progress tracking. Join the athletes transforming their bodies for good.',
      cta: 'See the plans →', ctaUrl: '/#tarifs',
    },
    de: {
      subject: '🚀 Schalte ganz Xenotif® frei - werde Pro',
      headline: 'Nur ein Klick bis alles freigeschaltet ist',
      body: 'Das Pro-Abo gibt dir Zugang zu allen Programmen, dem personalisierten KI-Coach und dem vollständigen Fortschritts-Tracking. Schließe dich den Athleten an, die ihren Körper dauerhaft verändern.',
      cta: 'Angebote ansehen →', ctaUrl: '/#tarifs',
    },
  },
}

export function getCampaignEmail(theme: keyof typeof EMAIL, locale?: string | null): CampaignEmail {
  return EMAIL[theme][normCampaignLocale(locale)]
}

// ── Rotation du thème de l'email quotidien selon le jour de la semaine ──
// 1 email/jour, thème tournant (0=dimanche … 6=samedi).
//  • Abonnés (actifs/essai) : motivation / boutique / guide - PAS « subscribe »
//    (ils sont déjà abonnés).
//  • Inscrits non-abonnés + leads newsletter : on insère « subscribe » pour les
//    convertir.
const SUBSCRIBER_ROTATION: CampaignTheme[] = ['motivation', 'motivation', 'boutique', 'guide', 'motivation', 'boutique', 'guide']
const LEAD_ROTATION: CampaignTheme[] = ['motivation', 'subscribe', 'boutique', 'guide', 'subscribe', 'boutique', 'guide']

export function getDailyEmailTheme(isSubscriber: boolean, date: Date = new Date()): CampaignTheme {
  return (isSubscriber ? SUBSCRIBER_ROTATION : LEAD_ROTATION)[date.getDay()]
}
