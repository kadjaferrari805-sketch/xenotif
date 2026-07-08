import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { Nav } from './Nav'

describe('Nav', () => {
  it('renders the brand name', () => {
    renderWithIntl(<Nav />)
    expect(screen.getByText('XENOTIF')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    renderWithIntl(<Nav />)
    // « Disciplines » est le déclencheur du méga-menu (bouton), pas un lien direct.
    expect(screen.getByRole('button', { name: /disciplines/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /blog/i })).toBeInTheDocument()
  })

  it('renders the sign-in link for guests', () => {
    renderWithIntl(<Nav />)
    expect(screen.getByRole('link', { name: /connexion/i })).toBeInTheDocument()
  })

  it('renders the language switcher', () => {
    renderWithIntl(<Nav />)
    expect(
      screen.getByRole('combobox', { name: /changer de langue/i }),
    ).toBeInTheDocument()
  })
})
