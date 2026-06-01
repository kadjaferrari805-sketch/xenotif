import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { Reviews } from './Reviews'

describe('Reviews', () => {
  it('renders 3 review cards', () => {
    renderWithIntl(<Reviews />)
    expect(screen.getByText(/Thomas D\./i)).toBeInTheDocument()
    expect(screen.getByText(/Leila M\./i)).toBeInTheDocument()
    expect(screen.getByText(/Nicolas R\./i)).toBeInTheDocument()
  })

  it('renders verified badge on each review', () => {
    renderWithIntl(<Reviews />)
    const badges = screen.getAllByText('Vérifié')
    expect(badges).toHaveLength(3)
  })
})
