/**
 * @jest-environment jsdom
 */
// Phase K8.6.1 — finding C2. `fetch` ne rejette PAS sur un statut d'erreur :
// sans lecture de `res.ok`, un 400 (jeton invalide), un 409 (jeton rattaché à
// une autre adresse) ou un 429 (limite K.5) passaient totalement inaperçus.
//
// `saveCartForRecovery()` n'est pas exportée : elle vit dans le composant. On la
// déclenche donc comme un visiteur le fait — en quittant le champ e-mail — ce
// qui évite de modifier l'architecture pour la rendre testable.
//
// POURQUOI AUCUNE ISOLATION DE MODULES ICI. Une première version chargeait la
// page via `jest.isolateModulesAsync` pour repartir d'un store panier vierge.
// C'était une impasse : l'isolation réinstancie `next-intl`, si bien que le
// `NextIntlClientProvider` de `renderWithIntl` (importé au niveau supérieur)
// n'alimentait pas le `useTranslations` de l'instance isolée — un contexte React
// est lié à l'identité du module. Le store conserve donc son état entre les
// tests ; c'est sans effet ici, tous employant le même panier.
//
// AUCUN appel réseau réel : `fetch` est doublé.
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithIntl } from '@/test/intl'
import PanierPage from './page'

const ADRESSE = 'client@exemple.fr'
const JETON_ATTENDU = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/** Produit Xenotif minimal, NON affilié : sans lui `ownItems` serait vide. */
const PRODUIT = {
  id: 'd1',
  name: 'Guide Xenotif',
  description: 'desc',
  images: ['/guide.jpg'],
  price_cents: 1900,
  type: 'digital',
  isAffiliate: false,
}

const mockFetch = jest.fn()

let warn: jest.SpyInstance
let err: jest.SpyInstance
let log: jest.SpyInstance

/** Réponse d'un endpoint doublé. */
const reponse = (status: number, corps: Record<string, unknown> = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => corps,
})

/** Route les deux endpoints de la page vers des réponses distinctes. */
function router(saveStatus: number, checkoutCorps: Record<string, unknown> = {}) {
  mockFetch.mockImplementation((url: string) => {
    if (String(url).includes('/api/boutique/save-cart')) return Promise.resolve(reponse(saveStatus))
    return Promise.resolve(reponse(200, checkoutCorps))
  })
}

/** Les appels réellement faits à save-cart, et à checkout. */
const appelsSaveCart = () =>
  mockFetch.mock.calls.filter(c => String(c[0]).includes('/api/boutique/save-cart'))
const appelsCheckout = () =>
  mockFetch.mock.calls.filter(c => String(c[0]).includes('/api/boutique/checkout'))

/** Le jeton RÉELLEMENT envoyé — seule source fiable, le cache mémoire du store
 *  survivant à un `localStorage.clear()`. */
function jetonEnvoye(): string {
  const appel = appelsSaveCart()[0]
  if (!appel) return ''
  return (JSON.parse(String(appel[1].body)) as { cart_token: string }).cart_token
}

/** Tout ce que la page a écrit dans la console. */
const journal = () =>
  [...warn.mock.calls, ...err.mock.calls, ...log.mock.calls].map(c => c.join(' ')).join('\n')

function rendrePanier() {
  localStorage.setItem('xenotif_cart', JSON.stringify([{ product: PRODUIT, quantity: 1 }]))
  renderWithIntl(<PanierPage />)
}

/** Saisit l'adresse puis QUITTE le champ : c'est le blur qui déclenche l'envoi. */
async function saisirAdresseEtQuitter() {
  const user = userEvent.setup()
  const champ = screen.getByRole('textbox')
  await user.click(champ)
  await user.type(champ, ADRESSE)
  await user.tab()
  return user
}

