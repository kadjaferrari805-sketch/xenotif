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
    // Carrousel continu : le contenu est dupliqué (copie aria-hidden) → getAllByText.
    expect(screen.getAllByText('1')[0]).toBeInTheDocument()
    expect(screen.getAllByText('2')[0]).toBeInTheDocument()
    expect(screen.getAllByText('3')[0]).toBeInTheDocument()
    expect(screen.getAllByText('4')[0]).toBeInTheDocument()
  })
})
