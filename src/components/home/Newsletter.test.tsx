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
})
