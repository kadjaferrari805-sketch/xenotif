import { render, screen } from '@testing-library/react'
import { StreakRing } from './StreakRing'

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}))

const view = {
  weeklyGoal: 3, currentStreak: 12, longestStreak: 18, freezesAvailable: 1,
  lastFinalizedWeek: '2026-06-29', activeDaysThisWeek: 2, weekValidated: false, nextMilestone: 26,
}

describe('StreakRing', () => {
  test('affiche la série et la progression de la semaine', () => {
    render(<StreakRing view={view as any} />)
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText(/2\s*\/\s*3/)).toBeInTheDocument()
  })

  test('état vide quand série 0 et aucune activité', () => {
    render(<StreakRing view={{ ...view, currentStreak: 0, activeDaysThisWeek: 0 } as any} />)
    expect(screen.getByText('empty')).toBeInTheDocument()
  })
})
