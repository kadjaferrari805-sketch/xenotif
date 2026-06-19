import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithIntl } from '@/test/intl'
import type { BlogPost } from '@/lib/blog/posts'
import { BlogSearchableGrid } from './BlogSearchableGrid'

function makePost(over: Partial<BlogPost> & { slug: string; title: string }): BlogPost {
  return {
    excerpt: 'Extrait.',
    category: 'Musculation',
    coverImage: 'https://example.com/c.jpg',
    author: 'XENOTIF',
    publishedAt: '2026-06-01',
    readingMinutes: 5,
    ...over,
  } as BlogPost
}

const POSTS: BlogPost[] = [
  makePost({ slug: 'halteres-maison', title: 'Les meilleurs haltères maison', category: 'Matériel' }),
  makePost({ slug: 'prise-de-masse', title: 'Prise de masse rapide', excerpt: 'Plan nutrition complet.', category: 'Nutrition' }),
  makePost({ slug: 'plan-marathon', title: 'Préparer un marathon', category: 'Running' }),
]

describe('BlogSearchableGrid', () => {
  it('affiche tous les articles au départ', () => {
    renderWithIntl(<BlogSearchableGrid posts={POSTS} />)
    expect(screen.getByText(/meilleurs haltères maison/i)).toBeInTheDocument()
    expect(screen.getByText(/prise de masse rapide/i)).toBeInTheDocument()
    expect(screen.getByText(/préparer un marathon/i)).toBeInTheDocument()
  })

  it('filtre par titre', async () => {
    renderWithIntl(<BlogSearchableGrid posts={POSTS} />)
    await userEvent.type(screen.getByLabelText(/rechercher un article/i), 'marathon')
    expect(screen.getByText(/préparer un marathon/i)).toBeInTheDocument()
    expect(screen.queryByText(/meilleurs haltères maison/i)).not.toBeInTheDocument()
  })

  it('filtre aussi par extrait et catégorie', async () => {
    renderWithIntl(<BlogSearchableGrid posts={POSTS} />)
    await userEvent.type(screen.getByLabelText(/rechercher un article/i), 'nutrition')
    // « nutrition » est dans l'extrait ET la catégorie de l'article prise de masse
    expect(screen.getByText(/prise de masse rapide/i)).toBeInTheDocument()
    expect(screen.queryByText(/préparer un marathon/i)).not.toBeInTheDocument()
  })

  it('affiche un état vide sans résultat', async () => {
    renderWithIntl(<BlogSearchableGrid posts={POSTS} />)
    await userEvent.type(screen.getByLabelText(/rechercher un article/i), 'zzzzz')
    expect(screen.getByText(/aucun article/i)).toBeInTheDocument()
  })
})
