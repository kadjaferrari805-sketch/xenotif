import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { createClient } from '../../../../lib/supabase/client'
import { BienvenueClient } from './BienvenueClient'

/**
 * Phase 09.7.16 — parcours de démarrage Website.
 *
 * CHEMIN RELATIF pour le mock : l'alias `@/` est réécrit par SWC à la
 * transformation et n'est jamais résolu par le resolver de Jest — un
 * `jest.mock('@/…')` ne s'appliquerait à rien. Convention du dépôt.
 *
 * DOUBLE LOCAL, JOURNALISANT : les assertions portent sur les tables touchées
 * et sur l'ORDRE des opérations. C'est indispensable pour prouver la règle
 * centrale du contrat — la complétion n'est écrite qu'APRÈS une insertion de
 * séance confirmée, jamais avant, jamais sur échec.
 */
jest.mock('../../../../lib/supabase/client', () => ({
  createClient: jest.fn(),
}))

type Reponse = { data: unknown; error: unknown }

function doubleSupabase(reponseInsert: Reponse = { data: { id: 'w1' }, error: null }) {
  const operations: string[] = []
  let tableCourante = ''

  const chaine: Record<string, unknown> = {}
  const journalise = (methode: string) => (...args: unknown[]) => {
    if (methode === 'update' || methode === 'upsert' || methode === 'insert') {
      operations.push(`${tableCourante}.${methode}:${JSON.stringify(args[0])}`)
    }
    return chaine
  }
  for (const m of ['select', 'eq', 'lt', 'neq', 'update', 'upsert', 'insert', 'maybeSingle', 'single']) {
    chaine[m] = journalise(m)
  }
  chaine.then = <A,>(onF?: ((v: Reponse) => A) | null) =>
    Promise.resolve(tableCourante === 'workouts' ? reponseInsert : { data: null, error: null }).then(onF)

  const from = (table: string) => {
    tableCourante = table
    return chaine
  }

  ;(createClient as jest.Mock).mockReturnValue({ from })
  return { operations }
}

const props = {
  userId: 'user-test',
  nomInitial: 'Alex Martin',
  etapeInitiale: 1,
  reprise: false,
}

afterEach(() => { jest.clearAllMocks() })

