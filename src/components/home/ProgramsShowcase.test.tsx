import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import type { Product } from '@/lib/boutique/products'
import { ProgramsShowcase } from './ProgramsShowcase'

function makeProgram(over: Partial<Product> & { id: string; slug: string; name: string }): Product {
  return {
    brand: 'XENOTIF Coach',
    description: 'desc',
    longDescription: 'long',
    type: 'digital',
    price_cents: 2900,
    stripe_price_id: 'price_x',
    images: ['https://example.com/x.jpg'],
    category: 'Programmes',
    tags: [],
    rating: 4.8,
    reviews: 1234,
    inStock: true,
    features: ['84 séances sur 12 semaines', 'Split 4j/semaine'],
    isAffiliate: false,
    ...over,
  }
}

const PROGRAMS: Product[] = [
  makeProgram({ id: 'd1', slug: 'programme-prise-masse-12-semaines', name: 'Programme Prise de Masse - 12 Semaines', level: 'Intermédiaire', duration: '12 semaines' }),
  makeProgram({ id: 'd3', slug: 'programme-hiit-6-semaines', name: 'Programme HIIT Brûle-Graisses - 6 Semaines', level: 'Débutant à avancé', duration: '6 semaines' }),
]

describe('ProgramsShowcase', () => {
  it('renders section title', () => {
    renderWithIntl(<ProgramsShowcase programs={PROGRAMS} />)
    expect(screen.getByText(/programmes populaires/i)).toBeInTheDocument()
  })

  it('renders each program with a link to its boutique page', () => {
    renderWithIntl(<ProgramsShowcase programs={PROGRAMS} />)
    const links = screen.getAllByRole('link')
    expect(links.some((l) => l.getAttribute('href')?.includes('/boutique/programme-prise-masse-12-semaines'))).toBe(true)
    expect(links.some((l) => l.getAttribute('href')?.includes('/boutique/programme-hiit-6-semaines'))).toBe(true)
  })

  it('shows level and duration badges', () => {
    renderWithIntl(<ProgramsShowcase programs={PROGRAMS} />)
    expect(screen.getByText('Intermédiaire')).toBeInTheDocument()
    expect(screen.getByText('12 semaines')).toBeInTheDocument()
    expect(screen.getByText('Débutant à avancé')).toBeInTheDocument()
    expect(screen.getByText('6 semaines')).toBeInTheDocument()
  })

  it('links « voir tous » to the catalogue', () => {
    renderWithIntl(<ProgramsShowcase programs={PROGRAMS} />)
    const links = screen.getAllByRole('link')
    expect(links.some((l) => l.getAttribute('href')?.includes('/boutique/catalogue'))).toBe(true)
  })

  it('renders nothing when there are no programs', () => {
    const { container } = renderWithIntl(<ProgramsShowcase programs={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
