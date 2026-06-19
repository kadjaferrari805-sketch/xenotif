import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithIntl } from '@/test/intl'

let mockPath = '/'
jest.mock('next/navigation', () => ({ usePathname: () => mockPath }))

import { FreeProgramPopup } from './FreeProgramPopup'

const SEEN_KEY = 'xenotif_lead_popup_seen'

function fireExitIntent() {
  act(() => {
    document.dispatchEvent(new MouseEvent('mouseout', { clientY: 0, bubbles: true }))
  })
}

describe('FreeProgramPopup', () => {
  beforeEach(() => {
    mockPath = '/'
    localStorage.clear()
    jest.restoreAllMocks()
  })

  it('reste fermé tant qu’aucun déclencheur', () => {
    renderWithIntl(<FreeProgramPopup />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('s’ouvre sur exit-intent puis capture l’email', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) })
    global.fetch = fetchMock as unknown as typeof fetch

    renderWithIntl(<FreeProgramPopup />)
    fireExitIntent()

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())

    await userEvent.type(screen.getByLabelText(/adresse email/i), 'lea@example.com')
    await userEvent.click(screen.getByRole('button', { name: /recevoir mon programme/i }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/subscribe', expect.objectContaining({ method: 'POST' }))
    })
    // État succès → lien de téléchargement du PDF
    const dl = await screen.findByRole('link', { name: /télécharger le pdf/i })
    expect(dl.getAttribute('href')).toContain('/api/free-program')
  })

  it('ne s’affiche jamais si déjà vu (localStorage)', () => {
    localStorage.setItem(SEEN_KEY, '1')
    renderWithIntl(<FreeProgramPopup />)
    fireExitIntent()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('est désactivé sur les pages d’authentification', () => {
    mockPath = '/auth/signin'
    renderWithIntl(<FreeProgramPopup />)
    fireExitIntent()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
