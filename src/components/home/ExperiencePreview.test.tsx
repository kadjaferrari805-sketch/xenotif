import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { ExperiencePreview } from './ExperiencePreview'

describe('ExperiencePreview', () => {
  it('renders the section title', () => {
    renderWithIntl(<ExperiencePreview />)
    expect(screen.getByRole('heading', { name: /espace xenotif/i })).toBeInTheDocument()
  })

  it('links to the no-account demo (/dashboard-preview)', () => {
    renderWithIntl(<ExperiencePreview />)
    const demo = screen.getByRole('link', { name: /démo/i })
    expect(demo).toHaveAttribute('href', expect.stringContaining('/dashboard-preview'))
  })

  it('renders a signup CTA', () => {
    renderWithIntl(<ExperiencePreview />)
    expect(screen.getByRole('link', { name: /créer mon compte/i })).toBeInTheDocument()
  })

  it('renders the 4 experience pillars', () => {
    renderWithIntl(<ExperiencePreview />)
    expect(screen.getByRole('heading', { name: /tableau de bord temps réel/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /progression mesurée/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /récompenses & défis/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /coach ia & programmes/i })).toBeInTheDocument()
  })
})
