/**
 * @jest-environment node
 */
// Phase 09.3 — Trust & Legal, durci en 09.3.1.
//
// L'audit 09.1 a confronté les allégations du site aux données de Production :
// « 12 000+ athlètes » contre 19 comptes, « 3 200 avis · 4,9/5 » contre 1 avis,
// et trois témoignages entièrement fabriqués (noms, résultats, citations).
//
// La revue de PR 09.3 a ensuite montré que la première passe était INCOMPLÈTE :
// les `stats` de DISCIPLINE_META_EN/DE restaient fabriquées et RENDUES en
// production, les volumes de catalogue (« 120+ plans », « 365 WODs/an »)
// subsistaient, et la fiche produit déclarait un aggregateRating à Google.
// Ces tests couvrent désormais les trois familles, pour que la même omission
// ne puisse pas se reproduire.
//
// Ils NE testent PAS le rendu : ils portent sur les sources de contenu
// réellement consommées par les pages (messages i18n + registres statiques).

import fs from 'node:fs'
import path from 'node:path'
import fr from '../../messages/fr.json'
import en from '../../messages/en.json'
import de from '../../messages/de.json'
import { BRAND, STATS, REVIEWS, TRUST_ITEMS, FEATURES } from './constants'
import { DISCIPLINE_SLUGS } from './disciplines-nav'
import { getDisciplineMeta } from './disciplines'

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

// ── A. Audiences, notes agrégées et témoignages inventés ──────────────────
const ALLEGATIONS_INTERDITES = [
  /12[\s.,]?000/,
  /\b12K\+/,
  /\b12400\b/,
  /3[\s.,]?200/,
  /4[.,]9\s*\/\s*5/,
  /4[.,]8\s*\/\s*5/,
  /\b97\s?%/,
  /4[.,]2\s?[×x]/,
  /\+\s?\d[\d\s.,]*\s?(membres|members|Mitglieder|athlètes|athletes|Athleten|coureurs|runners|Läufer|cyclistes|cyclists|Radfahrer|nageurs|swimmers|Schwimmer|boxeurs|boxers|Boxer|pratiquants|practitioners|Praktizierende)/i,
  /des milliers de/i,
  /thousands of/i,
  /Tausenden von/i,
  /Thomas D\.|Leila M\.|Nicolas R\./,
]

// ── B. Volumes de catalogue non vérifiés ──────────────────────────────────
//
// LE DISCRIMINANT EST LE « + », pas le nombre. Une allégation de catalogue
// s'écrit « 120+ plans » ; un objectif utilisateur s'écrit « 30 séances ».
// Un motif fondé sur la seule taille du nombre confondrait les deux — c'est
// l'erreur qu'a révélée le badge gamification « 30 séances » en 09.3.1.
//
// Attrape : « 120+ plans », « 50+ programmes », « 300+ séances », « 90+ Programme »
//           et « 365 WODs/an », seul volume rédigé sans « + ».
//
// Laisse passer :
//   « 9 programmes », « 10 disciplines »   → pas de « + » : faits vérifiés
//   « 30 séances » (badge gamification)    → objectif, pas promesse de catalogue
//   « 7 jours », « 3 langues »             → unités absentes de la liste
//   « 12 000 pas », « 1400-3200 percussions/minute » → unités absentes
//   « 20-30 min / séance »                 → le nombre n'est pas collé à l'unité
const UNITES_CATALOGUE =
  'plans?|programmes?|programs?|Programme|Pläne|circuits?|Circuits|séquences?|sequences?|Sequenzen|routines?|Routinen|séances?|sessions?|Einheiten|WODs?'
const VOLUME_NON_VERIFIE = new RegExp(
  // « 120+ plans », « 50+ programmes », « 300+ séances » : le « + » signale
  // l'allégation de catalogue. Sans lui, « 30 séances » est un objectif
  // utilisateur légitime (badge gamification), pas une promesse de volume.
  String.raw`\b\d{2,}\s*\+\s*(?:${UNITES_CATALOGUE})\b` +
    // « 365 WODs/an » : seul volume rédigé sans « + ».
    String.raw`|\b365\s*WODs?\b`,
  'i',
)

