import { validateImage, extFromType, MAX_IMAGE_BYTES } from './transformations'

describe('validateImage', () => {
  it('rejette l’absence de fichier', () => {
    expect(validateImage(null).reason).toBe('missing')
  })
  it('rejette un type non-image', () => {
    expect(validateImage({ type: 'application/pdf', size: 100 }).reason).toBe('type')
  })
  it('rejette > 5 Mo', () => {
    expect(validateImage({ type: 'image/jpeg', size: MAX_IMAGE_BYTES + 1 }).reason).toBe('size')
  })
  it('accepte une image valide', () => {
    expect(validateImage({ type: 'image/jpeg', size: 1000 }).ok).toBe(true)
  })
  it('déduit l’extension', () => {
    expect(extFromType('image/png')).toBe('png')
    expect(extFromType('image/jpeg')).toBe('jpg')
  })
})
