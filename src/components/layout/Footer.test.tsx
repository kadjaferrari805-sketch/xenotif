import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { Footer } from './Footer'

describe('Footer', () => {
  it('renders brand name', () => {
    renderWithIntl(<Footer />)
    // Le logo rend « XENOTIF » + « ® » dans des spans séparés
    expect(screen.getByText('XENOTIF')).toBeInTheDocument()
  })

  it('renders main column headings', () => {
    renderWithIntl(<Footer />)
    expect(screen.getByText('Disciplines')).toBeInTheDocument()
    expect(screen.getByText('Programmes')).toBeInTheDocument()
    expect(screen.getByText('Informations')).toBeInTheDocument()
  })

  it('renders copyright', () => {
    renderWithIntl(<Footer />)
    expect(screen.getByText(/2026 Xenotif®/i)).toBeInTheDocument()
  })
})
