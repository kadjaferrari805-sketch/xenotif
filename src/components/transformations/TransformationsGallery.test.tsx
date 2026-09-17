import { screen, waitFor } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import type { TransformationItem } from '@/lib/transformations'
import { TransformationsGallery } from './TransformationsGallery'

// Tous les doubles sont locaux et déterministes : aucun Supabase réel, aucun
// compte utilisateur, aucun horodatage. Le composant ne dépend que de `fetch`.

const item = (over: Partial<TransformationItem> = {}): TransformationItem => ({
  id: '1',
  displayName: 'Alex',
  caption: 'Six mois de travail',
  weeks: 12,
  beforeUrl: 'https://cdn.test/1-before.png',
  afterUrl: 'https://cdn.test/1-after.png',
  ...over,
})

/** Réponse 2xx bien formée. */
function mockOk(items: unknown[]) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true, status: 200, json: async () => ({ items }),
  }) as unknown as typeof fetch
}

/** Réponse d'erreur HTTP — le corps ne doit JAMAIS être interprété. */
function mockHttpError(status: number) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false, status, json: async () => ({ error: 'unavailable' }),
  }) as unknown as typeof fetch
}

/** Réponse 2xx dont le corps n'est pas du JSON valide. */
function mockInvalidJson() {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true, status: 200, json: async () => { throw new SyntaxError('Unexpected token < in JSON') },
  }) as unknown as typeof fetch
}

/** Réponse 2xx au JSON valide mais de forme inattendue. */
function mockBadShape(payload: unknown) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true, status: 200, json: async () => payload,
  }) as unknown as typeof fetch
}

/** Requête laissée en suspens : fige le composant en état de chargement. */
function mockPending() {
  let release!: (value: unknown) => void
  const pending = new Promise(resolve => { release = resolve })
  global.fetch = jest.fn().mockReturnValue(pending) as unknown as typeof fetch
  return () => release({ ok: true, status: 200, json: async () => ({ items: [] }) })
}

const ERREUR = 'Erreur. Réessaie.'

afterEach(() => { jest.clearAllMocks() })

describe('TransformationsGallery — état de chargement', () => {
  test('affiche un squelette qui réserve la place, sans aucun contenu inventé', async () => {
    const release = mockPending()
    renderWithIntl(<TransformationsGallery />)

    const squelette = await screen.findByTestId('transformations-skeleton')
    expect(squelette).toHaveAttribute('aria-busy', 'true')
    // Le titre est déjà là : la section ne surgit pas d'un coup à l'arrivée
    // des données.
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    // Mais rien n'est inventé : ni image, ni nom, ni message d'erreur.
    expect(screen.queryAllByRole('img')).toHaveLength(0)
    expect(screen.queryByText('Alex')).not.toBeInTheDocument()
    expect(screen.queryByText(ERREUR)).not.toBeInTheDocument()

    release()
    await waitFor(() => expect(screen.queryByTestId('transformations-skeleton')).not.toBeInTheDocument())
  })
})

describe('TransformationsGallery — succès', () => {
  test('un élément : la carte avant/après est rendue', async () => {
    mockOk([item()])
    renderWithIntl(<TransformationsGallery />)

    await screen.findByText('Alex')
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/ils l'ont fait/i)
    expect(screen.getByText('Six mois de travail')).toBeInTheDocument()
    expect(screen.queryByTestId('transformations-skeleton')).not.toBeInTheDocument()
  })

  test('plusieurs éléments : autant de figures que d’éléments, deux images chacune', async () => {
    mockOk([
      item({ id: '1', displayName: 'Alex' }),
      item({ id: '2', displayName: 'Sam' }),
      item({ id: '3', displayName: 'Chris' }),
    ])
    const { container } = renderWithIntl(<TransformationsGallery />)

    await screen.findByText('Chris')
    expect(container.querySelectorAll('figure')).toHaveLength(3)
    expect(screen.getAllByRole('img')).toHaveLength(6)
  })

  test('liste vide : la section disparaît entièrement', async () => {
    mockOk([])
    const { container } = renderWithIntl(<TransformationsGallery />)

    await waitFor(() => expect(container.querySelector('section')).toBeNull())
    expect(screen.queryByText(ERREUR)).not.toBeInTheDocument()
  })

  test('sans pseudo : le nom par défaut est utilisé', async () => {
    mockOk([item({ displayName: null })])
    renderWithIntl(<TransformationsGallery />)

    await screen.findByText('Membre Xenotif®')
  })
})

