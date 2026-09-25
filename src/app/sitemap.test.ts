/**
 * @jest-environment node
 */
import sitemap from './sitemap'
import { routing } from '@/i18n/routing'

/**
 * Phase 09.8.4 — trois pages publiques (liées par Nav/Footer) manquaient au
 * sitemap. Ce test verrouille leur présence ET la non-régression du reste :
 * priorités existantes inchangées, aucune URL dupliquée, alternates hreflang
 * cohérents avec `localePrefix: 'as-needed'` (FR à la racine, /en et /de
 * préfixés).
 */
const BASE = 'https://xenotif.com'

const entrees = sitemap()
const parUrl = (url: string) => entrees.find((e) => e.url === url)

describe('sitemap — routes publiques ajoutées en 09.8.4', () => {
  it.each([
    ['/coaching', 0.7],
    ['/communaute', 0.6],
    ['/nutrition', 0.7],
  ])('%s est présente avec la priorité %s', (chemin, priorite) => {
    const e = parUrl(`${BASE}${chemin}`)
    expect(e).toBeDefined()
    expect(e!.priority).toBe(priorite)
    expect(e!.changeFrequency).toBe('monthly')
  })

  it.each(['/coaching', '/communaute', '/nutrition'])(
    '%s porte les alternates des 3 locales, FR sans préfixe',
    (chemin) => {
      const langues = parUrl(`${BASE}${chemin}`)!.alternates!.languages!
      expect(Object.keys(langues).sort()).toEqual([...routing.locales].sort())
      expect(langues.fr).toBe(`${BASE}${chemin}`)
      expect(langues.en).toBe(`${BASE}/en${chemin}`)
      expect(langues.de).toBe(`${BASE}/de${chemin}`)
    },
  )
})

describe('sitemap — non-régression', () => {
  it.each([
    ['/', 1.0],
    ['/boutique', 0.9],
    ['/blog', 0.9],
    ['/disciplines', 0.8],
    ['/dashboard-preview', 0.7],
    ['/contact', 0.5],
    ['/a-propos', 0.6],
  ])('%s conserve sa priorité %s', (chemin, priorite) => {
    const url = chemin === '/' ? BASE : `${BASE}${chemin}`
    expect(parUrl(url)?.priority).toBe(priorite)
  })

  it('les hubs programmes et exercices restent publiés', () => {
    expect(parUrl(`${BASE}/programmes`)).toBeDefined()
    expect(parUrl(`${BASE}/exercices`)).toBeDefined()
  })

  it('aucune URL n’est dupliquée', () => {
    const urls = entrees.map((e) => e.url)
    expect(new Set(urls).size).toBe(urls.length)
  })

  it('toute entrée porte une URL absolue sur le domaine de production', () => {
    for (const e of entrees) expect(e.url.startsWith(`${BASE}/`) || e.url === BASE).toBe(true)
  })

  it('contrôle négatif : une route jamais publiée reste absente', () => {
    // Garde contre un `parUrl` qui retournerait n'importe quoi.
    expect(parUrl(`${BASE}/route-inexistante`)).toBeUndefined()
  })
})
