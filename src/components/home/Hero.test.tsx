import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders the main headline', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders primary CTA button', () => {
    render(<Hero />)
    expect(screen.getByRole('button', { name: /rejoindre maintenant/i })).toBeInTheDocument()
  })

  it('renders secondary CTA button', () => {
    render(<Hero />)
    expect(screen.getByRole('button', { name: /voir les programmes/i })).toBeInTheDocument()
  })

  it('renders all 4 trust items', () => {
    render(<Hero />)
    expect(screen.getByText(/12K\+ athlètes/i)).toBeInTheDocument()
    expect(screen.getAllByText(/coaching ia/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/accès illimité/i)).toBeInTheDocument()
    expect(screen.getByText(/30 jours/i)).toBeInTheDocument()
  })

  it('renders the 3 floating badges', () => {
    render(<Hero />)
    expect(screen.getByText(/HIIT Pro/i)).toBeInTheDocument()
    expect(screen.getByText(/12K membres/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Coaching IA/i).length).toBeGreaterThanOrEqual(1)
  })
})
