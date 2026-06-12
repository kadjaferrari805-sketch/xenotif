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
