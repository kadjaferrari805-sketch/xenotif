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
    expect(screen.getByRole('link', { name: /disciplines/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /blog/i })).toBeInTheDocument()
  })

  it('renders join link', () => {
    renderWithIntl(<Nav />)
    expect(screen.getByRole('link', { name: /rejoindre/i })).toBeInTheDocument()
  })

  it('renders the language switcher', () => {
    renderWithIntl(<Nav />)
    expect(
      screen.getByRole('combobox', { name: /changer de langue/i }),
    ).toBeInTheDocument()
  })
})
