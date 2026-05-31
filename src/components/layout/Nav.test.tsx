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

  it('renders join link', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /rejoindre/i })).toBeInTheDocument()
  })
})
