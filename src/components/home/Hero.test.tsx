import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders the main headline', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders primary CTA link', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /rejoindre gratuitement/i })).toBeInTheDocument()
  })

  it('renders secondary CTA link', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /voir les disciplines/i })).toBeInTheDocument()
  })

  it('renders all 4 trust items', () => {
    render(<Hero />)
    expect(screen.getByText(/12K\+ athlètes/i)).toBeInTheDocument()
    // « Coaching IA » apparaît aussi dans les badges flottants
    expect(screen.getAllByText(/coaching ia/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/accès illimité/i)).toBeInTheDocument()
    // « 30 jours » figure dans le trust item ET dans un badge (« dès 30 jours »)
    expect(screen.getAllByText(/30 jours/i).length).toBeGreaterThanOrEqual(1)
  })

  it('renders the floating stat badges', () => {
    render(<Hero />)
    expect(screen.getByText(/\+12 000 membres/i)).toBeInTheDocument()
    expect(screen.getByText(/4\.9 \/ 5/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Coaching IA/i).length).toBeGreaterThanOrEqual(1)
  })
})
