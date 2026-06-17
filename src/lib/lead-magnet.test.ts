import { getFreeProgram } from './lead-magnet'
import { generateGuidePdf } from './boutique/guide-pdf'

describe('lead magnet — free program', () => {
  it('exposes a localized guide for fr/en/de (fallback fr)', () => {
    expect(getFreeProgram('fr').title).toMatch(/Découverte/i)
    expect(getFreeProgram('en').title).toMatch(/Starter/i)
    expect(getFreeProgram('de').title).toMatch(/Einsteiger/i)
    // locale inconnue → repli français
    expect(getFreeProgram('xx').title).toMatch(/Découverte/i)
  })

  it('generates a valid non-empty PDF', async () => {
    const bytes = await generateGuidePdf(getFreeProgram('fr'), 'fr')
    expect(bytes.length).toBeGreaterThan(2000)
    // En-tête de fichier PDF : %PDF
    const header = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3])
    expect(header).toBe('%PDF')
  })
})
