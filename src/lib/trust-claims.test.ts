/**
 * @jest-environment node
 */
// Phase 09.3 — Trust & Legal.
//
// L'audit 09.1 a confronté les allégations du site aux données de Production :
// « 12 000+ athlètes » contre 19 comptes, « 3 200 avis · 4,9/5 » contre 1 avis,
// et trois témoignages entièrement fabriqués (noms, résultats, citations).
// Ces tests verrouillent la correction pour qu'aucune de ces affirmations ne
// puisse revenir par un remontage de composant ou une retraduction.
//
// Ils NE testent PAS le rendu : ils portent sur les sources de contenu
// réellement consommées par les pages (messages i18n + registres statiques).

import fr from '../../messages/fr.json'
import en from '../../messages/en.json'
import de from '../../messages/de.json'
import { BRAND, STATS, REVIEWS, TRUST_ITEMS, FEATURES } from './constants'
import { DISCIPLINE_SLUGS } from './disciplines-nav'

type Noeud = Record<string, unknown>

/** Aplatit un arbre de messages en couples [chemin, texte]. */
function textes(obj: Noeud, prefixe = ''): [string, string][] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const chemin = prefixe ? `${prefixe}.${k}` : k
    if (v && typeof v === 'object') return textes(v as Noeud, chemin)
    return typeof v === 'string' ? ([[chemin, v]] as [string, string][]) : []
  })
}

const LOCALES: Record<string, Noeud> = { fr, en, de }

// Audiences, notes agrégées et volumes qui ne correspondaient à aucune donnée.
const ALLEGATIONS_INTERDITES = [
  /12[\s.,]?000/,
  /\b12K\+/,
  /\b12400\b/,
  /3[\s.,]?200/,
  /4[.,]9\s*\/\s*5/,
  /\+\s?\d[\d\s.,]*\s?(membres|members|Mitglieder|athlètes|athletes|Athleten|coureurs|runners|Läufer)/i,
  /des milliers de/i,
  /thousands of/i,
  /Tausenden von/i,
]

describe('A. aucune allégation d’audience ou de note non vérifiable dans les messages', () => {
  for (const [loc, messages] of Object.entries(LOCALES)) {
    it(`${loc}.json ne contient aucune statistique problématique`, () => {
      const fautifs = textes(messages as Noeud).filter(([, texte]) =>
        ALLEGATIONS_INTERDITES.some(motif => motif.test(texte)),
      )

      expect(fautifs).toEqual([])
    })
  }

  it('le motif de détection fonctionne (témoin)', () => {
    // Sans ce témoin, un motif cassé ferait passer les tests ci-dessus pour de
    // mauvaises raisons — l'absence de résultat ne prouverait rien.
    const temoin = 'Rejoins 12 000+ athlètes · 4,9/5 sur 3 200 avis'
    expect(ALLEGATIONS_INTERDITES.some(m => m.test(temoin))).toBe(true)
  })
})

describe('A bis. les registres statiques ne portent plus de chiffres fabriqués', () => {
  it('BRAND ne déclare ni audience ni note agrégée', () => {
    expect(BRAND).not.toHaveProperty('members')
    expect(BRAND).not.toHaveProperty('rating')
    expect(BRAND).not.toHaveProperty('reviewCount')
  })

  it('aucun témoignage fabriqué', () => {
    // Les 3 précédents (« Thomas D. », « Leila M. », « Nicolas R. ») étaient
    // inventés, résultats compris. Aucun avis réel ne pouvait les remplacer.
    expect(REVIEWS).toHaveLength(0)
  })

  it('STATS et TRUST_ITEMS ne citent aucun effectif', () => {
    const tous = [
      ...STATS.map(s => `${s.value} ${s.label}`),
      ...TRUST_ITEMS.map(t => `${t.label} ${t.sublabel}`),
    ]

    for (const texte of tous) {
      expect(ALLEGATIONS_INTERDITES.some(m => m.test(texte))).toBe(false)
    }
  })

  it('les statistiques de discipline affichées sur /disciplines/[slug] sont factuelles', () => {
    for (const f of FEATURES) {
      for (const stat of f.stats) {
        expect(ALLEGATIONS_INTERDITES.some(m => m.test(stat))).toBe(false)
      }
    }
  })
})

