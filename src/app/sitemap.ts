import type { MetadataRoute } from 'next'
import { DISCIPLINE_CONTENT } from '@/lib/disciplines'
import { PRODUCTS } from '@/lib/boutique/products'
import { getAllPosts } from '@/lib/blog/posts'
import { programSlugs, localesForProgram } from '@/lib/programs/registry'
import { exerciceSlugs, localesForExercice } from '@/lib/exercices/registry'
import { routing } from '@/i18n/routing'

const BASE_URL = 'https://xenotif.com'

type ChangeFreq = MetadataRoute.Sitemap[number]['changeFrequency']

// URL localisée : FR à la racine (locale par défaut), autres préfixées (/en…).
function localized(path: string, locale: string): string {
  const clean = path === '/' ? '' : path
  return locale === routing.defaultLocale ? `${BASE_URL}${clean}` : `${BASE_URL}/${locale}${clean}`
}

// Entrée sitemap avec les alternates hreflang pour chaque langue.
function entry(
  path: string,
  opts: { changeFrequency: ChangeFreq; priority: number; lastModified?: Date },
): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = {}
  for (const l of routing.locales) languages[l] = localized(path, l)
  return {
    url: localized(path, routing.defaultLocale),
    lastModified: opts.lastModified ?? new Date(),
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: { languages },
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths: Array<[string, { changeFrequency: ChangeFreq; priority: number }]> = [
    ['/', { changeFrequency: 'daily', priority: 1.0 }],
    ['/a-propos', { changeFrequency: 'monthly', priority: 0.6 }],
    ['/defis', { changeFrequency: 'weekly', priority: 0.7 }],
    ['/dashboard-preview', { changeFrequency: 'monthly', priority: 0.7 }],
    ['/boutique', { changeFrequency: 'daily', priority: 0.9 }],
    ['/boutique/catalogue', { changeFrequency: 'daily', priority: 0.8 }],
    ['/blog', { changeFrequency: 'weekly', priority: 0.9 }],
    ['/contact', { changeFrequency: 'yearly', priority: 0.5 }],
    ['/confidentialite', { changeFrequency: 'yearly', priority: 0.3 }],
    ['/mentions-legales', { changeFrequency: 'yearly', priority: 0.3 }],
    ['/conditions-generales-vente', { changeFrequency: 'yearly', priority: 0.3 }],
  ]

  return [
    ...staticPaths.map(([p, o]) => entry(p, o)),
    ...Object.keys(DISCIPLINE_CONTENT).map(slug =>
      entry(`/disciplines/${slug}`, { changeFrequency: 'monthly', priority: 0.8 }),
    ),
    ...PRODUCTS.map(p => entry(`/boutique/${p.slug}`, { changeFrequency: 'weekly', priority: 0.7 })),
    ...getAllPosts().map(post =>
      entry(`/blog/${post.slug}`, {
        changeFrequency: 'monthly',
        priority: 0.8,
        lastModified: new Date(post.publishedAt),
      }),
    ),
    // Programmes publics : hub + programmes, avec alternates hreflang par langue dispo.
    {
      url: `${BASE_URL}/programmes`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as ChangeFreq,
      priority: 0.8,
      alternates: { languages: { fr: `${BASE_URL}/programmes`, en: `${BASE_URL}/en/programmes`, de: `${BASE_URL}/de/programmes` } },
    },
    ...programSlugs().map(slug => {
      const languages: Record<string, string> = {}
      for (const l of localesForProgram(slug)) {
        languages[l] = l === 'fr' ? `${BASE_URL}/programmes/${slug}` : `${BASE_URL}/${l}/programmes/${slug}`
      }
      return {
        url: `${BASE_URL}/programmes/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as ChangeFreq,
        priority: 0.8,
        alternates: { languages },
      }
    }),
    // Exercices : hub + fiches, avec alternates hreflang par langue dispo.
    {
      url: `${BASE_URL}/exercices`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as ChangeFreq,
      priority: 0.7,
      alternates: { languages: { fr: `${BASE_URL}/exercices`, en: `${BASE_URL}/en/exercices`, de: `${BASE_URL}/de/exercices` } },
    },
    ...exerciceSlugs().map(slug => {
      const languages: Record<string, string> = {}
      for (const l of localesForExercice(slug)) {
        languages[l] = l === 'fr' ? `${BASE_URL}/exercices/${slug}` : `${BASE_URL}/${l}/exercices/${slug}`
      }
      return {
        url: `${BASE_URL}/exercices/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as ChangeFreq,
        priority: 0.6,
        alternates: { languages },
      }
    }),
  ]
}
