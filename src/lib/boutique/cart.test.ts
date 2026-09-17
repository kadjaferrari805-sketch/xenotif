/**
 * @jest-environment jsdom
 */
// Phase K8.4 — le jeton de panier est une capability : sa STABILITÉ est une
// propriété de sécurité autant que d'ergonomie. Un jeton qui tournerait à
// chaque rendu rendrait tout panier orphelin à la requête suivante.

const TOKEN_KEY = 'xenotif_cart_token'

/** Recharge le module pour repartir d'un cache mémoire vierge. */
async function chargerModule() {
  let mod!: typeof import('./cart')
  await jest.isolateModulesAsync(async () => {
    mod = await import('./cart')
  })
  return mod
}

beforeEach(() => {
  localStorage.clear()
  jest.restoreAllMocks()
})

describe('getCartToken — génération', () => {
  test('nouveau visiteur : un UUID v4 est généré et persisté', async () => {
    const { getCartToken } = await chargerModule()
    const token = getCartToken()

    expect(token).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    expect(localStorage.getItem(TOKEN_KEY)).toBe(token)
  })

  test('appels répétés : le jeton ne change jamais', async () => {
    const { getCartToken } = await chargerModule()
    const premier = getCartToken()

    for (let i = 0; i < 20; i++) expect(getCartToken()).toBe(premier)
  })

  test('rechargement de page : le jeton persisté est réutilisé', async () => {
    const { getCartToken } = await chargerModule()
    const avant = getCartToken()

    // Nouveau module = nouveau cache mémoire, mais même localStorage.
    const { getCartToken: apresRechargement } = await chargerModule()
    expect(apresRechargement()).toBe(avant)
  })

  test('localStorage vidé : un NOUVEAU jeton est généré', async () => {
    const { getCartToken } = await chargerModule()
    const avant = getCartToken()

    localStorage.clear()
    const { getCartToken: apresVidage } = await chargerModule()
    const apres = apresVidage()

    expect(apres).not.toBe(avant)
    expect(apres).toMatch(/^[0-9a-f-]{36}$/i)
  })

  test('deux « appareils » produisent des jetons distincts', async () => {
    const { getCartToken: a } = await chargerModule()
    const jetonA = a()
    localStorage.clear()
    const { getCartToken: b } = await chargerModule()

    expect(b()).not.toBe(jetonA)
  })
})

describe('getCartToken — indépendance du panier', () => {
  test('vider le panier ne change pas le jeton', async () => {
    const { getCartToken, clearCart } = await chargerModule()
    const avant = getCartToken()

    clearCart()

    expect(getCartToken()).toBe(avant)
    expect(localStorage.getItem(TOKEN_KEY)).toBe(avant)
  })

  test('le jeton vit sous une clé SÉPARÉE de celle du panier', async () => {
    const { getCartToken } = await chargerModule()
    getCartToken()

    expect(localStorage.getItem(TOKEN_KEY)).toBeTruthy()
    // La clé du panier ne doit jamais contenir le jeton.
    expect(localStorage.getItem('xenotif_cart') ?? '').not.toContain(localStorage.getItem(TOKEN_KEY)!)
  })
})

describe('getCartToken — robustesse', () => {
  test('stockage indisponible : un jeton de session est tout de même fourni', async () => {
    const { getCartToken } = await chargerModule()
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('quota') })
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota') })

    const token = getCartToken()
    expect(token).toMatch(/^[0-9a-f-]{36}$/i)
    // Et il reste stable pour la session en cours.
    expect(getCartToken()).toBe(token)
  })

  test('le jeton n’est jamais journalisé', async () => {
    const log = jest.spyOn(console, 'log').mockImplementation(() => {})
    const err = jest.spyOn(console, 'error').mockImplementation(() => {})
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})

    const { getCartToken } = await chargerModule()
    getCartToken()

    expect(log).not.toHaveBeenCalled()
    expect(err).not.toHaveBeenCalled()
    expect(warn).not.toHaveBeenCalled()
  })
})
