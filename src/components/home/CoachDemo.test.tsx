import { screen, fireEvent } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { CoachDemo } from './CoachDemo'

describe('CoachDemo', () => {
  it('affiche le titre et l’intro du coach', () => {
    renderWithIntl(<CoachDemo />)
    expect(screen.getByText('Découvrez votre Coach IA')).toBeInTheDocument()
    expect(screen.getByText(/je suis ton coach ia/i)).toBeInTheDocument()
  })

  it('un clic sur une question affiche la réponse préparée', () => {
    renderWithIntl(<CoachDemo />)
    fireEvent.click(screen.getByRole('button', { name: /perdre du poids/i }))
    expect(screen.getByText(/3 séances HIIT/i)).toBeInTheDocument()
  })
})
