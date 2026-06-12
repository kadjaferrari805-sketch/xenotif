import fr from '../../../messages/fr.json'

describe('Honnêteté des statistiques', () => {
  const blob = JSON.stringify(fr)
  it('ne contient plus de comptes d’utilisateurs inventés', () => {
    expect(blob).not.toContain('12 000+')
    expect(blob).not.toContain('12K+')
    expect(blob).not.toContain('+12 000')
    expect(blob).not.toMatch(/\+\s?\d[\d ]*\s?(coureurs|nageurs|boxeurs|cyclistes|pratiquants|membres|athlètes)/)
    expect(blob).not.toContain('3 200+ avis')
    expect(blob).not.toContain('3 200 avis')
  })
})
