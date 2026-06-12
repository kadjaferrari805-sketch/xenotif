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
