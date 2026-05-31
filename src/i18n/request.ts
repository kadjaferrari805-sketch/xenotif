import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale
  const messages = (await import(`../../messages/${locale}.json`)).default
  // Repli FR : on charge aussi les messages français pour combler les clés
  // non encore traduites dans la langue active (import dynamique via variable
  // → pas de résolution statique, donc tsc reste propre).
  const fallback =
    locale === routing.defaultLocale
      ? messages
      : (await import(`../../messages/${routing.defaultLocale}.json`)).default

  return {
    locale,
    messages,
    getMessageFallback: ({ namespace, key }) => {
      const path = [namespace, key].filter(Boolean).join('.')
      if (locale === routing.defaultLocale) return path
      const value = path
        .split('.')
        .reduce<unknown>((o, k) => (o as Record<string, unknown>)?.[k], fallback)
      return typeof value === 'string' ? value : path
    },
  }
})
