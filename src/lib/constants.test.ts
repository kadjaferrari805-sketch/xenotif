import { PRODUCT, FEATURES, REVIEWS, TRUST_ITEMS } from './constants'

describe('constants', () => {
  it('product has required fields', () => {
    expect(PRODUCT.name).toBe('neckZen Massage Pro')
    expect(PRODUCT.price).toBe(79.90)
    expect(PRODUCT.oldPrice).toBe(119.90)
    expect(PRODUCT.rating).toBe(4.9)
    expect(PRODUCT.reviewCount).toBe(248)
  })

  it('features has 6 items', () => {
    expect(FEATURES).toHaveLength(6)
    FEATURES.forEach(f => {
      expect(f.icon).toBeTruthy()
      expect(f.title).toBeTruthy()
      expect(f.description).toBeTruthy()
    })
  })

  it('reviews has 3 items with required fields', () => {
    expect(REVIEWS).toHaveLength(3)
    REVIEWS.forEach(r => {
      expect(r.name).toBeTruthy()
      expect(r.text).toBeTruthy()
      expect(r.rating).toBe(5)
    })
  })

  it('trust items has 4 entries', () => {
    expect(TRUST_ITEMS).toHaveLength(4)
  })
})
