import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { Reviews } from './Reviews'

describe('Reviews', () => {
  it('renders 3 review cards', () => {
    renderWithIntl(<Reviews />)
    // Carrousel continu : contenu dupliqué (copie aria-hidden) → getAllByText.
    expect(screen.getAllByText(/Thomas D\./i)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/Leila M\./i)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/Nicolas R\./i)[0]).toBeInTheDocument()
  })

  it('renders verified badge on each review', () => {
    renderWithIntl(<Reviews />)
    // Ne compte que les badges visibles (exclut la copie aria-hidden du carrousel).
    const badges = screen.getAllByText('Vérifié').filter((el) => !el.closest('[aria-hidden="true"]'))
    expect(badges).toHaveLength(3)
  })
})
