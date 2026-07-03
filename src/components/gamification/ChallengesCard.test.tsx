import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { ChallengesCard } from './ChallengesCard'

it('rend un défi avec sa progression', () => {
  renderWithIntl(<ChallengesCard titleKey="weeklyTitle" challenges={[{ id: 'weekDisciplines', target: 3, current: 2 }]} />)
  expect(screen.getByText(/défis de la semaine/i)).toBeInTheDocument()
  expect(screen.getByText(/2\/3 disciplines/i)).toBeInTheDocument()
})
