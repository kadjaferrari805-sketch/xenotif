import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders primary button with text', () => {
    render(<Button variant="primary">Commander</Button>)
    expect(screen.getByRole('button', { name: 'Commander' })).toBeInTheDocument()
  })

  it('applies primary styles', () => {
    render(<Button variant="primary">Test</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toHaveClass('bg-primary')
  })

  it('applies secondary styles', () => {
    render(<Button variant="secondary">Test</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toHaveClass('border-primary')
  })

  it('passes additional className', () => {
    render(<Button variant="primary" className="w-full">Test</Button>)
    expect(screen.getByRole('button')).toHaveClass('w-full')
  })
})
