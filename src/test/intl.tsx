import { render } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import frMessages from '../../messages/fr.json'
import type { ReactElement } from 'react'
import { ThemeProvider } from '@/providers/ThemeProvider'

// Rend un composant client dans le provider next-intl (+ ThemeProvider, requis
// par ThemeToggle utilisé dans Nav) avec les messages FR.
export function renderWithIntl(ui: ReactElement, locale = 'fr') {
  return render(
    <NextIntlClientProvider locale={locale} messages={frMessages}>
      <ThemeProvider>{ui}</ThemeProvider>
    </NextIntlClientProvider>,
  )
}
