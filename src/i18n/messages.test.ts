import fr from '../../messages/fr.json'
import en from '../../messages/en.json'
import de from '../../messages/de.json'
import itMessages from '../../messages/it.json'
import es from '../../messages/es.json'
import { locales } from './routing'

function keyPaths(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const path = prefix ? `${prefix}.${k}` : k
    return v && typeof v === 'object' && !Array.isArray(v)
      ? keyPaths(v as Record<string, unknown>, path)
      : [path]
  })
}

const byLocale: Record<string, Record<string, unknown>> = { fr, en, de, it: itMessages, es }

describe('messages key integrity', () => {
  const frKeys = new Set(keyPaths(fr))

  it('couvre exactement les 5 locales', () => {
    expect(Object.keys(byLocale).sort()).toEqual([...locales].sort())
  })

  for (const loc of ['en', 'de', 'it', 'es']) {
    it(`${loc}.json a exactement les mêmes clés que fr.json`, () => {
      const locKeys = new Set(keyPaths(byLocale[loc]))
      const missing = [...frKeys].filter(k => !locKeys.has(k))
      const orphan = [...locKeys].filter(k => !frKeys.has(k))
      expect({ missing, orphan }).toEqual({ missing: [], orphan: [] })
    })
  }
})
