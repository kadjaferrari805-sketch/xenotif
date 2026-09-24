import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import type { TransformationItem } from '@/lib/transformations'
import { createClient } from '../../../../lib/supabase/client'
import { ProgressionClient } from './ProgressionClient'

// CHEMIN RELATIF, et non `@/lib/supabase/client` : l'alias `@/` est réécrit par
// SWC à la transformation et n'est jamais résolu par le resolver de Jest — un
// `jest.mock('@/…')` ne s'appliquerait donc à rien. C'est la convention du
// dépôt (mocks relatifs partout, aucun via l'alias).
jest.mock('../../../../lib/supabase/client', () => ({
  createClient: jest.fn(),
}))

/**
 * Test d'INTÉGRATION de la page Progression — phase K7 H.2.
 *
 * Il vérifie le montage de la galerie dans la page, pas le comportement interne
 * du composant : celui-ci est couvert par TransformationsGallery.test.tsx
 * (phase H.1) et n'est pas redupliqué ici.
 *
 * `createClient` n'est pas évalué au montage — seulement dans le corps de
 * addWorkout, à l'enregistrement d'une séance. Les tests de galerie ci-dessous
 * n'en dépendent donc pas ; il est mocké pour le durcissement du chemin
 * d'insertion (09.7.9.3), couvert par le dernier bloc de ce fichier.
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

/**
 * DURCISSEMENT DU CHEMIN D'INSERTION — phase 09.7.9.3.
 *
 * Trois défauts vérifiés dans le code d'origine sont couverts ici :
 *   1. `error` n'était pas extraite du retour Supabase : un échec fermait la
 *      modale et réinitialisait le formulaire comme une réussite ;
 *   2. aucun try/catch : un rejet réseau laissait `saving` à vrai, donc le
 *      bouton désactivé indéfiniment ;
 *   3. `min`/`max` n'étaient jamais appliqués — la modale n'est pas un <form>
 *      et le bouton est `type="button"`, donc la validation native ne tourne
 *      pas ; `parseInt(x) || 0` écrivait alors 0 en base.
 *
 * DOUBLE LOCAL PLUTÔT QUE src/test/fake-supabase.ts : ce helper est déclaré
 * pour les tests SERVEUR et sa FakeQuery n'expose pas `select()`, alors que le
 * code de production enchaîne `.insert(…).select().single()`. L'étendre
 * toucherait un utilitaire partagé par sept fichiers, hors périmètre de cette
 * phase.
 */
type ReponseInsert = { data: unknown; error: unknown }

function supabaseQuiRepond(reponse: ReponseInsert) {
  const single = jest.fn().mockResolvedValue(reponse)
  const select = jest.fn(() => ({ single }))
  const insert = jest.fn(() => ({ select }))
  const from = jest.fn(() => ({ insert }))
  ;(createClient as jest.Mock).mockReturnValue({ from })
  return { from, insert }
}

function supabaseQuiRejette() {
  const single = jest.fn().mockRejectedValue(new Error('network down'))
  const select = jest.fn(() => ({ single }))
  const insert = jest.fn(() => ({ select }))
  const from = jest.fn(() => ({ insert }))
  ;(createClient as jest.Mock).mockReturnValue({ from })
  return { from, insert }
}

const SEANCE_OK = {
  discipline: 'running-cardio',
  duration_minutes: 45,
  completed_at: '2026-09-24T10:00:00.000Z',
}

/** Monte la page, ouvre la modale et renvoie ses contrôles. */
function ouvrirModale() {
  mockOk([])
  renderWithIntl(<ProgressionClient {...props} />)
  fireEvent.click(screen.getByRole('button', { name: /ajouter séance/i }))
  return {
    duree: screen.getByLabelText(/durée/i),
    enregistrer: screen.getByRole('button', { name: /^enregistrer$/i }),
  }
}

