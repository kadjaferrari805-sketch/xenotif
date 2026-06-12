import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { ProofBar } from './ProofBar'

describe('ProofBar', () => {
  it('rend les libellés des 4 stats vérifiables', () => {
    renderWithIntl(<ProofBar />)
    expect(screen.getByText(/^disciplines$/i)).toBeInTheDocument()
    expect(screen.getByText(/coaching ia/i)).toBeInTheDocument()
    expect(screen.getByText(/^garantie$/i)).toBeInTheDocument()
    expect(screen.getByText(/paiement sécurisé/i)).toBeInTheDocument()
  })

  it('rend des sous-libellés vérifiables (sans compte d’utilisateurs inventé)', () => {
    renderWithIntl(<ProofBar />)
    expect(screen.getByText(/disponible 24\/7/i)).toBeInTheDocument()
    expect(screen.getByText(/satisfait ou remboursé/i)).toBeInTheDocument()
  })
})
