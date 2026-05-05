import { render, screen } from '@testing-library/react'
import { Features } from './Features'

describe('Features', () => {
  it('renders section title', () => {
    render(<Features />)
    expect(screen.getByText(/6 technologies/i)).toBeInTheDocument()
  })

  it('renders all 6 feature cards', () => {
    render(<Features />)
    expect(screen.getByText(/impulsions basse fréquence/i)).toBeInTheDocument()
    expect(screen.getByText(/chaleur thérapeutique/i)).toBeInTheDocument()
    expect(screen.getByText(/4 têtes de massage/i)).toBeInTheDocument()
    expect(screen.getByText(/16 niveaux/i)).toBeInTheDocument()
    expect(screen.getByText(/portable/i)).toBeInTheDocument()
    expect(screen.getByText(/commande vocale/i)).toBeInTheDocument()
  })
})
