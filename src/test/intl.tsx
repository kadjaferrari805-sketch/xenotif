import { render } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import frMessages from '../../messages/fr.json'
import type { ReactElement } from 'react'

// Rend un composant client dans le provider next-intl avec les messages FR.
export function renderWithIntl(ui: ReactElement, locale = 'fr') {
  return render(
    <NextIntlClientProvider locale={locale} messages={frMessages}>
      {ui}
    </NextIntlClientProvider>,
  )
}