beforeEach(() => {
  jest.clearAllMocks()
  global.fetch = mockFetch as unknown as typeof fetch
  router(200)
  warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
  err = jest.spyOn(console, 'error').mockImplementation(() => {})
  log = jest.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => jest.restoreAllMocks())

describe('saveCartForRecovery — succès (C2)', () => {
  test('2xx : le panier est envoyé et RIEN n’est journalisé', async () => {
    rendrePanier()
    await saisirAdresseEtQuitter()

    expect(appelsSaveCart()).toHaveLength(1)
    expect(warn).not.toHaveBeenCalled()
    expect(err).not.toHaveBeenCalled()
  })

  test('le corps envoyé porte un jeton VALIDE au sens de la garde serveur', async () => {
    rendrePanier()
    await saisirAdresseEtQuitter()

    expect(jetonEnvoye()).toMatch(JETON_ATTENDU)
  })
})

describe('saveCartForRecovery — échecs contrôlés (C2)', () => {
  // 400 jeton invalide · 409 jeton rattaché ailleurs · 429 limite K.5 · 500 base.
  for (const status of [400, 409, 429, 500]) {
    test(`${status} : échec tracé une seule fois, sans détail interne`, async () => {
      router(status)
      rendrePanier()
      await saisirAdresseEtQuitter()

      expect(appelsSaveCart()).toHaveLength(1)
      expect(warn).toHaveBeenCalledTimes(1)
      expect(journal()).toContain(String(status))
      // Un échec de sauvegarde n'est pas une erreur de paiement : rien en
      // console.error, et rien n'est montré au visiteur.
      expect(err).not.toHaveBeenCalled()
    })
  }

  test('réseau injoignable : tracé aussi, et aucune exception ne s’échappe', async () => {
    mockFetch.mockRejectedValue(new Error('offline'))
    rendrePanier()
    await saisirAdresseEtQuitter()

    expect(warn).toHaveBeenCalledTimes(1)
    expect(journal()).toMatch(/réseau/i)
  })
})

describe('saveCartForRecovery — ce qui ne doit JAMAIS être journalisé (C2)', () => {
  test('ni le jeton, ni l’adresse, ni le contenu du panier', async () => {
    router(409)
    rendrePanier()
    await saisirAdresseEtQuitter()

    const trace = journal()
    const jeton = jetonEnvoye()

    // Le jeton est une capability : le journaliser reviendrait à le divulguer.
    expect(jeton).toMatch(JETON_ATTENDU)
    expect(trace).not.toContain(jeton)
    expect(trace).not.toContain(ADRESSE)
    expect(trace).not.toContain('exemple.fr')
    expect(trace).not.toContain(PRODUIT.id)
    expect(trace).not.toContain(PRODUIT.name)
    for (const fuite of ['PGRST', '42P01', '23505', 'constraint', 'abandoned_carts']) {
      expect(trace).not.toContain(fuite)
    }
  })
})

describe('saveCartForRecovery — n’interrompt JAMAIS le paiement (C2)', () => {
  test('save-cart en échec : le checkout est tout de même appelé', async () => {
    // save-cart échoue en 500 ; le checkout répond sans `url` pour éviter une
    // navigation jsdom — ce qui suffit à prouver qu'il a bien été atteint.
    router(500, { error: 'indisponible' })
    rendrePanier()
    const user = await saisirAdresseEtQuitter()

    await user.click(screen.getByRole('button', { name: /payer|pay/i }))

    expect(appelsCheckout()).toHaveLength(1)
    expect(appelsSaveCart().length).toBeGreaterThanOrEqual(1)
  })

  test('save-cart qui rejette : le checkout part quand même', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (String(url).includes('/api/boutique/save-cart')) return Promise.reject(new Error('offline'))
      return Promise.resolve(reponse(200, { error: 'indisponible' }))
    })
    rendrePanier()
    const user = await saisirAdresseEtQuitter()

    await user.click(screen.getByRole('button', { name: /payer|pay/i }))

    expect(appelsCheckout()).toHaveLength(1)
  })
})
