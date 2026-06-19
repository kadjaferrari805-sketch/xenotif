import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'

import { Features } from './Features'

describe('Features', () => {
  it('renders section title', () => {
    renderWithIntl(<Features />)
    expect(screen.getByText(/10 disciplines/i)).toBeInTheDocument()
  })

  it('renders all 6 discipline cards', () => {
    renderWithIntl(<Features />)
    expect(screen.getByText(/running & cardio/i)).toBeInTheDocument()
    expect(screen.getByText(/musculation/i)).toBeInTheDocument()
    expect(screen.getByText(/hiit/i)).toBeInTheDocument()
    expect(screen.getByText(/cyclisme/i)).toBeInTheDocument()
    expect(screen.getByText(/natation/i)).toBeInTheDocument()
    expect(screen.getByText(/crossfit/i)).toBeInTheDocument()
  })

  describe('CTA « Découvrir »', () => {
    // Les pages /disciplines/[slug] sont publiques (SSG + soft-paywall vidéos) :
    // la carte mène toujours à la page discipline, sans mur de login préalable.
    it('chaque carte pointe vers /disciplines/[slug]', () => {
      renderWithIntl(<Features />)
      const links = screen.getAllByRole('link')
      expect(links.some((l) => l.getAttribute('href')?.includes('/disciplines/running-cardio'))).toBe(true)
      expect(links.some((l) => l.getAttribute('href')?.includes('/disciplines/musculation'))).toBe(true)
    })

    it('ne renvoie jamais vers /auth/signin', () => {
      renderWithIntl(<Features />)
      const links = screen.getAllByRole('link')
      expect(links.some((l) => l.getAttribute('href')?.includes('/auth/signin'))).toBe(false)
    })
  })
})
