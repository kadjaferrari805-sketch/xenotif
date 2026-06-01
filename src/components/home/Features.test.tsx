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
})