describe('09.7.9.3 — validation de la durée avant insertion', () => {
  // D, E, F : aucune de ces saisies ne doit atteindre la base.
  test.each([
    ['inférieure au minimum', '3'],
    ['supérieure au maximum', '301'],
    ['non numérique', 'abc'],
    ['vide', ''],
    ['décimale', '45.5'],
    ['négative', '-10'],
  ])('D/E/F : une durée %s est refusée sans appel réseau', async (_cas, saisie) => {
    const { insert } = supabaseQuiRepond({ data: SEANCE_OK, error: null })
    const { duree, enregistrer } = ouvrirModale()

    fireEvent.change(duree, { target: { value: saisie } })
    fireEvent.click(enregistrer)

    expect(await screen.findByRole('alert')).toHaveTextContent(/durée entière/i)
    expect(insert).not.toHaveBeenCalled()
    // La modale reste ouverte : rien n'est réinitialisé sur une saisie refusée.
    // (La conservation de la saisie est vérifiée sur un échec d'insertion, où la
    // valeur reste comparable — un <input type="number"> ramène « abc » à ''.)
    expect(screen.getByText('Nouvelle séance')).toBeInTheDocument()
  })

  test('G : une durée valide est transmise en ENTIER, jamais en chaîne', async () => {
    const { insert } = supabaseQuiRepond({ data: SEANCE_OK, error: null })
    const { duree, enregistrer } = ouvrirModale()

    fireEvent.change(duree, { target: { value: '45' } })
    fireEvent.click(enregistrer)

    await waitFor(() => expect(insert).toHaveBeenCalledTimes(1))
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'user-test', duration_minutes: 45 }),
    )
  })

  // Les bornes elles-mêmes sont acceptées : la validation est inclusive.
  test.each(['5', '300'])('la borne %s minutes est acceptée', async (valeur) => {
    const { insert } = supabaseQuiRepond({ data: SEANCE_OK, error: null })
    const { duree, enregistrer } = ouvrirModale()

    fireEvent.change(duree, { target: { value: valeur } })
    fireEvent.click(enregistrer)

    await waitFor(() => expect(insert).toHaveBeenCalledTimes(1))
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ duration_minutes: Number(valeur) }),
    )
  })
})

describe('09.7.9.3 — chemin de succès', () => {
  test('A : une insertion confirmée ferme la modale et ajoute la séance', async () => {
    supabaseQuiRepond({ data: SEANCE_OK, error: null })
    const { duree, enregistrer } = ouvrirModale()

    fireEvent.change(duree, { target: { value: '45' } })
    fireEvent.click(enregistrer)

    // Modale fermée…
    await waitFor(() => expect(screen.queryByText('Nouvelle séance')).not.toBeInTheDocument())
    // …et la séance apparaît dans l'historique, identifiée par sa durée : le nom
    // de discipline seul figurerait déjà dans la progression par discipline, et
    // l'assertion passerait donc même sans insertion.
    expect(screen.getByText('45 min')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

describe('09.7.9.3 — échecs d’insertion', () => {
  // B, H, I, J
  test('B : une erreur Supabase est signalée, sans fermer la modale', async () => {
    supabaseQuiRepond({ data: null, error: { message: 'insert failed' } })
    const { duree, enregistrer } = ouvrirModale()

    fireEvent.change(duree, { target: { value: '45' } })
    fireEvent.click(enregistrer)

    const alerte = await screen.findByRole('alert')
    expect(alerte).toHaveTextContent(/enregistrement impossible/i)
    // J : la modale reste ouverte.
    expect(screen.getByText('Nouvelle séance')).toBeInTheDocument()
    // I : la saisie est conservée, le formulaire n'est pas réinitialisé.
    expect(duree).toHaveValue(45)
    // H : l'état de chargement est restauré.
    expect(screen.getByRole('button', { name: /^enregistrer$/i })).toBeEnabled()
  })

  test('B bis : `data` nul sans erreur explicite reste un échec', async () => {
    supabaseQuiRepond({ data: null, error: null })
    const { duree, enregistrer } = ouvrirModale()

    fireEvent.change(duree, { target: { value: '45' } })
    fireEvent.click(enregistrer)

    expect(await screen.findByRole('alert')).toHaveTextContent(/enregistrement impossible/i)
    expect(screen.getByText('Nouvelle séance')).toBeInTheDocument()
  })

  test('C : un rejet réseau est capturé et le bouton redevient actif', async () => {
    supabaseQuiRejette()
    const { duree, enregistrer } = ouvrirModale()

    fireEvent.change(duree, { target: { value: '45' } })
    fireEvent.click(enregistrer)

    const alerte = await screen.findByRole('alert')
    expect(alerte).toHaveTextContent(/connexion interrompue/i)
    expect(screen.getByText('Nouvelle séance')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^enregistrer$/i })).toBeEnabled()
    expect(duree).toHaveValue(45)
  })

  test('aucun détail technique n’atteint l’utilisateur', async () => {
    supabaseQuiRepond({ data: null, error: { message: 'duplicate key value violates…' } })
    const { duree, enregistrer } = ouvrirModale()

    fireEvent.change(duree, { target: { value: '45' } })
    fireEvent.click(enregistrer)

    await screen.findByRole('alert')
    const texte = (document.body.textContent ?? '').toLowerCase()
    for (const fuite of ['duplicate', 'supabase', 'violates']) {
      expect(texte).not.toContain(fuite)
    }
  })

  test('l’erreur est effacée en rouvrant la modale', async () => {
    supabaseQuiRepond({ data: null, error: { message: 'insert failed' } })
    const { duree, enregistrer } = ouvrirModale()

    fireEvent.change(duree, { target: { value: '45' } })
    fireEvent.click(enregistrer)
    await screen.findByRole('alert')

    fireEvent.click(screen.getByRole('button', { name: /annuler/i }))
    fireEvent.click(screen.getByRole('button', { name: /ajouter séance/i }))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
