import { screen, waitFor } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import type { TransformationItem } from '@/lib/transformations'
import { ProgressionClient } from './ProgressionClient'

/**
 * Test d'INTÉGRATION de la page Progression — phase K7 H.2.
 *
 * Il vérifie le montage de la galerie dans la page, pas le comportement interne
 * du composant : celui-ci est couvert par TransformationsGallery.test.tsx
 * (phase H.1) et n'est pas redupliqué ici.
 *
 * Un seul double : `fetch`. `createClient` de @/lib/supabase/client n'a pas
 * besoin d'être mocké — il n'est évalué que dans le corps de la fonction, à
 * l'enregistrement d'une séance, jamais au montage.
 *
 * ATTENTION AU SIGNAL D'ATTENTE. Le titre de la galerie est rendu dans les
 * TROIS états (chargement, erreur, succès) : c'est le comportement anti-
 * décalage introduit en H.1. L'attendre ne prouve donc pas que les données sont
 * arrivées. Les assertions portant sur le contenu attendent un marqueur propre
 * à l'état « prêt » — un pseudo d'utilisateur — et jamais le titre.
 */

const FORM_TITLE = 'Partage ta transformation'
const GALLERY_TITLE = "Ils l'ont fait"
const ERREUR = 'Erreur. Réessaie.'

const props = { userId: 'user-test', initialWorkouts: [], initialProgress: [] }

const item = (over: Partial<TransformationItem> = {}): TransformationItem => ({
  id: '1',
  displayName: 'Alex',
  caption: 'Six mois de travail',
  weeks: 12,
  beforeUrl: 'https://cdn.test/1-before.png',
  afterUrl: 'https://cdn.test/1-after.png',
  ...over,
})

function mockOk(items: unknown[]) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true, status: 200, json: async () => ({ items }),
  }) as unknown as typeof fetch
}

function mockHttpError(status: number) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false, status, json: async () => ({ error: 'unavailable' }),
  }) as unknown as typeof fetch
}

afterEach(() => { jest.clearAllMocks() })

describe('Progression — montage de la galerie', () => {
  test('A + B : la galerie et le formulaire sont tous deux montés', async () => {
    mockOk([item()])
    renderWithIntl(<ProgressionClient {...props} />)

    await screen.findByText('Alex')
    expect(screen.getByText(GALLERY_TITLE)).toBeInTheDocument()
    expect(screen.getByText(FORM_TITLE)).toBeInTheDocument()
  })

  test('C : la galerie précède le formulaire dans le DOM', async () => {
    mockOk([item()])
    renderWithIntl(<ProgressionClient {...props} />)

    await screen.findByText('Alex')
    const galerie = screen.getByText(GALLERY_TITLE)
    const formulaire = screen.getByText(FORM_TITLE)

    // DOCUMENT_POSITION_FOLLOWING : le formulaire vient APRÈS la galerie.
    expect(galerie.compareDocumentPosition(formulaire) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  test('D : la galerie interroge /api/transformations, une seule fois', async () => {
    mockOk([item()])
    renderWithIntl(<ProgressionClient {...props} />)

    await screen.findByText('Alex')
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith('/api/transformations')
  })

  test('la galerie existante est réutilisée : une seule section, jamais deux', async () => {
    mockOk([item()])
    const { container } = renderWithIntl(<ProgressionClient {...props} />)

    await screen.findByText('Alex')
    expect(container.querySelectorAll('section')).toHaveLength(1)
    expect(screen.getAllByText(GALLERY_TITLE)).toHaveLength(1)
  })
})

describe('Progression — galerie vide', () => {
  test('E : aucun bloc vide, le formulaire reste visible, aucune erreur', async () => {
    const erreurConsole = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockOk([])
    const { container } = renderWithIntl(<ProgressionClient {...props} />)

    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    // La galerie s'efface entièrement : pas de section, pas de titre.
    await waitFor(() => expect(container.querySelector('section')).toBeNull())
    expect(screen.queryByText(GALLERY_TITLE)).not.toBeInTheDocument()
    expect(screen.queryByText(ERREUR)).not.toBeInTheDocument()

    // La page, elle, est intacte.
    expect(screen.getByText(FORM_TITLE)).toBeInTheDocument()
    expect(erreurConsole).not.toHaveBeenCalled()
    erreurConsole.mockRestore()
  })
})

describe('Progression — galerie garnie', () => {
  test('F : titre, images et légendes sont rendus', async () => {
    mockOk([
      item({ id: '1', displayName: 'Alex', caption: 'Six mois de travail' }),
      item({ id: '2', displayName: 'Sam', caption: 'Un an de régularité' }),
    ])
    renderWithIntl(<ProgressionClient {...props} />)

    // On attend un marqueur de l'état « prêt », pas le titre — qui existe déjà
    // pendant le chargement.
    await screen.findByText('Sam')
    expect(screen.getByText(GALLERY_TITLE)).toBeInTheDocument()
    expect(screen.getByText('Alex')).toBeInTheDocument()
    expect(screen.getByText('Six mois de travail')).toBeInTheDocument()
    expect(screen.getByText('Un an de régularité')).toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(4)
  })

  test('une transformation sans légende n’en affiche aucune', async () => {
    mockOk([item({ caption: null })])
    renderWithIntl(<ProgressionClient {...props} />)

    await screen.findByText('Alex')
    expect(screen.queryByText('Six mois de travail')).not.toBeInTheDocument()
  })
})

describe('Progression — API en erreur', () => {
  test('G : l’état d’erreur de H.1 s’affiche et le formulaire reste utilisable', async () => {
    mockHttpError(503)
    renderWithIntl(<ProgressionClient {...props} />)

    await screen.findByText(ERREUR)

    // Le formulaire n'est pas affecté : son titre est là et son bouton d'envoi
    // répond normalement (désactivé faute de consentement et de photos, ce qui
    // est son état initial légitime).
    expect(screen.getByText(FORM_TITLE)).toBeInTheDocument()
    const envoyer = screen.getByRole('button', { name: /envoyer/i })
    expect(envoyer).toBeInTheDocument()
    expect(envoyer).toBeDisabled()

    // Aucune image, et surtout aucune galerie vide déguisée en succès.
    expect(screen.queryAllByRole('img')).toHaveLength(0)
  })

  test('aucun détail technique de l’erreur n’atteint la page', async () => {
    mockHttpError(503)
    const { container } = renderWithIntl(<ProgressionClient {...props} />)

    await screen.findByText(ERREUR)
    const texte = (container.textContent ?? '').toLowerCase()
    for (const fuite of ['503', 'unavailable', 'supabase']) {
      expect(texte).not.toContain(fuite)
    }
  })
})

describe('Progression — accessibilité du montage', () => {
  test('H : le titre de galerie libelle sa section, et le formulaire reste opérable', async () => {
    mockOk([item()])
    const { container } = renderWithIntl(<ProgressionClient {...props} />)

    await screen.findByText('Alex')

    const section = container.querySelector('section')!
    const titre = screen.getByRole('heading', { name: GALLERY_TITLE })
    expect(titre.id).toBeTruthy()
    expect(section.getAttribute('aria-labelledby')).toBe(titre.id)

    // Les contrôles de la page restent intacts : plusieurs boutons répondent,
    // dont celui du formulaire de transformation.
    expect(screen.getAllByRole('button').length).toBeGreaterThan(1)
    expect(screen.getByRole('button', { name: /envoyer/i })).toBeInTheDocument()

    // Chaque image porte un alt non vide (contextualisé par H.1).
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(2)
    for (const img of images) {
      expect(img.getAttribute('alt')).toBeTruthy()
    }
  })
})
