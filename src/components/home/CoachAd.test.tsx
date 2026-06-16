import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { CoachAd } from './CoachAd'

describe('CoachAd', () => {
  it('rend l’image publicitaire et un bouton CTA', () => {
    renderWithIntl(<CoachAd />)
    expect(screen.getByRole('img')).toBeInTheDocument()
    expect(screen.getByRole('link')).toBeInTheDocument()
  })
})
