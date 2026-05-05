import { render, screen } from '@testing-library/react'
import { Reviews } from './Reviews'

describe('Reviews', () => {
  it('renders 3 review cards', () => {
    render(<Reviews />)
    expect(screen.getByText(/Marie L\./i)).toBeInTheDocument()
    expect(screen.getByText(/Jacques M\./i)).toBeInTheDocument()
    expect(screen.getByText(/Sarah K\./i)).toBeInTheDocument()
  })

  it('renders verified badge on each review', () => {
    render(<Reviews />)
    const badges = screen.getAllByText(/achat vérifié/i)
    expect(badges).toHaveLength(3)
  })
})
