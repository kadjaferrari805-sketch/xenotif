import { BRAND, FEATURES, REVIEWS, TRUST_ITEMS, STATS } from './constants'

describe('constants', () => {
  it('brand has required fields', () => {
    expect(BRAND.name).toBe('Xenotif®')
    expect(BRAND.programs).toBe(9)
  })

  // Phase 09.3 : BRAND ne doit plus porter d'audience ni de note agregee - ces
  // valeurs (12 400 membres, 4,9/5, 3 200 avis) ne correspondaient a aucune
  // donnee reelle.
  it('brand carries no unverifiable audience or rating claim', () => {
    expect(BRAND).not.toHaveProperty('members')
    expect(BRAND).not.toHaveProperty('rating')
    expect(BRAND).not.toHaveProperty('reviewCount')
  })

  it('features has 10 items', () => {
    expect(FEATURES).toHaveLength(10)
    FEATURES.forEach((f) => {
      expect(f.icon).toBeTruthy()
      expect(f.title).toBeTruthy()
      expect(f.description).toBeTruthy()
    })
  })

  // Phase 09.3 : les 3 temoignages etaient fabriques (noms, resultats, citations).
  // Tant qu'aucun avis reel n'est disponible, le tableau reste vide et
  // Reviews.tsx masque la section.
  it('reviews carries no fabricated testimonial', () => {
    expect(REVIEWS).toHaveLength(0)
  })

  it('trust items has 4 entries', () => {
    expect(TRUST_ITEMS).toHaveLength(4)
  })

  it('stats has 4 entries', () => {
    expect(STATS).toHaveLength(4)
  })
})