describe('Bienvenue — étape 1 : identité', () => {
  test('le nom est pré-rempli depuis le profil', () => {
    doubleSupabase()
    renderWithIntl(<BienvenueClient {...props} />)
    expect(screen.getByLabelText(/nom complet/i)).toHaveValue('Alex Martin')
  })

  test('un profil sans nom affiche un champ vide et exige une saisie', async () => {
    doubleSupabase()
    renderWithIntl(<BienvenueClient {...props} nomInitial="" />)

    expect(screen.getByLabelText(/nom complet/i)).toHaveValue('')
    fireEvent.click(screen.getByRole('button', { name: /continuer/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/indique ton nom/i)
    // On reste à l'étape 1.
    expect(screen.getByText("Comment t'appeler ?")).toBeInTheDocument()
  })

  test('la progression affiche l’étape courante sur 4', () => {
    doubleSupabase()
    renderWithIntl(<BienvenueClient {...props} />)
    expect(screen.getByText('Étape 1 sur 4')).toBeInTheDocument()
  })
})

describe('Bienvenue — reprise de l’étape persistée', () => {
  test('un parcours repris s’ouvre à son étape, pas à l’étape 1', () => {
    doubleSupabase()
    renderWithIntl(<BienvenueClient {...props} etapeInitiale={3} />)

    expect(screen.getByText('Étape 3 sur 4')).toBeInTheDocument()
    expect(screen.getByText('Par quoi commencer ?')).toBeInTheDocument()
  })
})

describe('Bienvenue — étape 4 : première séance', () => {
  function allerEtape4() {
    const dbl = doubleSupabase()
    renderWithIntl(<BienvenueClient {...props} etapeInitiale={4} />)
    return dbl
  }

  test('une durée invalide est refusée AVANT tout appel réseau', async () => {
    const { operations } = allerEtape4()

    fireEvent.change(screen.getByLabelText(/durée/i), { target: { value: '3' } })
    fireEvent.click(screen.getByRole('button', { name: /enregistrer ma séance/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/durée entière/i)
    expect(operations.filter(o => o.startsWith('workouts.insert'))).toHaveLength(0)
    // Aucune complétion non plus.
    expect(operations.filter(o => o.includes('completed'))).toHaveLength(0)
  })

  test('SUCCÈS : la séance est insérée PUIS la complétion est écrite, dans cet ordre', async () => {
    const { operations } = allerEtape4()

    fireEvent.change(screen.getByLabelText(/durée/i), { target: { value: '45' } })
    fireEvent.click(screen.getByRole('button', { name: /enregistrer ma séance/i }))

    await screen.findByText("C'est parti !")

    const indexInsert = operations.findIndex(o => o.startsWith('workouts.insert'))
    const indexComplete = operations.findIndex(o => o.includes('"state":"completed"'))

    expect(indexInsert).toBeGreaterThanOrEqual(0)
    expect(indexComplete).toBeGreaterThanOrEqual(0)
    // L'ORDRE EST LE CŒUR DU CONTRAT.
    expect(indexInsert).toBeLessThan(indexComplete)
  })

  test('la durée est transmise en ENTIER', async () => {
    const { operations } = allerEtape4()

    fireEvent.change(screen.getByLabelText(/durée/i), { target: { value: '60' } })
    fireEvent.click(screen.getByRole('button', { name: /enregistrer ma séance/i }))

    await screen.findByText("C'est parti !")
    expect(operations.some(o => o.includes('"duration_minutes":60'))).toBe(true)
  })

  test('ÉCHEC D’INSERTION : aucune complétion, erreur visible, on reste à l’étape 4', async () => {
    const { operations } = doubleSupabase({ data: null, error: { message: 'insert failed' } })
    renderWithIntl(<BienvenueClient {...props} etapeInitiale={4} />)

    fireEvent.change(screen.getByLabelText(/durée/i), { target: { value: '45' } })
    fireEvent.click(screen.getByRole('button', { name: /enregistrer ma séance/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/enregistrement impossible/i)
    // L'onboarding RESTE in_progress : aucune écriture de complétion.
    expect(operations.filter(o => o.includes('"state":"completed"'))).toHaveLength(0)
    // Pas d'écran de confirmation.
    expect(screen.queryByText("C'est parti !")).not.toBeInTheDocument()
    expect(screen.getByText('Ta première séance')).toBeInTheDocument()
  })

  test('double-clic : le bouton se désactive pendant l’enregistrement', async () => {
    allerEtape4()

    const bouton = screen.getByRole('button', { name: /enregistrer ma séance/i })
    fireEvent.change(screen.getByLabelText(/durée/i), { target: { value: '45' } })
    fireEvent.click(bouton)

    await screen.findByText("C'est parti !")
    // Le bouton a disparu avec l'étape : la double soumission n'a pas pu créer
    // une seconde séance depuis cet écran.
    expect(screen.queryByRole('button', { name: /enregistrer ma séance/i })).not.toBeInTheDocument()
  })

  test('« Plus tard » reporte le parcours sans créer de séance', async () => {
    const { operations } = allerEtape4()

    fireEvent.click(screen.getByRole('button', { name: /plus tard/i }))

    await waitFor(() =>
      expect(operations.some(o => o.includes('"state":"dismissed"'))).toBe(true),
    )
    expect(operations.filter(o => o.startsWith('workouts.insert'))).toHaveLength(0)
  })
})

describe('Bienvenue — navigation', () => {
  test('le retour depuis l’étape 3 ramène à l’étape 2', async () => {
    doubleSupabase()
    renderWithIntl(<BienvenueClient {...props} etapeInitiale={3} />)

    fireEvent.click(screen.getByRole('button', { name: /retour/i }))
    expect(await screen.findByText('Quel est ton objectif ?')).toBeInTheDocument()
  })

  test('l’étape 1 n’offre aucun retour', () => {
    doubleSupabase()
    renderWithIntl(<BienvenueClient {...props} />)
    expect(screen.queryByRole('button', { name: /retour/i })).not.toBeInTheDocument()
  })

  test('choisir un objectif mène à l’étape 3', async () => {
    doubleSupabase()
    renderWithIntl(<BienvenueClient {...props} etapeInitiale={2} />)

    fireEvent.click(screen.getByRole('button', { name: /prendre du muscle/i }))
    expect(await screen.findByText('Par quoi commencer ?')).toBeInTheDocument()
  })
})
