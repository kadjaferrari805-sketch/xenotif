import { render, screen } from '@testing-library/react'
import { Newsletter } from './Newsletter'

describe('Newsletter', () => {
  it('renders email input', () => {
    render(<Newsletter />)
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
  })

  it('renders subscribe button', () => {
    render(<Newsletter />)
    expect(screen.getByRole('button', { name: /abonne/i })).toBeInTheDocument()
  })
})
