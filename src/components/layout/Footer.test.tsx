import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'

describe('Footer', () => {
  it('renders brand name', () => {
    render(<Footer />)
    expect(screen.getByText('XENOTIF®')).toBeInTheDocument()
  })

  it('renders main column headings', () => {
    render(<Footer />)
    expect(screen.getByText('Disciplines')).toBeInTheDocument()
    expect(screen.getByText('Programmes')).toBeInTheDocument()
    expect(screen.getByText('Communauté')).toBeInTheDocument()
  })

  it('renders copyright', () => {
    render(<Footer />)
    expect(screen.getByText(/2025 Xenotif®/i)).toBeInTheDocument()
  })
})
