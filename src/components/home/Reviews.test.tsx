import { render, screen } from '@testing-library/react'
import { Reviews } from './Reviews'

describe('Reviews', () => {
  it('renders 3 review cards', () => {
    render(<Reviews />)
    expect(screen.getByText(/Thomas D\./i)).toBeInTheDocument()
    expect(screen.getByText(/Leila M\./i)).toBeInTheDocument()
    expect(screen.getByText(/Nicolas R\./i)).toBeInTheDocument()
  })

  it('renders verified badge on each review', () => {
    render(<Reviews />)
    const badges = screen.getAllByText(/membre vérifié/i)
    expect(badges).toHaveLength(3)
  })
})
