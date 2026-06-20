import { defineRouting } from 'next-intl/routing'

export const locales = ['fr', 'en', 'de'] as const
export type Locale = (typeof locales)[number]

export const routing = defineRouting({
  locales,
  defaultLocale: 'fr',
  localePrefix: 'as-needed',
  localeCookie: { name: 'NEXT_LOCALE' },
  // Perf : pas de redirection automatique basée sur Accept-Language. « / » sert
  // directement la locale par défaut (fr) sans round-trip de redirection
  // (~985 ms gagnés sur mobile pour les visiteurs étrangers). Le choix de langue
  // reste accessible via le sélecteur (LanguageSwitcher → /de, /en).
  localeDetection: false,
})
