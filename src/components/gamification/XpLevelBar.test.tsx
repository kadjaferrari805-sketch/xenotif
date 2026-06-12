import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { XpLevelBar } from './XpLevelBar'

it('rend le niveau et l’XP', () => {
  renderWithIntl(<XpLevelBar xp={450} levelKey="athlete" xpInLevel={150} xpForNext={500} />)
  expect(screen.getByText(/athlète/i)).toBeInTheDocument()
  expect(screen.getByText(/450/)).toBeInTheDocument()
})
