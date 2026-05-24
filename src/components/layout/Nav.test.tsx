import { render, screen } from '@testing-library/react'
import { Nav } from './Nav'

describe('Nav', () => {
  it('renders the brand name', () => {
    render(<Nav />)
    expect(screen.getByText('XENOTIF')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /disciplines/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /blog/i })).toBeInTheDocument()
  })

  it('renders join button', () => {
    render(<Nav />)
    expect(screen.getByRole('button', { name: /rejoindre/i })).toBeInTheDocument()
  })
})
