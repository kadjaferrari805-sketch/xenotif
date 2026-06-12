import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { DevicesSync } from './DevicesSync'

describe('DevicesSync', () => {
  it('rend le titre, une métrique et une marque « bientôt » sans Fitbit', () => {
    renderWithIntl(<DevicesSync />)
    expect(screen.getByText(/synchronise tes performances/i)).toBeInTheDocument()
    expect(screen.getByText(/fréquence cardiaque/i)).toBeInTheDocument()
    expect(screen.getByText(/garmin/i)).toBeInTheDocument()
    expect(screen.queryByText(/fitbit/i)).not.toBeInTheDocument()
  })
})
