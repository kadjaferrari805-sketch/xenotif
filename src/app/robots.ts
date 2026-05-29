import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/boutique', '/disciplines', '/contact'],
        disallow: ['/dashboard', '/admin', '/auth', '/api', '/boutique/panier'],
      },
    ],
    sitemap: 'https://xenotif.vercel.app/sitemap.xml',
    host: 'https://xenotif.vercel.app',
  }
}