describe('A. aucune allégation d’audience ou de note non vérifiable', () => {
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

describe('B. aucun volume de catalogue non vérifié', () => {
  for (const [loc, messages] of Object.entries(LOCALES)) {
    it(`${loc}.json ne promet aucun volume fabriqué`, () => {
      const fautifs = textes(messages as Noeud).filter(([, texte]) => VOLUME_NON_VERIFIE.test(texte))

      expect(fautifs).toEqual([])
    })
  }

  it('attrape bien les formulations fautives (témoin positif)', () => {
    for (const fautif of ['120+ plans', '365 WODs/an', '300+ séances', '50+ programmes', '90+ Programme']) {
      expect(VOLUME_NON_VERIFIE.test(fautif)).toBe(true)
    }
  })

  it('laisse passer les chiffres légitimes (témoin négatif)', () => {
    // Le test doit cibler la preuve sociale et le catalogue, pas tous les
    // nombres. Un motif trop large bloquerait du contenu vrai.
    for (const legitime of [
      '9 programmes',
      '10 disciplines',
      '3 langues',
      '7 jours',
      'Essai Pro 7 jours',
      'Marche quotidienne (8 000-12 000 pas)',
      'vibrations à haute fréquence (1400-3200 percussions/minute)',
      '20-30 min / séance',
      // Badge gamification : un OBJECTIF utilisateur, pas un volume de
      // catalogue. C'est l'absence de « + » qui les sépare.
      '30 séances',
      '30 sessions',
      '30 Einheiten',
    ]) {
      expect(VOLUME_NON_VERIFIE.test(legitime)).toBe(false)
    }
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
      expect(VOLUME_NON_VERIFIE.test(texte)).toBe(false)
    }
  })

  it('les statistiques de discipline affichées sur /disciplines/[slug] sont factuelles', () => {
    for (const f of FEATURES) {
      for (const stat of f.stats) {
        expect(ALLEGATIONS_INTERDITES.some(m => m.test(stat))).toBe(false)
        expect(VOLUME_NON_VERIFIE.test(stat)).toBe(false)
      }
    }
  })
})

describe('C. DISCIPLINE_META dans les trois langues', () => {
  // 09.3.1 : ce bloc manquait. Les métadonnées EN et DE portaient toujours
  // « +4,200 runners » et « +1.800 Athleten », vérifiés AFFICHÉS en production
  // sur /en/disciplines/* et /de/disciplines/*, alors que le FR était corrigé.
  for (const locale of ['fr', 'en', 'de'] as const) {
    it(`les stats ${locale} sont factuelles pour les 10 disciplines`, () => {
      const fautifs: { slug: string; stat: string }[] = []

      for (const { slug } of DISCIPLINE_SLUGS) {
        const meta = getDisciplineMeta(slug, locale)
        expect(meta).toBeDefined()

        for (const stat of meta!.stats) {
          if (ALLEGATIONS_INTERDITES.some(m => m.test(stat)) || VOLUME_NON_VERIFIE.test(stat)) {
            fautifs.push({ slug, stat })
          }
        }
      }

      expect(fautifs).toEqual([])
    })
  }

  it('les trois langues gardent la même structure de stats', () => {
    for (const { slug } of DISCIPLINE_SLUGS) {
      const tailles = (['fr', 'en', 'de'] as const).map(l => getDisciplineMeta(slug, l)!.stats.length)

      expect(new Set(tailles).size).toBe(1)
    }
  })
})

describe('D. aucun aggregateRating artificiel', () => {
  it('la page produit ne déclare plus de note agrégée à Google', () => {
    // `product.rating` / `product.reviews` viennent de fiches tierces (jusqu'à
    // 89 432 avis). La page n'affiche que les avis Xenotif réels : déclarer
    // ces valeurs en JSON-LD exposerait une note injustifiable.
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src/app/[locale]/boutique/[slug]/page.tsx'),
      'utf8',
    )

    expect(source).not.toMatch(/aggregateRating:/)
    expect(source).not.toMatch(/ratingValue:/)
    expect(source).not.toMatch(/reviewCount:/)
  })

  it('le JSON-LD Product reste valide et exploitable', () => {
    // Retirer la note ne doit pas casser les extraits enrichis prix/stock.
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src/app/[locale]/boutique/[slug]/page.tsx'),
      'utf8',
    )

    expect(source).toMatch(/'@type': 'Product'/)
    expect(source).toMatch(/'@type': 'Offer'/)
    expect(source).toMatch(/'@type': 'Brand'/)
  })

  it('l’agrégat d’avis de l’accueil est vide, donc AppRatingSchema retourne null', () => {
    // AppRatingSchema lit home.reviews.summary et retourne null si reviewCount
    // n'est pas un entier > 0. Vider `count` suffit à cesser de déclarer une
    // note agrégée, sans toucher au composant.
    for (const messages of Object.values(LOCALES)) {
      const resume = (messages as { home: { reviews: { summary: { count: string; rating: string } } } })
        .home.reviews.summary
      const compte = parseInt(String(resume.count).replace(/[^\d]/g, ''), 10)

      expect(Number.isInteger(compte) && compte > 0).toBe(false)
      expect(resume.rating).toBe('')
    }
  })
})

describe('E. la garantie 30 jours est CONSERVÉE et conforme aux CGV', () => {
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

describe('F. parité stricte des clés FR / EN / DE', () => {
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

describe('G. les remplacements s’appuient sur des faits vérifiables', () => {
  it('« 10 disciplines » correspond au registre réel', () => {
    // Seule allégation chiffrée conservée : elle est vraie.
    expect(DISCIPLINE_SLUGS).toHaveLength(10)
    expect(STATS.find(s => /Disciplines/i.test(s.label))?.value).toBe('10')
  })

  it('le nombre de programmes annoncé correspond au registre réel', () => {
    expect(BRAND.programs).toBe(9)
    expect(STATS.find(s => /Programmes/i.test(s.label))?.value).toBe('9')
  })

  it('les sections d’avis sont vides dans les trois langues', () => {
    for (const messages of Object.values(LOCALES)) {
      const avis = (messages as { home: { reviews: { items: unknown[]; results: unknown[] } } }).home.reviews

      expect(avis.items).toHaveLength(0)
      expect(avis.results).toHaveLength(0)
    }
  })
})
