import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { PreviewDashboard } from './PreviewDashboard'

describe('PreviewDashboard', () => {
  it('affiche le badge « aperçu » et le prénom démo', () => {
    const { container } = renderWithIntl(<PreviewDashboard />)
    expect(screen.getByText(/données de démonstration/i)).toBeInTheDocument()
    expect(screen.getByText(/Alex/)).toBeInTheDocument()
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
