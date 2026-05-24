import { render, screen } from '@testing-library/react'
import { HowItWorks } from './HowItWorks'

describe('HowItWorks', () => {
  it('renders section title', () => {
    render(<HowItWorks />)
    expect(screen.getByText(/comment rejoindre/i)).toBeInTheDocument()
  })

  it('renders 4 numbered steps', () => {
    render(<HowItWorks />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })
})
