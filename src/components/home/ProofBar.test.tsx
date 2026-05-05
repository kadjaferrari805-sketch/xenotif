import { render, screen } from '@testing-library/react'
import { ProofBar } from './ProofBar'

describe('ProofBar', () => {
  it('renders 4 trust items', () => {
    render(<ProofBar />)
    expect(screen.getByText(/4\.9\/5/i)).toBeInTheDocument()
    expect(screen.getByText(/livraison gratuite/i)).toBeInTheDocument()
    expect(screen.getByText(/30 jours/i)).toBeInTheDocument()
    expect(screen.getByText(/recharge/i)).toBeInTheDocument()
  })
})
