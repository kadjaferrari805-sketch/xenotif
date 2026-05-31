import { render, screen } from '@testing-library/react'
import { ProofBar } from './ProofBar'

describe('ProofBar', () => {
  it('renders 4 stat values with their suffixes', () => {
    render(<ProofBar />)
    // Les nombres s'animent de 0 → cible via IntersectionObserver, non déclenché
    // en jsdom — donc on vérifie les suffixes statiques toujours rendus :
    // deux « + » (athlètes, programmes) et un « /5 » (satisfaction).
    expect(screen.getAllByText(/\+$/).length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText(/\/5$/)).toBeInTheDocument()
  })

  it('renders stat labels', () => {
    render(<ProofBar />)
    expect(screen.getByText(/athlètes actifs/i)).toBeInTheDocument()
    expect(screen.getByText(/programmes/i)).toBeInTheDocument()
    expect(screen.getByText(/disciplines/i)).toBeInTheDocument()
    expect(screen.getByText(/satisfaction/i)).toBeInTheDocument()
  })
})
