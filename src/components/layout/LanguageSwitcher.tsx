'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Globe } from 'lucide-react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'

export function LanguageSwitcher() {
  const locale = useLocale()
  const t = useTranslations('languages')
  const pathname = usePathname() // path sans préfixe de locale
  const router = useRouter()

  function change(next: string) {
    router.replace(pathname, { locale: next as Locale })
  }

  return (
    <label className="inline-flex items-center gap-1.5 text-sport-gray">
      <Globe size={14} aria-hidden="true" />
      <span className="sr-only">{t('switch')}</span>
      <select
        value={locale}
        onChange={(e) => change(e.target.value)}
        aria-label={t('switch')}
        className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l} className="bg-sport-dark text-white">
            {t(l)}
          </option>
        ))}
      </select>
    </label>
  )
}
