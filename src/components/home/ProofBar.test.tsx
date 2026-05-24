import { render, screen } from '@testing-library/react'
import { ProofBar } from './ProofBar'

describe('ProofBar', () => {
  it('renders 4 stats values', () => {
    render(<ProofBar />)
    expect(screen.getByText('12K+')).toBeInTheDocument()
    expect(screen.getByText('50+')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('4.9/5')).toBeInTheDocument()
  })

  it('renders stat labels', () => {
    render(<ProofBar />)
    expect(screen.getByText(/athlètes actifs/i)).toBeInTheDocument()
    expect(screen.getByText(/programmes/i)).toBeInTheDocument()
    expect(screen.getByText(/disciplines/i)).toBeInTheDocument()
    expect(screen.getByText(/satisfaction/i)).toBeInTheDocument()
  })
})
