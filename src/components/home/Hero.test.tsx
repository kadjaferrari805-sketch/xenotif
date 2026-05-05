import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders the main headline', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/douleurs cervicales/i)
  })

  it('renders primary CTA button', () => {
    render(<Hero />)
    expect(screen.getByRole('button', { name: /commander maintenant/i })).toBeInTheDocument()
  })

  it('renders secondary CTA button', () => {
    render(<Hero />)
    expect(screen.getByRole('button', { name: /comment ça marche/i })).toBeInTheDocument()
  })

  it('renders all 4 trust items', () => {
    render(<Hero />)
    expect(screen.getByText(/4\.9\/5/i)).toBeInTheDocument()
    expect(screen.getByText(/livraison gratuite/i)).toBeInTheDocument()
    expect(screen.getByText(/30 jours/i)).toBeInTheDocument()
    expect(screen.getByText(/usb-c/i)).toBeInTheDocument()
  })

  it('renders the 3 floating product badges', () => {
    render(<Hero />)
    expect(screen.getByText(/chaleur 42°c/i)).toBeInTheDocument()
    expect(screen.getAllByText(/16 niveaux/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/sans fil/i)).toBeInTheDocument()
  })
})