describe('B. la garantie 30 jours est CONSERVÉE et conforme aux CGV', () => {
  // Point important : l'audit 09.1 avait signalé à tort une contradiction entre
  // le Hero et les CGV. L'article 10 des CGV accorde bien une garantie
  // commerciale « satisfait ou remboursé » de 30 jours sur l'abonnement Pro ET
  // les guides digitaux, en FR, EN et DE. La promesse est donc exacte : ces
  // tests empêchent qu'on la supprime par excès de prudence.
  const ATTENDU: Record<string, RegExp> = {
    fr: /30 jours/i,
    en: /30[- ]day/i,
    de: /30 Tage/i,
  }

  for (const [loc, messages] of Object.entries(LOCALES)) {
    it(`${loc} conserve la garantie 30 jours`, () => {
      const garantie = (messages as { trust: { guarantee: string } }).trust.guarantee

      expect(garantie).toMatch(ATTENDU[loc])
    })

    it(`${loc} ne promet pas de résultats garantis sous 30 jours`, () => {
      // « Résultats dès 30 jours » était une promesse de RÉSULTAT, distincte de
      // la garantie de remboursement et invérifiable.
      const fautifs = textes(messages as Noeud).filter(([chemin, texte]) =>
        chemin.startsWith('home.hero') && /résultats|results|Ergebnisse/i.test(texte) && /30/.test(texte),
      )

      expect(fautifs).toEqual([])
    })
  }
})

describe('C. parité stricte des clés FR / EN / DE', () => {
  function chemins(obj: Noeud, prefixe = ''): string[] {
    return Object.entries(obj).flatMap(([k, v]) => {
      const chemin = prefixe ? `${prefixe}.${k}` : k
      return v && typeof v === 'object' && !Array.isArray(v)
        ? chemins(v as Noeud, chemin)
        : [chemin]
    })
  }

  const clesFr = new Set(chemins(fr as Noeud))

  for (const loc of ['en', 'de'] as const) {
    it(`${loc}.json a exactement les mêmes clés que fr.json`, () => {
      const cles = new Set(chemins(LOCALES[loc] as Noeud))
      const manquantes = [...clesFr].filter(k => !cles.has(k))
      const orphelines = [...cles].filter(k => !clesFr.has(k))

      expect({ manquantes, orphelines }).toEqual({ manquantes: [], orphelines: [] })
    })
  }
})

describe('D. les remplacements s’appuient sur des faits vérifiables', () => {
  it('« 10 disciplines » correspond au registre réel', () => {
    // Seule allégation chiffrée conservée : elle est vraie.
    expect(DISCIPLINE_SLUGS).toHaveLength(10)
    expect(STATS.find(s => /Disciplines/i.test(s.label))?.value).toBe('10')
  })

  it('le nombre de programmes annoncé correspond au registre réel', () => {
    expect(BRAND.programs).toBe(9)
    expect(STATS.find(s => /Programmes/i.test(s.label))?.value).toBe('9')
  })

  it('l’agrégat d’avis est vide, donc aucun aggregateRating n’est émis', () => {
    // AppRatingSchema lit home.reviews.summary et retourne null si reviewCount
    // n'est pas un entier > 0. Vider `count` suffit à cesser de déclarer une
    // note agrégée à Google, sans toucher au composant.
    for (const [loc, messages] of Object.entries(LOCALES)) {
      const resume = (messages as { home: { reviews: { summary: { count: string; rating: string } } } })
        .home.reviews.summary
      const compte = parseInt(String(resume.count).replace(/[^\d]/g, ''), 10)

      expect(Number.isInteger(compte) && compte > 0).toBe(false)
      expect(resume.rating).toBe('')
      expect(loc).toBeTruthy()
    }
  })

  it('les sections d’avis sont vides dans les trois langues', () => {
    for (const messages of Object.values(LOCALES)) {
      const avis = (messages as { home: { reviews: { items: unknown[]; results: unknown[] } } }).home.reviews

      expect(avis.items).toHaveLength(0)
      expect(avis.results).toHaveLength(0)
    }
  })
})
