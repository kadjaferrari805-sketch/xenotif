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

// ─── K8.6.1 — finding C1 : validation de la valeur stockée ─────────
//
// `localStorage` est écrivable par l'utilisateur, par une extension, ou
// corruptible par une collision de clé. Avant ce correctif la valeur relue
// était renvoyée TELLE QUELLE : un jeton altéré partait vers save-cart, qui le
// rejetait en 400 — et, le jeton ne tournant jamais, le panier de ce visiteur
// n'était PLUS JAMAIS enregistré, sans aucun signal.
describe('getCartToken — validation de la valeur stockée (C1)', () => {
  /** L'écriture EXACTE de la garde serveur (save-cart/route.ts:18). */
  const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  const VALIDE = '3f2504e0-4f89-41d3-9a0c-0305e82c3301'

  test('valeur UUID v4 VALIDE : conservée exactement', async () => {
    localStorage.setItem(TOKEN_KEY, VALIDE)

    const { getCartToken } = await chargerModule()

    expect(getCartToken()).toBe(VALIDE)
    expect(localStorage.getItem(TOKEN_KEY)).toBe(VALIDE)
  })

  test('valeur CORROMPUE : un nouveau jeton est généré ET persisté', async () => {
    localStorage.setItem(TOKEN_KEY, 'pas-un-uuid')

    const { getCartToken } = await chargerModule()
    const token = getCartToken()

    expect(token).not.toBe('pas-un-uuid')
    expect(token).toMatch(UUID_V4)
    // La valeur cassée est REMPLACÉE : le prochain chargement repart sain.
    expect(localStorage.getItem(TOKEN_KEY)).toBe(token)
  })

  test('toutes les formes de corruption sont rattrapées', async () => {
    const corrompus = [
      '',                                        // vide
      '   ',                                     // blancs
      'null',                                    // sérialisation ratée
      'undefined',
      '{"token":"3f2504e0-4f89-41d3-9a0c-0305e82c3301"}', // JSON au lieu du brut
      '3f2504e0-4f89-11d3-9a0c-0305e82c3301',    // UUID v1, pas v4
      '3f2504e0-4f89-41d3-ca0c-0305e82c3301',    // variant invalide (c au lieu de 8/9/a/b)
      '3f2504e0-4f89-41d3-9a0c-0305e82c33',      // tronqué
      `${VALIDE} `,                              // espace final
      `<script>${VALIDE}</script>`,              // injection
    ]

    for (const mauvais of corrompus) {
      localStorage.clear()
      localStorage.setItem(TOKEN_KEY, mauvais)

      const { getCartToken } = await chargerModule()
      const token = getCartToken()

      expect(token).toMatch(UUID_V4)
      expect(token).not.toBe(mauvais)
      expect(localStorage.getItem(TOKEN_KEY)).toBe(token)
    }
  })

  test('clé absente : un jeton est généré et persisté', async () => {
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()

    const { getCartToken } = await chargerModule()
    const token = getCartToken()

    expect(token).toMatch(UUID_V4)
    expect(localStorage.getItem(TOKEN_KEY)).toBe(token)
  })

  test('le jeton rendu satisfait TOUJOURS la garde serveur', async () => {
    // C'est la propriété qui compte : ce que le client envoie doit être
    // accepté par /api/boutique/save-cart. Sinon le panier n'est jamais sauvé.
    for (const depart of [null, 'casse', VALIDE]) {
      localStorage.clear()
      if (depart !== null) localStorage.setItem(TOKEN_KEY, depart)

      const { getCartToken } = await chargerModule()

      expect(getCartToken()).toMatch(UUID_V4)
    }
  })

  test('le jeton n’apparaît dans AUCUNE URL', async () => {
    const { getCartToken } = await chargerModule()
    const token = getCartToken()

    expect(window.location.href).not.toContain(token)
    expect(window.location.search).toBe('')
    expect(window.location.hash).toBe('')
  })

  test('une valeur corrompue n’est jamais journalisée', async () => {
    const log = jest.spyOn(console, 'log').mockImplementation(() => {})
    const err = jest.spyOn(console, 'error').mockImplementation(() => {})
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    localStorage.setItem(TOKEN_KEY, 'valeur-corrompue-a-ne-pas-journaliser')

    const { getCartToken } = await chargerModule()
    getCartToken()

    expect(log).not.toHaveBeenCalled()
    expect(err).not.toHaveBeenCalled()
    expect(warn).not.toHaveBeenCalled()
  })
})
