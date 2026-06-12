import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { BadgesGrid } from './BadgesGrid'

it('rend les badges gagnés et verrouillés', () => {
  renderWithIntl(<BadgesGrid badges={[{ id: 'first', icon: '🏃', earned: true }, { id: 'week', icon: '📅', earned: false }]} />)
  expect(screen.getByText(/première séance/i)).toBeInTheDocument()
  expect(screen.getByText(/7 séances/i)).toBeInTheDocument()
})
