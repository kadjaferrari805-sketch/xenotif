import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { TransformationForm } from './TransformationForm'

it('le bouton d’envoi est désactivé sans consentement', () => {
  renderWithIntl(<TransformationForm />)
  expect(screen.getByRole('button', { name: /envoyer/i })).toBeDisabled()
})
