import type { MetadataRoute } from 'next'
import { DISCIPLINE_CONTENT } from '@/lib/disciplines'
import { PRODUCTS } from '@/lib/boutique/products'
import { getAllPosts } from '@/lib/blog/posts'
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
    ['/boutique', { changeFrequency: 'daily', priority: 0.9 }],
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
  ]
}
