import { BRAND, FEATURES, REVIEWS, TRUST_ITEMS, STATS } from './constants'

describe('constants', () => {
  it('brand has required fields', () => {
    expect(BRAND.name).toBe('Xenotif')
    expect(BRAND.rating).toBe(4.9)
    expect(BRAND.members).toBe(12400)
  })

  it('features has 6 items', () => {
    expect(FEATURES).toHaveLength(6)
    FEATURES.forEach((f) => {
      expect(f.icon).toBeTruthy()
      expect(f.title).toBeTruthy()
      expect(f.description).toBeTruthy()
    })
  })

  it('reviews has 3 items with required fields', () => {
    expect(REVIEWS).toHaveLength(3)
    REVIEWS.forEach((r) => {
      expect(r.name).toBeTruthy()
      expect(r.text).toBeTruthy()
      expect(r.rating).toBe(5)
    })
  })

  it('trust items has 4 entries', () => {
    expect(TRUST_ITEMS).toHaveLength(4)
  })

  it('stats has 4 entries', () => {
    expect(STATS).toHaveLength(4)
  })
})
