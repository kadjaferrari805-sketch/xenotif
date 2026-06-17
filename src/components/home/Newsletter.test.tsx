import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { Newsletter } from './Newsletter'

describe('Newsletter', () => {
  it('renders email input', () => {
    renderWithIntl(<Newsletter />)
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
  })

  it('renders subscribe button', () => {
    renderWithIntl(<Newsletter />)
    expect(screen.getByRole('button', { name: /abonne/i })).toBeInTheDocument()
  })

  it('advertises the free 7-day program lead magnet', () => {
    renderWithIntl(<Newsletter />)
    expect(screen.getByText(/programme 7 jours offert/i)).toBeInTheDocument()
  })
})
