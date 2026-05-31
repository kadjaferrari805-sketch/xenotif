import { defineRouting } from 'next-intl/routing'

export const locales = ['fr', 'en', 'de', 'it', 'es'] as const
export type Locale = (typeof locales)[number]

export const routing = defineRouting({
  locales,
  defaultLocale: 'fr',
  localePrefix: 'as-needed',
  localeCookie: { name: 'NEXT_LOCALE' },
})
