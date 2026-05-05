import { render, screen } from '@testing-library/react'
import { SectionHeader } from './SectionHeader'

describe('SectionHeader', () => {
  it('renders label, title and subtitle', () => {
    render(<SectionHeader label="Tech" title="6 technologies" subtitle="Pour votre cou" />)
    expect(screen.getByText('Tech')).toBeInTheDocument()
    expect(screen.getByText('6 technologies')).toBeInTheDocument()
    expect(screen.getByText('Pour votre cou')).toBeInTheDocument()
  })

  it('renders without subtitle', () => {
    render(<SectionHeader label="Tech" title="6 technologies" />)
    expect(screen.getByText('6 technologies')).toBeInTheDocument()
  })
})