describe('TransformationsGallery — erreurs, jamais converties en liste vide', () => {
  test('réponse 503 : état d’erreur visible, et NON une galerie vide', async () => {
    mockHttpError(503)
    const { container } = renderWithIntl(<TransformationsGallery />)

    await screen.findByText(ERREUR)
    // La distinction est le cœur du durcissement : la section reste présente.
    expect(container.querySelector('section')).not.toBeNull()
    expect(screen.queryAllByRole('img')).toHaveLength(0)
    expect(screen.queryByTestId('transformations-skeleton')).not.toBeInTheDocument()
  })

  test('réponse 500 : même traitement', async () => {
    mockHttpError(500)
    renderWithIntl(<TransformationsGallery />)
    await screen.findByText(ERREUR)
  })

  test('JSON invalide : état d’erreur', async () => {
    mockInvalidJson()
    renderWithIntl(<TransformationsGallery />)
    await screen.findByText(ERREUR)
  })

  test('charge utile inattendue (items absent, null ou non-tableau) : état d’erreur', async () => {
    for (const payload of [{}, { items: null }, { items: 'oui' }, null]) {
      mockBadShape(payload)
      const { unmount } = renderWithIntl(<TransformationsGallery />)
      await screen.findByText(ERREUR)
      unmount()
    }
  })

  test('réseau injoignable : état d’erreur', async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch')) as unknown as typeof fetch
    renderWithIntl(<TransformationsGallery />)
    await screen.findByText(ERREUR)
  })

  test('aucun détail technique n’est exposé au visiteur', async () => {
    mockHttpError(503)
    const { container } = renderWithIntl(<TransformationsGallery />)

    await screen.findByText(ERREUR)
    const texte = (container.textContent ?? '').toLowerCase()
    for (const fuite of ['503', 'http', 'unavailable', 'supabase', 'transformations/api', 'fetch']) {
      expect(texte).not.toContain(fuite)
    }
  })
})

describe('TransformationsGallery — accessibilité', () => {
  test('le titre est la source du libellé de section (aria-labelledby)', async () => {
    mockOk([item()])
    const { container } = renderWithIntl(<TransformationsGallery />)

    await screen.findByText('Alex')
    const section = container.querySelector('section')!
    const titre = screen.getByRole('heading', { level: 2 })

    expect(titre.id).toBeTruthy()
    expect(section.getAttribute('aria-labelledby')).toBe(titre.id)
    // aria-label dupliquerait le titre : il ne doit plus être là.
    expect(section.hasAttribute('aria-label')).toBe(false)
  })

  test('les alt sont descriptifs et contextualisés, pas « Avant »/« Après » universels', async () => {
    mockOk([item({ displayName: 'Alex', weeks: 12 })])
    renderWithIntl(<TransformationsGallery />)

    await screen.findByText('Alex')
    const alts = screen.getAllByRole('img').map(i => i.getAttribute('alt'))

    expect(alts).toEqual(['Avant — Alex', 'Après — Alex, 12 semaines'])
    expect(alts).not.toContain('Avant')
    expect(alts).not.toContain('Après')
  })

  test('deux éléments distincts produisent des alt distincts', async () => {
    mockOk([item({ id: '1', displayName: 'Alex' }), item({ id: '2', displayName: 'Sam' })])
    renderWithIntl(<TransformationsGallery />)

    await screen.findByText('Sam')
    const alts = screen.getAllByRole('img').map(i => i.getAttribute('alt'))
    expect(new Set(alts).size).toBe(alts.length)
  })
})

describe('TransformationsGallery — images et appels réseau', () => {
  test('les deux images portent loading="lazy" et les URL de l’API', async () => {
    mockOk([item()])
    renderWithIntl(<TransformationsGallery />)

    await screen.findByText('Alex')
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(2)
    for (const img of images) {
      expect(img).toHaveAttribute('loading', 'lazy')
      expect(img).toHaveAttribute('decoding', 'async')
    }
    expect(images[0]).toHaveAttribute('src', 'https://cdn.test/1-before.png')
    expect(images[1]).toHaveAttribute('src', 'https://cdn.test/1-after.png')
  })

  test('un seul appel à l’API, sur la seule route publique', async () => {
    mockOk([item()])
    renderWithIntl(<TransformationsGallery />)

    await screen.findByText('Alex')
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith('/api/transformations')
  })

  test('le filtrage « approved » n’est pas refait côté client : tout ce que l’API renvoie est affiché', async () => {
    // Si le composant filtrait lui-même, cet élément dépourvu de tout champ de
    // statut disparaîtrait. Il doit être rendu tel quel.
    mockOk([item({ id: '9', displayName: 'Dominique' })])
    renderWithIntl(<TransformationsGallery />)

    await screen.findByText('Dominique')
  })
})
