import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import type { BlogPost } from '@/lib/blog/posts'
import { BlogShowcase } from './BlogShowcase'

function makePost(over: Partial<BlogPost> & { slug: string; title: string }): BlogPost {
  return {
    excerpt: 'Un extrait court de l’article.',
    category: 'Musculation',
    coverImage: 'https://example.com/cover.jpg',
    author: 'XENOTIF',
    publishedAt: '2026-06-01',
    readingMinutes: 6,
    ...over,
  } as BlogPost
}

const POSTS: BlogPost[] = [
  makePost({ slug: 'meilleurs-halteres', title: 'Les 5 meilleurs haltères', category: 'Musculation' }),
  makePost({ slug: 'nutrition-prise-masse', title: 'Nutrition prise de masse', category: 'Nutrition' }),
]

describe('BlogShowcase', () => {
  it('renders the section title', () => {
    renderWithIntl(<BlogShowcase posts={POSTS} />)
    expect(screen.getByText(/conseils fitness/i)).toBeInTheDocument()
  })

  it('renders each post linking to its blog page', () => {
    renderWithIntl(<BlogShowcase posts={POSTS} />)
    const links = screen.getAllByRole('link')
    expect(links.some((l) => l.getAttribute('href')?.includes('/blog/meilleurs-halteres'))).toBe(true)
    expect(links.some((l) => l.getAttribute('href')?.includes('/blog/nutrition-prise-masse'))).toBe(true)
  })

  it('links « tous les articles » to /blog', () => {
    renderWithIntl(<BlogShowcase posts={POSTS} />)
    const links = screen.getAllByRole('link')
    expect(links.some((l) => l.getAttribute('href') === '/blog')).toBe(true)
  })

  it('renders nothing when there are no posts', () => {
    const { container } = renderWithIntl(<BlogShowcase posts={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
