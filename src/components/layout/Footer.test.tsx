import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'

describe('Footer', () => {
  it('renders brand name', () => {
    render(<Footer />)
    expect(screen.getByText('XENOTIF')).toBeInTheDocument()
  })

  it('renders main column headings', () => {
    render(<Footer />)
    expect(screen.getByText('Produit')).toBeInTheDocument()
    expect(screen.getByText('Support')).toBeInTheDocument()
    expect(screen.getByText('Entreprise')).toBeInTheDocument()
  })

  it('renders copyright', () => {
    render(<Footer />)
    expect(screen.getByText(/2025 Xenotif/i)).toBeInTheDocument()
  })
})
