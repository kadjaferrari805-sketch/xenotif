import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { HowItWorks } from './HowItWorks'

describe('HowItWorks', () => {
  it('renders section title', () => {
    renderWithIntl(<HowItWorks />)
    expect(screen.getByText(/comment ça marche/i)).toBeInTheDocument()
  })

  it('renders 4 numbered steps', () => {
    renderWithIntl(<HowItWorks />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })
})
