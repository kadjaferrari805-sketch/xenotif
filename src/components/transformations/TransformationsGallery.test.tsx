import { screen, waitFor } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { TransformationsGallery } from './TransformationsGallery'

function mockFetch(items: unknown[]) {
  global.fetch = jest.fn().mockResolvedValue({ json: async () => ({ items }) }) as unknown as typeof fetch
}
afterEach(() => { jest.clearAllMocks() })

it('ne rend rien si aucune transformation', async () => {
  mockFetch([])
  const { container } = renderWithIntl(<TransformationsGallery />)
  await waitFor(() => expect(global.fetch).toHaveBeenCalled())
  expect(container.querySelector('section')).toBeNull()
})

it('rend une carte avant/après si une transformation', async () => {
  mockFetch([{ id: '1', displayName: 'Alex', caption: 'Top', weeks: 12, beforeUrl: 'b.jpg', afterUrl: 'a.jpg' }])
  renderWithIntl(<TransformationsGallery />)
  await waitFor(() => expect(screen.getByText(/ils l'ont fait/i)).toBeInTheDocument())
  expect(screen.getByText('Alex')).toBeInTheDocument()
})
