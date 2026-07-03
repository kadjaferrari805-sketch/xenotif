import { render, screen } from '@testing-library/react'
import { StreakRing } from './StreakRing'
import type { StreakView } from '@/lib/streak/core'

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}))

const view: StreakView = {
  weeklyGoal: 3, currentStreak: 12, longestStreak: 18, freezesAvailable: 1,
  lastFinalizedWeek: '2026-06-29', activeDaysThisWeek: 2, weekValidated: false, nextMilestone: 26,
}

describe('StreakRing', () => {
  test('affiche la série et la progression de la semaine', () => {
    render(<StreakRing view={view} />)
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText(/2\s*\/\s*3/)).toBeInTheDocument()
  })

  test('état vide quand série 0 et aucune activité', () => {
    render(<StreakRing view={{ ...view, currentStreak: 0, activeDaysThisWeek: 0 }} />)
    expect(screen.getByText('empty')).toBeInTheDocument()
  })
})
