import { screen, waitFor } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'

// getUser lazy + défaut « non connecté » (évite le piège de hoisting jest).
const mockGetUser = jest.fn(() => Promise.resolve({ data: { user: null as { id: string } | null } }))
jest.mock('../../lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: () => mockGetUser(),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: jest.fn() } } }),
    },
  }),
}))

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
    it('non connecté → le CTA pointe vers /auth/signin', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })
      renderWithIntl(<Features />)
      await waitFor(() => {
        const links = screen.getAllByRole('link')
        expect(links.some((l) => l.getAttribute('href')?.includes('/auth/signin'))).toBe(true)
      })
    })

    it('connecté → le CTA pointe vers /disciplines/…', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
      renderWithIntl(<Features />)
      await waitFor(() => {
        const links = screen.getAllByRole('link')
        expect(links.some((l) => l.getAttribute('href')?.includes('/disciplines/'))).toBe(true)
      })
    })
  })
})
