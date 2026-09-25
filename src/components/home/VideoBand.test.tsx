import { renderWithIntl } from '@/test/intl'

/**
 * Phase 09.8.4 — `prefers-reduced-motion` sur la bande vidéo de l'accueil.
 *
 * DOUBLE LOCAL DE `react-intersection-observer` : `jest.setup.ts` neutralise
 * `IntersectionObserver` avec un `observe()` vide, si bien que `inView` ne
 * passe JAMAIS à `true` en test — l'élément <video> ne serait jamais monté et
 * toutes les assertions seraient vertes sans rien prouver. Le double pilote
 * donc `inView`, et journalise les options reçues : c'est ce qui permet
 * d'affirmer que le mécanisme de chargement différé n'a pas été altéré.
 */
let mockInView = false
const mockOptions: unknown[] = []
jest.mock('react-intersection-observer', () => ({
  useInView: (options: unknown) => {
    mockOptions.push(options)
    return { ref: () => {}, inView: mockInView }
  },
}))

import { VideoBand } from './VideoBand'

/** Pilote la requête média ; `jest.setup.ts` la déclare `writable`. */
function definirReductionAnimations(reduire: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: reduire && query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}

beforeEach(() => {
  mockInView = false
  mockOptions.length = 0
  definirReductionAnimations(false)
})

// ─── 1. Comportement inchangé sans préférence de réduction ────────────────

describe('VideoBand — no-preference : comportement d’origine préservé', () => {
  it('monte la vidéo une fois la section en vue', () => {
    mockInView = true
    const { container } = renderWithIntl(<VideoBand />)

    const video = container.querySelector('video')
    expect(video).not.toBeNull()
    expect(video).toHaveAttribute('autoplay')
    // `muted` n'est PAS reflété en attribut par React : il est posé comme
    // PROPRIÉTÉ du nœud DOM (contrairement à `autoPlay`/`playsInline`).
    // Une assertion d'attribut serait un faux négatif sur un composant correct.
    expect((video as HTMLVideoElement).muted).toBe(true)
    expect(video).toHaveAttribute('playsinline')
    expect(video).toHaveAttribute('preload', 'none')
    expect(video).toHaveAttribute('poster', '/home/runner-poster.jpg')
    expect(container.querySelector('source')).toHaveAttribute('src', '/home/runner.mp4')
  })

  it('ne monte rien tant que la section n’est pas en vue', () => {
    mockInView = false
    const { container } = renderWithIntl(<VideoBand />)

    expect(container.querySelector('video')).toBeNull()
    // Le MP4 n'est pas même référencé dans le document.
    expect(container.innerHTML).not.toContain('runner.mp4')
    expect(container.querySelector('div[style*="runner-poster.jpg"]')).not.toBeNull()
  })
})

// ─── 2. reduce : pas de lecture automatique, poster conservé ──────────────

describe('VideoBand — prefers-reduced-motion: reduce', () => {
  it('ne monte PAS la vidéo, même section en vue', () => {
    definirReductionAnimations(true)
    mockInView = true
    const { container } = renderWithIntl(<VideoBand />)

    expect(container.querySelector('video')).toBeNull()
  })

  it('ne charge pas le MP4 : la source n’est jamais référencée', () => {
    definirReductionAnimations(true)
    mockInView = true
    const { container } = renderWithIntl(<VideoBand />)

    expect(container.querySelector('source')).toBeNull()
    expect(container.innerHTML).not.toContain('runner.mp4')
  })

  it('conserve le poster', () => {
    definirReductionAnimations(true)
    mockInView = true
    const { container } = renderWithIntl(<VideoBand />)

    expect(container.querySelector('div[style*="runner-poster.jpg"]')).not.toBeNull()
  })

  it('ne supprime aucun contenu essentiel', () => {
    definirReductionAnimations(true)
    mockInView = true
    const { getByRole } = renderWithIntl(<VideoBand />)

    expect(getByRole('heading', { level: 2 })).toBeInTheDocument()
    expect(getByRole('link', { name: /commencer gratuitement/i })).toBeInTheDocument()
    expect(getByRole('region')).toBeInTheDocument()
  })

  it('le rendu hors vue est IDENTIQUE dans les deux modes : aucun basculement visuel', () => {
    mockInView = false
    definirReductionAnimations(false)
    const sansReduction = renderWithIntl(<VideoBand />).container.innerHTML

    definirReductionAnimations(true)
    const avecReduction = renderWithIntl(<VideoBand />).container.innerHTML

    expect(avecReduction).toBe(sansReduction)
  })
})

// ─── 3. Les mécanismes validés en 09.8.3 ne doivent PAS bouger ────────────

describe('VideoBand — mécanismes de chargement différé inchangés', () => {
  it.each([false, true])(
    'useInView garde triggerOnce + rootMargin 300px (réduction = %s)',
    (reduire) => {
      definirReductionAnimations(reduire)
      mockInView = true
      renderWithIntl(<VideoBand />)

      expect(mockOptions[0]).toEqual({ triggerOnce: true, rootMargin: '300px' })
    },
  )
})
