import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders the main headline', () => {
    renderWithIntl(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders primary CTA link', () => {
    renderWithIntl(<Hero />)
    expect(screen.getByRole('link', { name: /commencer gratuitement/i })).toBeInTheDocument()
  })

  it('renders secondary CTA link', () => {
    renderWithIntl(<Hero />)
    expect(screen.getByRole('link', { name: /voir les disciplines/i })).toBeInTheDocument()
  })

  it('renders all 4 trust items', () => {
    renderWithIntl(<Hero />)
    // « 10 disciplines » figure dans le trust ET dans un badge flottant
    expect(screen.getAllByText(/10 disciplines/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/coaching ia/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/accès illimité/i)).toBeInTheDocument()
    expect(screen.getAllByText(/30 jours/i).length).toBeGreaterThanOrEqual(1)
  })

  it('renders the floating stat badges', () => {
    renderWithIntl(<Hero />)
    expect(screen.getAllByText(/10 disciplines/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/avis vérifiés/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Coaching IA/i).length).toBeGreaterThanOrEqual(1)
  })
})
